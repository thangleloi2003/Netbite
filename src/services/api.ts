import axios from "axios";

const API_BASE = "http://localhost:8888";

const api = axios.create({ baseURL: API_BASE });

import type { Product, Category, Combo, Order, User } from "../types";

// Simulated JWT Standard Logic (Header.Payload.Signature)
const TOKEN_KEY = "netbite_auth_token";
const SECRET_KEY = "netbite_secret_signature_key_2026"; 

/**
 * Hardware Simulation: Detects or assigns a fixed Machine ID for this specific browser/PC.
 */
const HARDWARE_ID_KEY = "netbite_physical_machine_id";
const getSimulatedHardwareId = (): string => {
  let hardwareId = localStorage.getItem(HARDWARE_ID_KEY);
  if (!hardwareId) {
    // Simulate assigning a machine ID from a pool (e.g., Zone A, B, C)
    const zones = ["A", "B", "C", "VIP"];
    const zone = zones[Math.floor(Math.random() * zones.length)];
    const num = Math.floor(Math.random() * 20) + 1;
    hardwareId = `${zone}-${num.toString().padStart(2, "0")}`;
    localStorage.setItem(HARDWARE_ID_KEY, hardwareId);
  }
  return hardwareId;
};

/**
 * Base64Url Encoding (Standard for JWT)
 */
const base64UrlEncode = (str: string) => {
  return btoa(str)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/**
 * Base64Url Decoding
 */
const base64UrlDecode = (str: string) => {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return atob(str);
};

/**
 * Simple Signature Generator (Mock HMAC-SHA256)
 * In a real JWT, this would be a cryptographic hash.
 */
const createSignature = (header: string, payload: string) => {
  const data = `${header}.${payload}.${SECRET_KEY}`;
  // For simulation, we create a pseudo-hash by b64 encoding the data string
  return base64UrlEncode(data);
};

const generateSimulatedJWT = (user: User) => {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const payload = JSON.stringify({
    sub: user.id,
    username: user.username,
    role: user.role,
    machineId: user.machineId,
    isGuest: user.isGuest,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  });

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signature = createSignature(encodedHeader, encodedPayload);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const verifySimulatedJWT = (token: string): { id: string; role: string; machineId?: string; isGuest?: boolean } | null => {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;

    // Verify Signature
    const expectedSignature = createSignature(header, payload);
    if (signature !== expectedSignature) {
      console.warn("Invalid JWT Signature detected");
      return null;
    }

    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    
    // Check Expiration
    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      console.warn("JWT has expired");
      return null;
    }

    return { 
      id: decodedPayload.sub, 
      role: decodedPayload.role,
      machineId: decodedPayload.machineId,
      isGuest: decodedPayload.isGuest
    };
  } catch (e) {
    return null;
  }
};

// Axios interceptor for authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle session invalidation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If the server returns a 404 for a user request, it might mean the user was deleted
    if (error.config?.url?.includes('/users/') && error.response?.status === 404) {
      console.error("User no longer exists, clearing session");
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  getAllUsers: () => api.get<User[]>("/users").then((r) => r.data),
  
  /**
   * Internal helper to ensure a machine ID is only used by one account at a time.
   * If another user is at this machine, they are "unbound" from it.
   */
  _claimMachineId: async (userId: string, machineId: string) => {
    const allUsers = await api.get<User[]>("/users").then(r => r.data);
    const otherUserAtMachine = allUsers.find(u => u.machineId === machineId && u.id !== userId);
    
    if (otherUserAtMachine) {
      // "Unbind" the previous user from this machine
      await api.patch(`/users/${otherUserAtMachine.id}`, { machineId: null });
    }
    
    return api.patch<User>(`/users/${userId}`, { machineId }).then(r => r.data);
  },

  login: (credentials: Pick<User, "username" | "password">) =>
    api
      .get<User[]>("/users", { params: { username: credentials.username } })
      .then(async (r) => {
        const user = r.data.find((u) => u.password === credentials.password);
        if (!user) throw new Error("Tài khoản hoặc mật khẩu không chính xác");
        
        if (user.status === "inactive") {
          throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }

        let updatedUser = user;
        
        // Only customers (and guests) are bound to a physical machine ID.
        // Admins have global access and don't "claim" a station.
        if (user.role !== "admin") {
          const machineId = getSimulatedHardwareId();
          updatedUser = await authApi._claimMachineId(user.id, machineId);
        }

        const token = generateSimulatedJWT(updatedUser);
        localStorage.setItem(TOKEN_KEY, token);

        const { password: _password, ...userWithoutPassword } = updatedUser;
        return { user: userWithoutPassword, token };
      }),

  guestAccess: async () => {
    const machineId = getSimulatedHardwareId();
    
    // Check if there's already an active guest for this machine to reuse or create new
    const allUsers = await api.get<User[]>("/users").then(r => r.data);
    let guestUser = allUsers.find(u => u.machineId === machineId && u.isGuest);

    if (!guestUser) {
      const newGuest: Omit<User, "id"> = {
        username: `guest_${Date.now()}`,
        name: `Khách máy ${machineId}`,
        role: "customer",
        status: "active",
        machineId,
        isGuest: true
      };
      // Ensure exclusivity even for new guests
      const created = await api.post<User>("/users", newGuest).then(r => r.data);
      guestUser = await authApi._claimMachineId(created.id, machineId);
    } else {
      // Ensure the existing guest at this machine is active
      guestUser = await authApi._claimMachineId(guestUser.id, machineId);
    }

    const token = generateSimulatedJWT(guestUser);
    localStorage.setItem(TOKEN_KEY, token);
    return { user: guestUser, token };
  },

  verifyToken: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    const decoded = verifySimulatedJWT(token);
    if (!decoded) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    
    try {
      const user = await api.get<User>(`/users/${decoded.id}`).then((r) => r.data);
      
      if (user.status === "inactive") {
        console.warn("User account is inactive, clearing session");
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }

      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (e: any) {
      // Handle server restart/network error (ECONNREFUSED or no response)
      const isNetworkError = !e.response && (e.code === 'ECONNREFUSED' || e.message === 'Network Error' || !e.status);
      
      if (isNetworkError) {
        console.warn("Server unreachable, maintaining session using token payload");
        // Return minimal user info from token to maintain session during restart
        return { 
          id: decoded.id, 
          role: decoded.role as "admin" | "customer",
          username: "Session", 
          name: "User",
          machineId: decoded.machineId,
          isGuest: decoded.isGuest,
          status: "active" // Assume active if we can't check
        } as User;
      }
      
      // If it's a 404 or other actual API error, the token is stale
      console.error("Token verification failed (Stale/Invalid):", e.message);
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  logout: async (userId?: string) => {
    if (userId) {
      try {
        await api.patch(`/users/${userId}`, { machineId: null });
      } catch (e) {
        console.warn("Could not unbind machine during logout (server might be down)");
      }
    }
    localStorage.removeItem(TOKEN_KEY);
  },

  updateUser: (id: string, data: Partial<User>) => 
    api.patch<User>(`/users/${id}`, data).then((r) => r.data),

  createUser: (user: Omit<User, "id">) =>
    api.post<User>("/users", { ...user, status: "active" }).then((r) => r.data),

  deleteUser: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
};

export const productApi = {
  getAll: (params?: { category?: string }) =>
    api.get<Product[]>("/products", { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`).then((r) => r.data),

  getFeatured: () =>
    api
      .get<Product[]>("/products", { params: { _limit: 4 } })
      .then((r) => r.data),

  create: (product: Omit<Product, "id">) =>
    api.post<Product>("/products", product).then((r) => r.data),

  update: (id: string, product: Partial<Product>) =>
    api.patch<Product>(`/products/${id}`, product).then((r) => r.data),

  delete: (id: string) => api.delete(`/products/${id}`).then((r) => r.data),
};

export const categoryApi = {
  getAll: () => api.get<Category[]>("/categories").then((r) => r.data),
};

export const comboApi = {
  getAll: () => api.get<Combo[]>("/combos").then((r) => r.data),
};

export const orderApi = {
  getAll: () => api.get<Order[]>("/orders").then((r) => r.data),

  getByUserId: (userId: string) =>
    api.get<Order[]>("/orders", { params: { userId } }).then((r) => r.data),

  create: (order: Omit<Order, "id">) =>
    api.post<Order>("/orders", order).then((r) => r.data),
    
  update: (id: string, order: Partial<Order>) =>
    api.patch<Order>(`/orders/${id}`, order).then((r) => r.data),
};

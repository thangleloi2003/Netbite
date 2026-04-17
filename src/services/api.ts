import axios from "axios";

const API_BASE = "http://localhost:8888";

const api = axios.create({ baseURL: API_BASE });

import type { Product, Category, Combo, Order, User } from "../types";

// Simulated JWT Standard Logic (Header.Payload.Signature)
const TOKEN_KEY = "netbite_auth_token";
const SECRET_KEY = "netbite_secret_signature_key_2026"; 

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
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
  });

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signature = createSignature(encodedHeader, encodedPayload);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

const verifySimulatedJWT = (token: string): { id: string; role: string } | null => {
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

    return { id: decodedPayload.sub, role: decodedPayload.role };
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

export const authApi = {
  getAllUsers: () => api.get<User[]>("/users").then((r) => r.data),
  
  login: (credentials: Pick<User, "username" | "password">) =>
    api
      .get<User[]>("/users", { params: { username: credentials.username } })
      .then((r) => {
        const user = r.data.find((u) => u.password === credentials.password);
        if (!user) throw new Error("Tài khoản hoặc mật khẩu không chính xác");
        
        const token = generateSimulatedJWT(user);
        localStorage.setItem(TOKEN_KEY, token);

        const { password: _password, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
      }),

  register: (user: Omit<User, "id">) =>
    api.post<User>("/users", user).then((r) => {
      const token = generateSimulatedJWT(r.data);
      localStorage.setItem(TOKEN_KEY, token);

      const { password: _password, ...userWithoutPassword } = r.data;
      return { user: userWithoutPassword, token };
    }),

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
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (e: any) {
      // Handle server restart/network error
      if (!e.response && !e.status) {
        console.warn("Server unreachable, using token payload as fallback session");
        // Return minimal user info from token to maintain session during restart
        return { 
          id: decoded.id, 
          role: decoded.role as "admin" | "customer",
          username: "Session", 
          name: "User" 
        } as User;
      }
      
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  updateUser: (id: string, data: Partial<User>) => 
    api.patch<User>(`/users/${id}`, data).then((r) => r.data),

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

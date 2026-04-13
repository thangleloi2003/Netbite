import axios from "axios";

const API_BASE = "http://localhost:8888";

const api = axios.create({ baseURL: API_BASE });

import type { Product, Category, Combo, Order, User } from "../types";

export const authApi = {
  getAllUsers: () => api.get<User[]>("/users").then((r) => r.data),
  
  login: (credentials: Pick<User, "username" | "password">) =>
    api
      .get<User[]>("/users", { params: { username: credentials.username } })
      .then((r) => {
        const user = r.data.find((u) => u.password === credentials.password);
        if (!user) throw new Error("Tài khoản hoặc mật khẩu không chính xác");
        const { password: _password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),

  register: (user: Omit<User, "id">) =>
    api.post<User>("/users", user).then((r) => {
      const { password: _password, ...userWithoutPassword } = r.data;
      return userWithoutPassword;
    }),
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

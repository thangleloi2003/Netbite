import axios from "axios";

const API_BASE = "http://localhost:8888";

const api = axios.create({ baseURL: API_BASE });

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  images: string[];
  category: string;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  calories: number;
  protein: number;
  fat: number;
  badges: { icon: string; label: string }[];
  toppings: {
    id: string;
    label: string;
    price: number;
    icon: string;
    type: "level" | "binary" | "quantifiable";
    options?: string[];
  }[];
  relatedIds: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
}

export interface Combo {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  borderColor: string;
  badge?: string;
  discount: string;
  discountColor: string;
  items: string[];
  productIds?: string[];
  price: number;
  originalPrice: number;
  buttonStyle: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  date: string;
  machineNumber: string;
}

export const productApi = {
  getAll: (params?: { category?: string }) =>
    api.get<Product[]>("/products", { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Product>(`/products/${id}`).then((r) => r.data),

  getFeatured: () =>
    api
      .get<Product[]>("/products", { params: { _limit: 4 } })
      .then((r) => r.data),
};

export const categoryApi = {
  getAll: () => api.get<Category[]>("/categories").then((r) => r.data),
};

export const comboApi = {
  getAll: () => api.get<Combo[]>("/combos").then((r) => r.data),
};

export const orderApi = {
  getByUserId: (userId: string) =>
    api.get<Order[]>("/orders", { params: { userId } }).then((r) => r.data),

  create: (order: Omit<Order, "id">) =>
    api.post<Order>("/orders", order).then((r) => r.data),
};

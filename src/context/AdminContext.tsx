import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { productApi, categoryApi, orderApi, authApi } from "../services/api";
import type { Product, Category, Order, User } from "../types";

interface AdminContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  users: User[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<Order>;
  deleteUser: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, categoriesData, ordersData, usersData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
        orderApi.getAll(),
        authApi.getAllUsers(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setOrders([...ordersData].reverse()); // ✅ FIXED
      setUsers(usersData);
    } catch (err) {
      console.error("Admin data fetch error:", err);
      setError("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateProduct = async (id: string, data: Partial<Product>) => {
    try {
      setActionLoading(true);
      const updated = await productApi.update(id, data);
      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      return updated;
    } catch (err) {
      console.error("Update product failed:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setActionLoading(true);
      await productApi.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error("Delete product failed:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updateOrder = async (id: string, data: Partial<Order>) => {
    try {
      setActionLoading(true);
      const updated = await orderApi.update(id, data);
      setOrders(prev => prev.map(o => (o.id === id ? updated : o)));
      return updated;
    } catch (err) {
      console.error("Update order failed:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setActionLoading(true);
      await authApi.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      console.error("Delete user failed:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const value: AdminContextType = {
    products,
    categories,
    orders,
    users,
    loading,
    actionLoading,
    error,
    refreshData: fetchData,
    updateProduct,
    deleteProduct,
    updateOrder,
    deleteUser,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
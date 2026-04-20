import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { productApi, categoryApi, orderApi, authApi, comboApi } from "../services/api";
import type { Product, Category, Order, User, Combo } from "../types";

interface AdminContextType {
  products: Product[];
  categories: Category[];
  combos: Combo[];
  orders: Order[];
  users: User[];
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<Order>;
  createUser: (data: Omit<User, "id">) => Promise<User>;
  updateUser: (id: string, data: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      setError(null);

      const [productsData, categoriesData, combosData, ordersData, usersData] = await Promise.all([
        productApi.getAll(),
        categoryApi.getAll(),
        comboApi.getAll(),
        orderApi.getAll(),
        authApi.getAllUsers(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      setCombos(combosData);
      setOrders([...ordersData].reverse()); 
      setUsers(usersData);
    } catch (err) {
      console.error("Admin data fetch error:", err);
      if (!isBackground) setError("Failed to fetch admin data");
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Set up real-time polling (every 5 seconds)
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(interval);
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

  const createUser = async (data: Omit<User, "id">) => {
    try {
      setActionLoading(true);
      const created = await authApi.createUser(data);
      setUsers(prev => [...prev, created]);
      return created;
    } catch (err) {
      console.error("Create user failed:", err);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      setActionLoading(true);
      const updated = await authApi.updateUser(id, data);
      setUsers(prev => prev.map(u => (u.id === id ? updated : u)));
      return updated;
    } catch (err) {
      console.error("Update user failed:", err);
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
    combos,
    orders,
    users,
    loading,
    actionLoading,
    error,
    refreshData: fetchData,
    updateProduct,
    deleteProduct,
    updateOrder,
    createUser,
    updateUser,
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
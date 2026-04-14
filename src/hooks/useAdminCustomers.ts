import { useState, useEffect, useMemo } from "react";
import { authApi, orderApi } from "../services/api";
import type { User, Order } from "../types";

export function useAdminCustomers() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, ordersData] = await Promise.all([
        authApi.getAllUsers(),
        orderApi.getAll()
      ]);
      setUsers(usersData.filter(u => u.role !== 'admin'));
      setOrders(ordersData);
    } catch (err) {
      setError("Failed to fetch customers");
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const getCustomerTotalSpend = (userId: string) => {
    return orders
      .filter(o => o.userId === userId && o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
  };

  const deleteUser = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản người dùng này?")) {
      try {
        await authApi.deleteUser(id);
        setUsers(prev => prev.filter(u => u.id !== id));
        return true;
      } catch (err) {
        setError("Failed to delete user");
        console.error("Failed to delete user:", err);
        return false;
      }
    }
    return false;
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                            u.username.toLowerCase().includes(search.toLowerCase());
                            
      return matchesSearch;
    });
  }, [users, search]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, page]);

  return {
    users,
    filteredUsers,
    paginatedUsers,
    loading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    getCustomerTotalSpend,
    deleteUser,
    refreshCustomers: fetchData,
  };
}

import { useState, useEffect, useMemo } from "react";
import { orderApi, authApi } from "../services/api";
import type { Order, User } from "../types";

export type OrderFilterStatus = "all" | "pending" | "processing" | "delivered" | "cancelled";

export function useAdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<OrderFilterStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersData, usersData] = await Promise.all([
        orderApi.getAll(),
        authApi.getAllUsers()
      ]);
      setOrders(ordersData.reverse());
      setUsers(usersData);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const updateOrderStatus = async (id: string, nextStatus: Order["status"]) => {
    try {
      const updatedOrder = await orderApi.update(id, { status: nextStatus });
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
      return true;
    } catch (err) {
      setError("Failed to update order status");
      console.error("Failed to update order status:", err);
      return false;
    }
  };

  const cancelOrder = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return await updateOrderStatus(id, "cancelled");
    }
    return false;
  };

  const getUser = (userId: string) => users.find(u => u.id === userId);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesFilter = filter === "all" || o.status === filter;
      const user = getUser(o.userId);
      const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                            user?.name.toLowerCase().includes(search.toLowerCase()) ||
                            o.machineNumber?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search, users]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, page]);

  const todayOrdersCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return orders.filter(o => {
      return o.date === today || o.date.startsWith(today);
    }).length;
  }, [orders]);

  return {
    orders,
    filteredOrders,
    paginatedOrders,
    users,
    loading,
    error,
    filter,
    setFilter,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    todayOrdersCount,
    getUser,
    updateOrderStatus,
    cancelOrder,
    refreshOrders: fetchData,
  };
}

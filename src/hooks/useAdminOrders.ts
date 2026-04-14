import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../context/AdminContext";
import type { Order } from "../types";

export type OrderFilterStatus = "all" | "pending" | "processing" | "delivered" | "cancelled";

export function useAdminOrders() {
  const { 
    orders, 
    users, 
    loading, 
    error, 
    updateOrder: contextUpdateOrder,
    refreshData 
  } = useAdmin();

  const [filter, setFilter] = useState<OrderFilterStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

  const updateOrderStatus = async (id: string, nextStatus: Order["status"]) => {
    try {
      await contextUpdateOrder(id, { status: nextStatus });
      return true;
    } catch (err) {
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
    updateOrderStatus,
    cancelOrder,
    getUser,
    todayOrdersCount,
    refreshOrders: refreshData,
  };
}

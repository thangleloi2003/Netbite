import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../context/AdminContext";
import type { Order } from "../types";

export type OrderFilterStatus = "all" | "pending" | "processing" | "delivered" | "cancelled" | "guest";

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
      const user = getUser(o.userId);
      const matchesFilter = filter === "all" 
        ? true 
        : filter === "guest" 
          ? user?.isGuest === true 
          : o.status === filter;
      
      const matchesSearch = o.id.toLowerCase().includes(search.toLowerCase()) || 
                            user?.name.toLowerCase().includes(search.toLowerCase()) ||
                            o.machineNumber?.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search, users]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, page]);

  const todayOrdersCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    return orders.filter(o => {
      
      // So sánh chuẩn xác, cả 2 định dạng: YYYY-MM-DD và ISO đầy đủ
      const orderDate = o.date?.split("T")[0];
      return orderDate === today;
    }).length;
  }, [orders]);

  const machinePopularity = useMemo(() => {
    const stats: Record<string, number> = {};
    orders.forEach(o => {
      if (o.machineNumber) {
        stats[o.machineNumber] = (stats[o.machineNumber] || 0) + 1;
      }
    });
    return Object.entries(stats)
      .map(([machine, count]) => ({ machine, count }))
      .filter(m => m.count > 5) // Only show machines with more than 5 orders
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 machines meeting criteria
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
    machinePopularity,
    refreshOrders: refreshData,
  };
}

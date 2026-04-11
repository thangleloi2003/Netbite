import { useState, useEffect, useMemo } from "react";
import { authApi, orderApi } from "../services/api";
import type { User, Order } from "../types";

export type CustomerRank = "all" | "vip" | "gold" | "silver";

export function useAdminCustomers() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<CustomerRank>("all");

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

  const getCustomerTotalSpend = (userId: string) => {
    return orders
      .filter(o => o.userId === userId && o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
  };

  const getCustomerRank = (spend: number) => {
    if (spend >= 5000000) return { name: "VIP", color: "tertiary-fixed-dim" };
    if (spend >= 2000000) return { name: "VÀNG", color: "secondary" };
    return { name: "BẠC", color: "slate-400" };
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (filter === "all") return true;
      const spend = getCustomerTotalSpend(u.id);
      const rank = getCustomerRank(spend).name.toLowerCase();
      if (filter === "vip" && rank === "vip") return true;
      if (filter === "gold" && rank === "vàng") return true;
      if (filter === "silver" && rank === "bạc") return true;
      return false;
    });
  }, [users, orders, filter]);

  return {
    users,
    filteredUsers,
    loading,
    error,
    filter,
    setFilter,
    getCustomerTotalSpend,
    getCustomerRank,
    refreshCustomers: fetchData,
  };
}

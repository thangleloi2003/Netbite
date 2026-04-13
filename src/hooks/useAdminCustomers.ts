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
  }, [filter, search]);

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
      const spend = getCustomerTotalSpend(u.id);
      const rank = getCustomerRank(spend).name.toLowerCase();
      
      const matchesFilter = filter === "all" || 
                            (filter === "vip" && rank === "vip") ||
                            (filter === "gold" && rank === "vàng") ||
                            (filter === "silver" && rank === "bạc");
      
      const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                            u.username.toLowerCase().includes(search.toLowerCase());
                            
      return matchesFilter && matchesSearch;
    });
  }, [users, orders, filter, search]);

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
    filter,
    setFilter,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    getCustomerTotalSpend,
    getCustomerRank,
    refreshCustomers: fetchData,
  };
}

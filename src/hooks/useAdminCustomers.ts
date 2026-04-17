import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../context/AdminContext";
import type { User } from "../types";

export function useAdminCustomers() {
  const { 
    users, 
    orders, 
    loading, 
    error, 
    createUser: contextCreateUser,
    updateUser: contextUpdateUser,
    refreshData 
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const itemsPerPage = 5;

  useEffect(() => {
    setPage(1);
  }, [search, filter]);

  const getCustomerTotalSpend = (userId: string) => {
    return orders
      .filter(o => o.userId === userId && o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
  };

  const getCustomerOrderCount = (userId: string) => {
    return orders.filter(o => o.userId === userId).length;
  };

  const toggleUserStatus = async (id: string, currentStatus: User["status"]) => {
    const nextStatus: User["status"] = currentStatus === "active" ? "inactive" : "active";
    try {
      await contextUpdateUser(id, { status: nextStatus });
      return true;
    } catch (err) {
      console.error("Failed to toggle user status:", err);
      return false;
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const searchLower = search.toLowerCase();
      const matchesSearch = u.name.toLowerCase().includes(searchLower) || 
                            u.username.toLowerCase().includes(searchLower) ||
                            (u.machineId && u.machineId.toLowerCase().includes(searchLower));
      
      const matchesFilter = filter === "all" || u.status === filter;
                            
      return u.role !== 'admin' && matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

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
    filter,
    setFilter,
    page,
    setPage,
    totalPages,
    getCustomerTotalSpend,
    getCustomerOrderCount,
    toggleUserStatus,
    createUser: contextCreateUser,
    refreshCustomers: refreshData,
  };
}

import { useState, useEffect, useMemo } from "react";
import { useAdmin } from "../context/AdminContext";

export function useAdminCustomers() {
  const { 
    users, 
    orders, 
    loading, 
    error, 
    deleteUser: contextDeleteUser,
    refreshData 
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

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
        await contextDeleteUser(id);
        return true;
      } catch (err) {
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
                            
      return u.role !== 'admin' && matchesSearch;
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
    refreshCustomers: refreshData,
  };
}

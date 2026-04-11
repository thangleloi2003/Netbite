import { useCallback } from "react";

export function useFormat() {
  const formatPrice = useCallback((p: number) => {
    return p.toLocaleString("vi-VN") + "đ";
  }, []);

  const getInitials = useCallback((name: string) => {
    if (!name) return "NA";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }, []);

  return {
    formatPrice,
    getInitials,
  };
}

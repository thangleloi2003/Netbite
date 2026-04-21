import { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { orderApi } from "../services/api";
import type { Order } from "../types";

export default function OrderStatusNotification() {
  const { user, isAuthenticated } = useAuth();
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role === "admin") {
      setActiveOrders([]);
      return;
    }

    const checkOrders = async () => {
      try {
        const orders = await orderApi.getByUserId(user.id);
        // Only show orders that are NOT delivered or cancelled
        const currentActiveOrders = orders.filter(
          (o) => o.status !== "delivered" && o.status !== "cancelled"
        );
        setActiveOrders(currentActiveOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    // Initial check
    checkOrders();

    // Poll every 10 seconds
    const interval = setInterval(checkOrders, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // Handle case where user logs out - the useEffect above will trigger and set activeOrders to []
  // but we also want to be defensive if needed.
  
  if (activeOrders.length === 0) return null;

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Chờ xử lý",
          color: "secondary",
          icon: "schedule",
        };
      case "processing":
        return {
          label: "Đang chuẩn bị",
          color: "primary",
          icon: "restaurant",
        };
      default:
        return {
          label: "Đang chuẩn bị",
          color: "primary",
          icon: "restaurant",
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-4">
      {activeOrders.map((order) => {
        const { label, color, icon } = formatStatus(order.status);
        return (
          <div
            key={order.id}
            className={`bg-surface-container-highest border border-${color}/30 p-5 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-4 w-[350px] animate-slide-up`}
          >
            <div
              className={`w-12 h-12 rounded-full bg-${color}/20 flex items-center justify-center shrink-0`}
            >
              <span
                className={`material-symbols-outlined text-${color} text-[28px] ${order.status === "pending" ? "animate-pulse" : "animate-bounce"}`}
              >
                {icon}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-black text-white tracking-tight">
                {label}
              </h4>
              <p className="text-xs font-medium text-on-surface-variant mt-0.5">
                Mã đơn: <span className={`text-${color} font-bold`}>#{order.id}</span> • Đang chuẩn bị cho bạn.
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { useState } from "react";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useFormat } from "../../hooks/useFormat";
import type { Order } from "../../types";

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    filteredOrders,
    paginatedOrders,
    loading,
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
    machinePopularity,
  } = useAdminOrders();

  const { formatPrice, getInitials } = useFormat();

  const handleStatusChange = async (
    id: string,
    currentStatus: Order["status"],
  ) => {
    let nextStatus: Order["status"] = currentStatus;
    if (currentStatus === "pending") nextStatus = "processing";
    else if (currentStatus === "processing") nextStatus = "delivered";
    else return;

    await updateOrderStatus(id, nextStatus);
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-secondary/10 text-secondary uppercase tracking-widest border border-secondary/30 animate-pulse whitespace-nowrap">
            Chờ xử lý
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-widest border border-primary/30 whitespace-nowrap">
            Đang chuẩn bị
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-green-500/10 text-green-400 uppercase tracking-widest border border-green-500/20 whitespace-nowrap">
            Hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-error/10 text-error uppercase tracking-widest border border-error/20 whitespace-nowrap">
            Đã hủy
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">
            QUẢN LÝ ĐƠN HÀNG
          </h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">
            Giám sát và xử lý đơn hàng theo thời gian thực.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-all duration-300 scale-90 group-focus-within:scale-110">
              search
            </span>
            <input
              type="text"
              placeholder="Mã đơn, tên khách, số máy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-surface-container-low border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface-container transition-all font-bold text-sm w-full sm:w-72 placeholder:text-on-surface-variant/40"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl border transition-all font-black text-xs uppercase tracking-widest ${
                isFilterOpen 
                ? "bg-primary text-on-primary border-primary shadow-[0_0_20px_rgba(255,141,140,0.3)]" 
                : "bg-surface-container-low border-white/5 text-on-surface hover:bg-white/5"
              }`}
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              {filter === "all" ? "Tất cả đơn" : 
               filter === "pending" ? "Chờ xử lý" :
               filter === "processing" ? "Đang chuẩn bị" :
               filter === "delivered" ? "Hoàn thành" :
               filter === "guest" ? "Khách vãng lai" : "Lọc đơn"}
              <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`}>keyboard_arrow_down</span>
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setIsFilterOpen(false)}></div>
                <div className="absolute top-full right-0 mt-2 w-56 bg-surface-container-high border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[70] animate-in fade-in zoom-in duration-200 origin-top-right">
                  <div className="p-2 space-y-1">
                    {[
                      { id: "all", label: "Tất cả đơn", icon: "reorder", color: "text-on-surface" },
                      { id: "pending", label: "Chờ xử lý", icon: "schedule", color: "text-secondary" },
                      { id: "processing", label: "Đang chuẩn bị", icon: "restaurant", color: "text-primary" },
                      { id: "delivered", label: "Hoàn thành", icon: "check_circle", color: "text-green-400" },
                      { id: "guest", label: "Khách vãng lai", icon: "person_search", color: "text-secondary" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setFilter(item.id as any);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold ${
                          filter === item.id 
                          ? "bg-white/10 text-white" 
                          : "text-on-surface-variant hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className={`material-symbols-outlined text-lg ${item.color}`}>{item.icon}</span>
                        {item.label}
                        {filter === item.id && (
                          <span className="material-symbols-outlined text-sm ml-auto text-primary">check</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Machine Popularity Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="md:col-span-2 lg:col-span-1 bg-surface-container-low p-5 rounded-3xl border border-white/5 flex flex-col justify-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Máy/Bàn phổ biến</h3>
          <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase italic">Trên 5 đơn hàng</p>
        </div>
        {machinePopularity.length > 0 ? (
          machinePopularity.map((stat, idx) => (
            <div key={stat.machine} className="bg-surface-container-low p-4 rounded-2xl border border-white/5 hover:border-secondary/30 transition-all group relative overflow-hidden">
              <div className="absolute -right-2 -bottom-2 text-4xl font-black text-white/5 group-hover:text-secondary/10 transition-colors">#{idx + 1}</div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary text-xl">desktop_windows</span>
                </div>
                <div>
                  <p className="text-sm font-black text-on-surface group-hover:text-secondary transition-colors truncate max-w-[80px]">{stat.machine}</p>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">{stat.count} đơn hàng</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 bg-surface-container-low p-4 rounded-2xl border border-dashed border-white/10 flex items-center justify-center italic text-on-surface-variant text-xs gap-3">
            <span className="material-symbols-outlined text-sm">info</span>
            Chưa có máy nào đạt trên 5 đơn hàng
          </div>
        )}
      </section>

      {/* Orders Table */}
      <section className="bg-surface-container-low rounded-3xl overflow-hidden border border-white/5 shadow-xl">
        <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-surface-container/50">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Danh sách đơn hàng
            </h2>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mt-1">
              {todayOrdersCount} đơn trong ngày
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-highest/30">
                <th className="w-[14%] px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Mã Đơn
                </th>
                <th className="w-[18%] px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Khách hàng
                </th>
                <th className="w-[27%] px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Nội dung
                </th>
                <th className="w-[12%] px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Tổng tiền
                </th>
                <th className="w-[13%] px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
                  Trạng thái
                </th>
                <th className="w-[16%] px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-8 text-center text-on-surface-variant font-medium"
                  >
                    Đang tải dữ liệu đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-8 text-center text-on-surface-variant font-medium"
                  >
                    Không có đơn hàng nào.
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const user = getUser(order.userId);
                  const userName = user?.name || "Khách Vãng Lai";

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-surface-container-high transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6 text-sm font-mono text-primary font-black">
                        #{order.id}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-black text-secondary border border-secondary/30">
                            {getInitials(userName)}
                          </div>
                          <div>
                            <span className="text-sm font-bold block">
                              {userName}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                                {order.machineNumber || "N/A"}
                              </span>
                              {user?.isGuest && (
                                <span className="bg-secondary/10 text-secondary text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm border border-secondary/20 tracking-tighter">GUEST</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm text-on-surface-variant font-medium">
                            {order.items.length > 0 ? (
                              <>
                                <span className="font-bold text-on-surface">
                                  {order.items[0].productName}
                                </span>
                                <span className="text-primary ml-1">
                                  x{order.items[0].quantity}
                                </span>
                                {order.items.length > 1 && (
                                  <span className="ml-1 italic">
                                    ...và {order.items.length - 1} món khác
                                  </span>
                                )}
                              </>
                            ) : (
                              "Không có món"
                            )}
                          </div>
                          {order.note && (
                            <div className="flex items-start gap-1.5 mt-1 bg-secondary/5 border border-secondary/10 px-3 py-1.5 rounded-xl w-fit max-w-[200px]">
                              <span className="material-symbols-outlined text-secondary text-sm shrink-0 mt-0.5">edit_note</span>
                              <span className="text-[10px] font-bold text-secondary leading-tight italic line-clamp-2">
                                {order.note}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-on-surface text-lg tracking-tighter">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-8 py-6">
                        {formatStatus(order.status)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {order.status !== "delivered" && order.status !== "cancelled" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(order.id, order.status);
                              }}
                              className={`h-10 px-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${
                                 order.status === "pending"
                                   ? "bg-primary text-on-primary shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                                   : "bg-green-500 text-white shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5"
                               }`}
                             >
                               <span className="material-symbols-outlined text-[16px]">
                                 {order.status === "pending" ? "play_arrow" : "done_all"}
                               </span>
                               {order.status === "pending" ? "Chuẩn bị" : "Hoàn thành"}
                             </button>
                          )}
                          
                          {order.status === "pending" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelOrder(order.id);
                              }}
                              className="w-10 h-10 shrink-0 flex items-center justify-center bg-surface-container-highest text-on-surface-variant rounded-full hover:bg-error hover:text-white transition-all border border-white/5 hover:border-error/50"
                              title="Hủy đơn"
                            >
                              <span className="material-symbols-outlined text-[18px]">
                                close
                              </span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-8 py-6 flex items-center justify-between border-t border-white/5 bg-surface-container/30">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Hiển thị {(page - 1) * 5 + 1}-
              {Math.min(page * 5, filteredOrders.length)} của{" "}
              {filteredOrders.length} đơn
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_left
                </span>
              </button>

              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
                      page === i + 1
                        ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]"
                        : "bg-surface-container hover:bg-surface-container-highest text-on-surface"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          ></div>
          <div className="bg-surface-container p-8 rounded-[40px] border border-white/10 shadow-2xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase">
                  Chi tiết đơn hàng
                </h3>
                <p className="text-primary font-mono font-bold mt-1">
                  #{selectedOrder.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-error hover:text-white transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-8">
              <div className="bg-surface-container-low p-6 rounded-3xl border border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">
                  Thông tin khách hàng
                </h4>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-lg font-black text-secondary border border-secondary/20">
                    {getInitials(getUser(selectedOrder.userId)?.name || "KV")}
                  </div>
                  <div>
                    <p className="font-black text-xl">
                      {getUser(selectedOrder.userId)?.name || "Khách Vãng Lai"}
                    </p>
                    <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">
                      Giao tới: {selectedOrder.machineNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-3xl border border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">
                  Món đã đặt
                </h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-3 border-b border-white/5 last:border-0"
                    >
                      <div>
                        <p className="font-black text-lg">
                          {item.productName}{" "}
                          <span className="text-primary ml-1">
                            x{item.quantity}
                          </span>
                        </p>
                        {item.toppings && item.toppings.length > 0 && (
                          <p className="text-xs text-on-surface-variant mt-1">
                            + {item.toppings.map((t) => t.label).join(", ")}
                          </p>
                        )}
                      </div>
                      <p className="font-black text-lg tracking-tighter">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">
                    Trạng thái
                  </p>
                  {formatStatus(selectedOrder.status)}
                </div>
                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">
                    Tổng cộng
                  </p>
                  <p className="text-4xl font-black text-primary tracking-tighter italic">
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                {(selectedOrder.status === "pending" ||
                  selectedOrder.status === "processing") && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(
                          selectedOrder.id,
                          selectedOrder.status,
                        );
                        setSelectedOrder(null);
                      }}
                      className="flex-1 py-4 bg-primary text-on-primary font-black rounded-2xl shadow-lg hover:-translate-y-1 transition-all uppercase tracking-widest"
                    >
                      {selectedOrder.status === "pending"
                        ? "Chuẩn bị ngay"
                        : "Hoàn thành & Giao"}
                    </button>
                    <button
                      onClick={() => {
                        cancelOrder(selectedOrder.id);
                        setSelectedOrder(null);
                      }}
                      className="px-8 py-4 bg-error/10 text-error font-black rounded-2xl hover:bg-error hover:text-white transition-all uppercase tracking-widest"
                    >
                      Hủy đơn
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

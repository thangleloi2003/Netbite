import { useState } from "react";
import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useFormat } from "../../hooks/useFormat";
import type { Order } from "../../types";

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
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
    cancelOrder 
  } = useAdminOrders();
  
  const { formatPrice, getInitials } = useFormat();

  const handleStatusChange = async (id: string, currentStatus: Order["status"]) => {
    let nextStatus: Order["status"] = currentStatus;
    if (currentStatus === "pending") nextStatus = "processing";
    else if (currentStatus === "processing") nextStatus = "delivered";
    else return;

    await updateOrderStatus(id, nextStatus);
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending": 
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-secondary/10 text-secondary uppercase tracking-widest border border-secondary/30 animate-pulse">Chờ xử lý</span>;
      case "processing": 
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-widest border border-primary/30">Đang chuẩn bị</span>;
      case "delivered": 
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-green-500/10 text-green-400 uppercase tracking-widest border border-green-500/20">Hoàn thành</span>;
      case "cancelled": 
        return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-error/10 text-error uppercase tracking-widest border border-error/20">Đã hủy</span>;
      default: 
        return status;
    }
  };

  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">QUẢN LÝ ĐƠN HÀNG</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Giám sát và xử lý đơn hàng theo thời gian thực.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Mã đơn, tên khách..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-surface-container-low border border-white/5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm w-full sm:w-64"
            />
          </div>

          <div className="bg-surface-container-low p-1.5 rounded-full border border-white/5 flex flex-wrap gap-1 shadow-inner max-w-full overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setFilter("all")}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${filter === "all" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}
            >Tất cả</button>
            <button 
              onClick={() => setFilter("pending")}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${filter === "pending" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,171,105,0.3)]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}
            >Chờ xử lý</button>
            <button 
              onClick={() => setFilter("processing")}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${filter === "processing" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}
            >Đang chuẩn bị</button>
            <button 
              onClick={() => setFilter("delivered")}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${filter === "delivered" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}
            >Hoàn thành</button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <section className="bg-surface-container-low rounded-3xl overflow-hidden border border-white/5 shadow-xl">
        <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-surface-container/50">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Danh sách đơn hàng</h2>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mt-1">{todayOrdersCount} đơn trong ngày</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-highest/30">
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Mã Đơn</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Khách hàng</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Nội dung</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tổng tiền</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Trạng thái</th>
                <th className="px-8 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-8 text-center text-on-surface-variant font-medium">Đang tải dữ liệu đơn hàng...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-8 text-center text-on-surface-variant font-medium">Không có đơn hàng nào.</td>
                </tr>
              ) : (
                paginatedOrders.map(order => {
                  const user = getUser(order.userId);
                  const userName = user?.name || "Khách Vãng Lai";
                  
                  return (
                    <tr 
                      key={order.id} 
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-surface-container-high transition-colors group cursor-pointer"
                    >
                      <td className="px-8 py-6 text-sm font-mono text-primary font-black">#{order.id}</td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-black text-secondary border border-secondary/30">
                            {getInitials(userName)}
                          </div>
                          <div>
                            <span className="text-sm font-bold block">{userName}</span>
                            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">{order.machineNumber || "N/A"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">
                        {order.items.length > 0 ? (
                          <>
                            <span className="font-bold text-on-surface">{order.items[0].productName}</span> 
                            <span className="text-primary ml-1">x{order.items[0].quantity}</span>
                            {order.items.length > 1 && <span className="ml-1 italic">...và {order.items.length - 1} món khác</span>}
                          </>
                        ) : "Không có món"}
                      </td>
                      <td className="px-8 py-6 text-sm font-black text-on-surface text-lg tracking-tighter">{formatPrice(order.total)}</td>
                      <td className="px-8 py-6">
                        {formatStatus(order.status)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {(order.status === "pending" || order.status === "processing") && (
                            <>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(order.id, order.status); }}
                                className="px-3 py-1.5 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-primary hover:text-on-primary transition-colors border border-primary/30"
                              >
                                {order.status === "pending" ? "Chuẩn bị" : "Giao hàng"}
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); cancelOrder(order.id); }}
                                className="px-3 py-1.5 bg-error/10 text-error text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-error hover:text-white transition-colors border border-error/20"
                              >
                                Hủy
                              </button>
                            </>
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
              Hiển thị {(page - 1) * 5 + 1}-{Math.min(page * 5, filteredOrders.length)} của {filteredOrders.length} đơn
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
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
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-surface-container p-8 rounded-[40px] border border-white/10 shadow-2xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase">Chi tiết đơn hàng</h3>
                <p className="text-primary font-mono font-bold mt-1">#{selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-error hover:text-white transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-8">
              <div className="bg-surface-container-low p-6 rounded-3xl border border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Thông tin khách hàng</h4>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-lg font-black text-secondary border border-secondary/20">
                    {getInitials(getUser(selectedOrder.userId)?.name || "KV")}
                  </div>
                  <div>
                    <p className="font-black text-xl">{getUser(selectedOrder.userId)?.name || "Khách Vãng Lai"}</p>
                    <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">Giao tới: {selectedOrder.machineNumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-6 rounded-3xl border border-white/5">
                <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Món đã đặt</h4>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="font-black text-lg">{item.productName} <span className="text-primary ml-1">x{item.quantity}</span></p>
                        {item.toppings && item.toppings.length > 0 && (
                          <p className="text-xs text-on-surface-variant mt-1">
                            + {item.toppings.map(t => t.label).join(", ")}
                          </p>
                        )}
                      </div>
                      <p className="font-black text-lg tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Trạng thái</p>
                  {formatStatus(selectedOrder.status)}
                </div>
                <div className="text-right">
                  <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-1">Tổng cộng</p>
                  <p className="text-4xl font-black text-primary tracking-tighter italic">{formatPrice(selectedOrder.total)}</p>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                {(selectedOrder.status === "pending" || selectedOrder.status === "processing") && (
                  <>
                    <button 
                      onClick={() => { handleStatusChange(selectedOrder.id, selectedOrder.status); setSelectedOrder(null); }}
                      className="flex-1 py-4 bg-primary text-on-primary font-black rounded-2xl shadow-lg hover:-translate-y-1 transition-all uppercase tracking-widest"
                    >
                      {selectedOrder.status === "pending" ? "Chuẩn bị ngay" : "Hoàn thành & Giao"}
                    </button>
                    <button 
                      onClick={() => { cancelOrder(selectedOrder.id); setSelectedOrder(null); }}
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
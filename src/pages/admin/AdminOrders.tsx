import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useFormat } from "../../hooks/useFormat";
import type { Order } from "../../types";

export default function AdminOrders() {
  const { 
    filteredOrders, 
    loading, 
    filter, 
    setFilter, 
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
      case "pending": return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-secondary/10 text-secondary uppercase tracking-widest border border-secondary/30 animate-pulse">Chờ xử lý</span>;
      case "processing": return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-widest border border-primary/30">Đang chuẩn bị</span>;
      case "delivered": return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-green-500/10 text-green-400 uppercase tracking-widest border border-green-500/20">Hoàn thành</span>;
      case "cancelled": return <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-error/10 text-error uppercase tracking-widest border border-error/20">Đã hủy</span>;
      default: return status;
    }
  };



  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">QUẢN LÝ ĐƠN HÀNG</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Giám sát và xử lý đơn hàng theo thời gian thực.</p>
        </div>

        <div className="bg-surface-container-low p-1.5 rounded-full border border-white/5 flex flex-wrap gap-1 shadow-inner max-w-full overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setFilter("all")}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${filter === "all" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}
          >Tất cả</button>
          <button 
            onClick={() => setFilter("pending")}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${filter === "pending" ? "bg-secondary text-on-secondary shadow-[0_0_15px_rgba(255,171,105,0.3)]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}
          >Chờ xử lý</button>
          <button 
            onClick={() => setFilter("processing")}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${filter === "processing" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}
          >Đang chuẩn bị</button>
          <button 
            onClick={() => setFilter("delivered")}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${filter === "delivered" ? "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}
          >Hoàn thành</button>
        </div>
      </div>

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
                  <td colSpan={6} className="px-8 py-8 text-center text-on-surface-variant">Đang tải dữ liệu...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-8 text-center text-on-surface-variant">Không có đơn hàng nào.</td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const user = getUser(order.userId);
                  const userName = user?.name || "Khách Vãng Lai";
                  
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-high transition-colors group cursor-pointer">
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
                            {order.items[0].productName} x{order.items[0].quantity}
                            {order.items.length > 1 && "..."}
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
      </section>
    </main>
  );
}

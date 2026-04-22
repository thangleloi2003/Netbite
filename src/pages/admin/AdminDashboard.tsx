import { useAdminOrders } from "../../hooks/useAdminOrders";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { useAdminCustomers } from "../../hooks/useAdminCustomers";
import { useFormat } from "../../hooks/useFormat";

export default function AdminDashboard() {
  const {
    orders,
    users,
    paginatedOrders,
    page,
    setPage,
    totalPages,
    loading: ordersLoading,
    todayOrdersCount,
    getUser,
  } = useAdminOrders();
  const { products, loading: productsLoading } = useAdminProducts();
  const { getCustomerTotalSpend, loading: customersLoading } = useAdminCustomers();
  const { formatPrice, getInitials } = useFormat();

  const loading = ordersLoading || productsLoading || customersLoading;

  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const activeUsersCount = users.filter(u => u.role !== 'admin' && !u.isGuest && u.status === 'active').length;

  const topProducts = products
    .map(p => {
      const salesCount = orders
        .filter(o => o.status !== "cancelled")
        .reduce((sum, o) => {
          const item = o.items.find(i => i.productName === p.name);
          return sum + (item ? item.quantity : 0);
        }, 0);
      return { ...p, salesCount };
    })
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);

  const topCustomers = users
    .filter(u => u.role !== 'admin' && !u.isGuest)
    .map(u => ({
      ...u,
      totalSpend: getCustomerTotalSpend(u.id)
    }))
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 5);

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending": return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-secondary/20 text-secondary uppercase tracking-widest border border-secondary/20 whitespace-nowrap">Đang chờ</span>;
      case "processing": return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-primary/20 text-primary uppercase tracking-widest border border-primary/20 whitespace-nowrap">Đang chuẩn bị</span>;
      case "delivered": return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-green-500/20 text-green-400 uppercase tracking-widest border border-green-500/20 whitespace-nowrap">Thành công</span>;
      case "cancelled": return <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-error/20 text-error uppercase tracking-widest border border-error/20 whitespace-nowrap">Đã hủy</span>;
      default: return status;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant">Đang tải dữ liệu...</div>;
  }

  return (
    <main className="p-8 pb-20 space-y-10 max-w-7xl mx-auto w-full min-h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic">BẢNG ĐIỀU KHIỂN</h2>
          <div className="h-1.5 w-16 bg-secondary mt-2 rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-primary hover:border-l-8 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-primary text-3xl">receipt_long</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-1">Đơn hàng hôm nay</p>
          <h3 className="text-4xl font-black text-on-surface">{todayOrdersCount}</h3>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-secondary hover:border-l-8 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-full bg-secondary/10">
              <span className="material-symbols-outlined text-secondary text-3xl">payments</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-1">Tổng doanh thu</p>
          <h3 className="text-4xl font-black text-on-surface">{formatPrice(totalRevenue).replace('đ', '')} <span className="text-lg text-on-surface-variant">đ</span></h3>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-tertiary-fixed-dim hover:border-l-8 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-full bg-tertiary-fixed-dim/10">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
          </div>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-1">Người dùng HĐ</p>
          <h3 className="text-4xl font-black text-on-surface">{activeUsersCount}</h3>
        </div>
      </div>

      <section className="bg-surface-container-low rounded-2xl overflow-hidden border border-white/5">
        <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-surface-container/50">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Đơn hàng mới nhất</h2>
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-high/30">
                <th className="w-[18%] px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">ID Đơn</th>
                <th className="w-[20%] px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Khách hàng</th>
                <th className="w-[37%] px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Món</th>
                <th className="w-[12%] px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tổng tiền</th>
                <th className="w-[13%] px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {paginatedOrders.map(order => {
                const user = getUser(order.userId);
                const userName = user?.name || "Khách Vãng Lai";

                return (
                  <tr key={order.id} className="hover:bg-surface-container-high transition-colors group cursor-pointer">
                    <td className="px-8 py-5 text-sm font-mono text-primary font-bold">#{order.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-black text-secondary">
                          {getInitials(userName)}
                        </div>
                        <span className="text-sm font-bold">{userName}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">
                      <div className="flex flex-col gap-1">
                        <div>
                          {order.items.length > 0 ? (
                            <>
                              {order.items[0].productName} x{order.items[0].quantity}
                              {order.items.length > 1 && "..."}
                            </>
                          ) : "Không có món"}
                        </div>
                        {order.note && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-secondary italic">
                            <span className="material-symbols-outlined text-[12px]">edit_note</span>
                            <span className="truncate max-w-[120px]">{order.note}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm font-black text-on-surface">{formatPrice(order.total)}</td>
                    <td className="px-8 py-5">
                      {formatStatus(order.status)}
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-8 text-center text-on-surface-variant">
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {orders.length > 0 && (
          <div className="px-8 py-6 flex items-center justify-between border-t border-white/5 bg-surface-container/30">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Hiển thị {(page - 1) * 5 + 1}-{Math.min(page * 5, orders.length)} của {orders.length} đơn
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface disabled:opacity-50"
                disabled={page === 1}
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${page === index + 1
                      ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]"
                      : "bg-surface-container hover:bg-surface-container-highest text-on-surface"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface disabled:opacity-50"
                disabled={page === totalPages}
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-surface-container-low rounded-2xl overflow-hidden border border-white/5 shadow-xl">
          <div className="px-8 py-6 border-b border-white/5 bg-surface-container/50">
            <h2 className="text-xl font-black tracking-tight">Sản phẩm bán chạy</h2>
          </div>
          <div className="p-4 space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container-high transition-all group">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-black text-xs text-on-surface-variant">
                  {i + 1}
                </div>
                <img src={p.image} className="w-12 h-12 rounded-xl object-cover" alt={p.name} />
                <div className="flex-grow">
                  <p className="font-black text-sm group-hover:text-primary transition-colors">{p.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{p.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-primary">{p.salesCount}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Đã bán</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-low rounded-2xl overflow-hidden border border-white/5 shadow-xl">
          <div className="px-8 py-6 border-b border-white/5 bg-surface-container/50">
            <h2 className="text-xl font-black tracking-tight">Khách hàng tiêu biểu</h2>
          </div>
          <div className="p-4 space-y-4">
            {topCustomers.map((u, i) => (
              <div key={u.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-surface-container-high transition-all group">
                <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center font-black text-xs text-on-surface-variant">
                  {i + 1}
                </div>
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-sm font-black text-secondary">
                  {getInitials(u.name)}
                </div>
                <div className="flex-grow">
                  <p className="font-black text-sm group-hover:text-secondary transition-colors">{u.name}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">@{u.username}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-on-surface">{formatPrice(u.totalSpend)}</p>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Tích lũy</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

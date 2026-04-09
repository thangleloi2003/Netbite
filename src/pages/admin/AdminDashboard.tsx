export default function AdminDashboard() {
  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
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
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +12%
            </span>
          </div>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-1">Đơn hàng hôm nay</p>
          <h3 className="text-4xl font-black text-on-surface">124</h3>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-secondary hover:border-l-8 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-full bg-secondary/10">
              <span className="material-symbols-outlined text-secondary text-3xl">payments</span>
            </div>
            <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +8.4%
            </span>
          </div>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-1">Tổng doanh thu</p>
          <h3 className="text-4xl font-black text-on-surface">5.4M <span className="text-lg text-on-surface-variant">đ</span></h3>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-tertiary-fixed-dim hover:border-l-8 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-full bg-tertiary-fixed-dim/10">
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
            </div>
            <span className="bg-error/20 text-error px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_down</span> -2%
            </span>
          </div>
          <p className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-1">Người dùng HĐ</p>
          <h3 className="text-4xl font-black text-on-surface">56</h3>
        </div>
      </div>

      <section className="bg-surface-container-low rounded-2xl overflow-hidden border border-white/5">
        <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-surface-container/50">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Đơn hàng mới nhất</h2>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mt-1">Cập nhật thời gian thực</p>
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high/30">
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">ID Đơn</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Khách hàng</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Món</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tổng tiền</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Trạng thái</th>
                <th className="px-8 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-surface-container-high transition-colors group cursor-pointer">
                <td className="px-8 py-5 text-sm font-mono text-primary font-bold">#NB-10294</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-black text-secondary">NA</div>
                    <span className="text-sm font-bold">Nguyễn An</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">Bún Chả Hà Nội x2...</td>
                <td className="px-8 py-5 text-sm font-black text-on-surface">145.000đ</td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-green-500/20 text-green-400 uppercase tracking-widest border border-green-500/20">Thành công</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-surface-container rounded-full hover:bg-primary hover:text-on-primary transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                    <button className="p-2 bg-surface-container rounded-full hover:bg-error hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-high transition-colors group cursor-pointer">
                <td className="px-8 py-5 text-sm font-mono text-primary font-bold">#NB-10293</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center text-xs font-black text-tertiary-fixed-dim">TV</div>
                    <span className="text-sm font-bold">Trần Văn</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">Phở Bò Đặc Biệt</td>
                <td className="px-8 py-5 text-sm font-black text-on-surface">85.000đ</td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-secondary/20 text-secondary uppercase tracking-widest border border-secondary/20">Đang chờ</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-surface-container rounded-full hover:bg-primary hover:text-on-primary transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                    <button className="p-2 bg-surface-container rounded-full hover:bg-error hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-high transition-colors group cursor-pointer">
                <td className="px-8 py-5 text-sm font-mono text-primary font-bold">#NB-10292</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-black text-primary">LH</div>
                    <span className="text-sm font-bold">Lê Hoa</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">Trà Đào Cam Sả x3</td>
                <td className="px-8 py-5 text-sm font-black text-on-surface">120.000đ</td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-green-500/20 text-green-400 uppercase tracking-widest border border-green-500/20">Thành công</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 bg-surface-container rounded-full hover:bg-primary hover:text-on-primary transition-colors"><span className="material-symbols-outlined text-sm">edit</span></button>
                    <button className="p-2 bg-surface-container rounded-full hover:bg-error hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 flex items-center justify-between border-t border-white/5 bg-surface-container/30">
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Hiển thị 1-10 của 124 đơn</p>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-on-primary font-black shadow-[0_0_15px_rgba(255,141,140,0.3)]">1</button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer font-bold text-on-surface">2</button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer font-bold text-on-surface">3</button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-highest transition-colors cursor-pointer text-on-surface">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

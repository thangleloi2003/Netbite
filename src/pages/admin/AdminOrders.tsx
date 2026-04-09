export default function AdminOrders() {
  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">QUẢN LÝ ĐƠN HÀNG</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Giám sát và xử lý đơn hàng theo thời gian thực.</p>
        </div>

        <div className="bg-surface-container-low p-1.5 rounded-full border border-white/5 flex flex-wrap gap-1 shadow-inner max-w-full overflow-x-auto no-scrollbar">
          <button className="px-5 py-2.5 bg-primary text-on-primary text-xs font-black rounded-full shadow-[0_0_15px_rgba(255,141,140,0.3)] transition-all uppercase tracking-wider whitespace-nowrap">Tất cả</button>
          <button className="px-5 py-2.5 text-secondary text-xs font-bold rounded-full hover:bg-white/5 transition-colors uppercase tracking-wider whitespace-nowrap">Chờ xử lý</button>
          <button className="px-5 py-2.5 text-on-surface-variant text-xs font-bold rounded-full hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider whitespace-nowrap">Đang giao</button>
          <button className="px-5 py-2.5 text-on-surface-variant text-xs font-bold rounded-full hover:text-white hover:bg-white/5 transition-colors uppercase tracking-wider whitespace-nowrap">Hoàn thành</button>
        </div>
      </div>

      <section className="bg-surface-container-low rounded-3xl overflow-hidden border border-white/5 shadow-xl">
        <div className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-surface-container/50">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Danh sách đơn hàng</h2>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mt-1">124 đơn trong ngày</p>
          </div>
          <button className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-full text-sm font-black hover:bg-white/10 transition-all flex items-center gap-2 active:scale-95 tracking-tight border border-white/5">
            <span className="material-symbols-outlined text-sm">filter_list</span> Bộ lọc
          </button>
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
              <tr className="hover:bg-surface-container-high transition-colors group cursor-pointer">
                <td className="px-8 py-6 text-sm font-mono text-primary font-black">#NB-10295</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-black text-secondary border border-secondary/30">HĐ</div>
                    <div>
                      <span className="text-sm font-bold block">Hoàng Đạt</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Máy VIP 05</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">Combo Leo Rank...</td>
                <td className="px-8 py-6 text-sm font-black text-on-surface text-lg tracking-tighter">85.000đ</td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-secondary/10 text-secondary uppercase tracking-widest border border-secondary/30 animate-pulse">Chờ xử lý</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2.5 bg-surface-container rounded-full hover:bg-primary hover:text-on-primary transition-colors border border-white/5"><span className="material-symbols-outlined text-sm">visibility</span></button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-high transition-colors group cursor-pointer">
                <td className="px-8 py-6 text-sm font-mono text-primary font-black">#NB-10294</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center text-xs font-black text-tertiary-fixed-dim border border-tertiary-fixed-dim/30">NA</div>
                    <div>
                      <span className="text-sm font-bold block">Nguyễn An</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Máy Thường 12</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">Bún Chả Hà Nội x2...</td>
                <td className="px-8 py-6 text-sm font-black text-on-surface text-lg tracking-tighter">145.000đ</td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-widest border border-primary/30">Đang giao</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2.5 bg-surface-container rounded-full hover:bg-primary hover:text-on-primary transition-colors border border-white/5"><span className="material-symbols-outlined text-sm">visibility</span></button>
                </td>
              </tr>
              <tr className="hover:bg-surface-container-high transition-colors group cursor-pointer opacity-80">
                <td className="px-8 py-6 text-sm font-mono text-on-surface-variant font-bold">#NB-10292</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-xs font-black text-on-surface-variant border border-white/10">LH</div>
                    <div>
                      <span className="text-sm font-bold block">Lê Hoa</span>
                      <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">Máy Stream 01</span>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">Trà Đào Cam Sả x3</td>
                <td className="px-8 py-6 text-sm font-black text-on-surface-variant text-lg tracking-tighter">120.000đ</td>
                <td className="px-8 py-6">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black bg-green-500/10 text-green-400 uppercase tracking-widest border border-green-500/20">Hoàn thành</span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="p-2.5 bg-surface-container rounded-full hover:bg-white/10 transition-colors border border-white/5"><span className="material-symbols-outlined text-sm text-on-surface-variant">visibility</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

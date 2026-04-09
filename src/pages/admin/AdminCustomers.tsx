export default function AdminCustomers() {
  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">QUẢN LÝ KHÁCH HÀNG</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Theo dõi hoạt động và phân cấp rank người chơi.</p>
        </div>

        <div className="bg-surface-container-low p-1.5 rounded-full border border-white/5 flex flex-wrap gap-1 shadow-inner">
          <button className="px-5 py-2.5 bg-primary text-on-primary text-xs font-black rounded-full shadow-[0_0_15px_rgba(255,141,140,0.3)] transition-all uppercase tracking-wider">Tất cả</button>
          <button className="px-5 py-2.5 text-tertiary-fixed-dim text-xs font-bold rounded-full hover:bg-white/5 transition-colors uppercase tracking-wider">VIP</button>
          <button className="px-5 py-2.5 text-secondary text-xs font-bold rounded-full hover:bg-white/5 transition-colors uppercase tracking-wider">Vàng</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-surface-container-low p-6 rounded-3xl border border-tertiary-fixed-dim/30 shadow-lg hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(38,254,220,0.1)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-tertiary-fixed-dim"></div>
          <div className="flex flex-col items-center text-center mt-2">
            <div className="relative mb-4">
              <img className="w-20 h-20 rounded-full object-cover border-4 border-surface shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7LRKZ2ix3cq9BaDKDOJF641c7-yfpl-LS9R_4huZbtFir6z0km8AGH0ppWFKfOxQaHoMM0O5YOV2Xpbuv7vXH6AqzRHYdFE0ivCXzLp4zZHI0inwUo4IEFRVQjBjjLIkQPb97rCp9RPKH615RDRDR3Zlpcs9vocNy92yjcthPhoAqI3YDPyE5LPBlpKIvCYzweyTAtb6oYDEHGIQoI8-slhN04UrKAhJUAsgqx51EwJojvLoKEd8ubbfeUcMPXZ7iVDE7WthlnSqs" />
              <span className="absolute bottom-0 right-0 bg-tertiary-fixed-dim text-on-tertiary-fixed font-black text-[10px] px-2 py-0.5 rounded-full border-2 border-surface">VIP</span>
            </div>
            <h3 className="text-xl font-black text-on-surface mb-1">Tuấn Kiệt</h3>
            <p className="text-xs text-on-surface-variant font-bold tracking-widest mb-6">090 123 4567</p>

            <div className="w-full bg-surface-container-highest rounded-2xl p-4 mb-6 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Tổng chi tiêu</p>
              <p className="text-2xl font-black text-tertiary-fixed-dim tracking-tighter">5.200.000đ</p>
            </div>

            <button className="w-full py-3 bg-surface-container-high rounded-full text-sm font-bold text-on-surface hover:bg-tertiary-fixed-dim hover:text-on-tertiary-fixed transition-colors border border-transparent hover:border-tertiary-fixed-dim/50">
              Xem chi tiết
            </button>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-3xl border border-secondary/30 shadow-lg hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(255,171,105,0.1)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-secondary"></div>
          <div className="flex flex-col items-center text-center mt-2">
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center border-4 border-surface shadow-lg">
                <span className="text-2xl font-black text-secondary">MA</span>
              </div>
              <span className="absolute bottom-0 right-0 bg-secondary text-on-secondary font-black text-[10px] px-2 py-0.5 rounded-full border-2 border-surface">VÀNG</span>
            </div>
            <h3 className="text-xl font-black text-on-surface mb-1">Minh Anh</h3>
            <p className="text-xs text-on-surface-variant font-bold tracking-widest mb-6">091 987 6543</p>

            <div className="w-full bg-surface-container-highest rounded-2xl p-4 mb-6 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Tổng chi tiêu</p>
              <p className="text-2xl font-black text-secondary tracking-tighter">2.450.000đ</p>
            </div>

            <button className="w-full py-3 bg-surface-container-high rounded-full text-sm font-bold text-on-surface hover:bg-secondary hover:text-on-secondary transition-colors border border-transparent hover:border-secondary/50">
              Xem chi tiết
            </button>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-3xl border border-white/10 shadow-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-500"></div>
          <div className="flex flex-col items-center text-center mt-2">
            <div className="relative mb-4">
              <img className="w-20 h-20 rounded-full object-cover border-4 border-surface shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLCpek6Nt94IZbLFJtWZTQ5siv8uNDnuNCTT-gMGTOHMaLPg0XqJp_Fmh0N6VOJ18TYft4a1cBZ48pZa50WJ-Z492OSFSOET2xE85cXyrl3qqNwY85CVupEGEX9zC_k4k-3Homw4E6nakv5w47kpjO5Ex1PmTVyRJoxrNfw0LpKu-5-hyZV-t55L_m1JfW6huW8fTlALES0HhDr-6Hl98MgbBcPGQi7dmFxXL4N1YamzJ4vuKng8IoF3s9pZK1b9y_mazuKVxk6Nkl" />
              <span className="absolute bottom-0 right-0 bg-slate-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full border-2 border-surface">BẠC</span>
            </div>
            <h3 className="text-xl font-black text-on-surface mb-1">Lê Linh</h3>
            <p className="text-xs text-on-surface-variant font-bold tracking-widest mb-6">098 112 2334</p>

            <div className="w-full bg-surface-container-highest rounded-2xl p-4 mb-6 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Tổng chi tiêu</p>
              <p className="text-2xl font-black text-slate-300 tracking-tighter">850.000đ</p>
            </div>

            <button className="w-full py-3 bg-surface-container-high rounded-full text-sm font-bold text-on-surface hover:bg-slate-500 hover:text-white transition-colors border border-transparent hover:border-slate-500/50">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

import { useAdminCustomers } from "../../hooks/useAdminCustomers";
import { useFormat } from "../../hooks/useFormat";

export default function AdminCustomers() {
  const { 
    filteredUsers, 
    loading, 
    filter, 
    setFilter, 
    getCustomerTotalSpend, 
    getCustomerRank 
  } = useAdminCustomers();
  const { getInitials } = useFormat();

  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">QUẢN LÝ KHÁCH HÀNG</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Theo dõi hoạt động và phân cấp rank người chơi.</p>
        </div>

        <div className="bg-surface-container-low p-1.5 rounded-full border border-white/5 flex flex-wrap gap-1 shadow-inner">
          <button 
            onClick={() => setFilter("all")}
            className={`px-5 py-2.5 text-xs font-black rounded-full transition-all uppercase tracking-wider ${filter === "all" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]" : "text-on-surface-variant hover:text-white hover:bg-white/5"}`}
          >Tất cả</button>
          <button 
            onClick={() => setFilter("vip")}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-colors uppercase tracking-wider ${filter === "vip" ? "bg-tertiary-fixed-dim text-on-tertiary-fixed" : "text-tertiary-fixed-dim hover:bg-white/5"}`}
          >VIP</button>
          <button 
            onClick={() => setFilter("gold")}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-colors uppercase tracking-wider ${filter === "gold" ? "bg-secondary text-on-secondary" : "text-secondary hover:bg-white/5"}`}
          >Vàng</button>
          <button 
            onClick={() => setFilter("silver")}
            className={`px-5 py-2.5 text-xs font-bold rounded-full transition-colors uppercase tracking-wider ${filter === "silver" ? "bg-slate-500 text-white" : "text-slate-400 hover:bg-white/5"}`}
          >Bạc</button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface-container-low p-6 rounded-3xl border border-white/5 animate-pulse h-[350px]"></div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-on-surface-variant py-10">Không tìm thấy khách hàng nào.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map(user => {
            const spend = getCustomerTotalSpend(user.id);
            const rank = getCustomerRank(spend);
            
            return (
              <div key={user.id} className={`bg-surface-container-low p-6 rounded-3xl border shadow-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group ${
                rank.name === 'VIP' ? 'border-tertiary-fixed-dim/30 hover:shadow-[0_10px_30px_rgba(38,254,220,0.1)]' :
                rank.name === 'VÀNG' ? 'border-secondary/30 hover:shadow-[0_10px_30px_rgba(255,171,105,0.1)]' :
                'border-white/10 hover:shadow-xl'
              }`}>
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  rank.name === 'VIP' ? 'bg-tertiary-fixed-dim' :
                  rank.name === 'VÀNG' ? 'bg-secondary' :
                  'bg-slate-500'
                }`}></div>
                <div className="flex flex-col items-center text-center mt-2">
                  <div className="relative mb-4">
                    {user.avatar ? (
                      <img className="w-20 h-20 rounded-full object-cover border-4 border-surface shadow-lg" src={user.avatar} alt={user.name} />
                    ) : (
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 border-surface shadow-lg ${
                        rank.name === 'VIP' ? 'bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim' :
                        rank.name === 'VÀNG' ? 'bg-secondary/20 text-secondary' :
                        'bg-surface-container-highest text-on-surface-variant'
                      }`}>
                        <span className="text-2xl font-black">{getInitials(user.name)}</span>
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 font-black text-[10px] px-2 py-0.5 rounded-full border-2 border-surface ${
                      rank.name === 'VIP' ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed' :
                      rank.name === 'VÀNG' ? 'bg-secondary text-on-secondary' :
                      'bg-slate-500 text-white'
                    }`}>{rank.name}</span>
                  </div>
                  <h3 className="text-xl font-black text-on-surface mb-1">{user.name}</h3>
                  <p className="text-xs text-on-surface-variant font-bold tracking-widest mb-6">{user.email}</p>

                  <div className="w-full bg-surface-container-highest rounded-2xl p-4 mb-6 border border-white/5">
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Tổng chi tiêu</p>
                    <p className={`text-2xl font-black tracking-tighter ${
                      rank.name === 'VIP' ? 'text-tertiary-fixed-dim' :
                      rank.name === 'VÀNG' ? 'text-secondary' :
                      'text-slate-300'
                    }`}>{spend.toLocaleString('vi-VN')}đ</p>
                  </div>

                  <button className={`w-full py-3 bg-surface-container-high rounded-full text-sm font-bold text-on-surface transition-colors border border-transparent ${
                    rank.name === 'VIP' ? 'hover:bg-tertiary-fixed-dim hover:text-on-tertiary-fixed hover:border-tertiary-fixed-dim/50' :
                    rank.name === 'VÀNG' ? 'hover:bg-secondary hover:text-on-secondary hover:border-secondary/50' :
                    'hover:bg-slate-500 hover:text-white hover:border-slate-500/50'
                  }`}>
                    Xem chi tiết
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

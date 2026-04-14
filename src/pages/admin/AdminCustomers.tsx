import { useState } from "react";
import { useAdminCustomers } from "../../hooks/useAdminCustomers";
import { useFormat } from "../../hooks/useFormat";
import type { User } from "../../types";

export default function AdminCustomers() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { 
    filteredUsers, 
    paginatedUsers,
    loading, 
    search, 
    setSearch, 
    page,
    setPage,
    totalPages,
    getCustomerTotalSpend, 
    deleteUser
  } = useAdminCustomers();
  const { getInitials } = useFormat();

  const handleDeleteUser = async (id: string) => {
    const success = await deleteUser(id);
    if (success && selectedUser?.id === id) {
      setSelectedUser(null);
    }
  };

  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">QUẢN LÝ KHÁCH HÀNG</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Theo dõi hoạt động và quản lý tài khoản người dùng.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Tên, username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-surface-container-low border border-white/5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm w-full sm:w-64"
            />
          </div>
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedUsers.map(user => {
              const spend = getCustomerTotalSpend(user.id);
              
              return (
                <div key={user.id} className="bg-surface-container-low p-6 rounded-3xl border border-white/10 shadow-lg hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/30 group-hover:bg-primary transition-colors"></div>
                  
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-error/10 text-error opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-error hover:text-white"
                    title="Xóa người dùng"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>

                  <div className="flex flex-col items-center text-center mt-2">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-surface shadow-lg bg-surface-container-highest text-on-surface-variant">
                        <span className="text-2xl font-black">{getInitials(user.name)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-black text-on-surface mb-1">{user.name}</h3>
                    <p className="text-xs text-on-surface-variant mb-4">@{user.username}</p>

                    <div className="w-full bg-surface-container-highest rounded-2xl p-4 mb-6 border border-white/5">
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Tổng chi tiêu</p>
                      <p className="text-2xl font-black tracking-tighter text-primary">{spend.toLocaleString('vi-VN')}đ</p>
                    </div>

                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="w-full py-3 bg-surface-container-high rounded-full text-sm font-bold text-on-surface transition-colors border border-transparent hover:bg-primary hover:text-on-primary hover:border-primary/50"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-low border border-white/5 text-on-surface hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-surface-container-low disabled:hover:text-on-surface transition-all"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-full text-xs font-black transition-all ${
                      page === i + 1 
                        ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.4)] scale-110" 
                        : "bg-surface-container-low text-on-surface-variant hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-low border border-white/5 text-on-surface hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-surface-container-low disabled:hover:text-on-surface transition-all"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}

      {/* Customer Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedUser(null)}></div>
          <div className="bg-surface-container p-8 rounded-[40px] border border-white/10 shadow-2xl w-full max-w-xl relative z-10">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-3xl font-black italic tracking-tighter uppercase">Chi tiết khách hàng</h3>
              <button onClick={() => setSelectedUser(null)} className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-error hover:text-white transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-black text-primary border-4 border-surface shadow-2xl">
                  {getInitials(selectedUser.name)}
                </div>
              </div>

              <h4 className="text-3xl font-black mb-1">{selectedUser.name}</h4>
              <p className="text-on-surface-variant mb-8">@{selectedUser.username}</p>

              <div className="grid grid-cols-2 gap-4 w-full mb-8">
                <div className="bg-surface-container-high p-6 rounded-3xl border border-white/5 text-left">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Tổng chi tiêu</p>
                  <p className="text-2xl font-black text-primary">{getCustomerTotalSpend(selectedUser.id).toLocaleString('vi-VN')}đ</p>
                </div>
                <div className="bg-surface-container-high p-6 rounded-3xl border border-white/5 text-left flex flex-col justify-center">
                   <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Vai trò</p>
                   <p className="text-xl font-black text-on-surface uppercase tracking-tighter">KHÁCH HÀNG</p>
                </div>
              </div>

              <div className="w-full flex gap-3">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-4 bg-surface-container-highest rounded-2xl font-bold text-on-surface hover:bg-white/5 transition-colors"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="flex-1 py-4 bg-error/10 text-error rounded-2xl font-bold hover:bg-error hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

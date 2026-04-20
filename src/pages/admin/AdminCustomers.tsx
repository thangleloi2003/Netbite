import { useState } from "react";
import { useAdminCustomers } from "../../hooks/useAdminCustomers";
import { useFormat } from "../../hooks/useFormat";

export default function AdminCustomers() {
  const {
    filteredUsers,
    paginatedUsers,
    loading,
    search,
    setSearch,
    filter,
    setFilter,
    page,
    setPage,
    totalPages,
    getCustomerTotalSpend,
    getCustomerOrderCount,
    toggleUserStatus,
    createUser,
  } = useAdminCustomers();

  const { formatPrice, getInitials } = useFormat();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
    name: "",
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await createUser({
        ...newUserData,
        role: "customer",
        status: "active",
      });
      setShowAddModal(false);
      setNewUserData({ name: "", username: "", password: "" });
    } catch (err: any) {
      setError(err.message || "Không thể tạo tài khoản. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatStatus = (status: string) => {
    if (status === "active") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-green-500/10 text-green-400 uppercase tracking-widest border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          Hoạt động
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-error/10 text-error uppercase tracking-widest border border-error/20">
        <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
        Đã khóa
      </span>
    );
  };

  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">
            QUẢN LÝ KHÁCH HÀNG
          </h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">
            Quản lý thông tin và trạng thái tài khoản người dùng.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              type="text"
              placeholder="Tên, tài khoản..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3 bg-surface-container-low border border-white/5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm w-full sm:w-64"
            />
          </div>

          <div className="bg-surface-container-low p-1.5 rounded-full border border-white/5 flex flex-wrap gap-1 shadow-inner max-w-full overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${
                filter === "all"
                  ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]"
                  : "text-on-surface-variant hover:text-white hover:bg-white/5"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("online")}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${
                filter === "online"
                  ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  : "text-on-surface-variant hover:text-white hover:bg-white/5"
              }`}
            >
              Đang Online
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${
                filter === "active"
                  ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  : "text-on-surface-variant hover:text-white hover:bg-white/5"
              }`}
            >
              Hoạt động
            </button>
            <button
              onClick={() => setFilter("inactive")}
              className={`px-5 py-2.5 text-xs font-bold rounded-full transition-all uppercase tracking-wider whitespace-nowrap ${
                filter === "inactive"
                  ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,69,58,0.3)]"
                  : "text-on-surface-variant hover:text-white hover:bg-white/5"
              }`}
            >
              Đã khóa
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <section className="bg-surface-container-low rounded-3xl overflow-hidden border border-white/5 shadow-xl">
        <div className="px-8 py-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/5 bg-surface-container/50">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Danh sách khách hàng
            </h2>
            <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mt-1">
              Tổng cộng {filteredUsers.length} người dùng
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,141,140,0.3)]"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            Thêm khách hàng
          </button>
        </div>

        {/* Modal Thêm Khách Hàng */}
        {showAddModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-container-low border border-white/5 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-surface-container/50">
                <h3 className="text-xl font-black tracking-tight uppercase italic">
                  Tạo tài khoản mới
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-on-surface-variant hover:text-white"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleAddUser} className="p-8 space-y-5">
                {error && (
                  <div className="p-4 rounded-2xl bg-error/10 border border-error/20 text-error text-xs font-bold flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm">
                      error
                    </span>
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-4">
                    Họ và tên
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="VD: Nguyễn Văn A"
                    value={newUserData.name}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full bg-surface-container-highest border border-white/5 rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-4">
                    Tên tài khoản
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="VD: vanA_123"
                    value={newUserData.username}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full bg-surface-container-highest border border-white/5 rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant ml-4">
                    Mật khẩu
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    value={newUserData.password}
                    onChange={(e) =>
                      setNewUserData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full bg-surface-container-highest border border-white/5 rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-bold text-sm"
                  />
                </div>

                <div className="pt-4">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-primary text-on-primary py-4 rounded-full font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,141,140,0.3)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Tạo tài khoản"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-highest/30">
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Khách hàng
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Tài khoản
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
                  Số máy
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
                  Đơn hàng
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
                  Tổng chi tiêu
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-5 text-xs font-bold uppercase tracking-widest text-on-surface-variant text-right">
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
                    Đang tải dữ liệu khách hàng...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-8 text-center text-on-surface-variant font-medium"
                  >
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-surface-container-high transition-colors group"
                  >
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-black text-secondary border border-secondary/30">
                            {getInitials(user.name)}
                          </div>
                          {user.machineId && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-surface-container-low rounded-full"></span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold block">
                              {user.name}
                            </span>
                            {user.isGuest && (
                              <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-white/60 rounded font-black uppercase tracking-tighter">Guest</span>
                            )}
                          </div>
                          <span className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                            ID: {user.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div 
                        className="text-sm font-mono text-primary font-black truncate max-w-[140px]" 
                        title={`@${user.username}`}
                      >
                        @{user.username}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm font-black text-secondary uppercase tracking-widest text-center">
                      {user.machineId || '---'}
                    </td>
                    <td className="px-6 py-6 text-sm text-on-surface-variant font-black text-center">
                      {getCustomerOrderCount(user.id)}
                    </td>
                    <td className="px-6 py-6 text-sm font-black text-on-surface text-lg tracking-tighter text-center">
                      {formatPrice(getCustomerTotalSpend(user.id))}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="flex justify-center">
                        {formatStatus(user.status)}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <button
                        onClick={() => toggleUserStatus(user.id, user.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all border ${
                          user.status === "active"
                            ? "bg-error/10 text-error border-error/20 hover:bg-error hover:text-white"
                            : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500 hover:text-white"
                        }`}
                        title={user.status === "active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {user.status === "active" ? 'block' : 'lock_open'}
                        </span>
                        <span>{user.status === "active" ? "Khóa" : "Mở khóa"}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="px-8 py-6 flex items-center justify-between border-t border-white/5 bg-surface-container/30">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Hiển thị {(page - 1) * 5 + 1}-
              {Math.min(page * 5, filteredUsers.length)} của{" "}
              {filteredUsers.length} khách hàng
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
    </main>
  );
}

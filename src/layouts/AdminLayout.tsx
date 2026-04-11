import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { path: "/admin", label: "Bảng điều khiển", icon: "dashboard" },
    { path: "/admin/products", label: "Sản phẩm", icon: "inventory_2" },
    { path: "/admin/orders", label: "Đơn hàng", icon: "shopping_cart" },
    { path: "/admin/customers", label: "Khách hàng", icon: "group" },
  ];

  const activeIndex = menuItems.findIndex((item) =>
    item.path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(item.path),
  );

  return (
    <div className="bg-surface text-on-surface min-h-screen flex overflow-x-hidden selection:bg-primary selection:text-on-primary">
      <aside className="h-screen sticky left-0 top-0 w-64 bg-[#24020c] flex flex-col py-6 gap-2 shrink-0 border-r border-white/10 z-50">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-2xl font-black italic tracking-tighter text-red-600 leading-none hover:scale-105 transition-transform"
            >
              NETBITE
              <span className="text-sm font-bold text-slate-300 not-italic ml-1">
                Admin
              </span>
            </Link>
          </div>
          <p className="text-on-surface-variant/60 text-[10px] uppercase tracking-widest mt-2 font-bold">
            Hệ thống quản trị
          </p>
        </div>

        <nav className="flex-1 px-3 relative">
          {/* Moving Highlight Background */}
          {activeIndex !== -1 && (
            <div
              className="absolute left-3 right-3 bg-surface-container-highest rounded-xl border-l-4 border-primary shadow-lg shadow-primary/5 transition-all duration-300 ease-out z-0 h-[52px]"
              style={{ top: `${activeIndex * (52 + 8)}px` }}
            />
          )}

          <div className="space-y-2 relative z-10">
            {menuItems.map((item, index) => {
              const isActive = activeIndex === index;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 h-[52px] ${
                    isActive
                      ? "text-primary"
                      : "text-on-surface-variant hover:text-white"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined transition-colors duration-300 ${isActive ? "text-primary" : ""}`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`font-bold text-sm transition-colors duration-300 ${isActive ? "font-black" : ""}`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="pt-10"></div>

          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-[calc(100%-24px)] mx-3 text-on-surface-variant hover:text-error flex items-center gap-3 px-4 
              py-3 mt-[295px] rounded-xl hover:bg-surface-container transition-all duration-300 
              border-l-4 border-transparent hover:border-error/50 cursor-pointer"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-bold text-sm">Đăng xuất</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="w-full top-0 sticky z-40 bg-[#24020c]/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 border-b border-white/10">
          <div className="flex items-center gap-4 flex-1">
          </div>

          <div className="flex items-center gap-5">
            <div className="h-8 w-px bg-white/10 mx-1"></div>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-1.5 pr-4 rounded-full transition-colors">
              <img
                alt="Ảnh đại diện Admin"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBa7X4dnkqhpoVO-a3GjeVqhOoLbfjgbGLJ-1EVQViU99_IYooG1fTAyN32iFBroVClI0-7AMcQbrJpScklSfYksvIPHDaqoCfoyPZ3eWYOK0VgL_Bh5jVd_d17TKeT7NPWznNdbOG8EbCE9AcP6Otj4ng62y7OtjxHG4qoBw_hm2UemV64782wV-M1apFYzb2MEwC4HmAi1nDqVquJcS_uZ51n6NrdhwbgKSnIVgnTYwFirSXCR96LD--luFGawUSyVlw-ABF37AG-"}
              />
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-on-surface leading-tight">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                  {user?.role === 'admin' ? 'Thách Đấu' : 'Thành Viên'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <Outlet />
      </div>
    </div>
  );
}

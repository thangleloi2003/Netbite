import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AdminProvider } from "../context/AdminContext";

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
    <AdminProvider>
      <div className="bg-surface text-on-surface h-screen flex overflow-hidden selection:bg-primary selection:text-on-primary">
        <aside className="h-full w-64 bg-[#24020c] flex flex-col py-6 gap-2 shrink-0 border-r border-white/10 z-50">
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

          <nav className="flex-1 px-3 relative flex flex-col">
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

            <div className="mt-[310px] pb-4 space-y-2">
              <div className="mx-4 h-px bg-white/5 mt-4"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:text-white hover:bg-surface-container-highest transition-all duration-300 h-[52px] group cursor-pointer"
              >
                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">logout</span>
                <span className="font-bold text-sm">Đăng xuất</span>
              </button>
            </div>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <header className="w-full shrink-0 bg-[#24020c]/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 border-b border-white/10">
            <div className="flex items-center gap-4 flex-1">
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-on-surface leading-none uppercase tracking-tighter italic">
                  {user?.name}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black border border-primary/30">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminProvider>
  );
}

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { orderApi } from '../services/api';
import type { Order } from '../types';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);

  // Fetch active orders for the current user
  useEffect(() => {
    if (!isAuthenticated || !user || user.role === 'admin') {
      setActiveOrders([]);
      return;
    }

    const fetchOrders = async () => {
      try {
        const orders = await orderApi.getByUserId(user.id);
        const active = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
        setActiveOrders(active);
      } catch (err) {
        console.error("Failed to fetch active orders:", err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'processing': return 'restaurant';
      default: return 'restaurant';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-secondary';
      case 'processing': return 'text-primary';
      default: return 'text-primary';
    }
  };

  const handleLogout = () => {
    logout();
    setActiveOrders([]); // Clear local active orders immediately
    navigate('/');
  };

  if (location.pathname === '/checkout') {
    return (
      <header className="fixed top-0 w-full z-50 glass-header bg-[#24020c]/80 no-line-rule border-b border-white/5">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="text-2xl font-black italic tracking-tighter text-red-600 dark:text-red-500">NETBITE</Link>
          <nav className="hidden md:flex gap-6 items-center font-bold tracking-tight">
            <span className="text-primary border-b-2 border-primary pb-1">Thanh toán</span>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">chevron_right</span>
            <span className="text-on-surface-variant opacity-50 cursor-not-allowed">Hoàn tất</span>
          </nav>
          <div className="flex items-center gap-4">
            <Link to={user ? (user.role === 'admin' ? '/admin' : '/') : '/login'}
              className="bg-surface-container hover:bg-surface-container-highest text-on-surface p-2.5 rounded-full transition-all duration-300 active:scale-95 border border-white/5">
              <span className="material-symbols-outlined text-xl">person</span>
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <header className="fixed top-0 w-full z-30 glass-header bg-[#24020c]/80 no-line-rule">
        <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button 
              className="md:hidden text-slate-300 hover:text-white flex items-center justify-center transition-transform active:scale-95"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="material-symbols-outlined text-[24px] sm:text-[28px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
            <Link to="/" className="text-xl sm:text-2xl font-black italic tracking-tighter text-red-600 dark:text-red-500">NETBITE</Link>
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            <Link
              className={`transition-colors tracking-tight font-headline ${location.pathname === '/' ? 'text-red-500 font-bold border-b-2 border-red-500 pb-1' : 'text-slate-300 hover:text-red-400'}`}
              to="/">Trang Chủ</Link>
            <Link
              className={`transition-colors tracking-tight font-headline ${location.pathname === '/menu' || location.pathname.startsWith('/product/') ? 'text-red-500 font-bold border-b-2 border-red-500 pb-1' : 'text-slate-300 hover:text-red-400'}`}
              to="/menu">Thực Đơn</Link>
            <Link
              className={`transition-colors tracking-tight font-headline ${location.pathname === '/about' ? 'text-red-500 font-bold border-b-2 border-red-500 pb-1' : 'text-slate-300 hover:text-red-400'}`}
              to="/about">Về Chúng Tôi</Link>
          </nav>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Order Status Icon */}
              {user.role !== 'admin' && activeOrders.length > 0 && (
                <div className="relative group/order p-2 hover:bg-white/5 transition-all duration-200 rounded-full active:scale-95 translate-y-0.5">
                  <div className="flex items-center gap-1">
                    <span className={`material-symbols-outlined ${getStatusColor(activeOrders[0].status)} ${activeOrders[0].status === 'pending' ? 'animate-pulse' : 'animate-bounce'}`}>
                      {getStatusIcon(activeOrders[0].status)}
                    </span>
                    {activeOrders.length > 1 && (
                      <span className="text-[10px] font-black bg-primary text-on-primary rounded-full w-4 h-4 flex items-center justify-center -ml-1.5 -mt-3 shadow-sm">
                        {activeOrders.length}
                      </span>
                    )}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-surface-container-high border border-white/10 rounded-xl p-3 shadow-2xl opacity-0 invisible group-hover/order:opacity-100 group-hover/order:visible transition-all duration-200 z-[100]">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2">Đơn hàng hiện tại</p>
                    <div className="space-y-2">
                      {activeOrders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                          <span className="text-xs font-bold truncate pr-2">#{order.id}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-surface-container-highest ${getStatusColor(order.status)}`}>
                            {order.status === 'pending' ? 'Chờ xử lý' : 'Đang làm'}
                          </span>
                        </div>
                      ))}
                      {activeOrders.length > 3 && (
                        <p className="text-[9px] text-on-surface-variant text-center pt-1 italic">Và {activeOrders.length - 3} đơn khác...</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2 hover:bg-white/5 transition-all duration-200 rounded-full active:scale-95 translate-y-0.5"
              >
                <span className="material-symbols-outlined text-primary">shopping_cart</span>
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-secondary text-on-secondary text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(255,171,105,0.6)]">
                    {totalCount > 99 ? '99+' : totalCount}
                  </span>
                )}
              </button>
              <div className="flex gap-4 items-center">
                <div className="hidden sm:flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    {user.role === 'admin' ? (
                      <Link
                        to="/admin"
                        className="text-slate-300 hover:text-white font-bold leading-none"
                      >
                        {user.name}
                      </Link>
                    ) : (
                      <span className="text-slate-300 font-bold leading-none">
                        {user.name}
                      </span>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors text-on-surface-variant hover:text-red-500 active:scale-90"
                      title="Đăng xuất"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                    </button>
                  </div>
                  {user.role !== 'admin' && user.machineId && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                      Máy: {user.machineId}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              className="bg-secondary text-on-secondary px-6 py-2 rounded-full font-bold hover:bg-primary hover:text-on-primary transition-all duration-300 active:scale-95"
            >
              Đăng nhập
            </Link>
          )}
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/10 bg-[#24020c]/95 backdrop-blur-xl flex flex-col px-6 py-4 gap-4 shadow-2xl animate-fade-in-down origin-top">
            <Link
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg transition-colors font-headline ${location.pathname === '/' ? 'text-red-500 font-bold' : 'text-slate-300 hover:text-red-400'}`}
              to="/">Trang Chủ</Link>
            <Link
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg transition-colors font-headline ${location.pathname === '/menu' || location.pathname.startsWith('/product/') ? 'text-red-500 font-bold' : 'text-slate-300 hover:text-red-400'}`}
              to="/menu">Thực Đơn</Link>
            <Link
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg transition-colors font-headline ${location.pathname === '/about' ? 'text-red-500 font-bold' : 'text-slate-300 hover:text-red-400'}`}
              to="/about">Về Chúng Tôi</Link>
          </nav>
        )}
      </header>
    </>
  );
}

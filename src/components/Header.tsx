import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import CartDrawer from './CartDrawer';

export default function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
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
                  {user.role !== 'admin' && user.machineId && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                      Máy: {user.machineId}
                    </span>
                  )}
                </div>
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 rounded-xl text-on-surface-variant 
                  hover:text-white hover:bg-surface-container-highest transition-all duration-300 active:scale-95"
                  title="Đăng xuất"
                >
                  <span className="material-symbols-outlined text-[24px] sm:text-[24px] transition-transform">logout</span>
                  <span className="font-bold text-md sm:text-md hidden lg:block">Đăng xuất</span>
                </button>
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

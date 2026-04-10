import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Layout() {
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className="bg-surface text-on-surface overflow-x-hidden min-h-screen flex flex-col relative">
      {!isProfilePage && <Header />}
      <main className="flex-grow flex flex-col w-full h-full">
        <Outlet />
      </main>
      
      {/* Sticky Order Button */}
      {!isProfilePage && (
        <div className="fixed bottom-8 right-8 z-[100] md:hidden">
          <Link to="/checkout" className="bg-primary text-on-primary w-16 h-16 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <span className="material-symbols-outlined text-3xl" data-icon="shopping_cart">shopping_cart</span>
          </Link>
        </div>
      )}

      {!isProfilePage && <Footer />}
    </div>
  );
}

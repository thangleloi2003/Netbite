import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Layout() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col relative">
      <Header />
      <main className="flex-grow flex flex-col w-full h-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

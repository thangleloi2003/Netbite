import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <main className="bg-surface text-on-surface w-full min-h-screen py-25 flex-grow flex items-center justify-center px-4 relative overflow-hidden border-none">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        <Link to="/" className="text-center mb-8 hover:scale-105 transition-transform duration-300 inline-block">
          <h1 className="text-5xl font-black tracking-tighter italic uppercase text-on-surface mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">NETBITE</span>
          </h1>
          <div className="h-1.5 w-16 bg-secondary mx-auto mt-2 rounded-full mb-3"></div>
          <p className="text-on-surface-variant text-xs uppercase tracking-[0.2em] font-bold">Gaming & Lounge</p>
        </Link>

        <div className="bg-surface-container-low w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5 backdrop-blur-md">
          <div className="flex bg-surface-container-highest/50 p-2 border-b border-white/5 gap-1">
            <Link to="/login" className="flex-1 py-3 text-xs font-bold tracking-widest uppercase text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-all text-center block">
              Đăng nhập
            </Link>
            <button className="flex-1 py-3 text-xs font-black tracking-widest uppercase text-white bg-primary rounded-full shadow-[0_0_15px_rgba(255,141,140,0.3)] transition-all">
              Đăng ký
            </button>
          </div>

          <div className="p-8 sm:p-10">
            <form className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Họ và Tên</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">badge</span>
                  <input className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    placeholder="VD: Gamer Tuấn Kiệt" type="text" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">mail</span>
                  <input className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    placeholder="name@domain.com" type="email" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Mật khẩu</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                  <input className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    placeholder="••••••••" type="password" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Xác nhận mật khẩu</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    placeholder="••••••••" type="password" />
                </div>
              </div>

              <button className="w-full bg-primary hover:brightness-110 active:scale-[0.98] transition-all text-on-primary font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,141,140,0.4)] hover:shadow-[0_0_30px_rgba(255,141,140,0.6)] border border-white/10 mt-6" type="button">
                Tạo tài khoản ngay
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user, token } = await authApi.login({ username, password });
      login(user, token);
      
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect');

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-surface text-on-surface flex-grow flex items-center justify-center px-4 py-25 relative overflow-hidden w-full min-h-screen border-none">
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
            <button className="flex-1 py-3 text-xs font-black tracking-widest uppercase text-white bg-primary rounded-full shadow-[0_0_15px_rgba(255,141,140,0.3)] transition-all">
              Đăng nhập
            </button>
            <Link to="/register" className="flex-1 py-3 text-xs font-bold tracking-widest uppercase text-on-surface-variant hover:text-white hover:bg-white/5 rounded-full transition-all text-center block">
              Đăng ký
            </Link>
          </div>

          <div className="p-8 sm:p-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-error/10 border border-error/20 text-error text-xs font-bold p-4 rounded-2xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Tài khoản</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    placeholder="Nhập tên tài khoản" 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 px-4">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Mật khẩu</label>
                  <Link className="text-[12px] font-black text-primary tracking-widest hover:brightness-125 transition-colors" to="#">Quên mật khẩu?</Link>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-12 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-8 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <button 
                className="w-full bg-primary hover:brightness-110 active:scale-[0.98] transition-all text-on-primary font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,141,140,0.4)] hover:shadow-[0_0_30px_rgba(255,141,140,0.6)] border border-white/10 mt-4 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>

              <div className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-white/5"></div>
                  <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Hoặc tiếp tục với</span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 py-3.5 bg-surface-container-highest hover:bg-white/10 transition-all rounded-full border border-white/5 active:scale-95" type="button">
                    <img alt="Google" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANqrI94b6h9vbLgLwXdfgzdvD9BtdmAq_UHKYm8atkiO_BhU0GhFHmpSubKv_OiNmNgzHEGv9mVwXp4e4SZwczGAoANlrBafMbEoDt4CPa1dD7AmC3LgcU9yj4el6uKJqGnM4DED_80cH70uzB5AMsHZejnF4VH-Sje-gU0sYOQF69UP0GTtQWFsH-JY13fYg-m15RNplA_Y7UBGF8htRvt7cF-LPE0lXbP9bkgDpc61BMc6n73rZFxrrDr__VEjMGVmwVL5VMfvDV" />
                    <span className="text-xs font-bold uppercase tracking-widest">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3.5 bg-surface-container-highest hover:bg-white/10 transition-all rounded-full border border-white/5 active:scale-95" type="button">
                    <img alt="Facebook" className="w-4 h-4" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP4FzMUA5m_gmiZxhLUpQbvj11z396H_u4yl3L54WWSbhOr2btjn76HAhuid2uIdfzrYAbSb3oNbqU1a5WVTlmIUyfv35IVpt9HATsmnrySjq82tt00jtFd9J64QknGIJNzBszloUc_xkDgVVMQ1t7dFMegVNsWfIpOagdPSh9mlRhO3V82hIuNY4zv5xxNjWg408bNeyZgTjGXHE9Dx2ZN6iU9omwuNmxLfN9ZxwulI_pyks2r9gMTCKI9DdikazmyRJwXOhCQkiu" />
                    <span className="text-xs font-bold uppercase tracking-widest">Facebook</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

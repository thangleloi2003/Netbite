import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validatePassword = (pass: string) => {
    const conditions = {
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
    };
    return conditions;
  };

  const passwordConditions = validatePassword(formData.password);
  const isPasswordValid = Object.values(passwordConditions).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Mật khẩu không đáp ứng đủ điều kiện.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      const allUsers = await authApi.getAllUsers();
      
      // Kiểm tra username đã tồn tại chưa
      if (allUsers.some(u => u.username.toLowerCase() === formData.username.toLowerCase())) {
        setError('Tên tài khoản này đã tồn tại. Vui lòng chọn tên khác.');
        setLoading(false);
        return;
      }
      
      const nextId = "u_" + Math.random().toString(36).substr(2, 9);

      const user = await authApi.register({
        id: nextId,
        username: formData.username,
        name: formData.name,
        role: 'customer',
        password: formData.password
      } as any);
      login(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

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
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-error/10 border border-error/20 text-error text-xs font-bold p-4 rounded-2xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Họ và Tên</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">badge</span>
                  <input 
                    className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    placeholder="VD: Gamer Tuấn Kiệt" 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Tên tài khoản</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">person</span>
                  <input 
                    className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-6 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    placeholder="VD: tuankiet2024" 
                    type="text" 
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Mật khẩu</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock</span>
                  <input 
                    className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-12 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    placeholder="••••••••" 
                    type={showPassword ? 'text' : 'password'} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
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
                {formData.password && (
                  <div className="mt-3 px-4 space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Yêu cầu mật khẩu:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${passwordConditions.length ? 'text-green-500' : 'text-on-surface-variant/40'}`}>
                        <span className="material-symbols-outlined text-[12px]">{passwordConditions.length ? 'check_circle' : 'circle'}</span>
                        Ít nhất 8 ký tự
                      </div>
                      <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${passwordConditions.uppercase ? 'text-green-500' : 'text-on-surface-variant/40'}`}>
                        <span className="material-symbols-outlined text-[12px]">{passwordConditions.uppercase ? 'check_circle' : 'circle'}</span>
                        Chữ hoa (A-Z)
                      </div>
                      <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${passwordConditions.lowercase ? 'text-green-500' : 'text-on-surface-variant/40'}`}>
                        <span className="material-symbols-outlined text-[12px]">{passwordConditions.lowercase ? 'check_circle' : 'circle'}</span>
                        Chữ thường (a-z)
                      </div>
                      <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${passwordConditions.number ? 'text-green-500' : 'text-on-surface-variant/40'}`}>
                        <span className="material-symbols-outlined text-[12px]">{passwordConditions.number ? 'check_circle' : 'circle'}</span>
                        Chữ số (0-9)
                      </div>
                      <div className={`flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider ${passwordConditions.special ? 'text-green-500' : 'text-on-surface-variant/40'}`}>
                        <span className="material-symbols-outlined text-[12px]">{passwordConditions.special ? 'check_circle' : 'circle'}</span>
                        Ký tự đặc biệt (!@#...)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-4">Xác nhận mật khẩu</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">lock_reset</span>
                  <input 
                    className="w-full bg-surface-container-highest border border-white/5 focus:ring-1 focus:ring-primary focus:border-primary rounded-full py-4 pl-12 pr-12 text-on-surface placeholder:text-white/20 transition-all outline-none font-bold"
                    placeholder="••••••••" 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-8 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showConfirmPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>

              <button 
                className="w-full bg-primary hover:brightness-110 active:scale-[0.98] transition-all text-on-primary font-black uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,141,140,0.4)] hover:shadow-[0_0_30px_rgba(255,141,140,0.6)] border border-white/10 mt-6 disabled:opacity-50 disabled:cursor-not-allowed" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản ngay'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

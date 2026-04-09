import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function formatPrice(p: number) {
  return p.toLocaleString('vi-VN') + 'đ';
}

export default function Checkout() {
  const { items, totalCount, totalPrice, updateQty, removeItem, clearCart } = useCart();
  const [machine, setMachine] = useState('');
  const [phone, setPhone] = useState('');
  const [payment, setPayment] = useState<'cash' | 'qr'>('cash');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const DELIVERY_FEE = 5000;
  const total = totalPrice + DELIVERY_FEE;

  const handleSubmit = () => {
    if (!machine.trim()) return alert('Vui lòng nhập số máy/bàn!');
    setSubmitted(true);
    setTimeout(() => {
      clearCart();
      navigate('/');
    }, 2500);
  };

  if (submitted) {
    return (
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="material-symbols-outlined text-green-400 text-5xl">check_circle</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-4">Đặt hàng thành công!</h1>
          <p className="text-on-surface-variant text-lg mb-2">Đơn hàng của bạn đang được chuẩn bị.</p>
          <p className="text-secondary font-bold">Giao đến máy: <span className="text-on-surface">{machine}</span></p>
          <p className="text-on-surface-variant text-sm mt-6">Đang chuyển về trang chủ...</p>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <span className="material-symbols-outlined text-8xl text-on-surface-variant mb-6">shopping_cart</span>
        <h1 className="text-3xl font-black tracking-tighter mb-4">Giỏ hàng trống!</h1>
        <p className="text-on-surface-variant mb-8">Hãy chọn món trước khi thanh toán nhé.</p>
        <Link to="/menu" className="bg-primary text-on-primary px-10 py-4 rounded-full font-extrabold hover:shadow-[0_0_20px_rgba(255,141,140,0.4)] transition-all">
          Khám phá Thực đơn
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-32">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase">Thanh toán</h1>
        <div className="h-1.5 w-16 bg-secondary mt-2 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-black tracking-tight">VẬT PHẨM ĐÃ CHỌN</h2>
            <span className="bg-secondary/20 border border-secondary/30 text-secondary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
              {totalCount} Món
            </span>
          </div>

          {items.map(item => (
            <div key={item.id} className="bg-surface-container-low p-4 rounded-3xl border border-white/5 flex flex-col sm:flex-row items-center gap-6 group hover:-translate-y-1 hover:border-white/10 transition-all shadow-lg">
              <div className="w-full sm:w-28 aspect-square rounded-2xl overflow-hidden flex-shrink-0">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={item.image || 'https://via.placeholder.com/112'} alt={item.name} />
              </div>
              <div className="flex-grow w-full text-center sm:text-left">
                <h3 className="font-black text-xl text-on-surface mb-1">{item.name}</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{formatPrice(item.price)} / món</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 w-full">
                  <div className="flex items-center gap-4 bg-surface-container-high rounded-full p-1 border border-white/5">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-on-surface transition-colors active:scale-95">
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="font-black text-lg w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-white hover:brightness-110 transition-all shadow-[0_0_10px_rgba(255,141,140,0.3)] active:scale-95">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-2xl text-on-surface">{formatPrice(item.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center border border-error/30 text-error hover:bg-error/10 transition-all active:scale-95">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* XP Bonus */}
          <div className="bg-surface-container-highest p-6 rounded-2xl border border-white/5 flex items-center justify-between shadow-inner mt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-2xl">bolt</span>
              </div>
              <div>
                <p className="font-bold text-on-surface text-sm mb-1">Điểm kinh nghiệm nhận được</p>
                <p className="font-black text-xl text-secondary">+{Math.floor(totalPrice / 1000)} XP</p>
              </div>
            </div>
            <span className="bg-secondary px-4 py-1.5 text-[10px] text-on-secondary font-black tracking-widest rounded-full uppercase shadow-[0_0_15px_rgba(255,171,105,0.4)] hidden sm:block">
              XP Boost Active
            </span>
          </div>
        </div>

        {/* Order Summary & Form */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          <div className="bg-surface-container-low p-8 border-l-4 border-primary rounded-3xl shadow-2xl relative overflow-hidden border-y border-r border-white/5">
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

            <h2 className="font-black text-2xl tracking-tight text-on-surface mb-8 italic uppercase">Thông tin giao hàng</h2>

            <div className="space-y-5 relative z-10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">Vị trí giao hàng (Bàn/Máy)</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">desktop_windows</span>
                  <input
                    value={machine}
                    onChange={e => setMachine(e.target.value)}
                    className="w-full bg-surface-container-highest pl-12 pr-4 py-4 rounded-full border border-white/5 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-bold placeholder:text-white/20 transition-all outline-none"
                    placeholder="VD: Máy VIP 05..."
                    type="text"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">Số điện thoại liên hệ</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">call</span>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-surface-container-highest pl-12 pr-4 py-4 rounded-full border border-white/5 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface font-bold placeholder:text-white/20 transition-all outline-none"
                    placeholder="090 123 4567"
                    type="tel"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4 mt-8 relative z-10">
              <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-2">Phương thức thanh toán</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPayment('cash')}
                  className={`p-5 rounded-2xl transition-all text-center hover:-translate-y-1 border ${payment === 'cash' ? 'bg-primary border-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]' : 'bg-surface-container-highest border-white/5'}`}
                >
                  <span className={`material-symbols-outlined block mb-2 text-3xl ${payment === 'cash' ? 'text-white' : 'text-on-surface-variant'}`}>payments</span>
                  <span className={`text-sm font-black ${payment === 'cash' ? 'text-white' : 'text-on-surface'}`}>Tiền mặt</span>
                </button>
                <button
                  onClick={() => setPayment('qr')}
                  className={`p-5 rounded-2xl transition-all text-center hover:-translate-y-1 border ${payment === 'qr' ? 'bg-secondary border-secondary shadow-[0_0_15px_rgba(255,171,105,0.3)]' : 'bg-surface-container-highest border-white/5'}`}
                >
                  <span className={`material-symbols-outlined block mb-2 text-3xl ${payment === 'qr' ? 'text-on-secondary' : 'text-on-surface-variant'}`}>qr_code_2</span>
                  <span className={`text-sm font-black ${payment === 'qr' ? 'text-on-secondary' : 'text-on-surface'}`}>Quét QR</span>
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-4 pt-8 mt-8 border-t border-white/10 relative z-10">
              <div className="flex justify-between font-bold text-on-surface-variant">
                <span>Tạm tính ({totalCount} món)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between font-bold text-on-surface-variant">
                <span>Phí giao tận máy</span>
                <span className="text-green-400">{formatPrice(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between pt-4 pb-4 border-t border-white/10">
                <span className="font-black text-xl text-on-surface tracking-tight">TỔNG CỘNG</span>
                <span className="font-black text-4xl text-primary tracking-tighter">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-primary py-5 text-on-primary rounded-full font-black text-xl tracking-tighter uppercase shadow-[0_0_20px_rgba(255,141,140,0.4)] hover:shadow-[0_0_30px_rgba(255,141,140,0.6)] flex items-center justify-center gap-3 hover:brightness-110 transition-all active:scale-[0.98] border border-white/10 relative z-10"
            >
              XÁC NHẬN ĐƠN HÀNG
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

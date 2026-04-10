import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

function formatPrice(p: number) {
  return p.toLocaleString('vi-VN') + 'đ';
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, totalCount, totalPrice, removeItem, updateQty } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col
          bg-[#1a0108] border-l border-white/10 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">shopping_cart</span>
            <h2 className="font-black text-lg tracking-tight">Giỏ hàng</h2>
            {totalCount > 0 && (
              <span className="bg-secondary text-on-secondary text-xs font-black px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
                shopping_cart
              </span>
              <p className="font-bold text-on-surface-variant">Giỏ hàng trống!</p>
              <p className="text-sm text-on-surface-variant/60 mt-1">Hãy thêm món ăn yêu thích</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-surface-container-low p-3 rounded-2xl border border-white/5"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                  <p className="text-primary font-black text-sm mt-0.5">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-error/60 hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                  <div className="flex items-center gap-1 bg-surface-container-high rounded-full px-1">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                    >
                      <span className="material-symbols-outlined text-xs">remove</span>
                    </button>
                    <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center bg-primary text-on-primary rounded-full transition-colors hover:brightness-110"
                    >
                      <span className="material-symbols-outlined text-xs">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-white/10 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant font-bold text-sm">Tổng cộng</span>
              <span className="font-black text-2xl text-primary">{formatPrice(totalPrice)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-on-primary py-4 rounded-full font-black text-base uppercase tracking-tight shadow-[0_0_20px_rgba(255,141,140,0.4)] hover:brightness-110 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">payments</span>
              Thanh toán ngay
            </button>
          </div>
        )}
      </div>
    </>
  );
}

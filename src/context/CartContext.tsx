import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "netbite_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthWarning, setShowAuthWarning] = useState(false);

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
    }
  }, [isAuthenticated]);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      setTimeout(() => setShowAuthWarning(false), 5000); // Auto hide after 5 seconds
      return;
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    );
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalPrice,
        addItem,
        removeItem,
        updateQty,
        clearCart,
      }}
    >
      {children}
      
      {/* Custom Auth Notification Toast */}
      {showAuthWarning && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-surface-container-highest border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 w-[350px]">
            <div className="w-10 h-10 rounded-full bg-error/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-error text-[20px]">
                warning
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-black text-on-surface">Cần đăng nhập</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">Vui lòng đăng nhập để mua hàng</p>
            </div>
            <button 
              onClick={() => {
                setShowAuthWarning(false);
                navigate('/login');
              }}
              className="px-4 py-2 bg-primary text-on-primary text-xs font-black rounded-xl hover:bg-primary/90 transition-colors uppercase tracking-wider shrink-0"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => setShowAuthWarning(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors absolute -top-2 -right-2 bg-surface-container-high border border-white/10"
            >
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">close</span>
            </button>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}



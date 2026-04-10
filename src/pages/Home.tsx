import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product, Combo } from '../types';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useCombos } from '../hooks/useCombos';
import { productApi } from '../services/api';
function formatPrice(p: number) {
  return p.toLocaleString('vi-VN') + 'đ';
}

function AddedToast({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed top-24 right-8 z-50 animate-bounce-in">
      <div className="bg-surface-container-high border border-green-500/30 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
        <div className="w-9 h-9 bg-green-500/20 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-green-400 text-lg">check</span>
        </div>
        <div>
          <p className="font-black text-sm text-on-surface">Đã thêm vào giỏ!</p>
          <p className="text-xs text-on-surface-variant mt-0.5">Xem giỏ hàng để thanh toán</p>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
    if (isAuthenticated) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  return (
    <div className="group bg-surface-container-low rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-8px] hover:bg-surface-container-high">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={product.image} alt={product.name} />
          {product.tags.includes('hot') && (
            <div className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest text-on-primary shadow-lg z-10">Hot</div>
          )}
          {product.tags.includes('bestseller') && (
            <div className="absolute top-3 right-3 bg-secondary px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest text-on-secondary shadow-lg z-10">Bestseller</div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold mb-1 line-clamp-2 min-h-[3rem] hover:text-primary transition-colors leading-tight">{product.name}</h3>
        </Link>
        <div className="flex justify-between items-center mt-4">
          <span className="text-2xl font-black text-primary">{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center active:scale-90 ${added ? 'bg-green-500 text-white' : 'bg-secondary-container text-on-secondary-container hover:bg-primary hover:text-on-primary'}`}
          >
            <span className="material-symbols-outlined">{added ? 'check' : 'add_shopping_cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="bg-surface-container-low rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-surface-container-high" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-surface-container-high rounded w-3/4" />
        <div className="h-5 bg-surface-container-high rounded w-1/2" />
        <div className="flex justify-between mt-4">
          <div className="h-8 bg-surface-container-high rounded w-24" />
          <div className="h-10 w-10 bg-surface-container-high rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { products: featuredProducts, loading: productsLoading } = useFeaturedProducts();
  const { combos, loading: combosLoading } = useCombos();
  const [toast, setToast] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const loading = productsLoading || combosLoading;

  const handleComboOrder = useCallback(async (combo: Combo) => {
    if (combo.productIds && combo.productIds.length > 0) {
      // Fetch product details for each productId in the combo
      const productDetails = await Promise.allSettled(
        combo.productIds.map(id => productApi.getById(id))
      );
      productDetails.forEach(result => {
        if (result.status === 'fulfilled') {
          const p = result.value;
          addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
        }
      });
    } else {
      // Fallback: add combo itself as a single item
      addItem({ id: combo.id, name: combo.name, price: combo.price, image: '' });
    }
    setToast(true);
    setTimeout(() => {
      setToast(false);
      navigate('/checkout');
    }, 800);
  }, [addItem, navigate]);

  return (
    <div className="bg-surface text-on-surface">
      <AddedToast show={toast} />

      {/* Hero Section */}
      <section className="relative min-h-[921px] flex items-center pt-20 overflow-hidden bg-gradient-to-br from-primary-container via-surface to-surface">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10 text-center lg:text-left">
            <span className="inline-block bg-tertiary-container text-on-tertiary-container px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest mb-6">
              Level Up Your Meal
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              Đồ ăn nóng hổi,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">ngay tại NetBite!</span>
            </h1>
            <p className="text-xl text-on-surface-variant mb-8 max-w-lg">Nhanh – Ngon – Giá tốt, đặt món chỉ trong 1 click ngay khi đang combat.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/menu" className="bg-primary text-on-primary px-10 py-4 rounded-full text-lg font-extrabold hover:shadow-[0_0_20px_rgba(255,141,140,0.4)] transition-all flex items-center justify-center">
                Đặt Ngay
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
            <div className="relative z-10 scale-110 md:scale-125 lg:translate-x-12">
              <img
                alt="Gamer Burger"
                className="rounded-xl shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-xZGVbdxAiU85BEgpKZqa3CJHWE5GkZYKvJvcO1knC0kuEewXzeKusRWa-o2alm0gr9qNuF3G4lGhZsG2CaFDPBI_X6kvI1wRwY_ATa2AgCYLOIC52BjCOo0qaEvhZDB19u-xvLpGqnB0hAVuO9e5lW1chiHvOH8EXfyuzDIsvqz_WuDJdBkDMv668h6JAAXYP7CWFWLKzmrLgTE3ySkr59v08dAJ50ez-UoDbvJJFBFbmlioVXnBOMHQX5uaQay9F0lgps04Scf3"
              />
              <div className="absolute -bottom-10 -left-10 bg-surface-container-high p-4 rounded-xl shadow-xl animate-bounce">
                <span className="material-symbols-outlined text-secondary text-4xl">sports_esports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tight mb-2">Power-Up Platters</h2>
            <p className="text-on-surface-variant">Chọn vật phẩm của bạn</p>
          </div>
          <Link to="/menu" className="hidden md:flex items-center gap-1 text-primary font-bold hover:brightness-125 transition-all text-sm uppercase tracking-widest">
            Xem tất cả <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array(4).fill(0).map((_, i) => <ProductSkeleton key={i} />)
            : featuredProducts.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>
      </section>

      {/* Hot Combos */}
      <section className="bg-surface-container-low py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tighter italic">HOT COMBOS</h2>
            <div className="h-1.5 w-24 bg-secondary mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {loading
              ? Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-surface-container-highest p-8 rounded-2xl animate-pulse space-y-4">
                    <div className="h-12 w-12 bg-surface-container-high rounded-full" />
                    <div className="h-6 bg-surface-container-high rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-surface-container-high rounded" />
                      <div className="h-4 bg-surface-container-high rounded w-5/6" />
                    </div>
                    <div className="h-12 bg-surface-container-high rounded-xl" />
                  </div>
                ))
              : combos.map((combo) => (
                  <div key={combo.id} className={`bg-surface-container-highest p-8 rounded-2xl border-l-4 ${combo.borderColor} hover:border-l-8 transition-all relative flex flex-col`}>
                    {combo.badge && (
                      <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold shadow-lg ${
                        combo.id === 'c3' 
                          ? "bg-tertiary-fixed-dim text-on-tertiary-fixed" 
                          : "bg-secondary text-on-secondary"
                      }`}>
                        {combo.badge}
                      </div>
                    )}
                    <div className="flex justify-between mb-6">
                      <span className={`material-symbols-outlined text-${combo.iconColor} text-5xl`}>{combo.icon}</span>
                      <span className={`bg-${combo.discountColor}/20 text-${combo.discountColor} px-3 py-1 rounded-full text-xs font-bold self-start`}>
                        {combo.discount}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-4 min-h-[4rem] flex items-start">{combo.name}</h3>
                    <ul className="space-y-3 mb-8 text-on-surface-variant flex-1">
                      {combo.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-black text-on-surface">{formatPrice(combo.price)}</span>
                      <span className="text-on-surface-variant line-through text-sm">{formatPrice(combo.originalPrice)}</span>
                    </div>
                    <button
                      onClick={() => handleComboOrder(combo)}
                      className={`w-full py-3 rounded-xl font-black hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95 mt-auto ${
                        combo.borderColor === 'border-primary'
                          ? 'bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]'
                          : combo.borderColor === 'border-secondary'
                          ? 'bg-secondary text-on-secondary shadow-[0_0_15px_rgba(255,171,105,0.3)]'
                          : 'bg-tertiary-fixed-dim text-on-secondary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">bolt</span>
                      CHỐT NGAY
                    </button>
                  </div>
                ))
            }
          </div>
        </div>
      </section>
    </div>
  );
}

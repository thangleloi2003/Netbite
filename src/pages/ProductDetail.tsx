import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { productApi } from "../services/api";
import type { Product } from "../types";
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ";
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex text-secondary">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="material-symbols-outlined text-xl"
          style={{
            fontVariationSettings: `'FILL' ${i <= Math.round(rating) ? 1 : 0}`,
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

function RelatedCard({
  product,
}: {
  product: Product;
}) {
  const navigate = useNavigate();
  return (
    <div
      className="min-w-[240px] snap-start group cursor-pointer bg-surface-container-low rounded-xl p-4 transition-all duration-300 hover:translate-y-[-8px] hover:bg-surface-container-high"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="aspect-[4/3] rounded-xl overflow-hidden mb-4">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={product.image}
          alt={product.name}
        />
      </div>
      <h4 className="font-bold text-base mb-1 line-clamp-1">{product.name}</h4>
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-black text-primary">
          {formatPrice(product.price)}
        </span>

      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<Record<string, number | string>>({});
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    
    productApi
      .getById(id)
      .then(async (p) => {
        setProduct(p);
        
        // Initialize default levels
        const defaults: Record<string, number | string> = {};
        p.toppings.forEach(t => {
          if (t.type === 'level' && t.options) {
            defaults[t.id] = t.options[0];
          }
        });
        setSelectedToppings(defaults);

        const relatedProds = await Promise.allSettled(
          (p.relatedIds || [])
            .slice(0, 4)
            .map((rid) => productApi.getById(rid)),
        );
        setRelated(
          relatedProds
            .filter((r) => r.status === "fulfilled")
            .map((r) => (r as PromiseFulfilledResult<Product>).value),
        );
      })
      .catch(() => navigate("/menu"))
      .finally(() => setLoading(false));
  }, [id]);

  const toppingPrice = Object.entries(selectedToppings).reduce((sum, [tid, value]) => {
    const t = product?.toppings.find((t) => t.id === tid);
    if (!t) return sum;
    if (t.type === 'quantifiable' || t.type === 'binary') {
      return sum + t.price * (Number(value) || 0);
    }
    // Level type usually doesn't have extra price per level in this schema, 
    // but if it has a base price for selecting a level at all, we could add it here.
    return sum;
  }, 0);

  const totalPrice = product ? (product.price + toppingPrice) * qty : 0;

  const updateToppingValue = (tid: string, value: number | string) => {
    setSelectedToppings((prev) => ({ ...prev, [tid]: value }));
  };

  const updateToppingQty = (tid: string, delta: number) => {
    setSelectedToppings((prev) => {
      const current = Number(prev[tid]) || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [tid]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [tid]: next };
    });
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Create topping description
    const toppingDetails = Object.entries(selectedToppings)
      .map(([tid, val]) => {
        const t = product.toppings.find((t) => t.id === tid);
        if (!t) return null;
        if (t.type === 'level') return val.toString();
        if (t.type === 'binary' && val === 1) return t.label;
        if (t.type === 'quantifiable' && Number(val) > 0) {
          return Number(val) > 1 ? `${val}x ${t.label}` : t.label;
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");

    addItem(
      {
        id: product.id,
        name: product.name + (toppingDetails ? ` (${toppingDetails})` : ""),
        price: product.price + toppingPrice,
        image: product.image,
      },
      qty,
    );
    if (isAuthenticated) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      addItem(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
        qty,
      );
      return; // The CartContext will show the login prompt
    }
    
    const toppingDetails = Object.entries(selectedToppings)
      .map(([tid, val]) => {
        const t = product.toppings.find((t) => t.id === tid);
        if (!t) return null;
        if (t.type === 'level') return val.toString();
        if (t.type === 'binary' && val === 1) return t.label;
        if (t.type === 'quantifiable' && Number(val) > 0) {
          return Number(val) > 1 ? `${val}x ${t.label}` : t.label;
        }
        return null;
      })
      .filter(Boolean)
      .join(", ");

    addItem(
      {
        id: product.id,
        name: product.name + (toppingDetails ? ` (${toppingDetails})` : ""),
        price: product.price + toppingPrice,
        image: product.image,
      },
      qty,
    );
    navigate("/checkout");
  };

  if (loading) {
    return (
      <main className="pt-32 pb-12 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="aspect-[4/3] bg-surface-container-low rounded-xl animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-surface-container-low rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-12 bg-surface-container-low rounded animate-pulse w-3/4" />
            <div className="h-8 bg-surface-container-low rounded animate-pulse w-1/3" />
            <div className="h-24 bg-surface-container-low rounded animate-pulse" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];

  return (
    <main className="pt-32 pb-12 max-w-7xl mx-auto px-6">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-slate-400 font-bold tracking-widest uppercase flex items-center gap-2">
        <Link to="/menu" className="hover:text-primary transition-colors">
          Menu
        </Link>
        <span>/</span>
        <span className="text-primary line-clamp-1">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-container-low group cursor-zoom-in">
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={images[activeImg]}
              alt={product.name}
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${
                    activeImg === idx
                      ? "border-2 border-primary"
                      : "opacity-60 hover:opacity-100 hover:scale-105"
                  }`}
                >
                  <img
                    className="w-full h-full object-cover"
                    src={img}
                    alt={`${product.name} ${idx + 1}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {product.tags.includes("hot") && (
                <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                  🔥 Hot
                </span>
              )}
              {product.tags.includes("bestseller") && (
                <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold uppercase">
                  ⭐ Best Seller
                </span>
              )}
            </div>

            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter leading-none">
              {product.name}
            </h1>

            <div className="flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm font-bold text-on-surface-variant">
                ({product.rating} • {product.reviewCount.toLocaleString()} đánh
                giá)
              </span>
            </div>

            <div className="text-5xl font-black text-primary tracking-tighter">
              {formatPrice(product.price + toppingPrice)}
            </div>
          </div>

          {/* Toppings (Buff Topping) */}
          {product.toppings.length > 0 && (
            <div className="space-y-6">
              <label className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">extension</span>
                Tùy chọn Buff Topping
              </label>
              
              <div className="grid grid-cols-1 gap-6">
                {product.toppings.map((t) => {
                  const currentValue = selectedToppings[t.id];
                  
                  // 1. LEVEL SELECTOR (Pill style)
                  if (t.type === 'level' && t.options) {
                    return (
                      <div key={t.id} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-on-surface-variant text-lg">{t.icon}</span>
                          <span className="font-bold text-on-surface">{t.label}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {t.options.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => updateToppingValue(t.id, opt)}
                              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                currentValue === opt
                                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-105"
                                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // 2. BINARY ADD-ON (Checkbox/Card style)
                  if (t.type === 'binary') {
                    const isSelected = currentValue === 1;
                    return (
                      <div
                        key={t.id}
                        onClick={() => updateToppingValue(t.id, isSelected ? 0 : 1)}
                        className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                          isSelected
                            ? "bg-primary/[0.08] border-primary shadow-md"
                            : "bg-surface-container-low border-transparent hover:border-outline-variant"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"}`}>
                            <span className="material-symbols-outlined text-xl">{t.icon}</span>
                          </div>
                          <div>
                            <div className="font-bold text-on-surface">{t.label}</div>
                            {t.price > 0 && (
                              <div className="text-xs font-bold text-secondary">+{formatPrice(t.price)}</div>
                            )}
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-outline-variant"}`}>
                          {isSelected && <span className="material-symbols-outlined text-white text-sm font-bold">check</span>}
                        </div>
                      </div>
                    );
                  }

                  // 3. QUANTIFIABLE ADD-ON (+/- style)
                  if (t.type === 'quantifiable') {
                    const currentQty = Number(currentValue) || 0;
                    const isSelected = currentQty > 0;
                    return (
                      <div
                        key={t.id}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border-2 ${
                          isSelected
                            ? "bg-primary/[0.08] border-primary shadow-md"
                            : "bg-surface-container-low border-transparent hover:border-outline-variant"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"}`}>
                            <span className="material-symbols-outlined text-xl">{t.icon}</span>
                          </div>
                          <div>
                            <div className="font-bold text-on-surface">{t.label}</div>
                            {t.price > 0 && (
                              <div className="text-xs font-bold text-secondary">+{formatPrice(t.price)}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center bg-surface-container-highest rounded-full p-1 border border-outline-variant/10">
                          <button
                            onClick={() => updateToppingQty(t.id, -1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-primary disabled:opacity-30"
                            disabled={!isSelected}
                          >
                            <span className="material-symbols-outlined text-base">remove</span>
                          </button>
                          <span className={`w-8 text-center text-sm font-black ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>
                            {currentQty}
                          </span>
                          <button
                            onClick={() => updateToppingQty(t.id, 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors text-primary"
                          >
                            <span className="material-symbols-outlined text-base">add</span>
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
          )}

          {/* Qty + Actions */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch w-full">
              {/* Quantity */}
              <div className="flex items-center justify-between bg-surface-container-highest rounded-full p-1.5 w-full sm:w-[150px] border border-outline-variant/20 shadow-inner">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-primary active:scale-90"
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>
                <span className="flex-1 text-center text-xl font-black">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-primary active:scale-90"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 font-bold px-8 h-[60px] border-2 rounded-full transition-all active:scale-95 whitespace-nowrap ${
                  added
                    ? "bg-green-500 text-white border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                    : "text-primary border-primary/20 hover:bg-primary/5 hover:border-primary/50"
                }`}
              >
                <span className="material-symbols-outlined">
                  {added ? "check" : "add_shopping_cart"}
                </span>
                <span className="text-[15px] sm:text-base">{added ? "Đã thêm!" : "Thêm giỏ"}</span>
              </button>
            </div>

            {/* Buy Now Button (Full Width Below) */}
            <button
              onClick={handleBuyNow}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-rose-500 text-on-primary h-[68px] sm:h-[72px] flex items-center justify-between p-2.5 rounded-full hover:shadow-[0_0_40px_rgba(255,141,140,0.5)] transition-all active:scale-95 mt-2"
            >
              <div className="flex items-center gap-3 pl-6 sm:pl-8">
                <span className="text-lg sm:text-xl font-black tracking-widest whitespace-nowrap uppercase">CHỐT NGAY</span>
                <span className="material-symbols-outlined text-2xl transition-transform duration-300 group-hover:translate-x-2">arrow_right_alt</span>
              </div>
              <div className="bg-black/20 backdrop-blur-md px-6 sm:px-8 py-3 rounded-full text-lg sm:text-xl font-extrabold flex items-center shadow-inner">
                {formatPrice(totalPrice)}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Details + Nutrition */}
      <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-3xl font-black tracking-tighter italic">
            CHI TIẾT VẬT PHẨM
          </h3>
          <div className="h-1.5 w-16 bg-secondary rounded-full" />

          <p className="text-on-surface-variant leading-relaxed text-lg">
            {product.description}
          </p>

          {product.badges.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {product.badges.map((b, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-surface-container-low flex flex-col items-center gap-2 text-center hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {b.icon}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest">
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-container-highest rounded-xl p-8 space-y-6 flex flex-col justify-center border-l-4 border-primary shadow-lg">
          <h4 className="text-2xl font-black">Chỉ số sinh tồn</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
              <span className="text-on-surface-variant font-bold">Calo</span>
              <span className="font-black text-secondary">
                {product.calories} kcal
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
              <span className="text-on-surface-variant font-bold">Protein</span>
              <span className="font-black text-secondary">
                {product.protein}g
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/30">
              <span className="text-on-surface-variant font-bold">
                Chất béo
              </span>
              <span className="font-black text-secondary">{product.fat}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="mt-20 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-3xl font-black tracking-tighter italic">
                VẬT PHẨM ĐI KÈM
              </h3>
              <div className="h-1.5 w-16 bg-secondary mt-2 rounded-full" />
            </div>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none">
            {related.map((p) => (
              <RelatedCard
                key={p.id}
                product={p}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

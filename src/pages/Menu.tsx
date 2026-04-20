import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { productApi, categoryApi, comboApi } from "../services/api";
import type { Product, Category, Combo } from "../types";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ";
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-surface-container-low rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-8px] hover:bg-surface-container-high">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden relative">
          <img
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            src={product.image}
            alt={product.name}
          />
          {product.tags.includes("hot") && (
            <div className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest text-on-primary">
              Hot
            </div>
          )}
          {product.tags.includes("bestseller") && (
            <div className="absolute top-3 right-3 bg-secondary/90 backdrop-blur px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest text-on-secondary">
              Bestseller
            </div>
          )}
        </div>
      </Link>
      <div className="p-4 leading-tight">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-base font-bold mb-2 line-clamp-2 min-h-[2.5rem] hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mt-3">
          <span className="text-xl font-black text-primary">
            {formatPrice(product.price)}
          </span>
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

// 3 color themes cycling for dynamic product combos
const DYNAMIC_THEMES = [
  {
    borderColor: "border-primary",
    iconColor: "primary",
    discountColor: "primary",
    btnClass: "bg-primary text-on-primary shadow-primary/20",
    iconBg: "bg-primary/10",
  },
  {
    borderColor: "border-secondary",
    iconColor: "secondary",
    discountColor: "secondary",
    btnClass: "bg-secondary text-on-secondary shadow-secondary/20",
    iconBg: "bg-secondary/10",
  },
  {
    borderColor: "border-tertiary-fixed-dim",
    iconColor: "tertiary-fixed-dim",
    discountColor: "tertiary-fixed-dim",
    btnClass: "bg-tertiary-fixed-dim text-on-secondary",
    iconBg: "bg-tertiary-fixed-dim/10",
  },
];

function ComboCard({
  combo,
  product,
  allProducts,
  index = 0,
}: {
  combo?: Combo;
  product?: Product;
  allProducts: Product[];
  index?: number;
}) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [adding, setAdding] = useState(false);

  // Determine which data source to use
  const isDynamic = !!product;
  const theme = DYNAMIC_THEMES[index % 3];

  const id = isDynamic ? product.id : combo!.id;
  const name = isDynamic ? product.name : combo!.name;
  const price = isDynamic ? product.price : combo!.price;
  const originalPrice = isDynamic
    ? product.originalPrice
    : combo!.originalPrice;
  const DYNAMIC_ICONS = ['local_fire_department', 'bolt', 'celebration', 'military_tech', 'workspace_premium', 'emoji_events', 'diamond', 'auto_awesome'];
  const dynamicIcon = product?.icon || (() => { const h = (product?.id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0); return DYNAMIC_ICONS[h % DYNAMIC_ICONS.length]; })();
  const icon = isDynamic ? dynamicIcon : combo!.icon;
  const iconColor = isDynamic ? theme.iconColor : combo!.iconColor;
  const borderColor = isDynamic ? theme.borderColor : combo!.borderColor;
  const discountLabel = isDynamic
    ? originalPrice
      ? `-${Math.round((1 - price / originalPrice) * 100)}% OFF`
      : "COMBO"
    : combo!.discount;
  const discountColor = isDynamic ? theme.discountColor : combo!.discountColor;

  // Format items list
  const items = isDynamic
    ? product.comboItems?.map((item) => {
        const p = allProducts.find((ap) => ap.id === item.productId);
        return `${item.quantity}x ${p ? p.name : "Sản phẩm"}`;
      }) || []
    : combo!.items;

  const handleAdd = async () => {
    if (isDynamic) {
      // Dynamic combo logic: Add all products in combo to cart
      if (product.comboItems && product.comboItems.length > 0) {
        const results = await Promise.allSettled(
          product.comboItems.map((item) => productApi.getById(item.productId)),
        );
        results.forEach((r, idx) => {
          if (r.status === "fulfilled") {
            const p = r.value;
            const qty = product.comboItems![idx].quantity;
            addItem(
              { id: p.id, name: p.name, price: p.price, image: p.image },
              qty,
            );
          }
        });
      }
    } else {
      // Static combo logic
      if (combo!.productIds && combo!.productIds.length > 0) {
        const results = await Promise.allSettled(
          combo!.productIds.map((id) => productApi.getById(id)),
        );
        results.forEach((r) => {
          if (r.status === "fulfilled") {
            const p = r.value;
            addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
          }
        });
      } else {
        addItem({
          id: combo!.id,
          name: combo!.name,
          price: combo!.price,
          image: "",
        });
      }
    }

    if (isAuthenticated) {
      setAdding(true);
      setTimeout(() => setAdding(false), 1000);
    }
  };

  const isPentakill = !isDynamic && id === "c3";
  // Button style
  const resolvedBtnClass = isDynamic
    ? theme.btnClass
    : isPentakill
      ? "bg-tertiary-fixed-dim text-on-secondary"
      : borderColor === "border-primary"
        ? "bg-primary text-on-primary shadow-primary/20"
        : "bg-secondary text-on-secondary shadow-secondary/20";
  // Icon bg
  const resolvedIconBg = isDynamic
    ? theme.iconBg
    : isPentakill
      ? "bg-tertiary-fixed-dim/10"
      : "bg-white/5";

  return (
    <div
      className={`bg-surface-container-highest p-4 rounded-2xl relative border-l-[4px] ${
        isPentakill ? "border-tertiary-fixed-dim" : borderColor
      } hover:border-l-[6px] transition-all relative flex flex-col gap-3`}
    >
      {/* Icon + Discount */}
      <div className="flex justify-between items-center">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${resolvedIconBg}`}
        >
          <span
            className={`material-symbols-outlined text-2xl text-${iconColor}`}
          >
            {icon}
          </span>
        </div>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider bg-${discountColor}/10 text-${discountColor}`}
        >
          {discountLabel}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-black tracking-tight leading-snug">
        {name}
      </h3>

      {/* Items list */}
      <ul className="space-y-1.5 flex-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-1.5 text-[11px] font-bold text-on-surface-variant leading-normal"
          >
            <span
              className={`material-symbols-outlined text-[13px] mt-0.5 shrink-0 ${isPentakill ? "text-tertiary-fixed-dim" : "text-secondary"}`}
            >
              check_circle
            </span>
            {item}
          </li>
        ))}
      </ul>

      {/* Price */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-xl font-black text-on-surface tracking-tighter">
          {formatPrice(price)}
        </span>
        {originalPrice && originalPrice > price && (
          <span className="text-on-surface-variant/30 line-through text-xs font-medium italic">
            {formatPrice(originalPrice)}
          </span>
        )}
      </div>

      {/* Button */}
      <button
        onClick={handleAdd}
        disabled={adding}
        className={`w-full py-2.5 rounded-xl font-black hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-70 shadow-md text-[10px] tracking-widest uppercase ${resolvedBtnClass}`}
      >
        <span className="material-symbols-outlined text-sm font-black">
          {adding ? "check" : "bolt"}
        </span>
        {adding ? "ĐÃ CHỐT!" : "CHỐT NGAY"}
      </button>
    </div>
  );
}

type TabType = "all" | "combo" | string;
type PriceRange = "under50" | "50to100" | "over100";
type SortType = "newest" | "price_asc" | "price_desc" | "bestseller";

const PRICE_RANGES: { value: PriceRange; label: string }[] = [
  { value: "under50", label: "Dưới 50.000đ" },
  { value: "50to100", label: "50.000đ – 100.000đ" },
  { value: "over100", label: "Trên 100.000đ" },
];

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: "newest", label: "Mới nhất" },
  { value: "price_asc", label: "Giá: Thấp đến cao" },
  { value: "price_desc", label: "Giá: Cao xuống thấp" },
  { value: "bestseller", label: "Bán chạy nhất" },
];

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [loading, setLoading] = useState(true);
  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [sortBy, setSortBy] = useState<SortType>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([categoryApi.getAll(), comboApi.getAll(), productApi.getAll()])
      .then(([cats, combosData, productsData]) => {
        setCategories(cats);
        setCombos(combosData);
        setAllProducts(productsData);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params =
      activeTab !== "all" && activeTab !== "combo"
        ? { category: activeTab }
        : undefined;

    // When activeTab is "combo", we want to show products with category "combo"
    const productParams =
      activeTab === "combo" ? { category: "combo" } : params;

    productApi
      .getAll(productParams)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const togglePriceRange = (range: PriceRange) => {
    setPriceRanges((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range],
    );
  };

  const filteredAndSorted = [...products]
    .filter((p) => {
      // Hidden products with category "combo" when in "all" tab
      if (activeTab === "all" && p.category === "combo") return false;

      // Bestseller filter
      if (sortBy === "bestseller" && !p.tags.includes("bestseller"))
        return false;

      // Price range filter
      if (priceRanges.length === 0) return true;
      return priceRanges.some((r) => {
        if (r === "under50") return p.price < 50000;
        if (r === "50to100") return p.price >= 50000 && p.price <= 100000;
        if (r === "over100") return p.price > 100000;
        return true;
      });
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "bestseller") {
        const aBest = a.tags.includes("bestseller") ? 1 : 0;
        const bBest = b.tags.includes("bestseller") ? 1 : 0;
        if (aBest !== bBest) return bBest - aBest;
        return 0;
      }
      return 0;
    });

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? "Mới nhất";
  const hasActiveFilters = priceRanges.length > 0;

  return (
    <main className="pt-28 pb-24 max-w-6xl w-full mx-auto px-6">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight mb-2">
          Toàn bộ thực đơn
        </h1>
        <p className="text-on-surface-variant">
          Khám phá và chọn vật phẩm của bạn
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 shrink-0 space-y-6 lg:sticky lg:top-20 z-20">
          {/* Category */}
          <section className="bg-[#2c0411] rounded-2xl p-4 border border-white/5">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[12px]">
                category
              </span>
              Danh mục
            </h3>
            <div className="space-y-0.5">
              <button
                onClick={() => setActiveTab("all")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs ${
                  activeTab === "all"
                    ? "bg-surface-container-high text-primary border border-primary/20 shadow-lg"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                Tất cả{" "}
                <span className="material-symbols-outlined text-[14px]">
                  apps
                </span>
              </button>

              <button
                onClick={() => setActiveTab("combo")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs ${
                  activeTab === "combo"
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                Combo
                <span className="material-symbols-outlined text-[14px]">
                  local_fire_department
                </span>
              </button>

              {categories
                .filter((c) => c.slug !== "combo")
                .map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.slug)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold text-xs ${
                      activeTab === cat.slug
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    }`}
                  >
                    {cat.name}
                    <span className="material-symbols-outlined text-[14px]">
                      {cat.icon}
                    </span>
                  </button>
                ))}
            </div>
          </section>

          {/* Price Range Filter */}
          {activeTab !== "combo" && (
            <section className="bg-surface-container-low rounded-2xl p-4 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant/50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[12px]">
                    payments
                  </span>
                  Khoảng giá
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={() => setPriceRanges([])}
                    className="text-[10px] text-primary font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-xs">
                      close
                    </span>
                    Xóa
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {PRICE_RANGES.map((range) => {
                  const checked = priceRanges.includes(range.value);
                  return (
                    <button
                      key={range.value}
                      onClick={() => togglePriceRange(range.value)}
                      className={`w-full flex items-center gap-3 py-2 px-1 rounded-lg transition-all duration-200 group text-left ${
                        checked
                          ? "text-primary"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {/* Custom checkbox */}
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                          checked
                            ? "bg-primary border-primary shadow-[0_0_8px_rgba(255,141,140,0.4)]"
                            : "border-outline-variant/40 group-hover:border-primary/50"
                        }`}
                      >
                        {checked && (
                          <span className="material-symbols-outlined text-on-primary text-[13px] leading-none font-black">
                            check
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-bold transition-colors ${checked ? "text-primary" : ""}`}
                      >
                        {range.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Hot Deal Banner */}
          <div className="bg-surface-container-highest p-4 rounded-2xl border-l-4 border-secondary hover:border-l-8 transition-all relative overflow-hidden group cursor-pointer">
            <div className="relative z-10">
              <span className="bg-secondary/20 text-secondary px-2 py-0.5 rounded-full text-[9px] font-black uppercase mb-3 inline-block">
                HOT DEAL
              </span>
              <p className="text-lg font-black mb-1">Power-Up Pack</p>
              <p className="text-[11px] text-on-surface-variant mb-4 leading-relaxed opacity-70">
                Nạp năng lượng tối đa cho những trận leo rank căng thẳng.
              </p>
              <button
                onClick={() => setActiveTab("combo")}
                className="bg-secondary text-on-secondary px-3 py-1.5 rounded-lg font-bold hover:bg-primary transition-colors text-[10px] active:scale-95"
              >
                KHÁM PHÁ
              </button>
            </div>
            <span className="material-symbols-outlined absolute -right-3 -bottom-3 text-7xl text-secondary opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-500 select-none">
              sports_esports
            </span>
          </div>
        </aside>

        {/* Content */}
        <section className="flex-1 min-w-0">
          {activeTab === "combo" ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-black tracking-tighter italic">
                  HOT COMBOS 🔥
                </h2>
                <p className="text-on-surface-variant text-sm mt-1">
                  Tiết kiệm hơn khi mua theo combo
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Render static combos */}
                {combos.map((c) => (
                  <ComboCard key={c.id} combo={c} allProducts={allProducts} />
                ))}
                {/* Render product-based combos */}
                {products.map((p, i) => (
                  <ComboCard
                    key={p.id}
                    product={p}
                    allProducts={allProducts}
                    index={i}
                  />
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <span className="text-on-surface-variant font-bold text-sm shrink-0">
                  {loading
                    ? "Đang tải..."
                    : `Hiển thị ${filteredAndSorted.length} món ăn`}
                  {hasActiveFilters && (
                    <span className="ml-2 bg-primary/15 text-primary px-2 py-0.5 rounded-full text-xs">
                      Đang lọc
                    </span>
                  )}
                </span>

                {/* Sort Dropdown */}
                <div className="relative shrink-0" ref={sortRef}>
                  <button
                    onClick={() => setSortOpen((o) => !o)}
                    className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/20 hover:border-primary/40 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 min-w-[170px] justify-between group"
                  >
                    <span className="text-on-surface">{currentSortLabel}</span>
                    <span
                      className={`material-symbols-outlined text-base text-on-surface-variant transition-transform duration-300 ${sortOpen ? "rotate-180" : ""}`}
                    >
                      expand_more
                    </span>
                  </button>

                  {sortOpen && (
                    <div
                      className="absolute right-0 top-[calc(100%+6px)] w-56 bg-surface-container-high border border-outline-variant/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                      style={{ animation: "fadeInDown 0.15s ease" }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSortBy(opt.value);
                            setSortOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3.5 text-sm font-bold transition-all flex items-center gap-3 ${
                            sortBy === opt.value
                              ? "bg-primary text-on-primary"
                              : "text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface"
                          }`}
                        >
                          {sortBy === opt.value && (
                            <span className="material-symbols-outlined text-sm">
                              check
                            </span>
                          )}
                          <span className={sortBy !== opt.value ? "pl-6" : ""}>
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {loading ? (
                  Array(6)
                    .fill(0)
                    .map((_, i) => <ProductSkeleton key={i} />)
                ) : filteredAndSorted.length === 0 ? (
                  <div className="col-span-3 text-center py-24 text-on-surface-variant">
                    <span className="material-symbols-outlined text-6xl mb-4 block opacity-40">
                      search_off
                    </span>
                    <p className="font-bold text-lg mb-2">
                      Không tìm thấy sản phẩm nào.
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={() => setPriceRanges([])}
                        className="mt-2 text-primary font-bold hover:underline text-sm"
                      >
                        Xóa bộ lọc giá →
                      </button>
                    )}
                  </div>
                ) : (
                  filteredAndSorted.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

import { useNavigate } from "react-router-dom";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { useState, useRef, useEffect } from "react";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const {
    paginatedProducts,
    categories,
    loading, 
    filter, 
    setFilter, 
    search, 
    setSearch, 
    page,
    setPage,
    totalPages,
    deleteProduct, 
    toggleBestSeller,
    toggleHot
  } = useAdminProducts();

  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">QUẢN LÝ SẢN PHẨM</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group h-[50px] w-full sm:w-auto">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Tìm kiếm món ăn..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 h-full bg-surface-container-low border border-white/5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium text-sm w-full sm:w-[280px]"
            />
          </div>

          <div className="relative w-full sm:w-[260px]" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="pl-6 pr-5 h-[50px] w-full bg-surface-container-low border border-white/5 rounded-full focus:outline-none transition-all font-black text-xs uppercase tracking-widest cursor-pointer text-on-surface flex items-center justify-between shadow-inner focus:ring-2 focus:ring-primary/40 hover:bg-surface-container-high"
            >
              <span className="truncate">{filter === 'all' ? 'TẤT CẢ DANH MỤC' : categories.find(c => c.slug === filter)?.name.toUpperCase() || 'DANH MỤC'}</span>
              <span className={`material-symbols-outlined text-[20px] text-primary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
            </button>

            <div 
              className={`absolute top-[calc(100%+8px)] left-0 w-full bg-[#2c131a] border border-white/10 rounded-[20px] shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-[60] overflow-hidden transition-all duration-300 origin-top flex flex-col ${isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
            >
              {[
                { value: "all", label: "TẤT CẢ DANH MỤC" },
                ...categories.map(c => ({ value: c.slug, label: c.name.toUpperCase() }))
              ].map((opt) => {
                const isSelected = opt.value === filter;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setFilter(opt.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3.5 flex items-center gap-3 transition-colors ${
                      isSelected 
                        ? 'bg-[#FF8D8C] text-[#2c131a] font-black'
                        : 'text-[#eac2c9] font-bold hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {isSelected ? (
                      <span className="material-symbols-outlined text-[18px] font-black">check</span>
                    ) : (
                      <span className="w-[18px]"></span>
                    )}
                    <span className="text-xs uppercase tracking-widest">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            onClick={() => navigate("create")}
            className="px-8 h-[50px] shrink-0 bg-secondary text-on-secondary text-sm font-black rounded-full shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:shadow-[0_0_30px_rgba(255,193,7,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-widest flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="material-symbols-outlined font-black text-[20px]">add</span>
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-surface-container-low p-4 rounded-3xl border border-white/5 animate-pulse h-[350px]"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <div key={product.id} className={`group bg-surface-container-low p-4 rounded-3xl border hover:-translate-y-2 transition-all duration-300 shadow-xl flex flex-col relative ${
                product.category === 'combo' ? 'border-primary/40 hover:border-primary/60 bg-primary/5' : 'border-white/5 hover:border-white/10'
              }`}>
                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-surface-container-highest">
                  {product.category === 'combo' ? (
                    <div className="w-full h-full bg-primary/10 flex flex-col items-center justify-center p-6 text-center">
                       <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-5xl font-black text-primary">auto_awesome</span>
                       </div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Combo Package</h4>
                    </div>
                  ) : (
                    <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={product.image} alt={product.name} />
                  )}

                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button 
                      onClick={() => toggleBestSeller(product.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        product.tags.includes("bestseller") 
                          ? "bg-secondary text-on-secondary shadow-[0_0_15px_rgba(255,193,7,0.4)]" 
                          : "bg-black/20 text-white/70 hover:bg-black/40 hover:text-white"
                      }`}
                      title={product.tags.includes("bestseller") ? "Gỡ Best Seller" : "Đánh dấu Best Seller"}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${product.tags.includes("bestseller") ? "fill-1" : ""}`} style={{ fontVariationSettings: product.tags.includes("bestseller") ? "'FILL' 1" : "" }}>
                        star
                      </span>
                    </button>

                    <button 
                      onClick={() => toggleHot(product.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                        product.tags.includes("hot") 
                          ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.4)]" 
                          : "bg-black/20 text-white/70 hover:bg-black/40 hover:text-white"
                      }`}
                      title={product.tags.includes("hot") ? "Gỡ Hot" : "Đánh dấu Hot"}
                    >
                      <span className={`material-symbols-outlined text-[20px] ${product.tags.includes("hot") ? "fill-1" : ""}`} style={{ fontVariationSettings: product.tags.includes("hot") ? "'FILL' 1" : "" }}>
                        local_fire_department
                      </span>
                    </button>
                  </div>

                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.category === 'combo' && (
                      <span className="bg-primary text-on-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg w-fit">Combo</span>
                    )}
                    {product.tags.includes("bestseller") && (
                      <span className="bg-secondary/90 backdrop-blur-sm text-on-secondary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg w-fit">Bestseller</span>
                    )}
                    {product.tags.includes("hot") && (
                      <span className="bg-primary/90 backdrop-blur-sm text-on-primary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg w-fit">Hot</span>
                    )}
                  </div>
                </div>
                <div className="flex-grow flex flex-col">
                  <h3 className="text-lg font-black tracking-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-primary font-black text-2xl mb-5 tracking-tighter">{product.price.toLocaleString('vi-VN')}đ</p>

                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => navigate(`edit/${product.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-surface-container-high text-on-surface py-3 rounded-full hover:bg-primary hover:text-white transition-colors text-sm font-bold border border-transparent hover:border-primary/50"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="w-12 h-12 flex items-center justify-center bg-surface-container-high text-on-surface-variant rounded-full hover:bg-error hover:text-white transition-colors border border-transparent hover:border-error/50"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-low border border-white/5 text-on-surface hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-surface-container-low disabled:hover:text-on-surface transition-all"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              
              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-10 h-10 rounded-full text-xs font-black transition-all ${
                      page === i + 1 
                        ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.4)] scale-110" 
                        : "bg-surface-container-low text-on-surface-variant hover:text-white"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-low border border-white/5 text-on-surface hover:bg-primary hover:text-white disabled:opacity-30 disabled:hover:bg-surface-container-low disabled:hover:text-on-surface transition-all"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../services/api";
import type { Product } from "../../types";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productApi.delete(id);
        setProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const filteredProducts = products.filter((p) => {
    if (filter === "all") return true;
    return p.category === filter;
  });

  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">QUẢN LÝ SẢN PHẨM</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Quản lý thực đơn và cập nhật món ăn theo thời gian thực.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-surface-container-low p-1.5 rounded-full border border-white/5 flex shadow-inner">
            <button 
              onClick={() => setFilter("all")}
              className={`px-6 py-2.5 text-xs font-black rounded-full transition-all uppercase tracking-wider ${filter === "all" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]" : "text-on-surface-variant hover:text-white"}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFilter("food")}
              className={`px-6 py-2.5 text-xs font-black rounded-full transition-all uppercase tracking-wider ${filter === "food" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]" : "text-on-surface-variant hover:text-white"}`}
            >
              Đồ ăn
            </button>
            <button 
              onClick={() => setFilter("drink")}
              className={`px-6 py-2.5 text-xs font-black rounded-full transition-all uppercase tracking-wider ${filter === "drink" ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(255,141,140,0.3)]" : "text-on-surface-variant hover:text-white"}`}
            >
              Đồ uống
            </button>
          </div>

          <button 
            onClick={() => navigate("create")}
            className="px-8 py-3 bg-secondary text-on-secondary text-sm font-black rounded-full shadow-[0_0_20px_rgba(255,193,7,0.3)] hover:shadow-[0_0_30px_rgba(255,193,7,0.5)] hover:-translate-y-1 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined font-black">add</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group bg-surface-container-low p-4 rounded-3xl border border-white/5 hover:border-white/10 hover:-translate-y-2 transition-all duration-300 shadow-xl flex flex-col">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-surface-container-highest">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={product.image} alt={product.name} />
                {product.reviewCount > 50 && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-secondary/90 backdrop-blur-sm text-on-secondary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Bestseller</span>
                  </div>
                )}
              </div>
              <div className="flex-grow flex flex-col">
                <h3 className="text-lg font-black tracking-tight mb-1 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-primary font-black text-2xl mb-5 tracking-tighter">{product.price.toLocaleString('vi-VN')}đ</p>

                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-surface-container-high text-on-surface py-3 rounded-full hover:bg-primary hover:text-white transition-colors text-sm font-bold border border-transparent hover:border-primary/50">
                    <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="w-12 h-12 flex items-center justify-center bg-surface-container-high text-on-surface-variant rounded-full hover:bg-error hover:text-white transition-colors border border-transparent hover:border-error/50"
                  >
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

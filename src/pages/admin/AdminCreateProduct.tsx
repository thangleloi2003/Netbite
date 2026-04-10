import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { productApi, categoryApi } from "../../services/api";
import type { Category, Product } from "../../types";

export default function AdminCreateProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    price: 0,
    originalPrice: null,
    image: "",
    images: [],
    category: "",
    description: "",
    tags: [],
    rating: 5,
    reviewCount: 0,
    calories: 0,
    protein: 0,
    fat: 0,
    badges: [],
    toppings: [],
    relatedIds: [],
  });

  useEffect(() => {
    categoryApi.getAll().then(setCategories).catch(console.error);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "originalPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await productApi.create(formData);
      navigate("/admin/products");
    } catch (err) {
      setError("Failed to create product. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 space-y-10 max-w-4xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">THÊM SẢN PHẨM MỚI</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Tạo món ăn mới cho thực đơn của bạn.</p>
        </div>
        
        <button 
          onClick={() => navigate("/admin/products")}
          className="px-6 py-2.5 bg-surface-container-high text-on-surface text-xs font-black rounded-full border border-white/5 hover:bg-surface-container-highest transition-all uppercase tracking-wider flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-container-low p-8 rounded-3xl border border-white/5 shadow-2xl space-y-8">
        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-2xl text-sm font-bold">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tên sản phẩm */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-on-surface-variant ml-1">Tên sản phẩm</label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="VD: Burger Bò Đặc Biệt"
              className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>

          {/* Danh mục */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-on-surface-variant ml-1">Danh mục</label>
            <select
              required
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Giá bán */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-on-surface-variant ml-1">Giá bán (VNĐ)</label>
            <input
              required
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="VD: 45000"
              className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>

          {/* Giá gốc (nếu có) */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-on-surface-variant ml-1">Giá gốc (nếu có)</label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice || ""}
              onChange={handleChange}
              placeholder="VD: 55000"
              className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>

          {/* Hình ảnh URL */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-on-surface-variant ml-1">Link hình ảnh</label>
            <input
              required
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
            />
          </div>

          {/* Mô tả */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-on-surface-variant ml-1">Mô tả sản phẩm</label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
              className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            disabled={loading}
            type="submit"
            className="w-full py-5 bg-primary text-on-primary font-black rounded-2xl shadow-[0_0_20px_rgba(255,141,140,0.4)] hover:shadow-[0_0_30px_rgba(255,141,140,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-widest disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined font-black">add_circle</span>
                Tạo sản phẩm
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

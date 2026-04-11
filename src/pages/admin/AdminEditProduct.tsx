import { useParams, useNavigate } from "react-router-dom";
import { useProductForm } from "../../hooks/useProductForm";
import type { Product } from "../../types";

export default function AdminEditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    formData, 
    categories, 
    loading, 
    initialLoading, 
    error, 
    handleChange, 
    handleSubmit 
  } = useProductForm({ productId: id });

  const productForm = formData as Partial<Product>;

  if (initialLoading) {
    return <div className="p-8 text-center text-on-surface-variant">Đang tải dữ liệu...</div>;
  }

  return (
    <main className="p-8 space-y-10 max-w-4xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">CẬP NHẬT SẢN PHẨM</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Chỉnh sửa thông tin món ăn.</p>
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
              value={productForm.name || ""}
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
              value={productForm.category || ""}
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
              value={productForm.price || 0}
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
              value={productForm.originalPrice || ""}
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
              value={productForm.image || ""}
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
              value={productForm.description || ""}
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
                <span className="material-symbols-outlined font-black">save</span>
                Cập nhật sản phẩm
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

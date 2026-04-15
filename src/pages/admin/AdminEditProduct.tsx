import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useProductForm } from "../../hooks/useProductForm";
import { useFormat } from "../../hooks/useFormat";
import type { Product } from "../../types";

export default function AdminEditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newOption, setNewOption] = useState<{ [key: number]: string }>({});
  const { 
    formData, 
    categories, 
    loading, 
    initialLoading, 
    error, 
    success,
    handleChange, 
    handleSubmit,
    addTopping,
    removeTopping,
    updateTopping,
    addToppingOption,
    removeToppingOption,
    setDiscount,
    discountPercentage,
    allProducts,
    addComboItem,
    removeComboItem,
    updateComboItemQuantity,
  } = useProductForm({ productId: id });

  const productForm = formData as Partial<Product>;
  const { formatPrice } = useFormat();

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
          <div className="bg-error/10 border border-error/20 text-error p-4 rounded-2xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl text-sm font-bold flex items-center gap-2 animate-bounce">
            <span className="material-symbols-outlined">check_circle</span>
            Sản phẩm đã được cập nhật thành công! Đang chuyển hướng...
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

          {/* Giảm giá (%) */}
          <div className="space-y-2">
            <label className="text-sm font-black uppercase tracking-widest text-on-surface-variant ml-1">
              Giảm giá (%)
            </label>
            <div className="relative group">
              <input
                type="number"
                min="0"
                max="100"
                value={discountPercentage || ""}
                onChange={(e) => setDiscount(Number(e.target.value))}
                disabled={!productForm.originalPrice}
                placeholder={!productForm.originalPrice ? "Nhập giá gốc trước" : "VD: 10"}
                className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-on-surface-variant font-black">%</span>
            </div>
          </div>

          {/* Hình ảnh URL */}
          {productForm.category !== "combo" && (
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
          )}

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

          {/* Combo Builder (Only for Combo Category) */}
          {productForm.category === "combo" && (
            <div className="md:col-span-2 space-y-6 pt-6 border-t border-white/10 bg-primary/5 p-6 rounded-[32px]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-primary">Xây dựng Combo</h3>
                  <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest mt-1">Chọn các món ăn có trong combo này</p>
                </div>
                <div className="bg-surface-container-high px-4 py-2 rounded-2xl border border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-0.5">Tổng giá trị gốc</span>
                  <span className="text-lg font-black text-on-surface">{formatPrice(productForm.originalPrice || 0)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <select
                      onChange={(e) => {
                        addComboItem(e.target.value);
                        e.target.value = "";
                      }}
                      className="w-full bg-surface-container-high border border-white/5 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium appearance-none"
                    >
                      <option value="">+ Thêm món vào combo...</option>
                      {allProducts
                        .filter(p => p.category !== 'combo' && p.id !== id)
                        .map(p => (
                          <option key={p.id} value={p.id}>{p.name} - {formatPrice(p.price)}</option>
                        ))
                      }
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">add_circle</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {productForm.comboItems?.map((item) => {
                    const product = allProducts.find(p => p.id === item.productId);
                    if (!product) return null;

                    return (
                      <div key={item.productId} className="flex items-center justify-between bg-surface-container-low p-4 rounded-2xl border border-white/5 group hover:border-primary/30 transition-all">
                        <div className="flex items-center gap-4">
                          <img src={product.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                          <div>
                            <p className="font-bold text-sm">{product.name}</p>
                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{formatPrice(product.price)} / món</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center bg-surface-container-high rounded-full p-1 border border-white/5">
                            <button
                              type="button"
                              onClick={() => updateComboItemQuantity(item.productId, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateComboItemQuantity(item.productId, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 text-primary transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                          </div>

                          <div className="text-right min-w-[100px]">
                            <p className="font-black text-on-surface">{formatPrice(product.price * item.quantity)}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeComboItem(item.productId)}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error hover:text-white transition-all"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toppings Section */}
        {productForm.category !== "combo" && (
          <div className="pt-8 border-t border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black italic tracking-tighter uppercase">Toppings / Tùy chọn</h3>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mt-1">Thêm các lựa chọn hoặc món ăn kèm cho sản phẩm này.</p>
              </div>
              <button
                type="button"
                onClick={addTopping}
                className="px-4 py-2 bg-secondary text-on-secondary text-[10px] font-black rounded-full hover:bg-secondary/80 transition-all uppercase tracking-widest flex items-center gap-2 shadow-lg"
              >
                <span className="material-symbols-outlined text-[16px]">add</span> Thêm tùy chọn
              </button>
            </div>

            <div className="space-y-4">
              {productForm.toppings?.map((topping, index) => (
                <div key={topping.id} className="bg-surface-container-high/50 p-6 rounded-[32px] border border-white/5 space-y-4 relative group">
                  <button
                    type="button"
                    onClick={() => removeTopping(index)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Tên tùy chọn</label>
                      <input
                        type="text"
                        value={topping.label}
                        onChange={(e) => updateTopping(index, "label", e.target.value)}
                        placeholder="VD: Thêm phô mai"
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-secondary/50 transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Giá thêm (VNĐ)</label>
                      <input
                        type="number"
                        value={topping.price}
                        onChange={(e) => updateTopping(index, "price", Number(e.target.value))}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-secondary/50 transition-all text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Loại tùy chọn</label>
                      <select
                        value={topping.type}
                        onChange={(e) => updateTopping(index, "type", e.target.value)}
                        className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-secondary/50 transition-all text-sm font-bold appearance-none"
                      >
                        <option value="quantifiable">Chọn số lượng +/-</option>
                        <option value="binary">Chọn có/không</option>
                        <option value="level">Chọn 1 trong các lựa chọn</option>
                      </select>
                    </div>
                  </div>

                  {topping.type === "level" && (
                    <div className="pt-4 border-t border-white/5 space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Danh sách lựa chọn (VD: Cấp 0, Cấp 1...)</label>
                      <div className="flex flex-wrap gap-2">
                        {topping.options?.map((opt, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full border border-secondary/20 group/opt">
                            <span className="text-[10px] font-black uppercase tracking-wider">{opt}</span>
                            <button
                              type="button"
                              onClick={() => removeToppingOption(index, optIdx)}
                              className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all"
                            >
                              <span className="material-symbols-outlined text-[12px]">close</span>
                            </button>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 flex-grow max-w-[200px]">
                          <input
                            type="text"
                            value={newOption[index] || ""}
                            onChange={(e) => setNewOption(prev => ({ ...prev, [index]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addToppingOption(index, newOption[index] || "");
                                setNewOption(prev => ({ ...prev, [index]: "" }));
                              }
                            }}
                            placeholder="Thêm lựa chọn..."
                            className="w-full bg-surface-container-high border border-white/5 rounded-full px-4 py-1.5 focus:outline-none focus:ring-1 focus:ring-secondary/50 transition-all text-[10px] font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              addToppingOption(index, newOption[index] || "");
                              setNewOption(prev => ({ ...prev, [index]: "" }));
                            }}
                            className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-secondary hover:text-on-secondary transition-all"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {(!productForm.toppings || productForm.toppings.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-[32px] text-on-surface-variant/30 italic text-sm font-medium">
                  Chưa có tùy chọn nào cho sản phẩm này.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-4">
          <button
            disabled={loading || success}
            type="submit"
            className={`w-full py-5 font-black rounded-2xl shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all uppercase tracking-widest disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-3 ${
              success ? "bg-green-500 text-white" : "bg-primary text-on-primary shadow-[0_0_20px_rgba(255,141,140,0.4)] hover:shadow-[0_0_30px_rgba(255,141,140,0.6)]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : success ? (
              <>
                <span className="material-symbols-outlined font-black">done_all</span>
                Thành công!
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

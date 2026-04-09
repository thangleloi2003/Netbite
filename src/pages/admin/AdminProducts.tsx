export default function AdminProducts() {
  return (
    <main className="p-8 space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter italic uppercase mb-2">QUẢN LÝ SẢN PHẨM</h2>
          <div className="h-1.5 w-16 bg-secondary rounded-full mb-3"></div>
          <p className="text-on-surface-variant font-medium">Quản lý thực đơn và cập nhật món ăn theo thời gian thực.</p>
        </div>

        <div className="bg-surface-container-low p-1.5 rounded-full border border-white/5 flex self-start lg:self-auto shadow-inner">
          <button className="px-6 py-2.5 bg-primary text-on-primary text-xs font-black rounded-full shadow-[0_0_15px_rgba(255,141,140,0.3)] transition-all uppercase tracking-wider">Tất cả</button>
          <button className="px-6 py-2.5 text-on-surface-variant text-xs font-bold rounded-full hover:text-white transition-colors uppercase tracking-wider">Đồ ăn</button>
          <button className="px-6 py-2.5 text-on-surface-variant text-xs font-bold rounded-full hover:text-white transition-colors uppercase tracking-wider">Đồ uống</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="group bg-surface-container-low p-4 rounded-3xl border border-white/5 hover:border-white/10 hover:-translate-y-2 transition-all duration-300 shadow-xl flex flex-col">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-surface-container-highest">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTHApgTRGaNH12RoE6t_3wt6CWjuIgTQPBA5_JscB6dL6yx3BNUQD9qHN9tszrIYjbRPMHWNwVzp25GDquY5ijYsQviARVIjoi0nT4k6UuQDJb2DqPTKvnnzQNAxTwWP7uJJgc2n9KcYomn0weDrcw4cx1EGhRtsSb_O9UEYkfRlA7fEXxANtGV7oWT8ho1A7l0RnQU4EA24X1poccriBk9KO7h9fBVmr6Y4Ja4TomHVePHkAE_TEGu_hDsZTAOMVYIElGztYj0gmw" />
            <div className="absolute top-3 left-3">
              <span className="bg-secondary/90 backdrop-blur-sm text-on-secondary text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Bestseller</span>
            </div>
          </div>
          <div className="flex-grow flex flex-col">
            <h3 className="text-lg font-black tracking-tight mb-1 group-hover:text-primary transition-colors">Burger Bò Phô Mai</h3>
            <p className="text-primary font-black text-2xl mb-5 tracking-tighter">45.000đ</p>

            <div className="flex gap-2 mt-auto">
              <button className="flex-1 flex items-center justify-center gap-2 bg-surface-container-high text-on-surface py-3 rounded-full hover:bg-primary hover:text-white transition-colors text-sm font-bold border border-transparent hover:border-primary/50">
                <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-surface-container-high text-on-surface-variant rounded-full hover:bg-error hover:text-white transition-colors border border-transparent hover:border-error/50">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="group bg-surface-container-low p-4 rounded-3xl border border-white/5 hover:border-white/10 hover:-translate-y-2 transition-all duration-300 shadow-xl flex flex-col">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-surface-container-highest">
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDot0PzZxfaY7rTzzGq_3N9MrU0lFTRNuyhM8vKY8xWNwlWpdVIelzscy71IXE1IJpXQoXNJDAYzP_QKryQ9DYlbkHHPDCZ-ximpWQK2GkiiNzNee2GcQs0SPVnMPlDNvjmAE_3ATiRnliC-jG4HO9SL4jMwULmi9QnfCOYs5h3q7cu6l8yOJUOguoLZZcM6FK2lprLkjwzdfpWemHQqIa5wA46u6HR7S5-xGzBciN3ZbMh1Cz2UCiTJrWxk-D7WT5aDxE-hgvYT5VE" />
          </div>
          <div className="flex-grow flex flex-col">
            <h3 className="text-lg font-black tracking-tight mb-1 group-hover:text-primary transition-colors">Mì Cay Hải Sản</h3>
            <p className="text-primary font-black text-2xl mb-5 tracking-tighter">55.000đ</p>

            <div className="flex gap-2 mt-auto">
              <button className="flex-1 flex items-center justify-center gap-2 bg-surface-container-high text-on-surface py-3 rounded-full hover:bg-primary hover:text-white transition-colors text-sm font-bold border border-transparent hover:border-primary/50">
                <span className="material-symbols-outlined text-[18px]">edit</span> Sửa
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-surface-container-high text-on-surface-variant rounded-full hover:bg-error hover:text-white transition-colors border border-transparent hover:border-error/50">
                <span className="material-symbols-outlined text-[20px]">delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

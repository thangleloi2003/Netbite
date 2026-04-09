export default function About() {
  return (
    <main className="pt-20">
      <section className="relative min-h-[600px] md:min-h-[819px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-container/20 via-surface to-surface">
        <div className="absolute inset-0 z-0">
          <img
            alt="Modern gaming lounge interior with purple and red neon lighting"
            className="w-full h-full object-cover opacity-20 grayscale brightness-50"
            data-alt="cinematic wide shot of a futuristic high-end gaming cafe with ergonomic chairs and glowing red and purple LED lighting fixtures"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAOyKJSREVghfqVSjG9T6A2OpqcI8_OE2y3WpanNzUnnH8WGsCj9KIdMFBbvXQJRr22c7obFMlzlxVeYO_-ote3ZCIjbgMHM8xPAqKZGvjDrTg3SG2IDO_XAMeLyVKZ5T_UT_n86phacZBK4zrYO50D1aq0JWtanUy9vk9FdVyHVLb47C9CDavoma6ojpdI0kxc1xp7sHaPfrKL_6RlKaMRFG50ByTL2bJ1UqIVo2dWu2wixCMKC-KfAihazVj6T1BM1ZMhrYUfUZJh"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface/80 to-surface"></div>
        </div>

        <div className="relative z-10 max-w-5xl px-6 text-center">
          <span className="inline-block bg-tertiary-container text-on-tertiary-container px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-lg shadow-tertiary-container/20">
            Since 2023
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none mb-8">
            NetBite -{" "}
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Hơn cả một phòng máy
            </span>
            <br />
          </h1>
          <p className="text-xl md:text-2xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Định nghĩa lại không gian giải trí số bằng sự kết hợp hoàn hảo giữa công nghệ đỉnh cao và một trải nghiệm ẩm thực trọn vẹn.
          </p>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter italic text-on-surface">
              TẦM NHÌN KẾ TIẾP
            </h2>
            <div className="h-1.5 w-24 bg-secondary mb-8 rounded-full"></div>

            <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
              <p>
                Tại NetBite, chúng tôi không chỉ cung cấp những cấu hình máy mạnh mẽ nhất. Chúng tôi kiến tạo một hệ sinh thái nơi mỗi game thủ đều được chăm sóc như một thượng khách.
              </p>

              <div className="bg-surface-container-low p-6 rounded-2xl border-l-4 border-primary relative overflow-hidden group">
                <span
                  className="material-symbols-outlined text-primary text-6xl opacity-10 absolute top-2 right-4 group-hover:scale-110 transition-transform"
                  data-icon="format_quote"
                >
                  format_quote
                </span>
                <p className="italic font-bold text-on-surface text-xl">
                  "Năng lượng từ thức ăn ngon là chìa khóa cho những chiến thắng nghẹt thở."
                </p>
              </div>

              <p>
                Triết lý kết hợp Game-Food của chúng tôi dựa trên sự thấu hiểu sâu sắc nhu cầu của người chơi: Đồ ăn nhanh nhưng phải đủ chất, hương vị đậm đà nhưng không gây gián đoạn trận đấu.
              </p>
            </div>
          </div>

          <div className="order-1 md:order-2 relative grid grid-cols-2 gap-4">
            <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col items-center justify-center transform rotate-2 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 shadow-xl border border-white/5">
              <span className="material-symbols-outlined text-6xl text-primary mb-4" data-icon="sports_esports">
                sports_esports
              </span>
              <span className="font-black text-on-surface tracking-widest">GAMING</span>
            </div>

            <div className="bg-surface-container-highest rounded-3xl p-8 flex flex-col items-center justify-center transform -rotate-3 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 mt-12 shadow-xl border border-white/5">
              <span className="material-symbols-outlined text-6xl text-secondary mb-4" data-icon="restaurant">
                restaurant
              </span>
              <span className="font-black text-on-surface tracking-widest">FLAVOR</span>
            </div>

            <div className="bg-surface-container rounded-3xl p-8 flex flex-col items-center justify-center transform -rotate-1 hover:rotate-0 hover:-translate-y-2 transition-all duration-500 -mt-6 shadow-xl border border-white/5">
              <span className="material-symbols-outlined text-6xl text-tertiary mb-4" data-icon="coffee">
                coffee
              </span>
              <span className="font-black text-on-surface tracking-widest">LOUNGE</span>
            </div>

            <div className="relative rounded-3xl overflow-hidden group shadow-xl">
              <img
                alt="Gourmet burger in a dark setting"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                data-alt="close-up of a juicy gourmet double cheeseburger on a dark surface with dramatic red neon highlight from the side"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxKtTOfffwZ-Db0gFHDQjrp2Tqg1bjGBtKiDsPZj6ONc1xHXRk9DYTGNJyTVMXpgZpQtr32FAdPpl9GHZtV2NdHIYCR9pn-yANvXL990Sd0WyjP_d3lWDE5feecSE4eAl8_F9FqOIYM3vxVezI-MJsPEc_YXaqNproW2Y9RmKL-r5iUcw7XxxyiCDgNFQ0gyR4UWQknS7buqXQIxMzrK8s8zxGxlnrOCUa75vVdWkhRSHFY317YWEUgcxamQmEzeMdTRRLubDooACJ"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic">HÀNH TRÌNH NETBITE</h2>
            <div className="h-1.5 w-24 bg-secondary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-surface-container-highest hidden md:block rounded-full"></div>

            <div className="relative mb-24 flex flex-col md:flex-row items-center justify-between group">
              <div className="md:w-[45%] text-center md:text-right mb-8 md:mb-0">
                <h3 className="text-6xl md:text-8xl font-black text-primary/10 mb-2 leading-none group-hover:text-primary/20 transition-colors">
                  2023
                </h3>
                <h4 className="text-2xl font-black text-on-surface mb-4">Khởi đầu - Những viên gạch đầu tiên</h4>
                <p className="text-on-surface-variant max-w-sm ml-auto leading-relaxed">
                  NetBite khai trương cơ sở đầu tiên với sứ mệnh mang lại một môi trường chơi game sạch sẽ, chuyên nghiệp kết hợp cùng bếp ăn tiêu chuẩn.
                </p>
              </div>

              <div className="w-16 h-16 bg-surface-container-highest rounded-full border-4 border-surface z-10 flex items-center justify-center group-hover:bg-primary transition-colors shadow-[0_0_20px_rgba(255,141,140,0.2)] group-hover:shadow-[0_0_30px_rgba(255,141,140,0.6)]">
                <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-2xl transition-colors" data-icon="rocket_launch">
                  rocket_launch
                </span>
              </div>

              <div className="md:w-[45%] hidden md:block"></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center justify-between group">
              <div className="md:w-[45%] hidden md:block"></div>

              <div className="w-16 h-16 bg-surface-container-highest rounded-full border-4 border-surface z-10 flex items-center justify-center group-hover:bg-tertiary transition-colors shadow-[0_0_20px_rgba(182,255,237,0.2)] group-hover:shadow-[0_0_30px_rgba(182,255,237,0.6)]">
                <span className="material-symbols-outlined text-tertiary group-hover:text-on-tertiary text-2xl transition-colors" data-icon="cloud_done">
                  cloud_done
                </span>
              </div>

              <div className="md:w-[45%] text-center md:text-left mt-8 md:mt-0">
                <h3 className="text-6xl md:text-8xl font-black text-tertiary/10 mb-2 leading-none group-hover:text-tertiary/20 transition-colors">
                  2026
                </h3>
                <h4 className="text-2xl font-black text-on-surface mb-4">Ra mắt dịch vụ Web - Nâng tầm trải nghiệm số</h4>
                <p className="text-on-surface-variant max-w-sm leading-relaxed">
                  Hệ thống đặt món online và đặt máy trước thông qua ứng dụng web chuyên biệt, kết nối trực tiếp với tài khoản game của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-surface-container-low rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 relative overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>

          <div className="lg:w-1/2 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-12 tracking-tighter italic">
              KẾT NỐI VỚI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                NETBITE GAMING
              </span>
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-6 bg-surface-container-highest/50 p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-3xl" data-icon="location_on">
                    location_on
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">Khoảng giá / Địa chỉ</p>
                  <p className="text-on-surface text-lg font-medium leading-relaxed">
                    123 Đường Công Nghệ, Quận 1, Thành phố Hồ Chí Minh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 bg-surface-container-highest/50 p-6 rounded-2xl border border-white/5 hover:border-secondary/30 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary text-3xl" data-icon="call">
                    call
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary mb-2 uppercase tracking-widest">Hotline 24/7</p>
                  <p className="text-4xl font-black tracking-tighter text-on-surface">1900 8888</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative z-10">
            <div className="bg-surface p-8 rounded-3xl border border-white/5 shadow-xl">
              <h3 className="text-2xl font-black mb-8">Gửi tin nhắn cho chúng tôi</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Họ tên</label>
                    <input
                      className="w-full bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-slate-600 py-3 px-4 transition-all"
                      placeholder="Gamer XYZ"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Email</label>
                    <input
                      className="w-full bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-slate-600 py-3 px-4 transition-all"
                      placeholder="hello@domain.com"
                      type="email"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Lời nhắn</label>
                  <textarea
                    className="w-full bg-surface-container border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-slate-600 py-3 px-4 transition-all resize-none"
                    placeholder="Bạn muốn hợp tác hay đóng góp ý kiến?"
                    rows={4}
                  ></textarea>
                </div>

                <button
                  className="w-full bg-primary text-on-primary py-4 rounded-full font-black text-lg shadow-[0_0_20px_rgba(255,141,140,0.3)] hover:shadow-[0_0_30px_rgba(255,141,140,0.6)] hover:brightness-110 transition-all duration-300 transform active:scale-95 tracking-tight uppercase"
                  type="submit"
                >
                  Gửi Yêu Cầu
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

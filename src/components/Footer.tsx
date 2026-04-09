export default function Footer() {
  return (
    <footer className="bg-[#24020c] w-full border-t border-white/10 no-line-rule tonal-layering">
      <div className="flex flex-col md:flex-row justify-between items-start px-8 py-12 gap-12 max-w-7xl mx-auto">
        <div className="max-w-xs">
          <div className="text-2xl font-bold text-red-600 mb-4">NETBITE</div>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 font-body">Tiếp năng lượng cho mọi cuộc vui game thủ. Nhanh chóng, nóng hổi và chất lượng đỉnh cao.</p>
          <div className="flex gap-4">
            <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:text-red-400 transition-colors" href="#">
              <span className="material-symbols-outlined" data-icon="facebook">social_leaderboard</span>
            </a>
            <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:text-red-400 transition-colors" href="#">
              <span className="material-symbols-outlined">camera</span>
            </a>
            <a className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:text-red-400 transition-colors" href="#">
              <span className="material-symbols-outlined">music_note</span>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h5 className="text-orange-500 font-bold mb-4 uppercase tracking-widest text-xs">Liên hệ</h5>
            <ul className="space-y-3 text-slate-400 text-sm font-body">
              <li>123 Đường Game Thủ, Quận 1, HCM</li>
              <li>Hotline: 1900 6789</li>
              <li>Email: hotro@netbite.vn</li>
            </ul>
          </div>
          <div>
            <h5 className="text-orange-500 font-bold mb-4 uppercase tracking-widest text-xs">Hỗ trợ</h5>
            <ul className="space-y-3 text-slate-400 text-sm font-body">
              <li className="hover:text-red-400 cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-red-400 cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-red-400 cursor-pointer transition-colors">FAQ</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/5 py-6 text-center">
        <p className="text-slate-500 text-xs font-body">© 2026 NetBite Gaming Cafe. All rights reserved.</p>
      </div>
    </footer>
  );
}

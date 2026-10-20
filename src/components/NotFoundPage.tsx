import React, { useState } from 'react';
import { Heart, Search, ArrowRight, ShieldCheck, Sparkles, Lock, Camera, EyeOff } from 'lucide-react';

interface NotFoundPageProps {
  onOpenAdmin: (targetSlug?: string) => void;
  onSelectSlug?: (slug: string) => void;
  mode?: 'missing_slug' | 'unconfigured';
  unconfiguredSlug?: string;
  unconfiguredName?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onOpenAdmin,
  onSelectSlug,
  mode = 'missing_slug',
  unconfiguredSlug = '',
  unconfiguredName = '',
}) => {
  const [inputSlug, setInputSlug] = useState<string>('');

  const isUnconfigured = mode === 'unconfigured';
  const displayName = unconfiguredName || (unconfiguredSlug ? unconfiguredSlug.toUpperCase() : 'Nàng');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = inputSlug.trim().toLowerCase().replace(/\s+/g, '_');
    if (!clean) return;
    if (onSelectSlug) {
      onSelectSlug(clean);
    } else {
      window.location.search = `?love=${encodeURIComponent(clean)}`;
    }
  };

  const handleOpenPreset = (slug: string) => {
    if (onSelectSlug) {
      onSelectSlug(slug);
    } else {
      window.location.search = `?love=${encodeURIComponent(slug)}`;
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-white to-pink-50 text-stone-800 relative selection:bg-rose-200 selection:text-rose-900">
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-rose-100 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-rose-200/50 text-center relative overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Floating icon */}
        <div className="relative mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-xl shadow-rose-400/40 ring-4 ring-rose-100">
          {isUnconfigured ? (
            <Camera size={36} className="text-white" />
          ) : (
            <Heart size={38} className="animate-pulse" />
          )}
          <span className="absolute -bottom-1 -right-1 bg-white text-rose-600 rounded-full p-1.5 shadow">
            {isUnconfigured ? <EyeOff size={13} /> : <Lock size={13} />}
          </span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles size={12} className="text-rose-600" />
          <span>
            {isUnconfigured ? 'Bảo Vệ Quyền Riêng Tư • Chưa Có Ảnh' : '404 • Cần Đường Link Riêng Biệt'}
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
          {isUnconfigured
            ? `Thiệp Của ${displayName} Chưa Có Ảnh`
            : 'Chưa Chọn Người Nhận Thiệp'}
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto mb-6">
          {isUnconfigured ? (
            <>
              Để <strong>tôn trọng quyền riêng tư</strong>, trang web không tự ý lấy ảnh của người khác hiển thị cho đường link{' '}
              <code className="bg-rose-50 px-1.5 py-0.5 rounded text-rose-700 font-mono font-semibold">?love={unconfiguredSlug}</code>.
              Chủ nhân cần vào bảng Quản Trị để tải ảnh kỷ niệm của {displayName} lên trước khi gửi cho người nhận!
            </>
          ) : (
            <>
              Trang web này là món quà 20/10 cá nhân hóa dành riêng cho từng người phụ nữ. Để mở thiệp, bạn bắt buộc phải có đường link chứa mã tình yêu (Ví dụ:{' '}
              <code className="bg-rose-50 px-1.5 py-0.5 rounded text-rose-700 font-mono font-semibold">?love=man</code> hoặc{' '}
              <code className="bg-rose-50 px-1.5 py-0.5 rounded text-rose-700 font-mono font-semibold">?love=huong</code>).
            </>
          )}
        </p>

        {isUnconfigured ? (
          /* Unconfigured Action Buttons */
          <div className="space-y-3 mb-6">
            <button
              onClick={() => onOpenAdmin(unconfiguredSlug)}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-semibold text-sm shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Camera size={18} />
              <span>Vào Admin Tải Ảnh Cho {displayName}</span>
            </button>

            <button
              onClick={() => handleOpenPreset('man')}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100/70 text-rose-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Heart size={14} className="text-rose-600" />
              <span>Mở Xem Thiệp Mẫu Mặc Định Của Mẫn (?love=man)</span>
            </button>
          </div>
        ) : (
          /* Search for slug when missing */
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-stone-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={inputSlug}
                onChange={(e) => setInputSlug(e.target.value)}
                placeholder="Nhập tên người ấy (VD: man, huong, ngoc...)"
                className="w-full pl-10 pr-24 py-3 rounded-2xl border border-rose-200 bg-stone-50/50 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:bg-white transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputSlug.trim()}
                className="absolute right-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1 shadow-md transition-all active:scale-95"
              >
                <span>Mở</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        )}

        {/* Footer Admin Card */}
        <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-4 text-center">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 text-left sm:text-left">
              <p className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-rose-600 shrink-0" />
                <span>Bảng Quản Trị Cài Đặt (Admin)</span>
              </p>
              <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                Bạn có thể tự đổi tên người nhận, tải ảnh trực tiếp từ máy và tạo link gửi người ấy ngay!
              </p>
            </div>

            <button
              onClick={() => onOpenAdmin(unconfiguredSlug || undefined)}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold text-center shadow transition-all active:scale-95 shrink-0 w-full sm:w-auto"
            >
              Vào Admin <span className="block sm:inline-block text-[10px] text-stone-400 font-normal mt-0.5 sm:mt-0 sm:ml-1">(PIN: 2010)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

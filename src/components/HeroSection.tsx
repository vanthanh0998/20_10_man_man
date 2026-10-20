import React, { useState } from 'react';
import { Heart, Sparkles, SlidersHorizontal, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  herName: string;
  senderName: string;
  onOpenCustomize: () => void;
  heroImage: string;
  isAdminMode?: boolean;
  onSecretAdminUnlock?: () => void;
}

const SWEET_WHISPERS = [
  "Em là điều dịu dàng nhất đến với anh!",
  "Mỗi nụ cười của em đều thắp sáng ngày của anh.",
  "20/10 chúc em luôn xinh đẹp, hạnh phúc và an yên.",
  "Cảm ơn em vì đã chọn đồng hành cùng anh.",
  "Dù ngày mai ra sao, anh vẫn luôn thương em như ngày đầu.",
  "Hôm nay em là nàng công chúa được cưng chiều nhất!",
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  herName,
  senderName,
  onOpenCustomize,
  heroImage,
  isAdminMode = false,
  onSecretAdminUnlock,
}) => {
  const [heartsCount, setHeartsCount] = useState<number>(520);
  const [secretClickCount, setSecretClickCount] = useState<number>(0);
  const [currentWhisper, setCurrentWhisper] = useState<string>(
    "Chạm vào nút trái tim để gửi thêm ngàn lời yêu thương đến em"
  );
  const [isPulsing, setIsPulsing] = useState<boolean>(false);

  const handleSendHeart = (e: React.MouseEvent<HTMLButtonElement>) => {
    setHeartsCount((prev) => prev + 1);
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 300);

    // Pick random whisper
    const randomWhisper = SWEET_WHISPERS[Math.floor(Math.random() * SWEET_WHISPERS.length)];
    setCurrentWhisper(randomWhisper);

    // Mini confetti burst near button
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    try {
      confetti({
        particleCount: 15,
        spread: 45,
        origin: { x, y },
        colors: ['#e11d48', '#fb7185', '#fda4af', '#f43f5e'],
        scalar: 0.9,
      });
    } catch {
      // safe fallback
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextCount = secretClickCount + 1;
    setSecretClickCount(nextCount);
    if (nextCount >= 5) {
      setSecretClickCount(0);
      if (onSecretAdminUnlock) onSecretAdminUnlock();
    }
  };

  return (
    <div className="relative pt-6 pb-16 lg:pt-8 lg:pb-24">
      {/* Top 3-Zone Navigation Bar */}
      <header className="mx-auto max-w-6xl px-3 sm:px-6 mb-8 sm:mb-12 flex items-center justify-between gap-2 sm:gap-6 border-b border-rose-100/80 pb-3 sm:pb-4">
        {/* Zone 1: Single text wordmark with secret admin trigger */}
        <a
          href="#"
          onClick={handleLogoClick}
          className="font-serif-display text-base sm:text-lg lg:text-xl font-bold tracking-tight text-rose-900 shrink-0 flex items-center gap-1 cursor-pointer select-none"
          title="20.10 With Love"
        >
          <span>20.10 With Love</span>
          <span className="text-rose-500 font-sans text-sm">🌹</span>
        </a>

        {/* Zone 2: Clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <a href="#loi-chuc" className="hover:text-rose-700 transition-colors whitespace-nowrap shrink-0">
            Lời Chúc Ý Nghĩa
          </a>
          <a href="#ky-niem" className="hover:text-rose-700 transition-colors whitespace-nowrap shrink-0">
            Khoảnh Khắc Kỷ Niệm
          </a>
          <a href="#ly-do-yeu" className="hover:text-rose-700 transition-colors whitespace-nowrap shrink-0">
            Điều Anh Yêu Ở Em
          </a>
          <a href="#hop-qua-grab" className="hover:text-rose-700 transition-colors whitespace-nowrap shrink-0 font-medium text-rose-600 flex items-center gap-1">
            <Gift size={15} />
            <span>Món Quà Grab</span>
          </a>
        </nav>

        {/* Zone 3: 1 primary action - Only show customize button if in Admin Mode */}
        {isAdminMode ? (
          <button
            onClick={onOpenCustomize}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-full border border-rose-200 transition-colors shrink-0 shadow-sm"
            title="Tải ảnh của nàng lên, đổi tên gọi và link Grab"
          >
            <SlidersHorizontal size={12} className="sm:w-[13px] sm:h-[13px]" />
            <span className="hidden sm:inline">Tùy chỉnh ảnh & tên</span>
            <span className="sm:hidden font-semibold">Cài đặt</span>
          </button>
        ) : (
          <a
            href="#hop-qua-grab"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-full border border-rose-200 transition-colors shrink-0"
            title="Nhận món quà dành tặng em"
          >
            <Gift size={13} className="text-rose-500" />
            <span>Món Quà Cho Em</span>
          </a>
        )}
      </header>

      {/* Main Hero Container */}
      <div className="mx-auto max-w-6xl px-3 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Typographic & Emotional Delivery */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            {/* Clean unboxed metadata kicker */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-rose-600">
              <span>20 Tháng 10</span>
              <span aria-hidden="true" className="text-rose-300">·</span>
              <span>Ngày Phụ Nữ VN</span>
              <span aria-hidden="true" className="text-rose-300">·</span>
              <span>Gửi {herName}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15] text-balance">
              Dành tặng người phụ nữ{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700">
                tuyệt vời nhất
              </span>{' '}
              trong trái tim anh
            </h1>

            {/* Lead Prose */}
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
              Nhân ngày 20/10, anh muốn gửi trọn những tình cảm chân thành và ấm áp nhất tới em.
              Cảm ơn em vì đã xuất hiện, mang lại tiếng cười và khiến từng ngày trôi qua đều trở nên
              ý nghĩa đặc biệt.
            </p>

            {/* Interactive Love Counter & Heart Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={handleSendHeart}
                className={`relative flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 rounded-full shadow-lg shadow-rose-600/25 hover:from-rose-500 hover:to-pink-500 transition-all duration-200 active:scale-95 ${
                  isPulsing ? 'scale-105' : ''
                }`}
                aria-label="Thả tim yêu thương cho em"
              >
                <Heart size={18} className="fill-white text-white animate-pulse" />
                <span className="whitespace-nowrap">Thả tim cho em</span>
                <span className="ml-1 px-2 py-0.5 text-xs bg-rose-700/60 rounded-full font-mono tabular-nums">
                  {heartsCount.toLocaleString()}
                </span>
              </button>

              <a
                href="#loi-chuc"
                className="px-5 py-3.5 text-sm font-medium text-rose-900 hover:text-rose-700 bg-white/80 hover:bg-white rounded-full border border-rose-200 shadow-sm transition-colors whitespace-nowrap"
              >
                Đọc bức thư tình &darr;
              </a>
            </div>

            {/* Dynamic love whisper quote */}
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-100/90 text-xs sm:text-sm text-rose-800 flex items-center justify-center lg:justify-start gap-2">
              <Sparkles size={15} className="text-rose-500 shrink-0" />
              <span className="italic font-medium">"{currentWhisper}"</span>
            </div>
          </div>

          {/* Right Column: High Fidelity Romantic Visual Framing */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Soft decorative background glow */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-rose-200/50 to-pink-200/40 blur-xl pointer-events-none" />

              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-rose-100 bg-white p-2">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] rounded-xl overflow-hidden bg-rose-50">
                  <img
                    src={heroImage}
                    alt={`Bức hình kỷ niệm cùng ${herName}`}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Photo caption overlay */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="font-serif-display text-sm sm:text-base font-medium">
                      Bình yên là khi có em bên cạnh
                    </p>
                    <p className="text-[11px] text-rose-200 font-light flex items-center justify-between">
                      <span>20 Tháng 10 Đong Đầy Yêu Thương</span>
                      <span>Từ {senderName}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

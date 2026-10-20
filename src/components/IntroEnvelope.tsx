import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, MailOpen } from 'lucide-react';

interface IntroEnvelopeProps {
  onOpen: () => void;
  herName: string;
}

export const IntroEnvelope: React.FC<IntroEnvelopeProps> = ({ onOpen, herName }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    // Trigger sweet heart confetti explosion
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fda4af', '#f43f5e', '#fb7185', '#ffe4e6'],
        shapes: ['circle'],
        scalar: 1.2,
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      onOpen();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/90 backdrop-blur-md px-4 transition-opacity duration-700">
      <div className="relative w-full max-w-md mx-auto text-center">
        {/* Ambient glow behind envelope */}
        <div className="absolute -inset-6 rounded-full bg-rose-500/20 blur-2xl pointer-events-none" />

        <div className="relative">
          {/* Header prompt */}
          <div className="mb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase font-medium text-rose-300">
              <Sparkles size={14} className="text-rose-400" />
              <span>Dành riêng cho ngày 20/10</span>
              <Sparkles size={14} className="text-rose-400" />
            </div>
            <h1 className="font-serif-display text-2xl sm:text-3xl font-semibold text-rose-50 tracking-tight">
              Gửi {herName} Của Anh
            </h1>
            <p className="text-sm text-rose-200/80 font-light">
              Anh đã chuẩn bị một món quà nhỏ từ trái tim dành tặng em...
            </p>
          </div>

          {/* Envelope Graphic Container */}
          <div
            onClick={handleOpenEnvelope}
            className={`cursor-pointer mx-auto relative w-72 sm:w-80 h-48 sm:h-52 rounded-2xl bg-gradient-to-br from-rose-100 via-rose-50 to-pink-100 shadow-2xl border border-rose-200/60 p-5 flex flex-col justify-between items-center transition-all duration-700 transform hover:scale-102 hover:shadow-rose-400/30 ${
              isOpening ? 'scale-105 opacity-80 -translate-y-4' : 'animate-gentle-float'
            }`}
            role="button"
            tabIndex={0}
            aria-label="Mở phong thư chúc mừng ngày 20/10"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleOpenEnvelope();
            }}
          >
            {/* Top decorative envelope border */}
            <div className="w-full border-b border-rose-200/80 pb-2 flex justify-between items-center text-rose-400 text-xs font-serif-display italic">
              <span>Thư gửi tình yêu</span>
              <span>20.10</span>
            </div>

            {/* Center Wax Seal Button */}
            <div className="relative group">
              <div
                className={`relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-700 via-rose-800 to-rose-950 text-rose-100 shadow-xl border-2 border-rose-500/40 transition-transform duration-300 ${
                  isOpening ? 'scale-125 rotate-12' : 'group-hover:scale-110'
                }`}
              >
                <Heart size={26} className="fill-rose-300 text-rose-100 drop-shadow-sm" />
                <span className="absolute -inset-1 rounded-full border border-rose-400/40 animate-ping pointer-events-none" />
              </div>
              <p className="mt-2 text-xs font-medium text-rose-700 tracking-wide">
                {isOpening ? 'Đang mở thư...' : 'Chạm để mở thư'}
              </p>
            </div>

            {/* Bottom note */}
            <div className="text-[11px] text-rose-400 flex items-center gap-1 font-light">
              <MailOpen size={12} />
              <span>Chứa đựng giai điệu và những lời chúc ngọt ngào</span>
            </div>
          </div>

          {/* Quick Skip button */}
          <button
            onClick={handleOpenEnvelope}
            className="mt-6 text-xs text-rose-300/80 hover:text-white underline underline-offset-4 transition-colors"
          >
            Mở thư ngay & khám phá &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

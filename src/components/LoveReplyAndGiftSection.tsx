import React, { useState } from 'react';
import { Heart, Send, Gift, Sparkles, MessageCircle, Check, ExternalLink, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoveReplyAndGiftSectionProps {
  herName: string;
  senderName: string;
  grabGiftLink: string;
  phoneNumber?: string;
}

const QUICK_EMOJIS = [
  { emoji: '🥰', text: 'Yêu anh nhiều lắm!' },
  { emoji: '💖', text: 'Cảm động muốn khóc luôn nè' },
  { emoji: '🥺', text: 'Cảm ơn anh vì món quà ngọt ngào' },
  { emoji: '🌸', text: 'Mãi là công chúa của anh nha' },
  { emoji: '🧋', text: 'Ly nước Grab ngon tuyệt cú mèo!' },
];

export const LoveReplyAndGiftSection: React.FC<LoveReplyAndGiftSectionProps> = ({
  herName,
  senderName,
  grabGiftLink,
  phoneNumber = '',
}) => {
  const [selectedEmoji, setSelectedEmoji] = useState<string>('🥰');
  const [replyMessage, setReplyMessage] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() && !selectedEmoji) return;

    setIsSent(true);

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#e11d48', '#fb7185', '#fda4af', '#f43f5e', '#a855f7'],
      });
    } catch {
      // safe fallback
    }

    const fullMessage = `${selectedEmoji} Gửi anh ${senderName}: "${replyMessage.trim() || 'Em đã nhận được trọn vẹn tình yêu và lời chúc 20/10 của anh!'}" - Từ ${herName}`;

    // Store in localStorage
    try {
      const existingReplies = JSON.parse(localStorage.getItem('love_replies_2010') || '[]');
      existingReplies.push({
        date: new Date().toLocaleString('vi-VN'),
        emoji: selectedEmoji,
        message: replyMessage.trim() || 'Yêu anh nhiều!',
      });
      localStorage.setItem('love_replies_2010', JSON.stringify(existingReplies));
    } catch {
      // safe fallback
    }

    // Auto copy text for convenience
    navigator.clipboard?.writeText(fullMessage).catch(() => {});
  };

  const formattedShareMessage = `${selectedEmoji} Gửi anh ${senderName}: ${replyMessage.trim() || 'Em xúc động và yêu anh nhiều lắm!'}`;
  const encodedShareText = encodeURIComponent(formattedShareMessage);

  return (
    <section id="hop-qua-grab" className="relative py-16 sm:py-24 bg-gradient-to-b from-rose-50/50 via-white to-rose-100/40">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        
        {/* =========================================================================
            PART 1: MÓN QUÀ GRAB TẶNG NÀNG
           ========================================================================= */}
        <div className="relative mb-16 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-rose-50 p-6 sm:p-10 shadow-xl border border-emerald-200/80 overflow-hidden">
          {/* Ambient decorative elements */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 h-40 w-40 rounded-full bg-rose-400/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 text-center max-w-xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold tracking-wide">
              <Gift size={14} className="text-emerald-600" />
              <span>Món Quà Ngọt Ngào Dành Cho Em</span>
            </div>

            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Một Ly Nước Ngon Anh Tặng Em Hôm Nay 🧋✨
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
              Ngày của em thì nhất định phải được ngọt ngào từ trong ra ngoài.
              Anh đã chuẩn bị sẵn để em nhận ngay ly trà sữa, cà phê hoặc thức uống yêu thích
              giao tận tay qua Grab!
            </p>

            {/* Grab Direct Link CTA */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={grabGiftLink || 'https://food.grab.com/vn/vi/'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 text-base font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-full shadow-lg shadow-emerald-600/25 transition-all duration-200 active:scale-95 group"
              >
                <span>Nhận Ly Nước Grab Của Em Ngay</span>
                <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(grabGiftLink || 'https://food.grab.com/vn/vi/').catch(() => {});
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 3000);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium text-stone-600 bg-white hover:bg-stone-50 border border-stone-200 rounded-full transition-colors"
                title="Sao chép link quà"
              >
                {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedLink ? 'Đã sao chép link' : 'Sao chép link'}</span>
              </button>
            </div>

            <p className="text-[12px] text-stone-500 font-light italic">
              * Món quà nhỏ này là chút ngọt ngào anh gửi kèm với trọn vẹn tình thương hôm nay.
            </p>
          </div>
        </div>


        {/* =========================================================================
            PART 2: KHUNG TIN NHẮN PHẢN HỒI TÌNH CẢM
           ========================================================================= */}
        <div className="relative rounded-3xl bg-white p-6 sm:p-10 shadow-xl border border-rose-200">
          <div className="text-center max-w-lg mx-auto mb-6">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-1">
              <MessageCircle size={15} />
              <span>Gửi Lời Nhắn Đến Anh</span>
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-stone-900">
              Phản Hồi Tình Cảm Của {herName}
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-light">
              Sau khi xem hết bức thư này, em có điều gì muốn nhắn nhủ lại với anh không?
            </p>
          </div>

          {!isSent ? (
            <form onSubmit={handleSendReply} className="space-y-4 max-w-xl mx-auto">
              {/* Quick emotion sticker selector */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2 text-center sm:text-left">
                  Chọn cảm xúc của em lúc này:
                </label>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {QUICK_EMOJIS.map((item) => (
                    <button
                      key={item.emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(item.emoji)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedEmoji === item.emoji
                          ? 'bg-rose-600 text-white shadow-sm scale-105'
                          : 'bg-rose-50 text-stone-700 hover:bg-rose-100 border border-rose-100'
                      }`}
                    >
                      <span className="text-base">{item.emoji}</span>
                      <span className="hidden sm:inline">{item.text}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input Box */}
              <div>
                <label htmlFor="replyText" className="block text-xs font-medium text-stone-700 mb-1.5">
                  Viết đôi lời gửi cho chàng trai của em:
                </label>
                <textarea
                  id="replyText"
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={`Em muốn nói với anh ${senderName} là... (ví dụ: Em rất vui và hạnh phúc khi nhận được thư!)`}
                  className="w-full rounded-2xl border border-rose-200 bg-rose-50/20 p-3.5 text-sm text-stone-800 placeholder-stone-400 focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 transition-colors"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white font-semibold text-sm shadow-md hover:from-rose-500 hover:to-pink-500 active:scale-98 transition-all"
              >
                <Heart size={16} className="fill-white" />
                <span>Gửi lời nhắn trao anh {senderName}</span>
                <Send size={15} />
              </button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <Heart size={28} className="fill-rose-500 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif-display text-xl font-bold text-stone-900">
                  Lời Nhắn Của Em Đã Được Gửi Gắm!
                </h4>
                <p className="text-sm text-stone-600 font-light max-w-md mx-auto">
                  Tin nhắn của em đã được lưu lại và tự động sao chép. Em có thể gửi ngay qua Zalo hoặc Messenger để anh đọc ngay nhé!
                </p>
              </div>

              {/* Quote preview of her message */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-sm text-rose-900 max-w-md mx-auto italic">
                "{selectedEmoji} {replyMessage.trim() || 'Em cảm ơn anh vì tất cả, yêu anh thật nhiều!'}"
              </div>

              {/* Direct share shortcuts */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {phoneNumber ? (
                  <a
                    href={`https://zalo.me/${phoneNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Mở Zalo gửi anh &rarr;
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(formattedShareMessage).catch(() => {});
                      alert('Đã sao chép lời nhắn! Em hãy dán vào khung chat Zalo/Messenger của anh nhé.');
                    }}
                    className="px-4 py-2 text-xs font-semibold rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                  >
                    Sao chép lại tin nhắn 📋
                  </button>
                )}

                <button
                  onClick={() => setIsSent(false)}
                  className="px-4 py-2 text-xs font-medium rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  Viết thêm tin khác
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quiet Footer Note */}
        <footer className="mt-16 text-center text-xs text-stone-400 space-y-1">
          <p>Dành trọn vẹn yêu thương nhân Ngày Phụ Nữ Việt Nam 20.10</p>
          <p className="font-medium text-rose-500">Mãi mãi là bình yên của nhau 🌹</p>
        </footer>
      </div>
    </section>
  );
};

import React, { useState } from 'react';
import { Heart, Sparkles, Quote, CheckCircle2 } from 'lucide-react';
import fallbackBouquetImg from '../assets/images/romantic_red_roses_bouquet_1792465473755.jpg';

interface LoveLetterSectionProps {
  herName: string;
  senderName: string;
  bouquetImage: string;
}

export const LoveLetterSection: React.FC<LoveLetterSectionProps> = ({
  herName,
  senderName,
  bouquetImage,
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'wishes' | 'promises'>('letter');

  return (
    <section id="loi-chuc" className="relative py-16 sm:py-20 bg-gradient-to-b from-transparent via-rose-50/50 to-transparent">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
            <Sparkles size={14} />
            <span>Thư Tình 20/10</span>
            <Sparkles size={14} />
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
            Những Lời Chúc Ngọt Ngào Nhất Dành Cho Em
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 font-light">
            Mỗi câu từ anh viết dưới đây đều gửi gắm sự trân quý và tình yêu chân thành nhất.
          </p>

          {/* Interactive Navigation Segmented Control */}
          <div className="mt-6 inline-flex p-1 bg-stone-100 rounded-xl border border-stone-200/80">
            <button
              onClick={() => setActiveTab('letter')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'letter'
                  ? 'bg-white text-rose-950 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Bức Thư Gửi Em
            </button>
            <button
              onClick={() => setActiveTab('wishes')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'wishes'
                  ? 'bg-white text-rose-950 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Lời Chúc Ý Nghĩa
            </button>
            <button
              onClick={() => setActiveTab('promises')}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'promises'
                  ? 'bg-white text-rose-950 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Lời Hứa Của Anh
            </button>
          </div>
        </div>

        {/* Dynamic Content Display */}
        {activeTab === 'letter' && (
          <div className="relative mx-auto max-w-3xl rounded-3xl bg-white p-6 sm:p-10 lg:p-12 shadow-xl shadow-rose-100/50 border border-rose-100">
            <Quote className="absolute top-6 left-6 text-rose-200/60" size={48} />
            <div className="relative space-y-5 text-stone-700 leading-relaxed text-sm sm:text-base">
              <p className="font-serif-display text-lg sm:text-xl text-rose-900 font-semibold italic">
                {herName ? `${herName} thương yêu,` : 'Em thương yêu,'}
              </p>

              <p>
                Hôm nay là ngày 20/10 - ngày tôn vinh những người phụ nữ tuyệt vời, và người đầu tiên
                anh nghĩ đến với tất cả sự trân trọng và yêu thương chính là em.
              </p>

              <p>
                Trong thế giới rộng lớn và bận rộn này, có thể gặp được em, lắng nghe tiếng em cười
                và có em cùng sẻ chia những khoảnh khắc đời thường là điều may mắn nhất đối với anh.
                Ở bên em, anh luôn cảm nhận được sự ấm áp, bình yên và những niềm vui giản dị nhưng
                ngọt ngào vô cùng.
              </p>

              <p>
                Anh biết cuộc sống đôi khi có những mệt mỏi, áp lực và những ngày khiến em phải lo toan.
                Nhưng hãy nhớ rằng, em không cần phải luôn tỏ ra mạnh mẽ. Anh luôn ở đây, sẵn sàng làm
                chỗ dựa vững chãi, lắng nghe mọi điều em muốn giãi bày và cùng em đi qua mọi thăng trầm.
              </p>

              <p>
                Chúc công chúa của anh một ngày 20/10 ngập tràn hoa tươi, nụ cười luôn rạng rỡ trên môi,
                mọi điều ước đều thành hiện thực và mãi là người con gái hạnh phúc nhất.
              </p>

              <div className="pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-xs text-stone-500">
                  <p>Viết riêng cho em vào ngày 20 tháng 10</p>
                  <p className="text-rose-600 font-medium">Bằng trọn vẹn trái tim anh</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-stone-400">Yêu và thương em thật nhiều,</p>
                  <p className="font-handwriting text-2xl text-rose-700 font-bold tracking-wide">
                    {senderName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wishes' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-white p-6 shadow-md border border-rose-100/80 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-3 block">🌸</span>
                <h3 className="font-serif-display text-base font-semibold text-stone-900 mb-2">
                  Rạng Rỡ & Xinh Đẹp
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  Chúc em luôn giữ mãi nụ cười tỏa nắng. Mong mỗi sớm mai thức dậy, em đều cảm thấy
                  yêu đời, tự tin và ngập tràn năng lượng tích cực.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-50 text-xs text-rose-600 font-medium">
                Nụ cười của em là ánh sáng của anh
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md border border-rose-100/80 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-3 block">✨</span>
                <h3 className="font-serif-display text-base font-semibold text-stone-900 mb-2">
                  Bình An & May Mắn
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  Chúc công việc của em luôn thuận buồm xuôi gió, mọi dự định đều thành công mỹ mãn.
                  Những lúc mệt mỏi luôn có bình yên tìm về bên em.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-50 text-xs text-rose-600 font-medium">
                May mắn sẽ luôn mỉm cười với em
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md border border-rose-100/80 flex flex-col justify-between">
              <div>
                <span className="text-2xl mb-3 block">💖</span>
                <h3 className="font-serif-display text-base font-semibold text-stone-900 mb-2">
                  Được Cưng Chiều & Yêu Thương
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed font-light">
                  Không chỉ riêng 20/10 mà suốt 365 ngày trong năm, mong em luôn cảm nhận được rằng
                  mình là người phụ nữ được yêu thương và nâng niu nhất.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-50 text-xs text-rose-600 font-medium">
                Bởi vì em xứng đáng với tất cả
              </div>
            </div>
          </div>
        )}

        {activeTab === 'promises' && (
          <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-rose-100 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-rose-50 border border-rose-100">
              <img
                src={bouquetImage || fallbackBouquetImg}
                alt="Bó hoa hồng đỏ trao gửi yêu thương"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackBouquetImg;
                }}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-serif-display text-xl font-bold text-stone-900">
                5 Điều Anh Hứa Dành Cho Em
              </h3>
              <div className="space-y-3">
                {[
                  "Luôn lắng nghe em với tất cả sự kiên nhẫn và thấu hiểu.",
                  "Là bờ vai ấm áp mỗi khi em cần một điểm tựa bình yên.",
                  "Không bao giờ để em phải giận hờn hay buồn phiền qua đêm.",
                  "Cùng em chia sẻ những điều nhỏ nhặt và tạo nên thật nhiều kỷ niệm đẹp.",
                  "Tiếp tục yêu thương, bảo bọc và trân trọng em hơn mỗi ngày trôi qua.",
                ].map((promise, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-stone-700">
                    <CheckCircle2 size={18} className="text-rose-500 shrink-0 mt-0.5" />
                    <span>{promise}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

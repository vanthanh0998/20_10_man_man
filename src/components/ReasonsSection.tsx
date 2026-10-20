import React, { useState } from 'react';
import { Heart, Smile, Sparkles, Coffee, Compass, Sun, Star } from 'lucide-react';

interface Reason {
  id: number;
  icon: React.ReactNode;
  title: string;
  teaser: string;
  detail: string;
}

const REASONS: Reason[] = [
  {
    id: 1,
    icon: <Smile className="text-amber-500" size={24} />,
    title: "Nụ cười tỏa nắng của em",
    teaser: "Mỗi khi thấy em cười, mọi mệt mỏi trong ngày của anh đều tan biến...",
    detail: "Em cười đẹp lắm! Nụ cười tự nhiên, rạng rỡ của em như tiếp thêm sức sống và biến những ngày bình thường nhất trở thành ngày rực rỡ sắc màu.",
  },
  {
    id: 2,
    icon: <Sun className="text-rose-500" size={24} />,
    title: "Trái tim nhân hậu & dịu dàng",
    teaser: "Cách em luôn quan tâm, lo lắng cho mọi người xung quanh...",
    detail: "Anh yêu sự tinh tế và ấm áp từ cách em lắng nghe, sự thấu hiểu chân thành mà em dành cho anh và những người thân yêu.",
  },
  {
    id: 3,
    icon: <Coffee className="text-orange-500" size={24} />,
    title: "Những câu chuyện líu lo không hồi kết",
    teaser: "Những lúc em hào hứng kể về một ngày của mình...",
    detail: "Dù là chuyện vu vơ trên đường, chuyện công việc hay một món ăn ngon, được nghe giọng nói của em là thói quen ngọt ngào nhất của anh mỗi tối.",
  },
  {
    id: 4,
    icon: <Compass className="text-indigo-500" size={24} />,
    title: "Sự kiên cường và nỗ lực của em",
    teaser: "Anh luôn tự hào về sự chăm chỉ và ước mơ của em...",
    detail: "Em luôn nỗ lực hết mình vì những mục tiêu đã đặt ra. Nhìn em cố gắng mỗi ngày, anh vừa tự hào, vừa muốn dang tay che chở cho em thật nhiều.",
  },
  {
    id: 5,
    icon: <Heart className="text-red-500" size={24} />,
    title: "Cảm giác bình yên khi ở cạnh em",
    teaser: "Chẳng cần đi đâu xa, chỉ cần có em bên cạnh...",
    detail: "Chỉ cần ngồi cạnh nhau, cùng uống một tách trà hay nắm tay dạo phố, thế giới dường như chậm lại và mọi âu lo đều lùi về phía sau.",
  },
  {
    id: 6,
    icon: <Star className="text-yellow-500" size={24} />,
    title: "Đơn giản vì em là chính em",
    teaser: "Không cần hoàn hảo, em đã là món quà tuyệt vời nhất...",
    detail: "Dù là lúc em vui vẻ hay những lúc em làm nũng, tất cả những gì thuộc về em đều khiến trái tim anh rung động và yêu thương em nhiều hơn.",
  },
];

export const ReasonsSection: React.FC<{ herName: string }> = ({ herName }) => {
  const [activeReason, setActiveReason] = useState<number | null>(null);

  const toggleReason = (id: number) => {
    setActiveReason(activeReason === id ? null : id);
  };

  return (
    <section id="ly-do-yeu" className="py-16 sm:py-20 bg-rose-50/40">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
            <Sparkles size={14} />
            <span>Tâm Sự Nhỏ</span>
            <Sparkles size={14} />
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
            Những Điều Ở {herName} Làm Tim Anh Rung Động
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 font-light">
            Nhấn vào từng điều để đọc những lời tâm sự chân thành anh dành cho em nhé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((reason) => {
            const isOpen = activeReason === reason.id;
            return (
              <div
                key={reason.id}
                onClick={() => toggleReason(reason.id)}
                className={`cursor-pointer rounded-2xl bg-white p-6 shadow-sm border transition-all duration-300 ${
                  isOpen
                    ? 'border-rose-300 ring-2 ring-rose-100 shadow-md'
                    : 'border-rose-100/80 hover:border-rose-200 hover:shadow-md'
                }`}
                role="button"
                tabIndex={0}
                aria-expanded={isOpen}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') toggleReason(reason.id);
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 border border-rose-100">
                    {reason.icon}
                  </div>
                  <span className="text-xs font-mono font-medium text-rose-500">
                    0{reason.id}
                  </span>
                </div>

                <h3 className="font-serif-display text-base font-bold text-stone-900 mb-2">
                  {reason.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light mb-3">
                  {reason.teaser}
                </p>

                {isOpen && (
                  <div className="pt-3 border-t border-rose-100 text-xs sm:text-sm text-rose-800 leading-relaxed bg-rose-50/50 p-3 rounded-xl animate-fadeIn">
                    {reason.detail}
                  </div>
                )}

                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-rose-600">
                  <span>{isOpen ? 'Thu gọn' : 'Đọc tâm sự của anh'}</span>
                  <span className="text-[10px]">&rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

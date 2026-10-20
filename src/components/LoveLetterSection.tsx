import React, { useState } from 'react';
import { CheckCircle2, Quote, Sparkles } from 'lucide-react';
import fallbackBouquetImg from '../assets/images/romantic_red_roses_bouquet_1792465473755.jpg';

interface LoveLetterSectionProps {
  herName: string; senderName: string; bouquetImage: string;
  letterTitle?: string; letterSalutation?: string; letterContent?: string[];
  wishesContent?: string[]; promisesContent?: string[];
  showWishes?: boolean; showPromises?: boolean;
}

const defaultLetter = [
  'Hôm nay là ngày 20/10 - ngày tôn vinh những người phụ nữ tuyệt vời, và người đầu tiên anh nghĩ đến với tất cả sự trân trọng và yêu thương chính là em.',
  'Trong thế giới rộng lớn và bận rộn này, có thể gặp được em, lắng nghe tiếng em cười và có em cùng sẻ chia những khoảnh khắc đời thường là điều may mắn nhất đối với anh.',
  'Anh biết cuộc sống đôi khi có những mệt mỏi, áp lực và những ngày khiến em phải lo toan. Nhưng hãy nhớ rằng, em không cần phải luôn tỏ ra mạnh mẽ. Anh luôn ở đây, sẵn sàng lắng nghe và cùng em đi qua mọi thăng trầm.',
  'Chúc công chúa của anh một ngày 20/10 ngập tràn hoa tươi, nụ cười luôn rạng rỡ trên môi, mọi điều ước đều thành hiện thực và mãi là người con gái hạnh phúc nhất.',
];
const lines = (items?: string[], fallback: string[] = []) => (items && items.length ? items : fallback).filter((item) => item.trim());

export const LoveLetterSection: React.FC<LoveLetterSectionProps> = ({
  herName, senderName, bouquetImage, letterTitle, letterSalutation, letterContent,
  wishesContent, promisesContent, showWishes = true, showPromises = true,
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'wishes' | 'promises'>('letter');
  const letter = lines(letterContent, defaultLetter);
  const wishes = lines(wishesContent, ['Chúc em luôn vui vẻ, bình an và hạnh phúc mỗi ngày.']);
  const promises = lines(promisesContent, ['Anh sẽ luôn lắng nghe, yêu thương và trân trọng em.']);
  const tabClass = (tab: string) => `px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors ${activeTab === tab ? 'bg-white text-rose-950 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`;

  return <section id="loi-chuc" className="relative py-16 sm:py-20 bg-gradient-to-b from-transparent via-rose-50/50 to-transparent">
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2"><Sparkles size={14} /><span>Thư tình 20/10</span><Sparkles size={14} /></div>
        <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight break-words [overflow-wrap:anywhere]">{letterTitle || `Những Lời Chúc Ngọt Ngào Nhất Dành Cho ${herName || 'Em'}`}</h2>
        <p className="mt-3 text-sm sm:text-base text-stone-600 font-light">Mỗi câu từ anh viết dưới đây đều gửi gắm sự trân quý và tình yêu chân thành nhất.</p>
        <div className="mt-6 inline-flex flex-wrap justify-center p-1 bg-stone-100 rounded-xl border border-stone-200/80">
          <button onClick={() => setActiveTab('letter')} className={tabClass('letter')}>Bức Thư Gửi Em</button>
          {showWishes && <button onClick={() => setActiveTab('wishes')} className={tabClass('wishes')}>Lời Chúc Ý Nghĩa</button>}
          {showPromises && <button onClick={() => setActiveTab('promises')} className={tabClass('promises')}>Lời Hứa Của Anh</button>}
        </div>
      </div>

      {activeTab === 'letter' && <div className="relative mx-auto max-w-3xl rounded-3xl bg-white p-6 sm:p-10 lg:p-12 shadow-xl shadow-rose-100/50 border border-rose-100"><Quote className="absolute top-6 left-6 text-rose-200/60" size={48} /><div className="relative space-y-5 text-stone-700 leading-relaxed text-sm sm:text-base"><p className="font-serif-display text-lg sm:text-xl text-rose-900 font-semibold italic whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{letterSalutation || `${herName || 'Em'} thương yêu,`}</p>{letter.map((paragraph, index) => <p key={index} className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{paragraph}</p>)}<div className="pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"><div className="text-xs text-stone-500"><p>Viết riêng cho em vào ngày 20 tháng 10</p><p className="text-rose-600 font-medium">Bằng trọn vẹn trái tim anh</p></div><div className="text-right"><p className="text-xs text-stone-400">Yêu và thương em thật nhiều,</p><p className="font-handwriting text-2xl text-rose-700 font-bold tracking-wide break-words [overflow-wrap:anywhere]">{senderName}</p></div></div></div></div>}

      {activeTab === 'wishes' && showWishes && <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{wishes.map((wish, index) => <div key={index} className="rounded-2xl bg-white p-6 shadow-md border border-rose-100/80"><span className="text-2xl mb-3 block">{['🌸', '✨', '💖'][index % 3]}</span><p className="text-sm text-stone-600 leading-relaxed font-light whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{wish}</p></div>)}</div>}

      {activeTab === 'promises' && showPromises && <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-rose-100 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"><div className="md:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-rose-50 border border-rose-100"><img src={bouquetImage || fallbackBouquetImg} alt="Bó hoa hồng đỏ" referrerPolicy="no-referrer" className="h-full w-full object-cover" /></div><div className="md:col-span-7 space-y-4"><h3 className="font-serif-display text-xl font-bold text-stone-900">Những điều anh hứa dành cho em</h3><div className="space-y-3">{promises.map((promise, index) => <div key={index} className="flex items-start gap-3 text-sm text-stone-700 whitespace-pre-wrap break-words [overflow-wrap:anywhere]"><CheckCircle2 size={18} className="text-rose-500 shrink-0 mt-0.5" /><span className="break-words [overflow-wrap:anywhere]">{promise}</span></div>)}</div></div></div>}
    </div>
  </section>;
};

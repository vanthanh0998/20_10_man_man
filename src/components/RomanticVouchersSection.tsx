import React, { useState } from 'react';
import { Ticket, Sparkles, Check, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Voucher {
  id: string;
  code: string;
  title: string;
  desc: string;
  validity: string;
}

const INITIAL_VOUCHERS: Voucher[] = [
  {
    id: 'v1',
    code: 'TRASUA-2010',
    title: '01 Vé Thưởng Thức Trà Sữa Tùy Chọn',
    desc: 'Có giá trị đổi 1 ly trà sữa full topping hoặc thức uống em mê nhất bất kể lúc nào em thèm.',
    validity: 'Hạn dùng: Vô thời hạn',
  },
  {
    id: 'v2',
    code: 'OM-AP-999',
    title: '01 Vé Một Cái Ôm Thật Chặt & Bờ Vai Ấm',
    desc: 'Dùng khi mệt mỏi, cần được dỗ dành hoặc đơn giản là muốn nạp năng lượng yêu thương.',
    validity: 'Hạn dùng: 24/7 bất cứ khi nào em cần',
  },
  {
    id: 'v3',
    code: 'NGOAN-NGOAN-01',
    title: '01 Ngày Anh Ngoan Ngoãn Nghe Lời Em',
    desc: 'Trong 24 giờ, anh sẽ phục tùng mọi yêu cầu ăn uống, dạo phố và chiều chuộng em hết nấc.',
    validity: 'Hạn dùng: Áp dụng bất cứ ngày nào em chọn',
  },
  {
    id: 'v4',
    code: 'HEN-HO-SWEET',
    title: '01 Buổi Hẹn Hò Lãng Mạn & Ăn Món Em Thích',
    desc: 'Anh sẽ lên lịch trình, chọn quán xinh, chở em đi và chụp cho em 1001 tấm hình lung linh.',
    validity: 'Hạn dùng: Bất kỳ ngày cuối tuần nào',
  },
];

export const RomanticVouchersSection: React.FC<{ herName: string }> = ({ herName }) => {
  const [claimedVouchers, setClaimedVouchers] = useState<Record<string, boolean>>({});
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const handleClaim = (voucher: Voucher) => {
    setClaimedVouchers((prev) => ({ ...prev, [voucher.id]: true }));

    try {
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#facc15'],
      });
    } catch {
      // safe fallback
    }

    const message = `Em dùng vé tình yêu [${voucher.title}] này nhé anh yêu! Nhớ thực hiện nha 🥰`;
    navigator.clipboard?.writeText(message).catch(() => {});
    setCopiedNotification(`Đã đổi vé [${voucher.title}]! Đã sao chép tin nhắn để em gửi cho anh.`);

    setTimeout(() => {
      setCopiedNotification(null);
    }, 4000);
  };

  return (
    <section className="py-16 bg-white border-t border-b border-rose-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
            <Ticket size={14} />
            <span>Đặc Quyền Của Em</span>
            <Ticket size={14} />
          </div>
          <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Phiếu Yêu Thương Dành Riêng Cho {herName}
          </h2>
          <p className="mt-2 text-sm text-stone-600 font-light">
            Em có quyền kích hoạt các tấm vé này bất cứ lúc nào, anh cam kết thực hiện 100%!
          </p>
        </div>

        {copiedNotification && (
          <div className="mb-6 mx-auto max-w-md p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center font-medium animate-fadeIn">
            {copiedNotification}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {INITIAL_VOUCHERS.map((voucher) => {
            const isClaimed = claimedVouchers[voucher.id];
            return (
              <div
                key={voucher.id}
                className="relative rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 p-5 flex flex-col justify-between transition-all hover:bg-rose-50 hover:border-rose-300"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-rose-700 font-mono mb-2">
                    <span className="font-bold flex items-center gap-1">
                      <Sparkles size={12} />
                      {voucher.code}
                    </span>
                    <span className="text-stone-400 font-sans text-[11px]">{voucher.validity}</span>
                  </div>

                  <h3 className="font-serif-display text-base font-bold text-stone-900 mb-2">
                    {voucher.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    {voucher.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-rose-200/60 flex items-center justify-between">
                  <span className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
                    <Heart size={12} className="fill-rose-500" />
                    Bảo hành trọn đời
                  </span>

                  <button
                    onClick={() => handleClaim(voucher)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 flex items-center gap-1.5 ${
                      isClaimed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95 shadow-sm'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <Check size={13} />
                        <span>Đã kích hoạt</span>
                      </>
                    ) : (
                      <>
                        <span>Dùng vé này</span>
                        <span>&rarr;</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

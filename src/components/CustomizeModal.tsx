import React, { useState } from 'react';
import { X, Upload, Check, Link2, Sparkles, Image as ImageIcon, Trash2, HelpCircle } from 'lucide-react';
import { GalleryPhoto } from './PhotoGallerySection.tsx';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  herName: string;
  senderName: string;
  grabGiftLink: string;
  phoneNumber: string;
  photos: GalleryPhoto[];
  onSave: (data: {
    herName: string;
    senderName: string;
    grabGiftLink: string;
    phoneNumber: string;
    photos: GalleryPhoto[];
  }) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  herName: initHerName,
  senderName: initSenderName,
  grabGiftLink: initGrabLink,
  phoneNumber: initPhone,
  photos: initPhotos,
  onSave,
}) => {
  const [herName, setHerName] = useState(initHerName);
  const [senderName, setSenderName] = useState(initSenderName);
  const [grabGiftLink, setGrabGiftLink] = useState(initGrabLink);
  const [phoneNumber, setPhoneNumber] = useState(initPhone);
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initPhotos);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPhoto: GalleryPhoto = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            url: event.target.result as string,
            caption: `Nụ cười rạng rỡ của ${herName || 'em'}`,
            date: 'Kỷ niệm yêu thương',
          };
          setPhotos((prev) => [newPhoto, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveAndClose = () => {
    onSave({
      herName,
      senderName,
      grabGiftLink,
      phoneNumber,
      photos,
    });
    onClose();
  };

  const generateShareableUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('her', herName);
    url.searchParams.set('from', senderName);
    if (grabGiftLink) url.searchParams.set('grab', grabGiftLink);
    if (phoneNumber) url.searchParams.set('phone', phoneNumber);

    const shareUrl = url.toString();
    navigator.clipboard?.writeText(shareUrl).catch(() => {});
    setShareLinkCopied(true);
    setTimeout(() => setShareLinkCopied(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto border border-rose-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-serif-display text-lg sm:text-xl font-bold text-stone-900">
                Tùy Chỉnh Cho Nàng & Tải Ảnh Lên
              </h2>
              <p className="text-xs text-stone-500">
                Cá nhân hóa tên gọi, hình ảnh và link quà tặng của em ấy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Section 1: Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Tên hoặc biệt danh của cô ấy:
              </label>
              <input
                type="text"
                value={herName}
                onChange={(e) => setHerName(e.target.value)}
                placeholder="VD: Em Yêu, Bé Heo, Lan Anh, Quỳnh..."
                className="w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Tên hoặc biệt danh của bạn (người gửi):
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="VD: Anh Yêu, Thành, Hoàng..."
                className="w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* Section 2: Photos Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-stone-700">
                Thêm hình ảnh của cô ấy vào website:
              </label>
              <span className="text-[11px] text-rose-600 font-medium">
                {photos.length} hình trong album
              </span>
            </div>

            {/* Upload Button */}
            <label className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/40 hover:bg-rose-50 cursor-pointer transition-colors text-center group">
              <Upload size={24} className="text-rose-500 mb-1.5 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-rose-700">
                Bấm vào đây để chọn ảnh của cô ấy từ máy tính/điện thoại
              </span>
              <span className="text-[11px] text-stone-500 mt-0.5">
                Hỗ trợ ảnh JPG, PNG, WEBP (ảnh tự động hiển thị ngay)
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Photo thumbnails preview list */}
            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                {photos.map((p) => (
                  <div
                    key={p.id}
                    className="relative group rounded-xl overflow-hidden aspect-square border border-stone-200 bg-stone-50"
                  >
                    <img
                      src={p.url}
                      alt={p.caption}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(p.id)}
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Xóa ảnh này"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Grab Gift Link & Phone */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Link đặt nước / Quà GrabFood (tùy chỉnh):
              </label>
              <input
                type="url"
                value={grabGiftLink}
                onChange={(e) => setGrabGiftLink(e.target.value)}
                placeholder="https://food.grab.com/vn/vi/ hoặc link quán trà sữa yêu thích của cô ấy"
                className="w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-200"
              />
              <p className="text-[11px] text-stone-500 mt-1">
                Gợi ý: Bạn có thể dán link trực tiếp một quán cụ thể trên Grab (như Koi Thé, Phúc Long, Phê La...) để nàng mở ra là chọn món được ngay!
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Số điện thoại Zalo của bạn (tùy chọn):
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="VD: 0912345678 (để cô ấy bấm nút là mở thẳng Zalo gửi tin nhắn cho bạn)"
                className="w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-200"
              />
            </div>
          </div>

          {/* Section 4: Share Link Generator */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Link2 size={14} className="text-rose-600" />
                <span>Tạo liên kết chia sẻ trực tiếp:</span>
              </span>
              <button
                type="button"
                onClick={generateShareableUrl}
                className="px-3 py-1 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1"
              >
                {shareLinkCopied ? <Check size={13} /> : <Link2 size={13} />}
                <span>{shareLinkCopied ? 'Đã sao chép link!' : 'Sao chép link gửi nàng'}</span>
              </button>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Liên kết này đã mã hóa tên cô ấy và các thiết lập, cô ấy mở trên điện thoại hay máy tính đều xem được ngay lập tức!
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-800 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSaveAndClose}
            className="px-6 py-2 text-xs sm:text-sm font-semibold rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-all"
          >
            Lưu & Áp Dụng Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

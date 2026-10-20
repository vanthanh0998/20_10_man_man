import React, { useState } from 'react';
import {
  X,
  Upload,
  Link2,
  Sparkles,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Check,
  Download,
  AlertCircle,
  Loader2,
  Camera,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { LoveConfig } from '../config/loveConfig.ts';
import { uploadToImgBB, compressImage } from '../utils/cloudImageUploader.ts';

interface AdminSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LoveConfig;
  onSaveConfig: (newConfig: LoveConfig) => void;
}

export const AdminSetupModal: React.FC<AdminSetupModalProps> = ({
  isOpen,
  onClose,
  config: initialConfig,
  onSaveConfig,
}) => {
  const [pin, setPin] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');

  // Editable form state
  const [config, setConfig] = useState<LoveConfig>(initialConfig);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'content' | 'share'>('photos');

  // Input for adding by URL
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [customCaption, setCustomCaption] = useState<string>('');

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 2010 (Ngày 20/10) hoặc 1309 (ngày sinh/mã riêng)
    if (pin.trim() === '2010' || pin.trim() === '1309' || pin.trim() === 'admin') {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Mã PIN không đúng. Gợi ý: Hãy nhập "2010"');
    }
  };

  // Upload local photos to Cloud
  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Đang tải lên ${files.length} ảnh lên Cloud...`);

    const newPhotos = [...config.photos];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Đang tải ảnh ${i + 1}/${files.length} lên Cloud...`);

        let publicUrl = '';
        try {
          // Attempt cloud upload to ImgBB
          publicUrl = await uploadToImgBB(file);
        } catch {
          // Fallback to local optimized base64 if cloud upload fails
          publicUrl = await compressImage(file, 1200, 0.8);
        }

        newPhotos.unshift({
          id: `photo-${Date.now()}-${i}`,
          url: publicUrl,
          caption: `Nụ cười của ${config.herName || 'em'}`,
          date: 'Kỷ niệm yêu thương',
        });
      }

      setConfig((prev) => ({ ...prev, photos: newPhotos }));
      setUploadProgress('Tải ảnh thành công! Các ảnh đã sẵn sàng.');
    } catch {
      setUploadProgress('Có lỗi khi tải ảnh, vui lòng thử lại.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(''), 3000);
    }
  };

  const handleAddPhotoByUrl = () => {
    if (!customPhotoUrl.trim()) return;
    const newPhoto = {
      id: `photo-${Date.now()}`,
      url: customPhotoUrl.trim(),
      caption: customCaption.trim() || `Khoảnh khắc bên ${config.herName || 'em'}`,
      date: 'Kỷ niệm đẹp',
    };
    setConfig((prev) => ({
      ...prev,
      photos: [newPhoto, ...prev.photos],
    }));
    setCustomPhotoUrl('');
    setCustomCaption('');
  };

  const handleRemovePhoto = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  };

  const handleSaveAndApply = () => {
    onSaveConfig(config);
    onClose();
  };

  // Generate share link with compressed URL parameters (NO VERCEL REDEPLOY NEEDED!)
  const generateShareLink = () => {
    const url = new URL(window.location.origin + window.location.pathname);

    // Filter to only include necessary payload
    const compactPayload = {
      h: config.herName,
      s: config.senderName,
      g: config.grabGiftLink,
      p: config.phoneNumber,
      // Only keep photo URLs and captions
      photos: config.photos.map((pt) => ({ u: pt.url, c: pt.caption, d: pt.date })),
    };

    try {
      const jsonStr = JSON.stringify(compactPayload);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
      url.searchParams.set('love', encoded);
      const finalUrl = url.toString();

      navigator.clipboard?.writeText(finalUrl).catch(() => {});
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 4000);
    } catch {
      // Fallback simple params
      url.searchParams.set('her', config.herName);
      url.searchParams.set('from', config.senderName);
      if (config.grabGiftLink) url.searchParams.set('grab', config.grabGiftLink);
      navigator.clipboard?.writeText(url.toString()).catch(() => {});
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 4000);
    }
  };

  // Download config.json for Git commit (if user wants to permanently commit without URL params)
  const downloadConfigFile = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'loveConfig.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl my-8 max-h-[92vh] overflow-y-auto border border-rose-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-200">
              {isUnlocked ? <Unlock size={18} /> : <Lock size={18} />}
            </div>
            <div>
              <h2 className="font-serif-display text-lg sm:text-xl font-bold text-stone-900">
                Bảng Quản Trị & Setup Dành Cho Bạn
              </h2>
              <p className="text-xs text-stone-500">
                Thêm ảnh nàng, sửa lời chúc & tạo link gửi nàng (Không cần deploy lại Vercel)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* STEP 1: PIN UNLOCK SCREEN */}
        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="py-6 max-w-sm mx-auto text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-100">
              <Lock size={26} />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Nhập mã PIN Quản Trị</h3>
              <p className="text-xs text-stone-500 mt-1">
                Để bảo vệ quyền riêng tư, nhập mã PIN để vào chỉnh sửa. (Mặc định: <span className="font-bold text-rose-600">2010</span>)
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="password"
                maxLength={10}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Nhập PIN (2010)"
                className="w-full text-center text-xl tracking-widest rounded-xl border border-rose-200 p-3 focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
                autoFocus
              />
              {pinError && <p className="text-xs text-red-500 font-medium">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold transition-colors shadow-md"
            >
              Mở Khóa Bảng Setup
            </button>
          </form>
        ) : (
          /* STEP 2: ADMIN SETUP CONTENT */
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200/60">
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'photos' ? 'bg-white text-rose-950 shadow-sm' : 'text-stone-600'
                }`}
              >
                <Camera size={14} />
                <span>Kho Ảnh Nàng ({config.photos.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'content' ? 'bg-white text-rose-950 shadow-sm' : 'text-stone-600'
                }`}
              >
                <Heart size={14} />
                <span>Nội Dung & Quà Grab</span>
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'share' ? 'bg-white text-rose-950 shadow-sm' : 'text-stone-600'
                }`}
              >
                <Link2 size={14} />
                <span>Tạo Link Gửi Nàng</span>
              </button>
            </div>

            {/* TAB 1: PHOTOS MANAGEMENT */}
            {activeTab === 'photos' && (
              <div className="space-y-5">
                <div className="rounded-2xl bg-rose-50/60 border border-rose-200/60 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-rose-500 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-stone-700 leading-relaxed">
                      <p className="font-semibold text-rose-900 mb-0.5">
                        Tính năng tải ảnh lên Cloud miễn phí:
                      </p>
                      Khi bạn chọn ảnh từ máy tính/điện thoại, ảnh sẽ tự động được đưa lên Cloud lưu trữ vĩnh viễn. Bạn <strong>không cần phải deploy lại Vercel</strong>, chỉ cần lưu và lấy link gửi cho cô ấy là ảnh tự hiển thị!
                    </div>
                  </div>
                </div>

                {/* Upload Action */}
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-rose-300 bg-white hover:bg-rose-50/50 cursor-pointer transition-colors text-center group shadow-sm">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Loader2 size={26} className="animate-spin text-rose-600" />
                      <span className="text-xs font-semibold text-rose-700">{uploadProgress}</span>
                    </div>
                  ) : (
                    <>
                      <Upload size={28} className="text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-xs sm:text-sm font-semibold text-stone-800">
                        Bấm để chọn tải ảnh của cô ấy từ máy tính / điện thoại
                      </span>
                      <span className="text-[11px] text-stone-400 mt-1">
                        Hỗ trợ nhiều ảnh cùng lúc (.jpg, .png, .webp) - Tự động nén & upload Cloud
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleUploadFiles}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>

                {/* Or Add by Direct URL */}
                <div className="rounded-xl border border-stone-200 p-3 bg-stone-50/60">
                  <p className="text-xs font-semibold text-stone-700 mb-2">
                    Hoặc dán trực tiếp đường link ảnh (Imgur, Facebook, Google Drive...):
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      placeholder="https://...link-anh-cua-nang.jpg"
                      className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <input
                      type="text"
                      value={customCaption}
                      onChange={(e) => setCustomCaption(e.target.value)}
                      placeholder="Lời tựa ảnh (tùy chọn)"
                      className="sm:w-48 rounded-lg border border-stone-200 px-3 py-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-rose-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddPhotoByUrl}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 shrink-0"
                    >
                      Thêm Ảnh
                    </button>
                  </div>
                </div>

                {/* Photos List Grid */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-stone-700">
                      Danh sách ảnh hiển thị trên website ({config.photos.length} ảnh):
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {config.photos.map((item, index) => (
                      <div
                        key={item.id}
                        className="relative group rounded-xl border border-stone-200 bg-stone-50 overflow-hidden flex flex-col"
                      >
                        <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                          <img
                            src={item.url}
                            alt={item.caption}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(item.id)}
                            className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white opacity-80 hover:opacity-100 shadow-md transition-opacity"
                            title="Xóa ảnh này"
                          >
                            <Trash2 size={13} />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-medium">
                              Ảnh đại diện chính
                            </span>
                          )}
                        </div>
                        <div className="p-2 bg-white">
                          <input
                            type="text"
                            value={item.caption}
                            onChange={(e) => {
                              const updated = config.photos.map((p) =>
                                p.id === item.id ? { ...p, caption: e.target.value } : p
                              );
                              setConfig({ ...config, photos: updated });
                            }}
                            className="w-full text-xs border-b border-stone-200 focus:border-rose-400 focus:outline-none text-stone-800"
                            placeholder="Lời tựa cho bức ảnh..."
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTENT & GRAB */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tên / Biệt danh cô ấy:
                    </label>
                    <input
                      type="text"
                      value={config.herName}
                      onChange={(e) => setConfig({ ...config, herName: e.target.value })}
                      placeholder="VD: Em Yêu, Bé Miu, Quỳnh Anh..."
                      className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-800 focus:ring-1 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tên / Biệt danh của bạn:
                    </label>
                    <input
                      type="text"
                      value={config.senderName}
                      onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
                      placeholder="VD: Anh Yêu, Thành..."
                      className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-800 focus:ring-1 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Link quà tặng GrabFood / Trà sữa:
                  </label>
                  <input
                    type="url"
                    value={config.grabGiftLink}
                    onChange={(e) => setConfig({ ...config, grabGiftLink: e.target.value })}
                    placeholder="https://food.grab.com/vn/vi/ hoặc link quán nàng thích"
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-800 focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Mẹo: Mở Grab trên điện thoại, tìm quán trà sữa cô ấy thích nhất, copy link chia sẻ và dán vào đây!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Số điện thoại Zalo của bạn (để nhận tin nhắn phản hồi):
                  </label>
                  <input
                    type="text"
                    value={config.phoneNumber}
                    onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                    placeholder="VD: 0987654321 (cô ấy bấm nút sẽ mở thẳng chat Zalo với bạn)"
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-800 focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: SHARE LINK GENERATION */}
            {activeTab === 'share' && (
              <div className="space-y-5">
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <Sparkles size={16} className="text-emerald-600" />
                    <span>Cách nhanh nhất: Tạo "Link Tình Yêu" gửi nàng</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Bạn <strong>KHÔNG CẦN deploy lại Vercel</strong>! Bấm nút bên dưới, hệ thống sẽ tạo một đường link đặc biệt đã nén toàn bộ hình ảnh và tên gọi bạn vừa setup. Bạn chỉ việc gửi link này cho nàng qua Zalo/Messenger, cô ấy mở ra là thấy ngay!
                  </p>

                  <button
                    onClick={generateShareLink}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs sm:text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
                  >
                    {copiedLink ? <Check size={16} /> : <Link2 size={16} />}
                    <span>{copiedLink ? 'ĐÃ SAO CHÉP LINK! BẠN CHỈ CẦN DÁN VÀ GỬI CHO NÀNG' : 'SAO CHÉP LINK GỬI NÀNG NGAY'}</span>
                  </button>
                </div>

                {/* Option 2: Download config file for permanent commit */}
                <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-stone-800">
                        Cách 2: Lưu làm mặc định cho tên miền gốc
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Nếu muốn ai truy cập thẳng `tang-em-man-20-10.vercel.app` cũng thấy ảnh nàng mà không cần link phụ:
                      </p>
                    </div>
                    <button
                      onClick={downloadConfigFile}
                      className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-xs font-medium text-stone-700 flex items-center gap-1 shrink-0"
                    >
                      <Download size={13} />
                      <span>Tải config.json</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs text-stone-400">
                Mẹo: Bạn có thể mở lại bảng này bằng nút ở góc dưới màn hình
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndApply}
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-colors"
                >
                  Lưu & Áp Dụng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

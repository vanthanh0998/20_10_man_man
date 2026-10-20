import React, { useState, useEffect } from 'react';
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
  AlertCircle,
  Loader2,
  Camera,
  Heart,
  ExternalLink,
  Gift,
  Eye,
  Copy,
  ShieldAlert,
} from 'lucide-react';
import { LoveConfig, DEFAULT_LOVE_CONFIG } from '../config/loveConfig.ts';
import { uploadImageDirect } from '../utils/cloudImageUploader.ts';
import { slugToVietnameseName } from '../utils/vietnameseNameMap.ts';
import { isManSlug, isDefaultManPhoto } from '../utils/romanticPlaceholder.ts';

interface AdminSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: LoveConfig;
  onSaveConfig: (newConfig: LoveConfig, slug?: string) => void;
  currentSlug?: string;
}

export const AdminSetupModal: React.FC<AdminSetupModalProps> = ({
  isOpen,
  onClose,
  config: initialConfig,
  onSaveConfig,
  currentSlug = 'man',
}) => {
  const [pin, setPin] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');

  // Editable form state
  const [slug, setSlug] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('love') || currentSlug || 'huong';
  });
  const [config, setConfig] = useState<LoveConfig>(initialConfig);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCleanLink, setCopiedCleanLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'link' | 'photos' | 'content' | 'share'>('link');

  // Input for adding by URL
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [customCaption, setCustomCaption] = useState<string>('');

  // Keep state synced when modal re-opens
  useEffect(() => {
    if (isOpen) {
      const params = new URLSearchParams(window.location.search);
      const urlLove = params.get('love');
      const activeSlug = (urlLove || currentSlug || 'huong').toLowerCase().trim();
      setSlug(activeSlug);

      if (isManSlug(activeSlug)) {
        const savedMan = localStorage.getItem('love_slug_man');
        if (savedMan) {
          try {
            setConfig(JSON.parse(savedMan));
            return;
          } catch {}
        }
        setConfig(DEFAULT_LOVE_CONFIG);
      } else {
        // Custom slug: load existing saved data if any, but NEVER leak Mẫn's photos!
        const savedCustom = localStorage.getItem(`love_slug_${activeSlug}`);
        const suggestedName = slugToVietnameseName(activeSlug);
        if (savedCustom) {
          try {
            const parsed = JSON.parse(savedCustom);
            const safePhotos = (parsed.photos || []).filter((p: any) => !isDefaultManPhoto(p.url));
            setConfig({
              ...DEFAULT_LOVE_CONFIG,
              ...parsed,
              herName: parsed.herName || suggestedName,
              photos: safePhotos,
            });
            return;
          } catch {}
        }

        // Brand new recipient: clean slate with 0 photos
        setConfig({
          ...DEFAULT_LOVE_CONFIG,
          herName: suggestedName,
          letterTitle: `Những Lời Chúc Ngọt Ngào Nhất Dành Cho ${suggestedName}`,
          letterSalutation: `${suggestedName} thương yêu,`,
          photos: [],
        });
      }
    }
  }, [isOpen, currentSlug]);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // PIN 2010 (ngày 20/10), 1309 hoặc admin
    if (pin.trim() === '2010' || pin.trim() === '1309' || pin.trim() === 'admin') {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Mã PIN không đúng. Gợi ý: Hãy nhập "2010"');
    }
  };

  const handleSlugChange = (newSlug: string) => {
    const cleanSlug = newSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setSlug(cleanSlug);

    if (isManSlug(cleanSlug)) {
      const savedMan = localStorage.getItem('love_slug_man');
      if (savedMan) {
        try {
          setConfig(JSON.parse(savedMan));
          return;
        } catch {}
      }
      setConfig(DEFAULT_LOVE_CONFIG);
      return;
    }

    // Dynamic slug for other recipient
    const savedCustom = localStorage.getItem(`love_slug_${cleanSlug}`);
    const suggestedName = slugToVietnameseName(cleanSlug);

    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        const safePhotos = (parsed.photos || []).filter((p: any) => !isDefaultManPhoto(p.url));
        setConfig({
          ...DEFAULT_LOVE_CONFIG,
          ...parsed,
          herName: parsed.herName || suggestedName,
          letterTitle: parsed.letterTitle || `Những Lời Chúc Ngọt Ngào Nhất Dành Cho ${suggestedName}`,
          letterSalutation: parsed.letterSalutation || `${suggestedName} thương yêu,`,
          photos: safePhotos,
        });
        return;
      } catch {}
    }

    // New unconfigured slug -> start with EMPTY photos to protect privacy!
    setConfig((prev) => ({
      ...prev,
      herName: suggestedName,
      letterTitle: `Những Lời Chúc Ngọt Ngào Nhất Dành Cho ${suggestedName}`,
      letterSalutation: `${suggestedName} thương yêu,`,
      photos: [],
    }));
  };

  // Upload local photos directly from device
  const handleUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Đang xử lý và nén ${files.length} ảnh...`);

    const newPhotos = [...config.photos];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress(`Đang xử lý ảnh ${i + 1}/${files.length}...`);

        const dataUrl = await uploadImageDirect(file);

        newPhotos.unshift({
          id: `photo-${Date.now()}-${i}`,
          url: dataUrl,
          caption: `Khoảnh khắc xinh đẹp của ${config.herName || 'em'}`,
          date: 'Kỷ niệm yêu thương',
        });
      }

      setConfig((prev) => ({ ...prev, photos: newPhotos }));
      setUploadProgress('Thêm ảnh thành công! Bạn có thể xem trước bên dưới.');
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

  // Only allow restoring default photos if the slug is Mẫn
  const handleRestoreManPhotos = () => {
    if (isManSlug(slug)) {
      setConfig((prev) => ({
        ...prev,
        photos: DEFAULT_LOVE_CONFIG.photos,
      }));
    }
  };

  const handleSaveAndApply = () => {
    const cleanSlug = slug.trim().toLowerCase() || 'huong';
    const isMan = isManSlug(cleanSlug);

    // If not 'man' and no photos are uploaded, notify user
    if (!isMan && config.photos.length === 0) {
      const confirmSaveWithoutPhotos = window.confirm(
        `Bạn chưa tải ảnh nào cho ${config.herName || cleanSlug}. Để bảo vệ quyền riêng tư, trang web yêu cầu phải có ít nhất 1 ảnh của nàng thì thiệp mới hiển thị cho người xem. Bạn vẫn muốn lưu bản nháp này chứ?`
      );
      if (!confirmSaveWithoutPhotos) return;
    }

    onSaveConfig(config, cleanSlug);
    onClose();
  };

  // Base URL
  const baseUrl = window.location.origin + window.location.pathname;
  const cleanLink = `${baseUrl}?love=${encodeURIComponent(slug.trim() || 'huong')}`;

  // Copy standard clean link
  const copyCleanLink = () => {
    navigator.clipboard?.writeText(cleanLink).catch(() => {});
    setCopiedCleanLink(true);
    setTimeout(() => setCopiedCleanLink(false), 3000);
  };

  // Generate full rich share link (with compact encoded configuration)
  const generateShareLink = () => {
    const url = new URL(baseUrl);
    const cleanSlug = slug.trim().toLowerCase() || 'huong';

    // Compact payload for full link
    const compactPayload = {
      slug: cleanSlug,
      h: config.herName,
      s: config.senderName,
      g: config.grabGiftLink,
      p: config.phoneNumber,
      photos: config.photos.slice(0, 10).map((pt) => ({
        u: pt.url,
        c: pt.caption,
        d: pt.date,
      })),
    };

    try {
      const jsonStr = JSON.stringify(compactPayload);
      const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
      url.searchParams.set('love', cleanSlug);
      url.searchParams.set('d', encoded);
      const finalUrl = url.toString();

      navigator.clipboard?.writeText(finalUrl).catch(() => {});
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 4000);
    } catch {
      copyCleanLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/80 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-200">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-serif-display text-base font-bold text-stone-900">
                Bảng Cài Đặt Cá Nhân Hóa (Admin)
              </h3>
              <p className="text-[11px] text-stone-500">
                Tự đổi tên, tải ảnh trực tiếp & tạo link động cho người ấy
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* PIN Authentication Screen */}
        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="p-6 sm:p-8 space-y-5 text-center flex-1">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
              <Lock size={26} />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-900">Mã PIN Quản Trị</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Nhập mã PIN để mở khóa trang cấu hình (Mặc định: <strong>2010</strong>)
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Nhập mã PIN..."
                autoFocus
                className="w-full text-center text-lg tracking-widest font-mono rounded-xl border border-stone-300 p-3 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 focus:outline-none"
              />
              {pinError && <p className="text-xs text-red-600 mt-2 font-medium">{pinError}</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full max-w-xs py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all active:scale-95"
              >
                MỞ KHÓA BẢNG ĐIỀU KHIỂN
              </button>
            </div>
          </form>
        ) : (
          /* Main Tabbed Management Panel */
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
            {/* Tab Navigation */}
            <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200/80">
              <button
                onClick={() => setActiveTab('link')}
                className={`flex-1 py-2 px-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'link' ? 'bg-white text-rose-950 shadow-sm' : 'text-stone-600'
                }`}
              >
                <Link2 size={14} />
                <span>1. Tên & Link</span>
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex-1 py-2 px-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'photos' ? 'bg-white text-rose-950 shadow-sm' : 'text-stone-600'
                }`}
              >
                <Camera size={14} />
                <span>2. Tải Ảnh ({config.photos.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`flex-1 py-2 px-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'content' ? 'bg-white text-rose-950 shadow-sm' : 'text-stone-600'
                }`}
              >
                <Heart size={14} />
                <span>3. Lời Chúc & Quà</span>
              </button>
              <button
                onClick={() => setActiveTab('share')}
                className={`flex-1 py-2 px-2 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'share' ? 'bg-white text-rose-950 shadow-sm' : 'text-stone-600'
                }`}
              >
                <Gift size={14} />
                <span>4. Lấy Link Gửi Nàng</span>
              </button>
            </div>

            {/* TAB 1: SLUG & NAMES */}
            {activeTab === 'link' && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-rose-50/70 border border-rose-200/80 p-4 space-y-3">
                  <label className="block text-xs font-bold text-rose-950 uppercase tracking-wide">
                    Đường Dẫn Riêng Biệt (Slug URL):
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-500 font-mono hidden sm:inline">.../?love=</span>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="VD: huong, ngoc, mai, linh..."
                      className="flex-1 rounded-xl border border-rose-300 bg-white p-2.5 text-sm font-mono text-rose-900 font-bold focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    👉 Khi mở link có chứa <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-rose-200 text-rose-700 font-semibold">{`?love=${slug || 'huong'}`}</code>, trang web sẽ tự động mở đúng thiệp của cô ấy!
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tên / Biệt danh tiếng Việt của cô ấy:
                    </label>
                    <input
                      type="text"
                      value={config.herName}
                      onChange={(e) => setConfig({ ...config, herName: e.target.value })}
                      placeholder="VD: Hương, Ngọc, Bé Miu..."
                      className="w-full rounded-xl border border-stone-200 p-2.5 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">
                      Tên này sẽ xuất hiện trên phong thư ngoài, tiêu đề thư tình & toàn bộ website.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tên / Biệt danh của bạn (Người gửi):
                    </label>
                    <input
                      type="text"
                      value={config.senderName}
                      onChange={(e) => setConfig({ ...config, senderName: e.target.value })}
                      placeholder="VD: Anh Yêu, Minh, Thành..."
                      className="w-full rounded-xl border border-stone-200 p-2.5 text-xs sm:text-sm text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                    />
                    <p className="text-[10px] text-stone-400 mt-1">
                      Hiển thị ở cuối thư và các lời nhắn gửi yêu thương.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 leading-relaxed">
                  🛡️ <strong>Bảo Mật Quyền Riêng Tư:</strong> Trang mặc định của bạn là <code className="font-semibold text-amber-950 font-mono">?love=man</code> vẫn giữ nguyên 100% hình ảnh của Mẫn Mẫn. Khi bạn bè tạo tên khác (ví dụ: <code>?love=ngọc</code>), hệ thống bắt buộc phải tải ảnh riêng của cô ấy thì mới hiển thị, tuyệt đối không lấy nhầm ảnh của người khác!
                </div>
              </div>
            )}

            {/* TAB 2: PHOTOS DIRECT UPLOAD */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                {/* Privacy Banner if 0 photos */}
                {config.photos.length === 0 && !isManSlug(slug) && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 flex items-start gap-2.5 text-xs text-rose-900">
                    <ShieldAlert size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Chưa có ảnh nào của {config.herName || 'cô ấy'}</p>
                      <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                        Để bảo vệ quyền riêng tư cá nhân, thiệp của {config.herName || slug} sẽ <strong>không hiển thị</strong> nếu chưa được tải ảnh lên. Hãy bấm nút bên dưới để chọn ảnh của nàng!
                      </p>
                    </div>
                  </div>
                )}

                {/* Direct Upload Button from device */}
                <div className="rounded-2xl border-2 border-dashed border-rose-300 bg-rose-50/50 p-5 text-center transition-colors hover:bg-rose-50">
                  <input
                    type="file"
                    id="direct-photo-upload"
                    multiple
                    accept="image/*"
                    onChange={handleUploadFiles}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="direct-photo-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-md shadow-rose-300">
                      {isUploading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-rose-950">
                        {isUploading ? 'Đang tải & xử lý ảnh...' : '📸 TẢI ẢNH TRỰC TIẾP TỪ ĐIỆN THOẠI / MÁY TÍNH'}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Bấm vào đây để chọn từ 1 đến 7 tấm ảnh của cô ấy. Ảnh được nén tự động và lưu an toàn!
                      </p>
                    </div>
                  </label>
                  {uploadProgress && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-rose-700 bg-rose-100/80 py-1.5 px-3 rounded-full">
                      {isUploading && <Loader2 size={13} className="animate-spin" />}
                      <span>{uploadProgress}</span>
                    </div>
                  )}
                </div>

                {/* Optional Add by URL */}
                <div className="rounded-xl bg-stone-50 p-3 border border-stone-200 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="Hoặc dán link ảnh có sẵn (tùy chọn)..."
                    className="flex-1 w-full text-xs rounded-lg border border-stone-300 p-2 focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={customCaption}
                    onChange={(e) => setCustomCaption(e.target.value)}
                    placeholder="Lời tựa ảnh..."
                    className="w-full sm:w-40 text-xs rounded-lg border border-stone-300 p-2 focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  />
                  <button
                    onClick={handleAddPhotoByUrl}
                    disabled={!customPhotoUrl.trim()}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg bg-stone-800 hover:bg-stone-900 disabled:opacity-40 text-white text-xs font-semibold flex items-center justify-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Thêm</span>
                  </button>
                </div>

                {/* Photo List Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-stone-700">
                      Danh sách ảnh trong Album ({config.photos.length} ảnh):
                    </p>
                    {isManSlug(slug) && config.photos.length === 0 && (
                      <button
                        onClick={handleRestoreManPhotos}
                        className="text-[11px] text-rose-600 hover:underline font-medium"
                      >
                        Khôi phục 7 ảnh gốc của Mẫn
                      </button>
                    )}
                  </div>

                  {config.photos.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-stone-200 p-6 text-center bg-stone-50/50">
                      <p className="text-xs font-semibold text-stone-500">
                        Chưa có ảnh nào được thêm cho {config.herName || 'người nhận'}.
                      </p>
                      <p className="text-[11px] text-stone-400 mt-1">
                        Hãy bấm nút màu đỏ ở trên để tải ảnh từ máy tính hoặc điện thoại của bạn!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
                      {config.photos.map((item, index) => (
                        <div
                          key={item.id}
                          className="group relative rounded-xl border border-stone-200 bg-white p-2 shadow-sm flex flex-col gap-1.5"
                        >
                          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100">
                            <img
                              src={item.url}
                              alt={item.caption}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.opacity = '0.5';
                              }}
                            />
                            <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full font-mono">
                              #{index + 1}
                            </span>
                            <button
                              onClick={() => handleRemovePhoto(item.id)}
                              className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow opacity-90 hover:opacity-100 hover:scale-110 transition-all"
                              title="Xóa ảnh này"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={item.caption}
                            onChange={(e) => {
                              const updated = config.photos.map((p) =>
                                p.id === item.id ? { ...p, caption: e.target.value } : p
                              );
                              setConfig({ ...config, photos: updated });
                            }}
                            className="w-full text-[11px] border-b border-stone-200 focus:border-rose-400 focus:outline-none text-stone-800 px-1 py-0.5"
                            placeholder="Lời tựa ảnh..."
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CONTENT & GRAB */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tiêu đề thư tình:
                  </label>
                  <input
                    type="text"
                    value={config.letterTitle || `Những Lời Chúc Ngọt Ngào Nhất Dành Cho ${config.herName}`}
                    onChange={(e) => setConfig({ ...config, letterTitle: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Lời chào đầu thư:
                  </label>
                  <input
                    type="text"
                    value={config.letterSalutation || `${config.herName} thương yêu,`}
                    onChange={(e) => setConfig({ ...config, letterSalutation: e.target.value })}
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Link quà tặng GrabFood / Trà sữa (nàng bấm nút sẽ mở thẳng Grab):
                  </label>
                  <input
                    type="url"
                    value={config.grabGiftLink}
                    onChange={(e) => setConfig({ ...config, grabGiftLink: e.target.value })}
                    placeholder="https://food.grab.com/vn/vi/ hoặc link quán nàng thích"
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Mẹo: Mở Grab trên điện thoại, copy link quán trà sữa cô ấy thích nhất rồi dán vào đây!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Số điện thoại Zalo của bạn (để nhận tin nhắn phản hồi của cô ấy):
                  </label>
                  <input
                    type="text"
                    value={config.phoneNumber}
                    onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                    placeholder="VD: 0987654321"
                    className="w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-800 focus:ring-2 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: SHARE LINKS */}
            {activeTab === 'share' && (
              <div className="space-y-4">
                {/* Warning if 0 photos and not man */}
                {config.photos.length === 0 && !isManSlug(slug) && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-center gap-2">
                    <ShieldAlert size={16} className="text-amber-600 shrink-0" />
                    <span>
                      ⚠️ Bạn chưa tải ảnh nào cho {config.herName || slug}. Bạn cần tải ít nhất 1 ảnh trước khi gửi link để thiệp có thể hiển thị.
                    </span>
                  </div>
                )}

                {/* Clean Link Card */}
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-rose-600" />
                      <span>ĐƯỜNG LINK RIÊNG CỦA NÀNG:</span>
                    </span>
                    <span className="text-[10px] bg-rose-200/80 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                      CHUẨN
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-rose-200 text-xs font-mono text-rose-900 break-all select-all">
                    {cleanLink}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={copyCleanLink}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-98"
                    >
                      {copiedCleanLink ? <Check size={15} /> : <Copy size={15} />}
                      <span>{copiedCleanLink ? 'ĐÃ SAO CHÉP LINK!' : 'SAO CHÉP LINK GỬI NÀNG'}</span>
                    </button>
                    <a
                      href={cleanLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Eye size={14} />
                      <span>Xem Thử</span>
                    </a>
                  </div>
                </div>

                {/* Guide for friends */}
                <div className="rounded-2xl bg-sky-50 border border-sky-200 p-4 space-y-2">
                  <p className="text-xs font-bold text-sky-950">
                    💡 Hướng dẫn cho bạn bè tự tạo link riêng cho vợ họ:
                  </p>
                  <div className="text-[11px] text-sky-900 leading-relaxed space-y-1.5">
                    <p>
                      <strong>1. Gửi link Admin cho bạn bè:</strong> Bạn chỉ cần gửi link{' '}
                      <code className="bg-white px-1.5 py-0.5 rounded border border-sky-200 font-mono text-sky-800 font-bold">
                        {`${baseUrl}?admin=1`}
                      </code>{' '}
                      (Mã PIN: <strong>2010</strong>).
                    </p>
                    <p>
                      <strong>2. Tải ảnh & đặt tên:</strong> Họ điền mã link (vd: <code>ngoc</code>, <code>huong</code>...), đổi tên vợ họ và tải ảnh của cô ấy lên trực tiếp, sau đó bấm "Lưu & Áp Dụng".
                    </p>
                    <p>
                      <strong>3. Riêng tư tuyệt đối:</strong> Thiệp của ai sẽ chỉ có ảnh của người đó. Nếu chưa tải ảnh, hệ thống tuyệt đối không lấy ảnh của Mẫn để thay thế.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Mã link đang chọn: <strong className="text-rose-600 font-mono">{`?love=${slug || 'huong'}`}</strong>
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
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Lưu & Áp Dụng</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

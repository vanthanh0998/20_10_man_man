/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Sparkles } from 'lucide-react';
import { RosePetalsCanvas } from './components/RosePetalsCanvas.tsx';
import { MusicPlayer } from './components/MusicPlayer.tsx';
import { IntroEnvelope } from './components/IntroEnvelope.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { LoveLetterSection } from './components/LoveLetterSection.tsx';
import { PhotoGallerySection, GalleryPhoto } from './components/PhotoGallerySection.tsx';
import { ReasonsSection } from './components/ReasonsSection.tsx';
import { RomanticVouchersSection } from './components/RomanticVouchersSection.tsx';
import { LoveReplyAndGiftSection } from './components/LoveReplyAndGiftSection.tsx';
import { AdminSetupModal } from './components/AdminSetupModal.tsx';
import { NotFoundPage } from './components/NotFoundPage.tsx';
import { LoveConfig, DEFAULT_LOVE_CONFIG } from './config/loveConfig.ts';
import { slugToVietnameseName } from './utils/vietnameseNameMap.ts';
import { isManSlug, isDefaultManPhoto } from './utils/romanticPlaceholder.ts';

export default function App() {
  const [config, setConfig] = useState<LoveConfig>(DEFAULT_LOVE_CONFIG);
  const [currentSlug, setCurrentSlug] = useState<string>('man');
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [notFoundMode, setNotFoundMode] = useState<'missing_slug' | 'unconfigured'>('missing_slug');
  const [unconfiguredSlug, setUnconfiguredSlug] = useState<string>('');
  const [unconfiguredName, setUnconfiguredName] = useState<string>('');
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [autoStartAudio, setAutoStartAudio] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Read URL query parameters and initialize configuration
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlLove = params.get('love');
      const urlAdmin = params.get('admin');

      // Check Admin access
      if (urlAdmin === '1' || urlAdmin === 'true') {
        setIsAdminMode(true);
        setIsAdminOpen(true);
      }

      // Requirement: If no ?love parameter is provided (and not admin), show 404 Not Found
      if (!urlLove) {
        if (urlAdmin === '1' || urlAdmin === 'true') {
          // Admin mode opened without ?love, default to 'huong' for editing
          setCurrentSlug('huong');
          setIsNotFound(false);
          const initialName = 'Hương';
          setConfig((prev) => ({
            ...prev,
            herName: initialName,
            photos: [],
            letterTitle: `Những Lời Chúc Ngọt Ngào Nhất Dành Cho ${initialName}`,
            letterSalutation: `${initialName} thương yêu,`,
          }));
        } else {
          setIsNotFound(true);
          setNotFoundMode('missing_slug');
          return;
        }
      }

      const rawSlug = (urlLove || (urlAdmin ? 'huong' : '')).trim();
      if (!rawSlug) {
        setIsNotFound(true);
        setNotFoundMode('missing_slug');
        return;
      }

      const cleanSlug = rawSlug.toLowerCase();
      setCurrentSlug(cleanSlug);

      // Check if custom payload parameter 'd' or 'payload' exists in URL
      const encodedData = params.get('d') || params.get('payload');
      let urlPayloadConfig: Partial<LoveConfig> | null = null;
      if (encodedData) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedData))));
          const parsed = JSON.parse(jsonStr);
          if (parsed) {
            urlPayloadConfig = {
              herName: parsed.h || parsed.herName,
              senderName: parsed.s || parsed.senderName,
              grabGiftLink: parsed.g || parsed.grabGiftLink,
              phoneNumber: parsed.p || parsed.phoneNumber,
              photos: parsed.photos
                ? parsed.photos.map((pt: { u: string; c: string; d: string }, i: number) => ({
                    id: `share-photo-${i}`,
                    url: pt.u,
                    caption: pt.c,
                    date: pt.d || 'Khoảnh khắc kỷ niệm',
                  }))
                : undefined,
            };
          }
        } catch {
          // ignore corrupted payload
        }
      }

      // Check individual URL params: ?her=...&from=...&photos=...
      const urlHer = params.get('her');
      const urlFrom = params.get('from');
      const urlPhotos = params.get('photos');
      let customUrlPhotos: GalleryPhoto[] | null = null;
      if (urlPhotos) {
        const photoUrls = urlPhotos.split(',').map((u) => u.trim()).filter(Boolean);
        if (photoUrls.length > 0) {
          customUrlPhotos = photoUrls.map((url, i) => ({
            id: `custom-url-photo-${i}`,
            url,
            caption: `Khoảnh khắc bên ${urlHer || 'em'}`,
            date: 'Kỷ niệm yêu thương',
          }));
        }
      }

      // CASE 1: Default Love Site for 'man' (Untouched, rock-solid with 7 bundled photos!)
      if (isManSlug(cleanSlug)) {
        setIsNotFound(false);
        const savedManConfig = localStorage.getItem('love_slug_man');
        if (savedManConfig) {
          try {
            const parsed: LoveConfig = JSON.parse(savedManConfig);
            setConfig({
              ...DEFAULT_LOVE_CONFIG,
              ...parsed,
              photos:
                customUrlPhotos ||
                (parsed.photos && parsed.photos.length >= 7 ? parsed.photos : DEFAULT_LOVE_CONFIG.photos),
              herName: urlHer || parsed.herName || DEFAULT_LOVE_CONFIG.herName,
            });
            return;
          } catch {
            // safe fallback
          }
        }

        setConfig({
          ...DEFAULT_LOVE_CONFIG,
          photos: customUrlPhotos || DEFAULT_LOVE_CONFIG.photos,
          herName: urlHer || DEFAULT_LOVE_CONFIG.herName,
        });
        return;
      }

      // CASE 2: Dynamic Custom Slug for other recipients (e.g., ?love=huong, ?love=ngoc)
      const mappedVietnameseName = slugToVietnameseName(cleanSlug);

      // Check localStorage for saved edits of this specific slug
      const savedSlugConfig = localStorage.getItem(`love_slug_${cleanSlug}`);
      let savedValidPhotos: GalleryPhoto[] = [];
      let savedParsed: Partial<LoveConfig> | null = null;

      if (savedSlugConfig) {
        try {
          const parsed: LoveConfig = JSON.parse(savedSlugConfig);
          savedParsed = parsed;
          // Privacy protection: exclude any default bundled photos of Mẫn!
          savedValidPhotos = (parsed.photos || []).filter((p) => !isDefaultManPhoto(p.url));
        } catch {
          // ignore corrupted storage
        }
      }

      // Check whether photos have been set up for this recipient
      const activePhotos =
        customUrlPhotos ||
        urlPayloadConfig?.photos ||
        (savedValidPhotos.length > 0 ? savedValidPhotos : null);

      // CRITICAL PRIVACY RULE:
      // "nếu 1 tên nào đó chưa được setup theo ảnh của họ thì không được hiển thị."
      // If a slug does not have custom photos configured, DO NOT display the card!
      if (!activePhotos || activePhotos.length === 0) {
        if (!urlAdmin) {
          setIsNotFound(true);
          setNotFoundMode('unconfigured');
          setUnconfiguredSlug(cleanSlug);
          setUnconfiguredName(urlHer || urlPayloadConfig?.herName || mappedVietnameseName);
          return;
        }
      }

      // Slug is configured with custom photos! Render customized card:
      setIsNotFound(false);
      const recipientName =
        urlHer || urlPayloadConfig?.herName || savedParsed?.herName || mappedVietnameseName;

      setConfig({
        ...DEFAULT_LOVE_CONFIG,
        ...(savedParsed || {}),
        ...(urlPayloadConfig || {}),
        herName: recipientName,
        senderName: urlFrom || urlPayloadConfig?.senderName || savedParsed?.senderName || 'Anh Yêu',
        letterTitle: `Những Lời Chúc Ngọt Ngào Nhất Dành Cho ${recipientName}`,
        letterSalutation: `${recipientName} thương yêu,`,
        photos: activePhotos || [],
      });
    } catch {
      // safe fallback
    }
  }, []);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
    setAutoStartAudio(true);
  };

  const handleSecretAdminUnlock = () => {
    setIsAdminMode(true);
    setIsAdminOpen(true);
  };

  const handleOpenAdminWithSlug = (targetSlug?: string) => {
    if (targetSlug) {
      setCurrentSlug(targetSlug.toLowerCase().trim());
    }
    setIsAdminMode(true);
    setIsAdminOpen(true);
  };

  const handleSaveConfig = (newConfig: LoveConfig, savedSlug?: string) => {
    const targetSlug = (savedSlug || currentSlug || 'huong').toLowerCase().trim();
    setConfig(newConfig);
    setCurrentSlug(targetSlug);
    setIsNotFound(false);

    try {
      // Save by slug so different recipients don't overwrite each other
      localStorage.setItem(`love_slug_${targetSlug}`, JSON.stringify(newConfig));
      localStorage.setItem('love_site_full_config', JSON.stringify(newConfig));

      // Update URL query parameters without reloading page
      const url = new URL(window.location.href);
      url.searchParams.set('love', targetSlug);
      window.history.replaceState({}, '', url.toString());
    } catch {
      // storage quota safe
    }
  };

  const handleSelectSlugFromNotFound = (chosenSlug: string) => {
    const clean = chosenSlug.toLowerCase().trim();
    const url = new URL(window.location.href);
    url.searchParams.set('love', clean);
    window.location.href = url.toString();
  };

  // Render 404 or Unconfigured Privacy Screen
  if (isNotFound) {
    return (
      <NotFoundPage
        mode={notFoundMode}
        unconfiguredSlug={unconfiguredSlug}
        unconfiguredName={unconfiguredName}
        onOpenAdmin={handleOpenAdminWithSlug}
        onSelectSlug={handleSelectSlugFromNotFound}
      />
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#fffafb] text-stone-800 relative selection:bg-rose-200 selection:text-rose-900">
      {/* Falling Rose Petals Canvas Effect */}
      <RosePetalsCanvas isEnabled={true} />

      {/* Melodic Background Music Controller */}
      <MusicPlayer autoStartTrigger={autoStartAudio} />

      {/* Intro Wax Seal Envelope Modal */}
      {!isEnvelopeOpen && (
        <IntroEnvelope onOpen={handleEnvelopeOpen} herName={config.herName} />
      )}

      {/* Main Website Experience */}
      <main className="relative z-10 w-full max-w-full overflow-hidden">
        {/* Hero Section */}
        <HeroSection
          herName={config.herName}
          senderName={config.senderName}
          onOpenCustomize={() => setIsAdminOpen(true)}
          heroImage={config.photos[0]?.url || ''}
          isAdminMode={isAdminMode}
          onSecretAdminUnlock={handleSecretAdminUnlock}
        />

        {/* Romantic Letter Section */}
        {/* Romantic Letter Section */}
        <LoveLetterSection
          herName={config.herName}
          senderName={config.senderName}
          bouquetImage=""
        />

        {/* Photo Gallery Section */}
        <PhotoGallerySection
          photos={config.photos}
          herName={config.herName}
          onOpenCustomize={() => setIsAdminOpen(true)}
          isAdminMode={isAdminMode}
        />

        {/* 20 Reasons Why I Love You */}
        <ReasonsSection herName={config.herName} />

        {/* Love Vouchers & Coupons */}
        <RomanticVouchersSection herName={config.herName} />

        {/* Interactive Response, Grab Gift & Secret Letter */}
        <LoveReplyAndGiftSection
          herName={config.herName}
          senderName={config.senderName}
          grabGiftLink={config.grabGiftLink}
          phoneNumber={config.phoneNumber}
        />

        {/* Footer with Discreet Admin Unlock */}
        <footer className="py-12 px-4 text-center text-xs text-stone-400 border-t border-rose-100/60 bg-white/40 backdrop-blur-sm">
          <div className="max-w-md mx-auto space-y-3">
            <p className="flex items-center justify-center gap-1.5 text-stone-500">
              <span>Được tạo ra với trọn vẹn yêu thương dành cho</span>
              <strong className="text-rose-600 font-semibold">{config.herName}</strong>
            </p>
            <p className="text-[11px] text-stone-400">
              Chúc mừng Ngày Phụ Nữ Việt Nam 20 Tháng 10 &bull; Chúc em mãi luôn rạng ngời và hạnh phúc nhất
            </p>

            {/* Subtle Admin Link */}
            <div className="pt-2">
              <button
                onClick={() => setIsAdminOpen(true)}
                className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-rose-600 transition-colors py-1 px-2.5 rounded-full hover:bg-rose-50/60"
                title="Bảng điều khiển cá nhân hóa & quản trị"
              >
                <Settings size={12} />
                <span>Cài Đặt Riêng (?love={currentSlug})</span>
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* Floating Admin Quick Access Button (Always accessible) */}
      <div className="fixed bottom-4 left-4 z-40 print:hidden">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-stone-900/85 hover:bg-stone-950 text-white text-xs font-semibold shadow-lg backdrop-blur-md transition-all active:scale-95 border border-stone-700/50 hover:shadow-rose-900/20"
          title="Tự đổi tên nàng, đổi ảnh & tạo link riêng"
        >
          <Settings size={14} className="text-rose-400" />
          <span className="hidden sm:inline">Quản Trị</span>
          <span className="text-[10px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded font-mono">
            ?love={currentSlug}
          </span>
        </button>
      </div>

      {/* Admin Setup Modal */}
      <AdminSetupModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        currentSlug={currentSlug}
      />
    </div>
  );
}

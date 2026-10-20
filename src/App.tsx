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

export default function App() {
  const [config, setConfig] = useState<LoveConfig>(DEFAULT_LOVE_CONFIG);
  const [currentSlug, setCurrentSlug] = useState<string>('man');
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
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
            letterTitle: `Những Lời Chúc Ngọt Ngào Nhất Dành Cho ${initialName}`,
            letterSalutation: `${initialName} thương yêu,`,
          }));
        } else {
          setIsNotFound(true);
          return;
        }
      } else {
        setIsNotFound(false);
      }

      const rawSlug = (urlLove || 'man').trim();
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

      // CASE 1: Default Love Site for 'man' or 'manman' (Untouched, rock-solid with 7 bundled photos!)
      if (cleanSlug === 'man' || cleanSlug === 'manman' || cleanSlug === 'man_man') {
        const savedManConfig = localStorage.getItem('love_slug_man');
        if (savedManConfig) {
          try {
            const parsed: LoveConfig = JSON.parse(savedManConfig);
            setConfig({
              ...DEFAULT_LOVE_CONFIG,
              ...parsed,
              // Always ensure 7 bundled photos are preserved unless user specifically uploaded new ones
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

      // CASE 2: Dynamic Custom Slug for other recipients (e.g., ?love=huong)
      const mappedVietnameseName = slugToVietnameseName(cleanSlug);

      // Check localStorage for saved edits of this specific slug
      const savedSlugConfig = localStorage.getItem(`love_slug_${cleanSlug}`);
      if (savedSlugConfig) {
        try {
          const parsed: LoveConfig = JSON.parse(savedSlugConfig);
          setConfig((prev) => ({
            ...prev,
            ...parsed,
            ...(urlPayloadConfig || {}),
            herName: urlHer || urlPayloadConfig?.herName || parsed.herName || mappedVietnameseName,
            photos: customUrlPhotos || urlPayloadConfig?.photos || parsed.photos || prev.photos,
          }));
          return;
        } catch {
          // fallback
        }
      }

      // If not saved in localStorage yet, initialize with auto-accented Vietnamese name
      setConfig((prev) => ({
        ...prev,
        ...(urlPayloadConfig || {}),
        herName: urlHer || urlPayloadConfig?.herName || mappedVietnameseName,
        senderName: urlFrom || urlPayloadConfig?.senderName || prev.senderName,
        letterTitle: `Những Lời Chúc Ngọt Ngào Nhất Dành Cho ${urlHer || mappedVietnameseName}`,
        letterSalutation: `${urlHer || mappedVietnameseName} thương yêu,`,
        photos: customUrlPhotos || urlPayloadConfig?.photos || prev.photos,
      }));
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

  // Render Romantic 404 Page when ?love is missing
  if (isNotFound) {
    return (
      <NotFoundPage
        onOpenAdmin={() => {
          setIsAdminMode(true);
          setIsAdminOpen(true);
          setIsNotFound(false);
        }}
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
          heroImage={config.photos[0]?.url || DEFAULT_LOVE_CONFIG.photos[0].url}
          isAdminMode={isAdminMode}
          onSecretAdminUnlock={handleSecretAdminUnlock}
        />

        {/* Heartfelt Love Letter & 20/10 Wishes */}
        <LoveLetterSection
          herName={config.herName}
          senderName={config.senderName}
          bouquetImage={config.photos[2]?.url || DEFAULT_LOVE_CONFIG.photos[2].url}
        />

        {/* Romantic Photo Gallery */}
        <PhotoGallerySection
          photos={config.photos}
          herName={config.herName}
          onOpenCustomize={() => setIsAdminOpen(true)}
          isAdminMode={isAdminMode}
        />

        {/* 6 Reasons Why I Love You */}
        <ReasonsSection herName={config.herName} />

        {/* Sweet Love Vouchers */}
        <RomanticVouchersSection herName={config.herName} />

        {/* Grab Drink Gift + Heartfelt Love Reply Box */}
        <LoveReplyAndGiftSection
          herName={config.herName}
          senderName={config.senderName}
          grabGiftLink={config.grabGiftLink}
          phoneNumber={config.phoneNumber}
        />
      </main>

      {/* Discreet Admin Floating Button at Bottom-Left: ONLY visible when logged in via ?admin=1 */}
      {isAdminMode && (
        <div className="fixed bottom-5 left-3 sm:left-5 z-40">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-stone-600 bg-white/95 hover:bg-white border border-stone-200 hover:border-rose-300 rounded-full shadow-md backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
            title="Bảng Setup dành cho Admin (Mã PIN: 2010)"
          >
            <Settings size={13} className="text-stone-400 group-hover:text-rose-600 group-hover:rotate-45 transition-transform duration-300" />
            <span className="hidden sm:inline">Setup Admin</span>
            <span className="sm:hidden text-[10px]">Setup</span>
          </button>
        </div>
      )}

      {/* Dedicated Admin Setup Modal */}
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

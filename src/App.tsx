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
import { LoveConfig, DEFAULT_LOVE_CONFIG } from './config/loveConfig.ts';

export default function App() {
  const [config, setConfig] = useState<LoveConfig>(DEFAULT_LOVE_CONFIG);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [autoStartAudio, setAutoStartAudio] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Read URL query parameters and localStorage on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);

      // Check if URL contains compressed 'love' config payload
      const encodedLove = params.get('love');
      if (encodedLove) {
        try {
          const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedLove))));
          const payload = JSON.parse(jsonStr);

          setConfig((prev) => ({
            ...prev,
            herName: payload.h || prev.herName,
            senderName: payload.s || prev.senderName,
            grabGiftLink: payload.g || prev.grabGiftLink,
            phoneNumber: payload.p || prev.phoneNumber,
            photos: payload.photos
              ? payload.photos.map((pt: { u: string; c: string; d: string }, i: number) => ({
                  id: `share-${i}`,
                  url: pt.u,
                  caption: pt.c,
                  date: pt.d || 'Khoảnh khắc kỷ niệm',
                }))
              : prev.photos,
          }));
          return;
        } catch {
          // fallback to individual params
        }
      }

      // Check individual params: ?her=...&from=...&grab=...
      const urlHer = params.get('her');
      const urlFrom = params.get('from');
      const urlGrab = params.get('grab');
      const urlPhone = params.get('phone');
      const urlAdmin = params.get('admin');

      if (urlAdmin === '1' || urlAdmin === 'true') {
        setIsAdminMode(true);
        setIsAdminOpen(true);
      }

      // Check localStorage for saved admin edits
      const savedConfig = localStorage.getItem('love_site_full_config');
      if (savedConfig) {
        const parsed: LoveConfig = JSON.parse(savedConfig);
        setConfig({
          ...parsed,
          herName: urlHer || parsed.herName,
          senderName: urlFrom || parsed.senderName,
          grabGiftLink: urlGrab || parsed.grabGiftLink,
          phoneNumber: urlPhone || parsed.phoneNumber,
        });
      } else {
        setConfig((prev) => ({
          ...prev,
          herName: urlHer || prev.herName,
          senderName: urlFrom || prev.senderName,
          grabGiftLink: urlGrab || prev.grabGiftLink,
          phoneNumber: urlPhone || prev.phoneNumber,
        }));
      }
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

  const handleSaveConfig = (newConfig: LoveConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('love_site_full_config', JSON.stringify(newConfig));
    } catch {
      // storage quota safe
    }
  };

  return (
    <div className="min-h-screen bg-[#fffafb] text-stone-800 relative selection:bg-rose-200 selection:text-rose-900">
      {/* Falling Rose Petals Canvas Effect */}
      <RosePetalsCanvas isEnabled={true} />

      {/* Melodic Background Music Controller */}
      <MusicPlayer autoStartTrigger={autoStartAudio} />

      {/* Intro Wax Seal Envelope Modal */}
      {!isEnvelopeOpen && (
        <IntroEnvelope onOpen={handleEnvelopeOpen} herName={config.herName} />
      )}

      {/* Main Website Experience */}
      <main className="relative z-10">
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
      />
    </div>
  );
}

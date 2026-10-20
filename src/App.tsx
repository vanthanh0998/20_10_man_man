/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RosePetalsCanvas } from './components/RosePetalsCanvas.tsx';
import { MusicPlayer } from './components/MusicPlayer.tsx';
import { IntroEnvelope } from './components/IntroEnvelope.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { LoveLetterSection } from './components/LoveLetterSection.tsx';
import { PhotoGallerySection, GalleryPhoto } from './components/PhotoGallerySection.tsx';
import { ReasonsSection } from './components/ReasonsSection.tsx';
import { RomanticVouchersSection } from './components/RomanticVouchersSection.tsx';
import { LoveReplyAndGiftSection } from './components/LoveReplyAndGiftSection.tsx';
import { CustomizeModal } from './components/CustomizeModal.tsx';

// High-fidelity generated image paths
const HERO_SUNSET_IMG = '/src/assets/images/romantic_couple_sunset_1792465473676.jpg';
const BOUQUET_ROSES_IMG = '/src/assets/images/romantic_red_roses_bouquet_1792465473755.jpg';
const CAFE_DATE_IMG = '/src/assets/images/romantic_memories_moment_1792465473393.jpg';
const GIRL_PORTRAIT_IMG = '/src/assets/images/romantic_girl_portrait_soft_1792465474737.jpg';

export default function App() {
  const [herName, setHerName] = useState<string>('Em Yêu');
  const [senderName, setSenderName] = useState<string>('Anh Yêu');
  const [grabGiftLink, setGrabGiftLink] = useState<string>('https://food.grab.com/vn/vi/');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [autoStartAudio, setAutoStartAudio] = useState<boolean>(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);

  // Photos collection
  const [photos, setPhotos] = useState<GalleryPhoto[]>([
    {
      id: 'photo-1',
      url: GIRL_PORTRAIT_IMG,
      caption: 'Nụ cười tỏa nắng giữa vườn hoa thơm ngát',
      date: 'Nàng thơ của anh',
    },
    {
      id: 'photo-2',
      url: CAFE_DATE_IMG,
      caption: 'Buổi chiều cà phê hẹn hò cùng cái nắm tay ấm áp',
      date: 'Khoảnh khắc bình yên',
    },
    {
      id: 'photo-3',
      url: BOUQUET_ROSES_IMG,
      caption: 'Bó hoa hồng nhung tươi thắm dành riêng tặng em',
      date: '20 Tháng 10 Ngập Tràn Yêu Thương',
    },
    {
      id: 'photo-4',
      url: HERO_SUNSET_IMG,
      caption: 'Cùng nhau ngắm hoàng hôn thanh bình',
      date: 'Mãi bên nhau em nhé',
    },
  ]);

  // Read URL query parameters and localStorage on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlHer = params.get('her');
      const urlFrom = params.get('from');
      const urlGrab = params.get('grab');
      const urlPhone = params.get('phone');

      if (urlHer) setHerName(urlHer);
      if (urlFrom) setSenderName(urlFrom);
      if (urlGrab) setGrabGiftLink(urlGrab);
      if (urlPhone) setPhoneNumber(urlPhone);

      // Saved state fallback
      const savedConfig = localStorage.getItem('love_site_config_2010');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (!urlHer && parsed.herName) setHerName(parsed.herName);
        if (!urlFrom && parsed.senderName) setSenderName(parsed.senderName);
        if (!urlGrab && parsed.grabGiftLink) setGrabGiftLink(parsed.grabGiftLink);
        if (!urlPhone && parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        if (parsed.photos && parsed.photos.length > 0) setPhotos(parsed.photos);
      }
    } catch {
      // safe fallback
    }
  }, []);

  const handleEnvelopeOpen = () => {
    setIsEnvelopeOpen(true);
    setAutoStartAudio(true);
  };

  const handleSaveCustomization = (data: {
    herName: string;
    senderName: string;
    grabGiftLink: string;
    phoneNumber: string;
    photos: GalleryPhoto[];
  }) => {
    setHerName(data.herName);
    setSenderName(data.senderName);
    setGrabGiftLink(data.grabGiftLink);
    setPhoneNumber(data.phoneNumber);
    setPhotos(data.photos);

    try {
      localStorage.setItem('love_site_config_2010', JSON.stringify(data));
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
        <IntroEnvelope onOpen={handleEnvelopeOpen} herName={herName} />
      )}

      {/* Main Website Sections */}
      <main className="relative z-10">
        {/* Hero Section with 3-Zone Navigation */}
        <HeroSection
          herName={herName}
          senderName={senderName}
          onOpenCustomize={() => setIsCustomizeOpen(true)}
          heroImage={photos[0]?.url || GIRL_PORTRAIT_IMG}
        />

        {/* Heartfelt Love Letter & 20/10 Wishes */}
        <LoveLetterSection
          herName={herName}
          senderName={senderName}
          bouquetImage={BOUQUET_ROSES_IMG}
        />

        {/* Romantic Photo Gallery with Upload Affordance */}
        <PhotoGallerySection
          photos={photos}
          herName={herName}
          onOpenCustomize={() => setIsCustomizeOpen(true)}
        />

        {/* 6 Reasons Why I Love You */}
        <ReasonsSection herName={herName} />

        {/* Sweet Love Vouchers She Can Claim */}
        <RomanticVouchersSection herName={herName} />

        {/* Bottom Section: Grab Drink Gift + Heartfelt Love Reply Box */}
        <LoveReplyAndGiftSection
          herName={herName}
          senderName={senderName}
          grabGiftLink={grabGiftLink}
          phoneNumber={phoneNumber}
        />
      </main>

      {/* Customize & Upload Modal */}
      <CustomizeModal
        isOpen={isCustomizeOpen}
        onClose={() => setIsCustomizeOpen(false)}
        herName={herName}
        senderName={senderName}
        grabGiftLink={grabGiftLink}
        phoneNumber={phoneNumber}
        photos={photos}
        onSave={handleSaveCustomization}
      />
    </div>
  );
}

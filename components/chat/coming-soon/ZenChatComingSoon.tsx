'use client';

import React, { useRef } from 'react';
import { ZenChatNav } from './ZenChatNav';
import { ZenChatHero } from './ZenChatHero';
import { ZenChatInterfaceMockup } from './ZenChatInterfaceMockup';
import { ZenChatFeatures } from './ZenChatFeatures';
import { ZenChatBrandStatement } from './ZenChatBrandStatement';
import { ZenChatInterestSection } from './ZenChatInterestSection';
import { ZenChatFooter } from './ZenChatFooter';

export function ZenChatComingSoon() {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const interestRef = useRef<HTMLDivElement | null>(null);

  const scrollToPreview = () => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToInterest = () => {
    interestRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full h-full min-h-[100dvh] overflow-y-auto overflow-x-hidden bg-[#030712] text-white selection:bg-blue-600/30 selection:text-white scroll-smooth relative">
      {/* Top Fixed Navigation */}
      <ZenChatNav />

      {/* Main Content Sections */}
      <main className="relative">
        {/* 1. Hero Reveal Section */}
        <ZenChatHero
          onScrollToPreview={scrollToPreview}
          onScrollToInterest={scrollToInterest}
        />

        {/* 2. Product Interface Mockup Preview */}
        <div ref={previewRef} id="product-preview">
          <ZenChatInterfaceMockup />
        </div>

        {/* 3. Four Feature Cards */}
        <ZenChatFeatures />

        {/* 4. Editorial Brand Statement */}
        <ZenChatBrandStatement />

        {/* 5. Launch Notification & Waitlist */}
        <div ref={interestRef}>
          <ZenChatInterestSection />
        </div>
      </main>

      {/* 6. Footer */}
      <ZenChatFooter />
    </div>
  );
}

export default ZenChatComingSoon;

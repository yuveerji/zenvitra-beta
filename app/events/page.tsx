'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EventsFeed } from '@/components/events/EventsFeed';
import { SignInPromptModal } from '@/components/auth/SignInPromptModal';
import { useAuth } from '@/context/AuthContext';

export default function EventsPage() {
  const { isAuthenticated, isMockMode, profile } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    // If user is not logged in, prompt sign in after brief smooth mount delay
    const hasLoggedIn = isAuthenticated || isMockMode || Boolean(profile?.id);
    if (!hasLoggedIn) {
      try {
        const dismissed = sessionStorage.getItem('zenvitra_signin_prompt_dismissed_summits');
        if (!dismissed) {
          const timer = setTimeout(() => {
            setShowSignInModal(true);
          }, 600);
          return () => clearTimeout(timer);
        }
      } catch {
        setShowSignInModal(true);
      }
    }
  }, [isAuthenticated, isMockMode, profile]);

  const handleClose = () => {
    setShowSignInModal(false);
    try {
      sessionStorage.setItem('zenvitra_signin_prompt_dismissed_summits', 'true');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#030405] text-white flex flex-col font-sans selection:bg-emerald-500/30">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-32 pb-20 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 w-full">
        <EventsFeed />
      </main>

      <Footer />

      <SignInPromptModal
        isOpen={showSignInModal}
        onClose={handleClose}
        feature="summits"
      />
    </div>
  );
}

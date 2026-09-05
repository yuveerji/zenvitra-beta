'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(Boolean(isRunningStandalone));
    if (isRunningStandalone) return;

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('zenvitra_pwa_prompt_dismissed');
    if (dismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // Delay prompt slightly for iOS
      const timer = setTimeout(() => setShowPrompt(true), 4000);
      return () => clearTimeout(timer);
    }

    // Android/Chrome beforeinstallprompt event
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('zenvitra_pwa_prompt_dismissed', 'true');
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 md:bottom-6"
      >
        <div className="p-4 rounded-2xl bg-[#0a0a0d]/95 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,255,255,0.1)] backdrop-blur-2xl text-left space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white text-black flex items-center justify-center font-display font-black text-sm shadow-md shrink-0">
                Z
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-white">
                  Install Zenvitra App
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Add to home screen for faster, native experience.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="text-neutral-500 hover:text-white transition p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* iOS Instruction Tip */}
          {isIOS ? (
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-neutral-300 flex items-center gap-2 font-mono">
              <Share className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Tap <strong>Share</strong> &rarr; <strong>Add to Home Screen</strong> [+]</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>INSTALL NOW</span>
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default PWAInstallPrompt;

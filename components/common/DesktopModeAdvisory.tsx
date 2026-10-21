'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, 
  Smartphone, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

interface DesktopModeAdvisoryProps {
  studioName?: string;
  minWidth?: number;
  storageKey?: string;
}

export function DesktopModeAdvisory({
  studioName = 'Studio & Editor',
  minWidth = 1024,
  storageKey = 'zen_desktop_advisory'
}: DesktopModeAdvisoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);
  const [activeTab, setActiveTab] = useState<'horizontal' | 'desktop_site'>('horizontal');
  const [showRotatedToast, setShowRotatedToast] = useState(false);

  const prevWasPortraitRef = useRef<boolean | null>(null);

  // Robust multi-API landscape check
  const checkIsLandscape = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    // 1. Modern matchMedia (updates instantly)
    if (window.matchMedia && window.matchMedia('(orientation: landscape)').matches) {
      return true;
    }
    // 2. Screen orientation API (updates instantly)
    if (window.screen?.orientation?.type?.includes('landscape')) {
      return true;
    }
    // 3. Legacy window.orientation (-90 or 90)
    if ('orientation' in window && Math.abs(Number((window as unknown as { orientation: number }).orientation)) === 90) {
      return true;
    }
    // 4. Dimensions check
    return window.innerWidth > window.innerHeight;
  }, []);

  const evaluateViewport = useCallback(() => {
    if (typeof window === 'undefined') return;

    const width = window.innerWidth;
    const isLandscape = checkIsLandscape();
    const portrait = !isLandscape;
    const narrow = width < minWidth;

    setIsPortrait(portrait);
    setIsNarrow(narrow);

    // AUTO-DETECT HORIZONTAL MODE & GO AHEAD AUTOMATICALLY
    if (isLandscape) {
      // Horizontal mode is enabled!
      // If modal was open or previously in portrait, auto-close and proceed immediately
      setIsOpen(false);
      try {
        sessionStorage.setItem(`${storageKey}_dismissed`, 'true');
      } catch {}

      // If transitioning from portrait to horizontal mode, flash confirmation toast
      if (prevWasPortraitRef.current === true) {
        setShowRotatedToast(true);
        setTimeout(() => setShowRotatedToast(false), 3000);
      }
      prevWasPortraitRef.current = false;
      return;
    }

    // If we reach here, device is in PORTRAIT mode
    prevWasPortraitRef.current = true;

    // Check if dismissed previously in this session
    let isDismissed = false;
    try {
      isDismissed = sessionStorage.getItem(`${storageKey}_dismissed`) === 'true';
    } catch {}

    if (isDismissed) {
      setIsOpen(false);
      return;
    }

    // Only prompt when held vertically in portrait on narrow/mobile viewports
    if (portrait && narrow) {
      setActiveTab('horizontal');
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [checkIsLandscape, minWidth, storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Run evaluation immediately
    evaluateViewport();

    // Secondary timers to handle mobile browsers where innerWidth/innerHeight reflow lags behind orientationchange
    const triggerReflowCheck = () => {
      evaluateViewport();
      setTimeout(evaluateViewport, 60);
      setTimeout(evaluateViewport, 180);
      setTimeout(evaluateViewport, 350);
    };

    window.addEventListener('resize', evaluateViewport);
    window.addEventListener('orientationchange', triggerReflowCheck);

    // Listen to matchMedia orientation change
    let mql: MediaQueryList | null = null;
    if (window.matchMedia) {
      try {
        mql = window.matchMedia('(orientation: landscape)');
        mql.addEventListener('change', triggerReflowCheck);
      } catch {}
    }

    // Listen to screen.orientation change
    if (window.screen?.orientation) {
      try {
        window.screen.orientation.addEventListener('change', triggerReflowCheck);
      } catch {}
    }

    return () => {
      window.removeEventListener('resize', evaluateViewport);
      window.removeEventListener('orientationchange', triggerReflowCheck);
      if (mql) {
        try {
          mql.removeEventListener('change', triggerReflowCheck);
        } catch {}
      }
      if (window.screen?.orientation) {
        try {
          window.screen.orientation.removeEventListener('change', triggerReflowCheck);
        } catch {}
      }
    };
  }, [evaluateViewport]);

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(`${storageKey}_dismissed`, 'true');
    } catch {}
    setIsOpen(false);
  };

  const handleReopen = () => {
    if (isPortrait) {
      setActiveTab('horizontal');
    } else {
      setActiveTab('desktop_site');
    }
    setIsOpen(true);
  };

  return (
    <>
      {/* Toast when auto-detecting rotation into horizontal mode */}
      <AnimatePresence>
        {showRotatedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-2xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 text-xs font-mono shadow-2xl backdrop-blur-md flex items-center gap-2.5 select-none"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">Horizontal Mode Detected &bull; Proceeding to {studioName}...</span>
            <button
              type="button"
              onClick={() => setShowRotatedToast(false)}
              className="p-1 hover:text-white text-emerald-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Mini Indicator when popup is closed but still in mobile/narrow view */}
      {!isOpen && isNarrow && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleReopen}
          type="button"
          className="fixed top-20 right-4 z-40 px-3 py-1.5 rounded-full bg-black/85 hover:bg-black border border-purple-500/40 text-purple-200 backdrop-blur-md font-mono text-[11px] font-bold shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center gap-1.5 cursor-pointer transition select-none"
          title="Toggle Desktop / Landscape Advisory"
        >
          <Monitor className="w-3.5 h-3.5 text-purple-400" />
          <span>Desktop Mode</span>
        </motion.button>
      )}

      {/* Main Advisory Popup */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] overflow-y-auto overflow-x-hidden p-3 sm:p-6 flex items-center justify-center min-h-[100dvh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismiss}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Dialog: Flex column with fixed max height and internal scroll */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="relative w-full max-w-lg my-auto bg-[#0a0714] border border-purple-500/40 rounded-3xl p-4 sm:p-6 shadow-[0_0_60px_rgba(168,85,247,0.3)] text-left z-10 flex flex-col max-h-[calc(100dvh-24px)] overflow-hidden space-y-4"
            >
              {/* Subtle top glow bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />

              {/* 1. Header (Fixed, non-shrinking) */}
              <div className="shrink-0 flex items-start justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.3)] shrink-0">
                    <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-purple-400 uppercase tracking-widest font-bold">
                        DESKTOP WORKSTATION
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-[9px] font-bold">
                        RECOMMENDED
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-base sm:text-lg text-white tracking-tight leading-snug">
                      Turn On Desktop Site or Rotate Screen
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2. Scrollable Body Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain pr-1 space-y-3.5 scrollbar-thin scrollbar-thumb-purple-500/20">
                <p className="font-sans text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                  <strong className="text-white font-medium">{studioName}</strong> includes multi-column sidebars, live markdown tools, and inspector controls designed for wide desktop screens.
                </p>

                {/* Option Tabs */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('horizontal')}
                    className={`py-1.5 px-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'horizontal'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>1. Horizontal Mode</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('desktop_site')}
                    className={`py-1.5 px-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === 'desktop_site'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>2. Desktop Site</span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                  {activeTab === 'horizontal' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white font-display font-bold text-xs sm:text-sm">
                        <Smartphone className="w-4 h-4 text-purple-400 rotate-90" />
                        <span>Switch to Horizontal / Landscape Mode</span>
                      </div>
                      <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                        Rotate your phone sideways 90°. The app automatically detects horizontal mode, dismisses this prompt, and takes you directly into the workstation.
                      </p>
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-mono text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping shrink-0" />
                        <span>Ensure &ldquo;Auto-Rotate&rdquo; is turned ON in your phone settings.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-white font-display font-bold text-xs sm:text-sm">
                        <Monitor className="w-4 h-4 text-purple-400" />
                        <span>Enable &ldquo;Desktop site&rdquo; in Browser</span>
                      </div>
                      
                      <div className="space-y-2 text-xs font-sans text-neutral-300">
                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                          <div className="font-mono font-bold text-[11px] text-white">
                            Chrome / Brave / Edge (Android &amp; iOS):
                          </div>
                          <p className="text-neutral-400 text-[11px]">
                            1. Tap the three dots menu (<strong className="text-white">⋮</strong>) top-right.<br />
                            2. Check <strong className="text-purple-300">&ldquo;Desktop site&rdquo;</strong>.
                          </p>
                        </div>

                        <div className="p-2 rounded-xl bg-black/40 border border-white/5 space-y-1">
                          <div className="font-mono font-bold text-[11px] text-white">
                            Safari (iPhone &amp; iPad):
                          </div>
                          <p className="text-neutral-400 text-[11px]">
                            1. Tap the <strong className="text-white">aA</strong> icon in the address bar.<br />
                            2. Tap <strong className="text-purple-300">&ldquo;Request Desktop Website&rdquo;</strong>.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Footer (Fixed, non-shrinking, always visible) */}
              <div className="shrink-0 pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_20px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                >
                  <Check className="w-4 h-4" />
                  <span>I&apos;ve Enabled It / Proceed</span>
                </button>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-neutral-400 hover:text-white font-mono text-xs transition cursor-pointer text-center shrink-0"
                >
                  Continue in mobile view &rarr;
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

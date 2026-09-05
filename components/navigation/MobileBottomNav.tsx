'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  Radio, 
  Film, 
  Plus, 
  MessageSquare, 
  User, 
  Sparkles,
  Camera,
  Layers,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { PostComposer } from '@/components/pulse/PostComposer';

function MobileBottomNavInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams ? searchParams.get('tab') : null;
  const { profile } = useAuth();

  const [composerOpen, setComposerOpen] = useState(false);

  const username = profile?.username || 'you';
  const initial = (profile?.display_name || profile?.username || 'U')[0]?.toUpperCase() || 'U';

  const isHomeActive = pathname === '/pulse' && (!activeTab || activeTab === 'feed');
  const isFluxActive = (pathname === '/pulse' && activeTab === 'flux') || pathname === '/flux';
  const isChatActive = pathname?.startsWith('/chat');
  const isProfileActive = pathname?.startsWith('/profile');

  return (
    <>
      {/* ─── NATIVE MOBILE BOTTOM BAR (Instagram / Threads App Style) ─── */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/90 backdrop-blur-2xl border-t border-white/10 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),10px)] flex items-center justify-around select-none shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
        aria-label="Mobile Navigation"
      >
        {/* 1. HOME / FEED */}
        <Link
          href="/pulse"
          className="flex flex-col items-center justify-center py-1 px-3 relative group transition active:scale-95"
        >
          <div className="relative">
            <Radio 
              className={`w-5 h-5 transition-colors ${
                isHomeActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'
              }`} 
            />
            {isHomeActive && (
              <motion.span
                layoutId="mobile-nav-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
              />
            )}
          </div>
          <span className={`text-[10px] font-mono mt-0.5 tracking-tight transition-colors ${
            isHomeActive ? 'text-white font-bold' : 'text-neutral-400'
          }`}>
            Feed
          </span>
        </Link>

        {/* 2. SPARK (Video Reels) */}
        <Link
          href="/pulse?tab=flux"
          className="flex flex-col items-center justify-center py-1 px-3 relative group transition active:scale-95"
        >
          <div className="relative">
            <Sparkles 
              className={`w-5 h-5 transition-colors ${
                isFluxActive ? 'text-rose-400' : 'text-neutral-400 group-hover:text-white'
              }`} 
            />
            {isFluxActive && (
              <motion.span
                layoutId="mobile-nav-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
              />
            )}
          </div>
          <span className={`text-[10px] font-mono mt-0.5 tracking-tight transition-colors ${
            isFluxActive ? 'text-rose-300 font-bold' : 'text-neutral-400'
          }`}>
            SPARK
          </span>
        </Link>

        {/* 3. CENTER CREATE ACTION BUTTON */}
        <button
          type="button"
          onClick={() => setComposerOpen(true)}
          className="w-11 h-11 -mt-4 rounded-full bg-gradient-to-tr from-white via-neutral-100 to-neutral-300 text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.35)] active:scale-90 transition-transform cursor-pointer border border-white/40"
          title="Create New Dispatch"
        >
          <Plus className="w-5 h-5 text-black stroke-[2.5]" />
        </button>

        {/* 4. ZEN.CHAT (Direct Messages) */}
        <Link
          href="/chat"
          className="flex flex-col items-center justify-center py-1 px-3 relative group transition active:scale-95"
        >
          <div className="relative">
            <MessageSquare 
              className={`w-5 h-5 transition-colors ${
                isChatActive ? 'text-purple-400' : 'text-neutral-400 group-hover:text-white'
              }`} 
            />
            {/* Unread Alert Dot */}
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-purple-500 border border-black" />
            {isChatActive && (
              <motion.span
                layoutId="mobile-nav-indicator"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]"
              />
            )}
          </div>
          <span className={`text-[10px] font-mono mt-0.5 tracking-tight transition-colors ${
            isChatActive ? 'text-purple-300 font-bold' : 'text-neutral-400'
          }`}>
            Chat
          </span>
        </Link>

        {/* 5. PROFILE DOSSIER */}
        <Link
          href="/pulse?tab=profile"
          className="flex flex-col items-center justify-center py-1 px-3 relative group transition active:scale-95"
        >
          <div className={`w-5 h-5 rounded-full p-[1px] transition-all ${
            isProfileActive 
              ? 'ring-2 ring-white ring-offset-1 ring-offset-black' 
              : 'ring-1 ring-white/30'
          }`}>
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 flex items-center justify-center text-[9px] font-bold text-white uppercase">
              {initial}
            </div>
          </div>
          <span className={`text-[10px] font-mono mt-0.5 tracking-tight transition-colors ${
            isProfileActive ? 'text-white font-bold' : 'text-neutral-400'
          }`}>
            Profile
          </span>
        </Link>
      </nav>

      {/* ─── FULLSCREEN MOBILE POST COMPOSER MODAL ─── */}
      <AnimatePresence>
        {composerOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setComposerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full bg-[#0a0a0c] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="font-display font-bold text-sm text-white">Create New Dispatch</span>
                </div>
                <button
                  type="button"
                  onClick={() => setComposerOpen(false)}
                  className="p-1 rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <PostComposer onFinished={() => setComposerOpen(false)} onClose={() => setComposerOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileBottomNav() {
  return (
    <Suspense fallback={null}>
      <MobileBottomNavInner />
    </Suspense>
  );
}

export default MobileBottomNav;

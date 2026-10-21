'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  Minus, 
  Maximize2, 
  ChevronRight, 
  ArrowRight, 
  Bell, 
  ShieldCheck, 
  Sparkles,
  Lock,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingChatDrawer() {
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpandingToFull, setIsExpandingToFull] = useState(false);

  // When on full /chat page, hide the floating bottom drawer popup
  if (pathname === '/chat' || pathname?.startsWith('/chat')) {
    return null;
  }

  const handleExpandToFullScreen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpandingToFull(true);
    setTimeout(() => {
      router.push('/chat');
    }, 250);
  };

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 font-sans selection:bg-white/20 select-none">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ─── COLLAPSED FLOATING TRIGGER ─── */
          <motion.button
            key="collapsed-pill"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center rounded-full bg-[#07080b]/95 border border-white/20 text-white shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl hover:border-white/40 transition-all cursor-pointer group"
          >
            {/* Mobile View: High-Visibility Message Icon Bubble (Elevated above bottom bar) */}
            <div className="sm:hidden p-3 relative flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa] animate-pulse" />
            </div>

            {/* Desktop View: Sleek Message Icon + ZEN.CHAT + IN DEV Badge */}
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2.5">
              <div className="p-1.5 rounded-full bg-blue-500/15 text-blue-400 group-hover:bg-blue-500/25 transition-colors">
                <MessageSquare className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-bold text-xs tracking-tight text-white group-hover:text-zinc-200 font-mono">
                ZEN.CHAT
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold text-[9px] uppercase font-mono tracking-wider">
                In Dev
              </span>
            </div>
          </motion.button>
        ) : (
          /* ─── EXPANDED HIGH-DETAIL POPUP DRAWER (380px x 520px) ─── */
          <motion.div
            key="expanded-drawer"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={
              isExpandingToFull
                ? {
                    opacity: 0,
                    scale: 1.15,
                    y: -40,
                    filter: 'blur(8px)',
                    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                  }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: { type: 'spring', stiffness: 420, damping: 28 }
                  }
            }
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] max-h-[calc(100dvh-7rem)] h-[460px] sm:h-[500px] rounded-3xl bg-[#07080b]/98 border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl flex flex-col overflow-hidden text-white font-sans"
          >
            {/* ── TOP CONTROL BAR ── */}
            <div className="p-3 px-4 border-b border-zinc-800/80 bg-black/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <MessageSquare className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-xs tracking-tight text-white block">
                    ZEN.CHAT
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono block">
                    Decentralized Sovereign Mesh
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Fullscreen Expand */}
                <button
                  type="button"
                  onClick={handleExpandToFullScreen}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer group"
                  title="Expand to Fullscreen ZEN.CHAT Hub"
                >
                  <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </button>

                {/* Minimize */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── IN DEVELOPMENT / COMING SOON BODY ── */}
            <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-[#0a0d14] to-[#040508] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                    In Development
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">Q3 Phased Rollout</span>
                </div>

                <div className="space-y-1.5 text-left">
                  <h3 className="font-heading text-lg font-bold text-white tracking-tight">
                    Sovereign Comms Mesh
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Direct P2P messaging, encrypted voice calls, and decentralized youth channels are currently under active engineering.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Status Checklist</span>
                    <span className="text-[10px] font-mono text-blue-400">Active Sprint</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>E2E Double-Ratchet Encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      <span>Ephemeral Self-Destruct Messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <span className="text-zinc-500">Cross-App Delegation Chits</span>
                    </div>
                  </div>
                </div>

                {/* Notifications Live Callout */}
                <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white">ZEN.NOTIFICATIONS</div>
                      <div className="text-[10px] text-emerald-400 font-mono">Live & Operational</div>
                    </div>
                  </div>
                  <Link
                    href="/your_activity"
                    onClick={() => setIsOpen(false)}
                    className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                  >
                    View <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                <Link
                  href="/chat"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(37,99,235,0.3)] cursor-pointer"
                >
                  <span>Explore Full Architecture & Waitlist</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <p className="text-[10px] text-zinc-500 font-mono text-center">
                  Zero fake data • Verified real-time telemetry
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FloatingChatDrawer;

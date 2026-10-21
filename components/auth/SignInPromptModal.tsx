'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  User, 
  Radio, 
  Calendar, 
  MessageSquare, 
  Newspaper, 
  Orbit, 
  CheckCircle2,
  Eye
} from 'lucide-react';

export type ProtectedFeature = 'discussions' | 'summits' | 'news' | 'apps';

export interface SignInPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: ProtectedFeature;
  title?: string;
  description?: string;
}

const FEATURE_CONFIG: Record<ProtectedFeature, {
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  benefits: string[];
}> = {
  discussions: {
    title: 'Open Topic Discussions',
    badge: 'SOVEREIGN DISCOURSE',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    icon: MessageSquare,
    description: 'Structured public debates, consensus scoring, and empirical citations without social media noise or algorithms.',
    accentBg: 'from-purple-950/40 via-[#07090e] to-indigo-950/40',
    accentBorder: 'border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.2)]',
    accentText: 'text-purple-300',
    benefits: [
      'Vote PRO, CON, or EVIDENCE on live arguments',
      'Start new structured debates with empirical citations',
      'Bridge consensus directly into official ZEN.SOLUTIONS drafts'
    ]
  },
  summits: {
    title: 'Model UN Summits & Events',
    badge: 'DIPLOMATIC CHAMBER',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    icon: Calendar,
    description: 'Youth Model UN assemblies, international conferences, live committee daises, and verified pass ticketing.',
    accentBg: 'from-emerald-950/40 via-[#07090e] to-cyan-950/40',
    accentBorder: 'border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]',
    accentText: 'text-emerald-300',
    benefits: [
      'Book verified delegate and secretariat passes',
      'Access live dais roll-call, motions, and voting matrices',
      'Export sovereign MUN CV and diplomatic credentials'
    ]
  },
  news: {
    title: 'Independent Wire & News',
    badge: 'FOURTH PILLAR DESK',
    badgeColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    icon: Newspaper,
    description: 'Investigative youth reporting, unfiltered dispatches, and authentic editorial citations owned by no agenda.',
    accentBg: 'from-sky-950/40 via-[#07090e] to-indigo-950/40',
    accentBorder: 'border-sky-500/30 shadow-[0_0_50px_rgba(56,189,248,0.2)]',
    accentText: 'text-sky-300',
    benefits: [
      'Read complete investigative files and verified evidence logs',
      'Submit wire dispatches directly to the youth editorial desk',
      'Customize sector alerts and receive cryptographic press digests'
    ]
  },
  apps: {
    title: 'ZEN.APPS Ecosystem',
    badge: 'CIRCULAR NEXUS',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    icon: Orbit,
    description: 'Interactive 360° circular ecosystem mind map, 7 radial clusters, and unified sovereign workspaces.',
    accentBg: 'from-cyan-950/40 via-[#07090e] to-purple-950/40',
    accentBorder: 'border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.2)]',
    accentText: 'text-cyan-300',
    benefits: [
      'Access collaborative tools: ZEN.DOCS, ZEN.CALL, and ZEN.MEET',
      'Zero behavioral surveillance and end-to-end data privacy',
      'Direct synchronization across all 7 sovereign clusters'
    ]
  }
};

export function SignInPromptModal({
  isOpen,
  onClose,
  feature = 'discussions',
  title,
  description
}: SignInPromptModalProps) {
  const pathname = usePathname();
  const config = FEATURE_CONFIG[feature] || FEATURE_CONFIG.discussions;
  const Icon = config.icon;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const callbackParam = encodeURIComponent(pathname || '/');

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`relative w-full max-w-lg rounded-3xl bg-[#07090e] border ${config.accentBorder} p-6 sm:p-8 text-left overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Ambient Background Gradient */}
          <div className={`absolute -top-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr ${config.accentBg} blur-3xl pointer-events-none opacity-50`} />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative space-y-6">
            
            {/* Header / Badge */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[10px] font-bold uppercase tracking-wider ${config.badgeColor}`}>
                  <Lock className="w-3 h-3" />
                  <span>{config.badge}</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Authentication Prompt
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Icon className={`w-6 h-6 ${config.accentText}`} />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight">
                    {title || `Sign in to access ${config.title}`}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 font-light mt-1 leading-relaxed">
                    {description || config.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
              <p className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                Sovereign Member Privileges
              </p>
              <ul className="space-y-2">
                {config.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
              <Link
                href={`/login?callbackUrl=${callbackParam}`}
                onClick={onClose}
                className="w-full py-3.5 px-5 rounded-2xl bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition shadow-[0_0_25px_rgba(255,255,255,0.25)] flex items-center justify-center gap-2 group cursor-pointer"
              >
                <User className="w-4 h-4 text-black" />
                <span>Sign In to Sovereign Node</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={`/register?callbackUrl=${callbackParam}`}
                  onClick={onClose}
                  className="py-3 px-3 rounded-2xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold transition flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Create Account</span>
                </Link>

                <Link
                  href="/test-node"
                  onClick={onClose}
                  className="py-3 px-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 font-mono text-xs font-semibold transition flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1-Click Test Node</span>
                </Link>
              </div>

              {/* Read-Only Preview Dismissal */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 text-center font-mono text-xs text-neutral-500 hover:text-neutral-300 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Continue browsing in Read-Only Preview</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

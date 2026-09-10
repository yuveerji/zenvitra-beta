'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  Video, 
  Copy, 
  Award, 
  FileText, 
  Radio, 
  Compass, 
  Calendar,
  ExternalLink,
  Check
} from 'lucide-react';
import Link from 'next/link';

export interface ZenIdentityCardProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    role?: string;
    status?: 'online' | 'offline' | 'idle' | 'dnd';
    bio?: string;
    location?: string;
    isVerified?: boolean;
    stats?: {
      muns?: number;
      articles?: number;
      pulse?: number;
      chambers?: number;
      events?: number;
    };
  } | null;
  onDirectMessage?: (username: string, name: string) => void;
  onStartCall?: (username: string, type: 'voice' | 'video') => void;
}

export function ZenIdentityCardModal({
  isOpen,
  onClose,
  user,
  onDirectMessage,
  onStartCall,
}: ZenIdentityCardProps) {
  const [copied, setCopied] = React.useState(false);

  if (!user) return null;

  const handleCopyHandle = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`@${user.username.replace(/^@/, '')}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const stats = user.stats || {
    muns: 12,
    articles: 8,
    pulse: 143,
    chambers: 5,
    events: 9,
  };

  const isFounder = user.username.toLowerCase().includes('yuveer') || user.role?.includes('FOUNDER');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-3xl bg-[#090b10] border border-white/15 p-6 sm:p-7 shadow-2xl space-y-6 text-neutral-200 font-sans z-10 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-neutral-400">
                  ZENVITRA DIPLOMATIC PASSPORT
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-amber-400 p-[2px] shadow-lg">
                  <div className="w-full h-full rounded-[14px] bg-[#0c0e14] flex items-center justify-center font-display font-bold text-xl text-white uppercase overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                </div>
                <span
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#090b10] ${
                    user.status === 'online' || !user.status
                      ? 'bg-emerald-400 ring-2 ring-emerald-400/20'
                      : user.status === 'dnd'
                      ? 'bg-rose-500'
                      : 'bg-neutral-500'
                  }`}
                  title={user.status || 'online'}
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white truncate">
                    {user.name}
                  </h3>
                  {user.isVerified || isFounder ? (
                    <span title="Verified Sovereign Node">
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <span>@{user.username.replace(/^@/, '')}</span>
                  <button
                    type="button"
                    onClick={handleCopyHandle}
                    className="hover:text-white transition cursor-pointer"
                    title="Copy Handle"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                <div className="pt-1">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      isFounder
                        ? 'bg-amber-400/15 border border-amber-400/30 text-amber-300'
                        : user.role?.includes('ADMIN') || user.role?.includes('CHAIR')
                        ? 'bg-purple-500/15 border border-purple-500/30 text-purple-300'
                        : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-300'
                    }`}
                  >
                    {user.role || (isFounder ? '👑 ARCHITECT & FOUNDER' : 'DELEGATE')}
                  </span>
                </div>
              </div>
            </div>

            {user.bio ? (
              <p className="text-xs text-neutral-300 leading-relaxed bg-white/[0.02] p-3 rounded-2xl border border-white/[0.06]">
                {user.bio}
              </p>
            ) : null}

            <div className="grid grid-cols-5 gap-2 text-center">
              <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Award className="w-3.5 h-3.5 mx-auto text-amber-400 mb-1" />
                <span className="block font-mono font-bold text-sm text-white">{stats.muns}</span>
                <span className="block text-[8px] font-mono text-neutral-500 uppercase">MUNs</span>
              </div>
              <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <FileText className="w-3.5 h-3.5 mx-auto text-cyan-400 mb-1" />
                <span className="block font-mono font-bold text-sm text-white">{stats.articles}</span>
                <span className="block text-[8px] font-mono text-neutral-500 uppercase">Articles</span>
              </div>
              <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Radio className="w-3.5 h-3.5 mx-auto text-emerald-400 mb-1" />
                <span className="block font-mono font-bold text-sm text-white">{stats.pulse}</span>
                <span className="block text-[8px] font-mono text-neutral-500 uppercase">Pulse</span>
              </div>
              <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Compass className="w-3.5 h-3.5 mx-auto text-purple-400 mb-1" />
                <span className="block font-mono font-bold text-sm text-white">{stats.chambers}</span>
                <span className="block text-[8px] font-mono text-neutral-500 uppercase">Chamber</span>
              </div>
              <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <Calendar className="w-3.5 h-3.5 mx-auto text-pink-400 mb-1" />
                <span className="block font-mono font-bold text-sm text-white">{stats.events}</span>
                <span className="block text-[8px] font-mono text-neutral-500 uppercase">Events</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onDirectMessage?.(user.username, user.name);
                  onClose();
                }}
                className="py-2.5 px-3 rounded-2xl bg-white text-black font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-200 transition cursor-pointer shadow-md"
              >
                <MessageSquare className="w-3.5 h-3.5 text-black" />
                <span>Message</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onStartCall?.(user.username, 'voice');
                  onClose();
                }}
                className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Voice</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onStartCall?.(user.username, 'video');
                  onClose();
                }}
                className="py-2.5 px-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-purple-400" />
                <span>Video</span>
              </button>
            </div>

            <div className="text-center pt-1 border-t border-white/[0.06]">
              <Link
                href={`/pulse?u=${user.username.replace(/^@/, '')}`}
                onClick={onClose}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-cyan-400 transition"
              >
                <span>Open Full Profile in Pulse</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

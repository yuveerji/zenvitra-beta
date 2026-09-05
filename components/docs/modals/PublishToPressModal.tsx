'use client';

import React from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight, CheckCircle2, Globe2, Sparkles, ExternalLink } from 'lucide-react';
import { ZenDocument } from '@/types/docs';

interface PublishToPressModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: ZenDocument;
  onConfirmPublish: () => void;
}

export function PublishToPressModal({
  isOpen,
  onClose,
  activeDoc,
  onConfirmPublish,
}: PublishToPressModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-3xl bg-[#0b0e17] border border-pink-500/40 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-300 font-mono text-[10px] uppercase font-bold">
              <Newspaper className="w-3 h-3 text-pink-400" />
              <span>ZEN.DOCS &rarr; ZEN.PRESS PUBLICATION PIPELINE</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">Publish to ZENVITRA Press</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-neutral-400">
              <span>Publication Title:</span>
              <span className="text-white font-bold truncate max-w-[200px]">{activeDoc.title}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Author Attribution:</span>
              <span className="text-pink-400 font-bold">@yuveer (Founder Verified)</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>Target Feed:</span>
              <span className="text-cyan-400 font-bold">Zenvitra Gazette &bull; Open Web</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-neutral-300 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans text-xs">
              When published, this document will be transformed into a public, SEO-indexed journalistic article on <strong>ZEN.PRESS</strong>, featured on your profile timeline, and shareable across the open web.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmPublish();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-pink-500/20"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Confirm &amp; Publish Article</span>
          </button>
        </div>
      </div>
    </div>
  );
}

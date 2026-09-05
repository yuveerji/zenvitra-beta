'use client';

import React, { useState, useEffect } from 'react';
import { X, Eye, Flame, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlimpseSnap } from '@/types/chat';

interface GlimpseViewerModalProps {
  snap: GlimpseSnap | null;
  messageId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelfDestruct?: (messageId: string) => void;
}

export function GlimpseViewerModal({ snap, messageId, isOpen, onClose, onSelfDestruct }: GlimpseViewerModalProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen || !snap) {
      setProgress(100);
      return;
    }

    const duration = snap.isOneView ? 10000 : 15000; // 10s for 1-view instant
    const intervalTime = 50;
    const decrement = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          if (snap.isOneView && messageId && onSelfDestruct) {
            onSelfDestruct(messageId);
          }
          onClose();
          return 0;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, snap, messageId, onClose, onSelfDestruct]);

  if (!isOpen || !snap) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md h-[90vh] max-h-[720px] rounded-[3rem] bg-black border border-white/15 overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Top Progress Countdown Bar */}
          <div className="absolute top-3 inset-x-4 z-40">
            <div className="w-full h-1 rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Sender Header */}
            <div className="flex items-center justify-between pt-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white uppercase">
                  {snap.senderName?.charAt(0) || 'D'}
                </div>
                <div>
                  <h4 className="font-display font-medium text-xs text-white">
                    {snap.senderName}
                  </h4>
                  <span className="font-mono text-[9px] text-neutral-400">
                    @{snap.senderUsername} • {snap.isOneView ? '1-View Instant' : 'Snap'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (snap.isOneView && messageId && onSelfDestruct) {
                    onSelfDestruct(messageId);
                  }
                  onClose();
                }}
                className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Media Stage */}
          <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
            <img 
              src={snap.mediaUrl} 
              alt="Glimpse Snap" 
              className="w-full h-full object-cover" 
            />

            {/* Stickers Overlay */}
            {snap.stickers && snap.stickers.length > 0 && (
              <div className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-center gap-4 p-8">
                {snap.stickers.map((stk, i) => (
                  <span key={i} className="text-6xl filter drop-shadow-2xl animate-pulse">
                    {stk}
                  </span>
                ))}
              </div>
            )}

            {/* Caption Overlay */}
            {snap.caption && (
              <div className="absolute bottom-16 inset-x-6 p-3.5 bg-black/80 backdrop-blur-md rounded-2xl border border-white/20 text-center text-sm font-sans font-medium text-white shadow-2xl">
                {snap.caption}
              </div>
            )}
          </div>

          {/* Bottom Badge */}
          {snap.isOneView && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-[9px] flex items-center gap-1.5 shadow-md">
              <Eye className="w-3 h-3 text-rose-400" />
              <span>Self-destructing instant • {Math.ceil((progress / 100) * 10)}s remaining</span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

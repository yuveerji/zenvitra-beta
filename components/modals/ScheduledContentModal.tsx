'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, X, Plus, Trash2, Edit3, Film, Radio, Sparkles, CheckCircle2 } from 'lucide-react';

interface ScheduledContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduledContentModal({ isOpen, onClose }: ScheduledContentModalProps) {
  const [scheduledItems, setScheduledItems] = useState([
    {
      id: 'sched_1',
      title: 'Youth Climate Declaration Memo & Parliamentary Review',
      type: 'dispatch',
      publishDate: 'Tomorrow at 10:00 AM IST',
      channel: 'Global Youth Policy Assembly',
      status: 'Ready',
    },
    {
      id: 'sched_2',
      title: 'FLUX Reel: Diplomatic Negotiation Masterclass',
      type: 'flux',
      publishDate: 'Friday, Sept 2 at 6:30 PM IST',
      channel: 'MUN Training Vault',
      status: 'Encoding',
    },
  ]);

  if (!isOpen) return null;

  const handleDelete = (id: string) => {
    setScheduledItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-[#0a0a0f] border border-zinc-800 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative z-10 text-white select-none font-sans my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Scheduled Content</h3>
                <p className="text-[11px] text-zinc-400">Manage upcoming dispatches, summits &amp; reels</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 py-4 max-h-[360px] overflow-y-auto no-scrollbar">
            {scheduledItems.length === 0 ? (
              <div className="py-12 text-center text-zinc-500 text-xs space-y-2">
                <Clock className="w-8 h-8 mx-auto text-zinc-600" />
                <p>No scheduled dispatches or summits.</p>
              </div>
            ) : (
              scheduledItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white/[0.02] border border-zinc-800/80 hover:border-zinc-700 transition flex items-center justify-between gap-3 text-left"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.type === 'flux' ? (
                        <Film className="w-3.5 h-3.5 text-purple-400" />
                      ) : (
                        <Radio className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      <span className="font-bold text-xs text-white truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{item.publishDate}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-purple-300">{item.channel}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Cancel Schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">Auto-dispatches via sovereign queue</span>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs transition cursor-pointer shadow-sm"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

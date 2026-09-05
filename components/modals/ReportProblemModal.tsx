'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  X, 
  Send, 
  CheckCircle2, 
  UploadCloud, 
  ShieldAlert, 
  Sparkles, 
  MessageSquare,
  Bug,
  Cpu,
  Radio
} from 'lucide-react';

interface ReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportProblemModal({ isOpen, onClose }: ReportProblemModalProps) {
  const [category, setCategory] = useState<'ui_glitch' | 'security' | 'feed' | 'assembly' | 'feature'>('ui_glitch');
  const [description, setDescription] = useState('');
  const [screenshotName, setScreenshotName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const categories = [
    { id: 'ui_glitch', label: 'UI / Visual Glitch', icon: Bug },
    { id: 'feed', label: 'Feed & Media Playback', icon: Radio },
    { id: 'security', label: 'Security & Auth', icon: ShieldAlert },
    { id: 'assembly', label: 'Assembly & Comms', icon: Cpu },
    { id: 'feature', label: 'Feature Request', icon: Sparkles },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setDescription('');
        setScreenshotName(null);
        onClose();
      }, 1800);
    }, 900);
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
    }
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
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Report a Problem</h3>
                <p className="text-[11px] text-zinc-400">Send diagnostic feedback to Sovereign Core</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-white">Transmission Received</h4>
              <p className="text-xs text-zinc-400 max-w-xs">
                Your report has been encrypted and routed directly to the platform engineering node. Thank you for securing Zenvitra.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 py-4 text-left">
              {/* Category Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Issue Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const Icon = c.icon;
                    const active = category === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setCategory(c.id as any)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                          active
                            ? 'bg-white text-black border-white shadow-sm font-semibold'
                            : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-zinc-300">Description</label>
                  <span className="text-[10px] text-zinc-500 font-mono">{description.length}/500</span>
                </div>
                <textarea
                  required
                  rows={4}
                  maxLength={500}
                  placeholder="Please describe what happened, steps to reproduce, or what you were trying to accomplish..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-black border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition resize-none"
                />
              </div>

              {/* Screenshot / File attachment */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 block">Attach Screenshot (Optional)</label>
                <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/60 border border-dashed border-zinc-800 hover:border-zinc-600 transition cursor-pointer text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-purple-400" />
                    <span>{screenshotName || 'Click to select screenshot or debug log'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.log,.json"
                    onChange={handleFileAttach}
                    className="hidden"
                  />
                  {screenshotName && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); setScreenshotName(null); }}
                      className="p-1 text-zinc-500 hover:text-rose-400"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs transition flex items-center gap-2 disabled:opacity-40 cursor-pointer shadow-sm"
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

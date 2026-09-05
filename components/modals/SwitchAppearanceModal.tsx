'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, Sparkles, Check, X, Palette, Monitor } from 'lucide-react';

interface SwitchAppearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SwitchAppearanceModal({ isOpen, onClose }: SwitchAppearanceModalProps) {
  const [theme, setTheme] = useState<'obsidian' | 'midnight' | 'charcoal'>('obsidian');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zenvitra_appearance_theme') as any;
      if (saved && ['obsidian', 'midnight', 'charcoal'].includes(saved)) {
        setTheme(saved);
      }
    } catch (_) {}
  }, []);

  const handleSelectTheme = (newTheme: 'obsidian' | 'midnight' | 'charcoal') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('zenvitra_appearance_theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch (_) {}
  };

  if (!isOpen) return null;

  const themes = [
    {
      id: 'obsidian' as const,
      name: 'Obsidian Black',
      desc: 'Pure OLED pitch black, high-contrast neon accents (Default)',
      color: '#000000',
      border: '#27272a',
      accent: '#a855f7',
    },
    {
      id: 'midnight' as const,
      name: 'Midnight Nebula',
      desc: 'Deep cosmic indigo & cyan glow, reduced eye strain',
      color: '#070b19',
      border: '#1e293b',
      accent: '#38bdf8',
    },
    {
      id: 'charcoal' as const,
      name: 'Dim Charcoal',
      desc: 'Modern matte slate with subtle warm undertones',
      color: '#121216',
      border: '#3f3f46',
      accent: '#10b981',
    },
  ];

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
          className="w-full max-w-md bg-[#0a0a0f] border border-zinc-800 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative z-10 text-white select-none font-sans my-auto max-h-[92vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-400">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Switch Appearance</h3>
                <p className="text-[11px] text-zinc-400">Select your preferred sovereign palette</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Themes List */}
          <div className="space-y-3 py-5">
            {themes.map((t) => {
              const active = theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    active
                      ? 'bg-white/[0.06] border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.06)]'
                      : 'bg-white/[0.02] border-zinc-800/80 hover:border-zinc-700 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 shadow-inner"
                      style={{ backgroundColor: t.color, borderColor: t.border }}
                    >
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-white">{t.name}</h4>
                      <p className="text-[11px] text-zinc-400 truncate">{t.desc}</p>
                    </div>
                  </div>

                  {active && (
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-[11px] text-zinc-500 font-mono">Dark theme enabled by default</span>
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

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, ChevronDown, Check, Disc3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AmbientSoundscape, SOUNDSCAPE_MODES } from './useSovereignAudio';

interface AudioSpectrumVisualizerProps {
  frequencyData: Uint8Array;
  isMuted: boolean;
  soundscape: AmbientSoundscape;
  onSelectSoundscape?: (soundscape: AmbientSoundscape) => void;
  onClick?: () => void;
  onToggleMute?: (e?: React.MouseEvent) => void;
}

export function AudioSpectrumVisualizer({
  frequencyData,
  isMuted,
  soundscape,
  onSelectSoundscape,
  onClick,
  onToggleMute,
}: AudioSpectrumVisualizerProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  const currentOption = SOUNDSCAPE_MODES.find((m) => m.id === soundscape) || SOUNDSCAPE_MODES[0];

  const handleModeSelect = (modeId: AmbientSoundscape) => {
    if (onSelectSoundscape) {
      onSelectSoundscape(modeId);
    } else if (onClick) {
      onClick();
    }
    setIsMenuOpen(false);
  };

  return (
    <div ref={containerRef} className="relative z-50">
      <div className="flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.5)]">
        {/* Selector Trigger Button */}
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          type="button"
          className="group flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-white/[0.08] transition-all duration-200 cursor-pointer"
          title="Choose Sovereign Audio Mode"
        >
          {/* Animated Spectrum Bars */}
          <div className="flex items-center gap-[2px] h-3.5 w-9 justify-center overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => {
              const raw = (frequencyData[i * 2] || 0) / 255;
              const heightPx = isMuted ? 3 : Math.min(13, Math.max(3, Math.round(raw * 13)));
              return (
                <span
                  key={i}
                  style={{ height: `${heightPx}px` }}
                  className={`w-[2.5px] rounded-full transition-all duration-75 ${
                    isMuted
                      ? 'bg-neutral-600'
                      : `bg-gradient-to-t ${currentOption.color}`
                  }`}
                />
              );
            })}
          </div>

          {/* Current Mode Badge */}
          <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-neutral-300 group-hover:text-white transition-colors flex items-center gap-1">
            <span>{isMuted ? 'MUTED' : currentOption.label.split(' / ')[0]}</span>
            <ChevronDown
              className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${
                isMenuOpen ? 'rotate-180 text-white' : ''
              }`}
            />
          </span>
        </button>

        {/* Mute / Unmute Button */}
        <button
          onClick={(e) => {
            if (onToggleMute) onToggleMute(e);
            else if (onClick) onClick();
          }}
          type="button"
          className={`p-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
            isMuted
              ? 'bg-neutral-800/80 border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-700'
              : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
          }`}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          )}
        </button>
      </div>

      {/* Floating Audio Modes Selector Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-[#0a0c12]/98 border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(251,191,36,0.06)] p-2 backdrop-blur-2xl text-left overflow-hidden z-50"
          >
            <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold flex items-center gap-1.5">
                <Disc3 className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Audio Soundscapes</span>
              </span>
              <span className="text-[9px] font-mono text-neutral-500 uppercase">
                {SOUNDSCAPE_MODES.filter((m) => m.id !== 'OFF').length} Modes
              </span>
            </div>

            <div className="py-1 space-y-0.5 max-h-[380px] overflow-y-auto">
              {SOUNDSCAPE_MODES.map((mode) => {
                const isSelected = soundscape === mode.id && !isMuted;

                return (
                  <button
                    key={mode.id}
                    onClick={() => handleModeSelect(mode.id)}
                    type="button"
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.08] border border-white/15'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                        isSelected
                          ? `bg-gradient-to-r ${mode.color} shadow-[0_0_8px_rgba(255,255,255,0.8)]`
                          : 'bg-neutral-600'
                      }`}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-mono font-bold uppercase tracking-wider ${
                            isSelected ? 'text-white' : 'text-neutral-300'
                          }`}
                        >
                          {mode.label}
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 font-light leading-snug line-clamp-2 mt-0.5 font-sans">
                        {mode.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 px-2 pb-1 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span>Master Sound State</span>
              <button
                onClick={(e) => {
                  if (onToggleMute) onToggleMute(e);
                  else if (onClick) onClick();
                  setIsMenuOpen(false);
                }}
                className="text-amber-400 hover:text-amber-300 font-bold uppercase cursor-pointer"
              >
                {isMuted ? 'Turn Sound ON' : 'Mute All'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

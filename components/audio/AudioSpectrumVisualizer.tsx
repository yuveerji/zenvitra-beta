'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioSpectrumVisualizerProps {
  frequencyData: Uint8Array;
  isMuted: boolean;
  soundscape: string;
  onClick?: () => void;
  onToggleMute?: (e: React.MouseEvent) => void;
}

export function AudioSpectrumVisualizer({
  frequencyData,
  isMuted,
  soundscape,
  onClick,
  onToggleMute,
}: AudioSpectrumVisualizerProps) {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-lg">
      {/* Visualizer & Mode Indicator (Click cycles soundscapes) */}
      <button
        onClick={onClick}
        type="button"
        className="group flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
        title={`Audio Engine: ${soundscape} (Click to switch soundscape)`}
      >
        {/* Bars visualizer */}
        <div className="flex items-center gap-[2px] h-3.5 w-9 justify-center overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => {
            const raw = (frequencyData[i * 2] || 0) / 255;
            const heightPx = isMuted ? 3 : Math.min(12, Math.max(3, Math.round(raw * 12)));
            return (
              <span
                key={i}
                style={{ height: `${heightPx}px` }}
                className={`w-[2.5px] rounded-full transition-all duration-75 ${
                  isMuted
                    ? 'bg-neutral-600'
                    : 'bg-gradient-to-t from-amber-500 to-amber-200'
                }`}
              />
            );
          })}
        </div>

        {/* Label */}
        <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-neutral-300 group-hover:text-amber-300 transition-colors">
          {soundscape === 'OFF' ? 'MUTED' : soundscape.replace('_', ' ')}
        </span>
      </button>

      {/* Explicit Mute / Unmute Toggle Button */}
      <button
        onClick={onToggleMute || onClick}
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
  );
}

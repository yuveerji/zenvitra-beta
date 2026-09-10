'use client';

import React from 'react';

interface AudioSpectrumVisualizerProps {
  frequencyData: Uint8Array;
  isMuted: boolean;
  soundscape: string;
  onClick?: () => void;
}

export function AudioSpectrumVisualizer({
  frequencyData,
  isMuted,
  soundscape,
  onClick,
}: AudioSpectrumVisualizerProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md hover:border-amber-400/40 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer shadow-lg"
      title={`Audio Engine: ${soundscape} (Click to cycle)`}
    >
      {/* Bars visualizer */}
      <div className="flex items-end gap-[2px] h-4 w-12 justify-center">
        {Array.from({ length: 8 }).map((_, i) => {
          const val = isMuted ? 2 : (frequencyData[i * 2] || 0) / 255;
          const heightPx = Math.max(3, Math.round(val * 16));
          return (
            <span
              key={i}
              style={{ height: `${heightPx}px` }}
              className={`w-[2.5px] rounded-full transition-all duration-75 ${
                isMuted
                  ? 'bg-neutral-600'
                  : i % 2 === 0
                  ? 'bg-gradient-to-t from-amber-500 to-amber-200'
                  : 'bg-gradient-to-t from-amber-600 to-amber-400'
              }`}
            />
          );
        })}
      </div>

      {/* Label & Status */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono tracking-wider uppercase font-semibold text-neutral-300 group-hover:text-amber-300 transition-colors">
          {soundscape === 'OFF' ? 'AUDIO MUTE' : soundscape.replace('_', ' ')}
        </span>
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isMuted ? 'bg-neutral-600' : 'bg-amber-400 animate-pulse'
          }`}
        />
      </div>
    </button>
  );
}

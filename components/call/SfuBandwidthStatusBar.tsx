'use client';

import React from 'react';
import { Wifi, Signal, ShieldAlert, Gavel, MicOff, Volume2 } from 'lucide-react';
import { NetworkHealthMetrics, StreamQualityTier } from '@/lib/call/ZenChamberMediaEngine';

export interface SfuBandwidthStatusBarProps {
  metrics: NetworkHealthMetrics | null;
  isChairPriorityActive: boolean;
  activeSpeakerCount: number;
  onOptimizeForWeakConnection?: () => void;
}

export function SfuBandwidthStatusBar({
  metrics,
  isChairPriorityActive,
  activeSpeakerCount,
  onOptimizeForWeakConnection,
}: SfuBandwidthStatusBarProps) {
  if (!metrics) return null;

  const getTierColor = (tier: StreamQualityTier) => {
    switch (tier) {
      case 'HIGH_1080P':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'MEDIUM_720P':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'LOW_360P':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'AUDIO_ONLY':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30 animate-pulse';
    }
  };

  const getTierLabel = (tier: StreamQualityTier) => {
    switch (tier) {
      case 'HIGH_1080P':
        return '1080p HD • SFU Simulcast';
      case 'MEDIUM_720P':
        return '720p Balanced • SFU Active';
      case 'LOW_360P':
        return '360p Data Saver • 4G Profile';
      case 'AUDIO_ONLY':
        return 'Audio Priority • Cellular Throttled';
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-neutral-300">
      {/* Left: Quality Profile Badge */}
      <div className="flex items-center gap-2">
        <div className={`px-2 py-0.5 rounded-full border text-[10px] font-bold flex items-center gap-1.5 ${getTierColor(metrics.qualityTier)}`}>
          <Signal className="w-3 h-3" />
          <span>{getTierLabel(metrics.qualityTier)}</span>
        </div>

        {/* Telemetry metrics */}
        <div className="hidden sm:flex items-center gap-2 text-neutral-400 text-[10px]">
          <span>RTT: <strong className="text-white">{metrics.rttMs}ms</strong></span>
          <span>•</span>
          <span>Loss: <strong className={metrics.packetLossPercent > 5 ? 'text-rose-400' : 'text-neutral-300'}>{metrics.packetLossPercent}%</strong></span>
        </div>
      </div>

      {/* Center: Gavel & Chair Priority Alert */}
      {isChairPriorityActive && (
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold animate-pulse">
          <Gavel className="w-3 h-3 text-amber-400" />
          <span>Dais Gavel Struck • Microphone Floor Ducking Active</span>
        </div>
      )}

      {/* Right: Active Speakers & Weak connection optimizer */}
      <div className="flex items-center gap-2 ml-auto">
        {activeSpeakerCount > 0 && (
          <div className="flex items-center gap-1 text-emerald-400 text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <Volume2 className="w-3 h-3 animate-pulse" />
            <span>{activeSpeakerCount} Speaking</span>
          </div>
        )}

        {metrics.qualityTier === 'LOW_360P' && onOptimizeForWeakConnection && (
          <button
            type="button"
            onClick={onOptimizeForWeakConnection}
            className="px-2 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[9px] font-bold transition cursor-pointer"
          >
            Switch to Audio Priority
          </button>
        )}
      </div>
    </div>
  );
}

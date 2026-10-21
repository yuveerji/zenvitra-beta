'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  List,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Clock,
  CircleDot,
  Volume2,
  VolumeX,
  Music,
  Compass,
  Radio,
  Sliders,
  ChevronDown
} from 'lucide-react';
import {
  EcosystemClusterId,
  ECOSYSTEM_CLUSTERS,
  AppDevelopmentStatus,
  ExplorationLevel
} from '@/lib/zenAppsRegistry';

interface EcosystemToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedClusterId: EcosystemClusterId | 'ALL';
  onSelectCluster: (clusterId: EcosystemClusterId | 'ALL') => void;
  selectedStatus: AppDevelopmentStatus | 'ALL';
  onSelectStatus: (status: AppDevelopmentStatus | 'ALL') => void;
  viewMode: 'map' | 'list';
  onToggleViewMode: () => void;
  showConnections: boolean;
  onToggleConnections: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  totalAppsCount: number;
  filteredAppsCount: number;
  currentLevel: ExplorationLevel;
  onSelectLevel: (level: ExplorationLevel) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  soundVolume: number;
  onVolumeChange: (vol: number) => void;
  ambientEnabled: boolean;
  onToggleAmbient: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function EcosystemToolbar({
  searchQuery,
  onSearchChange,
  selectedClusterId,
  onSelectCluster,
  selectedStatus,
  onSelectStatus,
  viewMode,
  onToggleViewMode,
  showConnections,
  onToggleConnections,
  showLabels,
  onToggleLabels,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  totalAppsCount,
  filteredAppsCount,
  currentLevel,
  onSelectLevel,
  soundEnabled,
  onToggleSound,
  soundVolume,
  onVolumeChange,
  ambientEnabled,
  onToggleAmbient,
  isFullscreen,
  onToggleFullscreen,
}: EcosystemToolbarProps) {
  const [showAudioMenu, setShowAudioMenu] = useState(false);
  const clusterList = Object.values(ECOSYSTEM_CLUSTERS);

  const explorationLevels: { id: ExplorationLevel; label: string; num: string; targetZoom: number }[] = [
    { id: 'CORE', label: 'Core', num: 'L0', targetZoom: 1.5 },
    { id: 'APPS', label: 'Apps', num: 'L1', targetZoom: 1.25 },
    { id: 'MODULES', label: 'Modules', num: 'L2', targetZoom: 1.0 },
    { id: 'INFRASTRUCTURE', label: 'Infra', num: 'L3', targetZoom: 0.8 },
    { id: 'UNIVERSE', label: 'Universe', num: 'L4', targetZoom: 0.6 },
  ];

  return (
    <div className="w-full space-y-3 relative z-30 select-none">
      {/* Top Row: Search, Progressive Level Navigation, Audio Controls & View Mode */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg">
          <div className="flex items-center gap-2 bg-[#080b12]/95 border border-white/15 rounded-2xl px-4 py-2.5 text-xs focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 50+ apps, modules, gateways (e.g., chat, dms, cashfree)..."
              className="bg-transparent text-xs text-white placeholder:text-neutral-500 focus:outline-none w-full font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="text-neutral-500 hover:text-white text-xs px-1 cursor-pointer"
              >
                ✕
              </button>
            )}
            <span className="text-[10px] font-mono text-neutral-500 shrink-0 hidden sm:inline">
              {filteredAppsCount}/{totalAppsCount} Apps
            </span>
          </div>
        </div>

        {/* PROGRESSIVE EXPLORATION LEVEL TABS */}
        {viewMode === 'map' && (
          <div className="flex items-center gap-1 bg-[#080b12]/90 border border-white/15 rounded-2xl p-1 overflow-x-auto text-xs font-mono">
            {explorationLevels.map((lvl) => {
              const isActive = currentLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onSelectLevel(lvl.id)}
                  className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                  title={`Jump to ${lvl.label} exploration layer`}
                >
                  <span className="text-[9px] opacity-70">{lvl.num}</span>
                  <span className="uppercase text-[11px] font-bold">{lvl.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Controls: Audio Menu, Map Controls, and View Mode */}
        <div className="flex items-center gap-2 justify-between lg:justify-end flex-wrap">
          {/* Cyber Audio Control with Settings Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAudioMenu(!showAudioMenu)}
              className={`p-2 rounded-2xl border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-mono ${
                soundEnabled
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                  : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
              title="Cyber Audio Synthesizer (Zero Downloads)"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline font-bold text-[10px]">CYBER AUDIO</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-neutral-400" />
                  <span className="hidden sm:inline text-[10px]">MUTED</span>
                </>
              )}
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Audio Settings Dropdown */}
            {showAudioMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-[#090d16] border border-cyan-500/30 p-4 shadow-2xl z-50 space-y-3.5 text-left font-mono">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    Cyber Sound
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAudioMenu(false)}
                    className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Master Audio Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300">Audio System</span>
                  <button
                    type="button"
                    onClick={onToggleSound}
                    className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition cursor-pointer border ${
                      soundEnabled
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-white/5 text-neutral-400 border-white/10'
                    }`}
                  >
                    {soundEnabled ? 'ENABLED' : 'MUTED'}
                  </button>
                </div>

                {/* Volume Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Volume</span>
                    <span>{Math.round(soundVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={soundVolume}
                    disabled={!soundEnabled}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer disabled:opacity-30"
                  />
                </div>

                {/* Ambient Drone Mode Toggle */}
                <div className="flex items-center justify-between pt-1 border-t border-white/10">
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-300">Ambient Drone</span>
                    <span className="text-[9px] text-neutral-500">Continuous background pad</span>
                  </div>
                  <button
                    type="button"
                    disabled={!soundEnabled}
                    onClick={onToggleAmbient}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition cursor-pointer border ${
                      ambientEnabled && soundEnabled
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        : 'bg-white/5 text-neutral-400 border-white/10 opacity-50'
                    }`}
                  >
                    {ambientEnabled && soundEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Map Controls (Zoom In, Zoom Out, Reset, Connections, Labels) */}
          {viewMode === 'map' && (
            <div className="flex items-center gap-1 bg-[#080b12]/90 border border-white/15 rounded-2xl p-1">
              <button
                type="button"
                onClick={onZoomIn}
                className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Zoom In (or scroll up)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onZoomOut}
                className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Zoom Out (or scroll down to reveal deeper layers)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onResetZoom}
                className="p-1.5 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                title="Reset Zoom & Pan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="w-[1px] h-4 bg-white/15 mx-1" />

              <button
                type="button"
                onClick={onToggleConnections}
                className={`p-1.5 rounded-xl transition cursor-pointer ${
                  showConnections
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title={showConnections ? 'Hide Connection Spoke Lines' : 'Show Connection Spoke Lines'}
              >
                {showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={onToggleLabels}
                className={`p-1.5 rounded-xl transition cursor-pointer ${
                  showLabels
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title={showLabels ? 'Hide Node Labels' : 'Show Node Labels'}
              >
                <Sparkles className="w-4 h-4" />
              </button>

              {onToggleFullscreen && (
                <>
                  <div className="w-[1px] h-4 bg-white/15 mx-1" />
                  <button
                    type="button"
                    onClick={onToggleFullscreen}
                    className={`p-1.5 rounded-xl transition cursor-pointer ${
                      isFullscreen
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'hover:bg-white/10 text-neutral-300 hover:text-white'
                    }`}
                    title={isFullscreen ? 'Exit Full Screen View' : 'Enter Full Screen View'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </>
              )}
            </div>
          )}

          {/* View Mode Toggle (Map vs List) */}
          <button
            type="button"
            onClick={onToggleViewMode}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-neutral-200 transition font-mono cursor-pointer"
            title="Toggle between Circular Mind Map and Application Grid List"
          >
            {viewMode === 'map' ? (
              <>
                <List className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Grid View</span>
              </>
            ) : (
              <>
                <CircleDot className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">Circular Map</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Second Row: 7 Cluster Quick Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-mono">
        <button
          type="button"
          onClick={() => onSelectCluster('ALL')}
          className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap border ${
            selectedClusterId === 'ALL'
              ? 'bg-white text-black border-white font-bold shadow-sm'
              : 'bg-white/[0.03] text-neutral-400 hover:text-white border-white/10 hover:bg-white/5'
          }`}
        >
          All Clusters ({totalAppsCount})
        </button>

        {clusterList.map((c) => {
          const isSelected = selectedClusterId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectCluster(isSelected ? 'ALL' : c.id)}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-white/15 text-white font-bold'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-white border-white/10 hover:bg-white/5'
              }`}
              style={{
                borderColor: isSelected ? c.accentColor : undefined,
                color: isSelected ? '#ffffff' : undefined,
              }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: c.accentColor }}
              />
              <span>{c.name}</span>
            </button>
          );
        })}

        {/* Status Filter Dropdown / Pill */}
        <div className="flex items-center gap-1 border-l border-white/15 pl-2 ml-1">
          {(['ALL', 'Live', 'In Development', 'Planned'] as (AppDevelopmentStatus | 'ALL')[]).map(
            (status) => {
              const isSelected = selectedStatus === status;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => onSelectStatus(status)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] transition cursor-pointer whitespace-nowrap border ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold'
                      : 'bg-transparent text-neutral-500 hover:text-neutral-300 border-transparent hover:bg-white/5'
                  }`}
                >
                  {status === 'ALL' ? 'Any Status' : status}
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
}

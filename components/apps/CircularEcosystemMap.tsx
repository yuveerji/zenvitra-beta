'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ZenAppItem,
  SharedPlatformService,
  ZenAppModule,
  UniverseIntegration,
  ExplorationLevel,
  EcosystemClusterId,
  ECOSYSTEM_CLUSTERS,
  EXPANDED_INFRASTRUCTURE_SERVICES,
  ZEN_APP_MODULES,
  UNIVERSE_INTEGRATIONS,
  CROSS_WORKFLOW_CONNECTIONS,
} from '@/lib/zenAppsRegistry';
import { cyberAudio } from '@/lib/cyberAudioEngine';
import { DynamicZenIcon } from './DynamicZenIcon';
import {
  Cpu,
  ShieldCheck,
  Database,
  Radio,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  Zap,
  Globe2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Compass,
  ArrowUpRight,
  CheckCircle2,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';

interface CircularEcosystemMapProps {
  apps: ZenAppItem[];
  selectedApp: ZenAppItem | null;
  onSelectApp: (app: ZenAppItem | null) => void;
  selectedModule: ZenAppModule | null;
  onSelectModule: (mod: ZenAppModule) => void;
  selectedService: SharedPlatformService | null;
  onSelectService: (service: SharedPlatformService) => void;
  selectedIntegration: UniverseIntegration | null;
  onSelectIntegration: (integration: UniverseIntegration) => void;
  selectedClusterId: EcosystemClusterId | 'ALL';
  onSelectCluster: (clusterId: EcosystemClusterId | 'ALL') => void;
  showConnections: boolean;
  showLabels: boolean;
  zoomLevel: number;
  onZoomChange: (newZoom: number) => void;
  currentLevel: ExplorationLevel;
  onLevelChange: (newLevel: ExplorationLevel) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export function CircularEcosystemMap({
  apps,
  selectedApp,
  onSelectApp,
  selectedModule,
  onSelectModule,
  selectedService,
  onSelectService,
  selectedIntegration,
  onSelectIntegration,
  selectedClusterId,
  onSelectCluster,
  showConnections,
  showLabels,
  zoomLevel,
  onZoomChange,
  currentLevel,
  onLevelChange,
  isFullscreen,
  onToggleFullscreen,
}: CircularEcosystemMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover & Pinned states for bottom card
  const [hoveredApp, setHoveredApp] = useState<ZenAppItem | null>(null);
  const [hoveredClusterId, setHoveredClusterId] = useState<EcosystemClusterId | null>(null);
  const [hoveredModule, setHoveredModule] = useState<ZenAppModule | null>(null);
  const [hoveredService, setHoveredService] = useState<SharedPlatformService | null>(null);
  const [hoveredIntegration, setHoveredIntegration] = useState<UniverseIntegration | null>(null);

  // Persistent/pinned card state & dismiss control
  const [pinnedApp, setPinnedApp] = useState<ZenAppItem | null>(null);
  const [isPopupDismissed, setIsPopupDismissed] = useState(false);
  const dismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isHoveringPopupRef = useRef(false);

  // Keep refs in sync for timer callbacks
  const pinnedAppRef = useRef<ZenAppItem | null>(null);
  useEffect(() => {
    pinnedAppRef.current = pinnedApp;
  }, [pinnedApp]);

  const selectedAppRef = useRef<ZenAppItem | null>(selectedApp);
  useEffect(() => {
    selectedAppRef.current = selectedApp;
    if (selectedApp) {
      setPinnedApp(selectedApp);
      setIsPopupDismissed(false);
    }
  }, [selectedApp]);

  const handleClosePopup = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
    setPinnedApp(null);
    setHoveredApp(null);
    setHoveredModule(null);
    setHoveredService(null);
    setHoveredIntegration(null);
    setIsPopupDismissed(true);
    onSelectApp(null);
  }, [onSelectApp]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClosePopup();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClosePopup]);

  // Panning state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);

  // 1000x1000 SVG Canvas Coordinate Geometry
  const CX = 500;
  const CY = 500;
  const R_CORE = 68;
  const R_INFRA = 155;
  const R_CATEGORY = 230;
  const R_APPS_INNER = 330;
  const R_APPS_OUTER = 415;
  const R_MODULES = 495;
  const R_UNIVERSE = 575;

  const clusters = useMemo(() => Object.values(ECOSYSTEM_CLUSTERS), []);

  // Polar to Cartesian in 1000x1000 space
  const polarToCartesian = useCallback((angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: CX + radius * Math.cos(rad),
      y: CY + radius * Math.sin(rad),
    };
  }, []);

  // Quadratic Bezier branch generator curving gently outward
  const getBranchPath = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = midX - CX;
    const dy = midY - CY;
    const dist = Math.hypot(dx, dy) || 1;
    const bow = 16;
    const cpX = midX + (dx / dist) * bow;
    const cpY = midY + (dy / dist) * bow;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cpX.toFixed(1)} ${cpY.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }, []);

  // Hysteresis Zoom Level Calculation
  const calculateLevelWithHysteresis = useCallback(
    (zoom: number, current: ExplorationLevel): ExplorationLevel => {
      const buffer = 0.025;
      if (current === 'CORE') {
        if (zoom < 1.35 - buffer) return 'APPS';
        return 'CORE';
      }
      if (current === 'APPS') {
        if (zoom >= 1.35 + buffer) return 'CORE';
        if (zoom < 1.1 - buffer) return 'MODULES';
        return 'APPS';
      }
      if (current === 'MODULES') {
        if (zoom >= 1.1 + buffer) return 'APPS';
        if (zoom < 0.9 - buffer) return 'INFRASTRUCTURE';
        return 'MODULES';
      }
      if (current === 'INFRASTRUCTURE') {
        if (zoom >= 0.9 + buffer) return 'MODULES';
        if (zoom < 0.7 - buffer) return 'UNIVERSE';
        return 'INFRASTRUCTURE';
      }
      if (current === 'UNIVERSE') {
        if (zoom >= 0.7 + buffer) return 'INFRASTRUCTURE';
        return 'UNIVERSE';
      }
      return 'APPS';
    },
    []
  );

  // Monitor zoom changes
  const prevLevelRef = useRef<ExplorationLevel>(currentLevel);
  useEffect(() => {
    const nextLevel = calculateLevelWithHysteresis(zoomLevel, currentLevel);
    if (nextLevel !== prevLevelRef.current) {
      prevLevelRef.current = nextLevel;
      onLevelChange(nextLevel);

      if (nextLevel === 'UNIVERSE') {
        cyberAudio?.playDeepestLayer();
      } else {
        const levelIndexMap: Record<ExplorationLevel, number> = {
          CORE: 0,
          APPS: 1,
          MODULES: 2,
          INFRASTRUCTURE: 3,
          UNIVERSE: 4,
        };
        cyberAudio?.playLayerReveal(levelIndexMap[nextLevel]);
      }
    }
  }, [zoomLevel, currentLevel, calculateLevelWithHysteresis, onLevelChange]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY;
    const direction = delta > 0 ? 'out' : 'in';
    const zoomStep = 0.06;
    const nextZoom = direction === 'out' ? Math.max(0.5, zoomLevel - zoomStep) : Math.min(1.8, zoomLevel + zoomStep);

    if (Math.abs(nextZoom - zoomLevel) > 0.001) {
      cyberAudio?.playZoomSweep(direction);
      onZoomChange(Number(nextZoom.toFixed(2)));
    }
  };

  // Mouse drag panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      };
      touchDistanceRef.current = null;
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStartRef.current.x,
        y: e.touches[0].clientY - dragStartRef.current.y,
      });
    } else if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const diff = newDist - touchDistanceRef.current;

      if (Math.abs(diff) > 4) {
        const factor = diff * 0.003;
        const nextZoom = Math.max(0.5, Math.min(1.8, zoomLevel + factor));
        touchDistanceRef.current = newDist;
        onZoomChange(Number(nextZoom.toFixed(2)));
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistanceRef.current = null;
  };

  // Visibility checks
  const isAppsVisible = currentLevel !== 'CORE';
  const isModulesVisible = currentLevel === 'MODULES' || currentLevel === 'INFRASTRUCTURE' || currentLevel === 'UNIVERSE';
  const isInfraVisible = currentLevel === 'INFRASTRUCTURE' || currentLevel === 'UNIVERSE';
  const isUniverseVisible = currentLevel === 'UNIVERSE';

  // Active focus
  const activeFocusApp = hoveredApp || (!isPopupDismissed ? (pinnedApp || selectedApp) : null);

  // Active item to display in bottom floating card
  const activeCardItem = useMemo(() => {
    const app = hoveredApp || (!isPopupDismissed ? (pinnedApp || selectedApp) : null);
    if (app) {
      const cluster = ECOSYSTEM_CLUSTERS[app.clusterId];
      return {
        id: app.id,
        name: app.name,
        badge: cluster?.shortName || 'APP',
        accentColor: cluster?.accentColor || '#06b6d4',
        tagline: app.tagline,
        iconName: app.iconName,
        route: app.route,
        status: app.status,
        type: 'app' as const,
      };
    }

    if (hoveredModule) {
      const cluster = ECOSYSTEM_CLUSTERS[hoveredModule.clusterId];
      return {
        id: hoveredModule.id,
        name: hoveredModule.name,
        badge: `${cluster?.shortName || 'MODULE'} • MODULE`,
        accentColor: cluster?.accentColor || '#a855f7',
        tagline: hoveredModule.description,
        iconName: 'Layers',
        route: undefined,
        status: hoveredModule.status,
        type: 'module' as const,
      };
    }

    if (hoveredService) {
      return {
        id: hoveredService.id,
        name: hoveredService.name,
        badge: 'SHARED SERVICE',
        accentColor: '#06b6d4',
        tagline: hoveredService.description,
        iconName: hoveredService.name.toLowerCase().includes('postgres') || hoveredService.name.toLowerCase().includes('database') ? 'Database' : 'Cpu',
        route: undefined,
        status: hoveredService.status,
        type: 'service' as const,
      };
    }

    if (hoveredIntegration) {
      return {
        id: hoveredIntegration.id,
        name: hoveredIntegration.name,
        badge: 'GATEWAY',
        accentColor: '#a855f7',
        tagline: hoveredIntegration.description,
        iconName: 'Globe2',
        route: undefined,
        status: hoveredIntegration.status,
        type: 'integration' as const,
      };
    }

    return null;
  }, [hoveredApp, pinnedApp, selectedApp, isPopupDismissed, hoveredModule, hoveredService, hoveredIntegration]);

  // Compute cluster positions
  const clusterPositions = useMemo(() => {
    const map: Record<EcosystemClusterId, { x: number; y: number; angle: number }> = {} as any;
    clusters.forEach((c) => {
      const pos = polarToCartesian(c.centerAngleDeg, R_CATEGORY);
      map[c.id] = { ...pos, angle: c.centerAngleDeg };
    });
    return map;
  }, [clusters, polarToCartesian]);

  // Compute app positions with staggered alternating radii to completely eliminate overlaps
  const appPositions = useMemo(() => {
    return apps.map((app, index) => {
      // Use assigned radius percent or alternate inner/outer orbit
      const radius = app.radiusPercent > 40 ? R_APPS_OUTER : R_APPS_INNER;
      const pos = polarToCartesian(app.angleDeg, radius);
      return {
        app,
        x: pos.x,
        y: pos.y,
        radius,
      };
    });
  }, [apps, polarToCartesian]);

  // Filter modules by cluster
  const visibleModules = useMemo(() => {
    return ZEN_APP_MODULES.filter((m) => {
      if (selectedClusterId !== 'ALL' && m.clusterId !== selectedClusterId) return false;
      return true;
    });
  }, [selectedClusterId]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-[76vh] sm:h-[84vh] rounded-[2.5rem] bg-[#03060c] border border-white/10 select-none overflow-hidden touch-none flex items-center justify-center shadow-[0_25px_90px_rgba(0,0,0,0.95)] ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* 1. AMBIENT CELESTIAL BACKGROUND NEBULA */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-radial from-cyan-500/8 via-purple-500/4 to-transparent rounded-full blur-[140px]" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#334155_0.75px,transparent_0.75px)] [background-size:28px_28px] opacity-20" />
      </div>

      {/* 2. CONTINUOUS ZOOM & PAN STAGE */}
      <div
        className="relative w-full h-full flex items-center justify-center transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
        }}
      >
        {/* 3. SVG INTERACTIVE CANVAS (1000x1000 Coordinate System) */}
        <svg
          viewBox="0 0 1000 1000"
          className="w-full h-full max-w-[950px] max-h-[950px] aspect-square overflow-visible select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget || (e.target as SVGElement).id === 'canvas-bg-rect') {
              handleClosePopup();
            }
          }}
        >
          <defs>
            {/* Glow Filters */}
            <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="branchGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Central Radial Gradient */}
            <radialGradient id="centerHubGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#081026" />
              <stop offset="65%" stopColor="#04060d" />
              <stop offset="100%" stopColor="#020308" />
            </radialGradient>

            <linearGradient id="cyberLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background click interceptor to dismiss popup */}
          <rect id="canvas-bg-rect" x="-200" y="-200" width="1400" height="1400" fill="transparent" />

          {/* 4. CONCENTRIC CYBER HUD ORBITS & RANGE FINDER TICKS */}
          <g className="pointer-events-none opacity-35">
            {/* Outer Universe Ring */}
            {isUniverseVisible && (
              <circle
                cx={CX}
                cy={CY}
                r={R_UNIVERSE}
                fill="none"
                stroke="#a855f7"
                strokeWidth="1"
                strokeDasharray="4 8"
                opacity="0.6"
              />
            )}

            {/* Modules Satellite Orbit */}
            {isModulesVisible && (
              <circle
                cx={CX}
                cy={CY}
                r={R_MODULES}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="0.8"
                strokeDasharray="2 6"
                opacity="0.5"
              />
            )}

            {/* Primary Apps Orbit Rings */}
            {isAppsVisible && (
              <>
                <circle
                  cx={CX}
                  cy={CY}
                  r={R_APPS_OUTER}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.6"
                  strokeDasharray="2 8"
                  opacity="0.25"
                />
                <circle
                  cx={CX}
                  cy={CY}
                  r={R_APPS_INNER}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.6"
                  strokeDasharray="2 8"
                  opacity="0.25"
                />
              </>
            )}

            {/* Category Anchor Orbit */}
            <circle
              cx={CX}
              cy={CY}
              r={R_CATEGORY}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              strokeDasharray="1 6"
              opacity="0.4"
            />

            {/* Middle Infrastructure Orbit */}
            <circle
              cx={CX}
              cy={CY}
              r={R_INFRA}
              fill="none"
              stroke={isInfraVisible ? '#06b6d4' : '#ffffff'}
              strokeWidth={isInfraVisible ? '1.2' : '0.6'}
              strokeDasharray={isInfraVisible ? '4 6' : '2 6'}
              opacity={isInfraVisible ? 0.7 : 0.2}
              filter={isInfraVisible ? 'url(#branchGlow)' : undefined}
            />

            {/* Range Finder Compass Crosshairs */}
            <line x1={CX - R_APPS_OUTER - 40} y1={CY} x2={CX + R_APPS_OUTER + 40} y2={CY} stroke="#ffffff" strokeWidth="0.4" strokeDasharray="3 9" opacity="0.15" />
            <line x1={CX} y1={CY - R_APPS_OUTER - 40} x2={CX} y2={CY + R_APPS_OUTER + 40} stroke="#ffffff" strokeWidth="0.4" strokeDasharray="3 9" opacity="0.15" />
          </g>

          {/* 5. PRIMARY CATEGORY TRUNK BRANCHES (From Center Hub to Category Hubs) */}
          <g>
            {clusters.map((cluster) => {
              const catPos = clusterPositions[cluster.id];
              const isSelected = selectedClusterId === cluster.id;
              const isHovered = hoveredClusterId === cluster.id;
              const isParentOfFocused = activeFocusApp?.clusterId === cluster.id;
              const isHighlighted = isSelected || isHovered || isParentOfFocused;
              const path = `M ${CX} ${CY} L ${catPos.x.toFixed(1)} ${catPos.y.toFixed(1)}`;

              return (
                <g key={`trunk-${cluster.id}`}>
                  {/* Outer Ambient Glow Trunk */}
                  <line
                    x1={CX}
                    y1={CY}
                    x2={catPos.x}
                    y2={catPos.y}
                    stroke={cluster.accentColor}
                    strokeWidth={isHighlighted ? 4 : 1.5}
                    strokeOpacity={isHighlighted ? 0.6 : 0.2}
                    filter={isHighlighted ? 'url(#branchGlow)' : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Core Sharp Trunk */}
                  <line
                    x1={CX}
                    y1={CY}
                    x2={catPos.x}
                    y2={catPos.y}
                    stroke={isHighlighted ? '#ffffff' : cluster.accentColor}
                    strokeWidth={isHighlighted ? 1.8 : 0.8}
                    strokeOpacity={isHighlighted ? 0.95 : 0.45}
                    className="transition-all duration-300"
                  />

                  {/* Animated Traveling Photon Sparks */}
                  {isHighlighted && (
                    <circle r="3" fill="#ffffff" filter="url(#branchGlow)">
                      <animateMotion
                        path={path}
                        dur="1.8s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* 6. SECONDARY APPLICATION BRANCHES (From Category Hub to Application Nodes) */}
          {isAppsVisible && (
            <g>
              {appPositions.map(({ app, x, y }) => {
                const cluster = ECOSYSTEM_CLUSTERS[app.clusterId];
                const catPos = clusterPositions[app.clusterId];
                const isSelected = selectedApp?.id === app.id;
                const isHovered = hoveredApp?.id === app.id;
                const isAppActive = isSelected || isHovered;
                const isClusterFiltered = selectedClusterId === 'ALL' || selectedClusterId === app.clusterId;
                const isConnectedToFocused = activeFocusApp?.connections.includes(app.id);

                const branchPath = getBranchPath(catPos.x, catPos.y, x, y);

                return (
                  <g key={`branch-${app.id}`}>
                    {/* Glowing Branch Conduit */}
                    <path
                      d={branchPath}
                      fill="none"
                      stroke={cluster.accentColor}
                      strokeWidth={isAppActive ? 3.5 : isConnectedToFocused ? 2 : 1}
                      strokeOpacity={
                        isAppActive ? 0.9 : isConnectedToFocused ? 0.7 : isClusterFiltered ? 0.28 : 0.08
                      }
                      filter={isAppActive ? 'url(#branchGlow)' : undefined}
                      className="transition-all duration-300"
                    />

                    {/* Traveling Energy Pulse on Active Node */}
                    {isAppActive && (
                      <circle r="2.5" fill="#ffffff" filter="url(#branchGlow)">
                        <animateMotion
                          path={branchPath}
                          dur="1.4s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 7. CROSS-APPLICATION CONNECTIONS */}
          {showConnections && isAppsVisible && (
            <g>
              {appPositions.map(({ app, x, y }) => {
                const isAppFocused = activeFocusApp?.id === app.id;

                return app.connections.map((targetId) => {
                  const targetEntry = appPositions.find((p) => p.app.id === targetId);
                  if (!targetEntry) return null;

                  const isCrossActive = isAppFocused || activeFocusApp?.id === targetId;
                  const crossPath = getBranchPath(x, y, targetEntry.x, targetEntry.y);

                  return (
                    <path
                      key={`cross-${app.id}-${targetId}`}
                      d={crossPath}
                      fill="none"
                      stroke={isCrossActive ? '#06b6d4' : '#ffffff'}
                      strokeWidth={isCrossActive ? 1.6 : 0.4}
                      strokeDasharray={isCrossActive ? 'none' : '3 6'}
                      strokeOpacity={isCrossActive ? 0.85 : 0.08}
                      filter={isCrossActive ? 'url(#branchGlow)' : undefined}
                      className="transition-all duration-300"
                    />
                  );
                });
              })}
            </g>
          )}

          {/* 8. LEVEL 2: APPLICATION SATELLITE MODULE CONDUITS */}
          {showConnections && isModulesVisible && (
            <g>
              {visibleModules.map((mod) => {
                const parentAppEntry = appPositions.find((p) => p.app.id === mod.parentAppId);
                if (!parentAppEntry) return null;

                const modPos = polarToCartesian(mod.angleDeg, R_MODULES);
                const cluster = ECOSYSTEM_CLUSTERS[mod.clusterId];
                const isModActive = selectedModule?.id === mod.id || hoveredModule?.id === mod.id || activeFocusApp?.id === mod.parentAppId;
                const modPath = getBranchPath(parentAppEntry.x, parentAppEntry.y, modPos.x, modPos.y);

                return (
                  <path
                    key={`mod-line-${mod.id}`}
                    d={modPath}
                    fill="none"
                    stroke={cluster.accentColor}
                    strokeWidth={isModActive ? 1.8 : 0.6}
                    strokeDasharray={isModActive ? 'none' : '2 4'}
                    strokeOpacity={isModActive ? 0.8 : 0.2}
                    className="transition-all duration-300"
                  />
                );
              })}
            </g>
          )}

          {/* 9. LEVEL 4: UNIVERSE GATEWAYS TO INTERNAL APPS */}
          {showConnections && isUniverseVisible && (
            <g>
              {UNIVERSE_INTEGRATIONS.map((gateway) => {
                const gwPos = polarToCartesian(gateway.angleDeg, R_UNIVERSE);

                return gateway.connectedAppIds.map((appId) => {
                  const targetEntry = appPositions.find((p) => p.app.id === appId);
                  if (!targetEntry) return null;

                  const isGwActive = selectedIntegration?.id === gateway.id || hoveredIntegration?.id === gateway.id || activeFocusApp?.id === appId;
                  const gwPath = getBranchPath(gwPos.x, gwPos.y, targetEntry.x, targetEntry.y);

                  return (
                    <path
                      key={`gw-con-${gateway.id}-${appId}`}
                      d={gwPath}
                      fill="none"
                      stroke={isGwActive ? '#a855f7' : '#ffffff'}
                      strokeWidth={isGwActive ? 1.8 : 0.5}
                      strokeDasharray={isGwActive ? 'none' : '3 7'}
                      strokeOpacity={isGwActive ? 0.85 : 0.12}
                      className="transition-all duration-300"
                    />
                  );
                });
              })}
            </g>
          )}

          {/* 10. PRIMARY CATEGORY GATEWAY HUBS (Interactive Pods on SVG) */}
          <g>
            {clusters.map((cluster) => {
              const pos = clusterPositions[cluster.id];
              const isSelected = selectedClusterId === cluster.id;
              const isHovered = hoveredClusterId === cluster.id;
              const isParentOfFocused = activeFocusApp?.clusterId === cluster.id;
              const isActive = isSelected || isHovered || isParentOfFocused;

              return (
                <g
                  key={`cat-pod-${cluster.id}`}
                  className="cursor-pointer"
                  onClick={() => {
                    cyberAudio?.playSelectNode();
                    onSelectCluster(isSelected ? 'ALL' : cluster.id);
                  }}
                  onMouseEnter={() => setHoveredClusterId(cluster.id)}
                  onMouseLeave={() => setHoveredClusterId(null)}
                >
                  {/* Category Glow Aura */}
                  {isActive && (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={30}
                      fill={cluster.accentColor}
                      fillOpacity={0.2}
                      filter="url(#coreGlow)"
                    />
                  )}

                  {/* Outer Ring */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={22}
                    fill="#050812"
                    stroke={cluster.accentColor}
                    strokeWidth={isActive ? 2.5 : 1.2}
                    filter={isActive ? 'url(#branchGlow)' : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Inner Accent Dot */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isActive ? 8 : 6}
                    fill={cluster.accentColor}
                    className="transition-all duration-200"
                  />

                  {/* Category Name Label Badge */}
                  <g transform={`translate(${pos.x}, ${pos.y + 34})`}>
                    <rect
                      x="-55"
                      y="-11"
                      width="110"
                      height="22"
                      rx="11"
                      fill="#070a14"
                      stroke={cluster.accentColor}
                      strokeWidth={isActive ? 1.5 : 0.8}
                      strokeOpacity={isActive ? 0.9 : 0.4}
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="Space Grotesk, sans-serif"
                      letterSpacing="0.05em"
                    >
                      {cluster.shortName}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* 11. LEVEL 3: MIDDLE SHARED INFRASTRUCTURE RING NODES */}
          {isInfraVisible && (
            <g>
              {EXPANDED_INFRASTRUCTURE_SERVICES.map((service) => {
                const pos = polarToCartesian(service.angleDeg, R_INFRA);
                const isSelected = selectedService?.id === service.id;
                const isHovered = hoveredService?.id === service.id;
                const isActive = isSelected || isHovered;

                return (
                  <g
                    key={`infra-${service.id}`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      cyberAudio?.playSelectNode();
                      setIsPopupDismissed(false);
                      onSelectService(service);
                    }}
                    onMouseEnter={() => {
                      if (dismissTimerRef.current) {
                        clearTimeout(dismissTimerRef.current);
                        dismissTimerRef.current = null;
                      }
                      setIsPopupDismissed(false);
                      setHoveredService(service);
                    }}
                    onMouseLeave={() => {
                      setHoveredService(null);
                      if (!isHoveringPopupRef.current && !pinnedAppRef.current) {
                        dismissTimerRef.current = setTimeout(() => {
                          if (!isHoveringPopupRef.current && !pinnedAppRef.current) {
                            setHoveredService(null);
                          }
                        }, 700);
                      }
                    }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 18 : 14}
                      fill="#070b16"
                      stroke={isActive ? '#06b6d4' : '#334155'}
                      strokeWidth={isActive ? 2 : 1}
                      filter={isActive ? 'url(#branchGlow)' : undefined}
                      className="transition-all duration-200"
                    />
                    <circle cx={pos.x} cy={pos.y} r="4" fill="#06b6d4" />
                    <text
                      x={pos.x}
                      y={pos.y + 24}
                      textAnchor="middle"
                      fill={isActive ? '#ffffff' : '#94a3b8'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      {service.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 12. LEVEL 1: APPLICATION NODES (GLOWING CAPSULES) */}
          {isAppsVisible && (
            <g>
              {appPositions.map(({ app, x, y }) => {
                const cluster = ECOSYSTEM_CLUSTERS[app.clusterId];
                const isMatchCluster = selectedClusterId === 'ALL' || selectedClusterId === app.clusterId;
                const isSelected = selectedApp?.id === app.id;
                const isHovered = hoveredApp?.id === app.id;
                const isActive = isSelected || isHovered;
                const isConnectedToFocused = activeFocusApp?.connections.includes(app.id);

                return (
                  <g
                    key={`node-app-${app.id}`}
                    className={`cursor-pointer transition-all duration-300 ${
                      !isMatchCluster ? 'opacity-20 pointer-events-none' : 'opacity-100'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      cyberAudio?.playSelectNode();
                      setIsPopupDismissed(false);
                      setPinnedApp(app);
                      onSelectApp(app);
                    }}
                    onMouseEnter={() => {
                      if (dismissTimerRef.current) {
                        clearTimeout(dismissTimerRef.current);
                        dismissTimerRef.current = null;
                      }
                      setIsPopupDismissed(false);
                      setHoveredApp(app);
                    }}
                    onMouseLeave={() => {
                      setHoveredApp(null);
                      if (!pinnedAppRef.current && selectedAppRef.current?.id !== app.id) {
                        dismissTimerRef.current = setTimeout(() => {
                          if (!isHoveringPopupRef.current && !pinnedAppRef.current) {
                            setHoveredApp(null);
                          }
                        }, 700);
                      }
                    }}
                  >
                    {/* Active Halo */}
                    {isActive && (
                      <circle
                        cx={x}
                        cy={y}
                        r={34}
                        fill={cluster.accentColor}
                        fillOpacity={0.25}
                        filter="url(#coreGlow)"
                      />
                    )}

                    {/* App Capsule Background */}
                    <rect
                      x={x - 48}
                      y={y - 18}
                      width="96"
                      height="36"
                      rx="18"
                      fill="#060913"
                      stroke={isActive ? cluster.accentColor : isConnectedToFocused ? '#06b6d4' : '#1e293b'}
                      strokeWidth={isActive ? 2.5 : isConnectedToFocused ? 1.5 : 1}
                      filter={isActive ? 'url(#branchGlow)' : undefined}
                      className="transition-all duration-200"
                    />

                    {/* Inner Accent Icon Box */}
                    <rect
                      x={x - 42}
                      y={y - 12}
                      width="24"
                      height="24"
                      rx="12"
                      fill={`${cluster.accentColor}25`}
                      stroke={cluster.accentColor}
                      strokeWidth="1"
                    />

                    {/* Active Pulse Dot inside Icon */}
                    <circle cx={x - 30} cy={y} r="4" fill={cluster.accentColor} />

                    {/* App Short Name */}
                    <text
                      x={x - 12}
                      y={y - 1}
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="bold"
                      fontFamily="Space Grotesk, sans-serif"
                    >
                      {app.shortName}
                    </text>

                    {/* Live Status Subtitle */}
                    <text
                      x={x - 12}
                      y={y + 10}
                      fill={cluster.accentColor}
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="600"
                      letterSpacing="0.04em"
                    >
                      {app.status === 'Live' ? '● LIVE' : '○ DEV'}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 13. LEVEL 2: SATELLITE MODULES */}
          {isModulesVisible && (
            <g>
              {visibleModules.map((mod) => {
                const pos = polarToCartesian(mod.angleDeg, R_MODULES);
                const cluster = ECOSYSTEM_CLUSTERS[mod.clusterId];
                const isSelected = selectedModule?.id === mod.id;
                const isHovered = hoveredModule?.id === mod.id;
                const isActive = isSelected || isHovered;

                return (
                  <g
                    key={`mod-${mod.id}`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      cyberAudio?.playSelectNode();
                      setIsPopupDismissed(false);
                      onSelectModule(mod);
                    }}
                    onMouseEnter={() => {
                      if (dismissTimerRef.current) {
                        clearTimeout(dismissTimerRef.current);
                        dismissTimerRef.current = null;
                      }
                      setIsPopupDismissed(false);
                      setHoveredModule(mod);
                    }}
                    onMouseLeave={() => {
                      setHoveredModule(null);
                      if (!isHoveringPopupRef.current && !pinnedAppRef.current) {
                        dismissTimerRef.current = setTimeout(() => {
                          if (!isHoveringPopupRef.current && !pinnedAppRef.current) {
                            setHoveredModule(null);
                          }
                        }, 700);
                      }
                    }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 14 : 10}
                      fill="#050811"
                      stroke={cluster.accentColor}
                      strokeWidth={isActive ? 2 : 1}
                      filter={isActive ? 'url(#branchGlow)' : undefined}
                      className="transition-all duration-200"
                    />
                    <circle cx={pos.x} cy={pos.y} r="3" fill={cluster.accentColor} />
                    {showLabels && (
                      <text
                        x={pos.x}
                        y={pos.y + 18}
                        textAnchor="middle"
                        fill="#cbd5e1"
                        fontSize="7.5"
                        fontFamily="monospace"
                      >
                        {mod.shortName}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 14. LEVEL 4: UNIVERSE GATEWAYS & PROTOCOL OUTPOSTS */}
          {isUniverseVisible && (
            <g>
              {UNIVERSE_INTEGRATIONS.map((gateway) => {
                const pos = polarToCartesian(gateway.angleDeg, R_UNIVERSE);
                const isSelected = selectedIntegration?.id === gateway.id;
                const isHovered = hoveredIntegration?.id === gateway.id;
                const isActive = isSelected || isHovered;

                return (
                  <g
                    key={`gw-node-${gateway.id}`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      cyberAudio?.playSelectNode();
                      setIsPopupDismissed(false);
                      onSelectIntegration(gateway);
                    }}
                    onMouseEnter={() => {
                      if (dismissTimerRef.current) {
                        clearTimeout(dismissTimerRef.current);
                        dismissTimerRef.current = null;
                      }
                      setIsPopupDismissed(false);
                      setHoveredIntegration(gateway);
                    }}
                    onMouseLeave={() => {
                      setHoveredIntegration(null);
                      if (!isHoveringPopupRef.current && !pinnedAppRef.current) {
                        dismissTimerRef.current = setTimeout(() => {
                          if (!isHoveringPopupRef.current && !pinnedAppRef.current) {
                            setHoveredIntegration(null);
                          }
                        }, 700);
                      }
                    }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isActive ? 20 : 15}
                      fill="#070a16"
                      stroke="#a855f7"
                      strokeWidth={isActive ? 2.5 : 1.2}
                      filter={isActive ? 'url(#coreGlow)' : undefined}
                      className="transition-all duration-200"
                    />
                    <circle cx={pos.x} cy={pos.y} r="5" fill="#a855f7" />
                    {showLabels && (
                      <text
                        x={pos.x}
                        y={pos.y + 26}
                        textAnchor="middle"
                        fill="#e9d5ff"
                        fontSize="8.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {gateway.name.split(' ')[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 15. CENTRAL NEXUS CORE (ALWAYS VISIBLE & LUMINOUS) */}
          <g
            className="cursor-pointer"
            onClick={() => {
              cyberAudio?.playSelectNode();
              onSelectCluster('ALL');
            }}
          >
            {/* Ambient Core Radial Halo */}
            <circle
              cx={CX}
              cy={CY}
              r={R_CORE + 16}
              fill="url(#centerHubGrad)"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="6 8"
              opacity="0.8"
              filter="url(#coreGlow)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${CX} ${CY}`}
                to={`360 ${CX} ${CY}`}
                dur="45s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Inner Core Disc */}
            <circle
              cx={CX}
              cy={CY}
              r={R_CORE}
              fill="url(#centerHubGrad)"
              stroke="#06b6d4"
              strokeWidth="2.5"
            />

            {/* Glowing Center Badge */}
            <circle cx={CX} cy={CY - 14} r="16" fill="#04060b" stroke="#06b6d4" strokeWidth="1.5" />
            <circle cx={CX} cy={CY - 14} r="6" fill="#06b6d4" filter="url(#branchGlow)" />

            {/* Core Titles */}
            <text
              x={CX}
              y={CY + 12}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="14"
              fontWeight="900"
              fontFamily="Space Grotesk, sans-serif"
              letterSpacing="0.12em"
            >
              ZENVITRA
            </text>

            <text
              x={CX}
              y={CY + 26}
              textAnchor="middle"
              fill="#06b6d4"
              fontSize="9.5"
              fontWeight="bold"
              fontFamily="monospace"
              letterSpacing="0.15em"
            >
              NEXUS CORE
            </text>

            <text
              x={CX}
              y={CY + 39}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="8"
              fontFamily="var(--font-playfair), 'Playfair Display', serif"
              fontStyle="italic"
              letterSpacing="0.06em"
            >
              By Youth. For Youth.
            </text>
          </g>
        </svg>
      </div>

      {/* 4. OVERLAYS & HUD CONTROLS */}
      {/* Top Left: Active Exploration Level HUD */}
      <div className="absolute top-5 left-5 pointer-events-none z-20 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-xl flex items-center gap-2.5 text-xs font-mono shadow-xl">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-neutral-400">LAYER:</span>
          <span className="font-bold text-cyan-300">{currentLevel}</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-300 font-semibold">{Math.round(zoomLevel * 100)}%</span>
        </div>
      </div>

      {/* Top Right: Reset View & Quick Zoom Controls */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            cyberAudio?.playSelectNode();
            setPan({ x: 0, y: 0 });
            onZoomChange(1.25);
            onSelectCluster('ALL');
          }}
          className="px-3 py-1.5 rounded-2xl bg-black/80 hover:bg-white/10 border border-white/15 hover:border-white/30 backdrop-blur-xl text-neutral-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-xl cursor-pointer"
          title="Reset canvas camera and zoom"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Reset View</span>
        </button>

        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="px-3 py-1.5 rounded-2xl bg-black/80 hover:bg-white/10 border border-white/15 hover:border-white/30 backdrop-blur-xl text-neutral-300 hover:text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-xl cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen View'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Bottom Center: Interactive Floating App HUD / Tooltip */}
      <AnimatePresence>
        {activeCardItem && !isPopupDismissed && (
          <motion.div
            key={`popup-${activeCardItem.id}`}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.16 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-lg px-4 pointer-events-none"
          >
            <div
              onMouseEnter={() => {
                isHoveringPopupRef.current = true;
                if (dismissTimerRef.current) {
                  clearTimeout(dismissTimerRef.current);
                  dismissTimerRef.current = null;
                }
              }}
              onMouseLeave={() => {
                isHoveringPopupRef.current = false;
                if (!pinnedAppRef.current && !selectedAppRef.current) {
                  dismissTimerRef.current = setTimeout(() => {
                    if (!isHoveringPopupRef.current && !pinnedAppRef.current) {
                      setHoveredApp(null);
                      setHoveredModule(null);
                      setHoveredService(null);
                      setHoveredIntegration(null);
                    }
                  }, 400);
                }
              }}
              className="p-3.5 sm:p-4 rounded-3xl bg-[#070b16]/98 border border-cyan-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.98),0_0_35px_rgba(6,182,212,0.18)] backdrop-blur-2xl flex items-center justify-between gap-3 sm:gap-4 pointer-events-auto"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg"
                  style={{
                    backgroundColor: `${activeCardItem.accentColor}20`,
                    borderColor: `${activeCardItem.accentColor}50`,
                    color: activeCardItem.accentColor,
                  }}
                >
                  <DynamicZenIcon name={activeCardItem.iconName} className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display font-extrabold text-xs sm:text-sm text-white truncate">
                      {activeCardItem.name}
                    </h4>
                    <span
                      className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0"
                      style={{
                        backgroundColor: `${activeCardItem.accentColor}15`,
                        borderColor: `${activeCardItem.accentColor}40`,
                        color: activeCardItem.accentColor,
                      }}
                    >
                      {activeCardItem.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 font-sans truncate mt-0.5">
                    {activeCardItem.tagline}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Launch / Status + Close X Button */}
              <div className="flex items-center gap-2 shrink-0">
                {activeCardItem.route ? (
                  <Link
                    href={activeCardItem.route}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.2)] cursor-pointer"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-[10px] font-mono text-neutral-500 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                    {activeCardItem.status || 'In Dev'}
                  </span>
                )}

                {/* Explicit Close X Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClosePopup();
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-white transition-all cursor-pointer group"
                  title="Close popup"
                  aria-label="Close popup"
                >
                  <X className="w-4 h-4 group-hover:scale-110 transition-transform text-neutral-300 group-hover:text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

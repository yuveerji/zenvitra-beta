'use client';

import React, { useState, useEffect, useMemo, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Cpu,
  Layers,
  ShieldCheck,
  Radio,
  ArrowRight,
  Globe2,
  Database,
  Lock,
  RotateCcw,
  List,
  Compass,
  Zap,
  Info,
  Volume2,
  VolumeX,
  Orbit,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ZenAppItem,
  SharedPlatformService,
  ZenAppModule,
  UniverseIntegration,
  ExplorationLevel,
  EcosystemClusterId,
  AppDevelopmentStatus,
  ECOSYSTEM_CLUSTERS,
  SHARED_PLATFORM_SERVICES,
  ZEN_APPS_REGISTRY,
  ZEN_APP_MODULES,
  UNIVERSE_INTEGRATIONS
} from '@/lib/zenAppsRegistry';
import { cyberAudio } from '@/lib/cyberAudioEngine';
import { CircularEcosystemMap } from '@/components/apps/CircularEcosystemMap';
import { ApplicationListView } from '@/components/apps/ApplicationListView';
import { ApplicationDetailsPanel } from '@/components/apps/ApplicationDetailsPanel';
import { EcosystemToolbar } from '@/components/apps/EcosystemToolbar';
import { useAuth } from '@/context/AuthContext';
import { SignInPromptModal } from '@/components/auth/SignInPromptModal';

function AppsEcosystemContent() {
  const { isAuthenticated, isMockMode, profile } = useAuth();
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    const hasLoggedIn = isAuthenticated || isMockMode || Boolean(profile?.id);
    if (!hasLoggedIn) {
      try {
        const dismissed = sessionStorage.getItem('zenvitra_signin_prompt_dismissed_apps');
        if (!dismissed) {
          const timer = setTimeout(() => {
            setShowSignInModal(true);
          }, 600);
          return () => clearTimeout(timer);
        }
      } catch {
        setShowSignInModal(true);
      }
    }
  }, [isAuthenticated, isMockMode, profile]);

  const handleCloseSignInModal = () => {
    setShowSignInModal(false);
    try {
      sessionStorage.setItem('zenvitra_signin_prompt_dismissed_apps', 'true');
    } catch {}
  };

  const searchParams = useSearchParams();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClusterId, setSelectedClusterId] = useState<EcosystemClusterId | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<AppDevelopmentStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Progressive Zoom & Reveal engine state
  const [zoomLevel, setZoomLevel] = useState<number>(1.25);
  const [currentLevel, setCurrentLevel] = useState<ExplorationLevel>('APPS');
  const [showConnections, setShowConnections] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Selection states across all 4 exploration tiers
  const [selectedApp, setSelectedApp] = useState<ZenAppItem | null>(null);
  const [selectedModule, setSelectedModule] = useState<ZenAppModule | null>(null);
  const [selectedService, setSelectedService] = useState<SharedPlatformService | null>(null);
  const [selectedIntegration, setSelectedIntegration] = useState<UniverseIntegration | null>(null);

  // Cyber Audio states
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.4);
  const [ambientEnabled, setAmbientEnabled] = useState(false);

  // Fullscreen Stage View State
  const stageRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync initial audio settings from engine
  useEffect(() => {
    if (cyberAudio) {
      setSoundVolume(cyberAudio.getVolume());
      setAmbientEnabled(cyberAudio.getIsAmbientOn());
    }
  }, []);

  // Listen to browser fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Sync with URL query params on initial load
  useEffect(() => {
    const appParam = searchParams.get('app');
    const clusterParam = searchParams.get('cluster');
    const levelParam = searchParams.get('level');

    if (appParam) {
      const matched = ZEN_APPS_REGISTRY.find(
        (a) => a.id.toLowerCase() === appParam.toLowerCase() || a.shortName.toLowerCase() === appParam.toLowerCase()
      );
      if (matched) {
        setSelectedApp(matched);
        setSelectedModule(null);
        setSelectedService(null);
        setSelectedIntegration(null);
      }
    }

    if (clusterParam && clusterParam in ECOSYSTEM_CLUSTERS) {
      setSelectedClusterId(clusterParam as EcosystemClusterId);
    }

    if (levelParam) {
      const upper = levelParam.toUpperCase() as ExplorationLevel;
      if (['CORE', 'APPS', 'MODULES', 'INFRASTRUCTURE', 'UNIVERSE'].includes(upper)) {
        handleSelectLevel(upper);
      }
    }
  }, [searchParams]);

  // Audio Handlers
  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    cyberAudio?.setEnabled(nextState);
  };

  const handleVolumeChange = (vol: number) => {
    setSoundVolume(vol);
    cyberAudio?.setVolume(vol);
  };

  const handleToggleAmbient = () => {
    const nextAmbient = !ambientEnabled;
    setAmbientEnabled(nextAmbient);
    cyberAudio?.setAmbientOn(nextAmbient);
  };

  // Fullscreen Stage View Handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement && !isFullscreen) {
      if (stageRef.current?.requestFullscreen) {
        stageRef.current.requestFullscreen().then(() => {
          setIsFullscreen(true);
        }).catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(() => {
          setIsFullscreen(false);
        });
      } else {
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName;
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') {
        return;
      }

      if (e.key === 'Escape') {
        if (selectedApp || selectedModule || selectedService || selectedIntegration) {
          setSelectedApp(null);
          setSelectedModule(null);
          setSelectedService(null);
          setSelectedIntegration(null);
        } else if (isFullscreen) {
          handleToggleFullscreen();
        } else if (selectedClusterId !== 'ALL' || searchQuery) {
          setSelectedClusterId('ALL');
          setSearchQuery('');
        }
      } else if (e.key === 'm' || e.key === 'M') {
        // Toggle sound with 'm'
        handleToggleSound();
      } else if (e.key === 'f' || e.key === 'F') {
        // Toggle fullscreen with 'f'
        e.preventDefault();
        handleToggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedApp, selectedModule, selectedService, selectedIntegration, selectedClusterId, searchQuery, soundEnabled, isFullscreen]);

  // Direct Level Selection
  const handleSelectLevel = (level: ExplorationLevel) => {
    setCurrentLevel(level);
    const targetZooms: Record<ExplorationLevel, number> = {
      CORE: 1.5,
      APPS: 1.25,
      MODULES: 1.0,
      INFRASTRUCTURE: 0.8,
      UNIVERSE: 0.6,
    };
    const nextZoom = targetZooms[level];
    setZoomLevel(nextZoom);

    // Audio cue
    if (level === 'UNIVERSE') {
      cyberAudio?.playDeepestLayer();
    } else {
      const idxMap: Record<ExplorationLevel, number> = {
        CORE: 0,
        APPS: 1,
        MODULES: 2,
        INFRASTRUCTURE: 3,
        UNIVERSE: 4,
      };
      cyberAudio?.playLayerReveal(idxMap[level]);
    }
  };

  // Filtered applications
  const filteredApps = useMemo(() => {
    return ZEN_APPS_REGISTRY.filter((app) => {
      // Cluster filter
      if (selectedClusterId !== 'ALL' && app.clusterId !== selectedClusterId) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'ALL' && app.status !== selectedStatus) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = app.name.toLowerCase().includes(q) || app.shortName.toLowerCase().includes(q);
        const matchesTagline = app.tagline.toLowerCase().includes(q);
        const matchesDesc = app.description.toLowerCase().includes(q);
        const matchesCap = app.capabilities.some((c) => c.toLowerCase().includes(q));
        const matchesCluster = ECOSYSTEM_CLUSTERS[app.clusterId].name.toLowerCase().includes(q);
        return matchesName || matchesTagline || matchesDesc || matchesCap || matchesCluster;
      }
      return true;
    });
  }, [selectedClusterId, selectedStatus, searchQuery]);

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => {
      const next = Math.min(prev + 0.12, 1.8);
      cyberAudio?.playZoomSweep('in');
      return Number(next.toFixed(2));
    });
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.12, 0.5);
      cyberAudio?.playZoomSweep('out');
      return Number(next.toFixed(2));
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1.25);
    setCurrentLevel('APPS');
    cyberAudio?.playActivationTone();
  };

  const clusters = Object.values(ECOSYSTEM_CLUSTERS);

  return (
    <div className="min-h-screen bg-[#04060a] text-white flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 flex flex-col space-y-6 sm:space-y-8">
        {/* TOP BRAND HEADER */}
        <section className="relative text-left space-y-3 sm:space-y-4 pt-2">
          {/* Ambient header glow */}
          <div className="absolute top-0 left-1/4 -translate-x-1/2 w-80 h-32 bg-cyan-500/10 blur-[80px] pointer-events-none rounded-full" />
          <div className="absolute top-0 right-1/4 translate-x-1/2 w-80 h-32 bg-purple-500/10 blur-[80px] pointer-events-none rounded-full" />

          {/* Breadcrumb / Category Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>BY YOUTH. FOR YOUTH.</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-widest">
              <Cpu className="w-3 h-3 text-purple-400 animate-pulse" />
              <span>NEXUS CORE &bull; INFINITE CYBER EXPLORATION</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px] font-bold uppercase">
              <Orbit className="w-3 h-3 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>LAYER: {currentLevel}</span>
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-2">
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase"
              style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
            >
              ZEN.APPS <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 tracking-normal">Cyber Universe</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed font-sans">
              <span className="font-serif italic text-white/90 font-normal">One ecosystem. Connected experiences. One youth platform.</span> Scroll or zoom out to progressively reveal deeper layers:
              from the central <strong>CORE</strong> to <strong>APPS</strong>, internal <strong>MODULES</strong>, shared <strong>INFRASTRUCTURE</strong>, and the outer <strong>UNIVERSE</strong> constellation.
            </p>
          </div>
        </section>

        {/* INTERACTIVE CONTROLS TOOLBAR */}
        <section className="w-full">
          <EcosystemToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedClusterId={selectedClusterId}
            onSelectCluster={(cid) => {
              setSelectedClusterId(cid);
              if (cid !== 'ALL') {
                if (selectedApp && selectedApp.clusterId !== cid) {
                  setSelectedApp(null);
                }
                if (selectedModule && selectedModule.clusterId !== cid) {
                  setSelectedModule(null);
                }
              }
            }}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            viewMode={viewMode}
            onToggleViewMode={() => setViewMode((prev) => (prev === 'map' ? 'list' : 'map'))}
            showConnections={showConnections}
            onToggleConnections={() => setShowConnections((prev) => !prev)}
            showLabels={showLabels}
            onToggleLabels={() => setShowLabels((prev) => !prev)}
            zoomLevel={zoomLevel}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetZoom={handleResetZoom}
            totalAppsCount={ZEN_APPS_REGISTRY.length}
            filteredAppsCount={filteredApps.length}
            currentLevel={currentLevel}
            onSelectLevel={handleSelectLevel}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            soundVolume={soundVolume}
            onVolumeChange={handleVolumeChange}
            ambientEnabled={ambientEnabled}
            onToggleAmbient={handleToggleAmbient}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </section>

        {/* MAIN VISUALIZATION STAGE */}
        <section
          ref={stageRef}
          className={`relative w-full transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-[100] w-screen h-screen bg-[#03050a] flex flex-col p-4 sm:p-6 overflow-hidden'
              : 'rounded-3xl bg-[#060810]/90 border border-white/10 p-3 sm:p-6 lg:p-8 overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.85)] flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 min-h-[720px]'
          }`}
        >
          {/* Ambient Stage Lights */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[180px] pointer-events-none" />

          {/* Fullscreen Cyber HUD Bar */}
          {isFullscreen && (
            <div className="relative z-50 w-full flex items-center justify-between gap-4 pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                  <span className="font-display font-black text-sm tracking-widest text-white uppercase">
                    ZENVITRA
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30">
                    ZEN.APPS
                  </span>
                </div>
                <span className="hidden md:inline text-xs font-mono text-neutral-400">
                  &bull; Radial Cyber Mind Map
                </span>
              </div>

              {/* Quick Level Pills in Fullscreen HUD */}
              <div className="hidden sm:flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1 text-xs font-mono">
                {[
                  { id: 'CORE', label: 'Core', num: 'L0' },
                  { id: 'APPS', label: 'Apps', num: 'L1' },
                  { id: 'MODULES', label: 'Modules', num: 'L2' },
                  { id: 'INFRASTRUCTURE', label: 'Infra', num: 'L3' },
                  { id: 'UNIVERSE', label: 'Universe', num: 'L4' },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => handleSelectLevel(lvl.id as ExplorationLevel)}
                    className={`px-2.5 py-1 rounded-xl transition text-[11px] font-bold ${
                      currentLevel === lvl.id
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lvl.num} {lvl.label}
                  </button>
                ))}
              </div>

              {/* Fullscreen Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleFullscreen}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-medium text-white flex items-center gap-1.5 transition cursor-pointer shadow-lg"
                  title="Exit Fullscreen (Esc)"
                >
                  <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Exit Fullscreen</span>
                  <kbd className="hidden lg:inline text-[9px] px-1 py-0.5 rounded bg-black/40 text-neutral-400">Esc</kbd>
                </button>
              </div>
            </div>
          )}

          {/* Center Stage: Circular Map or Application List */}
          <div className="relative w-full flex-1 min-w-0 h-full flex flex-col items-center justify-center">
            {viewMode === 'map' ? (
              <div className="w-full h-full flex-1 min-w-0 flex items-center justify-center py-2 sm:py-6 overflow-hidden">
                <CircularEcosystemMap
                  apps={filteredApps}
                  selectedApp={selectedApp}
                  onSelectApp={(app) => {
                    setSelectedApp(app);
                    setSelectedModule(null);
                    setSelectedService(null);
                    setSelectedIntegration(null);
                  }}
                  selectedModule={selectedModule}
                  onSelectModule={(mod) => {
                    setSelectedModule(mod);
                    setSelectedApp(null);
                    setSelectedService(null);
                    setSelectedIntegration(null);
                  }}
                  selectedService={selectedService}
                  onSelectService={(service) => {
                    setSelectedService(service);
                    setSelectedApp(null);
                    setSelectedModule(null);
                    setSelectedIntegration(null);
                  }}
                  selectedIntegration={selectedIntegration}
                  onSelectIntegration={(gateway) => {
                    setSelectedIntegration(gateway);
                    setSelectedApp(null);
                    setSelectedModule(null);
                    setSelectedService(null);
                  }}
                  selectedClusterId={selectedClusterId}
                  onSelectCluster={(cid) => {
                    setSelectedClusterId(cid);
                    if (cid === 'ALL') {
                      setSelectedApp(null);
                      setSelectedModule(null);
                      setSelectedService(null);
                      setSelectedIntegration(null);
                    }
                  }}
                  showConnections={showConnections}
                  showLabels={showLabels}
                  zoomLevel={zoomLevel}
                  onZoomChange={(newZoom) => setZoomLevel(newZoom)}
                  currentLevel={currentLevel}
                  onLevelChange={(newLevel) => setCurrentLevel(newLevel)}
                  isFullscreen={isFullscreen}
                  onToggleFullscreen={handleToggleFullscreen}
                />
              </div>
            ) : (
              <div className="w-full">
                <ApplicationListView
                  apps={filteredApps}
                  selectedApp={selectedApp}
                  onSelectApp={(app) => {
                    setSelectedApp(app);
                    setSelectedModule(null);
                    setSelectedService(null);
                    setSelectedIntegration(null);
                  }}
                  selectedClusterId={selectedClusterId}
                />
              </div>
            )}
          </div>

          {/* Slide-out / Side Details Panel */}
          <AnimatePresence>
            {(selectedApp || selectedModule || selectedService || selectedIntegration) && (
              <div
                className={
                  isFullscreen
                    ? "absolute right-4 sm:right-6 top-16 bottom-6 w-full max-w-[380px] xl:max-w-[420px] shrink-0 z-50 flex flex-col pointer-events-auto"
                    : "w-full lg:w-[360px] xl:w-[400px] shrink-0 sticky top-28 z-40"
                }
              >
                <ApplicationDetailsPanel
                  selectedApp={selectedApp}
                  selectedModule={selectedModule}
                  selectedService={selectedService}
                  selectedIntegration={selectedIntegration}
                  onClose={() => {
                    setSelectedApp(null);
                    setSelectedModule(null);
                    setSelectedService(null);
                    setSelectedIntegration(null);
                  }}
                  onSelectApp={(app) => {
                    setSelectedApp(app);
                    setSelectedModule(null);
                    setSelectedService(null);
                    setSelectedIntegration(null);
                  }}
                  onSelectModule={(mod) => {
                    setSelectedModule(mod);
                    setSelectedApp(null);
                    setSelectedService(null);
                    setSelectedIntegration(null);
                  }}
                  onSelectIntegration={(gateway) => {
                    setSelectedIntegration(gateway);
                    setSelectedApp(null);
                    setSelectedModule(null);
                    setSelectedService(null);
                  }}
                  onHighlightConnections={(appId) => {
                    const found = ZEN_APPS_REGISTRY.find((a) => a.id === appId);
                    if (found) {
                      setSelectedApp(found);
                      setSelectedModule(null);
                      setSelectedService(null);
                      setSelectedIntegration(null);
                    }
                  }}
                />
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* BOTTOM METRICS & ARCHITECTURAL STATISTICS */}
        <section className="w-full space-y-4 pt-2">
          {/* 4 Architectural Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all space-y-1 shadow-lg text-left">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-cyan-400">
                  PLATFORM SCALE
                </span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                50+ Nodes
              </div>
              <p className="text-[11px] font-mono text-neutral-400">
                {ZEN_APPS_REGISTRY.length} Apps &bull; {ZEN_APP_MODULES.length} Internal Modules
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all space-y-1 shadow-lg text-left">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-400">
                  RADIAL SECTORS
                </span>
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                7 Clusters
              </div>
              <p className="text-[11px] font-mono text-neutral-400">
                Distributed 360&deg; geometry
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all space-y-1 shadow-lg text-left">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-purple-400">
                  UNIVERSE MESH
                </span>
                <Orbit className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                5 Reveal Tiers
              </div>
              <p className="text-[11px] font-mono text-neutral-400">
                Core &bull; Apps &bull; Modules &bull; Infra &bull; Universe
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-amber-500/40 transition-all space-y-1 shadow-lg text-left">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-400">
                  AUTHENTICATION MESH
                </span>
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                ZEN.AUTH
              </div>
              <p className="text-[11px] font-mono text-neutral-400">
                Sovereign cryptographic mesh
              </p>
            </div>
          </div>

          {/* Cluster Legend Ribbon */}
          <div className="p-4 rounded-2xl bg-[#080b12] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              CLUSTER LEGEND
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {clusters.map((cluster) => {
                const isSelected = selectedClusterId === cluster.id;
                return (
                  <button
                    key={cluster.id}
                    type="button"
                    onClick={() =>
                      setSelectedClusterId((prev) => (prev === cluster.id ? 'ALL' : cluster.id))
                    }
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/20 text-white font-bold shadow-md'
                        : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/10 border-white/10'
                    }`}
                    style={{
                      borderColor: isSelected ? cluster.accentColor : undefined,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: cluster.accentColor }}
                    />
                    <span>{cluster.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedClusterId('ALL');
                setSelectedStatus('ALL');
                setSearchQuery('');
                setSelectedApp(null);
                setSelectedModule(null);
                setSelectedService(null);
                setSelectedIntegration(null);
                setZoomLevel(1.25);
                setCurrentLevel('APPS');
              }}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 cursor-pointer font-bold"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        </section>
      </main>

      <SignInPromptModal
        isOpen={showSignInModal}
        onClose={handleCloseSignInModal}
        feature="apps"
      />

      <Footer />
    </div>
  );
}

export default function AppsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#04060a] flex items-center justify-center text-white font-mono text-sm">
          <div className="flex items-center gap-3">
            <Cpu className="w-5 h-5 text-cyan-400 animate-spin" />
            <span>INITIALIZING ZEN.APPS ECOSYSTEM MESH...</span>
          </div>
        </div>
      }
    >
      <AppsEcosystemContent />
    </Suspense>
  );
}

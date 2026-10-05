'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Camera, 
  Sparkles, 
  MapPin, 
  Clock, 
  Radio, 
  Users, 
  Flame, 
  Send, 
  X, 
  RefreshCw, 
  Heart, 
  ShieldCheck, 
  Zap, 
  Check, 
  Eye, 
  Compass, 
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Upload,
  Wand2,
  Trash2,
  Sliders,
  Maximize2,
  Globe
} from 'lucide-react';
import { ZenGlimpse, INITIAL_GLIMPSES } from '@/types/glimpse';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { MediaStudioModal } from '@/components/creator/MediaStudioModal';
import { ZenGoogleRadarMap, RadarMapMarker } from '@/components/maps/ZenGoogleRadarMap';

const LOCATION_STAMPS = [
  'Global Civic Commons',
  'Geneva Diplomatic Enclave',
  'UNSC Chamber Floor',
  'Innovation & Research Lab',
  'City Youth Assembly',
  'Digital Commons Terminal',
  'Campus Secretariat Hub'
];

const LOCATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Global Civic Commons': { lat: 28.6139, lng: 77.2090 },
  'Geneva Diplomatic Enclave': { lat: 46.2263, lng: 6.1408 },
  'UNSC Chamber Floor': { lat: 40.7499, lng: -73.9674 },
  'Innovation & Research Lab': { lat: 12.9716, lng: 77.5946 },
  'City Youth Assembly': { lat: 51.5074, lng: -0.1278 },
  'Digital Commons Terminal': { lat: 37.7749, lng: -122.4194 },
  'Campus Secretariat Hub': { lat: 1.3521, lng: 103.8198 },
};

const LS_GLIMPSES = 'zenvitra_glimpses_v2';

export function ZenGlimpseApp() {
  const { currentUserName, currentUserUsername } = useZenPulse();

  const [activeTrack, setActiveTrack] = useState<'community' | 'radar'>('radar');
  const [glimpseViewMode, setGlimpseViewMode] = useState<'grid' | 'radar_map'>('grid');
  const [glimpses, setGlimpses] = useState<ZenGlimpse[]>(INITIAL_GLIMPSES);
  
  // Camera & Capture State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(LOCATION_STAMPS[0]);
  const [selfDestructHours, setSelfDestructHours] = useState<1 | 6 | 12 | 24>(24);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const glimpseFileInputRef = useRef<HTMLInputElement>(null);

  // Load persisted glimpses on mount & scrub any legacy seeded mock items
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_GLIMPSES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const cleaned = parsed.filter((g: any) => g && g.id && !String(g.id).startsWith('glimpse_init_'));
          setGlimpses(cleaned);
          localStorage.setItem(LS_GLIMPSES, JSON.stringify(cleaned));
          return;
        }
      }
      setGlimpses([]);
      localStorage.setItem(LS_GLIMPSES, JSON.stringify([]));
    } catch {}
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setCapturedImage(loadEvt.target.result as string);
          setCameraError(null);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [postTrack, setPostTrack] = useState<'community' | 'radar'>('radar');
  
  // Active Glimpse Viewer Modal
  const [activeGlimpseIndex, setActiveGlimpseIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Filtered Glimpses by Track
  const filteredGlimpses = glimpses.filter((g) => g.track === activeTrack);

  // Start webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1350 } } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Webcam API not supported in this browser. Please upload a photo.');
        setIsCameraActive(false);
      }
    } catch (err: any) {
      console.warn('Webcam permission denied or unavailable', err);
      setCameraError('Camera access not granted or unavailable. You can upload a photo directly!');
      setIsCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleCapture = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handlePublishGlimpse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedImage) return;

    const expiresDate = new Date();
    expiresDate.setHours(expiresDate.getHours() + selfDestructHours);
    const expiresAtStr = `${selfDestructHours}h remaining`;

    const newGlimpse: ZenGlimpse = {
      id: `glimpse_${Date.now()}`,
      authorId: currentUserUsername || 'you',
      authorName: currentUserName || 'Citizen Node',
      authorUsername: currentUserUsername || 'you',
      authorAvatar: '',
      mediaUrl: capturedImage,
      mediaType: 'photo',
      caption: caption.trim() || 'Visual sovereign dispatch from the floor.',
      locationTag: selectedLocation,
      selfDestructHours: selfDestructHours,
      track: postTrack,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAtStr,
      likes: 0,
      likedBy: [],
    };

    const updated = [newGlimpse, ...glimpses];
    setGlimpses(updated);
    try {
      localStorage.setItem(LS_GLIMPSES, JSON.stringify(updated));
    } catch {}

    // Reset Form
    setCapturedImage(null);
    setCaption('');
    stopCamera();
  };

  const handleLikeGlimpse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const user = currentUserUsername || 'you';
    const updated = glimpses.map((g) => {
      if (g.id !== id) return g;
      const alreadyLiked = g.likedBy?.includes(user);
      const newLikedBy = alreadyLiked 
        ? (g.likedBy || []).filter((u) => u !== user)
        : [...(g.likedBy || []), user];
      return {
        ...g,
        likes: alreadyLiked ? Math.max(0, g.likes - 1) : g.likes + 1,
        likedBy: newLikedBy,
      };
    });
    setGlimpses(updated);
    try {
      localStorage.setItem(LS_GLIMPSES, JSON.stringify(updated));
    } catch {}
  };

  const handleDeleteGlimpse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = glimpses.filter((g) => g.id !== id);
    setGlimpses(updated);
    try {
      localStorage.setItem(LS_GLIMPSES, JSON.stringify(updated));
    } catch {}
    if (activeGlimpseIndex !== null) {
      setActiveGlimpseIndex(null);
    }
  };

  // Auto-progress for full-screen viewer
  useEffect(() => {
    if (activeGlimpseIndex === null) {
      setProgress(0);
      return;
    }

    setProgress(0);
    const intervalTime = 50;
    const duration = 5000;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeGlimpseIndex < filteredGlimpses.length - 1) {
            setActiveGlimpseIndex(activeGlimpseIndex + 1);
            return 0;
          } else {
            setActiveGlimpseIndex(null);
            return 0;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeGlimpseIndex, filteredGlimpses.length]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none font-sans">
      
      {/* ─── TOP HERO HEADER & NAVIGATION ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#080a11]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-sans text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              24H Live Lens
            </span>
            <span className="font-sans text-xs text-neutral-400 font-medium">
              Zero Vanity Filters • Authentic Floor Dispatches
            </span>
          </div>

          <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight flex items-center gap-3">
            <span>ZEN.GLIMPSE</span>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500/20 to-cyan-500/20 border border-white/15 flex items-center justify-center">
              <Camera className="w-4 h-4 text-rose-400" />
            </div>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl font-sans">
            Real-time visual transmissions from active Model UN chambers, secretariats, research labs, and civic chapters.
          </p>
        </div>

        {/* Track Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#090b12] border border-white/10 text-xs font-sans font-semibold shrink-0 shadow-inner">
          <button
            onClick={() => setActiveTrack('radar')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTrack === 'radar' 
                ? 'bg-white text-black shadow-lg shadow-white/10 font-bold' 
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400" />
            <span>Global Radar</span>
          </button>

          <button
            onClick={() => setActiveTrack('community')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTrack === 'community' 
                ? 'bg-white text-black shadow-lg shadow-white/10 font-bold' 
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Campus &amp; Chapters</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN BENTO GRID: CAMERA VIEWFINDER & LIVE RADAR STREAM ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Camera-First Viewfinder (Capture Box) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl bg-[#080a11]/90 border border-white/10 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-pulse" />
                <h3 className="font-display font-extrabold text-sm sm:text-base text-white tracking-wide">
                  SOVEREIGN OPTICAL LENS
                </h3>
              </div>
              <span className="text-[11px] font-sans text-neutral-400 font-medium">RAW DISPATCH</span>
            </div>

            {/* Viewfinder Screen */}
            <div className="relative aspect-[4/5] rounded-3xl bg-black border border-white/15 overflow-hidden flex flex-col items-center justify-center shadow-2xl group/viewfinder">
              
              {/* Corner Optical Crop Brackets */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/40 pointer-events-none z-10" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/40 pointer-events-none z-10" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/40 pointer-events-none z-10" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/40 pointer-events-none z-10" />

              {capturedImage ? (
                /* Image Preview */
                <div className="w-full h-full relative">
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
                    <button
                      onClick={() => { setCapturedImage(null); startCamera(); }}
                      className="p-2.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer transition shadow-md"
                      title="Retake Photo"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : isCameraActive ? (
                /* Active Video Feed */
                <div className="w-full h-full relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Shutter Button */}
                  <div className="absolute bottom-6 flex items-center justify-center z-20">
                    <button
                      onClick={handleCapture}
                      className="relative p-1 rounded-full bg-white/20 hover:scale-105 transition-transform flex items-center justify-center cursor-pointer shadow-2xl active:scale-95 group/shutter"
                      title="Take Snapshot"
                    >
                      <div className="w-16 h-16 rounded-full border-4 border-white bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white shadow-md group-hover/shutter:scale-110 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                /* Standby Lens Trigger */
                <div className="p-8 text-center space-y-4 relative z-10">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500/20 via-purple-500/10 to-transparent border border-white/15 mx-auto flex items-center justify-center text-rose-400 shadow-xl group-hover/viewfinder:scale-105 transition-transform">
                    <Camera className="w-10 h-10" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-display font-extrabold text-base text-white tracking-wide">
                      Activate Sovereign Lens
                    </h4>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto leading-relaxed font-sans">
                      Instant 24-hour visual dispatches from active Model UNs, labs, and campus chapters.
                    </p>
                  </div>

                  {cameraError && (
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-sans text-amber-300 max-w-xs mx-auto">
                      {cameraError}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                    <button
                      onClick={startCamera}
                      className="px-5 py-2.5 rounded-xl bg-white text-black font-sans font-bold text-xs hover:bg-neutral-100 transition cursor-pointer shadow-lg shadow-white/10 flex items-center gap-2 active:scale-95"
                    >
                      <Camera className="w-4 h-4 text-black" />
                      <span>Open Lens</span>
                    </button>

                    <button
                      onClick={() => glimpseFileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white font-sans font-semibold text-xs transition cursor-pointer border border-white/15 flex items-center gap-2 active:scale-95"
                    >
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={glimpseFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Publishing Controls when image is captured */}
            {capturedImage && (
              <form onSubmit={handlePublishGlimpse} className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-sans font-semibold text-neutral-400">Captured Snapshot Ready</span>
                  <button
                    type="button"
                    onClick={() => setIsStudioOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-sans font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-rose-500/30 transition"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply FX &amp; Fonts</span>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Add a live caption from the floor..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-white/15 text-white text-xs font-sans placeholder-neutral-500 focus:outline-none focus:border-cyan-400 shadow-inner"
                />

                <div className="grid grid-cols-2 gap-3">
                  {/* Location Stamp Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-semibold text-neutral-300 uppercase tracking-wide flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span>Campus / Hall</span>
                    </label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-sans focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      {LOCATION_STAMPS.map((loc) => (
                        <option key={loc} value={loc} className="bg-black text-white">{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Self-Destruct Timer */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-sans font-semibold text-neutral-300 uppercase tracking-wide flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Ephemeral Window</span>
                    </label>
                    <select
                      value={selfDestructHours}
                      onChange={(e) => setSelfDestructHours(Number(e.target.value) as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-sans focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value={1} className="bg-black text-white">1 Hour</option>
                      <option value={6} className="bg-black text-white">6 Hours</option>
                      <option value={12} className="bg-black text-white">12 Hours</option>
                      <option value={24} className="bg-black text-white">24 Hours</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-2xl bg-white hover:bg-neutral-100 text-black font-sans font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-white/10 active:scale-[0.98]"
                  >
                    <span>Dispatch Glimpse</span>
                    <Send className="w-4 h-4 text-black" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ─── GLIMPSE FX & TYPOGRAPHY STUDIO MODAL ─── */}
        <MediaStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          initialImage={capturedImage || ''}
          onApply={(processedUrl) => {
            setCapturedImage(processedUrl);
          }}
          aspectRatio="4:5"
        />

        {/* Right Column: Live Glimpses Radar Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-xs font-sans font-semibold text-neutral-300">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>LIVE TRANSMISSIONS • {filteredGlimpses.length} ACTIVE</span>
            </div>

            {/* View Mode Switcher: Grid vs Google Maps Live Radar */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setGlimpseViewMode('grid')}
                className={`px-3 py-1 rounded-xl font-sans font-semibold transition cursor-pointer ${
                  glimpseViewMode === 'grid'
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                📱 Grid
              </button>
              <button
                type="button"
                onClick={() => setGlimpseViewMode('radar_map')}
                className={`px-3 py-1 rounded-xl font-sans font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  glimpseViewMode === 'radar_map'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🗺️ Live Map</span>
              </button>
            </div>
          </div>

          {glimpseViewMode === 'radar_map' ? (
            <ZenGoogleRadarMap
              markers={filteredGlimpses.map((glimpse) => {
                const coords = LOCATION_COORDINATES[glimpse.locationTag] || { lat: 28.6139, lng: 77.2090 };
                return {
                  id: glimpse.id,
                  title: `@${glimpse.authorUsername}`,
                  subtitle: glimpse.caption,
                  locationName: glimpse.locationTag,
                  lat: coords.lat,
                  lng: coords.lng,
                  type: 'glimpse',
                  mediaUrl: glimpse.mediaUrl,
                };
              })}
              heightClass="h-[480px]"
              onSelectMarker={(marker) => {
                const idx = filteredGlimpses.findIndex((g) => g.id === marker.id);
                if (idx !== -1) setActiveGlimpseIndex(idx);
              }}
            />
          ) : filteredGlimpses.length === 0 ? (
            <div className="p-16 rounded-3xl bg-[#080a11]/80 border border-white/10 text-center space-y-4 backdrop-blur-xl">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-neutral-500 mx-auto shadow-inner">
                <Camera className="w-8 h-8 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-extrabold text-lg text-white">No Active Transmissions on Radar</h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans leading-relaxed">
                  Be the first to transmit an unfiltered visual glimpse from your committee room, caucus floor, or studio.
                </p>
              </div>
              <button
                type="button"
                onClick={startCamera}
                className="px-5 py-2.5 rounded-xl bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition shadow-md active:scale-95"
              >
                + Transmit First Glimpse
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredGlimpses.map((glimpse, idx) => (
                <div
                  key={glimpse.id}
                  onClick={() => setActiveGlimpseIndex(idx)}
                  className="relative aspect-[9/16] rounded-3xl bg-black border border-white/15 overflow-hidden cursor-pointer group shadow-xl hover:border-cyan-400/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <img
                    src={glimpse.mediaUrl}
                    alt={glimpse.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-between p-3.5">
                    
                    {/* Top Author Tag */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-400 via-rose-500 to-cyan-400 shadow-md">
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-[10px] text-white">
                            {glimpse.authorName ? glimpse.authorName[0] : 'U'}
                          </div>
                        </div>
                        <span className="font-sans font-bold text-xs text-white truncate drop-shadow">
                          @{glimpse.authorUsername}
                        </span>
                      </div>

                      {glimpse.authorUsername === (currentUserUsername || 'you') && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteGlimpse(glimpse.id, e)}
                          className="p-1.5 rounded-full bg-black/60 hover:bg-rose-500 text-neutral-300 hover:text-white transition cursor-pointer"
                          title="Delete Glimpse"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Bottom Info & Location */}
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-1 text-[10px] text-cyan-300 font-sans font-semibold">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        <span className="truncate">{glimpse.locationTag}</span>
                      </div>
                      <p className="text-xs text-white font-medium line-clamp-2 drop-shadow font-sans">
                        {glimpse.caption}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 font-sans pt-1.5 border-t border-white/15">
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{glimpse.expiresAt}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleLikeGlimpse(glimpse.id, e)}
                          className="flex items-center gap-1.5 hover:scale-110 transition cursor-pointer text-neutral-300 hover:text-rose-400 active:scale-95"
                          title="Like Glimpse"
                        >
                          <Heart className={`w-3.5 h-3.5 ${glimpse.likedBy?.includes(currentUserUsername || 'you') ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'}`} />
                          <span className="font-bold">{glimpse.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── FULL-SCREEN GLIMPSE MODAL VIEWER ─── */}
      {activeGlimpseIndex !== null && filteredGlimpses[activeGlimpseIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black flex flex-col justify-between">
            
            {/* Background Image */}
            <img
              src={filteredGlimpses[activeGlimpseIndex].mediaUrl}
              alt="Glimpse"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Top Bar with Progress */}
            <div className="relative z-10 p-4 space-y-3 bg-gradient-to-b from-black/80 to-transparent">
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[1.5px] shadow-md">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                      {filteredGlimpses[activeGlimpseIndex].authorName[0]}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      @{filteredGlimpses[activeGlimpseIndex].authorUsername}
                    </h4>
                    <p className="text-[10px] text-cyan-300 font-sans font-semibold">
                      {filteredGlimpses[activeGlimpseIndex].locationTag}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {filteredGlimpses[activeGlimpseIndex].authorUsername === (currentUserUsername || 'you') && (
                    <button
                      onClick={(e) => handleDeleteGlimpse(filteredGlimpses[activeGlimpseIndex].id, e)}
                      className="p-2 rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition cursor-pointer"
                      title="Delete Glimpse"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setActiveGlimpseIndex(null)}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="relative z-10 flex items-center justify-between px-2 pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeGlimpseIndex > 0) setActiveGlimpseIndex(activeGlimpseIndex - 1);
                }}
                disabled={activeGlimpseIndex === 0}
                className="p-2.5 rounded-full bg-black/50 text-white disabled:opacity-0 hover:bg-black/80 transition pointer-events-auto cursor-pointer shadow-lg active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeGlimpseIndex < filteredGlimpses.length - 1) setActiveGlimpseIndex(activeGlimpseIndex + 1);
                }}
                disabled={activeGlimpseIndex === filteredGlimpses.length - 1}
                className="p-2.5 rounded-full bg-black/50 text-white disabled:opacity-0 hover:bg-black/80 transition pointer-events-auto cursor-pointer shadow-lg active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption & Reactions */}
            <div className="relative z-10 p-5 bg-gradient-to-t from-black/95 via-black/60 to-transparent space-y-3.5">
              <p className="text-sm font-sans font-medium text-white drop-shadow leading-snug">
                {filteredGlimpses[activeGlimpseIndex].caption}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                <span className="font-sans text-[11px] text-neutral-300 font-medium">
                  ⏱️ {filteredGlimpses[activeGlimpseIndex].expiresAt}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleLikeGlimpse(filteredGlimpses[activeGlimpseIndex].id, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 transition cursor-pointer text-xs active:scale-95 text-white font-bold"
                    title="Like Glimpse"
                  >
                    <Heart className={`w-4 h-4 ${filteredGlimpses[activeGlimpseIndex].likedBy?.includes(currentUserUsername || 'you') ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                    <span>{filteredGlimpses[activeGlimpseIndex].likes}</span>
                  </button>
                  {['🏛️', '🔥', '👏'].map((emoji) => (
                    <button
                      key={emoji}
                      onClick={(e) => handleLikeGlimpse(filteredGlimpses[activeGlimpseIndex].id, e)}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 hover:scale-125 transition cursor-pointer text-sm active:scale-95"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

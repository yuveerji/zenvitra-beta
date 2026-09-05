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
  Wand2
} from 'lucide-react';
import { ZenGlimpse, INITIAL_GLIMPSES } from '@/types/glimpse';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { MediaStudioModal } from '@/components/creator/MediaStudioModal';

const LOCATION_STAMPS = [
  'Global Civic Commons',
  'Innovation Studio',
  'Open Research Lab',
  'City Forum',
  'Youth Assembly',
  'Digital Commons',
  'Community Hub'
];

export function ZenGlimpseApp() {
  const { currentUserName, currentUserUsername } = useZenPulse();

  const [activeTrack, setActiveTrack] = useState<'community' | 'radar'>('radar');
  const [glimpses, setGlimpses] = useState<ZenGlimpse[]>(INITIAL_GLIMPSES);
  
  // Camera & Capture State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(LOCATION_STAMPS[0]);
  const [selfDestructHours, setSelfDestructHours] = useState<1 | 6 | 12 | 24>(24);
  const glimpseFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setCapturedImage(loadEvt.target.result as string);
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
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        // Fallback simulation
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Webcam permission denied or unavailable, using simulated lens mode', err);
      setIsCameraActive(true);
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
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/png'));
        stopCamera();
      }
    } else {
      // Prompt user to upload if webcam isn't connected
      glimpseFileInputRef.current?.click();
      stopCamera();
    }
  };

  const handlePublishGlimpse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capturedImage) return;

    const newGlimpse: ZenGlimpse = {
      id: `glimpse_${Date.now()}`,
      authorId: 'user_current',
      authorName: currentUserName,
      authorUsername: currentUserUsername,
      mediaUrl: capturedImage,
      mediaType: 'photo',
      caption: caption.trim() || 'Live from the assembly floor ⚡',
      locationTag: selectedLocation,
      chapterCampus: `${selectedLocation} Chapter`,
      selfDestructHours: selfDestructHours,
      track: postTrack,
      createdAt: 'Just now',
      expiresAt: `${selfDestructHours}h remaining`,
      likes: 1,
      likedBy: [currentUserUsername]
    };

    setGlimpses([newGlimpse, ...glimpses]);
    setCapturedImage(null);
    setCaption('');
  };

  // Story viewer progress interval
  useEffect(() => {
    let interval: any;
    if (activeGlimpseIndex !== null) {
      setProgress(0);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            // Advance to next
            if (activeGlimpseIndex < filteredGlimpses.length - 1) {
              setActiveGlimpseIndex(activeGlimpseIndex + 1);
              return 0;
            } else {
              setActiveGlimpseIndex(null);
              return 0;
            }
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [activeGlimpseIndex, filteredGlimpses.length]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 font-sans text-white space-y-8 text-left">
      
      {/* ─── GLIMPSE HEADER & TRACK TABS ─── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 font-mono text-[10px] font-bold">
              24H EPHEMERAL
            </span>
            <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-widest">
              Zero Vanity Filters
            </span>
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2.5">
            <span>ZEN.GLIMPSE</span>
            <Camera className="w-6 h-6 text-pink-400" />
          </h1>
        </div>

        {/* Track Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-black border border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTrack('radar')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTrack === 'radar' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Global Radar</span>
          </button>

          <button
            onClick={() => setActiveTrack('community')}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeTrack === 'community' ? 'bg-white text-black shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Community & Connections</span>
          </button>
        </div>
      </div>

      {/* ─── MAIN BENTO GRID: CAMERA VIEWFINDER & LIVE RADAR STREAM ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Camera-First Viewfinder (Capture Box) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#07080b] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
            
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                <h3 className="font-bold text-sm text-white">Capture Live Glimpse</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Unfiltered Lens</span>
            </div>

            {/* Viewfinder Screen */}
            <div className="relative aspect-[4/5] rounded-2xl bg-black border border-zinc-800 overflow-hidden flex flex-col items-center justify-center">
              {capturedImage ? (
                /* Image Preview */
                <div className="w-full h-full relative">
                  <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  <button
                    onClick={() => { setCapturedImage(null); startCamera(); }}
                    className="absolute top-3 right-3 p-2 rounded-full bg-black/70 text-zinc-300 hover:text-white cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
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
                  <button
                    onClick={handleCapture}
                    className="absolute bottom-5 w-16 h-16 rounded-full border-4 border-white bg-pink-500 hover:scale-105 transition-transform flex items-center justify-center cursor-pointer shadow-2xl"
                    title="Take Photo"
                  >
                    <div className="w-10 h-10 rounded-full bg-white" />
                  </button>
                </div>
              ) : (
                /* Standby Lens Trigger */
                <div className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mx-auto flex items-center justify-center text-pink-400">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-white">Activate Lens</h4>
                    <p className="text-xs text-zinc-500 max-w-xs leading-relaxed">
                      Instant 24-hour visual dispatches from active Model UNs, labs, and campus chapters.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      onClick={startCamera}
                      className="px-4 py-2 rounded-full bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition cursor-pointer shadow-md flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Open Viewfinder</span>
                    </button>

                    <button
                      onClick={() => glimpseFileInputRef.current?.click()}
                      className="px-4 py-2 rounded-full bg-zinc-800 text-white font-semibold text-xs hover:bg-zinc-700 transition cursor-pointer border border-zinc-700 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
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
                  <span className="text-[11px] font-mono text-zinc-400">Captured Snapshot</span>
                  <button
                    type="button"
                    onClick={() => setIsStudioOpen(true)}
                    className="px-3 py-1 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.3)]"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Apply FX &amp; Fonts</span>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Add a sovereign caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-white"
                />

                <div className="grid grid-cols-2 gap-3">
                  {/* Location Stamp Selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Campus / Hall Stamp</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-white"
                    >
                      {LOCATION_STAMPS.map((loc) => (
                        <option key={loc} value={loc} className="bg-black text-white">{loc}</option>
                      ))}
                    </select>
                  </div>

                  {/* Self-Destruct Timer */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Self-Destruct Timer</label>
                    <select
                      value={selfDestructHours}
                      onChange={(e) => setSelfDestructHours(Number(e.target.value) as any)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-white"
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
                    className="flex-1 py-3 rounded-2xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Dispatch Glimpse</span>
                    <Send className="w-3.5 h-3.5" />
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
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>LIVE TRANSMISSIONS • {filteredGlimpses.length} ACTIVE</span>
            </div>
          </div>

          {filteredGlimpses.length === 0 ? (
            <div className="p-12 rounded-3xl bg-[#07080b] border border-white/10 text-center space-y-3">
              <Camera className="w-10 h-10 text-zinc-600 mx-auto" />
              <h4 className="font-bold text-sm text-white">No Active Glimpses on this Track</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Be the first to capture a visual dispatch from your workspace, studio, city, or community.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredGlimpses.map((glimpse, idx) => (
                <div
                  key={glimpse.id}
                  onClick={() => setActiveGlimpseIndex(idx)}
                  className="relative aspect-[9/16] rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden cursor-pointer group shadow-lg"
                >
                  <img
                    src={glimpse.mediaUrl}
                    alt={glimpse.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-3">
                    
                    {/* Top Author Tag */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full p-[1px] bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-[10px] text-white">
                          {glimpse.authorName[0]}
                        </div>
                      </div>
                      <span className="font-bold text-xs text-white truncate drop-shadow">
                        @{glimpse.authorUsername}
                      </span>
                    </div>

                    {/* Bottom Info & Location */}
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-mono">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{glimpse.locationTag}</span>
                      </div>
                      <p className="text-xs text-white font-medium line-clamp-2 drop-shadow">
                        {glimpse.caption}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-1 border-t border-white/10">
                        <span>⏱️ {glimpse.expiresAt}</span>
                        <span>❤️ {glimpse.likes}</span>
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
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
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
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[1.5px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                      {filteredGlimpses[activeGlimpseIndex].authorName[0]}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-white">
                      @{filteredGlimpses[activeGlimpseIndex].authorUsername}
                    </h4>
                    <p className="text-[10px] text-emerald-300 font-mono">
                      {filteredGlimpses[activeGlimpseIndex].locationTag}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveGlimpseIndex(null)}
                  className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
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
                className="p-2 rounded-full bg-black/40 text-white disabled:opacity-0 hover:bg-black/70 transition pointer-events-auto cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeGlimpseIndex < filteredGlimpses.length - 1) setActiveGlimpseIndex(activeGlimpseIndex + 1);
                }}
                disabled={activeGlimpseIndex === filteredGlimpses.length - 1}
                className="p-2 rounded-full bg-black/40 text-white disabled:opacity-0 hover:bg-black/70 transition pointer-events-auto cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption & Reactions */}
            <div className="relative z-10 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent space-y-3">
              <p className="text-sm font-medium text-white drop-shadow">
                {filteredGlimpses[activeGlimpseIndex].caption}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-white/20 text-xs">
                <span className="font-mono text-[10px] text-zinc-400">
                  ⏱️ {filteredGlimpses[activeGlimpseIndex].expiresAt}
                </span>

                <div className="flex items-center gap-2">
                  {['❤️', '🏛️', '🔥', '👏'].map((emoji) => (
                    <button
                      key={emoji}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 hover:scale-125 transition cursor-pointer text-sm"
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

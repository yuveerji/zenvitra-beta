'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  SwitchCamera, 
  Zap, 
  ZapOff, 
  Sparkles, 
  Upload, 
  Type, 
  Palette, 
  Check, 
  Send, 
  X, 
  Radio, 
  RefreshCw, 
  Smile, 
  Link as LinkIcon, 
  Music, 
  Layers, 
  Vote, 
  HelpCircle, 
  MapPin, 
  ShieldCheck, 
  Sliders, 
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { STORY_FONTS, STORY_GRADIENTS, STORY_STICKERS, getStoryFontStyle } from '@/lib/storyFonts';
import { motion, AnimatePresence } from 'framer-motion';

const CAMERA_FILTERS = [
  { id: 'normal', name: 'Normal', css: '' },
  { id: 'noir', name: 'Noir', css: 'grayscale(100%) contrast(125%)' },
  { id: 'cyber', name: 'Cyberpunk', css: 'hue-rotate(190deg) saturate(160%) contrast(110%)' },
  { id: 'warm', name: 'Golden Hour', css: 'sepia(35%) saturate(140%) brightness(105%)' },
  { id: 'emerald', name: 'Matrix', css: 'hue-rotate(85deg) saturate(180%) contrast(115%)' },
  { id: 'retro', name: 'VHS Grain', css: 'contrast(120%) brightness(95%) saturate(130%)' },
];

export function RelayStudio({ onExit }: { onExit?: () => void }) {
  const router = useRouter();
  const { createStory, currentUserName, currentUserUsername } = useZenPulse();

  // Mode: 'camera' | 'upload' | 'text'
  const [studioMode, setStudioMode] = useState<'camera' | 'upload' | 'text'>('camera');
  
  // Camera state
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [hasCameraError, setHasCameraError] = useState<string | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [selectedFilterId, setSelectedFilterId] = useState('normal');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);

  // Creative & Story state
  const [title, setTitle] = useState('');
  const [selectedFontId, setSelectedFontId] = useState('clash');
  const [selectedGradientId, setSelectedGradientId] = useState('nebula');
  const [highlightMode, setHighlightMode] = useState<'none' | 'box' | 'neon' | 'inverted'>('box');
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [pollQuestion, setPollQuestion] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showStickersDrawer, setShowStickersDrawer] = useState(false);
  const [showPollDrawer, setShowPollDrawer] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize Camera Stream
  const startCamera = async (facing: 'user' | 'environment' = cameraFacing) => {
    try {
      setHasCameraError(null);
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraError('Camera access not supported on this device/browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1080 },
          height: { ideal: 1920 },
        },
        audio: false,
      });

      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setHasCameraError(err.message || 'Permission denied or camera in use.');
      setStudioMode('text');
    }
  };

  // Turn off camera stream when unmounting or switching to text mode
  useEffect(() => {
    if (studioMode === 'camera' && !capturedPhotoUrl) {
      startCamera(cameraFacing);
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    }

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [studioMode, cameraFacing, capturedPhotoUrl]);

  // Flip Camera
  const handleFlipCamera = () => {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Capture Snapshot
  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 1280;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Apply chosen filter onto canvas snapshot
      const activeFilter = CAMERA_FILTERS.find((f) => f.id === selectedFilterId);
      if (activeFilter?.css) {
        ctx.filter = activeFilter.css;
      }

      if (cameraFacing === 'user') {
        // Mirror front camera
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhotoUrl(dataUrl);

      // Stop active video stream
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
        setCameraStream(null);
      }
    }
  };

  // Retake photo
  const handleRetakePhoto = () => {
    setCapturedPhotoUrl(null);
    startCamera(cameraFacing);
  };

  // Upload file from disk
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setCapturedPhotoUrl(loadEvt.target.result as string);
          setStudioMode('upload');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSticker = (sticker: string) => {
    if (selectedStickers.includes(sticker)) {
      setSelectedStickers(selectedStickers.filter((s) => s !== sticker));
    } else {
      if (selectedStickers.length < 3) {
        setSelectedStickers([...selectedStickers, sticker]);
      }
    }
  };

  const handlePublish = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() && !capturedPhotoUrl) return;

    const currentGradient = STORY_GRADIENTS.find((g) => g.id === selectedGradientId) || STORY_GRADIENTS[0];

    createStory({
      title: title.trim() || (pollQuestion ? `📊 Poll: ${pollQuestion}` : 'Visual Relay Broadcast'),
      image: capturedPhotoUrl || undefined,
      linkUrl: linkUrl.trim() || undefined,
      linkText: linkText.trim() || undefined,
      color: currentGradient.gradientClass,
      fontStyle: selectedFontId,
      effectStyle: highlightMode,
      textHighlight: highlightMode !== 'none',
      stickers: selectedStickers,
      audioTitle: 'Sovereign Pulse 432Hz',
    });

    handleExit();
  };

  const handleExit = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
    }
    if (onExit) {
      onExit();
    } else {
      router.push('/pulse');
    }
  };

  const activeFilter = CAMERA_FILTERS.find((f) => f.id === selectedFilterId);
  const currentGradient = STORY_GRADIENTS.find((g) => g.id === selectedGradientId) || STORY_GRADIENTS[0];
  const activeFontStyle = getStoryFontStyle(selectedFontId);

  return (
    <div className="fixed inset-0 z-50 bg-[#040508] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* Hidden Snapshot Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden File Input */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*,video/*" 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Shutter White Flash Effect */}
      {isShutterFlashing && (
        <div className="fixed inset-0 bg-white z-[999] pointer-events-none transition-opacity duration-200 opacity-90" />
      )}

      {/* Flash Ring Light Simulation */}
      {isFlashActive && (
        <div className="fixed inset-0 border-[24px] border-white/90 z-40 pointer-events-none animate-pulse" />
      )}

      {/* ─────────────────────────────────────────────────────────────
          1. STUDIO TOP CONTROL BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="h-16 px-4 sm:px-8 border-b border-white/10 bg-black/80 backdrop-blur-xl flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleExit}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition cursor-pointer flex items-center gap-2 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Feed</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>ORBITAL RELAY STUDIO</span>
          </div>
        </div>

        {/* Mode Switcher Pills */}
        <div className="flex items-center p-1 bg-white/[0.06] rounded-2xl border border-white/10 text-xs font-mono">
          <button
            onClick={() => { setStudioMode('camera'); setCapturedPhotoUrl(null); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              studioMode === 'camera' && !capturedPhotoUrl
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Camera</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              studioMode === 'upload'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
          </button>

          <button
            onClick={() => { setStudioMode('text'); setCapturedPhotoUrl(null); }}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
              studioMode === 'text'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Text / Gradient</span>
          </button>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-2">
          {studioMode === 'camera' && !capturedPhotoUrl && (
            <>
              <button
                onClick={() => setIsFlashActive(!isFlashActive)}
                className={`p-2.5 rounded-2xl border transition cursor-pointer ${
                  isFlashActive 
                    ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]' 
                    : 'bg-white/10 hover:bg-white/20 text-zinc-300 border-white/10'
                }`}
                title="Ring Light Flash"
              >
                {isFlashActive ? <Zap className="w-4 h-4 fill-current" /> : <ZapOff className="w-4 h-4" />}
              </button>

              <button
                onClick={handleFlipCamera}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/10 transition cursor-pointer"
                title="Flip Camera"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </>
          )}

          {capturedPhotoUrl && (
            <button
              onClick={handleRetakePhoto}
              className="px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white border border-white/10 font-mono text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN WORKSPACE (VIEWPORT & CREATIVE TOOLS)
      ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center p-4 gap-6 min-h-0 overflow-y-auto">
        
        {/* 9:16 PHONE PREVIEW CONTAINER */}
        <div className="relative w-full max-w-[340px] sm:max-w-[360px] h-[520px] sm:h-[620px] rounded-[36px] overflow-hidden bg-black border-2 border-cyan-500/30 shadow-[0_0_80px_rgba(0,0,0,0.9),0_0_30px_rgba(6,182,212,0.2)] flex flex-col justify-between p-5 relative group shrink-0">
          
          {/* CAMERA / IMAGE / GRADIENT BACKGROUND */}
          {capturedPhotoUrl ? (
            <img 
              src={capturedPhotoUrl} 
              alt="Story" 
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: activeFilter?.css }}
            />
          ) : studioMode === 'camera' ? (
            <div className="absolute inset-0 w-full h-full bg-black overflow-hidden flex items-center justify-center">
              {hasCameraError ? (
                <div className="p-6 text-center space-y-3 z-10">
                  <Camera className="w-10 h-10 text-zinc-500 mx-auto" />
                  <p className="text-xs text-zinc-400 font-mono">{hasCameraError}</p>
                  <button
                    onClick={() => startCamera(cameraFacing)}
                    className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs"
                  >
                    Retry Camera
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraFacing === 'user' ? 'scale-x-[-1]' : ''}`}
                  style={{ filter: activeFilter?.css }}
                />
              )}
            </div>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient.gradientClass} transition-all duration-500`} />
          )}

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 pointer-events-none" />

          {/* STORY TOP BAR */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[1.5px] shadow-md">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white">
                  {(currentUserName || 'U')[0]}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight drop-shadow-md">
                  {currentUserName || 'Your Relay'}
                </p>
                <p className="text-[10px] text-zinc-300 font-mono drop-shadow-md">
                  Just now &bull; 24h Wire
                </p>
              </div>
            </div>

            <div className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
              <Radio className="w-2.5 h-2.5 text-cyan-400" />
              <span>LIVE</span>
            </div>
          </div>

          {/* STORY CENTER TEXT / STICKER LAYER */}
          <div className="relative z-10 my-auto text-center space-y-4 px-2">
            {/* Supermajority Poll Overlay */}
            {pollQuestion && (
              <div className="p-4 rounded-2xl bg-black/80 backdrop-blur-xl border border-cyan-500/40 text-left space-y-2.5 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center gap-1.5 text-cyan-300 font-mono text-[10px] font-bold">
                  <Vote className="w-3.5 h-3.5" />
                  <span>CHAMBER POLL</span>
                </div>
                <p className="text-xs font-bold text-white font-sans">{pollQuestion}</p>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
                  <div className="py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-center">
                    ✓ AYE (68%)
                  </div>
                  <div className="py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-center">
                    ✕ NAY (32%)
                  </div>
                </div>
              </div>
            )}

            {/* Main Text Content */}
            {title ? (
              <div 
                className={`inline-block max-w-full font-bold transition-all ${
                  highlightMode === 'box' 
                    ? 'bg-black/80 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-md text-white shadow-xl' 
                    : highlightMode === 'neon'
                    ? 'text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]'
                    : highlightMode === 'inverted'
                    ? 'bg-white text-black px-4 py-2 rounded-2xl font-black shadow-xl'
                    : 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]'
                }`}
                style={activeFontStyle}
              >
                <span className="text-lg sm:text-xl break-words leading-tight">{title}</span>
              </div>
            ) : (
              !capturedPhotoUrl && studioMode === 'text' && (
                <p className="text-xs font-mono text-white/60 uppercase tracking-widest animate-pulse">
                  Tap edit tools to add transmission...
                </p>
              )
            )}

            {/* Selected Stickers */}
            {selectedStickers.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {selectedStickers.map((stk, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/30 text-xs font-bold text-white shadow-lg animate-in zoom-in"
                  >
                    {stk}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* STORY BOTTOM LINK ATTACHMENT */}
          <div className="relative z-10">
            {linkUrl && (
              <div className="mb-3 py-2 px-3.5 rounded-2xl bg-white text-black font-bold text-xs flex items-center justify-between shadow-2xl font-mono">
                <span className="truncate max-w-[200px]">{linkText || 'Open Linked Dossier'}</span>
                <LinkIcon className="w-3.5 h-3.5 shrink-0" />
              </div>
            )}

            {/* Shutter Capture Button inside camera preview */}
            {studioMode === 'camera' && !capturedPhotoUrl && (
              <div className="flex items-center justify-center pb-2">
                <button
                  onClick={handleCaptureSnapshot}
                  className="w-16 h-16 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                  title="Capture Photo"
                >
                  <div className="w-full h-full rounded-full bg-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT: CREATIVE TOOLING DECK (DESKTOP / EXPANDABLE)
        ───────────────────────────────────────────────────────────── */}
        <div className="w-full max-w-md bg-[#080a12] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-mono text-xs text-zinc-400 font-bold uppercase tracking-wider">
              Studio Creative Controls
            </span>
            <span className="text-[10px] font-mono text-cyan-300">Zenvitra Engine v2.4</span>
          </div>

          {/* Text Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block font-semibold">
              Relay Caption & Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Type message, headline or dispatch..."
              className="w-full bg-black/60 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          {/* Camera Filter Presets */}
          {studioMode === 'camera' && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 block font-semibold">
                Camera Optical Filter
              </label>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 font-mono text-xs">
                {CAMERA_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilterId(filter.id)}
                    className={`px-3 py-1.5 rounded-xl border transition whitespace-nowrap cursor-pointer ${
                      selectedFilterId === filter.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gradient Palette (when in text mode or gradient background) */}
          {!capturedPhotoUrl && (
            <div className="space-y-2">
              <label className="text-xs font-mono text-zinc-400 block font-semibold">
                Cosmic Gradient Canvas
              </label>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
                {STORY_GRADIENTS.map((grad) => (
                  <button
                    key={grad.id}
                    onClick={() => setSelectedGradientId(grad.id)}
                    className={`w-8 h-8 rounded-xl bg-gradient-to-br ${grad.gradientClass} border transition shrink-0 cursor-pointer ${
                      selectedGradientId === grad.id ? 'border-white scale-110 shadow-lg' : 'border-white/20 opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Font & Highlight Selector */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block font-semibold">
              Typography Style
            </label>
            <div className="grid grid-cols-4 gap-2 font-mono text-[11px]">
              {STORY_FONTS.slice(0, 4).map((fnt) => (
                <button
                  key={fnt.id}
                  onClick={() => setSelectedFontId(fnt.id)}
                  className={`py-2 rounded-xl border transition text-center cursor-pointer ${
                    selectedFontId === fnt.id
                      ? 'bg-white text-black font-bold border-white'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  {fnt.name}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Stickers & Polls Trigger */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block font-semibold">
              Interactive Attachments
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowStickersDrawer(!showStickersDrawer)}
                className={`flex-1 py-2.5 px-3 rounded-2xl border font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  showStickersDrawer ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
                }`}
              >
                <Smile className="w-4 h-4 text-cyan-400" />
                <span>Add Stickers</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPollDrawer(!showPollDrawer)}
                className={`flex-1 py-2.5 px-3 rounded-2xl border font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  showPollDrawer ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-white/5 border-white/10 text-zinc-300 hover:text-white'
                }`}
              >
                <Vote className="w-4 h-4 text-amber-400" />
                <span>Add Poll Ballot</span>
              </button>
            </div>

            {/* Sticker Drawer */}
            {showStickersDrawer && (
              <div className="p-3 bg-black/60 rounded-2xl border border-white/10 flex flex-wrap gap-2 animate-in fade-in">
                {['🏛️ Plenary UN', '⚡ High-Seas Treaty', '🔥 Crucial', '💎 50 PTS', '📍 Geneva Node', '📜 Verified Clause', '🎙️ Live Floor'].map((stk) => (
                  <button
                    key={stk}
                    onClick={() => toggleSticker(stk)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedStickers.includes(stk)
                        ? 'bg-cyan-500 text-black'
                        : 'bg-white/10 text-zinc-300 hover:text-white'
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            )}

            {/* Poll Ballot Drawer */}
            {showPollDrawer && (
              <div className="p-3.5 bg-black/60 rounded-2xl border border-amber-500/30 space-y-2 animate-in fade-in">
                <span className="text-[10px] font-mono text-amber-300 uppercase font-bold block">
                  Chamber Supermajority Poll Question
                </span>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="e.g. Should youth delegations hold veto power?"
                  className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>

          {/* Link Attachment Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400 block font-semibold">
              Attach Link / Event Registration
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://zenvitra.org/events/..."
                className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-mono"
              />
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Button Label (e.g. Register)"
                className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>
          </div>

          {/* Broadcast CTA Button */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={!title.trim() && !capturedPhotoUrl && !pollQuestion.trim()}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:opacity-95 text-black font-display font-bold text-sm tracking-wide uppercase transition shadow-[0_0_30px_rgba(6,182,212,0.4)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>Broadcast Orbital Relay</span>
          </button>
        </div>
      </div>
    </div>
  );
}

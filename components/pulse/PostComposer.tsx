'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Trash2, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Lock,
  MapPin,
  Smile,
  Hash,
  ArrowLeft,
  Check,
  Plus,
  Upload,
  Palette,
  Sliders,
  Type,
  Wand2,
  RotateCcw,
  Move,
  Eye,
  EyeOff,
  SlidersHorizontal,
  SunMedium,
  Contrast,
  Droplets,
  Flame,
  CheckCircle2,
  Undo2,
  RotateCw,
  FlipHorizontal,
  Layers,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ShieldAlert,
  Shield,
  Crop,
  Layers2,
  Music,
  Landmark,
  ExternalLink
} from 'lucide-react';
import { useZenPulse } from '@/context/ZenPulsePlatformContext';
import { MusicPickerModal } from './MusicPickerModal';
import { motion, AnimatePresence } from 'framer-motion';
import { auditPostDispatch, IntegrityCheckResult } from '@/lib/fluxIntegrityGuard';

const EMOJI_PRESETS = ['✨', '🌍', '💡', '🔥', '🌱', '🚀', '🏛️', '✊', '⚡', '🤝'];

const LOCATION_SUGGESTIONS = [
  'Geneva Climate Assembly',
  'Global Youth Grid',
  'Youth Innovation Summit 2026',
  'UN Digital Compact Node',
  'Sovereign Secretariat Lab',
  'Civic AI Working Group',
];

export interface EmbeddedTextOverlay {
  id: string;
  imageIndex?: number;
  text: string;
  font: string;
  color: string;
  fontSize: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation: number;
  opacity: number;
  letterSpacing: number;
  effect: 'clean' | 'neon' | 'glass' | 'brutalist' | 'outline' | 'shadow';
  isUppercase: boolean;
  align: 'left' | 'center' | 'right';
}

export const FX_FILTERS = [
  { id: 'none', name: 'Normal', css: 'none', thumb: 'from-zinc-700 to-zinc-900', desc: 'No Filter' },
  { id: 'clarendon', name: 'Clarendon', css: 'contrast(120%) saturate(125%) brightness(105%)', thumb: 'from-cyan-500 to-blue-600', desc: 'Vibrant & Cool' },
  { id: 'juno', name: 'Juno', css: 'contrast(115%) saturate(135%) sepia(15%)', thumb: 'from-amber-500 to-rose-600', desc: 'Warm Highlights' },
  { id: 'ludwig', name: 'Ludwig', css: 'contrast(105%) brightness(108%) saturate(105%)', thumb: 'from-stone-500 to-stone-800', desc: 'Minimal & Crisp' },
  { id: 'lark', name: 'Lark', css: 'contrast(95%) brightness(112%) saturate(120%)', thumb: 'from-sky-400 to-emerald-500', desc: 'Bright Landscapes' },
  { id: 'gingham', name: 'Gingham', css: 'brightness(105%) contrast(90%) sepia(10%)', thumb: 'from-yellow-200 to-amber-700', desc: 'Vintage Matte' },
  { id: 'valencia', name: 'Valencia', css: 'sepia(25%) contrast(108%) brightness(108%)', thumb: 'from-orange-400 to-amber-600', desc: 'Warm 80s Fade' },
  { id: 'reyes', name: 'Reyes', css: 'sepia(22%) brightness(110%) contrast(85%) saturate(75%)', thumb: 'from-amber-200 to-stone-400', desc: 'Subtle Dust' },
  { id: 'slumber', name: 'Slumber', css: 'saturate(66%) brightness(105%) sepia(35%)', thumb: 'from-yellow-600 to-stone-700', desc: 'Hazy Retro' },
  { id: 'crema', name: 'Crema', css: 'contrast(90%) brightness(105%) saturate(90%) sepia(15%)', thumb: 'from-stone-300 to-amber-900', desc: 'Creamy Tone' },
  { id: 'moon', name: 'Moon', css: 'grayscale(100%) contrast(110%) brightness(110%)', thumb: 'from-zinc-300 to-zinc-700', desc: 'Soft B&W' },
  { id: 'inkwell', name: 'Inkwell', css: 'grayscale(100%) contrast(140%) brightness(95%)', thumb: 'from-zinc-900 to-black', desc: 'High Contrast B&W' },
];

export const OVERLAY_FONTS = [
  { id: 'clash', name: 'Zenvitra Sovereign', font: "'Clash Display', sans-serif" },
  { id: 'syne', name: 'ZenPulse Hyper', font: "'Syne', sans-serif" },
  { id: 'marker', name: 'ZenStreet Rebel', font: "'Permanent Marker', cursive" },
  { id: 'impact', name: 'Pulse Vanguard', font: "'Bebas Neue', sans-serif" },
  { id: 'serif', name: 'Zenvitra Editorial', font: "'Playfair Display', serif" },
  { id: 'cyber', name: 'ZenMatrix Cyber', font: "'Orbitron', sans-serif" },
  { id: 'mono', name: 'ZenCipher Ledger', font: "'JetBrains Mono', monospace" },
  { id: 'signature', name: 'Zenvitra Atelier', font: "'Dancing Script', cursive" },
  { id: 'vogue', name: 'ZenDynasty Royale', font: "'Cinzel', serif" },
  { id: 'sans', name: 'ZenPulse Minimal', font: 'Inter, sans-serif' },
];

export const OVERLAY_EFFECTS = [
  { id: 'clean', name: 'Clean Flat' },
  { id: 'neon', name: 'Neon Glow' },
  { id: 'glass', name: 'Glass Badge' },
  { id: 'brutalist', name: 'Slab Box' },
  { id: 'outline', name: 'Stark Outline' },
  { id: 'shadow', name: '3D Shadow' },
] as const;

export const SWATCH_COLORS = [
  '#ffffff',
  '#22d3ee', // cyan
  '#38bdf8', // sky
  '#a855f7', // purple
  '#ec4899', // pink
  '#f43f5e', // rose
  '#f97316', // orange
  '#facc15', // amber/gold
  '#10b981', // emerald
  '#06b6d4', // teal
  '#6366f1', // indigo
  '#a1a1aa', // zinc
  '#18181b', // dark
  '#000000', // black
];

export const STICKER_PRESETS = [
  { id: 'verified', label: '👑 Sovereign Verified', text: '👑 VERIFIED', color: '#fbbf24', font: 'clash', effect: 'glass' as const },
  { id: 'nepal', label: '🇳🇵 PMDRF Relief Aid', text: '🇳🇵 PMDRF RELIEF', color: '#f43f5e', font: 'syne', effect: 'brutalist' as const },
  { id: 'youth', label: '⚡ Youth Action Core', text: '⚡ YOUTH CORE', color: '#22d3ee', font: 'impact', effect: 'neon' as const },
  { id: 'live', label: '🔴 DISPATCH WIRE', text: '🔴 DISPATCH WIRE', color: '#ef4444', font: 'mono', effect: 'glass' as const },
  { id: 'exclusive', label: '✨ EXCLUSIVE', text: '✨ EXCLUSIVE', color: '#a855f7', font: 'clash', effect: 'neon' as const },
  { id: 'sovereign', label: '🛡️ ZEN SOVEREIGN', text: '🛡️ ZEN SOVEREIGN', color: '#10b981', font: 'serif', effect: 'glass' as const },
  { id: 'hot', label: '🔥 TRENDING WIRE', text: '🔥 TRENDING WIRE', color: '#f97316', font: 'impact', effect: 'shadow' as const },
];

interface PostComposerProps {
  onFinished?: () => void;
  onClose?: () => void;
}

export function PostComposer({ onFinished, onClose }: PostComposerProps) {
  const { createPost, setActiveView, currentUserName, currentUserUsername } = useZenPulse();

  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedFont, setSelectedFont] = useState<string>('clash');
  const [privacy, setPrivacy] = useState<'public' | 'community' | 'mesh'>('public');
  const [location, setLocation] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<'original' | '1:1' | '4:5' | '16:9' | 'custom'>('original');
  const [customWidth, setCustomWidth] = useState<number>(4);
  const [customHeight, setCustomHeight] = useState<number>(3);
  const [showCustomAspectPopup, setShowCustomAspectPopup] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['YouthAction', 'ZenPulse']);
  const [attachedSong, setAttachedSong] = useState<{ title: string; artist: string; audioUrl: string } | null>(null);
  const [isMusicPickerOpen, setIsMusicPickerOpen] = useState(false);
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [showSourceFields, setShowSourceFields] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* ── 3D FLIP FX STUDIO STATE ── */
  const [isStudioFlipped, setIsStudioFlipped] = useState(false);
  const [studioTab, setStudioTab] = useState<'filters' | 'tune' | 'text' | 'stickers' | 'transform'>('filters');
  const [activeFilterId, setActiveFilterId] = useState<string>('none');
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [warmth, setWarmth] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [vignette, setVignette] = useState<number>(0);
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [isComparingOriginal, setIsComparingOriginal] = useState<boolean>(false);
  const [customHexColor, setCustomHexColor] = useState<string>('#ffffff');

  const [textOverlays, setTextOverlays] = useState<EmbeddedTextOverlay[]>([]);
  const [activeOverlayId, setActiveOverlayId] = useState<string | null>(null);

  /* Drag Tracking on Canvas */
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const draggingOverlayIdRef = useRef<string | null>(null);
  const dragStartPosRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          if (loadEvt.target?.result) {
            const newUrl = loadEvt.target.result as string;
            setImages((prev) => [...prev, newUrl]);
          }
        };
        reader.readAsDataURL(file);
      });
      // reset input value so re-selecting same files works
      e.target.value = '';
    }
  };

  const getActiveFilterCss = () => {
    if (isComparingOriginal) return 'none';
    const found = FX_FILTERS.find((f) => f.id === activeFilterId);
    let base = found && found.css !== 'none' ? found.css + ' ' : '';
    base += `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) `;
    if (warmth !== 0) {
      base += warmth > 0 ? `sepia(${warmth}%) ` : `hue-rotate(${Math.abs(warmth) * 2}deg) `;
    }
    if (blur > 0) {
      base += `blur(${blur}px) `;
    }
    return base.trim() || 'none';
  };

  const getTransformCss = () => {
    const transforms: string[] = [];
    if (rotationDeg !== 0) transforms.push(`rotate(${rotationDeg}deg)`);
    if (flipH) transforms.push('scaleX(-1)');
    if (flipV) transforms.push('scaleY(-1)');
    return transforms.join(' ') || 'none';
  };

  /* Helper to add text overlay */
  const handleAddTextOverlay = () => {
    const newOverlay: EmbeddedTextOverlay = {
      id: String(Date.now()),
      imageIndex: selectedImageIdx,
      text: 'SOVEREIGN DISPATCH',
      font: 'clash',
      color: '#ffffff',
      fontSize: 26,
      x: 50,
      y: 50 + ((textOverlays.filter((o) => (o.imageIndex ?? 0) === selectedImageIdx).length * 6) % 30),
      rotation: 0,
      opacity: 100,
      letterSpacing: 1,
      effect: 'clean',
      isUppercase: true,
      align: 'center',
    };
    setTextOverlays((prev) => [...prev, newOverlay]);
    setActiveOverlayId(newOverlay.id);
    setStudioTab('text');
  };

  const handleDuplicateOverlay = () => {
    if (!activeOverlayId) return;
    const current = textOverlays.find((o) => o.id === activeOverlayId);
    if (!current) return;
    const newId = String(Date.now());
    const dup: EmbeddedTextOverlay = {
      ...current,
      id: newId,
      imageIndex: current.imageIndex ?? selectedImageIdx,
      x: Math.min(90, current.x + 4),
      y: Math.min(90, current.y + 4),
    };
    setTextOverlays((prev) => [...prev, dup]);
    setActiveOverlayId(newId);
  };

  const handleAddStickerPreset = (preset: typeof STICKER_PRESETS[0]) => {
    const newOverlay: EmbeddedTextOverlay = {
      id: String(Date.now()),
      imageIndex: selectedImageIdx,
      text: preset.text,
      font: preset.font,
      color: preset.color,
      fontSize: 22,
      x: 50,
      y: 50 + ((textOverlays.filter((o) => (o.imageIndex ?? 0) === selectedImageIdx).length * 6) % 30),
      rotation: 0,
      opacity: 100,
      letterSpacing: 2,
      effect: preset.effect,
      isUppercase: true,
      align: 'center',
    };
    setTextOverlays((prev) => [...prev, newOverlay]);
    setActiveOverlayId(newOverlay.id);
    setStudioTab('text');
  };

  const handleUpdateActiveOverlay = (updates: Partial<EmbeddedTextOverlay>) => {
    if (!activeOverlayId) return;
    setTextOverlays((prev) =>
      prev.map((ov) => (ov.id === activeOverlayId ? { ...ov, ...updates } : ov))
    );
  };

  const handleRemoveActiveOverlay = () => {
    if (!activeOverlayId) return;
    setTextOverlays((prev) => prev.filter((ov) => ov.id !== activeOverlayId));
    setActiveOverlayId(null);
  };

  const handleAutoEnhance = () => {
    if (images.length === 0) return;
    setBrightness(105);
    setContrast(115);
    setSaturation(120);
    setWarmth(8);
    setVignette(15);
    setActiveFilterId('clarendon');
  };

  const handleResetAdjustments = () => {
    setActiveFilterId('none');
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setWarmth(0);
    setBlur(0);
    setVignette(0);
    setRotationDeg(0);
    setFlipH(false);
    setFlipV(false);
    setTextOverlays([]);
    setActiveOverlayId(null);
  };

  /* Drag handlers for text overlay on the canvas */
  const handleStartDrag = (id: string, clientX: number, clientY: number) => {
    const ov = textOverlays.find((o) => o.id === id);
    if (!ov || !previewContainerRef.current) return;
    setActiveOverlayId(id);
    draggingOverlayIdRef.current = id;
    dragStartPosRef.current = {
      mouseX: clientX,
      mouseY: clientY,
      initialX: ov.x,
      initialY: ov.y,
    };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!draggingOverlayIdRef.current || !dragStartPosRef.current || !previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const deltaX = ((clientX - dragStartPosRef.current.mouseX) / rect.width) * 100;
    const deltaY = ((clientY - dragStartPosRef.current.mouseY) / rect.height) * 100;

    const newX = Math.max(5, Math.min(95, dragStartPosRef.current.initialX + deltaX));
    const newY = Math.max(5, Math.min(95, dragStartPosRef.current.initialY + deltaY));

    setTextOverlays((prev) =>
      prev.map((ov) => (ov.id === draggingOverlayIdRef.current ? { ...ov, x: newX, y: newY } : ov))
    );
  };

  const handleStopDrag = () => {
    draggingOverlayIdRef.current = null;
    dragStartPosRef.current = null;
  };

  // Real-time Secular & Integrity check for posts
  const auditResult: IntegrityCheckResult = React.useMemo(() => {
    if (!content.trim()) {
      return { passed: true, score: 100, status: 'VERIFIED', reasons: [], auditedAt: '' };
    }
    return auditPostDispatch({
      content,
      location,
      tags
    });
  }, [content, location, tags]);

  const charLimit = 500;
  const remaining = charLimit - content.length;
  const isPostValid = (content.trim() || images.length > 0) && auditResult.passed;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onFinished) {
      onFinished();
    } else {
      setActiveView('feed');
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /* Bake canvas before posting if custom filters or text overlays exist */
  const compositeImageCanvas = async (imgSrc: string, targetIdx: number = 0): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 1080;
        canvas.height = img.naturalHeight || 1080;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imgSrc);

        // Apply Transforms (Rotate, Flips)
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        if (rotationDeg !== 0) ctx.rotate((rotationDeg * Math.PI) / 180);
        if (flipH) ctx.scale(-1, 1);
        if (flipV) ctx.scale(1, -1);

        const filterCss = getActiveFilterCss();
        if (filterCss && filterCss !== 'none') {
          ctx.filter = filterCss;
        }
        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();
        ctx.filter = 'none';

        // Apply Vignette if enabled
        if (vignette > 0) {
          const radius = Math.max(canvas.width, canvas.height) * 0.7;
          const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            radius * 0.4,
            canvas.width / 2,
            canvas.height / 2,
            radius
          );
          gradient.addColorStop(0, 'rgba(0,0,0,0)');
          gradient.addColorStop(1, `rgba(0,0,0,${(vignette / 100) * 0.85})`);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Draw overlays scoped ONLY to this image index
        textOverlays
          .filter((ov) => (ov.imageIndex ?? 0) === targetIdx)
          .forEach((ov) => {
          const xPos = (ov.x / 100) * canvas.width;
          const yPos = (ov.y / 100) * canvas.height;
          const scale = canvas.width / 400;
          const fontSize = Math.max(18, ov.fontSize * scale);

          ctx.save();
          ctx.translate(xPos, yPos);
          ctx.rotate((ov.rotation * Math.PI) / 180);
          ctx.globalAlpha = ov.opacity / 100;
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.textAlign = (ov.align || 'center') as CanvasTextAlign;
          ctx.textBaseline = 'middle';

          const textToRender = ov.isUppercase ? ov.text.toUpperCase() : ov.text;

          // Effect styles
          if (ov.effect === 'neon') {
            ctx.shadowColor = ov.color;
            ctx.shadowBlur = 25 * scale;
            ctx.fillStyle = ov.color;
            ctx.fillText(textToRender, 0, 0);
          } else if (ov.effect === 'outline') {
            ctx.strokeStyle = ov.color;
            ctx.lineWidth = 2 * scale;
            ctx.strokeText(textToRender, 0, 0);
          } else if (ov.effect === 'shadow') {
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 8 * scale;
            ctx.shadowOffsetX = 4 * scale;
            ctx.shadowOffsetY = 4 * scale;
            ctx.fillStyle = ov.color;
            ctx.fillText(textToRender, 0, 0);
          } else if (ov.effect === 'glass' || ov.effect === 'brutalist') {
            const metrics = ctx.measureText(textToRender);
            const padX = 14 * scale;
            const padY = 8 * scale;
            const rectW = metrics.width + padX * 2;
            const rectH = fontSize + padY * 2;

            if (ov.effect === 'glass') {
              ctx.fillStyle = 'rgba(0,0,0,0.55)';
              ctx.roundRect(-rectW / 2, -rectH / 2, rectW, rectH, 10 * scale);
              ctx.fill();
              ctx.strokeStyle = 'rgba(255,255,255,0.25)';
              ctx.stroke();
            } else {
              ctx.fillStyle = '#000000';
              ctx.fillRect(-rectW / 2, -rectH / 2, rectW, rectH);
              ctx.strokeStyle = ov.color;
              ctx.lineWidth = 2 * scale;
              ctx.strokeRect(-rectW / 2, -rectH / 2, rectW, rectH);
            }
            ctx.fillStyle = ov.color;
            ctx.fillText(textToRender, 0, 0);
          } else {
            ctx.shadowColor = 'rgba(0,0,0,0.85)';
            ctx.shadowBlur = 8 * scale;
            ctx.fillStyle = ov.color;
            ctx.fillText(textToRender, 0, 0);
          }

          ctx.restore();
        });

        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      img.onerror = () => resolve(imgSrc);
      img.src = imgSrc;
    });
  };

  const handlePost = async () => {
    if (!content.trim() && images.length === 0) return;
    
    if (!auditResult.passed) {
      setErrorMessage(auditResult.reasons[0] || 'Post violates Zenvitra Secular Policy & Integrity standards.');
      return;
    }
    setErrorMessage(null);

    let processedImages = [...images];
    if (images.length > 0 && (activeFilterId !== 'none' || textOverlays.length > 0 || brightness !== 100 || contrast !== 100)) {
      try {
        for (let i = 0; i < images.length; i++) {
          const hasOverlays = textOverlays.some((ov) => (ov.imageIndex ?? 0) === i);
          if (hasOverlays || i === selectedImageIdx) {
            processedImages[i] = await compositeImageCanvas(images[i], i);
          }
        }
      } catch (err) {
        console.error('Error compositing image:', err);
      }
    }

    createPost(
      content.trim(),
      processedImages.length > 0 ? processedImages : undefined,
      location.trim() || 'Global Youth Grid',
      tags,
      selectedFont,
      'none',
      attachedSong ? {
        songTitle: attachedSong.title,
        songArtist: attachedSong.artist,
        songAudioUrl: attachedSong.audioUrl
      } : undefined,
      undefined,
      sourceName.trim() || sourceUrl.trim() ? {
        sourceName: sourceName.trim(),
        sourceUrl: sourceUrl.trim()
      } : undefined
    );

    setContent('');
    setImages([]);
    handleClose();
  };

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    setImages(updated);
    if (selectedImageIdx >= updated.length) {
      setSelectedImageIdx(Math.max(0, updated.length - 1));
    }
  };

  const addTag = (t: string) => {
    const clean = t.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const removeTag = (t: string) => {
    setTags(tags.filter((x) => x !== t));
  };

  const addEmoji = (emoji: string) => {
    if (content.length + emoji.length <= charLimit) {
      setContent((prev) => prev + emoji);
    }
  };

  const activeOverlayObj = textOverlays.find((o) => o.id === activeOverlayId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 select-none animate-in fade-in duration-200">
      {/* Container Dialog */}
      <div 
        className="w-full max-w-4xl my-auto max-h-[94vh] bg-[#090a0f] border border-white/15 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.98)] flex flex-col overflow-hidden text-white backdrop-blur-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── TOP HEADER ── */}
        <div className="h-14 px-6 border-b border-white/10 flex items-center justify-between bg-black/60 backdrop-blur-md">
          <button
            onClick={handleClose}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </button>

          <div 
            className="text-sm font-bold tracking-tight text-white flex items-center gap-2 uppercase tracking-widest"
            style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
          >
            <span>{isStudioFlipped ? 'FX & Media Studio' : 'Create New Dispatch'}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="flex items-center gap-3">
            {isStudioFlipped ? (
              <button
                type="button"
                onClick={() => setIsStudioFlipped(false)}
                className="px-4 py-1.5 rounded-full bg-cyan-400 text-black text-xs font-bold transition-all hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Done FX</span>
              </button>
            ) : (
              <button
                onClick={handlePost}
                disabled={!isPostValid}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  !auditResult.passed && content.trim()
                    ? 'bg-rose-600/80 text-white cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-30'
                }`}
              >
                {!auditResult.passed && content.trim() ? 'Blocked' : 'Dispatch'}
              </button>
            )}
          </div>
        </div>

        {/* Live Integrity Warning Banner */}
        {(!auditResult.passed && content.trim()) || errorMessage ? (
          <div className="px-5 py-3 bg-rose-500/15 border-b border-rose-500/30 text-rose-300 text-xs font-mono flex items-start justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-rose-200 uppercase font-bold text-[11px]">
                  Secular &amp; Integrity Policy Violation ({auditResult.violationType || 'REJECTED'}):
                </strong>
                <span>{errorMessage || auditResult.reasons[0]}</span>
              </div>
            </div>
            {errorMessage && (
              <button type="button" onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">✕</button>
            )}
          </div>
        ) : null}

        {/* ── MAIN 2-COLUMN BODY ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 min-h-0 overflow-y-auto md:overflow-hidden">
          
          {/* ── LEFT: MEDIA STAGE (7 cols) ── */}
          <div className="md:col-span-7 bg-black/60 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center justify-between p-4 relative min-h-[340px] md:min-h-[500px]">
            {/* Top Media Bar */}
            <div className="w-full flex items-center justify-between z-10 gap-2">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] font-mono text-zinc-300 relative">
                <span className="text-zinc-500 text-[10px]">Aspect:</span>
                {(['original', '1:1', '4:5', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => {
                      setAspectRatio(ratio);
                      setShowCustomAspectPopup(false);
                    }}
                    className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer text-[11px] ${
                      aspectRatio === ratio ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {ratio === 'original' ? 'Original' : ratio}
                  </button>
                ))}

                {/* Custom Button with Toggle Popover */}
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => {
                      setAspectRatio('custom');
                      setShowCustomAspectPopup((prev) => !prev);
                    }}
                    className={`px-2 py-0.5 rounded-md font-semibold transition cursor-pointer text-[11px] flex items-center gap-1 ${
                      aspectRatio === 'custom'
                        ? 'bg-white text-black font-bold shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <span>{aspectRatio === 'custom' && (customWidth !== 4 || customHeight !== 3) ? `${customWidth}:${customHeight}` : 'Custom'}</span>
                  </button>

                  {/* Pop-up dropdown right beneath the Custom button */}
                  {showCustomAspectPopup && (
                    <div 
                      className="absolute top-full left-0 mt-2 z-50 w-60 p-3 rounded-2xl bg-[#090a12]/98 border border-white/20 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.95)] space-y-2.5 animate-in fade-in zoom-in-95 duration-150 text-white"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between pb-1 border-b border-white/10">
                        <span className="text-[11px] font-bold text-white font-mono uppercase tracking-wider">
                          Custom Aspect Ratio
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowCustomAspectPopup(false)}
                          className="text-zinc-400 hover:text-white text-xs p-0.5 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      {/* Width & Height numeric inputs */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] text-zinc-400 font-mono block">WIDTH (X)</label>
                          <input
                            type="number"
                            min={1}
                            max={64}
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2 py-1 text-center font-mono font-bold text-xs bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <span className="text-zinc-500 font-bold mt-4">:</span>
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] text-zinc-400 font-mono block">HEIGHT (Y)</label>
                          <input
                            type="number"
                            min={1}
                            max={64}
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full px-2 py-1 text-center font-mono font-bold text-xs bg-black/60 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      {/* Quick Ratio Presets */}
                      <div className="space-y-1 pt-1 border-t border-white/10">
                        <span className="text-[9px] text-zinc-500 font-mono uppercase">Quick Presets</span>
                        <div className="grid grid-cols-3 gap-1">
                          {[
                            { w: 21, h: 9, label: '21:9' },
                            { w: 3, h: 2, label: '3:2' },
                            { w: 2, h: 3, label: '2:3' },
                            { w: 4, h: 3, label: '4:3' },
                            { w: 3, h: 4, label: '3:4' },
                            { w: 9, h: 16, label: '9:16' },
                          ].map((p) => (
                            <button
                              key={p.label}
                              type="button"
                              onClick={() => {
                                setCustomWidth(p.w);
                                setCustomHeight(p.h);
                              }}
                              className={`px-1.5 py-1 text-[10px] font-mono rounded-lg border transition cursor-pointer ${
                                customWidth === p.w && customHeight === p.h
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                                  : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white'
                              }`}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowCustomAspectPopup(false)}
                        className="w-full py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition cursor-pointer flex items-center justify-center gap-1 shadow-md"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Apply {customWidth}:{customHeight}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-xs font-medium text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  title="Upload photo from device"
                >
                  <Upload className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Upload</span>
                </button>

                {/* 3D Flip Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsStudioFlipped(!isStudioFlipped)}
                  className={`px-2.5 py-1 rounded-xl border text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                    isStudioFlipped
                      ? 'bg-white text-black border-white font-bold shadow-sm'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-zinc-300 hover:text-white'
                  }`}
                >
                  <Wand2 className={`w-3.5 h-3.5 ${isStudioFlipped ? 'text-black' : 'text-zinc-400'}`} />
                  <span>{isStudioFlipped ? 'Close FX' : 'FX & Text Studio'}</span>
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Media Canvas Viewport */}
            <div 
              className="my-auto w-full flex items-center justify-center p-2"
              onMouseMove={(e) => handleDragMove(e.clientX, e.clientY)}
              onMouseUp={handleStopDrag}
              onTouchMove={(e) => e.touches[0] && handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
              onTouchEnd={handleStopDrag}
            >
              {images.length > 0 ? (
                <div 
                  ref={previewContainerRef}
                  style={aspectRatio === 'custom' ? { aspectRatio: `${customWidth} / ${customHeight}` } : undefined}
                  className={`relative w-full max-w-[380px] rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-zinc-950 group select-none transition-all duration-200 ${
                    aspectRatio === '1:1'
                      ? 'aspect-square'
                      : aspectRatio === '4:5'
                      ? 'aspect-[4/5]'
                      : aspectRatio === '16:9'
                      ? 'aspect-video'
                      : aspectRatio === 'original'
                      ? 'aspect-auto max-h-[480px] flex items-center justify-center'
                      : ''
                  }`}
                >
                  {/* Multi-Page Slide Counter */}
                  {images.length > 1 && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-white border border-white/20 z-20 shadow-md">
                      {selectedImageIdx + 1} / {images.length}
                    </div>
                  )}

                  {/* Carousel Left / Right Navigation Controls */}
                  {selectedImageIdx > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImageIdx((prev) => Math.max(0, prev - 1));
                        setActiveOverlayId(null);
                      }}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center z-20 shadow-lg cursor-pointer border border-white/15 text-sm font-bold transition hover:scale-105"
                      title="Previous slide"
                    >
                      ‹
                    </button>
                  )}

                  {selectedImageIdx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImageIdx((prev) => Math.min(images.length - 1, prev + 1));
                        setActiveOverlayId(null);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center z-20 shadow-lg cursor-pointer border border-white/15 text-sm font-bold transition hover:scale-105"
                      title="Next slide"
                    >
                      ›
                    </button>
                  )}

                  {/* Media Content (Image or Video) */}
                  {images[selectedImageIdx]?.startsWith('data:video') || 
                   images[selectedImageIdx]?.includes('.mp4') || 
                   images[selectedImageIdx]?.includes('.webm') || 
                   images[selectedImageIdx]?.includes('.mov') ? (
                    <video
                      src={images[selectedImageIdx]}
                      controls
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={images[selectedImageIdx] || images[0]}
                      alt="Preview"
                      style={{ 
                        filter: getActiveFilterCss(),
                        transform: getTransformCss(),
                      }}
                      className={`select-none pointer-events-none transition-all duration-200 ${
                        aspectRatio === 'original'
                          ? 'w-full h-auto max-h-[460px] object-contain'
                          : 'w-full h-full object-cover'
                      }`}
                    />
                  )}

                  {/* Vignette Shadow Overlay */}
                  {vignette > 0 && !isComparingOriginal && (
                    <div 
                      className="absolute inset-0 pointer-events-none transition-opacity"
                      style={{
                        background: `radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,${(vignette / 100) * 0.85}) 100%)`
                      }}
                    />
                  )}

                  {/* ── DRAGGABLE TEXT OVERLAYS ON CANVAS (SCOPED TO ACTIVE SLIDE) ── */}
                  {textOverlays
                    .filter((ov) => (ov.imageIndex ?? 0) === selectedImageIdx)
                    .map((ov) => {
                    const isSelected = activeOverlayId === ov.id;
                    const fontObj = OVERLAY_FONTS.find((f) => f.id === ov.font);
                    
                    return (
                      <div
                        key={ov.id}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          handleStartDrag(ov.id, e.clientX, e.clientY);
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          if (e.touches[0]) handleStartDrag(ov.id, e.touches[0].clientX, e.touches[0].clientY);
                        }}
                        style={{
                          left: `${ov.x}%`,
                          top: `${ov.y}%`,
                          transform: `translate(-50%, -50%) rotate(${ov.rotation}deg)`,
                          color: ov.effect === 'outline' ? 'transparent' : ov.color,
                          WebkitTextStroke: ov.effect === 'outline' ? `1.5px ${ov.color}` : undefined,
                          fontSize: `${ov.fontSize}px`,
                          letterSpacing: ov.letterSpacing ? `${ov.letterSpacing}px` : undefined,
                          opacity: ov.opacity / 100,
                          fontFamily: fontObj?.font || "'Clash Display', sans-serif",
                          textAlign: ov.align || 'center',
                          textShadow: 
                            ov.effect === 'neon' 
                              ? `0 0 12px ${ov.color}, 0 0 24px ${ov.color}`
                              : ov.effect === 'shadow'
                              ? '3px 3px 0px rgba(0,0,0,0.9), 6px 6px 0px rgba(0,0,0,0.4)'
                              : '0 2px 10px rgba(0,0,0,0.85)',
                        }}
                        className={`absolute cursor-move select-none px-2.5 py-1 transition-all z-20 ${
                          ov.effect === 'glass'
                            ? 'bg-black/50 backdrop-blur-md border border-white/25 rounded-xl shadow-lg'
                            : ov.effect === 'brutalist'
                            ? 'bg-black text-white border-2 border-current shadow-[4px_4px_0px_rgba(0,0,0,0.9)] rounded-none'
                            : 'rounded-lg'
                        } ${
                          isSelected
                            ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]'
                            : 'hover:outline hover:outline-1 hover:outline-white/40'
                        }`}
                      >
                        <span className="font-extrabold tracking-wider leading-none">
                          {ov.isUppercase ? ov.text.toUpperCase() : ov.text}
                        </span>
                      </div>
                    );
                  })}

                  {/* Bottom Carousel Dots Indicator */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setSelectedImageIdx(i);
                            setActiveOverlayId(null);
                          }}
                          className={`rounded-full transition-all cursor-pointer ${
                            i === selectedImageIdx ? 'w-2 h-2 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Interactive Open FX Studio Overlay Pill */}
                  {!isStudioFlipped && (
                    <button
                      type="button"
                      onClick={() => setIsStudioFlipped(true)}
                      className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md hover:bg-black text-white text-xs font-mono font-semibold border border-white/20 shadow-xl flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer z-10"
                    >
                      <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Open FX Studio</span>
                    </button>
                  )}

                  {/* Compare Indicator Pill */}
                  {isComparingOriginal && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-lg z-20">
                      RAW ORIGINAL
                    </div>
                  )}

                  {/* Remove image button */}
                  <button
                    type="button"
                    onClick={() => removeImage(selectedImageIdx)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 hover:bg-rose-600 text-white transition cursor-pointer shadow-lg z-10"
                    title="Remove this slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full max-w-[340px] aspect-square rounded-3xl border-2 border-dashed border-zinc-700 hover:border-cyan-400/60 flex flex-col items-center justify-center text-center p-6 space-y-3 cursor-pointer group transition-colors bg-zinc-950/40"
                >
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:text-cyan-300 group-hover:scale-110 transition-all">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      Click to Upload Photos &amp; Videos
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Multiple pages / carousel slides supported</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Thumbnail & Multi-Slide Strip */}
            {images.length > 0 && (
              <div className="w-full flex items-center justify-center gap-2 pt-2 overflow-x-auto no-scrollbar">
                {images.map((img, i) => {
                  const isItemVideo = img.startsWith('data:video') || img.includes('.mp4') || img.includes('.webm') || img.includes('.mov');
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setSelectedImageIdx(i);
                        setActiveOverlayId(null);
                      }}
                      className={`w-11 h-11 rounded-xl overflow-hidden border-2 cursor-pointer transition shrink-0 relative ${
                        selectedImageIdx === i ? 'border-cyan-400 scale-105 shadow-md' : 'border-white/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {isItemVideo ? (
                        <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-[9px] font-mono text-cyan-300">▶ VID</div>
                      ) : (
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      )}
                      <span className="absolute bottom-0 right-0 px-1 text-[8px] bg-black/80 font-mono text-white rounded-tl">{i + 1}</span>
                    </div>
                  );
                })}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-11 h-11 rounded-xl border-2 border-dashed border-white/30 hover:border-white text-zinc-400 hover:text-white flex items-center justify-center transition shrink-0 cursor-pointer bg-white/5"
                  title="Add another slide / image / video"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ── RIGHT: 3D FLIP CONTAINER (5 cols) ── */}
          <div className="md:col-span-5 relative bg-[#0e0f16] flex flex-col justify-between overflow-hidden [perspective:1400px]">
            <AnimatePresence mode="wait">
              {!isStudioFlipped ? (
                /* ── FACE A: DISPATCH CAPTION & COMPOSITION ── */
                <motion.div
                  key="dispatch-face"
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col justify-between p-5 space-y-5 overflow-y-auto no-scrollbar"
                >
                  <div className="space-y-4">
                    {/* User Profile Dossier Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[2px]">
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white uppercase">
                            {(currentUserName || currentUserUsername || 'U')[0]?.toUpperCase() || 'U'}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{currentUserUsername}</p>
                          <p className="text-[10px] text-zinc-500">{currentUserName}</p>
                        </div>
                      </div>

                      {/* Privacy Badge Selector */}
                      <button
                        type="button"
                        onClick={() => setPrivacy(privacy === 'public' ? 'community' : privacy === 'community' ? 'mesh' : 'public')}
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer"
                      >
                        {privacy === 'public' && <Globe className="w-3 h-3 text-emerald-400" />}
                        {privacy === 'community' && <ShieldCheck className="w-3 h-3 text-cyan-400" />}
                        {privacy === 'mesh' && <Lock className="w-3 h-3 text-amber-400" />}
                        <span className="capitalize">{privacy === 'public' ? 'Public (Open)' : privacy === 'community' ? 'Community' : 'Private'}</span>
                      </button>
                    </div>

                    {/* Caption Textarea */}
                    <div className="space-y-2">
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value.slice(0, charLimit))}
                        placeholder="Write a caption or dispatch note..."
                        rows={4}
                        className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 resize-none focus:outline-none leading-relaxed border-none p-0"
                        style={{ fontFamily: OVERLAY_FONTS.find((f) => f.id === selectedFont)?.font || "'Clash Display', sans-serif" }}
                      />

                      {/* 10 Typography Styles */}
                      <div className="pt-2 border-t border-white/[0.06] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                            <Type className="w-3.5 h-3.5 text-cyan-400" />
                            <span>10 Typography Styles</span>
                          </div>
                          <span className="text-[10px] text-cyan-400 font-mono font-bold">
                            {OVERLAY_FONTS.find((f) => f.id === selectedFont)?.name || 'Clash Display'}
                          </span>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5 select-none">
                          {OVERLAY_FONTS.map((font) => (
                            <button
                              key={font.id}
                              type="button"
                              onClick={() => setSelectedFont(font.id)}
                              className={`h-8 rounded-xl flex flex-col items-center justify-center p-0.5 transition-all duration-200 cursor-pointer border ${
                                selectedFont === font.id
                                  ? 'bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.4)] scale-105 font-bold'
                                  : 'bg-white/[0.04] text-zinc-400 hover:text-white border-white/10'
                              }`}
                              title={font.name}
                            >
                              <span
                                className="text-[10px] truncate max-w-full font-bold"
                                style={{ fontFamily: font.font }}
                              >
                                {font.name.split(' ')[0]}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Emojis Quick Picker Row */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                          {EMOJI_PRESETS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => addEmoji(emoji)}
                              className="text-base hover:scale-125 transition p-1 cursor-pointer"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        <span className={`text-[11px] font-mono shrink-0 ml-2 ${
                          remaining < 20 ? 'text-rose-400 font-bold' : 'text-zinc-500'
                        }`}>
                          {remaining}
                        </span>
                      </div>
                    </div>

                    {/* Location Tag */}
                    <div className="pt-2 border-t border-white/[0.06] space-y-2">
                      <div 
                        onClick={() => setShowLocationPicker(!showLocationPicker)}
                        className="flex items-center justify-between text-xs text-zinc-300 hover:text-white cursor-pointer py-1"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-400" />
                          <span>{location || 'Add Location / Committee Node'}</span>
                        </div>
                        {location && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setLocation(''); }}
                            className="text-[10px] text-zinc-500 hover:text-rose-400 cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>

                      {showLocationPicker && (
                        <div className="p-2 rounded-xl bg-black/60 border border-white/10 space-y-1 text-xs">
                          {LOCATION_SUGGESTIONS.map((loc) => (
                            <button
                              key={loc}
                              onClick={() => { setLocation(loc); setShowLocationPicker(false); }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition flex items-center justify-between cursor-pointer text-xs"
                            >
                              <span>{loc}</span>
                              {location === loc && <Check className="w-3 h-3 text-emerald-400" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tags Selector */}
                    <div className="pt-2 border-t border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Hash className="w-4 h-4 text-violet-400" />
                        <span>Hashtags & Themes</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((t) => (
                          <span
                            key={t}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[11px] font-mono"
                          >
                            #{t}
                            <button
                              type="button"
                              onClick={() => removeTag(t)}
                              className="hover:text-rose-400 cursor-pointer ml-0.5"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(tagInput))}
                          placeholder="Add a tag..."
                          className="flex-1 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => addTag(tagInput)}
                          disabled={!tagInput.trim()}
                          className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold disabled:opacity-30 transition cursor-pointer"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    {/* Music / Song Track Attachment */}
                    <div className="pt-2 border-t border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <Music className="w-4 h-4 text-rose-400 shrink-0" />
                          <span className="font-mono truncate max-w-[200px]">
                            {attachedSong ? `${attachedSong.title} - ${attachedSong.artist}` : 'Attach Background Song'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {attachedSong && (
                            <button
                              type="button"
                              onClick={() => setAttachedSong(null)}
                              className="text-[10px] text-zinc-400 hover:text-rose-400 cursor-pointer font-mono mr-1"
                            >
                              Remove
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setIsMusicPickerOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-rose-300 text-[11px] font-mono font-bold transition cursor-pointer flex items-center gap-1"
                          >
                            <Music className="w-3 h-3" />
                            <span>{attachedSong ? 'Change' : '🎵 Add Song'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Verified Source & Political Citation (Mandatory for Policy & Institutional Trust) */}
                    <div className="pt-2 border-t border-white/[0.06] space-y-2">
                      <div 
                        onClick={() => setShowSourceFields(!showSourceFields)}
                        className="flex items-center justify-between text-xs text-zinc-300 hover:text-white cursor-pointer py-1"
                      >
                        <div className="flex items-center gap-2">
                          <Landmark className="w-4 h-4 text-cyan-400" />
                          <span className="font-medium">
                            {sourceName ? `Source: ${sourceName}` : 'Add Verified Source / Citation (Optional)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {sourceName && (
                            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[9px] font-mono">
                              Verified
                            </span>
                          )}
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {showSourceFields ? '▲' : '▼'}
                          </span>
                        </div>
                      </div>

                      {showSourceFields && (
                        <div className="p-3 rounded-2xl bg-black/60 border border-cyan-500/20 space-y-2 text-xs animate-in fade-in duration-150">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                              <span>Source Publisher / Institution Name</span>
                              <span className="text-cyan-400">*</span>
                            </label>
                            <input
                              type="text"
                              value={sourceName}
                              onChange={(e) => setSourceName(e.target.value)}
                              placeholder="e.g. PRS Legislative Research, UN Library, Supreme Court of India"
                              className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400/60 font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-zinc-400">
                              Verification / Document Reference URL
                            </label>
                            <input
                              type="url"
                              value={sourceUrl}
                              onChange={(e) => setSourceUrl(e.target.value)}
                              placeholder="https://prsindia.org/... or https://sci.gov.in/..."
                              className="w-full px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-400/60 font-mono"
                            />
                          </div>

                          {/* Quick suggested institutional sources & news outlets */}
                          <div className="pt-2 space-y-2">
                            <div>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">
                                National Newspapers (Page 30):
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {[
                                  { name: 'The Hindu', url: 'https://www.thehindu.com' },
                                  { name: 'Indian Express', url: 'https://indianexpress.com' },
                                  { name: 'Economic Times', url: 'https://economictimes.indiatimes.com' },
                                  { name: 'Hindustan Times', url: 'https://www.hindustantimes.com' },
                                  { name: 'Times of India', url: 'https://timesofindia.indiatimes.com' },
                                ].map((s) => (
                                  <button
                                    key={s.name}
                                    type="button"
                                    onClick={() => {
                                      setSourceName(s.name);
                                      setSourceUrl(s.url);
                                    }}
                                    className="px-2 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-[10px] font-mono text-rose-300 hover:text-rose-200 transition cursor-pointer"
                                  >
                                    + {s.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">
                                Parliamentary Broadcasts &amp; Transcripts (Page 31):
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {[
                                  { name: 'Sansad TV', url: 'https://sansadtv.nic.in' },
                                  { name: 'Lok Sabha Debates', url: 'https://loksabha.nic.in' },
                                  { name: 'Rajya Sabha Proceedings', url: 'https://rajyasabha.nic.in' },
                                ].map((s) => (
                                  <button
                                    key={s.name}
                                    type="button"
                                    onClick={() => {
                                      setSourceName(s.name);
                                      setSourceUrl(s.url);
                                    }}
                                    className="px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-[10px] font-mono text-amber-300 hover:text-amber-200 transition cursor-pointer"
                                  >
                                    + {s.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">
                                Supplementary &amp; Investigative Media (Page 31):
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {[
                                  { name: 'The Print', url: 'https://theprint.in' },
                                  { name: 'Mint', url: 'https://www.livemint.com' },
                                  { name: 'The Wire', url: 'https://thewire.in' },
                                  { name: 'Newslaundry', url: 'https://www.newslaundry.com' },
                                  { name: 'Molitics', url: 'https://molitics.in' },
                                  { name: 'Frontline', url: 'https://frontline.thehindu.com' },
                                  { name: 'Outlook India', url: 'https://www.outlookindia.com' },
                                  { name: 'India Today', url: 'https://www.indiatoday.in' },
                                  { name: 'TIME', url: 'https://time.com' },
                                ].map((s) => (
                                  <button
                                    key={s.name}
                                    type="button"
                                    onClick={() => {
                                      setSourceName(s.name);
                                      setSourceUrl(s.url);
                                    }}
                                    className="px-2 py-0.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-[10px] font-mono text-purple-300 hover:text-purple-200 transition cursor-pointer"
                                  >
                                    + {s.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <span className="text-[9px] font-mono text-zinc-500 uppercase block mb-1">
                                Official Law, Judgments &amp; CAD (Pages 29–30):
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {[
                                  { name: 'CAD India (Debates)', url: 'https://cadindia.clpr.org.in/' },
                                  { name: 'Supreme Court (sci.gov.in)', url: 'https://sci.gov.in' },
                                  { name: 'Ministry of Law & Justice', url: 'https://legislative.gov.in' },
                                  { name: 'PRS India', url: 'https://prsindia.org' },
                                  { name: 'CLPR', url: 'https://clpr.org.in' },
                                  { name: 'Vidhi Legal', url: 'https://vidhilegalpolicy.in' },
                                  { name: 'PIB Factcheck', url: 'https://pib.gov.in' },
                                  { name: 'ECI', url: 'https://eci.gov.in' },
                                  { name: 'CAG India', url: 'https://cag.gov.in' },
                                ].map((s) => (
                                  <button
                                    key={s.name}
                                    type="button"
                                    onClick={() => {
                                      setSourceName(s.name);
                                      setSourceUrl(s.url);
                                    }}
                                    className="px-2 py-0.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-[10px] font-mono text-cyan-300 hover:text-cyan-200 transition cursor-pointer"
                                  >
                                    + {s.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Actions Helper */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span>Verified Youth Network Dispatch</span>
                    <span>ZenPulse Studio</span>
                  </div>
                </motion.div>
              ) : (
                /* ── FACE B: IN-PLACE PRO FX & TEXT STUDIO INTERFACE ── */
                <motion.div
                  key="studio-face"
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 flex flex-col justify-between p-5 space-y-4 overflow-y-auto no-scrollbar bg-[#0a0b12]"
                >
                  <div className="space-y-3.5">
                    {/* Header Bar */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-cyan-400" />
                        <span 
                          className="font-bold text-xs uppercase tracking-widest text-white"
                          style={{ fontFamily: 'Clash Display, var(--font-space), sans-serif' }}
                        >
                          Pro FX Studio Suite
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Compare Raw Original Button (Press and hold) */}
                        <button
                          type="button"
                          onMouseDown={() => setIsComparingOriginal(true)}
                          onMouseUp={() => setIsComparingOriginal(false)}
                          onTouchStart={() => setIsComparingOriginal(true)}
                          onTouchEnd={() => setIsComparingOriginal(false)}
                          className={`text-[11px] font-mono px-2 py-0.5 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                            isComparingOriginal
                              ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                              : 'bg-white/[0.04] border-white/10 text-zinc-400 hover:text-white'
                          }`}
                          title="Press & hold to compare with raw original"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Compare</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleResetAdjustments}
                          className="text-[11px] font-mono text-zinc-400 hover:text-rose-400 flex items-center gap-1 transition cursor-pointer"
                          title="Reset all FX & text layers to default"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                    {/* Mode 5-Tab Navigation Pill Bar */}
                    <div className="grid grid-cols-5 gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-semibold select-none">
                      <button
                        type="button"
                        onClick={() => setStudioTab('filters')}
                        className={`py-1.5 rounded-xl transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                          studioTab === 'filters' ? 'bg-white text-black font-bold shadow-md' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Palette className="w-3 h-3" />
                        <span>Filters</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStudioTab('tune')}
                        className={`py-1.5 rounded-xl transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                          studioTab === 'tune' ? 'bg-white text-black font-bold shadow-md' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        <span>Tune</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStudioTab('text')}
                        className={`py-1.5 rounded-xl transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                          studioTab === 'text' ? 'bg-white text-black font-bold shadow-md' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Type className="w-3 h-3" />
                        <span>Text</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStudioTab('stickers')}
                        className={`py-1.5 rounded-xl transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                          studioTab === 'stickers' ? 'bg-white text-black font-bold shadow-md' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Badges</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStudioTab('transform')}
                        className={`py-1.5 rounded-xl transition cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 text-[11px] ${
                          studioTab === 'transform' ? 'bg-white text-black font-bold shadow-md' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Crop className="w-3 h-3" />
                        <span>Canvas</span>
                      </button>
                    </div>

                    {/* ── TAB 1: INSTAGRAM PHOTO FILTERS & EFFECTS ── */}
                    {studioTab === 'filters' && (
                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-zinc-400 font-mono">Photo Effects &amp; Filters:</p>
                          <button
                            type="button"
                            onClick={handleAutoEnhance}
                            disabled={images.length === 0}
                            className={`px-2.5 py-0.5 rounded-lg border text-[11px] font-mono flex items-center gap-1 transition ${
                              images.length === 0
                                ? 'bg-zinc-800/40 border-zinc-700/40 text-zinc-500 cursor-not-allowed opacity-50'
                                : 'bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 cursor-pointer'
                            }`}
                            title={images.length === 0 ? 'Upload an image first to auto enhance' : 'Auto balance tone, contrast & lighting'}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Auto Enhance</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[310px] overflow-y-auto no-scrollbar pr-1">
                          {FX_FILTERS.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setActiveFilterId(f.id)}
                              className={`p-2 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                                activeFilterId === f.id
                                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-zinc-300'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${f.thumb} shrink-0 border border-white/20 shadow-inner`} />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold truncate">{f.name}</p>
                                <p className="text-[9px] text-zinc-500 font-mono truncate">{f.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── TAB 2: PRO TUNE / ADJUSTMENTS ── */}
                    {studioTab === 'tune' && (
                      <div className="space-y-3 pt-1 max-h-[320px] overflow-y-auto no-scrollbar pr-1">
                        <div className="flex items-center justify-between pb-1 border-b border-white/5">
                          <span className="text-[11px] text-zinc-400 font-mono">Fine-Tune Color &amp; Optics</span>
                          <button
                            type="button"
                            onClick={handleAutoEnhance}
                            disabled={images.length === 0}
                            className={`text-[11px] font-mono flex items-center gap-1 transition ${
                              images.length === 0
                                ? 'text-zinc-600 cursor-not-allowed opacity-50'
                                : 'text-cyan-400 hover:text-cyan-300 cursor-pointer'
                            }`}
                            title={images.length === 0 ? 'Upload an image first to auto enhance' : 'Auto balance tone, contrast & lighting'}
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Auto Enhance</span>
                          </button>
                        </div>

                        {/* Brightness */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-300 flex items-center gap-1.5">
                              <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                              <span>Brightness</span>
                            </span>
                            <span className="text-zinc-400 font-mono text-[11px]">{brightness}%</span>
                          </div>
                          <input
                            type="range"
                            min={40}
                            max={160}
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Contrast */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-300 flex items-center gap-1.5">
                              <Contrast className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Contrast</span>
                            </span>
                            <span className="text-zinc-400 font-mono text-[11px]">{contrast}%</span>
                          </div>
                          <input
                            type="range"
                            min={40}
                            max={160}
                            value={contrast}
                            onChange={(e) => setContrast(Number(e.target.value))}
                            className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Saturation */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-300 flex items-center gap-1.5">
                              <Droplets className="w-3.5 h-3.5 text-rose-400" />
                              <span>Saturation</span>
                            </span>
                            <span className="text-zinc-400 font-mono text-[11px]">{saturation}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={200}
                            value={saturation}
                            onChange={(e) => setSaturation(Number(e.target.value))}
                            className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Warmth */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-300 flex items-center gap-1.5">
                              <Flame className="w-3.5 h-3.5 text-orange-400" />
                              <span>Color Warmth</span>
                            </span>
                            <span className="text-zinc-400 font-mono text-[11px]">{warmth}</span>
                          </div>
                          <input
                            type="range"
                            min={-50}
                            max={50}
                            value={warmth}
                            onChange={(e) => setWarmth(Number(e.target.value))}
                            className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Blur Soft Focus */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-300 flex items-center gap-1.5">
                              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Soft Focus Blur</span>
                            </span>
                            <span className="text-zinc-400 font-mono text-[11px]">{blur}px</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={10}
                            step={0.5}
                            value={blur}
                            onChange={(e) => setBlur(Number(e.target.value))}
                            className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        {/* Vignette */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-zinc-300 flex items-center gap-1.5">
                              <Sliders className="w-3.5 h-3.5 text-purple-400" />
                              <span>Vignette Border</span>
                            </span>
                            <span className="text-zinc-400 font-mono text-[11px]">{vignette}%</span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={vignette}
                            onChange={(e) => setVignette(Number(e.target.value))}
                            className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {/* ── TAB 3: TYPOGRAPHY & UNRESTRICTED DRAGGABLE TEXT ── */}
                    {studioTab === 'text' && (
                      <div className="space-y-3 pt-1 max-h-[320px] overflow-y-auto no-scrollbar pr-1">
                        {/* Layer Manager Row */}
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
                            {images.length > 1 && (
                              <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[9px] font-mono font-bold text-cyan-300 shrink-0">
                                Slide {selectedImageIdx + 1}/{images.length}
                              </span>
                            )}
                            {textOverlays
                              .filter((ov) => (ov.imageIndex ?? 0) === selectedImageIdx)
                              .map((ov, idx) => (
                              <button
                                key={ov.id}
                                type="button"
                                onClick={() => setActiveOverlayId(ov.id)}
                                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer shrink-0 ${
                                  activeOverlayId === ov.id
                                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'
                                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
                                }`}
                              >
                                Layer {idx + 1}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {activeOverlayObj && (
                              <button
                                type="button"
                                onClick={handleDuplicateOverlay}
                                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs transition cursor-pointer"
                                title="Duplicate layer on this slide"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={handleAddTextOverlay}
                              className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                              title={`Add text to image ${selectedImageIdx + 1}`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>

                        {textOverlays.filter((ov) => (ov.imageIndex ?? 0) === selectedImageIdx).length === 0 && !activeOverlayObj && (
                          <div className="p-3 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center space-y-1.5 my-2">
                            <p className="text-[11px] text-zinc-400 font-mono">
                              No text on image {selectedImageIdx + 1} of {images.length || 1}
                            </p>
                            <button
                              type="button"
                              onClick={handleAddTextOverlay}
                              className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold transition cursor-pointer"
                            >
                              + Add Text to Image {selectedImageIdx + 1}
                            </button>
                          </div>
                        )}

                        {activeOverlayObj ? (
                          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                            {/* Text Input */}
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-400 font-mono uppercase">Text Content</label>
                              <input
                                type="text"
                                value={activeOverlayObj.text}
                                onChange={(e) => handleUpdateActiveOverlay({ text: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400 font-semibold"
                                placeholder="Type your overlay text..."
                              />
                            </div>

                            {/* Typography / Font Selector */}
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-400 font-mono uppercase">Font Family (10 Sovereign Fonts)</label>
                              <div className="grid grid-cols-2 gap-1 max-h-[110px] overflow-y-auto no-scrollbar pr-1">
                                {OVERLAY_FONTS.map((font) => (
                                  <button
                                    key={font.id}
                                    type="button"
                                    onClick={() => handleUpdateActiveOverlay({ font: font.id })}
                                    className={`py-1 px-2 rounded-lg text-xs transition cursor-pointer border text-left truncate ${
                                      activeOverlayObj.font === font.id
                                        ? 'bg-white text-black border-white font-bold shadow-sm'
                                        : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                                    }`}
                                  >
                                    <span style={{ fontFamily: font.font }}>{font.name}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Typography Effect Styles */}
                            <div className="space-y-1">
                              <label className="text-[9px] text-zinc-400 font-mono uppercase">Text Effect Preset</label>
                              <div className="grid grid-cols-3 gap-1">
                                {OVERLAY_EFFECTS.map((eff) => (
                                  <button
                                    key={eff.id}
                                    type="button"
                                    onClick={() => handleUpdateActiveOverlay({ effect: eff.id })}
                                    className={`py-1 px-2 rounded-lg text-[10px] font-mono transition cursor-pointer border ${
                                      activeOverlayObj.effect === eff.id
                                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                                    }`}
                                  >
                                    {eff.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Sliders Grid */}
                            <div className="grid grid-cols-2 gap-2">
                              {/* Size Slider */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-zinc-400">Size</span>
                                  <span className="text-zinc-300">{activeOverlayObj.fontSize}px</span>
                                </div>
                                <input
                                  type="range"
                                  min={12}
                                  max={80}
                                  value={activeOverlayObj.fontSize}
                                  onChange={(e) => handleUpdateActiveOverlay({ fontSize: Number(e.target.value) })}
                                  className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                />
                              </div>

                              {/* Letter Spacing */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-zinc-400">Spacing</span>
                                  <span className="text-zinc-300">{activeOverlayObj.letterSpacing || 0}px</span>
                                </div>
                                <input
                                  type="range"
                                  min={-2}
                                  max={12}
                                  value={activeOverlayObj.letterSpacing || 0}
                                  onChange={(e) => handleUpdateActiveOverlay({ letterSpacing: Number(e.target.value) })}
                                  className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                />
                              </div>

                              {/* Rotation Slider */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-zinc-400">Rotation</span>
                                  <span className="text-zinc-300">{activeOverlayObj.rotation}°</span>
                                </div>
                                <input
                                  type="range"
                                  min={-180}
                                  max={180}
                                  value={activeOverlayObj.rotation}
                                  onChange={(e) => handleUpdateActiveOverlay({ rotation: Number(e.target.value) })}
                                  className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                />
                              </div>

                              {/* Opacity Slider */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-zinc-400">Opacity</span>
                                  <span className="text-zinc-300">{activeOverlayObj.opacity}%</span>
                                </div>
                                <input
                                  type="range"
                                  min={10}
                                  max={100}
                                  value={activeOverlayObj.opacity}
                                  onChange={(e) => handleUpdateActiveOverlay({ opacity: Number(e.target.value) })}
                                  className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
                                />
                              </div>
                            </div>

                            {/* Color Palette & Custom Hex */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-center justify-between text-[9px] text-zinc-400 font-mono">
                                <span>COLOR SWATCH</span>
                                <span className="uppercase">{activeOverlayObj.color}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                {SWATCH_COLORS.map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => handleUpdateActiveOverlay({ color: c })}
                                    style={{ backgroundColor: c }}
                                    className={`w-5 h-5 rounded-full border transition cursor-pointer ${
                                      activeOverlayObj.color.toLowerCase() === c.toLowerCase()
                                        ? 'border-white ring-2 ring-cyan-400 scale-110 shadow-lg'
                                        : 'border-white/20 opacity-80 hover:opacity-100'
                                    }`}
                                  />
                                ))}

                                {/* Custom Color Hex input */}
                                <div className="flex items-center gap-1 ml-auto">
                                  <input
                                    type="color"
                                    value={activeOverlayObj.color}
                                    onChange={(e) => handleUpdateActiveOverlay({ color: e.target.value })}
                                    className="w-5 h-5 rounded-md cursor-pointer border border-white/20 bg-transparent"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Alignment & Uppercase & Delete */}
                            <div className="flex items-center justify-between pt-2 border-t border-white/10">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateActiveOverlay({ align: 'left' })}
                                  className={`p-1 rounded-lg border text-xs cursor-pointer ${
                                    activeOverlayObj.align === 'left' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-400'
                                  }`}
                                  title="Align Left"
                                >
                                  <AlignLeft className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateActiveOverlay({ align: 'center' })}
                                  className={`p-1 rounded-lg border text-xs cursor-pointer ${
                                    !activeOverlayObj.align || activeOverlayObj.align === 'center' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-400'
                                  }`}
                                  title="Align Center"
                                >
                                  <AlignCenter className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateActiveOverlay({ align: 'right' })}
                                  className={`p-1 rounded-lg border text-xs cursor-pointer ${
                                    activeOverlayObj.align === 'right' ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-zinc-400'
                                  }`}
                                  title="Align Right"
                                >
                                  <AlignRight className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleUpdateActiveOverlay({ isUppercase: !activeOverlayObj.isUppercase })}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-mono transition cursor-pointer border ml-1 ${
                                    activeOverlayObj.isUppercase ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300 font-bold' : 'bg-white/5 border-white/10 text-zinc-400'
                                  }`}
                                >
                                  AA
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={handleRemoveActiveOverlay}
                                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 rounded-2xl border border-dashed border-zinc-800 text-center space-y-2">
                            <Type className="w-6 h-6 text-zinc-600 mx-auto" />
                            <p className="text-xs text-zinc-400">Click &quot;Add&quot; to place sovereign text overlays.</p>
                            <p className="text-[10px] text-cyan-400 font-mono">💡 Drag text anywhere freely on the canvas without limits!</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── TAB 4: 1-CLICK STICKERS & BADGES ── */}
                    {studioTab === 'stickers' && (
                      <div className="space-y-3 pt-1">
                        <p className="text-[11px] text-zinc-400 font-mono">Click to stamp a sovereign badge onto canvas:</p>
                        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                          {STICKER_PRESETS.map((stk) => (
                            <button
                              key={stk.id}
                              type="button"
                              onClick={() => handleAddStickerPreset(stk)}
                              className="p-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-cyan-400/50 hover:bg-cyan-500/10 text-left transition cursor-pointer space-y-1 group"
                            >
                              <p className="text-xs font-bold text-white group-hover:text-cyan-300 transition">
                                {stk.label}
                              </p>
                              <div className="inline-block px-2 py-0.5 rounded-lg bg-black/60 border border-white/20 text-[10px] font-mono" style={{ color: stk.color }}>
                                {stk.text}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── TAB 5: CANVAS TRANSFORMS & ROTATIONS ── */}
                    {studioTab === 'transform' && (
                      <div className="space-y-4 pt-1">
                        <p className="text-[11px] text-zinc-400 font-mono">Rotate, Mirror, and Orient your canvas:</p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setRotationDeg((prev) => (prev + 90) % 360)}
                            className="p-3 rounded-2xl border border-white/10 bg-white/[0.03] hover:border-white/20 text-center space-y-1.5 transition cursor-pointer"
                          >
                            <RotateCw className="w-5 h-5 text-cyan-400 mx-auto" />
                            <p className="text-[11px] font-bold text-white">Rotate 90°</p>
                            <p className="text-[9px] text-zinc-500 font-mono">{rotationDeg}°</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFlipH(!flipH)}
                            className={`p-3 rounded-2xl border text-center space-y-1.5 transition cursor-pointer ${
                              flipH ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'border-white/10 bg-white/[0.03] text-zinc-300'
                            }`}
                          >
                            <FlipHorizontal className="w-5 h-5 mx-auto" />
                            <p className="text-[11px] font-bold">Flip Horiz</p>
                            <p className="text-[9px] text-zinc-500 font-mono">{flipH ? 'Mirrored' : 'Off'}</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setFlipV(!flipV)}
                            className={`p-3 rounded-2xl border text-center space-y-1.5 transition cursor-pointer ${
                              flipV ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' : 'border-white/10 bg-white/[0.03] text-zinc-300'
                            }`}
                          >
                            <FlipHorizontal className="w-5 h-5 mx-auto rotate-90" />
                            <p className="text-[11px] font-bold">Flip Vert</p>
                            <p className="text-[9px] text-zinc-500 font-mono">{flipV ? 'Inverted' : 'Off'}</p>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono">
                          <span>Current Transform:</span>
                          <span className="text-white font-bold">{rotationDeg}° | H:{flipH ? 'Yes' : 'No'} | V:{flipV ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Flip Back Action */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsStudioFlipped(false)}
                      className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer font-mono"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span>Back to Dispatch</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsStudioFlipped(false)}
                      className="px-4 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Apply &amp; Return</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ─── MUSIC TRACK PICKER MODAL ─── */}
      <MusicPickerModal
        isOpen={isMusicPickerOpen}
        onClose={() => setIsMusicPickerOpen(false)}
        onSelectTrack={(t) => setAttachedSong(t)}
        selectedTrackTitle={attachedSong?.title}
      />
    </div>
  );
}

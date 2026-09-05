'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Check,
  RotateCcw,
  Sliders,
  Type,
  Palette,
  Eye,
  Trash2,
  Plus,
  Move,
  RotateCw,
  Crop,
  Maximize2
} from 'lucide-react';

export interface TextOverlay {
  id: string;
  text: string;
  font: string;
  color: string;
  fontSize: number;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  rotation: number;
  opacity: number;
  letterSpacing: number;
  isUppercase: boolean;
}

export interface PresetFilter {
  id: string;
  name: string;
  css: string;
}

export const PRESETS: PresetFilter[] = [
  { id: 'none', name: 'Original', css: 'none' },
  { id: 'mono', name: 'Monochrome', css: 'grayscale(100%) contrast(120%)' },
  { id: 'film', name: '35mm Film', css: 'sepia(20%) contrast(110%) saturate(115%)' },
  { id: 'noir', name: 'Deep Noir', css: 'grayscale(100%) contrast(150%) brightness(85%)' },
  { id: 'warm', name: 'Warm Tone', css: 'sepia(30%) saturate(120%) contrast(105%)' },
  { id: 'cool', name: 'Cool Slate', css: 'hue-rotate(180deg) saturate(90%) contrast(110%)' },
  { id: 'editorial', name: 'Editorial', css: 'contrast(125%) saturate(85%) brightness(102%)' },
  { id: 'fade', name: 'Matte Fade', css: 'contrast(90%) brightness(110%) saturate(90%)' },
];

export const FILTER_PRESETS = PRESETS.map(p => ({
  id: p.id,
  name: p.name,
  category: 'Modern' as const,
  gradientThumb: 'from-zinc-700 to-zinc-900',
  filterCss: p.css,
  description: p.name
}));

export const FONTS = [
  { id: 'clash', name: 'Zenvitra Sovereign', style: { fontFamily: "'Clash Display', sans-serif", fontWeight: 700 } },
  { id: 'syne', name: 'ZenPulse Hyper', style: { fontFamily: "'Syne', sans-serif", fontWeight: 800 } },
  { id: 'marker', name: 'ZenStreet Rebel', style: { fontFamily: "'Permanent Marker', cursive", fontWeight: 400 } },
  { id: 'impact', name: 'Pulse Vanguard', style: { fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.08em', fontWeight: 700 } },
  { id: 'serif', name: 'Zenvitra Editorial', style: { fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 600 } },
  { id: 'cyber', name: 'ZenMatrix Cyber', style: { fontFamily: "'Orbitron', sans-serif", fontWeight: 800 } },
  { id: 'mono', name: 'ZenCipher Ledger', style: { fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 } },
  { id: 'signature', name: 'Zenvitra Atelier', style: { fontFamily: "'Dancing Script', cursive", fontWeight: 700 } },
  { id: 'vogue', name: 'ZenDynasty Royale', style: { fontFamily: "'Cinzel', serif", fontWeight: 600 } },
  { id: 'sans', name: 'ZenPulse Minimal', style: { fontFamily: 'Inter, -apple-system, sans-serif', fontWeight: 600 } },
];

export const FONT_OPTIONS = FONTS;

export const TEXT_EFFECTS = [
  { id: 'none', name: 'Clean', badge: 'BASIC' },
  { id: 'neon', name: 'Glow', badge: 'GLOW' },
  { id: 'glass', name: 'Glass', badge: 'GLASS' },
  { id: 'brutalist', name: 'Slab', badge: 'STARK' },
  { id: 'outline', name: 'Outline', badge: 'MINIMAL' },
];

export const MINIMAL_COLORS = [
  '#ffffff',
  '#f4f4f5',
  '#a1a1aa',
  '#52525b',
  '#18181b',
  '#000000',
  '#38bdf8',
  '#fbbf24',
  '#f87171',
];

export const STANDARD_ASPECT_RATIOS = [
  { id: '1:1', label: '1:1 Square', ratio: '1 / 1' },
  { id: '4:5', label: '4:5 Portrait', ratio: '4 / 5' },
  { id: '9:16', label: '9:16 Story', ratio: '9 / 16' },
  { id: '16:9', label: '16:9 Cinema', ratio: '16 / 9' },
  { id: '3:4', label: '3:4 Photo', ratio: '3 / 4' },
  { id: '2:3', label: '2:3 Classic', ratio: '2 / 3' },
  { id: 'custom', label: 'Custom', ratio: 'custom' },
];

interface MediaStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialImage?: string;
  onApply: (processedImageUrl: string, metadata?: { filter: string; textOverlays: TextOverlay[]; aspectRatio?: string }) => void;
  aspectRatio?: '1:1' | '4:5' | '16:9' | '9:16';
  mediaType?: 'image' | 'video';
}

export function MediaStudioModal({
  isOpen,
  onClose,
  initialImage,
  onApply,
  aspectRatio: defaultAspect = '1:1'
}: MediaStudioModalProps) {
  const [currentMedia, setCurrentMedia] = useState<string>(initialImage || '');
  const [activeTab, setActiveTab] = useState<'text' | 'presets' | 'tune' | 'crop'>('text');
  const [selectedPreset, setSelectedPreset] = useState<string>('none');

  // Aspect Ratio & Custom Aspect Ratio
  const [selectedAspect, setSelectedAspect] = useState<string>(defaultAspect);
  const [customWidth, setCustomWidth] = useState<number>(4);
  const [customHeight, setCustomHeight] = useState<number>(3);

  // Minimal Adjustments
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturate, setSaturate] = useState<number>(100);
  const [warmth, setWarmth] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [vignette, setVignette] = useState<boolean>(false);
  const [compareOriginal, setCompareOriginal] = useState<boolean>(false);

  // Minimal Draggable Text Overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([
    {
      id: '1',
      text: 'HEADING',
      font: 'sans',
      color: '#ffffff',
      fontSize: 32,
      x: 50,
      y: 50,
      rotation: 0,
      opacity: 100,
      letterSpacing: 2,
      isUppercase: true
    }
  ]);
  const [editingOverlayId, setEditingOverlayId] = useState<string>('1');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialImage) setCurrentMedia(initialImage);
  }, [initialImage]);

  if (!isOpen) return null;

  // Compute CSS filter
  const activePresetObj = PRESETS.find((p) => p.id === selectedPreset) || PRESETS[0];
  const presetCss = activePresetObj.css !== 'none' ? activePresetObj.css : '';
  const warmthCss = warmth !== 0 ? `sepia(${warmth}%)` : '';
  const adjustCss = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) ${blur > 0 ? `blur(${blur}px)` : ''} ${warmthCss}`.trim();
  const finalFilter = compareOriginal ? 'none' : `${presetCss} ${adjustCss}`.trim() || 'none';

  // Calculate CSS aspect ratio
  const getAspectRatioStyle = () => {
    if (selectedAspect === 'custom') {
      const w = Math.max(1, customWidth || 1);
      const h = Math.max(1, customHeight || 1);
      return { aspectRatio: `${w} / ${h}` };
    }
    const found = STANDARD_ASPECT_RATIOS.find((r) => r.id === selectedAspect);
    return { aspectRatio: found ? found.ratio : '1 / 1' };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setCurrentMedia(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextOverlay = () => {
    const newId = Date.now().toString();
    const newOverlay: TextOverlay = {
      id: newId,
      text: 'TEXT LAYER',
      font: 'sans',
      color: '#ffffff',
      fontSize: 28,
      x: 50,
      y: 50 + ((textOverlays.length * 8) % 30),
      rotation: 0,
      opacity: 100,
      letterSpacing: 1,
      isUppercase: true
    };
    setTextOverlays([...textOverlays, newOverlay]);
    setEditingOverlayId(newId);
    setActiveTab('text');
  };

  const updateActiveOverlay = (updates: Partial<TextOverlay>) => {
    setTextOverlays((prev) =>
      prev.map((item) => (item.id === editingOverlayId ? { ...item, ...updates } : item))
    );
  };

  const removeOverlay = (id: string) => {
    const remaining = textOverlays.filter((item) => item.id !== id);
    setTextOverlays(remaining);
    if (editingOverlayId === id) setEditingOverlayId(remaining[0]?.id || '');
  };

  const currentEditingOverlay = textOverlays.find((t) => t.id === editingOverlayId);

  // Minimal Canvas Pointer Drag
  const handleOverlayPointerDown = (e: React.PointerEvent, overlayId: string) => {
    e.stopPropagation();
    setActiveTab('text');
    setEditingOverlayId(overlayId);

    const container = viewportRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const overlay = textOverlays.find((o) => o.id === overlayId);
    if (!overlay) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = overlay.x ?? 50;
    const initialY = overlay.y ?? 50;

    const onPointerMove = (moveEvt: PointerEvent) => {
      const deltaX = moveEvt.clientX - startX;
      const deltaY = moveEvt.clientY - startY;

      const newX = Math.min(95, Math.max(5, initialX + (deltaX / rect.width) * 100));
      const newY = Math.min(95, Math.max(5, initialY + (deltaY / rect.height) * 100));

      setTextOverlays((prev) =>
        prev.map((o) =>
          o.id === overlayId ? { ...o, x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 } : o
        )
      );
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleApply = () => {
    if (!currentMedia) {
      onClose();
      return;
    }
    onApply(currentMedia, {
      filter: finalFilter,
      textOverlays,
      aspectRatio: selectedAspect === 'custom' ? `${customWidth}:${customHeight}` : selectedAspect
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none font-sans">
      <div className="w-full max-w-6xl h-[92vh] max-h-[900px] bg-[#0c0d10] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Minimal Clean Header */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-[#090a0d]">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold tracking-wider text-white uppercase">Studio Editor</span>
            <span className="text-zinc-600 text-sm">/</span>
            <span className="text-xs text-zinc-400 font-mono">
              {selectedAspect === 'custom' ? `Custom (${customWidth}:${customHeight})` : selectedAspect}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedPreset('none');
                setSelectedAspect('1:1');
                setBrightness(100);
                setContrast(100);
                setSaturate(100);
                setWarmth(0);
                setBlur(0);
                setVignette(false);
                setTextOverlays([]);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-zinc-200 transition flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Done</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* Canvas Area (7 Cols) - Expansive and Large */}
          <div className="lg:col-span-7 bg-[#050608] flex flex-col items-center justify-center p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-white/10 relative overflow-hidden">
            {currentMedia ? (
              <div
                ref={viewportRef}
                style={getAspectRatioStyle()}
                className="relative w-full max-w-[540px] max-h-[580px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black flex items-center justify-center transition-all duration-300"
              >
                <img
                  src={currentMedia}
                  alt="Canvas"
                  style={{ filter: finalFilter }}
                  className="w-full h-full object-cover select-none pointer-events-none"
                />

                {vignette && (
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)]" />
                )}

                {/* Free Drag Text Overlays */}
                {textOverlays.map((overlay) => {
                  const isEditing = editingOverlayId === overlay.id;
                  const fontObj = FONTS.find((f) => f.id === overlay.font) || FONTS[0];

                  return (
                    <div
                      key={overlay.id}
                      onPointerDown={(e) => handleOverlayPointerDown(e, overlay.id)}
                      style={{
                        left: `${overlay.x}%`,
                        top: `${overlay.y}%`,
                        transform: `translate(-50%, -50%) rotate(${overlay.rotation || 0}deg)`,
                      }}
                      className="absolute z-20 cursor-grab active:cursor-grabbing select-none touch-none"
                    >
                      <div
                        className={`transition-all ${
                          isEditing
                            ? 'border border-dashed border-white/80 p-2.5 rounded-xl bg-black/40'
                            : 'hover:border hover:border-white/20 p-2.5 rounded-xl'
                        }`}
                      >
                        <div
                          style={{
                            ...fontObj.style,
                            color: overlay.color,
                            fontSize: `${overlay.fontSize}px`,
                            opacity: (overlay.opacity ?? 100) / 100,
                            letterSpacing: `${overlay.letterSpacing || 0}px`,
                            textTransform: overlay.isUppercase ? 'uppercase' : 'none',
                          }}
                        >
                          {overlay.text}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Compare Original Button */}
                <button
                  type="button"
                  onMouseDown={() => setCompareOriginal(true)}
                  onMouseUp={() => setCompareOriginal(false)}
                  onTouchStart={() => setCompareOriginal(true)}
                  onTouchEnd={() => setCompareOriginal(false)}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black border border-white/15 text-xs text-zinc-300 transition flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Compare</span>
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-sm aspect-square rounded-2xl border border-dashed border-white/20 hover:border-white/40 transition flex flex-col items-center justify-center p-8 text-center space-y-4 cursor-pointer"
              >
                <Upload className="w-8 h-8 text-zinc-500" />
                <div>
                  <p className="text-sm font-medium text-zinc-300">Click to upload image</p>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">PNG, JPG, WebP</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Minimal Controls Sidebar (5 Cols) */}
          <div className="lg:col-span-5 bg-[#090a0d] flex flex-col min-h-0">
            
            {/* Minimal Nav Tabs */}
            <div className="flex border-b border-white/10 px-6 pt-3 bg-[#090a0d] gap-2">
              {[
                { id: 'text', label: 'Typography' },
                { id: 'crop', label: 'Aspect Ratio' },
                { id: 'presets', label: 'Presets' },
                { id: 'tune', label: 'Adjust' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2 text-xs font-medium transition cursor-pointer border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? 'border-white text-white font-semibold'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              
              {/* ── TAB 1: TYPOGRAPHY ── */}
              {activeTab === 'text' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                      Text Layers
                    </span>
                    <button
                      onClick={addTextOverlay}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Text</span>
                    </button>
                  </div>

                  {currentEditingOverlay ? (
                    <div className="space-y-4">
                      {/* Input */}
                      <input
                        type="text"
                        value={currentEditingOverlay.text}
                        onChange={(e) => updateActiveOverlay({ text: e.target.value })}
                        placeholder="Enter text..."
                        className="w-full px-4 py-2.5 rounded-xl bg-black border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40 font-mono"
                      />

                      {/* Font Selector */}
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400">Font</label>
                        <div className="grid grid-cols-2 gap-2">
                          {FONTS.map((f) => (
                            <button
                              key={f.id}
                              onClick={() => updateActiveOverlay({ font: f.id })}
                              className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer truncate ${
                                currentEditingOverlay.font === f.id
                                  ? 'bg-white/15 border-white/40 text-white font-medium'
                                  : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                              }`}
                              style={f.style}
                            >
                              {f.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Align Presets */}
                      <div className="space-y-2">
                        <label className="text-xs text-zinc-400">Position Preset</label>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          {[
                            { label: 'Top', x: 50, y: 15 },
                            { label: 'Center', x: 50, y: 50 },
                            { label: 'Bottom', x: 50, y: 85 },
                          ].map((pos) => (
                            <button
                              key={pos.label}
                              type="button"
                              onClick={() => updateActiveOverlay({ x: pos.x, y: pos.y })}
                              className="py-2 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition cursor-pointer text-center text-xs"
                            >
                              {pos.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sliders */}
                      <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
                        {/* Size */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-zinc-400 text-xs">
                            <span>Font Size</span>
                            <span className="text-white font-mono">{currentEditingOverlay.fontSize}px</span>
                          </div>
                          <input
                            type="range"
                            min="14"
                            max="72"
                            value={currentEditingOverlay.fontSize}
                            onChange={(e) => updateActiveOverlay({ fontSize: Number(e.target.value) })}
                            className="w-full accent-white cursor-pointer"
                          />
                        </div>

                        {/* Rotation */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-zinc-400 text-xs">
                            <span>Rotation</span>
                            <span className="text-white font-mono">{currentEditingOverlay.rotation || 0}°</span>
                          </div>
                          <input
                            type="range"
                            min="-90"
                            max="90"
                            value={currentEditingOverlay.rotation || 0}
                            onChange={(e) => updateActiveOverlay({ rotation: Number(e.target.value) })}
                            className="w-full accent-white cursor-pointer"
                          />
                        </div>

                        {/* Letter Spacing */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-zinc-400 text-xs">
                            <span>Letter Spacing</span>
                            <span className="text-white font-mono">{currentEditingOverlay.letterSpacing || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            value={currentEditingOverlay.letterSpacing || 0}
                            onChange={(e) => updateActiveOverlay({ letterSpacing: Number(e.target.value) })}
                            className="w-full accent-white cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Color Palette */}
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <label className="text-xs text-zinc-400">Color</label>
                        <div className="flex flex-wrap gap-2.5">
                          {MINIMAL_COLORS.map((col) => (
                            <button
                              key={col}
                              type="button"
                              onClick={() => updateActiveOverlay({ color: col })}
                              style={{ backgroundColor: col }}
                              className={`w-6 h-6 rounded-full border cursor-pointer transition-transform ${
                                currentEditingOverlay.color === col
                                  ? 'scale-125 border-white shadow-md'
                                  : 'border-white/20 hover:scale-110'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Delete */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => removeOverlay(currentEditingOverlay.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 cursor-pointer py-1 px-2.5 rounded-lg hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Layer</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center text-xs text-zinc-500 space-y-2">
                      <p>No text layer selected.</p>
                      <button
                        onClick={addTextOverlay}
                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white transition cursor-pointer"
                      >
                        + Create Text Layer
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 2: ASPECT RATIO & CUSTOM ASPECT ── */}
              {activeTab === 'crop' && (
                <div className="space-y-5">
                  <div>
                    <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                      Canvas Aspect Ratio
                    </span>
                    <p className="text-xs text-zinc-500 mt-1">
                      Choose standard proportions or set your custom canvas ratio.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {STANDARD_ASPECT_RATIOS.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedAspect(item.id)}
                        className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                          selectedAspect === item.id
                            ? 'bg-white/15 border-white/50 text-white font-medium'
                            : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{item.label}</span>
                          {selectedAspect === item.id && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Aspect Ratio Inputs */}
                  {selectedAspect === 'custom' && (
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                      <span className="text-xs font-mono text-zinc-300 font-bold block">
                        Custom Ratio (Width : Height)
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] text-zinc-400">Width Ratio</label>
                          <input
                            type="number"
                            min="1"
                            max="32"
                            value={customWidth}
                            onChange={(e) => setCustomWidth(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-xs text-white focus:outline-none focus:border-white/50 font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] text-zinc-400">Height Ratio</label>
                          <input
                            type="number"
                            min="1"
                            max="32"
                            value={customHeight}
                            onChange={(e) => setCustomHeight(Math.max(1, Number(e.target.value)))}
                            className="w-full px-3 py-2 rounded-lg bg-black border border-white/20 text-xs text-white focus:outline-none focus:border-white/50 font-mono"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-400 font-mono">
                        <span>Current Aspect:</span>
                        <span className="text-white font-bold">{customWidth} : {customHeight}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── TAB 3: PRESETS ── */}
              {activeTab === 'presets' && (
                <div className="space-y-3">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                    Presets
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPreset(p.id)}
                        className={`p-3.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                          selectedPreset === p.id
                            ? 'bg-white/15 border-white/50 text-white font-medium'
                            : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{p.name}</span>
                          {selectedPreset === p.id && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 4: ADJUST ── */}
              {activeTab === 'tune' && (
                <div className="space-y-4 text-xs font-mono">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">
                    Adjustments
                  </span>

                  {/* Brightness */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400 text-xs">
                      <span>Brightness</span>
                      <span className="text-white">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  {/* Contrast */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400 text-xs">
                      <span>Contrast</span>
                      <span className="text-white">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  {/* Saturation */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400 text-xs">
                      <span>Saturation</span>
                      <span className="text-white">{saturate}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturate}
                      onChange={(e) => setSaturate(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  {/* Warmth */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400 text-xs">
                      <span>Warmth</span>
                      <span className="text-white">{warmth}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={warmth}
                      onChange={(e) => setWarmth(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  {/* Blur */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-zinc-400 text-xs">
                      <span>Blur</span>
                      <span className="text-white">{blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={blur}
                      onChange={(e) => setBlur(Number(e.target.value))}
                      className="w-full accent-white cursor-pointer"
                    />
                  </div>

                  {/* Vignette Toggle */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setVignette(!vignette)}
                      className={`w-full py-2.5 px-3.5 rounded-xl border text-xs transition cursor-pointer flex items-center justify-between ${
                        vignette
                          ? 'bg-white/15 border-white/40 text-white'
                          : 'bg-black/40 border-white/10 text-zinc-400'
                      }`}
                    >
                      <span>Vignette Edge</span>
                      <span>{vignette ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaStudioModal;

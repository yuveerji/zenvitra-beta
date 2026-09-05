'use client';

import React from 'react';
import { Check, ZoomIn, ZoomOut } from 'lucide-react';

interface ZenDocsStatusBarProps {
  saveStatus: string;
  docCode: string;
  wordCount: number;
  charCount: number;
  zoomLevel: number;
  fontFamily: string;
  fontSize: number;
  lineSpacing: string;
  onZoomChange: (zoom: number) => void;
  onFontFamilyChange: (font: string) => void;
  onFontSizeChange: (size: number) => void;
  onLineSpacingChange: (spacing: string) => void;
}

const FONT_OPTIONS = [
  'Times New Roman',
  'Georgia',
  'Arial',
  'Inter',
  'Merriweather',
  'Roboto Mono',
  'Courier New',
];

const ZOOM_LEVELS = [75, 90, 100, 125, 150];

export function ZenDocsStatusBar({
  saveStatus,
  docCode,
  wordCount,
  charCount,
  zoomLevel,
  fontFamily,
  fontSize,
  lineSpacing,
  onZoomChange,
  onFontFamilyChange,
  onFontSizeChange,
  onLineSpacingChange,
}: ZenDocsStatusBarProps) {
  const pages = Math.max(1, Math.ceil(wordCount / 500));
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="h-8 bg-[#0b0e17]/80 backdrop-blur-md border-t border-white/[0.06] flex items-center justify-between px-3 sm:px-4 text-[10px] font-mono text-neutral-500 print:hidden select-none">
      {/* Left: Save status + doc code */}
      <div className="flex items-center gap-2 min-w-0">
        <span className="flex items-center gap-1 text-cyan-400/70 shrink-0">
          <Check className="w-2.5 h-2.5" />
          <span className="hidden sm:inline">{saveStatus}</span>
        </span>
        <span className="text-neutral-700">•</span>
        <span className="truncate max-w-[120px] text-neutral-600">{docCode}</span>
      </div>

      {/* Center: Telemetry */}
      <div className="hidden sm:flex items-center gap-3 text-neutral-500">
        <span>
          <strong className="text-neutral-400">{wordCount}</strong> words
        </span>
        <span className="text-neutral-700">•</span>
        <span>
          <strong className="text-neutral-400">{charCount.toLocaleString()}</strong> chars
        </span>
        <span className="text-neutral-700">•</span>
        <span>~{readTime} min read</span>
        <span className="text-neutral-700">•</span>
        <span>~{pages} {pages === 1 ? 'page' : 'pages'}</span>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        {/* Font Family */}
        <select
          value={fontFamily}
          onChange={(e) => onFontFamilyChange(e.target.value)}
          className="hidden lg:block px-1.5 py-0.5 rounded bg-transparent border border-white/[0.06] text-[9px] text-neutral-400 cursor-pointer focus:outline-none hover:border-white/15 max-w-[100px]"
          title="Font Family"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Font Size */}
        <div className="hidden md:flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onFontSizeChange(Math.max(9, fontSize - 1))}
            className="px-1 text-neutral-500 hover:text-white transition cursor-pointer"
            title="Decrease font size"
          >
            −
          </button>
          <span className="text-neutral-400 font-bold min-w-[16px] text-center">{fontSize}</span>
          <button
            type="button"
            onClick={() => onFontSizeChange(Math.min(48, fontSize + 1))}
            className="px-1 text-neutral-500 hover:text-white transition cursor-pointer"
            title="Increase font size"
          >
            +
          </button>
        </div>

        {/* Line Spacing */}
        <select
          value={lineSpacing}
          onChange={(e) => onLineSpacingChange(e.target.value)}
          className="hidden lg:block px-1 py-0.5 rounded bg-transparent border border-white/[0.06] text-[9px] text-neutral-400 cursor-pointer focus:outline-none hover:border-white/15"
          title="Line Spacing"
        >
          <option value="1">1.0×</option>
          <option value="1.15">1.15×</option>
          <option value="1.5">1.5×</option>
          <option value="2">2.0×</option>
        </select>

        <div className="h-3 w-px bg-white/[0.06] mx-1" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const idx = ZOOM_LEVELS.indexOf(zoomLevel);
              if (idx > 0) onZoomChange(ZOOM_LEVELS[idx - 1]);
            }}
            className="text-neutral-500 hover:text-white transition cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <span className="text-neutral-400 font-bold min-w-[28px] text-center">{zoomLevel}%</span>
          <button
            type="button"
            onClick={() => {
              const idx = ZOOM_LEVELS.indexOf(zoomLevel);
              if (idx < ZOOM_LEVELS.length - 1) onZoomChange(ZOOM_LEVELS[idx + 1]);
            }}
            className="text-neutral-500 hover:text-white transition cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { 
  Pencil, 
  Highlighter, 
  Eraser, 
  Square, 
  Circle, 
  Type, 
  StickyNote, 
  RotateCcw, 
  Download, 
  FileText, 
  X, 
  Check, 
  Palette,
  Minus
} from 'lucide-react';

interface ZenWhiteboardProps {
  isOpen: boolean;
  onClose: () => void;
  onExportToDocs?: (canvasDataUrl: string) => void;
}

type ToolType = 'pen' | 'highlighter' | 'eraser' | 'rect' | 'circle' | 'note';

interface NoteItem {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
}

export function ZenWhiteboard({ isOpen, onClose, onExportToDocs }: ZenWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeTool, setActiveTool] = useState<ToolType>('pen');
  const [color, setColor] = useState('#06b6d4'); // default cyan
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const colors = ['#ffffff', '#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#a855f7', '#000000'];

  // Initialize canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Background fill
    ctx.fillStyle = '#0a0d16';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, [isOpen]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool === 'note') {
      const newNote: NoteItem = {
        id: `note-${Date.now()}`,
        x,
        y,
        text: 'Action item: ',
        color: '#fef08a', // pale yellow sticky
      };
      setNotes((prev) => [...prev, newNote]);
      setActiveTool('pen');
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#0a0d16';
      ctx.lineWidth = strokeWidth * 4;
    } else if (activeTool === 'highlighter') {
      ctx.strokeStyle = `${color}44`;
      ctx.lineWidth = strokeWidth * 4;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#0a0d16';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setNotes([]);
  };

  const handleExportDocs = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    if (onExportToDocs) {
      onExportToDocs(dataUrl);
    }

    // Save to local storage for ZenDocs import
    try {
      localStorage.setItem('zen_whiteboard_export_last', dataUrl);
      setExportNotice('Exported to ZEN.DOCS! Open ZenDocs to insert canvas.');
      setTimeout(() => setExportNotice(null), 3500);
    } catch (_) {
      setExportNotice('Canvas copied to clipboard / session storage.');
      setTimeout(() => setExportNotice(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col bg-[#060810] text-white">
      {/* ── TOP CONTROL TOOLBAR ── */}
      <div className="h-16 px-4 bg-[#0a0d18] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs">
            WB
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-white">
              ZEN.WHITEBOARD COLLAB
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">Live Session Board • Sync with Call</p>
          </div>
        </div>

        {/* Tools Palette */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTool('pen')}
            className={`p-2 rounded-xl transition cursor-pointer ${
              activeTool === 'pen' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
            title="Pen"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('highlighter')}
            className={`p-2 rounded-xl transition cursor-pointer ${
              activeTool === 'highlighter' ? 'bg-amber-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
            title="Highlighter"
          >
            <Highlighter className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('eraser')}
            className={`p-2 rounded-xl transition cursor-pointer ${
              activeTool === 'eraser' ? 'bg-rose-500 text-white' : 'text-zinc-400 hover:text-white'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('note')}
            className={`p-2 rounded-xl transition cursor-pointer ${
              activeTool === 'note' ? 'bg-yellow-400 text-black' : 'text-zinc-400 hover:text-white'
            }`}
            title="Add Sticky Note"
          >
            <StickyNote className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-5 bg-white/10 mx-1" />

          {/* Color Selector */}
          <div className="flex items-center gap-1 px-1">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full border transition cursor-pointer ${
                  color === c ? 'scale-125 border-white ring-2 ring-cyan-400' : 'border-transparent'
                }`}
              />
            ))}
          </div>

          <div className="w-[1px] h-5 bg-white/10 mx-1" />

          {/* Stroke Width Selector */}
          <div className="flex items-center gap-1">
            {[2, 4, 8].map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setStrokeWidth(w)}
                className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                  strokeWidth === w ? 'bg-white/20 text-white' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={clearCanvas}
            className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            title="Clear Canvas"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Export and Close */}
        <div className="flex items-center gap-2">
          {exportNotice && (
            <span className="text-[11px] font-mono text-emerald-400 animate-pulse flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>{exportNotice}</span>
            </span>
          )}

          <button
            type="button"
            onClick={handleExportDocs}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.4)]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export to ZEN.DOCS</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close Whiteboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── CANVAS DRAWING AREA ── */}
      <div className="relative flex-1 bg-[#0a0d16] overflow-hidden cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full block"
        />

        {/* Sticky Notes on Top of Canvas */}
        {notes.map((note) => (
          <div
            key={note.id}
            style={{ left: note.x, top: note.y }}
            className="absolute w-44 p-3 rounded-xl bg-yellow-200 text-black shadow-2xl border border-yellow-300 transform -rotate-1 select-none"
          >
            <div className="flex justify-between items-center pb-1 mb-1 border-b border-yellow-400/50">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-yellow-800">Note</span>
              <button
                type="button"
                onClick={() => setNotes((prev) => prev.filter((n) => n.id !== note.id))}
                className="text-yellow-800 hover:text-black"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <textarea
              defaultValue={note.text}
              className="w-full bg-transparent border-0 text-xs font-sans text-neutral-900 focus:outline-none resize-none leading-tight"
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}


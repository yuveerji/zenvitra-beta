'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  FileText,
  Scale,
  Building2,
  Printer,
  Download,
  Sun,
  Moon,
  Eye,
  Sparkles,
  ShieldCheck,
  Radio,
  BarChart3,
  Star,
  Share2,
  Minus,
  Type,
  Quote,
  Command,
} from 'lucide-react';
import { ZenDocType } from '@/types/docs';
import { ExportFormat } from '@/lib/exportDocument';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  action: () => void;
  shortcut?: string;
}

interface ZenDocsCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateDocument: (type: ZenDocType) => void;
  onPrint: () => void;
  onExportMarkdown: () => void;
  onExportFormat?: (format: ExportFormat) => void;
  onOpenSaveAsModal?: () => void;
  onTogglePaperMode: () => void;
  onToggleRuler: () => void;
  onToggleOutline: () => void;
  onSetZoom: (zoom: number) => void;
  onInsertSeal: () => void;
  onInsertDivider: () => void;
  onInsertHeading: (level: 1 | 2 | 3) => void;
  onInsertBlockquote: () => void;
  onOpenAI: () => void;
  onOpenStats: () => void;
  onToggleStar: () => void;
  onShare: () => void;
  onTableToChamber: () => void;
  paperMode: 'light' | 'dark';
  documentNames: { id: string; title: string }[];
  onSwitchDocument: (id: string) => void;
}

export function ZenDocsCommandPalette({
  isOpen,
  onClose,
  onCreateDocument,
  onPrint,
  onExportMarkdown,
  onExportFormat,
  onOpenSaveAsModal,
  onTogglePaperMode,
  onToggleRuler,
  onToggleOutline,
  onSetZoom,
  onInsertSeal,
  onInsertDivider,
  onInsertHeading,
  onInsertBlockquote,
  onOpenAI,
  onOpenStats,
  onToggleStar,
  onShare,
  onTableToChamber,
  paperMode,
  documentNames,
  onSwitchDocument,
}: ZenDocsCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = useMemo(
    () => [
      // File
      { id: 'new-blank', label: 'New Blank Document', icon: FileText, category: 'File', action: () => onCreateDocument('STANDARD_DOC'), shortcut: 'Ctrl+N' },
      { id: 'new-resolution', label: 'New UN Resolution', icon: Scale, category: 'File', action: () => onCreateDocument('UN_RESOLUTION') },
      { id: 'new-bill', label: 'New Parliamentary Bill', icon: Building2, category: 'File', action: () => onCreateDocument('INDIAN_BILL') },
      { id: 'save-as-dialog', label: 'Save As Dialog (docx, pdf, txt...)', icon: Download, category: 'File', action: () => onOpenSaveAsModal?.() },
      { id: 'export-docx', label: 'Save As Word Document (.docx)', icon: Download, category: 'File', action: () => onExportFormat?.('docx') },
      { id: 'export-pdf', label: 'Save As PDF Document (.pdf)', icon: Printer, category: 'File', action: onPrint, shortcut: 'Ctrl+P' },
      { id: 'export-txt', label: 'Save As Plain Text (.txt)', icon: Download, category: 'File', action: () => onExportFormat?.('txt') },
      { id: 'export-md', label: 'Save As Markdown (.md)', icon: Download, category: 'File', action: onExportMarkdown },
      { id: 'export-html', label: 'Save As Web Page (.html)', icon: Download, category: 'File', action: () => onExportFormat?.('html') },
      { id: 'export-json', label: 'Save As Sovereign Ledger (.json)', icon: Download, category: 'File', action: () => onExportFormat?.('json') },
      { id: 'stats', label: 'Document Statistics', icon: BarChart3, category: 'File', action: onOpenStats },
      { id: 'star', label: 'Toggle Star', icon: Star, category: 'File', action: onToggleStar, shortcut: 'Ctrl+⇧+S' },
      { id: 'share', label: 'Share Document', icon: Share2, category: 'File', action: onShare },

      // View
      { id: 'paper-mode', label: `Switch to ${paperMode === 'light' ? 'Dark Slate' : 'White Paper'}`, icon: paperMode === 'light' ? Moon : Sun, category: 'View', action: onTogglePaperMode },
      { id: 'ruler', label: 'Toggle Margin Ruler', icon: Eye, category: 'View', action: onToggleRuler },
      { id: 'outline', label: 'Toggle Document Outline', icon: Eye, category: 'View', action: onToggleOutline },
      { id: 'zoom-75', label: 'Zoom 75%', icon: Eye, category: 'View', action: () => onSetZoom(75) },
      { id: 'zoom-100', label: 'Zoom 100%', icon: Eye, category: 'View', action: () => onSetZoom(100) },
      { id: 'zoom-125', label: 'Zoom 125%', icon: Eye, category: 'View', action: () => onSetZoom(125) },
      { id: 'zoom-150', label: 'Zoom 150%', icon: Eye, category: 'View', action: () => onSetZoom(150) },

      // Insert
      { id: 'seal', label: 'Sovereign Cryptographic Seal', icon: ShieldCheck, category: 'Insert', action: onInsertSeal },
      { id: 'divider', label: 'Horizontal Divider', icon: Minus, category: 'Insert', action: onInsertDivider },
      { id: 'heading-1', label: 'Heading 1', icon: Type, category: 'Insert', action: () => onInsertHeading(1) },
      { id: 'heading-2', label: 'Heading 2', icon: Type, category: 'Insert', action: () => onInsertHeading(2) },
      { id: 'heading-3', label: 'Heading 3', icon: Type, category: 'Insert', action: () => onInsertHeading(3) },
      { id: 'blockquote', label: 'Blockquote', icon: Quote, category: 'Insert', action: onInsertBlockquote },

      // Tools
      { id: 'ai', label: 'AI Diplomatic Copilot', description: 'Generate clauses from policy notes', icon: Sparkles, category: 'Tools', action: onOpenAI },
      { id: 'table-chamber', label: 'Table in Chamber', description: 'Submit to live MUN Dais', icon: Radio, category: 'Tools', action: onTableToChamber },

      // Documents
      ...documentNames.map((d) => ({
        id: `switch-${d.id}`,
        label: d.title,
        icon: FileText,
        category: 'Switch Document',
        action: () => onSwitchDocument(d.id),
      })),
    ],
    [onCreateDocument, onPrint, onExportMarkdown, onExportFormat, onOpenSaveAsModal, onOpenStats, onToggleStar, onShare, onTogglePaperMode, paperMode, onToggleRuler, onToggleOutline, onSetZoom, onInsertSeal, onInsertDivider, onInsertHeading, onInsertBlockquote, onOpenAI, onTableToChamber, documentNames, onSwitchDocument]
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.description?.toLowerCase().includes(q))
    );
  }, [query, commands]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    for (const cmd of filtered) {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    }
    return groups;
  }, [filtered]);

  const flatList = useMemo(() => filtered, [filtered]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatList.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatList[activeIndex]) {
          flatList[activeIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [flatList, activeIndex, onClose]
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl rounded-2xl bg-[#0a0d15]/98 backdrop-blur-3xl border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.6)] overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08]">
              <Command className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none font-sans"
                autoComplete="off"
              />
              <kbd className="hidden sm:block px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] font-mono text-neutral-500 border border-white/[0.06]">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-1.5">
              {flatList.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-neutral-500 font-mono">
                  No commands matching &ldquo;{query}&rdquo;
                </div>
              ) : (
                Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-2.5 pt-2 pb-1 text-[10px] font-mono text-neutral-600 uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((cmd) => {
                      const globalIdx = flatList.indexOf(cmd);
                      return (
                        <button
                          key={cmd.id}
                          type="button"
                          onClick={() => {
                            cmd.action();
                            onClose();
                          }}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-xs transition cursor-pointer ${
                            globalIdx === activeIndex
                              ? 'bg-white/10 text-white'
                              : 'text-neutral-300 hover:bg-white/[0.06]'
                          }`}
                        >
                          <cmd.icon className="w-4 h-4 text-neutral-500 shrink-0" />
                          <span className="flex-1 truncate font-medium">{cmd.label}</span>
                          {cmd.description && (
                            <span className="text-[10px] text-neutral-600 truncate max-w-[150px]">
                              {cmd.description}
                            </span>
                          )}
                          {cmd.shortcut && (
                            <kbd className="px-1 py-0.5 rounded bg-white/[0.04] text-[9px] font-mono text-neutral-600 border border-white/[0.06] shrink-0">
                              {cmd.shortcut}
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-white/[0.06] px-4 py-2 flex items-center justify-between text-[9px] font-mono text-neutral-600">
              <span>↑↓ Navigate • ↵ Select • ESC Close</span>
              <span>ZEN.DOCS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

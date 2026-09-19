'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Star,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Sun,
  Moon,
  Lock,
  Search,
  Users,
  Check,
  Radio,
  Grid,
  CheckSquare,
  History,
  Newspaper,
  FolderDown,
  ChevronDown,
  Save,
  Download,
  Printer,
  FileType,
  FileCode,
  Globe2,
  Info,
  Trash2,
  Glasses,
  Eye,
  Undo,
  Redo,
  Type,
  Palette,
  Highlighter,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Calendar,
  Sparkles,
  RemoveFormatting,
  Indent,
  Outdent,
  X,
  Plus
} from 'lucide-react';
import { ZenDocument } from '@/types/docs';
import { ExportFormat } from '@/lib/exportDocument';

export interface ZenDocsToolbarProps {
  activeDoc: ZenDocument;
  isStarred: boolean;
  saveStatus: string;
  paperMode: 'light' | 'dark';
  onToggleSidebar: () => void;
  onSwitchToDashboard: () => void;
  onSave: () => void;
  onOpenSaveAsModal: () => void;
  onExportFormat: (format: ExportFormat) => void;
  onPrint: () => void;
  onOpenStats: () => void;
  onMoveToTrash: () => void;
  onTitleChange: (title: string) => void;
  onToggleStar: () => void;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onStrikethrough: () => void;
  onAlignment: (align: 'left' | 'center' | 'right' | 'justify') => void;
  onBulletList: () => void;
  onNumberedList: () => void;
  onTogglePaperMode: () => void;
  onOpenTasks: () => void;
  onOpenVersions: () => void;
  onPublishToPress: () => void;
  onShareToPulse: () => void;
  onShare: () => void;
  onTableToChamber: () => void;
  onOpenCommandPalette: () => void;
  isReaderMode?: boolean;
  onToggleReaderMode?: () => void;
  // High-Tech Word & Google Docs Extensions
  onUndo?: () => void;
  onRedo?: () => void;
  fontFamily?: string;
  onFontFamilyChange?: (font: string) => void;
  fontSize?: number;
  onFontSizeChange?: (size: number) => void;
  lineSpacing?: string;
  onLineSpacingChange?: (spacing: string) => void;
  onApplyStyle?: (style: 'p' | 'title' | 'subtitle' | 'h1' | 'h2' | 'h3' | 'h4' | 'code') => void;
  onTextColor?: (color: string) => void;
  onHighlight?: (color: string) => void;
  onInsertTable?: (rows: number, cols: number) => void;
  onInsertImage?: (url: string, caption?: string) => void;
  onInsertLink?: (url: string, label?: string) => void;
  onInsertChecklist?: () => void;
  onInsertDivider?: () => void;
  onInsertDate?: () => void;
  onImportWhiteboard?: () => void;
  onIndent?: () => void;
  onOutdent?: () => void;
  onClearFormatting?: () => void;
}

const FONT_OPTIONS = [
  { name: 'Inter (Sans)', value: 'var(--font-inter), sans-serif' },
  { name: 'Playfair Display (Serif)', value: 'var(--font-playfair), Georgia, serif' },
  { name: 'JetBrains Mono (Code)', value: 'var(--font-jetbrains-mono), monospace' },
  { name: 'Cinzel (Classical)', value: 'Cinzel, Georgia, serif' },
  { name: 'Outfit (Modern)', value: 'Outfit, sans-serif' },
  { name: 'Merriweather (Editorial)', value: 'Merriweather, serif' },
  { name: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", sans-serif' },
];

const STYLE_OPTIONS: { label: string; value: 'p' | 'title' | 'subtitle' | 'h1' | 'h2' | 'h3' | 'code'; desc: string }[] = [
  { label: 'Normal text', value: 'p', desc: 'Body typography' },
  { label: 'Title', value: 'title', desc: 'Document headline (32pt)' },
  { label: 'Subtitle', value: 'subtitle', desc: 'Lead paragraph (16pt)' },
  { label: 'Heading 1', value: 'h1', desc: 'Major chapter (22pt)' },
  { label: 'Heading 2', value: 'h2', desc: 'Section break (18pt)' },
  { label: 'Heading 3', value: 'h3', desc: 'Sub-clause (15pt)' },
  { label: 'Code Block', value: 'code', desc: 'Monospace terminal' },
];

const COLOR_SWATCHES = [
  { label: 'Cyan Sovereign', color: '#06b6d4' },
  { label: 'White / Black', color: '#ffffff' },
  { label: 'Emerald Green', color: '#10b981' },
  { label: 'Rose Red', color: '#f43f5e' },
  { label: 'Amber Gold', color: '#f59e0b' },
  { label: 'Royal Blue', color: '#3b82f6' },
  { label: 'Purple Violet', color: '#a855f7' },
  { label: 'Dark Charcoal', color: '#1e293b' },
];

const HIGHLIGHT_SWATCHES = [
  { label: 'None', color: 'transparent' },
  { label: 'Cyan Aura', color: 'rgba(6, 182, 212, 0.25)' },
  { label: 'Yellow Radiant', color: 'rgba(234, 179, 8, 0.3)' },
  { label: 'Green Emerald', color: 'rgba(16, 185, 129, 0.25)' },
  { label: 'Rose Tint', color: 'rgba(244, 63, 94, 0.25)' },
  { label: 'Purple Velvet', color: 'rgba(168, 85, 247, 0.25)' },
];

export function ZenDocsToolbar({
  activeDoc,
  isStarred,
  saveStatus,
  paperMode,
  onToggleSidebar,
  onSwitchToDashboard,
  onSave,
  onOpenSaveAsModal,
  onExportFormat,
  onPrint,
  onOpenStats,
  onMoveToTrash,
  onTitleChange,
  onToggleStar,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onAlignment,
  onBulletList,
  onNumberedList,
  onTogglePaperMode,
  onOpenTasks,
  onOpenVersions,
  onPublishToPress,
  onShareToPulse,
  onShare,
  onTableToChamber,
  onOpenCommandPalette,
  isReaderMode = false,
  onToggleReaderMode,
  onUndo,
  onRedo,
  fontFamily = 'var(--font-inter), sans-serif',
  onFontFamilyChange,
  fontSize = 11,
  onFontSizeChange,
  lineSpacing = '1.6',
  onLineSpacingChange,
  onApplyStyle,
  onTextColor,
  onHighlight,
  onInsertTable,
  onInsertImage,
  onInsertLink,
  onInsertChecklist,
  onInsertDivider,
  onInsertDate,
  onImportWhiteboard,
  onIndent,
  onOutdent,
  onClearFormatting,
}: ZenDocsToolbarProps) {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const [isTextColorOpen, setIsTextColorOpen] = useState(false);
  const [isHighlightOpen, setIsHighlightOpen] = useState(false);
  const [isTablePickerOpen, setIsTablePickerOpen] = useState(false);
  const [tableHover, setTableHover] = useState<{ r: number; c: number }>({ r: 3, c: 3 });
  const [isLineSpacingOpen, setIsLineSpacingOpen] = useState(false);

  // Link & Image modals
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const fileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (fileMenuRef.current && !fileMenuRef.current.contains(e.target as Node)) {
        setIsFileMenuOpen(false);
      }
    }
    if (isFileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFileMenuOpen]);

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    onInsertLink?.(linkUrl.trim(), linkText.trim() || undefined);
    setLinkUrl('');
    setLinkText('');
    setIsLinkModalOpen(false);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          onInsertImage?.(evt.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="sticky top-2 z-30 bg-[#0b0e17]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-2xl print:hidden flex flex-col divide-y divide-white/[0.06]">
      {/* ROW 1: System bar (Dashboard, File Menu, Doc Title, Actions) */}
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        {/* Left: Dashboard + Library + File + Title */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Dashboard Switcher */}
          <button
            type="button"
            onClick={onSwitchToDashboard}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer shrink-0"
            title="Return to Documents Dashboard & Workspaces"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Document Library Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 transition cursor-pointer shrink-0"
            title="Open Document Library (Sidebar)"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* File Menu Dropdown */}
          <div className="relative" ref={fileMenuRef}>
            <button
              type="button"
              onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
              title="File: Save, Save As (.docx, .pdf, .txt...), Print"
            >
              <FolderDown className="w-3.5 h-3.5 text-cyan-400" />
              <span>File</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {isFileMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-64 rounded-2xl bg-[#0e121e] border border-white/15 shadow-2xl p-1.5 z-50 text-xs font-mono space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    onSave();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Save</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">Ctrl+S</span>
                </button>

                <div className="h-px bg-white/10 my-1" />

                <div className="px-2.5 py-1 text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
                  Save As &bull; Export Formats
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onExportFormat('docx');
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileType className="w-3.5 h-3.5 text-blue-400" />
                    <span>Word Document (.docx)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">DOCX</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportFormat('pdf');
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Printer className="w-3.5 h-3.5 text-rose-400" />
                    <span>PDF Document (.pdf)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold">PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportFormat('txt');
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Plain Text (.txt)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">TXT</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onExportFormat('md');
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-purple-400" />
                    <span>Markdown (.md)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">MD</span>
                </button>

                <div className="h-px bg-white/10 my-1" />

                <button
                  type="button"
                  onClick={() => {
                    onPrint();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Printer className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Print Document</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">Ctrl+P</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onOpenStats();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Document Statistics</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onMoveToTrash();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-rose-500/15 text-rose-400 cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    <span>Move to Trash</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Document Title & Status */}
          <div className="flex items-center gap-2 min-w-0 flex-1 max-w-sm sm:max-w-md">
            <input
              type="text"
              value={activeDoc.title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="NAME YOUR DOCUMENT"
              className="font-display font-bold text-sm text-white bg-transparent hover:bg-white/5 focus:bg-white/10 px-2 py-1 rounded-lg border border-transparent focus:border-cyan-500/40 focus:outline-none transition w-full truncate"
              title="Click to rename document"
            />
            <button
              type="button"
              onClick={onToggleStar}
              className="text-neutral-400 hover:text-amber-400 transition cursor-pointer p-1 shrink-0"
              title={isStarred ? 'Unstar document' : 'Star document'}
            >
              <Star className={`w-4 h-4 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-cyan-400/80 shrink-0">
              <Check className="w-3 h-3" />
              <span>{saveStatus}</span>
            </span>
          </div>
        </div>

        {/* Right: Actions, Publish, Tasks, Versions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onOpenTasks}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-neutral-300 font-mono text-[11px] transition cursor-pointer"
            title="In-document Tasks & Deadlines"
          >
            <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Tasks</span>
          </button>

          <button
            type="button"
            onClick={onOpenVersions}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-neutral-300 font-mono text-[11px] transition cursor-pointer"
            title="Version History & Diff"
          >
            <History className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden md:inline">v{activeDoc.version || 1}</span>
          </button>

          <button
            type="button"
            onClick={onPublishToPress}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 font-mono text-[11px] font-bold transition cursor-pointer"
            title="Publish as live article to ZENVITRA Press"
          >
            <Newspaper className="w-3.5 h-3.5 text-pink-400" />
            <span>ZEN.PRESS</span>
          </button>

          <button
            type="button"
            onClick={onShareToPulse}
            className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold transition cursor-pointer"
            title="Broadcast Resolution/Treaty card to ZEN.PULSE"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>PULSE</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={onShare}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/20"
            title="Share document link & permissions"
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* ROW 2: WORD & GOOGLE DOCS HIGH-TECH FORMATTING RIBBON */}
      <div className="flex items-center gap-1 px-2.5 py-1.5 overflow-x-auto text-xs font-sans select-none scrollbar-none">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onUndo}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />

        {/* Styles Dropdown (Normal text, Title, Subtitle, H1, H2, H3, Code) */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsStyleMenuOpen(!isStyleMenuOpen)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition"
            title="Paragraph Styles"
          >
            <span>Normal text</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {isStyleMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-56 rounded-xl bg-[#0e121e] border border-white/15 shadow-2xl p-1 z-50 space-y-1">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => {
                    onApplyStyle?.(style.value);
                    setIsStyleMenuOpen(false);
                  }}
                  className="w-full flex flex-col px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left transition"
                >
                  <span className="text-xs font-semibold text-white">{style.label}</span>
                  <span className="text-[10px] text-neutral-400">{style.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Family Dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 hover:text-white text-xs font-medium flex items-center gap-1.5 transition max-w-[130px] truncate"
            title="Font Family"
          >
            <span className="truncate">
              {FONT_OPTIONS.find((f) => f.value === fontFamily)?.name.split(' ')[0] || 'Inter'}
            </span>
            <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
          </button>

          {isFontMenuOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-52 rounded-xl bg-[#0e121e] border border-white/15 shadow-2xl p-1 z-50 space-y-1">
              {FONT_OPTIONS.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => {
                    onFontFamilyChange?.(font.value);
                    setIsFontMenuOpen(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left text-xs text-neutral-200 hover:text-white transition flex items-center justify-between"
                  style={{ fontFamily: font.value }}
                >
                  <span>{font.name}</span>
                  {fontFamily === font.value && <Check className="w-3 h-3 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Stepper */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-1 py-0.5 shrink-0">
          <button
            type="button"
            onClick={() => onFontSizeChange?.(Math.max(8, fontSize - 1))}
            className="px-1.5 py-0.5 rounded hover:bg-white/10 text-neutral-300 hover:text-white font-bold"
            title="Decrease font size"
          >
            -
          </button>
          <span className="px-2 font-mono text-xs text-white min-w-[24px] text-center font-bold">
            {fontSize}
          </span>
          <button
            type="button"
            onClick={() => onFontSizeChange?.(Math.min(72, fontSize + 1))}
            className="px-1.5 py-0.5 rounded hover:bg-white/10 text-neutral-300 hover:text-white font-bold"
            title="Increase font size"
          >
            +
          </button>
        </div>

        <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />

        {/* Text Styling: Bold, Italic, Underline, Strikethrough */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onBold}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onItalic}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onUnderline}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onStrikethrough}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Text Color Picker */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsTextColorOpen(!isTextColorOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-0.5"
            title="Text Color"
          >
            <span className="font-serif font-bold text-xs underline decoration-cyan-400 decoration-2">A</span>
            <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
          </button>

          {isTextColorOpen && (
            <div className="absolute left-0 top-full mt-1.5 p-2 rounded-xl bg-[#0e121e] border border-white/15 shadow-2xl z-50 grid grid-cols-4 gap-1.5 w-36">
              {COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.color}
                  type="button"
                  onClick={() => {
                    onTextColor?.(swatch.color);
                    setIsTextColorOpen(false);
                  }}
                  className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition cursor-pointer"
                  style={{ backgroundColor: swatch.color }}
                  title={swatch.label}
                />
              ))}
            </div>
          )}
        </div>

        {/* Highlight Color Picker */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsHighlightOpen(!isHighlightOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-0.5"
            title="Highlight Color"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-400" />
            <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
          </button>

          {isHighlightOpen && (
            <div className="absolute left-0 top-full mt-1.5 p-2 rounded-xl bg-[#0e121e] border border-white/15 shadow-2xl z-50 grid grid-cols-3 gap-1.5 w-36">
              {HIGHLIGHT_SWATCHES.map((swatch) => (
                <button
                  key={swatch.label}
                  type="button"
                  onClick={() => {
                    onHighlight?.(swatch.color);
                    setIsHighlightOpen(false);
                  }}
                  className="w-7 h-7 rounded-lg border border-white/20 hover:scale-105 transition flex items-center justify-center text-[10px]"
                  style={{ backgroundColor: swatch.color === 'transparent' ? '#1f2937' : swatch.color }}
                  title={swatch.label}
                >
                  {swatch.color === 'transparent' ? '✕' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />

        {/* Insert Tools: Link, Image, Table, Checklist */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* Insert Link */}
          <button
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Insert Link (Ctrl+K)"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          {/* Insert Image */}
          <input
            ref={imageFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => imageFileInputRef.current?.click()}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
            title="Upload Image"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>

          {/* Insert Table Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTablePickerOpen(!isTablePickerOpen)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-0.5"
              title="Insert Table"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
            </button>

            {isTablePickerOpen && (
              <div className="absolute left-0 top-full mt-1.5 p-3 rounded-xl bg-[#0e121e] border border-white/15 shadow-2xl z-50 space-y-2">
                <div className="text-[10px] font-mono text-neutral-400">
                  Select Table Dimensions: {tableHover.r} x {tableHover.c}
                </div>
                <div className="grid grid-cols-5 gap-1.5 p-1 bg-black/40 rounded-lg">
                  {[1, 2, 3, 4, 5].map((row) =>
                    [1, 2, 3, 4, 5].map((col) => {
                      const isHighlighted = row <= tableHover.r && col <= tableHover.c;
                      return (
                        <div
                          key={`${row}-${col}`}
                          onMouseEnter={() => setTableHover({ r: row, c: col })}
                          onClick={() => {
                            onInsertTable?.(row, col);
                            setIsTablePickerOpen(false);
                          }}
                          className={`w-4 h-4 rounded-sm border cursor-pointer transition ${
                            isHighlighted
                              ? 'bg-cyan-500/40 border-cyan-400'
                              : 'bg-white/5 border-white/15 hover:border-white/40'
                          }`}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Insert Checklist */}
          <button
            type="button"
            onClick={onInsertChecklist}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Insert Checklist Task"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>

          {/* Insert Glowing Divider (---) */}
          <button
            type="button"
            onClick={onInsertDivider}
            className="px-2 py-1 rounded-lg hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 font-mono text-[11px] font-bold"
            title="Insert High-Tech Glowing Divider (or type ---)"
          >
            <span>---</span>
            <span className="text-[9px] text-cyan-500">❖</span>
          </button>
        </div>

        <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />

        {/* Alignment */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={() => onAlignment('left')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Align Left"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAlignment('center')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Align Center"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAlignment('right')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Align Right"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onAlignment('justify')}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Justify"
          >
            <AlignJustify className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Line Spacing */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setIsLineSpacingOpen(!isLineSpacingOpen)}
            className="px-2 py-1 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1 text-[11px] font-mono"
            title="Line Spacing"
          >
            <span>{lineSpacing}x</span>
            <ChevronDown className="w-2.5 h-2.5 text-neutral-400" />
          </button>

          {isLineSpacingOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-32 rounded-xl bg-[#0e121e] border border-white/15 shadow-2xl p-1 z-50 space-y-0.5 font-mono text-xs">
              {['1.0', '1.15', '1.5', '1.6', '2.0'].map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => {
                    onLineSpacingChange?.(sp);
                    setIsLineSpacingOpen(false);
                  }}
                  className="w-full px-2 py-1 rounded hover:bg-white/10 text-left text-neutral-200 hover:text-white flex items-center justify-between"
                >
                  <span>{sp}</span>
                  {lineSpacing === sp && <Check className="w-3 h-3 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lists & Indent */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onBulletList}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onNumberedList}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onOutdent}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Decrease Indent"
          >
            <Outdent className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onIndent}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Increase Indent"
          >
            <Indent className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClearFormatting}
            className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
            title="Clear Formatting"
          >
            <RemoveFormatting className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-white/10 mx-1 shrink-0" />

        {/* Insert Date */}
        <button
          type="button"
          onClick={onInsertDate}
          className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition shrink-0"
          title="Insert Today's Date"
        >
          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
        </button>

        {/* Import Whiteboard Button */}
        <button
          type="button"
          onClick={onImportWhiteboard}
          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition shrink-0"
          title="Import Latest Zen.Whiteboard Drawing"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden xl:inline">Import Whiteboard</span>
        </button>

        {/* Paper Mode & Reader Mode */}
        <div className="flex items-center gap-1 shrink-0 ml-auto">
          <button
            type="button"
            onClick={onTogglePaperMode}
            className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white"
            title={`Switch to ${paperMode === 'light' ? 'Dark Slate' : 'White Paper'}`}
          >
            {paperMode === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
          </button>

          <button
            type="button"
            onClick={onToggleReaderMode}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isReaderMode ? 'bg-amber-500/20 text-amber-300' : 'hover:bg-white/10 text-neutral-400'
            }`}
            title="Toggle Zen Reader Mode"
          >
            <Glasses className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* INSERT LINK MODAL */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleLinkSubmit} className="w-full max-w-md bg-[#0e121e] border border-white/20 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-cyan-400" />
                <span>Insert Hyperlink</span>
              </h3>
              <button type="button" onClick={() => setIsLinkModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-mono text-neutral-400 block mb-1">Display Text (Optional)</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. UN Security Council Resolution 2712"
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-neutral-400 block mb-1">Destination URL</label>
                <input
                  type="url"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono"
              >
                Insert Link
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

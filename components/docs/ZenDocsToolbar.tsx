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
} from 'lucide-react';
import { ZenDocument } from '@/types/docs';
import { ExportFormat } from '@/lib/exportDocument';

interface ZenDocsToolbarProps {
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
  onShare: () => void;
  onTableToChamber: () => void;
  onOpenCommandPalette: () => void;
}

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
  onShare,
  onTableToChamber,
  onOpenCommandPalette,
}: ZenDocsToolbarProps) {
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false);
  const fileMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-[#0b0e17]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl print:hidden">
      <div className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-2">

        {/* Left: Library toggle + Title + Star + Status */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Dashboard Switcher Button */}
          <button
            type="button"
            onClick={onSwitchToDashboard}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer shrink-0"
            title="Return to Documents Dashboard & Workspaces"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Document Library Toggle */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 transition cursor-pointer shrink-0"
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
                {/* Immediate Save */}
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

                {/* Save as .docx */}
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

                {/* Save as .pdf */}
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

                {/* Save as .txt */}
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

                {/* Save as .md */}
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

                {/* Save as .html */}
                <button
                  type="button"
                  onClick={() => {
                    onExportFormat('html');
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Web Page (.html)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">HTML</span>
                </button>

                {/* Save as .json */}
                <button
                  type="button"
                  onClick={() => {
                    onExportFormat('json');
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-neutral-200 hover:text-white cursor-pointer transition text-left"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sovereign Ledger (.json)</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold">JSON</span>
                </button>

                {/* Save As Dialog */}
                <button
                  type="button"
                  onClick={() => {
                    onOpenSaveAsModal();
                    setIsFileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-cyan-500/15 text-cyan-300 cursor-pointer transition text-left font-bold"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Save As Dialog...</span>
                  </div>
                  <span className="text-[10px]">&rarr;</span>
                </button>

                <div className="h-px bg-white/10 my-1" />

                {/* Print */}
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

                {/* Stats */}
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

                {/* Move to Trash */}
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

          {/* Document Title */}
          <div className="flex flex-col min-w-0 flex-1 max-w-md">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={activeDoc.title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder={
                  activeDoc.docType === 'INDIAN_BILL'
                    ? 'NAME YOUR BILL'
                    : activeDoc.docType === 'UN_RESOLUTION'
                    ? 'NAME YOUR DRAFT RESOLUTION'
                    : activeDoc.docType === 'POLICY_WORKING_PAPER'
                    ? 'NAME YOUR WORKING PAPER'
                    : activeDoc.docType === 'CONSTITUENT_ARTICLE'
                    ? 'NAME YOUR CONSTITUTION ARTICLE'
                    : activeDoc.docType === 'CRISIS_DIRECTIVE'
                    ? 'NAME YOUR CRISIS DIRECTIVE'
                    : activeDoc.docType === 'PRESS_ARTICLE'
                    ? 'NAME YOUR ARTICLE'
                    : activeDoc.docType === 'RESEARCH_PAPER'
                    ? 'NAME YOUR RESEARCH PAPER'
                    : 'NAME YOUR DOCUMENT'
                }
                className="font-display font-bold text-sm text-white bg-transparent hover:bg-white/5 focus:bg-white/10 px-1.5 py-0.5 rounded-lg border border-transparent focus:border-cyan-500/40 focus:outline-none transition w-full truncate"
                title="Click to rename document"
              />
              <button
                type="button"
                onClick={onToggleStar}
                className="text-neutral-400 hover:text-amber-400 transition cursor-pointer p-0.5 shrink-0"
                title={isStarred ? 'Unstar document' : 'Star document'}
              >
                <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 px-1.5 text-[9px] font-mono text-neutral-500 truncate">
              <span className="flex items-center gap-0.5 text-cyan-400/80">
                <Check className="w-2.5 h-2.5" />
                <span>{saveStatus}</span>
              </span>
              <span className="text-neutral-600">•</span>
              <span className="truncate">{activeDoc.docCode}</span>
            </div>
          </div>
        </div>

        {/* Center: Formatting Group */}
        <div className="hidden md:flex items-center gap-0.5 border-l border-r border-white/[0.06] px-2 mx-1">
          <ToolbarButton icon={Bold} onClick={onBold} title="Bold (Ctrl+B)" />
          <ToolbarButton icon={Italic} onClick={onItalic} title="Italic (Ctrl+I)" />
          <ToolbarButton icon={Underline} onClick={onUnderline} title="Underline (Ctrl+U)" />
          <ToolbarButton icon={Strikethrough} onClick={onStrikethrough} title="Strikethrough" />

          <div className="h-4 w-px bg-white/[0.08] mx-1" />

          <ToolbarButton icon={AlignLeft} onClick={() => onAlignment('left')} title="Align Left" />
          <ToolbarButton icon={AlignCenter} onClick={() => onAlignment('center')} title="Align Center" />
          <ToolbarButton icon={AlignRight} onClick={() => onAlignment('right')} title="Align Right" />
          <ToolbarButton icon={AlignJustify} onClick={() => onAlignment('justify')} title="Justify" />

          <div className="h-4 w-px bg-white/[0.08] mx-1" />

          <ToolbarButton icon={List} onClick={onBulletList} title="Bulleted List" />
          <ToolbarButton icon={ListOrdered} onClick={onNumberedList} title="Numbered List" />

          <div className="h-4 w-px bg-white/[0.08] mx-1" />

          {/* Paper Mode Toggle */}
          <button
            type="button"
            onClick={onTogglePaperMode}
            className="p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer flex items-center gap-1 text-[10px] font-mono text-neutral-400 hover:text-white"
            title={`Switch to ${paperMode === 'light' ? 'Dark Slate' : 'White Paper'}`}
          >
            {paperMode === 'light' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>
        </div>

        {/* Right: Collaborators + Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Collaborator Avatars */}
          <div className="hidden lg:flex items-center -space-x-1.5 mr-1">
            {activeDoc.collaborators?.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="w-6 h-6 rounded-full border-2 border-[#0b0e17] flex items-center justify-center font-bold text-[9px] text-white shadow-md relative"
                style={{ backgroundColor: c.color }}
                title={`${c.name} (@${c.handle}) — ${c.role}`}
              >
                {c.name.slice(0, 1).toUpperCase()}
                {c.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border border-[#0b0e17]" />
                )}
              </div>
            ))}
          </div>

          {/* Tasks & Action Items */}
          <button
            type="button"
            onClick={onOpenTasks}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-neutral-300 font-mono text-[10px] transition cursor-pointer"
            title="In-document Tasks & Deadlines"
          >
            <CheckSquare className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">Tasks</span>
            {(activeDoc.tasks || []).length > 0 && (
              <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                {(activeDoc.tasks || []).filter((t) => !t.completed).length}
              </span>
            )}
          </button>

          {/* Version History & Diff */}
          <button
            type="button"
            onClick={onOpenVersions}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-neutral-300 font-mono text-[10px] transition cursor-pointer"
            title="Version History & Visual Redline Diff"
          >
            <History className="w-3 h-3 text-neutral-400" />
            <span className="hidden md:inline">v{activeDoc.version || 1}</span>
          </button>

          {/* Publish to ZEN.PRESS */}
          <button
            type="button"
            onClick={onPublishToPress}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 font-mono text-[10px] font-bold transition cursor-pointer"
            title="Publish as live article to ZENVITRA Press"
          >
            <Newspaper className="w-3 h-3 text-pink-400" />
            <span className="hidden lg:inline">ZEN.PRESS</span>
          </button>

          {/* Table in Chamber */}
          <button
            type="button"
            onClick={onTableToChamber}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-600/15 hover:bg-purple-600/25 border border-purple-500/30 text-purple-300 font-mono text-[10px] font-bold transition cursor-pointer"
            title="Table onto live MUN Committee Dais"
          >
            <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
            <span>Table</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={onShare}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-mono text-[10px] font-bold transition flex items-center gap-1 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
          >
            <Lock className="w-3 h-3 text-black" />
            <span>Share</span>
          </button>

          {/* Cmd+K */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 border border-white/[0.08] text-neutral-500 hover:text-neutral-300 text-[10px] font-mono transition cursor-pointer"
            title="Command Palette (Ctrl+K)"
          >
            <Search className="w-3 h-3" />
            <span>⌘K</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Small reusable toolbar icon button
function ToolbarButton({
  icon: Icon,
  onClick,
  title,
  active = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  title: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer ${
        active ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-white'
      }`}
      title={title}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

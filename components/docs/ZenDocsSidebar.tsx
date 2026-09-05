'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  X,
  FileText,
  Scale,
  Building2,
  Search,
  Trash2,
  Check,
  Clock,
} from 'lucide-react';
import { ZenDocument, ZenDocType, DocStatus } from '@/types/docs';

export interface ZenDocsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  documents: ZenDocument[];
  activeDocId: string;
  onSelectDocument: (id: string) => void;
  onCreateDocument: (type: ZenDocType) => void;
  onDeleteDocument: (id: string) => void;
}

const TEMPLATES: Array<{
  type: ZenDocType; title: string; subtitle: string; icon: typeof FileText; iconClass: string; badge: string; hoverBorder: string;
}> = [
  { type: 'STANDARD_DOC', title: 'Blank Document', subtitle: 'Clean sovereign editor canvas', icon: FileText, iconClass: 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20', badge: 'Standard', hoverBorder: 'hover:border-cyan-500/50 hover:bg-cyan-950/20' },
  { type: 'UN_RESOLUTION', title: 'NAME YOUR DRAFT RESOLUTION', subtitle: 'Standard UNSC / GA diplomatic format', icon: Scale, iconClass: 'text-neutral-950 bg-cyan-500 font-bold', badge: 'UNSC / GA', hoverBorder: 'hover:border-cyan-500/50 hover:bg-cyan-950/20' },
  { type: 'INDIAN_BILL', title: 'NAME YOUR BILL', subtitle: 'Westminster clause & section template', icon: Building2, iconClass: 'text-neutral-950 bg-amber-500 font-bold', badge: 'Lok Sabha', hoverBorder: 'hover:border-amber-500/50 hover:bg-amber-950/20' },
];

function getStatusStyle(status: DocStatus): string {
  switch (status) {
    case 'UNDER_DEBATE': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    case 'TABLED': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
    case 'PASSED': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'REJECTED': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    case 'PUBLISHED': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    default: return 'bg-white/10 text-white/70 border-white/15';
  }
}

function formatRelativeTime(dateString?: string): string {
  if (!dateString) return 'Recently';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Recently';
    const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function ZenDocsSidebar({
  isOpen,
  onClose,
  documents,
  activeDocId,
  onSelectDocument,
  onCreateDocument,
  onDeleteDocument,
}: ZenDocsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredDrafts = useMemo(() => {
    if (!searchQuery.trim()) return documents;
    const q = searchQuery.toLowerCase().trim();
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(q) ||
        doc.docCode.toLowerCase().includes(q) ||
        doc.committeeOrChamber.toLowerCase().includes(q)
    );
  }, [documents, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-80 sm:w-96 bg-[#0a0d16] border-r border-white/10 p-6 space-y-6 flex flex-col shadow-2xl overflow-y-auto z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-display font-semibold text-white tracking-wide">Document Library</h2>
                  <p className="text-[11px] text-white/50 font-mono">{documents.length} sovereign drafts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                title="Close library"
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Start a New Document */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Start a New Document</h3>
                <span className="text-[10px] text-cyan-400 font-mono">3 Templates</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {TEMPLATES.map((tpl) => {
                  const Icon = tpl.icon;
                  return (
                    <motion.button
                      key={tpl.type}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { onCreateDocument(tpl.type); onClose(); }}
                      className={`p-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-left transition-all cursor-pointer group flex items-start gap-3 ${tpl.hoverBorder}`}
                    >
                      <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${tpl.iconClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">{tpl.title}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60">{tpl.badge}</span>
                        </div>
                        <p className="text-[11px] text-white/50 mt-0.5 leading-snug">{tpl.subtitle}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </section>

            {/* Saved Drafts */}
            <section className="space-y-3 flex-1 flex flex-col min-h-0">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                Your Saved Drafts ({filteredDrafts.length})
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter drafts by title, code..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[300px]">
                {filteredDrafts.length === 0 ? (
                  <div className="p-6 text-center rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
                    <p className="text-xs text-white/40 italic">
                      {searchQuery ? `No drafts matching "${searchQuery}"` : 'No saved drafts yet'}
                    </p>
                  </div>
                ) : (
                  filteredDrafts.map((doc) => {
                    const isActive = activeDocId === doc.id;
                    const isConfirming = confirmDeleteId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => { onSelectDocument(doc.id); onClose(); }}
                        className={`group relative p-3 rounded-xl border transition-all cursor-pointer ${
                          isActive
                            ? 'border-cyan-500/60 bg-cyan-950/25 ring-1 ring-cyan-500/30'
                            : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-cyan-400 border border-white/[0.08] shrink-0 font-medium">
                            {doc.docCode}
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border uppercase ${getStatusStyle(doc.status)}`}>
                            {doc.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-white/90 truncate group-hover:text-cyan-300 transition-colors">{doc.title}</h4>
                        <p className="text-[11px] text-white/50 truncate mt-0.5">{doc.committeeOrChamber}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
                          <span className="text-[10px] text-white/40 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelativeTime(doc.updatedAt)}
                          </span>
                          {isConfirming ? (
                            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <span className="text-[10px] text-rose-400 font-medium">Delete?</span>
                              <button
                                type="button"
                                onClick={() => { onDeleteDocument(doc.id); setConfirmDeleteId(null); }}
                                title="Confirm deletion"
                                className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/35 transition-colors cursor-pointer"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                title="Cancel"
                                className="p-1 rounded bg-white/10 text-white/60 hover:bg-white/20 transition-colors cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(doc.id); }}
                              title="Delete draft"
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md text-white/40 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Bottom Footer */}
            <div className="pt-4 border-t border-white/10 mt-auto flex items-center justify-between text-[11px] text-white/40 font-mono select-none">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>ZEN.DOCS Sovereign Operating System</span>
              </div>
            </div>
          </motion.aside>

          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="flex-1 bg-black/60 backdrop-blur-sm cursor-pointer"
            aria-label="Close sidebar backdrop"
          />
        </div>
      )}
    </AnimatePresence>
  );
}

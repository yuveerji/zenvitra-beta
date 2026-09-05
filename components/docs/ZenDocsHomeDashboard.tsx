'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  FileText,
  Star,
  Users,
  Clock,
  Trash2,
  BookOpen,
  Building2,
  Scale,
  Newspaper,
  CheckSquare,
  Briefcase,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  Globe2,
  Share2,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  Check,
  Download,
} from 'lucide-react';
import { ZenDocument, ZenDocType, DocStatus } from '@/types/docs';
import { DOC_TEMPLATES, INITIAL_WORKSPACES, DocTemplateDefinition } from '@/lib/docsData';

interface ZenDocsHomeDashboardProps {
  documents: ZenDocument[];
  activeDocId: string;
  activeWorkspaceId: string;
  onSelectDocument: (id: string) => void;
  onCreateDocument: (type: ZenDocType, title?: string, initialHtml?: string) => void;
  onCreateFromTemplate: (templateId: string) => void;
  onDeleteDocument: (id: string) => void;
  onToggleTrash: (id: string) => void;
  onToggleStar: (id: string) => void;
  onSwitchToEditor: () => void;
  onWorkspaceChange: (id: string) => void;
  onExportDocument?: (doc: ZenDocument) => void;
}

type DashboardTab = 'ALL' | 'RECENT' | 'STARRED' | 'SHARED' | 'PRESS' | 'TEMPLATES' | 'TRASH';

export function ZenDocsHomeDashboard({
  documents,
  activeDocId,
  activeWorkspaceId,
  onSelectDocument,
  onCreateDocument,
  onCreateFromTemplate,
  onDeleteDocument,
  onToggleTrash,
  onToggleStar,
  onSwitchToEditor,
  onWorkspaceChange,
  onExportDocument,
}: ZenDocsHomeDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const activeWorkspace = INITIAL_WORKSPACES.find((w) => w.id === activeWorkspaceId) || INITIAL_WORKSPACES[0];

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      // Trash filter
      if (activeTab === 'TRASH') {
        if (!doc.isTrash) return false;
      } else {
        if (doc.isTrash) return false;
      }

      // Tab filter
      if (activeTab === 'STARRED' && !doc.starred) return false;
      if (activeTab === 'PRESS' && !doc.publishedToPress) return false;
      if (activeTab === 'SHARED' && (!doc.collaborators || doc.collaborators.length <= 1)) return false;

      // Category / Type filter
      if (selectedCategory !== 'ALL') {
        if (doc.docType !== selectedCategory) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = doc.title.toLowerCase().includes(q);
        const matchesCode = doc.docCode.toLowerCase().includes(q);
        const matchesChamber = doc.committeeOrChamber.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCode && !matchesChamber) return false;
      }

      return true;
    });
  }, [documents, activeTab, selectedCategory, searchQuery]);

  const getDocTypeBadge = (type: ZenDocType) => {
    switch (type) {
      case 'UN_RESOLUTION':
        return { label: 'UN Resolution', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'INDIAN_BILL':
        return { label: 'Parliamentary Bill', color: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
      case 'POLICY_WORKING_PAPER':
        return { label: 'Working Paper', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
      case 'PRESS_ARTICLE':
        return { label: 'ZEN.PRESS', color: 'bg-pink-500/15 text-pink-300 border-pink-500/30' };
      case 'RESEARCH_PAPER':
        return { label: 'Research Paper', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'MEETING_MINUTES':
        return { label: 'Meeting Minutes', color: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
      case 'PROPOSAL':
        return { label: 'Proposal', color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' };
      default:
        return { label: 'Document', color: 'bg-white/10 text-neutral-300 border-white/10' };
    }
  };

  const getStatusBadge = (status: DocStatus) => {
    switch (status) {
      case 'UNDER_DEBATE':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'TABLED':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'PUBLISHED':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'PASSED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'IN_REVIEW':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-white/5 text-neutral-400 border-white/10';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-left">
      
      {/* ─── 1. TOP HERO & WORKSPACE BAR ─── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0b0e17] via-[#080b12] to-black border border-cyan-500/30 relative overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] uppercase font-bold tracking-wider">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>ZEN.DOCS &bull; INTELLIGENT DOCUMENT WORKSPACE</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
              WRITE. COLLABORATE. ORGANIZE. PUBLISH.
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl font-sans leading-relaxed">
              The productivity backbone of ZENVITRA connecting research papers, parliamentary bills, UN resolutions, press articles, and team workspaces.
            </p>
          </div>

          {/* Workspace Switcher & Open Editor CTA */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <select
                value={activeWorkspaceId}
                onChange={(e) => onWorkspaceChange(e.target.value)}
                className="bg-transparent text-white font-bold outline-none cursor-pointer"
              >
                {INITIAL_WORKSPACES.map((w) => (
                  <option key={w.id} value={w.id} className="bg-[#0b0e17] text-white">
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={onSwitchToEditor}
              className="px-4 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <span>Open Active Canvas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10 border-t border-white/10 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-neutral-500 uppercase block">Total Documents</span>
            <span className="text-xl font-bold text-white font-mono">{documents.filter((d) => !d.isTrash).length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-neutral-500 uppercase block">Starred Drafts</span>
            <span className="text-xl font-bold text-amber-400 font-mono">{documents.filter((d) => d.starred && !d.isTrash).length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-neutral-500 uppercase block">Published to Press</span>
            <span className="text-xl font-bold text-pink-400 font-mono">{documents.filter((d) => d.publishedToPress).length}</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <span className="text-[10px] text-neutral-500 uppercase block">Active Workspace Folders</span>
            <span className="text-xl font-bold text-cyan-400 font-mono">{activeWorkspace.folders.length} Folders</span>
          </div>
        </div>
      </div>

      {/* ─── 2. QUICK CREATE LAUNCHPAD ─── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Quick Create New Document</span>
          </h3>
          <button
            type="button"
            onClick={() => setActiveTab('TEMPLATES')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1 cursor-pointer"
          >
            <span>Explore All 12+ Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Blank Doc', type: 'STANDARD_DOC', title: 'NAME YOUR DOCUMENT', icon: FileText, color: 'text-neutral-300' },
            { label: 'Draft Resolution', type: 'UN_RESOLUTION', title: 'NAME YOUR DRAFT RESOLUTION', icon: Scale, color: 'text-cyan-400' },
            { label: 'Legislative Bill', type: 'INDIAN_BILL', title: 'NAME YOUR BILL', icon: Building2, color: 'text-amber-400' },
            { label: 'Working Paper', type: 'POLICY_WORKING_PAPER', title: 'NAME YOUR WORKING PAPER', icon: FileText, color: 'text-purple-400' },
            { label: 'Press Article', type: 'PRESS_ARTICLE', title: 'NAME YOUR ARTICLE', icon: Newspaper, color: 'text-pink-400' },
            { label: 'Research Paper', type: 'RESEARCH_PAPER', title: 'NAME YOUR RESEARCH PAPER', icon: BookOpen, color: 'text-emerald-400' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  onCreateDocument(item.type as ZenDocType, item.title);
                  onSwitchToEditor();
                }}
                className="p-4 rounded-2xl bg-[#0b0e17] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-950/10 transition text-left space-y-2 group cursor-pointer shadow-md"
              >
                <div className="p-2 rounded-xl bg-white/5 w-fit group-hover:scale-110 transition">
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <span className="font-bold text-white text-xs block group-hover:text-cyan-300 transition">{item.label}</span>
                  <span className="text-[10px] text-neutral-500 font-mono block">Instant Template</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 3. NAVIGATION TABS & SEARCH BAR ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs font-mono">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'ALL', label: 'All Documents', count: documents.filter((d) => !d.isTrash).length },
            { id: 'RECENT', label: 'Recent' },
            { id: 'STARRED', label: 'Starred ⭐', count: documents.filter((d) => d.starred && !d.isTrash).length },
            { id: 'SHARED', label: 'Shared 👥', count: documents.filter((d) => d.collaborators && d.collaborators.length > 1 && !d.isTrash).length },
            { id: 'PRESS', label: 'ZEN.PRESS 📰', count: documents.filter((d) => d.publishedToPress).length },
            { id: 'TEMPLATES', label: 'Templates 📑' },
            { id: 'TRASH', label: 'Trash 🗑️', count: documents.filter((d) => d.isTrash).length },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as DashboardTab)}
              className={`px-3 py-1.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-cyan-500 text-black font-bold border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                  : 'bg-white/[0.03] hover:bg-white/[0.08] text-neutral-300 border-white/10'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] ${activeTab === tab.id ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/15 focus-within:border-cyan-400 transition w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="bg-transparent text-white placeholder:text-neutral-500 outline-none text-xs w-full"
            />
          </div>
        </div>
      </div>

      {/* ─── 4. TEMPLATES VIEW (WHEN TEMPLATES TAB ACTIVE) ─── */}
      {activeTab === 'TEMPLATES' && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-display text-white">ZEN.DOCS Templates Library</h3>
            <p className="text-xs text-neutral-400 font-mono">
              Pre-configured blueprints for diplomatic resolutions, legislative bills, research papers, and press publications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DOC_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-5 rounded-3xl bg-[#0b0e17] border border-white/10 hover:border-cyan-500/40 transition space-y-3 flex flex-col justify-between text-left group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style={{ backgroundColor: `${tmpl.color}20`, color: tmpl.color }}>
                      {tmpl.category} &bull; {tmpl.badge}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">{tmpl.type}</span>
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">{tmpl.title}</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">{tmpl.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onCreateFromTemplate(tmpl.id);
                    onSwitchToEditor();
                  }}
                  className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer mt-3"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Use This Template</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 5. DOCUMENTS GRID ─── */}
      {activeTab !== 'TEMPLATES' && (
        <div className="space-y-4">
          {filteredDocs.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-3">
              <FileText className="w-8 h-8 text-neutral-500 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-white font-bold text-sm font-display">No documents found</h4>
                <p className="text-xs text-neutral-500 font-mono">
                  {searchQuery ? `No drafts match "${searchQuery}"` : 'Your workspace document list is currently clear.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onCreateDocument('STANDARD_DOC')}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-mono text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Blank Document</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => {
                const typeBadge = getDocTypeBadge(doc.docType);
                const isCurrentActive = doc.id === activeDocId;

                return (
                  <div
                    key={doc.id}
                    className={`p-5 rounded-3xl transition space-y-4 flex flex-col justify-between text-left group relative ${
                      isCurrentActive
                        ? 'bg-[#0d121f] border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
                        : 'bg-[#0b0e17] border border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-2.5">
                      {/* Top Badges & Actions */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${typeBadge.color}`}>
                            {typeBadge.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${getStatusBadge(doc.status)}`}>
                            {doc.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {onExportDocument && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onExportDocument(doc);
                              }}
                              className="p-1 text-neutral-400 hover:text-cyan-400 transition cursor-pointer"
                              title="Save As / Export File (.docx, .pdf, .txt...)"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleStar(doc.id);
                            }}
                            className="p-1 text-neutral-400 hover:text-amber-400 transition cursor-pointer"
                            title={doc.starred ? 'Unstar document' : 'Star document'}
                          >
                            <Star className={`w-3.5 h-3.5 ${doc.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleTrash(doc.id);
                            }}
                            className="p-1 text-neutral-400 hover:text-rose-400 transition cursor-pointer"
                            title={doc.isTrash ? 'Restore document' : 'Move to trash'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title & Code */}
                      <div>
                        <h4
                          onClick={() => {
                            onSelectDocument(doc.id);
                            onSwitchToEditor();
                          }}
                          className="font-bold text-white text-base group-hover:text-cyan-300 transition cursor-pointer line-clamp-2 leading-snug"
                        >
                          {doc.title}
                        </h4>
                        <span className="text-[10px] font-mono text-neutral-500 block mt-1">
                          {doc.docCode} &bull; {doc.committeeOrChamber}
                        </span>
                      </div>

                      {/* Content Snippet */}
                      <p className="text-xs text-neutral-400 font-sans line-clamp-2 leading-relaxed">
                        {doc.contentHtml?.replace(/<[^>]*>?/gm, ' ') || 'No content preview available.'}
                      </p>
                    </div>

                    {/* Footer / Meta */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-neutral-400">
                      <div className="flex items-center gap-1 text-[10px]">
                        <Clock className="w-3 h-3 text-neutral-500" />
                        <span>v{doc.version || 1} &bull; {new Date(doc.updatedAt).toLocaleDateString()}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          onSelectDocument(doc.id);
                          onSwitchToEditor();
                        }}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-cyan-500 hover:text-black font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── 6. WORKSPACE FOLDERS EXPLORER ─── */}
      <div className="p-6 rounded-3xl bg-black/40 border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              {activeWorkspace.name} &bull; Connected Folders
            </h4>
          </div>
          <span className="text-xs font-mono text-neutral-500">Workspace ID: {activeWorkspace.id}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-mono">
          {activeWorkspace.folders.map((folder) => (
            <div
              key={folder}
              className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition flex items-center gap-2 text-neutral-300"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{folder}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

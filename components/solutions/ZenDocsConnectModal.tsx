'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  X,
  Upload,
  Download,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  Search
} from 'lucide-react';
import { ZenDocument, ZenDocType } from '@/types/docs';
import { DocumentType, SolutionCategory } from '@/types/solutions';
import { LS_ZEN_DOCS, INITIAL_DOCUMENTS } from '@/lib/docsData';

export interface ZenDocsConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'IMPORT' | 'EXPORT';
  // If mode === 'IMPORT', this callback receives the imported document data
  onImportDocument?: (docData: { title: string; rawText: string; type: DocumentType; category?: SolutionCategory }) => void;
  // If mode === 'EXPORT', current draft from studio
  currentDraft?: {
    title: string;
    rawText: string;
    documentType: DocumentType;
    category: SolutionCategory;
  };
}

export function ZenDocsConnectModal({
  isOpen,
  onClose,
  mode,
  onImportDocument,
  currentDraft
}: ZenDocsConnectModalProps) {
  const [documents, setDocuments] = useState<ZenDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportSuccess, setExportSuccess] = useState(false);
  const [exportedDocId, setExportedDocId] = useState<string | null>(null);

  // Load documents from ZEN.DOCS localStorage
  useEffect(() => {
    if (!isOpen) return;
    try {
      const stored = localStorage.getItem(LS_ZEN_DOCS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocuments(parsed);
          return;
        }
      }
      setDocuments(INITIAL_DOCUMENTS);
    } catch {
      setDocuments(INITIAL_DOCUMENTS);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Map ZenDocType to Solution DocumentType
  const mapZenDocTypeToSolution = (docType: ZenDocType): DocumentType => {
    switch (docType) {
      case 'INDIAN_BILL':
        return 'LEGISLATIVE_BILL';
      case 'UN_RESOLUTION':
      case 'DRAFT_RESOLUTION':
        return 'DRAFT_RESOLUTION';
      case 'POLICY_WORKING_PAPER':
        return 'POLICY_WHITEPAPER';
      case 'PRESS_RELEASE':
      case 'PRESS_ARTICLE':
        return 'PRESS_RELEASE';
      case 'RESEARCH_PAPER':
        return 'REPORT';
      default:
        return 'LEGISLATIVE_BILL';
    }
  };

  // Map Solution DocumentType to ZenDocType
  const mapSolutionToZenDocType = (docType: DocumentType): ZenDocType => {
    switch (docType) {
      case 'LEGISLATIVE_BILL':
        return 'INDIAN_BILL';
      case 'DRAFT_RESOLUTION':
      case 'WORKING_PAPER':
        return 'UN_RESOLUTION';
      case 'POLICY_WHITEPAPER':
        return 'POLICY_WORKING_PAPER';
      case 'PRESS_RELEASE':
        return 'PRESS_RELEASE';
      case 'REPORT':
        return 'RESEARCH_PAPER';
      default:
        return 'STANDARD_DOC';
    }
  };

  const handleSelectToImport = (doc: ZenDocument) => {
    // Extract cleanest text version
    const cleanText =
      doc.contentHtml?.replace(/<[^>]*>/g, '\n').replace(/\n{3,}/g, '\n\n').trim() ||
      doc.title;

    if (onImportDocument) {
      onImportDocument({
        title: doc.title,
        rawText: cleanText,
        type: mapZenDocTypeToSolution(doc.docType),
        category: 'GOVERNANCE'
      });
    }
    onClose();
  };

  const handleExportToZenDocs = () => {
    if (!currentDraft) return;

    try {
      const stored = localStorage.getItem(LS_ZEN_DOCS);
      let docsList: ZenDocument[] = [];
      if (stored) {
        try {
          docsList = JSON.parse(stored);
        } catch {
          docsList = [...INITIAL_DOCUMENTS];
        }
      } else {
        docsList = [...INITIAL_DOCUMENTS];
      }

      const newId = `DOC-STUDIO-${Date.now().toString(36).toUpperCase()}`;

      // Convert draft rawText into readable HTML for ZenDocs editor
      const paragraphs = currentDraft.rawText.split('\n\n');
      const htmlBody = paragraphs
        .map(p => {
          const trimmed = p.trim();
          if (trimmed.startsWith('CHAPTER') || trimmed.startsWith('PART')) {
            return `<h2><strong>${trimmed}</strong></h2>`;
          }
          if (trimmed.startsWith('Clause') || /^\d+\./.test(trimmed)) {
            return `<h3><strong>${trimmed.split('\n')[0]}</strong></h3><p>${trimmed.split('\n').slice(1).join('<br/>')}</p>`;
          }
          return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
        })
        .join('');

      const newZenDoc: ZenDocument = {
        id: newId,
        title: currentDraft.title || 'Untitled Policy Draft',
        docCode: `ZD-${Date.now().toString(36).toUpperCase()}`,
        docType: mapSolutionToZenDocType(currentDraft.documentType),
        committeeOrChamber: 'Public Policy Council / Assembly',
        status: 'DRAFT',
        leadSponsors: ['Youth Parliamentary Delegation'],
        signatories: ['Zenvitra Sovereign Enclave'],
        tags: ['Drafting Studio', currentDraft.category, currentDraft.documentType],
        workspaceId: 'ws-foundation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        contentHtml: `<h1><strong>${currentDraft.title || 'Official Resolution Draft'}</strong></h1>${htmlBody}`,
        collaborators: [],
        tasks: [],
        comments: [],
        versions: [
          {
            id: `v-1-${Date.now()}`,
            versionNumber: 1,
            label: 'Initial Studio Import',
            timestamp: new Date().toISOString(),
            author: 'Solutions Studio Engine',
            summary: 'Exported from ZEN.SOLUTIONS Drafting Studio with full clause structure.',
            contentHtml: htmlBody
          }
        ]
      };

      const updatedDocs = [newZenDoc, ...docsList.filter(d => d.id !== newId)];
      localStorage.setItem(LS_ZEN_DOCS, JSON.stringify(updatedDocs));

      setExportedDocId(newId);
      setExportSuccess(true);
    } catch (err) {
      console.error('Failed to export to ZenDocs storage:', err);
    }
  };

  const filteredDocs = documents.filter(
    d =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.docType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl animate-fade-in text-left">
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#0e111d] via-[#090b14] to-[#040508] border border-cyan-500/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_90px_rgba(6,182,212,0.3)] relative overflow-hidden space-y-6 text-white font-sans max-h-[92dvh] flex flex-col">
        
        {/* Glow ambient background accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5 relative z-10 shrink-0">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ZEN.DOCS • DIRECT PIPELINE</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white">
              {mode === 'IMPORT' ? 'Import from ZEN.DOCS Sovereign Editor' : 'Export Draft to ZEN.DOCS'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              {mode === 'IMPORT'
                ? 'Select any document from your ZEN.DOCS vault to auto-populate clauses, tables, and data chapters.'
                : 'Save this structured bill or resolution draft into ZEN.DOCS for collaborative rich-text editing.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode: IMPORT */}
        {mode === 'IMPORT' && (
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col relative z-10">
            {/* Search */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your ZEN.DOCS vault by title or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Document list */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredDocs.map((doc) => {
                const words = doc.contentHtml?.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length || 0;
                return (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectToImport(doc)}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-cyan-500/40 hover:bg-cyan-500/[0.03] transition-all cursor-pointer flex items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono text-[9px] font-bold uppercase">
                          {doc.docType.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">{doc.id}</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white group-hover:text-cyan-200 transition-colors truncate">
                        {doc.title}
                      </h4>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
                        <span>{words} words</span>
                        <span>•</span>
                        <span>Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-400 text-black font-mono text-xs font-bold transition group-hover:bg-cyan-300 flex items-center gap-1.5 shrink-0"
                    >
                      <span>Load Draft</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {filteredDocs.length === 0 && (
                <div className="py-12 text-center text-neutral-500 font-mono text-xs">
                  No documents found matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode: EXPORT */}
        {mode === 'EXPORT' && (
          <div className="space-y-5 flex-1 relative z-10">
            {exportSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-display text-white">Draft Saved into ZEN.DOCS Vault</h3>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto">
                    Your complete draft including all structured clauses, tables, and data chapters has been stored in your sovereign ZEN.DOCS workspace.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="/docs"
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    <span>Open in ZEN.DOCS ↗</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition cursor-pointer"
                  >
                    Done &amp; Return to Studio
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Target Draft Summary</div>
                  <h4 className="font-bold text-white text-base font-display">
                    {currentDraft?.title || 'Untitled Draft'}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-cyan-300">
                    <span>Type: {currentDraft?.documentType}</span>
                    <span>•</span>
                    <span>Category: {currentDraft?.category}</span>
                    <span>•</span>
                    <span>{currentDraft?.rawText.split(/\s+/).filter(Boolean).length || 0} words</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                  Exporting will create a full-fidelity sovereign document inside ZEN.DOCS with automatic HTML conversion for headings, clauses, sub-clauses, and data provisions.
                </p>

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleExportToZenDocs}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-mono text-xs font-bold transition hover:opacity-95 flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>✓ Save into ZEN.DOCS Vault</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

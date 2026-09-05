'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Layers, 
  Shield, 
  Building2,
  FileCheck,
  Radio,
  Newspaper,
  ScrollText
} from 'lucide-react';
import { SolutionDocument, DocumentType, SolutionCategory, DocumentClause } from '@/types/solutions';
import { useAuth } from '@/context/AuthContext';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDocumentCreated: (doc: SolutionDocument) => void;
}

const DOC_TYPE_OPTIONS: { type: DocumentType; label: string; icon: React.ElementType; badgeColor: string; defaultPrefix: string }[] = [
  { type: 'DRAFT_RESOLUTION', label: 'Draft Resolution (Draft Res)', icon: ScrollText, badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30', defaultPrefix: 'UN-GA/RES/79/' },
  { type: 'LEGISLATIVE_BILL', label: 'Legislative Bill / Act', icon: FileCheck, badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', defaultPrefix: 'BILL/2026/' },
  { type: 'PRESS_RELEASE', label: 'Official Press Release', icon: Newspaper, badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30', defaultPrefix: 'PRESS/REL/' },
  { type: 'TREATY_CHARTER', label: 'Multilateral Treaty Charter', icon: Shield, badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', defaultPrefix: 'TREATY/SOV/' },
  { type: 'WORKING_PAPER', label: 'Working Paper / Policy Brief', icon: FileText, badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', defaultPrefix: 'WP/ECOSOC/' },
];

const CATEGORIES: { cat: SolutionCategory; label: string }[] = [
  { cat: 'EDUCATION', label: 'Education Reform & Student Equity' },
  { cat: 'GOVERNANCE', label: 'Civic Governance & Youth Policy' },
  { cat: 'CLIMATE_ENVIRONMENT', label: 'Climate, Energy & Ecological Justice' },
  { cat: 'DIGITAL_CIVICS', label: 'Artificial Intelligence & Sovereign Tech' },
  { cat: 'JUSTICE_RIGHTS', label: 'Human Rights & Constitutional Liberties' },
  { cat: 'GLOBAL_DIPLOMACY', label: 'Global Peacekeeping & Geopolitics' },
];

export function UploadDocumentModal({ isOpen, onClose, onDocumentCreated }: UploadDocumentModalProps) {
  const { profile } = useAuth();

  const [docType, setDocType] = useState<DocumentType>('DRAFT_RESOLUTION');
  const [title, setTitle] = useState('');
  const [documentCode, setDocumentCode] = useState('UN-GA/RES/79/AI-ALIGN-01');
  const [category, setCategory] = useState<SolutionCategory>('DIGITAL_CIVICS');
  const [committee, setCommittee] = useState('Public Policy & Solutions Working Group');
  const [leadSponsors, setLeadSponsors] = useState(profile?.display_name || '');
  const [signatories, setSignatories] = useState('');
  const [abstract, setAbstract] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  
  const [clauses, setClauses] = useState<DocumentClause[]>([
    { clauseNumber: '1', type: 'PREAMBULARY', text: 'Guided by the Charter of the United Nations and universal declarations on youth academic and civic sovereignty,' },
    { clauseNumber: '2', type: 'OPERATIVE', text: 'Urges all signatory Member States to allocate 20% of digital education funding directly to decentralized student-governed laboratories;' }
  ]);

  if (!isOpen) return null;

  const handleDocTypeChange = (type: DocumentType) => {
    setDocType(type);
    const opt = DOC_TYPE_OPTIONS.find(o => o.type === type);
    if (opt) {
      setDocumentCode(`${opt.defaultPrefix}${Math.floor(1000 + Math.random() * 9000)}`);
    }
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      setFileSize(`${(file.size / 1024 / 1024).toFixed(2)} MB`);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleAddClause = (type: 'PREAMBULARY' | 'OPERATIVE') => {
    setClauses(prev => [
      ...prev,
      {
        clauseNumber: String(prev.length + 1),
        type,
        text: type === 'PREAMBULARY' ? 'Recognizing that...' : 'Calls upon all participating delegations to...'
      }
    ]);
  };

  const handleUpdateClause = (index: number, text: string) => {
    setClauses(prev => {
      const next = [...prev];
      next[index].text = text;
      return next;
    });
  };

  const handleRemoveClause = (index: number) => {
    setClauses(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const sponsorsList = leadSponsors.split(',').map(s => s.trim()).filter(Boolean);
    const sigList = signatories.split(',').map(s => s.trim()).filter(Boolean);

    const newDoc: SolutionDocument = {
      id: `doc-${Date.now()}`,
      documentCode: documentCode.trim() || `DOC-${Date.now()}`,
      title: title.trim(),
      documentType: docType,
      category,
      committee: committee.trim() || 'General Assembly Chamber',
      status: 'PROPOSED',
      leadSponsors: sponsorsList.length > 0 ? sponsorsList : ['Primary Drafter'],
      signatories: sigList,
      abstract: abstract.trim() || 'Official parliamentary draft resolution and working policy text submitted to the sovereign registry.',
      clauses: clauses.filter(c => c.text.trim().length > 0),
      fileName: fileName || `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      fileSize: fileSize || '1.42 MB',
      votes: {
        inFavor: 1,
        against: 0,
        abstain: 0
      },
      votedUserIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOfficial: true
    };

    onDocumentCreated(newDoc);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#08090e] border border-white/20 p-5 sm:p-8 shadow-[0_30px_100px_rgba(0,0,0,0.95)] z-10 text-left space-y-6 my-auto max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/30">
                <ScrollText className="w-3.5 h-3.5" />
                SOVEREIGN POLICY &amp; SOLUTION REGISTRY
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight pt-1">
                Submit Policy Draft, Bill or Action Charter
              </h2>
              <p className="text-xs font-mono text-neutral-400">
                Deposit policy frameworks, community bills, research briefs, and action charters into the public ecosystem ledger.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Document Type Selectors */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                1. Select Document Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {DOC_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = docType === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => handleDocTypeChange(opt.type)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-white/10 border-white/40 text-white'
                          : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className={`p-2 rounded-xl border ${opt.badgeColor}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block leading-tight">{opt.label}</span>
                        <span className="text-[10px] font-mono text-neutral-400">{opt.defaultPrefix}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. File Upload / Attachment Simulation */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                2. Upload File (PDF / DOCX / Markdown)
              </label>
              <label className="border-2 border-dashed border-white/15 hover:border-purple-400/40 rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center text-center bg-white/[0.02] hover:bg-purple-500/[0.04] transition cursor-pointer block">
                <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                {fileName ? (
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> File Attached: {fileName}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">Size: {fileSize}</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-xs font-semibold text-white block">Click to upload or drag and drop official document</span>
                    <span className="text-[10px] font-mono text-neutral-500">Supports PDF, DOCX, TXT up to 25MB</span>
                  </div>
                )}
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={handleSimulateFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* 3. Title & Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multilateral Resolution on Autonomous AI Ethics & Public Oversight"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                  Reference Code *
                </label>
                <input
                  type="text"
                  required
                  value={documentCode}
                  onChange={(e) => setDocumentCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm font-mono text-cyan-300 focus:outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            {/* 4. Working Group & Domain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                  Working Group / Authoring Body
                </label>
                <input
                  type="text"
                  placeholder="e.g. Global Youth Policy Lab or Student Civic Assembly"
                  value={committee}
                  onChange={(e) => setCommittee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                  Policy Domain
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SolutionCategory)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0e1017] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400/50 cursor-pointer"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.cat} value={c.cat}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. Sponsors & Co-authors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                  Lead Authors / Initiators (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Author Names, Civic Working Group"
                  value={leadSponsors}
                  onChange={(e) => setLeadSponsors(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                  Co-Signatories &amp; Endorsers
                </label>
                <input
                  type="text"
                  placeholder="e.g. Youth Climate Coalition, Student Tech Syndicate"
                  value={signatories}
                  onChange={(e) => setSignatories(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400/50"
                />
              </div>
            </div>

            {/* 6. Executive Abstract */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider block">
                Executive Abstract &amp; Statement of Intent
              </label>
              <textarea
                rows={3}
                placeholder="Summarize the core mandates, legal frameworks, and targets established by this document..."
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/15 text-sm text-white focus:outline-none focus:border-cyan-400/50 resize-none font-sans"
              />
            </div>

            {/* 7. Interactive Clauses Builder */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-neutral-300 font-bold uppercase tracking-wider">
                  Document Clauses &amp; Operative Mandates
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddClause('PREAMBULARY')}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-mono hover:bg-purple-500/20 transition cursor-pointer"
                  >
                    + Preamble Clause
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddClause('OPERATIVE')}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono hover:bg-cyan-500/20 transition cursor-pointer"
                  >
                    + Operative Clause
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {clauses.map((clause, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 mt-1 ${
                      clause.type === 'PREAMBULARY' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {clause.type === 'PREAMBULARY' ? 'PREAMBLE' : `OP ${idx + 1}`}
                    </span>
                    <textarea
                      rows={2}
                      value={clause.text}
                      onChange={(e) => handleUpdateClause(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-neutral-200 focus:outline-none focus:border-white/30 resize-none font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveClause(idx)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-white/15 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-white text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-neutral-200 transition cursor-pointer"
              >
                Deposit to Public Repository
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

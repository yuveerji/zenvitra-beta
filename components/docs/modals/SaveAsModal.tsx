'use client';

import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileType,
  FileCode,
  Globe2,
  Lock,
  Printer,
  Check,
  Sparkles,
  X
} from 'lucide-react';
import { ZenDocument } from '@/types/docs';
import { ExportFormat, exportDocument } from '@/lib/exportDocument';

export interface SaveAsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: ZenDocument;
  onToast: (msg: string) => void;
}

interface FormatOption {
  format: ExportFormat;
  label: string;
  ext: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    format: 'docx',
    label: 'Microsoft Word',
    ext: '.docx',
    badge: 'Desktop Office',
    description: 'Formatted Word document compatible with MS Word, Google Docs, and LibreOffice.',
    icon: FileType,
    color: '#3b82f6',
  },
  {
    format: 'pdf',
    label: 'PDF Document',
    ext: '.pdf',
    badge: 'Formal Print',
    description: 'High-fidelity A4 layout ready for official diplomatic gazette, printing, and sharing.',
    icon: Printer,
    color: '#ef4444',
  },
  {
    format: 'txt',
    label: 'Plain Text',
    ext: '.txt',
    badge: 'Lightweight',
    description: 'Clean UTF-8 plain text with numbered clauses and paragraphs.',
    icon: FileText,
    color: '#10b981',
  },
  {
    format: 'md',
    label: 'Markdown',
    ext: '.md',
    badge: 'Dev & Notes',
    description: 'GitHub-flavored markdown with headers, bullet points, and metadata.',
    icon: FileCode,
    color: '#a855f7',
  },
  {
    format: 'html',
    label: 'Web Page',
    ext: '.html',
    badge: 'Standalone',
    description: 'Self-contained webpage with embedded styling and responsive layout.',
    icon: Globe2,
    color: '#06b6d4',
  },
  {
    format: 'json',
    label: 'Sovereign Ledger',
    ext: '.json',
    badge: 'Audit Trail',
    description: 'Full JSON backup including audit hashes, collaborators, timestamps, and versions.',
    icon: Lock,
    color: '#f59e0b',
  },
];

export function SaveAsModal({ isOpen, onClose, activeDoc, onToast }: SaveAsModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('docx');
  const [customFilename, setCustomFilename] = useState<string>(activeDoc.title);

  if (!isOpen) return null;

  const handleExport = () => {
    const docWithCustomTitle = { ...activeDoc, title: customFilename.trim() || activeDoc.title };
    exportDocument(docWithCustomTitle, selectedFormat);
    onToast(`Exported document as ${selectedFormat.toUpperCase()}`);
    onClose();
  };

  const selectedOpt = FORMAT_OPTIONS.find((f) => f.format === selectedFormat) || FORMAT_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-3xl bg-[#0b0e17] border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] uppercase font-bold">
              <Download className="w-3 h-3 text-cyan-400" />
              <span>SAVE &bull; EXPORT FILE</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">Save &amp; Download Document</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Name Field */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
            Export File Name:
          </label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 border border-white/15 focus-within:border-cyan-400 transition">
            <input
              type="text"
              value={customFilename}
              onChange={(e) => setCustomFilename(e.target.value)}
              className="bg-transparent text-white text-xs font-mono outline-none w-full"
              placeholder="Enter file name..."
            />
            <span className="text-neutral-500 text-xs font-mono font-bold shrink-0">{selectedOpt.ext}</span>
          </div>
        </div>

        {/* Format Selection Grid */}
        <div className="space-y-2">
          <label className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block">
            Select Output Format:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FORMAT_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = selectedFormat === opt.format;

              return (
                <button
                  key={opt.format}
                  type="button"
                  onClick={() => setSelectedFormat(opt.format)}
                  className={`p-3.5 rounded-2xl border transition text-left space-y-2 cursor-pointer relative ${
                    isSelected
                      ? 'bg-cyan-950/25 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                      : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-white/5" style={{ color: opt.color }}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-white font-bold text-xs">{opt.label}</span>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-2 font-sans">
                    {opt.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-neutral-500">
                    <span>{opt.ext}</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/5 text-neutral-400">{opt.badge}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-[11px] font-mono text-neutral-500">
            Selected: <strong className="text-white">{selectedOpt.label} ({selectedOpt.ext})</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-black font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-3.5 h-3.5 text-black" />
              <span>Download {selectedOpt.ext.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

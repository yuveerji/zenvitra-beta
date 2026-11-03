'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  Crown,
  Building,
  User,
  Mail,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface ZenithApplicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function ZenithApplicationStatusModal({
  isOpen,
  onClose,
  initialQuery = ''
}: ZenithApplicationStatusModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-detect submission from local storage on mount
  useEffect(() => {
    if (isOpen && !query) {
      try {
        const keys = [
          'zenvitra_form_submissions_v1_zenith-secretariat-2026',
          'zenvitra_form_submissions_v1_zenith-mun-2026-secretariat-application'
        ];
        for (const k of keys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length > 0) {
              const latest = arr[0];
              const q = latest.id || latest.data?.ticketId || latest.data?.q4_email;
              if (q) {
                setQuery(q);
                handleSearch(q);
                break;
              }
            }
          }
        }
      } catch (_) {}
    } else if (isOpen && initialQuery) {
      setQuery(initialQuery);
      handleSearch(initialQuery);
    }
  }, [isOpen, initialQuery]);

  const handleSearch = async (searchQuery?: string) => {
    const q = (searchQuery ?? query).trim();
    if (!q) {
      setError('Please enter a Reference ID, Ticket ID, or Email Address');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // 1. Try local storage first for instant feedback
    try {
      const keys = [
        'zenvitra_form_submissions_v1_zenith-secretariat-2026',
        'zenvitra_form_submissions_v1_zenith-mun-2026-secretariat-application'
      ];
      let localFound: any = null;
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr)) {
            const match = arr.find((sub: any) => {
              const d = sub.data || {};
              const cleanQ = q.toLowerCase();
              return (
                (sub.id && sub.id.toLowerCase() === cleanQ) ||
                (d.ticketId && String(d.ticketId).toLowerCase() === cleanQ) ||
                (d.q4_email && String(d.q4_email).toLowerCase() === cleanQ) ||
                (d.email && String(d.email).toLowerCase() === cleanQ)
              );
            });
            if (match) {
              localFound = match;
              break;
            }
          }
        }
      }

      if (localFound) {
        const d = localFound.data || {};
        setResult({
          id: localFound.id,
          ticketId: d.ticketId || localFound.id,
          submittedAt: localFound.submittedAt,
          fullName: d.q1_full_name || d.fullName || 'Secretariat Applicant',
          email: d.q4_email || d.email || '',
          location: d.q3_location || d.city || '',
          institution: d.q6_institution || d.institution || '',
          primaryDept: d.q11_primary_dept || d.preferredSector || 'General Secretariat',
          secondaryDept: d.q11_secondary_dept || d.secondarySector || 'None Specified',
          status: 'UNDER_EVALUATION',
          statusLabel: 'Under Evaluation (100% Merit Review)',
          scorecardActive: true,
          scorecardStage: 'Stage 1 — Application Screening & Practical Review',
          notes: 'Your application is securely recorded on the Sovereign Ledger and has been submitted to the Department Secretariat Review Board.'
        });
        setLoading(false);
        return;
      }
    } catch (_) {}

    // 2. Fetch from server API
    try {
      const res = await fetch(`/api/forms/status?query=${encodeURIComponent(q)}&formId=zenith-secretariat-2026`);
      const data = await res.json();
      if (data.success && data.found && data.application) {
        setResult(data.application);
      } else {
        setError(data.message || 'No application found with that Reference ID, Ticket ID, or Email. Please check for typos or submit an application.');
      }
    } catch (err: any) {
      setError('Network communication failed. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = (text: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#090b12] border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] p-5 sm:p-7 space-y-6 my-6 max-h-[90vh] flex flex-col text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                <Crown className="w-3 h-3" />
                <span>ZENITH MUN 2026</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight">
                Track Application Status
              </h2>
              <p className="text-xs text-neutral-400 font-sans">
                Verify your Secretariat submission, review progress, and departmental routing.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="space-y-2 shrink-0"
          >
            <label className="text-xs font-mono text-neutral-300 block">
              Enter Verification Reference ID, Ticket ID, or Email Address:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. sub_1793693... or SEC-XXXX or your email"
                  className="w-full bg-[#101320] border border-white/15 focus:border-amber-400/60 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none transition font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer disabled:opacity-50 shrink-0 shadow-md"
              >
                {loading ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </form>

          {/* Results Container */}
          <div className="overflow-y-auto space-y-4 pr-1 flex-1">
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">No Records Found</p>
                  <p className="text-[11px] text-red-400/90 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4 animate-fade-in">
                {/* Status Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-black to-amber-500/10 border border-amber-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                      <span>{result.statusLabel || 'Under Evaluation'}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                      STAGE 1 ACTIVE
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white font-sans">
                    {result.fullName}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {result.notes}
                  </p>
                </div>

                {/* Candidate Overview Card */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 font-mono text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-neutral-300">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-neutral-500 uppercase block">Primary Department</span>
                      <span className="text-white font-bold text-xs">{result.primaryDept}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-neutral-500 uppercase block">Secondary Department</span>
                      <span className="text-neutral-300 text-xs">{result.secondaryDept}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-neutral-500 uppercase block">Institution</span>
                      <span className="text-neutral-300 text-xs truncate block">{result.institution || 'Verified Candidate'}</span>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] text-neutral-500 uppercase block">Submission Date</span>
                      <span className="text-neutral-300 text-xs">
                        {new Date(result.submittedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Verification Reference Box */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                    <div className="space-y-0.5 truncate pr-2">
                      <span className="text-[10px] text-neutral-500 uppercase block">Reference Code</span>
                      <span className="text-amber-300 text-xs font-bold truncate block">{result.id}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyId(result.id)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-200 text-[11px] font-sans font-medium flex items-center gap-1.5 transition cursor-pointer shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Next Steps Card */}
                <div className="p-4 rounded-2xl bg-[#0e121d] border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Next Selection Steps</span>
                  </span>
                  <ul className="text-xs text-neutral-300 space-y-1.5 font-sans leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>The Secretariat Selection Committee is scoring applications against the official 100-point rubric.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>Shortlisted candidates will be invited for a brief online interview or departmental task via WhatsApp and Email.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>All appointed Secretariat members qualify for official appointment credentials and the flagship ₹5,000 Best Secretariat Member Award.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-mono text-neutral-500">
              Zenith Selection Engine &bull; 100% Merit
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-medium transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

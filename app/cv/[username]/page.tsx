'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ZenPassport, 
  MunRecord,
  getPassport, 
  getOrCreateDefaultPassport,
  savePassport,
  fetchServerPassport, 
  calculateDiplomaticRank,
  DiplomaticRankDetails,
  getVerificationLevelDetails,
  getCvSharingSettings
} from '@/lib/passport';
import MunCvCard from '@/components/cv/MunCvCard';
import AddMunExperienceModal from '@/components/cv/AddMunExperienceModal';
import EditDiplomaticProfileModal from '@/components/cv/EditDiplomaticProfileModal';
import ShareMunCvModal from '@/components/cv/ShareMunCvModal';
import { 
  exportCvAsPrintHtml, 
  exportCvAsMarkdown, 
  exportCvAsText, 
  exportCvAsJson 
} from '@/lib/export/cvDocumentExporter';
import { 
  Globe, 
  Trophy, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Plus, 
  Share2, 
  Edit3, 
  ArrowLeft, 
  GraduationCap, 
  Flag, 
  Search, 
  Filter, 
  ExternalLink, 
  ChevronRight, 
  TrendingUp,
  Layers,
  Building,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  X,
  Download,
  Printer,
  FileText,
  ChevronDown,
  Link2,
  Shield
} from 'lucide-react';

export default function ModelUnCvPage() {
  const params = useParams();
  const router = useRouter();
  const usernameParam = (typeof params?.username === 'string' ? params.username : 'yuveer').toLowerCase();

  const [passport, setPassport] = useState<ZenPassport | null>(null);
  const [currentUser, setCurrentUser] = useState<{ username: string; fullName: string } | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  // Modals & Menus
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MunRecord | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Intelligent Back Handler: Redirects strictly to the previous page
  const handleExitCv = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      router.push('/');
    }
  };

  // Keyboard Escape Handler to close CV page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !addModalOpen && !editProfileOpen && !shareModalOpen) {
        handleExitCv();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addModalOpen, editProfileOpen, shareModalOpen]);

  // Filters & Search
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'AWARDS' | 'DAIS' | 'VERIFIED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Identify active logged-in user
  useEffect(() => {
    try {
      const stored = localStorage.getItem('zenvitra_session_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.username) {
          const u = parsed.username.toLowerCase();
          const name = parsed.display_name || parsed.name || parsed.displayName || u;
          setCurrentUser({ username: u, fullName: name });
          if (u === usernameParam) {
            setIsOwner(true);
          }
        }
      } else {
        // Fallback: If on test user or yuveer
        if (usernameParam === 'test') {
          setIsOwner(true);
        }
      }
    } catch (_) {}
  }, [usernameParam]);

  // 2. Load passport records
  useEffect(() => {
    const existing = getPassport(usernameParam);
    if (existing) {
      if (usernameParam === 'test') {
        existing.fullName = 'Test Node';
        existing.statusLabel = 'Test Node';
      }
      setPassport(existing);
    } else {
      const defaultName = usernameParam === 'test' 
        ? 'Test Node' 
        : (usernameParam === 'yuveer' ? 'Yuveer Chhatwani' : usernameParam.charAt(0).toUpperCase() + usernameParam.slice(1));
      const generated = getOrCreateDefaultPassport(usernameParam, defaultName);
      if (usernameParam === 'test') {
        generated.fullName = 'Test Node';
        generated.statusLabel = 'Test Node';
      }
      setPassport(generated);
    }

    // Sync from server in background
    fetchServerPassport(usernameParam).then((serverRec) => {
      if (serverRec) {
        if (usernameParam === 'test') {
          serverRec.fullName = 'Test Node';
          serverRec.statusLabel = 'Test Node';
        }
        setPassport(serverRec);
      }
    });
  }, [usernameParam]);

  // Handlers
  const handleSaveRecord = (record: MunRecord) => {
    if (!passport) return;
    const existingIndex = passport.munRecords.findIndex((r) => r.id === record.id);
    let updatedRecords: MunRecord[];
    if (existingIndex >= 0) {
      updatedRecords = [...passport.munRecords];
      updatedRecords[existingIndex] = record;
    } else {
      updatedRecords = [record, ...passport.munRecords];
    }

    const updatedPassport: ZenPassport = {
      ...passport,
      munRecords: updatedRecords,
      updatedAt: new Date().toISOString(),
    };

    setPassport(updatedPassport);
    savePassport(updatedPassport);
    setEditingRecord(null);
  };

  const handleDeleteRecord = (id: string) => {
    if (!passport) return;
    const updatedPassport: ZenPassport = {
      ...passport,
      munRecords: passport.munRecords.filter((r) => r.id !== id),
      updatedAt: new Date().toISOString(),
    };
    setPassport(updatedPassport);
    savePassport(updatedPassport);
  };

  const handleUpdateProfile = (changes: Partial<ZenPassport>) => {
    if (!passport) return;
    const updatedPassport: ZenPassport = {
      ...passport,
      ...changes,
      updatedAt: new Date().toISOString(),
    };
    setPassport(updatedPassport);
    savePassport(updatedPassport);
  };

  const handleCopyId = () => {
    if (!passport || !navigator?.clipboard) return;
    navigator.clipboard.writeText(passport.passportId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Sovereign Privacy & Sharing Telemetry
  const sharingSettings = useMemo(() => getCvSharingSettings(passport), [passport]);

  // Telemetry Calculations
  const rawMunRecords = passport?.munRecords || [];
  const munRecords = useMemo(() => {
    // If visitor and hideUnverifiedRecords is enabled, filter to only verified summits
    if (!isOwner && sharingSettings.hideUnverifiedRecords) {
      return rawMunRecords.filter((r) => r.isOrganiserVerified);
    }
    return rawMunRecords;
  }, [rawMunRecords, isOwner, sharingSettings.hideUnverifiedRecords]);

  const totalConferences = munRecords.length;
  const awardsCount = munRecords.filter((r) => Boolean(r.award)).length;
  const verifiedCount = munRecords.filter((r) => r.isOrganiserVerified).length;
  const daisCount = munRecords.filter((r) => r.role === 'Executive Board' || r.role === 'Secretariat').length;
  const winRate = totalConferences > 0 ? Math.round((awardsCount / totalConferences) * 100) : 0;
  const rank: DiplomaticRankDetails = calculateDiplomaticRank(munRecords);
  const levelDetails = passport ? getVerificationLevelDetails(passport.verification.level) : null;

  // Filtered records
  const filteredRecords = useMemo(() => {
    return munRecords.filter((rec) => {
      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesConf = rec.conferenceName.toLowerCase().includes(q);
        const matchesComm = rec.committee.toLowerCase().includes(q);
        const matchesPort = rec.portfolio.toLowerCase().includes(q);
        const matchesAward = rec.award?.toLowerCase().includes(q);
        if (!matchesConf && !matchesComm && !matchesPort && !matchesAward) return false;
      }

      // Tab filter
      if (activeFilter === 'AWARDS') return Boolean(rec.award);
      if (activeFilter === 'DAIS') return rec.role === 'Executive Board' || rec.role === 'Secretariat';
      if (activeFilter === 'VERIFIED') return rec.isOrganiserVerified;
      return true;
    });
  }, [munRecords, activeFilter, searchQuery]);

  if (!passport) {
    return (
      <div className="min-h-screen bg-[#030407] text-white flex items-center justify-center">
        <div className="text-center space-y-3 font-sans">
          <div className="w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-neutral-400">Loading sovereign diplomatic dossier...</p>
        </div>
      </div>
    );
  }

  // If CV is private and current visitor is not the owner
  if (!isOwner && sharingSettings.visibility === 'PRIVATE') {
    return (
      <div className="min-h-screen bg-[#030407] text-white pt-24 pb-28 px-4 flex flex-col items-center justify-center selection:bg-amber-500/30 relative">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-[#080a13] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
              CONFIDENTIAL PROTOCOL
            </span>
            <h2 className="text-xl font-display font-bold text-white">
              This Model UN CV is Private
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The delegate has restricted public dossier access. Only the verified delegate owner may view their Model UN career telemetry and chamber records.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleExitCv}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Previous Page</span>
            </button>
            <Link
              href="/mun"
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition"
            >
              Explore ZENVITRA MUN Chambers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030407] text-white pt-24 pb-28 px-4 sm:px-6 lg:px-8 selection:bg-amber-500/30 selection:text-amber-200 relative">
      {/* Background Cinematic Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-amber-500/12 via-cyan-500/8 to-transparent blur-3xl rounded-full animate-glow-drift" />
        <div className="absolute top-1/2 -left-48 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExitCv}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-sans font-semibold text-neutral-200 hover:text-white transition cursor-pointer group active:scale-95 shadow-sm"
              title="Back to previous page"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
            <span className="text-neutral-600">•</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
                MODEL UN CV &bull; V1
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              <span className="text-[11px] font-sans font-medium text-neutral-400 hidden sm:inline">
                AUTHENTICATED MULTILATERAL DOSSIER
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {isOwner ? (
              <>
                {/* 1-Click Sovereign Privacy & Sharing Governance */}
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                    sharingSettings.visibility === 'PRIVATE'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                      : !sharingSettings.allowPublicShare || !sharingSettings.allowPublicExport
                        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                        : sharingSettings.visibility === 'UNLISTED'
                          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                  title="Configure CV Privacy & Sovereign Sharing Settings"
                >
                  {sharingSettings.visibility === 'PRIVATE' ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>PRIVATE DOSSIER</span>
                    </>
                  ) : !sharingSettings.allowPublicShare && !sharingSettings.allowPublicExport ? (
                    <>
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PROTECTED (VIEW ONLY)</span>
                    </>
                  ) : !sharingSettings.allowPublicShare ? (
                    <>
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PUBLIC (NON-SHARABLE)</span>
                    </>
                  ) : !sharingSettings.allowPublicExport ? (
                    <>
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PUBLIC (NO EXPORT)</span>
                    </>
                  ) : sharingSettings.visibility === 'UNLISTED' ? (
                    <>
                      <Link2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>UNLISTED (DIRECT)</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>PUBLIC CV</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setEditingRecord(null);
                    setAddModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-bold text-xs uppercase tracking-wider transition shadow-md cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 text-black" />
                  <span>Add Conference</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-sans font-semibold text-white transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-cyan-400" />
                  <span className="hidden sm:inline">Share CV</span>
                </button>

                {/* Clean Unbranded Export Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setExportMenuOpen(!exportMenuOpen)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-sans font-semibold text-neutral-200 hover:text-white transition cursor-pointer"
                    title="Export Model UN CV (Academic, No Watermarks)"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Export CV</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400" />
                  </button>

                  {exportMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setExportMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0c0f1c] border border-white/15 shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl animate-fade-in text-left">
                        <div className="px-3 py-1.5 border-b border-white/10">
                          <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                            Official Academic Export
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setExportMenuOpen(false);
                            exportCvAsPrintHtml(passport, 'geneva-diplomatic');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer group"
                        >
                          <Printer className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="font-semibold text-white">PDF: Geneva Diplomatic</div>
                            <div className="text-[10px] text-neutral-400">Classic European embassy &amp; admissions format</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExportMenuOpen(false);
                            exportCvAsPrintHtml(passport, 'modern-envoy');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer group"
                        >
                          <Printer className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                          <div>
                            <div className="font-semibold text-white">PDF: Modern Executive Envoy</div>
                            <div className="text-[10px] text-neutral-400">Contemporary dual-column leadership layout</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExportMenuOpen(false);
                            exportCvAsMarkdown(passport);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                          <div>
                            <div className="font-semibold">Markdown (.md)</div>
                            <div className="text-[10px] text-neutral-400">Clean GitHub-flavored</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExportMenuOpen(false);
                            exportCvAsText(passport);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <div className="font-semibold">Plain Text (.txt)</div>
                            <div className="text-[10px] text-neutral-400">Clean text resume</div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setExportMenuOpen(false);
                            exportCvAsJson(passport);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer"
                        >
                          <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                          <div>
                            <div className="font-semibold">JSON Schema (.json)</div>
                            <div className="text-[10px] text-neutral-400">Structured data format</div>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <Link
                  href={`/passport/${passport.username}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-sans font-semibold text-cyan-300 transition cursor-pointer"
                  title="View Full Sovereign Passport"
                >
                  <span>🪪 Passport</span>
                </Link>
              </>
            ) : (
              <>
                {/* Visitor Sharing Control */}
                {sharingSettings.allowPublicShare && (
                  <button
                    type="button"
                    onClick={() => setShareModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-sans font-semibold text-white transition cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-neutral-400" />
                    <span>Share</span>
                  </button>
                )}

                {/* Visitor Export Control */}
                {sharingSettings.allowPublicExport ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setExportMenuOpen(!exportMenuOpen)}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-sans font-semibold text-neutral-200 hover:text-white transition cursor-pointer"
                      title="Export Model UN CV (Academic, No Watermarks)"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Export</span>
                      <ChevronDown className="w-3 h-3 text-neutral-400" />
                    </button>

                    {exportMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setExportMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-[#0c0f1c] border border-white/15 shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl animate-fade-in text-left">
                          <div className="px-3 py-1.5 border-b border-white/10">
                            <span className="text-[10px] font-mono font-bold tracking-wider text-neutral-400 uppercase">
                              Official Academic Export
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setExportMenuOpen(false);
                              exportCvAsPrintHtml(passport, 'geneva-diplomatic');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer group"
                          >
                            <Printer className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <div>
                              <div className="font-semibold text-white">PDF: Geneva Diplomatic</div>
                              <div className="text-[10px] text-neutral-400">Classic European embassy &amp; admissions format</div>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setExportMenuOpen(false);
                              exportCvAsPrintHtml(passport, 'modern-envoy');
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer group"
                          >
                            <Printer className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <div>
                              <div className="font-semibold text-white">PDF: Modern Executive Envoy</div>
                              <div className="text-[10px] text-neutral-400">Contemporary dual-column leadership layout</div>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setExportMenuOpen(false);
                              exportCvAsMarkdown(passport);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                            <div>
                              <div className="font-semibold">Markdown (.md)</div>
                              <div className="text-[10px] text-neutral-400">Clean GitHub-flavored</div>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setExportMenuOpen(false);
                              exportCvAsText(passport);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                            <div>
                              <div className="font-semibold">Plain Text (.txt)</div>
                              <div className="text-[10px] text-neutral-400">Clean text resume</div>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setExportMenuOpen(false);
                              exportCvAsJson(passport);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/10 text-xs text-neutral-200 hover:text-white transition text-left cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                            <div>
                              <div className="font-semibold">JSON Schema (.json)</div>
                              <div className="text-[10px] text-neutral-400">Structured data format</div>
                            </div>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div 
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] font-mono text-neutral-400 cursor-default"
                    title="Export restricted by delegate owner"
                  >
                    <Lock className="w-3 h-3 text-neutral-500" />
                    <span>EXPORT RESTRICTED</span>
                  </div>
                )}

                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-sans font-extrabold text-xs uppercase tracking-wider transition shadow-md cursor-pointer active:scale-95"
                >
                  <span>Build your MUN CV</span>
                  <ChevronRight className="w-4 h-4 text-black" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Masterpiece Diplomatic Persona Hero Card */}
        <div className="relative rounded-3xl bg-[#08090f] border border-white/10 shadow-2xl p-6 sm:p-10 overflow-hidden transition-all duration-300">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            {/* Identity & Bio */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar with Diplomatic Tier Ring */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-white/15 border border-white/20 shadow-md">
                  <div className="w-full h-full rounded-[22px] bg-[#0c0f1c] flex items-center justify-center overflow-hidden text-2xl sm:text-3xl font-display font-extrabold text-white">
                    {passport.avatarUrl ? (
                      <img src={passport.avatarUrl} alt={passport.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-outfit">{passport.fullName.charAt(0)}</span>
                    )}
                  </div>
                </div>
                {/* Diplomatic Tier Badge on Avatar */}
                <div 
                  className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-black/90 border border-amber-500/50 text-[10px] font-mono font-bold text-amber-300 shadow-md flex items-center gap-1 glass-specular"
                  title={rank.title}
                >
                  <span>{rank.badge.split(' ')[0]}</span>
                  <span className="hidden sm:inline">L{rank.tier}</span>
                </div>
              </div>

              {/* Text Info */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30 glass-specular">
                    MODEL UN CV
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/30 transition cursor-pointer glass-specular"
                    title="Click to copy Sovereign ID"
                  >
                    <span>{passport.passportId}</span>
                    {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                  </button>
                  {levelDetails && (
                    <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full border glass-specular ${levelDetails.color}`}>
                      {levelDetails.badge}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-3xl sm:text-5xl font-serif font-black text-white tracking-tight">
                    {passport.fullName}
                  </h1>
                  <span className="text-xs sm:text-sm font-mono font-semibold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
                    @{passport.username}
                  </span>
                </div>

                {/* Country & Nationality */}
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-jakarta text-neutral-300">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 glass-specular">
                    <span className="text-base">{passport.countryFlag || '🇺🇸'}</span>
                    <span className="font-semibold text-white">{passport.country || 'United States'}</span>
                  </div>

                  {passport.education?.institution && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-neutral-300 glass-specular">
                      <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{passport.education.institution}</span>
                    </div>
                  )}
                </div>

                {/* Headline / Bio */}
                {passport.headline && (
                  <p className="text-xs sm:text-sm font-jakarta font-medium text-amber-200/90 max-w-2xl pt-0.5">
                    {passport.headline}
                  </p>
                )}
                {passport.bio && (
                  <p className="text-xs text-neutral-400 font-jakarta max-w-2xl leading-relaxed pt-0.5">
                    {passport.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Owner Edit Profile CTA */}
            {isOwner && (
              <div className="shrink-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/15 text-xs font-sans font-semibold text-white transition cursor-pointer glass-specular active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit Profile</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4+ Core Telemetry Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Conferences */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#08090f] border border-white/10 shadow-xl space-y-2 relative overflow-hidden group hover:border-white/25 hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-neutral-300">
                CONFERENCES
              </span>
              <Globe className="w-4 h-4 text-neutral-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              {totalConferences}
            </div>
            <p className="text-[11px] text-neutral-400 font-jakarta">
              Model UN Summits Attended
            </p>
          </div>

          {/* 2. Awards */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#08090f] border border-white/10 shadow-xl space-y-2 relative overflow-hidden group hover:border-white/25 hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-neutral-300">
                AWARDS WON
              </span>
              <Trophy className="w-4 h-4 text-neutral-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              {awardsCount}
            </div>
            <p className="text-[11px] text-neutral-400 font-jakarta flex items-center gap-1.5">
              <span>Gavels &amp; Honors</span>
              {totalConferences > 0 && (
                <span className="text-[10px] text-neutral-200 font-mono font-bold bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                  {winRate}% Win Rate
                </span>
              )}
            </p>
          </div>

          {/* 3. Verified */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#08090f] border border-white/10 shadow-xl space-y-2 relative overflow-hidden group hover:border-white/25 hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-neutral-300">
                VERIFIED DOSSIERS
              </span>
              <ShieldCheck className="w-4 h-4 text-neutral-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
              {verifiedCount}
            </div>
            <p className="text-[11px] text-neutral-400 font-jakarta">
              Secretariat Authenticated
            </p>
          </div>

          {/* 4. Diplomatic Rank */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#08090f] border border-white/10 shadow-xl space-y-2 relative overflow-hidden group hover:border-white/25 hover:-translate-y-1 transition-all duration-200">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase text-neutral-300">
                DIPLOMATIC RANK
              </span>
              <Award className="w-4 h-4 text-neutral-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-xl sm:text-2xl font-outfit font-black text-white tracking-tight truncate">
              {rank.title}
            </div>
            <div className="space-y-1.5 pt-0.5">
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(8, rank.progressPercent)}%` }}
                />
              </div>
              <p className="text-[10px] text-neutral-400 font-jakarta truncate" title={rank.nextMilestone}>
                {rank.nextMilestone}
              </p>
            </div>
          </div>
        </div>

        {/* Filters, Search & Record Feed */}
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-2.5 rounded-2xl bg-[#080a13]/85 border border-white/10 glass-specular backdrop-blur-xl">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveFilter('ALL')}
                className={`px-3.5 py-2 rounded-xl text-xs font-jakarta font-bold transition whitespace-nowrap cursor-pointer ${
                  activeFilter === 'ALL'
                    ? 'bg-white text-black shadow-md shadow-white/10 glass-specular'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                All Summits ({totalConferences})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('AWARDS')}
                className={`px-3.5 py-2 rounded-xl text-xs font-jakarta font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'AWARDS'
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>🏆 Awards ({awardsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('DAIS')}
                className={`px-3.5 py-2 rounded-xl text-xs font-jakarta font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'DAIS'
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>🏛️ Dais &amp; Chair ({daisCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('VERIFIED')}
                className={`px-3.5 py-2 rounded-xl text-xs font-jakarta font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeFilter === 'VERIFIED'
                    ? 'bg-white text-black shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>🛡️ Verified ({verifiedCount})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conferences or committees..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-jakarta text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400/60 transition glass-specular"
              />
            </div>
          </div>

          {/* Conference Records Showcase */}
          {filteredRecords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredRecords.map((rec) => (
                <MunCvCard
                  key={rec.id}
                  record={rec}
                  isOwner={isOwner}
                  onEdit={(r) => {
                    setEditingRecord(r);
                    setAddModalOpen(true);
                  }}
                  onDelete={handleDeleteRecord}
                />
              ))}
            </div>
          ) : (
            /* Masterpiece Empty State (Outshining conventional boring boxes) */
            <div className="relative rounded-3xl bg-[#080a13]/90 border border-white/10 shadow-2xl p-10 sm:p-16 text-center space-y-6 overflow-hidden glass-specular hologram-shine">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 via-cyan-500/10 to-transparent border border-amber-500/30 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl shadow-amber-500/10">
                ⚖️
              </div>

              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-xl sm:text-2xl font-outfit font-black text-white">
                  No conferences recorded yet
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-jakarta leading-relaxed">
                  {passport.fullName} hasn't registered any Model UN summits on their public record yet.
                </p>
              </div>

              {isOwner ? (
                <div className="space-y-4 pt-2 max-w-sm mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRecord(null);
                      setAddModalOpen(true);
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-jakarta font-extrabold text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/20 cursor-pointer active:scale-95 glass-specular"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Your First MUN Conference</span>
                  </button>
                  <p className="text-[11px] font-jakarta text-neutral-500">
                    Add high school MUNs &bull; Collegiate summits &bull; Dais experience &bull; Gavels won
                  </p>
                </div>
              ) : (
                <div className="pt-2 max-w-sm mx-auto space-y-3">
                  <Link
                    href="/auth/register"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 text-black font-jakarta font-extrabold text-xs uppercase tracking-wider transition shadow-xl shadow-amber-500/25 cursor-pointer active:scale-95 glass-specular"
                  >
                    <span>Build your MUN CV on ZENVITRA</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                  <p className="text-[11px] font-jakarta text-neutral-500">
                    Keep your own verified Model UN record and share it with one link.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Power Statement */}
        <div className="p-8 rounded-3xl bg-[#080a13]/80 border border-white/10 text-center space-y-3 glass-specular">
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
            POWERED BY ZENVITRA V1
          </span>
          <p className="text-xs sm:text-sm text-neutral-300 font-jakarta max-w-lg mx-auto leading-relaxed">
            Sovereign Multilateral Identity &bull; Keep your own Model UN record and share it with one link.
          </p>
          <div className="pt-2">
            <Link
              href={isOwner ? `/passport/${passport.username}` : '/auth/register'}
              className="inline-flex items-center gap-1.5 text-xs font-jakarta font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <span>{isOwner ? 'View Full Sovereign Passport →' : 'Create Your Diplomatic Account →'}</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Modals */}
      {addModalOpen && (
        <AddMunExperienceModal
          isOpen={addModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            setEditingRecord(null);
          }}
          onSave={handleSaveRecord}
          initialRecord={editingRecord}
        />
      )}

      {editProfileOpen && (
        <EditDiplomaticProfileModal
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          passport={passport}
          onSave={handleUpdateProfile}
        />
      )}

      {shareModalOpen && (
        <ShareMunCvModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          username={passport.username}
          fullName={passport.fullName}
          passportId={passport.passportId}
        />
      )}
    </div>
  );
}

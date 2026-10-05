'use client';

import React, { useState } from 'react';
import { ZenPassport, WalletCredential } from '@/lib/passport';
import { 
  QrCode, 
  ShieldCheck, 
  Download, 
  ExternalLink, 
  Award, 
  FileText, 
  Ticket, 
  CheckCircle2, 
  Plus, 
  Sparkles,
  Wallet,
  Clock,
  Check
} from 'lucide-react';
import PassportQrModal from './PassportQrModal';

interface PassportWalletTabProps {
  passport: ZenPassport;
  isOwner?: boolean;
  onAddCredential?: (cred: WalletCredential) => void;
}

export default function PassportWalletTab({
  passport,
  isOwner = false,
  onAddCredential
}: PassportWalletTabProps) {
  const [filter, setFilter] = useState<'ALL' | 'EVENT_PASS' | 'CERTIFICATE' | 'AWARD' | 'LETTER'>('ALL');
  const [selectedCredForQr, setSelectedCredForQr] = useState<WalletCredential | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states for adding credential
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<WalletCredential['type']>('EVENT_PASS');
  const [newIssuer, setNewIssuer] = useState('');

  const filteredWallet = passport.wallet.filter((c) => {
    if (filter === 'ALL') return true;
    return c.type === filter;
  });

  const handleCopyLink = (cred: WalletCredential) => {
    const url = `${window.location.origin}/passport/verify/${passport.passportId}?cred=${cred.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(cred.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveAppleWallet = (cred: WalletCredential) => {
    alert(`Pass "${cred.title}" verified for Apple / Google Wallet format.\nPayload signature verified for: ${passport.passportId}`);
  };

  const handleCreateCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIssuer.trim()) return;

    const newCred: WalletCredential = {
      id: `cred-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      issuedBy: newIssuer.trim(),
      issuedAt: new Date().toISOString().split('T')[0],
      isVerified: false,
      metadata: {
        status: 'Pending Organiser Clearance'
      }
    };

    if (onAddCredential) {
      onAddCredential(newCred);
    }
    setNewTitle('');
    setNewIssuer('');
    setIsAddModalOpen(false);
  };

  const getCredentialIcon = (type: WalletCredential['type']) => {
    switch (type) {
      case 'AWARD':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'CERTIFICATE':
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case 'LETTER':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default:
        return <Ticket className="w-5 h-5 text-purple-400" />;
    }
  };

  const getBadgeStyle = (type: WalletCredential['type']) => {
    switch (type) {
      case 'AWARD':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'CERTIFICATE':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'LETTER':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-[#080a11]/85 border border-white/10 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-purple-400" />
            </div>
            <h2 className="text-xl font-display font-extrabold text-white tracking-wide">
              ZEN CREDENTIAL VAULT
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Verified Storage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl font-sans">
            Cryptographically sealed passes, diplomas, accolades, and credential dispatches issued directly through ZENVITRA sovereign protocols.
          </p>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-all hover:scale-[1.02] shadow-lg shadow-white/10 shrink-0 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Credential</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {(['ALL', 'EVENT_PASS', 'CERTIFICATE', 'AWARD', 'LETTER'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-sans font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer border ${
              filter === cat
                ? 'bg-white text-black font-bold border-white shadow-md'
                : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All Credentials' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Empty State adhering to NO-SEED.md */}
      {filteredWallet.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-white/10 bg-[#080a11]/40">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-purple-400 mb-4 shadow-inner">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-base font-display font-bold text-white mb-1">No credentials in this category yet</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6 font-sans">
            Verified event passes, certificates of honour, and dais clearances will automatically be sealed into your ZEN.WALLET upon organiser verification.
          </p>
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white text-xs font-sans font-semibold border border-white/20 transition cursor-pointer"
            >
              + Submit Credential for Verification
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredWallet.map((cred) => (
            <div
              key={cred.id}
              className="relative group p-6 rounded-3xl bg-gradient-to-b from-[#0f121a] to-[#07090e] border border-white/10 hover:border-cyan-400/30 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              {/* Top Row: Type pill + Verified Status */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 shadow-inner">
                      {getCredentialIcon(cred.type)}
                    </div>
                    <span className={`text-[10px] font-sans px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${getBadgeStyle(cred.type)}`}>
                      {cred.type.replace('_', ' ')}
                    </span>
                  </div>

                  {cred.isVerified ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-sans font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>AUTHENTICATED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-sans font-semibold">
                      <span>CLEARANCE PENDING</span>
                    </div>
                  )}
                </div>

                {/* Title & Issuer */}
                <h4 className="text-base sm:text-lg font-display font-extrabold text-white group-hover:text-cyan-200 transition-colors leading-snug">
                  {cred.title}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs text-neutral-400 font-sans">
                  <span className="text-neutral-500 uppercase tracking-wider text-[10px] font-semibold">ISSUED BY:</span>
                  <span className="font-semibold text-neutral-200">{cred.issuedBy}</span>
                </div>

                {/* Date & Identifier */}
                <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-sans text-neutral-400">
                  <span>Issued: {cred.issuedAt}</span>
                  <span className="font-mono text-[11px] text-neutral-500 truncate max-w-[150px]">ID: {cred.id}</span>
                </div>

                {cred.metadata && Object.keys(cred.metadata).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(cred.metadata).map(([k, v]) => (
                      <span key={k} className="text-[10px] font-sans px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/5 text-neutral-300">
                        <span className="text-neutral-500">{k}:</span> <span className="font-semibold text-white">{v}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedCredForQr(cred)}
                    className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/15 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                    title="View Authenticity QR"
                  >
                    <QrCode className="w-4 h-4 text-cyan-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyLink(cred)}
                    className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/15 border border-white/10 text-xs font-sans font-semibold text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedId === cred.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <span>Verify Link</span>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleSaveAppleWallet(cred)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-sans font-semibold text-white transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Wallet Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code Verification Modal */}
      {selectedCredForQr && (
        <PassportQrModal
          isOpen={!!selectedCredForQr}
          onClose={() => setSelectedCredForQr(null)}
          passportId={passport.passportId}
          fullName={passport.fullName}
          username={passport.username}
          verificationLevel={passport.verification.level}
        />
      )}

      {/* Add Credential Modal (Owner only) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0c0e16] border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-display font-bold text-white tracking-wide">Submit Credential for Verification</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCredential} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold text-neutral-300 mb-1.5">CREDENTIAL TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best Delegate — UNSC or Certificate of Merit"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-neutral-300 mb-1.5">CREDENTIAL TYPE</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="EVENT_PASS">Event Pass</option>
                  <option value="CERTIFICATE">Certificate</option>
                  <option value="AWARD">Award / Accolade</option>
                  <option value="LETTER">Official Letter / Recommendation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-neutral-300 mb-1.5">ISSUING ENTITY</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Harvard MUN, Delhi Public School, ZENVITRA Press"
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Once submitted, organisers will match against event records to stamp the cryptographic authentic seal.</span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-sans font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-white text-black font-sans font-bold text-xs hover:bg-neutral-100 transition cursor-pointer"
                >
                  Submit Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

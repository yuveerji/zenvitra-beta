'use client';

import React, { useState } from 'react';
import { ZenPassport, VerificationLevel } from '@/lib/passport';
import { ShieldCheck, GraduationCap, Award, CheckCircle2, Upload, Mail, Sparkles, AlertCircle } from 'lucide-react';

interface PassportVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  passport: ZenPassport;
  onUpgradeLevel: (newLevel: VerificationLevel, details: { studentDocType?: string; zenvitraRoles?: string[] }) => void;
}

export default function PassportVerificationModal({
  isOpen,
  onClose,
  passport,
  onUpgradeLevel
}: PassportVerificationModalProps) {
  const [selectedTargetLevel, setSelectedTargetLevel] = useState<VerificationLevel>(
    (Math.min(passport.verification.level + 1, 3) as VerificationLevel)
  );

  // Form states
  const [studentDocType, setStudentDocType] = useState('School Student ID Card');
  const [selectedRole, setSelectedRole] = useState('DELEGATE');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      if (selectedTargetLevel === 1) {
        onUpgradeLevel(1, {});
        setSuccessMsg('Level 1 Verification Confirmed: Contact credentials cryptographically stamped.');
      } else if (selectedTargetLevel === 2) {
        onUpgradeLevel(2, { studentDocType });
        setSuccessMsg('Level 2 Verification Confirmed: Student credentials authenticated.');
      } else if (selectedTargetLevel === 3) {
        onUpgradeLevel(3, { zenvitraRoles: [selectedRole] });
        setSuccessMsg('Level 3 Accreditation Submitted & Cleared by ZENVITRA Secretariat.');
      }
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-[#0a0c12] border border-white/15 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>ZEN.PASSPORT Verification Protocol</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Permanent cryptographic trust &amp; accreditation tiers</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white text-base px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Level Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setSelectedTargetLevel(1)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedTargetLevel === 1
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md'
                : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:bg-white/[0.05]'
            }`}
          >
            <span className="text-[10px] font-mono uppercase block">TIER 1</span>
            <span className="text-xs font-bold block mt-0.5">Verified Node</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTargetLevel(2)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedTargetLevel === 2
                ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 shadow-md'
                : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:bg-white/[0.05]'
            }`}
          >
            <span className="text-[10px] font-mono uppercase block">TIER 2</span>
            <span className="text-xs font-bold block mt-0.5">Student Tier</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTargetLevel(3)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedTargetLevel === 3
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-md'
                : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:bg-white/[0.05]'
            }`}
          >
            <span className="text-[10px] font-mono uppercase block">TIER 3</span>
            <span className="text-xs font-bold block mt-0.5">Zenvitra Tier</span>
          </button>
        </div>

        {/* Form Body based on target level */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedTargetLevel === 1 && (
            <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Level 1: Phone / Email Authentication</span>
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Confirms active contact ownership. Unlocks registration for global diplomatic conferences and civic discussions.
              </p>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant cryptographic confirmation for account {passport.username}</span>
              </div>
            </div>
          )}

          {selectedTargetLevel === 2 && (
            <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <span>Level 2: Student Identity Verification</span>
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Unlocks student delegate fees, institution leaderboards, and exclusive youth summits.
              </p>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  VERIFICATION METHOD
                </label>
                <select
                  value={studentDocType}
                  onChange={(e) => setStudentDocType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                >
                  <option value="School Student ID Card">School / College Student ID Card (OCR)</option>
                  <option value="Institutional Email (.edu / .ac.in)">Institutional Email Address (.edu / .ac.in / school domain)</option>
                  <option value="Bonafide Certificate">Bonafide Certificate issued by Principal / Registrar</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-cyan-500/30 bg-cyan-950/20 text-center space-y-2">
                <Upload className="w-6 h-6 text-cyan-400 mx-auto" />
                <p className="text-xs text-white font-semibold">Upload ID or Document Proof</p>
                <p className="text-[11px] text-neutral-400">PNG, JPG, PDF up to 10MB. Privacy-shielded strictly from public views.</p>
              </div>
            </div>
          )}

          {selectedTargetLevel === 3 && (
            <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Level 3: Sovereign ZENVITRA Accreditation</span>
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                For active MUN leaders, conference organisers, youth parliamentarians, and accredited journalists.
              </p>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                  OFFICIAL SOVEREIGN ROLE
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                >
                  <option value="SECRETARIAT">Secretariat / Conference Organiser</option>
                  <option value="EXECUTIVE_BOARD">Executive Board / Dais Chairperson</option>
                  <option value="PRESS_CHIEF">Chief Editor / Press Author</option>
                  <option value="DELEGATE">Verified Master Delegate</option>
                  <option value="CORE_CONTRIBUTOR">Foundation Core Contributor</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                Level 3 applications undergo provenance validation across official summit dispatches and verified gazettes.
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-all hover:scale-[1.02] shadow-lg cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Authenticating...' : `Apply for Tier ${selectedTargetLevel}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

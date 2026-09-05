'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Award, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  Link as LinkIcon,
  Crown,
  Users,
  Sparkles,
  Lock,
  Globe,
  Upload
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { 
  MunParticipationRole, 
  MunAward, 
  MunVerificationStatus 
} from '@/types/mun';

interface AddMunExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_COMMITTEES = [
  'UN Security Council (UNSC)',
  'UN Human Rights Council (UNHRC)',
  'UN Office on Drugs and Crime (UNODC)',
  'UN Environment Programme (UNEP)',
  'Disarmament & International Security (DISEC)',
  'Economic and Social Council (ECOSOC)',
  'All India Political Parties Meet (AIPPM)',
  'Lok Sabha / Parliamentary Simulation',
  'Historic Crisis Committee (HCC)',
  'Crisis / Continuous Crisis Committee (CCC)'
];

const AWARDS: { value: MunAward; label: string; icon: string }[] = [
  { value: 'BEST_DELEGATE', label: '🏆 Best Delegate (1st Place / Gavel)', icon: '🏆' },
  { value: 'HIGH_COMMENDATION', label: '🥈 High Commendation (2nd Place)', icon: '🥈' },
  { value: 'SPECIAL_MENTION', label: '🥉 Special Mention (3rd Place)', icon: '🥉' },
  { value: 'HONORABLE_MENTION', label: '🎖️ Honorable Mention', icon: '🎖️' },
  { value: 'BEST_POSITION_PAPER', label: '📜 Best Position Paper / Policy Brief', icon: '📜' },
  { value: 'BEST_CHAIR', label: '👑 Best Executive Board / Chairperson', icon: '👑' },
  { value: 'PARTICIPATION', label: '🏅 Certificate of Participation', icon: '🏅' },
];

export function AddMunExperienceModal({ isOpen, onClose }: AddMunExperienceModalProps) {
  const { addExperience } = useMun();

  const [munName, setMunName] = useState('');
  const [organizerInstitution, setOrganizerInstitution] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [editionYear, setEditionYear] = useState('2026');
  const [isHostedByMe, setIsHostedByMe] = useState(false);
  const [role, setRole] = useState<MunParticipationRole>('DELEGATE');
  const [committee, setCommittee] = useState('UN Security Council (UNSC)');
  const [customCommittee, setCustomCommittee] = useState('');
  const [portfolioOrTitle, setPortfolioOrTitle] = useState('');
  const [award, setAward] = useState<MunAward>('PARTICIPATION');
  const [agendaOrTopic, setAgendaOrTopic] = useState('');
  
  // Verification details
  const [certificateUrl, setCertificateUrl] = useState('');
  const [certificateId, setCertificateId] = useState('');
  const [secretariatEmail, setSecretariatEmail] = useState('');
  const [selfAttestation, setSelfAttestation] = useState(true);
  const [error, setError] = useState('');
  const certFileInputRef = useRef<HTMLInputElement>(null);

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError('File size must be under 15MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setCertificateUrl(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!munName.trim()) {
      setError('Please provide the Model UN or Assembly name.');
      return;
    }
    if (!portfolioOrTitle.trim()) {
      setError(isHostedByMe ? 'Please specify your Secretariat title (e.g. Secretary-General).' : 'Please specify your allocated portfolio / delegation (e.g. Delegate of France).');
      return;
    }

    const finalCommittee = committee === 'OTHER' ? (customCommittee.trim() || 'General Assembly') : committee;
    
    // Determine verification status based on proof provided
    let verificationStatus: MunVerificationStatus = 'PENDING_VERIFICATION';
    if (certificateId.trim() || certificateUrl.trim()) {
      verificationStatus = 'VERIFIED_CERTIFICATE';
    } else if (isHostedByMe && selfAttestation) {
      verificationStatus = 'VERIFIED_SECRETARIAT';
    }

    addExperience({
      munName: munName.trim(),
      editionYear,
      role: isHostedByMe ? (role === 'ORGANIZER_FOUNDER' ? 'ORGANIZER_FOUNDER' : 'SECRETARIAT') : role,
      isHostedByMe,
      committee: finalCommittee,
      portfolioOrTitle: portfolioOrTitle.trim(),
      award: isHostedByMe ? undefined : award,
      agendaOrTopic: agendaOrTopic.trim() || undefined,
      verificationStatus,
      verificationProofUrl: certificateUrl.trim() || undefined,
      certificateId: certificateId.trim() || undefined,
      secretariatContactEmail: secretariatEmail.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center">
      <div className="relative w-full max-w-2xl bg-[#090a0f] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-white font-sans text-left my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[10px] text-amber-300 uppercase tracking-widest font-bold">
                Diplomatic Record &amp; Verification
              </span>
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
              Log Model UN &amp; Assembly Experience
            </h2>
            <p className="text-xs text-zinc-400">
              Record conferences you attended as a delegate, chaired on the dais, or hosted as Secretariat.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Hosting Type Toggle (Attended vs Hosted) */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
              Conference Role Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsHostedByMe(false);
                  setRole('DELEGATE');
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                  !isHostedByMe
                    ? 'bg-amber-500/10 border-amber-500/40 text-white'
                    : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`p-2 rounded-xl ${!isHostedByMe ? 'bg-amber-400 text-black' : 'bg-zinc-900 text-zinc-400'}`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">I Attended as Delegate / EB</h4>
                  <p className="text-[10px] text-zinc-400">Participated in another organization&apos;s MUN</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsHostedByMe(true);
                  setRole('ORGANIZER_FOUNDER');
                }}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition cursor-pointer ${
                  isHostedByMe
                    ? 'bg-purple-500/10 border-purple-500/40 text-white'
                    : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`p-2 rounded-xl ${isHostedByMe ? 'bg-purple-400 text-black' : 'bg-zinc-900 text-zinc-400'}`}>
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">I Hosted / Organized This MUN</h4>
                  <p className="text-[10px] text-zinc-400">Secretariat, Founder or Lead Organizer</p>
                </div>
              </button>
            </div>
          </div>

          {/* MUN Name & Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Model UN / Summit Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={munName}
                onChange={(e) => { setMunName(e.target.value); setError(''); }}
                placeholder="e.g. Oxford Diplomatic MUN 2026, Harvard WorldMUN"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Edition / Year
              </label>
              <select
                value={editionYear}
                onChange={(e) => setEditionYear(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="2027">2027</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020 or earlier</option>
              </select>
            </div>
          </div>

          {/* Specific Role & Committee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Specific Role / Capacity
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as MunParticipationRole)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                {!isHostedByMe ? (
                  <>
                    <option value="DELEGATE">Participant / Delegate / Member</option>
                    <option value="PANELIST_SPEAKER">Speaker / Panelist / Thought Leader</option>
                    <option value="RESEARCHER_AUTHOR">Researcher / Policy Author</option>
                    <option value="EXECUTIVE_BOARD">Executive Board (Chair / Director)</option>
                    <option value="HEAD_DELEGATE">Head Delegate / Team Lead</option>
                    <option value="INTERNATIONAL_PRESS">Press / Media / Writer</option>
                    <option value="SECRETARIAT">Secretariat / Rapporteur</option>
                  </>
                ) : (
                  <>
                    <option value="ORGANIZER_FOUNDER">Founder / Convener / Secretary-General</option>
                    <option value="COMMUNITY_ORGANIZER">Community Organizer / Event Lead</option>
                    <option value="SECRETARIAT">Director-General / Lead Coordinator</option>
                    <option value="EXECUTIVE_BOARD">Executive Board / USG</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                {isHostedByMe ? 'Secretariat Designation' : 'Allotted Portfolio / Country'} <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={portfolioOrTitle}
                onChange={(e) => { setPortfolioOrTitle(e.target.value); setError(''); }}
                placeholder={isHostedByMe ? 'e.g. Secretary-General, Convener' : 'e.g. Delegate of France, Co-Chairperson'}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                required
              />
            </div>
          </div>

          {/* Committee & Award (if attended) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Committee Simulated
              </label>
              <select
                value={committee}
                onChange={(e) => setCommittee(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer"
              >
                {POPULAR_COMMITTEES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="OTHER">Other (Custom Committee)</option>
              </select>
              {committee === 'OTHER' && (
                <input
                  type="text"
                  value={customCommittee}
                  onChange={(e) => setCustomCommittee(e.target.value)}
                  placeholder="Enter custom committee name"
                  className="w-full mt-2 px-4 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
                />
              )}
            </div>

            {!isHostedByMe ? (
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Accolade / Award Won
                </label>
                <select
                  value={award}
                  onChange={(e) => setAward(e.target.value as MunAward)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white focus:outline-none focus:border-white/30 cursor-pointer"
                >
                  {AWARDS.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                  Assembly Type
                </label>
                <div className="px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-purple-300 font-mono flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5 text-purple-400" />
                  <span>Hosted Youth Diplomatic Summit</span>
                </div>
              </div>
            )}
          </div>

          {/* Agenda / Topic */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
              Agenda / Key Resolution Focus (Optional)
            </label>
            <input
              type="text"
              value={agendaOrTopic}
              onChange={(e) => setAgendaOrTopic(e.target.value)}
              placeholder="e.g. Mitigating deepfake proliferation in geopolitical elections"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* ─── MANDATORY VERIFICATION SECTION ─── */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950 border border-emerald-500/20 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="font-bold text-xs text-white">Proof &amp; Verification Protocol</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                Accountability Anchor
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Zenvitra requires genuine verification to prevent fabricated diplomatic records. Provide a certificate URL, verification serial code, or secretariat contact.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase">
                    Certificate Proof
                  </label>
                  <button
                    type="button"
                    onClick={() => certFileInputRef.current?.click()}
                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload File</span>
                  </button>
                </div>
                <input
                  type="file"
                  ref={certFileInputRef}
                  accept="image/*,.pdf"
                  onChange={handleCertificateUpload}
                  className="hidden"
                />
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black border border-zinc-800">
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    value={certificateUrl.startsWith('data:') ? 'Certificate file attached (Ready)' : certificateUrl}
                    onChange={(e) => setCertificateUrl(e.target.value)}
                    placeholder="Upload file or paste Drive / CDN URL..."
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-600 focus:outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={() => certFileInputRef.current?.click()}
                    className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                    title="Upload File"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-zinc-400 uppercase">
                  Certificate ID / Allotment Serial
                </label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black border border-zinc-800">
                  <Lock className="w-3.5 h-3.5 text-zinc-500" />
                  <input
                    type="text"
                    value={certificateId}
                    onChange={(e) => setCertificateId(e.target.value)}
                    placeholder="e.g. MUN-2026-FR-0941"
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[10px] font-mono text-zinc-400 uppercase">
                Secretariat / Conference Contact Email (Optional Cross-Verification)
              </label>
              <input
                type="email"
                value={secretariatEmail}
                onChange={(e) => setSecretariatEmail(e.target.value)}
                placeholder="secretariat@conferencename.org"
                className="w-full px-3 py-2 rounded-xl bg-black border border-zinc-800 text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-white/5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Ratify &amp; Add to Dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

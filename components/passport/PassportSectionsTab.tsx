'use client';

import React, { useState } from 'react';
import { 
  ZenPassport, 
  MunRecord, 
  SpeakingRecord, 
  PressRecord, 
  AchievementRecord, 
  ContributionRecord,
  EducationRecord,
  getVerificationLevelDetails
} from '@/lib/passport';
import { 
  User, 
  GraduationCap, 
  Globe, 
  Mic, 
  FileText, 
  Award, 
  HeartHandshake, 
  Calendar, 
  BarChart3, 
  ShieldCheck, 
  Plus, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface PassportSectionsTabProps {
  passport: ZenPassport;
  isOwner?: boolean;
  onUpdatePassport?: (updated: ZenPassport) => void;
  onRequestVerificationModal?: () => void;
}

export default function PassportSectionsTab({
  passport,
  isOwner = false,
  onUpdatePassport,
  onRequestVerificationModal
}: PassportSectionsTabProps) {
  const [activeSubSection, setActiveSubSection] = useState<
    'IDENTITY' | 'EDUCATION' | 'MUN' | 'SPEAKING' | 'PRESS' | 'ACHIEVEMENTS' | 'CONTRIBUTIONS' | 'ACTIVITY' | 'VERIFICATION'
  >('IDENTITY');

  const [modalMode, setModalMode] = useState<string | null>(null);

  // Sub-section item forms
  const [munForm, setMunForm] = useState({
    conferenceName: '',
    date: new Date().toISOString().split('T')[0],
    committee: '',
    portfolio: '',
    role: 'Delegate' as MunRecord['role'],
    award: ''
  });

  const [pressForm, setPressForm] = useState({
    title: '',
    publication: 'ZENVITRA PRESS',
    publishedAt: new Date().toISOString().split('T')[0],
    url: '',
    doi: ''
  });

  const [speakingForm, setSpeakingForm] = useState({
    title: '',
    event: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Debate' as SpeakingRecord['category']
  });

  const [achievementForm, setAchievementForm] = useState({
    title: '',
    issuer: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Diplomacy & Public Policy'
  });

  const [contributionForm, setContributionForm] = useState({
    title: '',
    initiative: 'ZENVITRA Sovereign Foundation',
    date: new Date().toISOString().split('T')[0],
    type: 'Volunteering' as ContributionRecord['type'],
    pointsEarned: 50
  });

  const [educationForm, setEducationForm] = useState<EducationRecord>({
    institution: passport.education?.institution || '',
    degreeOrGrade: passport.education?.degreeOrGrade || '',
    fieldOfStudy: passport.education?.fieldOfStudy || '',
    graduationYear: passport.education?.graduationYear || '2027',
    isVerified: passport.education?.isVerified || false
  });

  const levelDetails = getVerificationLevelDetails(passport.verification.level);

  // Handlers for adding items
  const handleAddMun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!munForm.conferenceName || !munForm.committee) return;
    const newMun: MunRecord = {
      id: `mun-${Date.now()}`,
      conferenceName: munForm.conferenceName,
      date: munForm.date,
      committee: munForm.committee,
      portfolio: munForm.portfolio,
      role: munForm.role,
      award: munForm.award.trim() || undefined,
      isOrganiserVerified: false
    };
    if (onUpdatePassport) {
      onUpdatePassport({
        ...passport,
        munRecords: [newMun, ...passport.munRecords]
      });
    }
    setModalMode(null);
  };

  const handleAddPress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pressForm.title) return;
    const newPress: PressRecord = {
      id: `press-${Date.now()}`,
      title: pressForm.title,
      publication: pressForm.publication,
      publishedAt: pressForm.publishedAt,
      url: pressForm.url || undefined,
      doi: pressForm.doi || undefined,
      isApproved: false
    };
    if (onUpdatePassport) {
      onUpdatePassport({
        ...passport,
        pressRecords: [newPress, ...passport.pressRecords]
      });
    }
    setModalMode(null);
  };

  const handleAddSpeaking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!speakingForm.title || !speakingForm.event) return;
    const newSp: SpeakingRecord = {
      id: `spk-${Date.now()}`,
      title: speakingForm.title,
      event: speakingForm.event,
      date: speakingForm.date,
      category: speakingForm.category,
      isVerified: false
    };
    if (onUpdatePassport) {
      onUpdatePassport({
        ...passport,
        speakingRecords: [newSp, ...passport.speakingRecords]
      });
    }
    setModalMode(null);
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achievementForm.title || !achievementForm.issuer) return;
    const newAch: AchievementRecord = {
      id: `ach-${Date.now()}`,
      title: achievementForm.title,
      issuer: achievementForm.issuer,
      date: achievementForm.date,
      category: achievementForm.category,
      isVerified: false,
      verificationBadge: 'PROPOSED_CITATION'
    };
    if (onUpdatePassport) {
      onUpdatePassport({
        ...passport,
        achievements: [newAch, ...passport.achievements]
      });
    }
    setModalMode(null);
  };

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributionForm.title) return;
    const newContr: ContributionRecord = {
      id: `cnt-${Date.now()}`,
      title: contributionForm.title,
      initiative: contributionForm.initiative,
      date: contributionForm.date,
      type: contributionForm.type,
      pointsEarned: Number(contributionForm.pointsEarned) || 50,
      isVerified: false
    };
    if (onUpdatePassport) {
      onUpdatePassport({
        ...passport,
        contributions: [newContr, ...passport.contributions]
      });
    }
    setModalMode(null);
  };

  const handleSaveEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePassport) {
      onUpdatePassport({
        ...passport,
        education: educationForm
      });
    }
    setModalMode(null);
  };

  const subSections = [
    { id: 'IDENTITY', label: '👤 Identity', count: undefined },
    { id: 'EDUCATION', label: '🎓 Education', count: passport.education ? 1 : 0 },
    { id: 'MUN', label: '🏛️ MUN', count: passport.munRecords.length },
    { id: 'SPEAKING', label: '🎤 Speaking', count: passport.speakingRecords.length },
    { id: 'PRESS', label: '📰 Press', count: passport.pressRecords.length },
    { id: 'ACHIEVEMENTS', label: '🏆 Achievements', count: passport.achievements.length },
    { id: 'CONTRIBUTIONS', label: '🤝 Contributions', count: passport.contributions.length },
    { id: 'ACTIVITY', label: '📊 Activity', count: undefined },
    { id: 'VERIFICATION', label: '🔐 Verification', count: undefined },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Horizontal Sub-Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {subSections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSubSection(sec.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-sans font-semibold tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeSubSection === sec.id
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            <span>{sec.label}</span>
            {typeof sec.count === 'number' && (
              <span className={`text-[10px] font-sans font-bold px-1.5 py-0.5 rounded-full ${
                activeSubSection === sec.id ? 'bg-black/10 text-black' : 'bg-white/10 text-neutral-300'
              }`}>
                {sec.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 1. IDENTITY SECTION */}
      {activeSubSection === 'IDENTITY' && (
        <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>Sovereign Identity Metadata</span>
            </h3>
            <span className="text-[11px] font-sans font-semibold tracking-wider text-neutral-400">
              MEMBER SINCE {passport.memberSince}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider">FULL NAME</span>
              <p className="text-sm font-bold text-white">{passport.fullName}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider">HANDLE</span>
              <p className="text-sm font-sans font-semibold text-cyan-300">@{passport.username}</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider">PERMANENT PASSPORT IDENTIFIER</span>
              <p className="text-sm font-mono font-bold text-amber-300 tracking-wider">{passport.passportId}</p>
              <p className="text-[10px] text-neutral-500">Universal ID for MUN credentials, press citations & dais entry.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
              <span className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider">STATUS DESIGNATION</span>
              <p className="text-sm font-bold text-emerald-400">{passport.statusLabel}</p>
              <p className="text-[10px] text-neutral-500">{levelDetails.title}</p>
            </div>
          </div>

          {/* Privacy Note: Strictly enforced according to requirements */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 space-y-1">
              <p className="font-bold text-white">Cryptographic Privacy Boundary Active</p>
              <p className="text-neutral-400 leading-relaxed">
                By architectural specification, sensitive private fields (phone number, email address, student verification documents) are permanently shielded and never broadcast on public passport links.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDUCATION SECTION */}
      {activeSubSection === 'EDUCATION' && (
        <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400" />
              <span>Academic & Student Identity</span>
            </h3>
            {isOwner && (
              <button
                type="button"
                onClick={() => setModalMode('EDUCATION')}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-sans font-semibold transition cursor-pointer"
              >
                {passport.education ? 'Edit Education' : '+ Add Academic Info'}
              </button>
            )}
          </div>

          {passport.education ? (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-white">{passport.education.institution}</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {passport.education.degreeOrGrade}
                    {passport.education.fieldOfStudy ? ` • ${passport.education.fieldOfStudy}` : ''}
                  </p>
                </div>
                {passport.education.isVerified ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-sans bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    VERIFIED STUDENT (L2)
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-medium bg-neutral-800 text-neutral-400 border border-white/10">
                    SELF-REPORTED
                  </span>
                )}
              </div>
              <div className="text-xs font-sans text-neutral-400">
                CLASS / GRADUATION YEAR: <span className="font-semibold text-white">{passport.education.graduationYear || 'N/A'}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
              <GraduationCap className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">No academic record attached yet.</p>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => setModalMode('EDUCATION')}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-white text-black text-xs font-semibold cursor-pointer"
                >
                  Add School / University
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. MUN SECTION */}
      {activeSubSection === 'MUN' && (
        <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>Multilateral &amp; Diplomatic Conferences (MUN)</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Conferences, committees, and verified dais roles.</p>
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => setModalMode('MUN')}
                className="px-3 py-1.5 rounded-xl bg-white text-black font-semibold text-xs transition cursor-pointer"
              >
                + Add MUN Record
              </button>
            )}
          </div>

          {passport.munRecords.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
              <Globe className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">No MUN records recorded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passport.munRecords.map((mun) => (
                <div key={mun.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{mun.conferenceName}</h4>
                      <p className="text-xs text-cyan-400 font-sans font-medium mt-0.5">{mun.committee} • {mun.portfolio}</p>
                    </div>
                    {mun.isOrganiserVerified ? (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-sans bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-bold">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-sans bg-neutral-800 text-neutral-400 border border-white/10 font-semibold">
                        PENDING
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans text-neutral-400 pt-2 border-t border-white/5">
                    <span>ROLE: <span className="text-white font-medium">{mun.role}</span></span>
                    <span>DATE: <span className="text-neutral-300">{mun.date}</span></span>
                  </div>
                  {mun.award && (
                    <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-sans font-semibold text-amber-300 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>{mun.award}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. SPEAKING SECTION */}
      {activeSubSection === 'SPEAKING' && (
        <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>Speaking, Debates & Youth Parliaments</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Verified oratory and parliamentary debates.</p>
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => setModalMode('SPEAKING')}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black font-sans font-bold text-xs cursor-pointer hover:bg-neutral-100 transition active:scale-95"
              >
                + Add Speaking Record
              </button>
            )}
          </div>

          {passport.speakingRecords.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
              <Mic className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">No speaking records registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passport.speakingRecords.map((spk) => (
                <div key={spk.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{spk.title}</h4>
                      <p className="text-xs text-neutral-400">{spk.event}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {spk.category}
                    </span>
                  </div>
                  <div className="text-xs font-sans text-neutral-400 pt-2 border-t border-white/5">
                    DATE: <span className="text-neutral-300">{spk.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. PRESS SECTION */}
      {activeSubSection === 'PRESS' && (
        <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Press, Journalism & Scholarly Publications</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Published research papers, press bulletins, and sovereign dispatches.</p>
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => setModalMode('PRESS')}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black font-sans font-bold text-xs cursor-pointer hover:bg-neutral-100 transition active:scale-95"
              >
                + Submit Publication
              </button>
            )}
          </div>

          {passport.pressRecords.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
              <FileText className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">No press articles or publications logged.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {passport.pressRecords.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {p.publication} • Published {p.publishedAt}
                    </p>
                    {p.doi && <span className="text-xs font-mono text-cyan-400">DOI: {p.doi}</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.isApproved ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-sans bg-purple-500/10 text-purple-300 border border-purple-500/30 font-bold">
                        PEER APPROVED
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-neutral-800 text-neutral-400">
                        EDITORIAL REVIEW
                      </span>
                    )}
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. ACHIEVEMENTS SECTION (Verified Only Points) */}
      {activeSubSection === 'ACHIEVEMENTS' && (
        <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Accolades & Merits</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Strict anti-gaming: Zero points assigned unless authenticated by issuing bodies.</p>
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => setModalMode('ACHIEVEMENTS')}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black font-sans font-bold text-xs cursor-pointer hover:bg-neutral-100 transition active:scale-95"
              >
                + Propose Accolade
              </button>
            )}
          </div>

          {passport.achievements.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
              <Award className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">No verified accolades on file.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {passport.achievements.map((ach) => (
                <div key={ach.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{ach.title}</h4>
                      <p className="text-xs text-neutral-400">{ach.issuer}</p>
                    </div>
                    {ach.isVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans bg-amber-500/10 text-amber-300 border border-amber-500/30 font-bold">
                        VERIFIED +100 PTS
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium bg-neutral-800 text-neutral-400">
                        AUDIT PENDING
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs font-sans text-neutral-400 pt-2 border-t border-white/5">
                    <span>{ach.category}</span>
                    <span>{ach.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 7. CONTRIBUTIONS SECTION */}
      {activeSubSection === 'CONTRIBUTIONS' && (
        <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-cyan-400" />
                <span>Contributions & Public Good Initiatives</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Volunteering, organising committees, and open platform contributions.</p>
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => setModalMode('CONTRIBUTIONS')}
                className="px-3.5 py-1.5 rounded-xl bg-white text-black font-sans font-bold text-xs cursor-pointer hover:bg-neutral-100 transition active:scale-95"
              >
                + Record Contribution
              </button>
            )}
          </div>

          {passport.contributions.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
              <HeartHandshake className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-xs text-neutral-400">No community contributions recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {passport.contributions.map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-neutral-400 mt-0.5">{c.initiative} • {c.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-sans font-bold text-cyan-400">
                      +{c.pointsEarned} PTS
                    </span>
                    {c.isVerified && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-sans bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                        VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 8. ACTIVITY & ANALYTICS BREAKDOWN */}
      {activeSubSection === 'ACTIVITY' && (
        <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span>Activity & Merit Ledger Breakdown</span>
            </h3>
            <span className="text-xs font-sans font-semibold tracking-wider text-cyan-400">
              AUDITED ON SOVEREIGN ESCROW
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
              <p className="text-2xl font-display font-black text-white">{passport.munRecords.length}</p>
              <p className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider">CONFERENCES</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
              <p className="text-2xl font-display font-black text-cyan-400">{passport.pressRecords.length}</p>
              <p className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider">PUBLICATIONS</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
              <p className="text-2xl font-display font-black text-amber-400">{passport.achievements.length}</p>
              <p className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider">ACCOLADES</p>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center space-y-1">
              <p className="text-2xl font-display font-black text-emerald-400">{passport.badges.filter(b => b.isUnlocked).length}</p>
              <p className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider">BADGES UNLOCKED</p>
            </div>
          </div>
        </div>
      )}

      {/* 9. VERIFICATION STATUS */}
      {activeSubSection === 'VERIFICATION' && (
        <div className="p-6 rounded-2xl bg-[#090b10] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <span>Verification Levels &amp; Cryptographic Standing</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">Multi-tier identity authentication protocol.</p>
            </div>
            {isOwner && onRequestVerificationModal && (
              <button
                type="button"
                onClick={onRequestVerificationModal}
                className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition cursor-pointer"
              >
                Upgrade Verification
              </button>
            )}
          </div>

          <div className="space-y-3">
            {/* Level 0 */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              passport.verification.level >= 0 ? 'bg-white/[0.02] border-white/15' : 'bg-black/40 border-white/5 opacity-50'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">LEVEL 0 — BASIC NODE</h4>
                <p className="text-[11px] text-neutral-400">Account created with verified session credential.</p>
              </div>
            </div>

            {/* Level 1 */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              passport.verification.level >= 1 ? 'bg-white/[0.02] border-emerald-500/30' : 'bg-black/40 border-white/5 opacity-60'
            }`}>
              {passport.verification.level >= 1 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-bold text-white">LEVEL 1 — VERIFIED NODE</h4>
                <p className="text-[11px] text-neutral-400">Email and mobile communication identity verified.</p>
              </div>
            </div>

            {/* Level 2 */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              passport.verification.level >= 2 ? 'bg-cyan-500/5 border-cyan-500/30' : 'bg-black/40 border-white/5 opacity-60'
            }`}>
              {passport.verification.level >= 2 ? (
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-bold text-white">LEVEL 2 — STUDENT VERIFIED</h4>
                <p className="text-[11px] text-neutral-400">Authenticated student ID or official academic email credential.</p>
              </div>
            </div>

            {/* Level 3 */}
            <div className={`p-4 rounded-xl border flex items-start gap-3 ${
              passport.verification.level >= 3 ? 'bg-amber-500/5 border-amber-500/30' : 'bg-black/40 border-white/5 opacity-60'
            }`}>
              {passport.verification.level >= 3 ? (
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-bold text-white">LEVEL 3 — ZENVITRA VERIFIED</h4>
                <p className="text-[11px] text-neutral-400">Accredited role as Delegate, Secretariat, Press Author, or Dais Member.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODALS FOR RECORD ENTRY */}
      {modalMode === 'EDUCATION' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c0e14] border border-white/15 shadow-2xl space-y-4">
            <h3 className="text-sm font-display font-bold text-white">Update Academic Credentials</h3>
            <form onSubmit={handleSaveEducation} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">INSTITUTION</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern School, DPS, Oxford University"
                  value={educationForm.institution}
                  onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">GRADE / DEGREE</label>
                <input
                  type="text"
                  placeholder="e.g. Grade 11, B.A. Political Science"
                  value={educationForm.degreeOrGrade}
                  onChange={(e) => setEducationForm({ ...educationForm, degreeOrGrade: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalMode(null)} className="px-3.5 py-2 text-xs font-sans text-neutral-400 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-white text-black font-sans font-bold text-xs hover:bg-neutral-100 transition cursor-pointer active:scale-95">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === 'MUN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c0e14] border border-white/15 shadow-2xl space-y-4">
            <h3 className="text-sm font-display font-bold text-white">Record Multilateral Conference (MUN)</h3>
            <form onSubmit={handleAddMun} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">CONFERENCE NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ZENVITRA Virtual MUN 2026"
                  value={munForm.conferenceName}
                  onChange={(e) => setMunForm({ ...munForm, conferenceName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">COMMITTEE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UNSC"
                    value={munForm.committee}
                    onChange={(e) => setMunForm({ ...munForm, committee: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">PORTFOLIO</label>
                  <input
                    type="text"
                    placeholder="e.g. Delegate of France"
                    value={munForm.portfolio}
                    onChange={(e) => setMunForm({ ...munForm, portfolio: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">ROLE</label>
                <select
                  value={munForm.role}
                  onChange={(e) => setMunForm({ ...munForm, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="Delegate">Delegate</option>
                  <option value="Executive Board">Executive Board</option>
                  <option value="Secretariat">Secretariat</option>
                  <option value="Observer">Observer</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">AWARD (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. Best Delegate, High Commendation"
                  value={munForm.award}
                  onChange={(e) => setMunForm({ ...munForm, award: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalMode(null)} className="px-3.5 py-2 text-xs font-sans text-neutral-400 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-white text-black font-sans font-bold text-xs hover:bg-neutral-100 transition cursor-pointer active:scale-95">Add Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === 'SPEAKING' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c0e14] border border-white/15 shadow-2xl space-y-4">
            <h3 className="text-sm font-display font-bold text-white">Record Speaking / Debate</h3>
            <form onSubmit={handleAddSpeaking} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Youth Parliament Debate"
                  value={speakingForm.title}
                  onChange={(e) => setSpeakingForm({ ...speakingForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">EVENT / VENUE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inter-School Oratory Championship"
                  value={speakingForm.event}
                  onChange={(e) => setSpeakingForm({ ...speakingForm, event: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalMode(null)} className="px-3.5 py-2 text-xs font-sans text-neutral-400 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-white text-black font-sans font-bold text-xs hover:bg-neutral-100 transition cursor-pointer active:scale-95">Add Speaking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === 'PRESS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c0e14] border border-white/15 shadow-2xl space-y-4">
            <h3 className="text-sm font-display font-bold text-white">Submit Press Publication</h3>
            <form onSubmit={handleAddPress} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">ARTICLE TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sovereign AI Governance & Emerging Multilateralism"
                  value={pressForm.title}
                  onChange={(e) => setPressForm({ ...pressForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">PUBLICATION</label>
                <input
                  type="text"
                  placeholder="e.g. ZENVITRA Press / Diplomatic Courier"
                  value={pressForm.publication}
                  onChange={(e) => setPressForm({ ...pressForm, publication: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalMode(null)} className="px-3.5 py-2 text-xs font-sans text-neutral-400 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-white text-black font-sans font-bold text-xs hover:bg-neutral-100 transition cursor-pointer active:scale-95">Submit Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === 'ACHIEVEMENTS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c0e14] border border-white/15 shadow-2xl space-y-4">
            <h3 className="text-sm font-display font-bold text-white">Propose Accolade / Award</h3>
            <form onSubmit={handleAddAchievement} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">AWARD TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Outstanding Youth Delegate"
                  value={achievementForm.title}
                  onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">ISSUED BY</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UN Association / University Dais"
                  value={achievementForm.issuer}
                  onChange={(e) => setAchievementForm({ ...achievementForm, issuer: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalMode(null)} className="px-3.5 py-2 text-xs font-sans text-neutral-400 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-white text-black font-sans font-bold text-xs hover:bg-neutral-100 transition cursor-pointer active:scale-95">Propose</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalMode === 'CONTRIBUTIONS' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c0e14] border border-white/15 shadow-2xl space-y-4">
            <h3 className="text-sm font-display font-bold text-white">Record Contribution</h3>
            <form onSubmit={handleAddContribution} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organising Committee Secretariat Lead"
                  value={contributionForm.title}
                  onChange={(e) => setContributionForm({ ...contributionForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans font-bold text-neutral-300 mb-1.5 uppercase tracking-wider">TYPE</label>
                <select
                  value={contributionForm.type}
                  onChange={(e) => setContributionForm({ ...contributionForm, type: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="Volunteering">Volunteering</option>
                  <option value="Open Source Tooling">Open Source Tooling</option>
                  <option value="Dais Support">Dais Support</option>
                  <option value="Campus Ambassador">Campus Ambassador</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setModalMode(null)} className="px-3.5 py-2 text-xs font-sans text-neutral-400 hover:text-white transition">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-white text-black font-sans font-bold text-xs hover:bg-neutral-100 transition cursor-pointer active:scale-95">Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

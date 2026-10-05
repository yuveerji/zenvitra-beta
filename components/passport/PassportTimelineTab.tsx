'use client';

import React, { useState } from 'react';
import { ZenPassport, JourneyMilestone } from '@/lib/passport';
import { 
  ShieldCheck, 
  Plus, 
  Sparkles, 
  Calendar, 
  Award, 
  FileText, 
  Globe, 
  MessageSquare, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface PassportTimelineTabProps {
  passport: ZenPassport;
  isOwner?: boolean;
  onAddMilestone?: (milestone: JourneyMilestone) => void;
}

export default function PassportTimelineTab({
  passport,
  isOwner = false,
  onAddMilestone
}: PassportTimelineTabProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newYear, setNewYear] = useState<number>(new Date().getFullYear());
  const [newMonth, setNewMonth] = useState('October');
  const [newCategory, setNewCategory] = useState<JourneyMilestone['category']>('DIPLOMACY');

  // Group milestones by year descending
  const groupedMilestones = React.useMemo(() => {
    const groups: Record<number, JourneyMilestone[]> = {};
    const sorted = [...passport.timeline].sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.id.localeCompare(a.id);
    });

    sorted.forEach((m) => {
      if (!groups[m.year]) groups[m.year] = [];
      groups[m.year].push(m);
    });

    return groups;
  }, [passport.timeline]);

  const sortedYears = Object.keys(groupedMilestones)
    .map(Number)
    .sort((a, b) => b - a);

  const getCategoryIcon = (cat: JourneyMilestone['category']) => {
    switch (cat) {
      case 'DIPLOMACY':
        return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      case 'PRESS':
        return <FileText className="w-3.5 h-3.5 text-purple-400" />;
      case 'AWARD':
        return <Award className="w-3.5 h-3.5 text-amber-400" />;
      case 'SPEAKING':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const getCategoryBadgeClass = (cat: JourneyMilestone['category']) => {
    switch (cat) {
      case 'DIPLOMACY':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'PRESS':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'AWARD':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'SPEAKING':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    }
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const iconMap: Record<JourneyMilestone['category'], string> = {
      DIPLOMACY: '🏛️',
      PRESS: '📰',
      AWARD: '🏆',
      SPEAKING: '🎤',
      CONTRIBUTION: '🤝',
      COMMUNITY: '🌐'
    };

    const milestone: JourneyMilestone = {
      id: `ms-${Date.now()}`,
      year: newYear,
      month: newMonth,
      icon: iconMap[newCategory] || '✨',
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || undefined,
      category: newCategory,
      isVerified: false
    };

    if (onAddMilestone) {
      onAddMilestone(milestone);
    }

    setNewTitle('');
    setNewSubtitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-[#080a11]/85 border border-white/10 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="text-xl font-display font-extrabold text-white tracking-wide">
              LIVING JOURNEY LEDGER
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Chronological Record
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl font-sans">
            A permanent chronological record of public service, diplomatic appointments, published works, and certified accomplishments.
          </p>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-sans font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-all hover:scale-[1.02] shadow-lg shadow-white/10 shrink-0 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {/* Empty State adhering to NO-SEED.md */}
      {passport.timeline.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-white/10 bg-[#080a11]/40">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-display font-bold text-white mb-1">Your timeline journey starts here</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6 font-sans">
            Every verified MUN, paper published on ZEN.PRESS, speaking engagement, or graduation appears here in chronological sequence.
          </p>
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/15 text-white text-xs font-sans font-semibold border border-white/20 transition cursor-pointer"
            >
              + Add First Journey Milestone
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8 pl-2 sm:pl-4">
          {sortedYears.map((year) => (
            <div key={year} className="relative">
              {/* Year marker */}
              <div className="sticky top-20 z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#090b12] border border-white/20 text-xs font-sans font-bold text-white shadow-md mb-5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{year}</span>
              </div>

              {/* Milestones in this year with vertical stem */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-white/10 space-y-4 ml-3 sm:ml-4">
                {groupedMilestones[year].map((item) => (
                  <div
                    key={item.id}
                    className="relative group p-5 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] hover:bg-white/[0.06] border border-white/[0.08] hover:border-cyan-400/30 transition-all duration-300 shadow-md"
                  >
                    {/* Glowing stem node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full bg-[#080a11] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-sans font-medium text-neutral-400">
                            {item.month}
                          </span>
                          <span className="text-base">{item.icon}</span>
                          <span className={`text-[10px] font-sans px-2.5 py-0.5 rounded-full border font-semibold flex items-center gap-1 ${getCategoryBadgeClass(item.category)}`}>
                            {getCategoryIcon(item.category)}
                            <span>{item.category}</span>
                          </span>
                        </div>

                        <h4 className="text-base font-display font-bold text-white group-hover:text-cyan-200 transition-colors">
                          {item.title}
                        </h4>

                        {item.subtitle && (
                          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {item.isVerified ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-sans font-bold shrink-0 self-start">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>VERIFIED</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-sans font-semibold shrink-0 self-start">
                          <span>PENDING CLEARANCE</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Milestone Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0c0e16] border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-display font-bold text-white tracking-wide">Add Milestone to Ledger</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-semibold text-neutral-300 mb-1.5">MILESTONE TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Addressed 150+ Delegates as Chairperson"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-neutral-300 mb-1.5">DETAILS &amp; CITATION (OPTIONAL)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Chaired United Nations Security Council at SMUN 2026"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-semibold text-neutral-300 mb-1.5">MONTH</label>
                  <select
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-sans font-semibold text-neutral-300 mb-1.5">YEAR</label>
                  <input
                    type="number"
                    min={2015}
                    max={2035}
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans font-semibold text-neutral-300 mb-1.5">CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white text-xs font-sans focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="DIPLOMACY">Diplomacy &amp; Conferences</option>
                  <option value="PRESS">Press &amp; Publications</option>
                  <option value="AWARD">Honours &amp; Accolades</option>
                  <option value="SPEAKING">Speaking &amp; Oratory</option>
                  <option value="CONTRIBUTION">Community Aid &amp; Foundation</option>
                  <option value="COMMUNITY">Campus &amp; Society Leadership</option>
                </select>
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
                  Add Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

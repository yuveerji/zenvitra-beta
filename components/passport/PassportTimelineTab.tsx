'use client';

import React, { useState } from 'react';
import { ZenPassport, JourneyMilestone } from '@/lib/passport';
import { ShieldCheck, Plus, Sparkles, Calendar, Award, FileText, Globe, MessageSquare, CheckCircle2 } from 'lucide-react';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090b10] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⏳</span>
            <h2 className="text-lg font-bold text-white tracking-wide">LIVING JOURNEY TIMELINE</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Chronological Ledger
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            A permanent chronological record of public service, diplomatic appointments, published works, and certified accomplishments.
          </p>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-all hover:scale-[1.02] shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>Add Milestone</span>
          </button>
        )}
      </div>

      {/* Empty State adhering to NO-SEED.md */}
      {passport.timeline.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-white/10 bg-[#090b10]/50">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-2xl mb-4">
            ⏳
          </div>
          <h3 className="text-base font-bold text-white mb-1">Your timeline journey starts here</h3>
          <p className="text-xs text-neutral-400 max-w-md mx-auto mb-6">
            Every verified MUN, paper published on ZEN.PRESS, speaking engagement, or graduation appears here in chronological sequence.
          </p>
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition cursor-pointer"
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
              <div className="sticky top-20 z-10 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#090b10] border border-white/20 text-xs font-mono font-bold text-white shadow-md mb-4">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>{year}</span>
              </div>

              {/* Milestones in this year with vertical stem */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-white/10 space-y-4 ml-3 sm:ml-4">
                {groupedMilestones[year].map((item) => (
                  <div
                    key={item.id}
                    className="relative group p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 transition-all duration-200"
                  >
                    {/* Glowing stem node */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-5 w-4 h-4 rounded-full bg-[#080a10] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-mono font-semibold text-neutral-400">
                            — {item.month}
                          </span>
                          <span className="text-base">{item.icon}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1 ${getCategoryBadgeClass(item.category)}`}>
                            {getCategoryIcon(item.category)}
                            <span>{item.category}</span>
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors">
                          {item.title}
                        </h4>

                        {item.subtitle && (
                          <p className="text-xs text-neutral-400 font-sans">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {item.isVerified ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold shrink-0 self-start">
                          <ShieldCheck className="w-3 h-3" />
                          <span>VERIFIED</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-mono shrink-0 self-start">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0c0e14] border border-white/15 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white tracking-wide">Record Journey Milestone</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">MILESTONE TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Mention, ZENVITRA Virtual MUN"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">DETAILS / CITATION (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. Represented delegation of Norway in UNSC chamber"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">YEAR</label>
                  <input
                    type="number"
                    min={2015}
                    max={2035}
                    value={newYear}
                    onChange={(e) => setNewYear(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-neutral-400 mb-1">MONTH</label>
                  <select
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-neutral-400 mb-1">CATEGORY</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs focus:border-cyan-400 focus:outline-none cursor-pointer"
                >
                  <option value="DIPLOMACY">🏛️ MUN &amp; Diplomacy</option>
                  <option value="PRESS">📰 Journalism &amp; Press</option>
                  <option value="AWARD">🏆 Awards &amp; Accolades</option>
                  <option value="SPEAKING">🎤 Debating &amp; Speaking</option>
                  <option value="CONTRIBUTION">🤝 Contribution &amp; Volunteering</option>
                  <option value="COMMUNITY">🌐 Community Milestone</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />
                Submitted milestones are verified automatically when matched with certified conference daises or platform publications.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition cursor-pointer"
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

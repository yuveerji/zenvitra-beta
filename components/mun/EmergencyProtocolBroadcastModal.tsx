'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Send, 
  Volume2, 
  Radio, 
  ShieldAlert, 
  Layers, 
  Users, 
  CheckCircle2, 
  Flame, 
  Building2, 
  FileWarning, 
  Clock, 
  Eye
} from 'lucide-react';
import { useMun } from '@/context/MunContext';
import { useAuth } from '@/context/AuthContext';
import { EmergencyBroadcast } from '@/types/mun';

interface EmergencyProtocolBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  conferenceId?: string;
  conferenceName?: string;
}

const BROADCAST_TEMPLATES = [
  {
    label: 'Crisis Escalation',
    severity: 'CRISIS_INJECTION' as const,
    category: 'CRISIS' as const,
    title: 'BREAKING: Global Crisis Protocol Activated',
    message: 'Flash crisis update injected into all committees. Delegations must suspend formal caucus, review revised intelligence memos immediately, and prepare draft presidential communiqués within 20 minutes.',
  },
  {
    label: 'Plenary Session Call',
    severity: 'URGENT' as const,
    category: 'SCHEDULE' as const,
    title: 'Executive Secretariat Plenary Assembly Convened',
    message: 'All committee rooms must suspend active debate immediately. Delegates, Dais members, and observers are required to proceed to Main Plenary Hall for joint emergency deliberations.',
  },
  {
    label: 'Resolution Filing Deadline',
    severity: 'ADVISORY' as const,
    category: 'PROCEDURAL' as const,
    title: 'Directive: Final Draft Resolution Submission Deadline',
    message: 'Secretariat document approvals will freeze in 30 minutes. Sponsors must submit final working papers with requisite signatory quotas to Dais desks prior to adjournment.',
  },
  {
    label: 'Security & Chamber Evacuation',
    severity: 'CRITICAL' as const,
    category: 'SECURITY' as const,
    title: 'CRITICAL ALERT: Emergency Building Protocol Active',
    message: 'Maintain order and follow Dais directions immediately. All delegations must evacuate designated committee enclaves toward primary assembly assembly points.',
  },
];

export function EmergencyProtocolBroadcastModal({
  isOpen,
  onClose,
  conferenceId,
  conferenceName,
}: EmergencyProtocolBroadcastModalProps) {
  const { committees, transmitBroadcast } = useMun();
  const { user, profile } = useAuth();

  const [severity, setSeverity] = useState<EmergencyBroadcast['severity']>('URGENT');
  const [category, setCategory] = useState<EmergencyBroadcast['category']>('CRISIS');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetScope, setTargetScope] = useState<EmergencyBroadcast['targetScope']>('ALL_CHAMBERS');
  const [selectedChamberIds, setSelectedChamberIds] = useState<string[]>([]);
  const [audioAlert, setAudioAlert] = useState(true);
  const [bannerOverride, setBannerOverride] = useState(true);
  const [injectFeed, setInjectFeed] = useState(true);
  const [customSignerRole, setCustomSignerRole] = useState('Secretariat President / Dais Authority');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transmissionSuccess, setTransmissionSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApplyTemplate = (tmpl: typeof BROADCAST_TEMPLATES[0]) => {
    setSeverity(tmpl.severity);
    setCategory(tmpl.category);
    setTitle(tmpl.title);
    setMessage(tmpl.message);
  };

  const handleToggleChamber = (cid: string) => {
    setSelectedChamberIds((prev) =>
      prev.includes(cid) ? prev.filter((id) => id !== cid) : [...prev, cid]
    );
  };

  const handleTransmit = () => {
    if (!title.trim() || !message.trim()) return;
    setIsSubmitting(true);

    const transmitterName = profile?.display_name || user?.name || 'Secretariat Director';
    const transmitterHandle = profile?.username || 'secretariat';

    transmitBroadcast({
      conferenceId,
      severity,
      category,
      title: title.trim(),
      message: message.trim(),
      targetScope,
      targetChambers: targetScope === 'SPECIFIC_CHAMBERS' ? selectedChamberIds : undefined,
      audioAlert,
      bannerOverride,
      injectFeed,
      transmitterName,
      transmitterRole: customSignerRole.trim() || 'Executive Secretariat',
      transmitterHandle,
    });

    setIsSubmitting(false);
    setTransmissionSuccess(true);
    setTimeout(() => {
      setTransmissionSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-2xl my-auto rounded-3xl bg-[#090b12] border border-rose-500/40 p-5 sm:p-7 text-white space-y-5 font-sans shadow-[0_25px_80px_rgba(244,63,94,0.18)] relative overflow-hidden">
        {/* Subtle Ambient Pulse */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-rose-500/10 blur-[100px] pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 animate-pulse" />
              </span>
              <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-wide">
                Emergency Protocol Broadcast System
              </h2>
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Live multi-route dispatch across{' '}
              <strong className="text-rose-300">/mun/conference</strong>,{' '}
              <strong className="text-cyan-300">/committee</strong> dais, and{' '}
              <strong className="text-amber-300">/mun</strong> portal.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Directive Templates */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
            ⚡ Quick Directive Presets
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BROADCAST_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                type="button"
                onClick={() => handleApplyTemplate(tmpl)}
                className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left text-[11px] font-mono text-neutral-300 transition hover:border-white/20 cursor-pointer"
              >
                <div className="font-bold text-white truncate">{tmpl.label}</div>
                <div className="text-[9px] text-neutral-400 truncate">{tmpl.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Severity Level & Category Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
              Severity Level
            </label>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              {(
                [
                  { id: 'CRITICAL', label: 'CRITICAL', color: 'border-red-500 bg-red-500/20 text-red-300' },
                  { id: 'URGENT', label: 'URGENT', color: 'border-rose-500 bg-rose-500/20 text-rose-300' },
                  { id: 'CRISIS_INJECTION', label: 'CRISIS INJECTION', color: 'border-purple-500 bg-purple-500/20 text-purple-300' },
                  { id: 'ADVISORY', label: 'ADVISORY', color: 'border-amber-500 bg-amber-500/20 text-amber-300' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSeverity(s.id)}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer font-bold ${
                    severity === s.id ? s.color : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
              Protocol Category
            </label>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              {(['CRISIS', 'SCHEDULE', 'PROCEDURAL', 'SECURITY', 'ANNOUNCEMENT'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`p-2 rounded-xl border text-center transition cursor-pointer font-semibold text-[11px] ${
                    category === cat
                      ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                      : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Target Chamber Scope */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
            Target Chamber Scope
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            {(
              [
                { id: 'ALL_CHAMBERS', label: 'All Chambers' },
                { id: 'SPECIFIC_CHAMBERS', label: 'Specific Chambers' },
                { id: 'EB_ONLY', label: 'Chairs & Dais Only' },
                { id: 'ALL_ATTENDEES', label: 'All Registered' },
              ] as const
            ).map((scope) => (
              <button
                key={scope.id}
                type="button"
                onClick={() => setTargetScope(scope.id)}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  targetScope === scope.id
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                }`}
              >
                {scope.label}
              </button>
            ))}
          </div>

          {targetScope === 'SPECIFIC_CHAMBERS' && (
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 space-y-2">
              <span className="text-[10px] font-mono text-neutral-400 block">
                Select target rooms to receive dispatch:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {committees.length === 0 ? (
                  <span className="text-xs text-neutral-500 font-mono">No configured committee rooms found.</span>
                ) : (
                  committees.map((c) => {
                    const isSelected = selectedChamberIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleToggleChamber(c.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer border ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 font-bold'
                            : 'bg-white/[0.03] border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {c.name}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Directive Title & Message Body */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
              Directive Header / Subject
            </label>
            <input
              type="text"
              placeholder="e.g. BREAKING: Escalation in South China Sea - Emergency Caucus"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-rose-400 transition"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
              <span className="uppercase tracking-wider font-semibold">Directive Instructions / Body</span>
              <span>{message.length}/500 chars</span>
            </div>
            <textarea
              rows={3}
              maxLength={500}
              placeholder="Enter exact operational directives, room changes, or crisis scenario parameters..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-rose-400 transition resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Delivery Options & Dispatcher Signer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-2 p-3 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
              Delivery Controls
            </span>
            <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={audioAlert}
                onChange={(e) => setAudioAlert(e.target.checked)}
                className="rounded accent-rose-500"
              />
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Audible Chime in Chambers</span>
              </span>
            </label>
            <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={bannerOverride}
                onChange={(e) => setBannerOverride(e.target.checked)}
                className="rounded accent-rose-500"
              />
              <span className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Dais &amp; Portal Banner Takeover</span>
              </span>
            </label>
          </div>

          <div className="space-y-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/10 font-mono text-xs">
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold block">
              Transmission Authority
            </span>
            <input
              type="text"
              value={customSignerRole}
              onChange={(e) => setCustomSignerRole(e.target.value)}
              placeholder="Authority Title"
              className="w-full px-2.5 py-1.5 rounded-lg bg-black/60 border border-white/10 text-white text-[11px] focus:outline-none focus:border-rose-400"
            />
            <span className="text-[10px] text-neutral-500 block truncate">
              Signed by @{profile?.username || user?.name || 'secretariat'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>Instant sync across all MUN routes</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white font-mono text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleTransmit}
              disabled={isSubmitting || !title.trim() || !message.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-rose-500/20 cursor-pointer"
            >
              {transmissionSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Transmitted!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Transmit Broadcast</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

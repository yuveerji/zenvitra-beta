'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Clock,
  Users,
  BarChart2,
  Trophy,
  Tv,
  Sparkles,
  X,
  Plus,
  Trash2,
  Check,
  Zap,
  Mic,
  Landmark,
  Radio,
  Lock,
} from 'lucide-react';
import { CustomHostEventConfig, DEFAULT_CUSTOM_EVENT_CONFIG } from '@/types/zenHost';

interface CustomEventBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (config: CustomHostEventConfig) => void;
  initialConfig?: CustomHostEventConfig;
}

export default function CustomEventBuilderModal({
  isOpen,
  onClose,
  onLaunch,
  initialConfig,
}: CustomEventBuilderModalProps) {
  const [config, setConfig] = useState<CustomHostEventConfig>(() => {
    return initialConfig || { ...DEFAULT_CUSTOM_EVENT_CONFIG };
  });

  const [newCriterionName, setNewCriterionName] = useState('');

  if (!isOpen) return null;

  // Quick Preset Templates
  const applyPreset = (type: 'open_mic' | 'pitch' | 'assembly' | 'custom_timer') => {
    if (type === 'open_mic') {
      setConfig({
        ...config,
        eventName: 'Open Mic & Performance Showcase',
        badge: 'SHOWCASE',
        tagline: 'Performer lineup, act titles, stage-ready alerts & audience applause',
        speakerTimerSeconds: 180,
        enableSpeakerTimer: true,
        enableMasterTimer: true,
        masterTimerMinutes: 90,
        strictCutoff: false,
        enableAudioChimes: true,
        enableQueue: true,
        allowSelfQueue: true,
        enableOnDeckCallout: true,
        enableRapidPolls: true,
        enableStageBroadcasts: true,
        enableApplauseMeter: true,
        enableScoringRubric: false,
      });
    } else if (type === 'pitch') {
      setConfig({
        ...config,
        eventName: 'Demo Day & Pitch Competition',
        badge: 'PITCH ROUND',
        tagline: 'Strict timed pitches, jury scoring rubric & live leaderboard',
        speakerTimerSeconds: 180,
        enableSpeakerTimer: true,
        enableMasterTimer: true,
        masterTimerMinutes: 60,
        strictCutoff: true,
        enableAudioChimes: true,
        enableQueue: true,
        allowSelfQueue: false,
        enableOnDeckCallout: true,
        enableRapidPolls: false,
        enableStageBroadcasts: true,
        enableApplauseMeter: true,
        enableScoringRubric: true,
        rubricCriteria: [
          { id: 'crit-pitch-1', name: 'Problem & Value Prop', maxScore: 10 },
          { id: 'crit-pitch-2', name: 'Product & Demo', maxScore: 10 },
          { id: 'crit-pitch-3', name: 'Business Model', maxScore: 10 },
          { id: 'crit-pitch-4', name: 'Delivery & Q&A', maxScore: 10 },
        ],
        enableLeaderboardReveal: true,
      });
    } else if (type === 'assembly') {
      setConfig({
        ...config,
        eventName: 'Mock Youth Parliament / Assembly',
        badge: 'LEGISLATURE',
        tagline: 'Floor debates, calling attention motions & division bell voting',
        speakerTimerSeconds: 120,
        enableSpeakerTimer: true,
        enableMasterTimer: true,
        masterTimerMinutes: 120,
        strictCutoff: false,
        enableAudioChimes: true,
        enableQueue: true,
        allowSelfQueue: true,
        requireHostApproval: true,
        enableOnDeckCallout: true,
        enableRapidPolls: true,
        enableStageBroadcasts: true,
        enableApplauseMeter: false,
        enableScoringRubric: false,
      });
    } else if (type === 'custom_timer') {
      setConfig({
        ...config,
        eventName: 'Custom Stage Timer & Countdown',
        badge: 'STAGE TIMER',
        tagline: 'Simple standalone timer and stopwatch without participant queues',
        speakerTimerSeconds: 300,
        enableSpeakerTimer: true,
        enableMasterTimer: true,
        masterTimerMinutes: 60,
        strictCutoff: true,
        enableAudioChimes: true,
        enableQueue: false,
        allowSelfQueue: false,
        enableOnDeckCallout: false,
        enableRapidPolls: false,
        enableStageBroadcasts: true,
        enableApplauseMeter: false,
        enableAudienceQnA: false,
        enableScoringRubric: false,
      });
    }
  };

  const handleAddCriterion = () => {
    if (!newCriterionName.trim()) return;
    setConfig((prev) => ({
      ...prev,
      rubricCriteria: [
        ...prev.rubricCriteria,
        {
          id: `crit-${Date.now()}`,
          name: newCriterionName.trim(),
          maxScore: 10,
        },
      ],
    }));
    setNewCriterionName('');
  };

  const handleRemoveCriterion = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      rubricCriteria: prev.rubricCriteria.filter((c) => c.id !== id),
    }));
  };

  const handleLaunch = () => {
    onLaunch(config);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-3xl my-8 rounded-3xl bg-[#060a14]/95 border border-white/[0.12] p-6 sm:p-8 space-y-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono font-bold tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>CUSTOM EVENT STUDIO &bull; MODULAR BUILDER</span>
            </div>
            <h2 className="text-2xl font-black font-space text-white tracking-tight uppercase">
              Configure Custom Live Dais
            </h2>
            <p className="text-xs text-neutral-400 font-outfit">
              Customize modular stage tools, countdown rules, lineup queue, audience polls, and scoring rubrics.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Template Presets */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider">
            QUICK-START TEMPLATES
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset('open_mic')}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-amber-500/20 hover:border-amber-400/40 border border-white/10 text-xs font-bold text-neutral-300 hover:text-amber-300 transition flex items-center gap-1.5"
            >
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              <span>Open Mic Showcase</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('pitch')}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-orange-500/20 hover:border-orange-400/40 border border-white/10 text-xs font-bold text-neutral-300 hover:text-orange-300 transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-orange-400" />
              <span>Demo Day / Pitch</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('assembly')}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 hover:border-rose-400/40 border border-white/10 text-xs font-bold text-neutral-300 hover:text-rose-300 transition flex items-center gap-1.5"
            >
              <Landmark className="w-3.5 h-3.5 text-rose-400" />
              <span>Youth Parliament</span>
            </button>
            <button
              type="button"
              onClick={() => applyPreset('custom_timer')}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/20 hover:border-emerald-400/40 border border-white/10 text-xs font-bold text-neutral-300 hover:text-emerald-300 transition flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Normal Stage Timer</span>
            </button>
          </div>
        </div>

        {/* Event Identity Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] border border-white/10 rounded-2xl p-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={config.eventName}
              onChange={(e) => setConfig({ ...config, eventName: e.target.value })}
              placeholder="e.g. Creator Showcase #3, Winter Pitch Day..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Badge Label
            </label>
            <input
              type="text"
              value={config.badge}
              onChange={(e) => setConfig({ ...config, badge: e.target.value.toUpperCase() })}
              placeholder="e.g. SHOWCASE, PITCH, SPRINT..."
              className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-xs text-white font-mono uppercase focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* ── MODULAR TOGGLES ACCORDION / SECTIONS ── */}
        <div className="space-y-4">
          {/* Section 1: Timer & Pacing Toggles */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Timer &amp; Pacing Controls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Speaker Timer Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Speaker / Act Countdown</div>
                  <div className="text-[10px] text-neutral-400">Enforce timer for each active slot</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableSpeakerTimer}
                  onChange={(e) => setConfig({ ...config, enableSpeakerTimer: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Slot Duration (Secs/Mins) */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Default Slot Duration</div>
                  <div className="text-[10px] text-neutral-400">Duration in seconds</div>
                </div>
                <input
                  type="number"
                  min="30"
                  max="3600"
                  step="30"
                  value={config.speakerTimerSeconds}
                  onChange={(e) =>
                    setConfig({ ...config, speakerTimerSeconds: parseInt(e.target.value, 10) || 180 })
                  }
                  className="w-20 px-2 py-1 rounded-lg bg-white/10 border border-white/15 text-xs text-white text-center font-mono"
                />
              </div>

              {/* Master Session Clock */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Master Session Clock</div>
                  <div className="text-[10px] text-neutral-400">Total event countdown duration</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableMasterTimer}
                  onChange={(e) => setConfig({ ...config, enableMasterTimer: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Strict Cutoff vs Overtime */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Strict Auto-Cutoff</div>
                  <div className="text-[10px] text-neutral-400">
                    {config.strictCutoff ? 'Stop immediately at 0:00' : 'Allow overtime countup'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.strictCutoff}
                  onChange={(e) => setConfig({ ...config, strictCutoff: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Audio Chimes / Bell & Buzzer */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 sm:col-span-2">
                <div>
                  <div className="text-xs font-bold text-white">Audio Chimes (Ding &amp; Buzzer)</div>
                  <div className="text-[10px] text-neutral-400">
                    Synthetic Web Audio 30s warning bell &amp; time&apos;s up buzzer
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableAudioChimes}
                  onChange={(e) => setConfig({ ...config, enableAudioChimes: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Queue & Lineup Toggles */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Queue &amp; Speaker Floor Controls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Performer Lineup Queue</div>
                  <div className="text-[10px] text-neutral-400">Manage order of upcoming speakers</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableQueue}
                  onChange={(e) => setConfig({ ...config, enableQueue: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Allow Attendee Self-Queue</div>
                  <div className="text-[10px] text-neutral-400">Attendees can raise hand to join</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.allowSelfQueue}
                  onChange={(e) => setConfig({ ...config, allowSelfQueue: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">&ldquo;On Deck&rdquo; Callout Banner</div>
                  <div className="text-[10px] text-neutral-400">Preview next act before current ends</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableOnDeckCallout}
                  onChange={(e) => setConfig({ ...config, enableOnDeckCallout: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Require Host Approval</div>
                  <div className="text-[10px] text-neutral-400">Host must verify before queuing</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.requireHostApproval}
                  onChange={(e) => setConfig({ ...config, requireHostApproval: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Audience & Interactive Toggles */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <BarChart2 className="w-4 h-4" />
              <span>Audience &amp; Stage Interactivity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                className={`p-3 rounded-xl border flex items-center justify-between transition ${
                  config.enableRapidPolls
                    ? 'bg-black/40 border-white/10'
                    : 'bg-red-950/20 border-red-500/30'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    {!config.enableRapidPolls && <Lock className="w-3.5 h-3.5 text-red-400" />}
                    <span>Allow Audience Voting &amp; Polls</span>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {config.enableRapidPolls
                      ? '● Voting allowed on active pulses'
                      : '🔒 Voting is not allowed / fully disabled'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableRapidPolls}
                  onChange={(e) => setConfig({ ...config, enableRapidPolls: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Lower-Third Broadcast Alerts</div>
                  <div className="text-[10px] text-neutral-400">Display announcements on screens</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableStageBroadcasts}
                  onChange={(e) => setConfig({ ...config, enableStageBroadcasts: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Live Applause / Energy Meter</div>
                  <div className="text-[10px] text-neutral-400">Visual energy bar &amp; cheer sounds</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableApplauseMeter}
                  onChange={(e) => setConfig({ ...config, enableApplauseMeter: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Audience Q&amp;A Stream</div>
                  <div className="text-[10px] text-neutral-400">Collect questions from attendees</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.enableAudienceQnA}
                  onChange={(e) => setConfig({ ...config, enableAudienceQnA: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Judging & Scoring Rubric Toggles */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-yellow-300 uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>Judging &amp; Scoring Rubric</span>
              </div>
              <input
                type="checkbox"
                checked={config.enableScoringRubric}
                onChange={(e) => setConfig({ ...config, enableScoringRubric: e.target.checked })}
                className="w-5 h-5 accent-cyan-400 cursor-pointer"
              />
            </div>

            {config.enableScoringRubric && (
              <div className="space-y-3 pt-2">
                <div className="text-[10px] text-neutral-400">
                  Custom evaluation categories for judges or host scoring:
                </div>

                <div className="space-y-2">
                  {config.rubricCriteria.map((crit) => (
                    <div
                      key={crit.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs"
                    >
                      <span className="font-bold text-white">{crit.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-400">Max {crit.maxScore} pts</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCriterion(crit.id)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add new rubric criterion */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCriterionName}
                    onChange={(e) => setNewCriterionName(e.target.value)}
                    placeholder="Add evaluation criterion (e.g. Delivery, Innovation)..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-black/50 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddCriterion}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Stage Display Projector Toggles */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
              <Tv className="w-4 h-4" />
              <span>Projector &amp; Stage Display Settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Show Active Speaker Card</div>
                  <div className="text-[10px] text-neutral-400">Display spotlight on auditorium screen</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.showSpeakerCardOnDisplay}
                  onChange={(e) =>
                    setConfig({ ...config, showSpeakerCardOnDisplay: e.target.checked })
                  }
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <div className="text-xs font-bold text-white">Show Live Clock on Stage</div>
                  <div className="text-[10px] text-neutral-400">Giant projector countdown clock</div>
                </div>
                <input
                  type="checkbox"
                  checked={config.showTimerOnDisplay}
                  onChange={(e) => setConfig({ ...config, showTimerOnDisplay: e.target.checked })}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleLaunch}
            className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-current" />
            <span>Launch Custom Dais &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
}

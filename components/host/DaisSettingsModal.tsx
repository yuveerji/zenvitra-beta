'use client';

import React from 'react';
import {
  Settings,
  X,
  Users,
  Vote,
  Clock,
  Volume2,
  Sparkles,
  Sliders,
  Tv,
  Trophy,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

export interface DaisLiveSettings {
  // Layout & Column Toggles
  showQueue: boolean;
  showOnDeck: boolean;
  showCompletedActs: boolean;
  showSessionClock: boolean;

  // Voting & Polls Toggles
  enableVoting: boolean;
  showLiveVoteCount: boolean;

  // Interactivity Toggles
  enableApplauseMeter: boolean;
  enableStageBroadcast: boolean;
  enableHostNotes: boolean;

  // Sound FX Toggles
  enableSounds: boolean;
  enableWarningBell: boolean;
  enableBuzzer: boolean;
  enableCheerSound: boolean;

  // Timer Behavior Toggles
  enableTimer: boolean;
  strictCutoff: boolean;

  // Scoring Toggles
  enableScoring: boolean;
}

interface DaisSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DaisLiveSettings;
  onUpdateSettings: (newSettings: DaisLiveSettings) => void;
  onResetDefaults?: () => void;
}

export default function DaisSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDefaults,
}: DaisSettingsModalProps) {
  if (!isOpen) return null;

  const handleToggle = (key: keyof DaisLiveSettings) => {
    onUpdateSettings({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="w-full max-w-2xl my-8 rounded-3xl bg-[#080d1a] border border-white/15 p-6 sm:p-8 space-y-6 text-white shadow-2xl relative">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold tracking-widest uppercase">
              <Settings className="w-3.5 h-3.5 text-cyan-400" />
              <span>DAIS SETTINGS &bull; MODULAR FEATURE TOGGLES</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              Configure Live Stage Features
            </h2>
            <p className="text-xs text-neutral-400">
              Turn any feature, panel, or tool on or off in real-time during your session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toggles Container */}
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
          {/* Section 1: Stage Layout & Columns */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Users className="w-4 h-4" />
              <span>Stage Layout &amp; Panels</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Participant Queue Panel</div>
                  <div className="text-[10px] text-neutral-400">Show right-side speaker lineup</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showQueue}
                  onChange={() => handleToggle('showQueue')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">&ldquo;On Deck&rdquo; Callout Banner</div>
                  <div className="text-[10px] text-neutral-400">Preview next act on stage</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showOnDeck}
                  onChange={() => handleToggle('showOnDeck')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Completed Acts History</div>
                  <div className="text-[10px] text-neutral-400">Log of past speakers &amp; times</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showCompletedActs}
                  onChange={() => handleToggle('showCompletedActs')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Session Total Clock</div>
                  <div className="text-[10px] text-neutral-400">Overall elapsed event clock</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showSessionClock}
                  onChange={() => handleToggle('showSessionClock')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Voting & Audience Polls */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
              <Vote className="w-4 h-4" />
              <span>Voting, Ballots &amp; Polls</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Enable Rapid Live Polls</div>
                  <div className="text-[10px] text-neutral-400">Allow 2-option audience voting</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableVoting}
                  onChange={() => handleToggle('enableVoting')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Show Live Vote Counts</div>
                  <div className="text-[10px] text-neutral-400">Real-time tally on stage display</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showLiveVoteCount}
                  onChange={() => handleToggle('showLiveVoteCount')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Interactivity & Stage Announcements */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Audience Interactivity &amp; Stage Tools</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Applause Meter</div>
                  <div className="text-[10px] text-neutral-400">Energy &amp; cheering bar</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableApplauseMeter}
                  onChange={() => handleToggle('enableApplauseMeter')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Broadcast Alerts</div>
                  <div className="text-[10px] text-neutral-400">Lower-third banners</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableStageBroadcast}
                  onChange={() => handleToggle('enableStageBroadcast')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Host Private Notes</div>
                  <div className="text-[10px] text-neutral-400">Notepad tab</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableHostNotes}
                  onChange={() => handleToggle('enableHostNotes')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 4: Timer & Countdown Rules */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
              <Clock className="w-4 h-4" />
              <span>Timer &amp; Countdown Rules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Enable Countdown Clock</div>
                  <div className="text-[10px] text-neutral-400">Display timed countdown</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableTimer}
                  onChange={() => handleToggle('enableTimer')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Strict Auto-Cutoff</div>
                  <div className="text-[10px] text-neutral-400">
                    {settings.strictCutoff ? 'Stop immediately at 0s' : 'Allow overtime countup'}
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.strictCutoff}
                  onChange={() => handleToggle('strictCutoff')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 5: Audio & Sound Effects */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
              <Volume2 className="w-4 h-4" />
              <span>Audio Effects &amp; Chimes</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Master Sound FX</div>
                  <div className="text-[10px] text-neutral-400">Enable/disable all audio cues</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableSounds}
                  onChange={() => handleToggle('enableSounds')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">30-Second Warning Bell</div>
                  <div className="text-[10px] text-neutral-400">Automated ding at 30s</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableWarningBell}
                  onChange={() => handleToggle('enableWarningBell')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Time&apos;s Up Buzzer / Gong</div>
                  <div className="text-[10px] text-neutral-400">Buzzer at 0 seconds</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableBuzzer}
                  onChange={() => handleToggle('enableBuzzer')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Crowd Applause &amp; Claps</div>
                  <div className="text-[10px] text-neutral-400">Cheer sound effect</div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableCheerSound}
                  onChange={() => handleToggle('enableCheerSound')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 6: Judging & Scoring Rubric */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-yellow-300 uppercase tracking-wider">
              <Trophy className="w-4 h-4" />
              <span>Judging &amp; Evaluation</span>
            </div>

            <div className="pt-1">
              <label className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 cursor-pointer hover:border-white/20 transition">
                <div>
                  <div className="text-xs font-bold text-white">Judge Scoring Rubric Tab</div>
                  <div className="text-[10px] text-neutral-400">
                    Evaluation sliders (Delivery, Content, Impact)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableScoring}
                  onChange={() => handleToggle('enableScoring')}
                  className="w-5 h-5 accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          {onResetDefaults ? (
            <button
              type="button"
              onClick={onResetDefaults}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider transition shadow-md active:scale-95"
          >
            Apply &amp; Close &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

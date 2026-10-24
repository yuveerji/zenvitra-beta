'use client';

import React, { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Clock,
  Sparkles,
  ArrowLeft,
  Plus,
  Minus,
  Settings,
  Bell,
  CheckCircle2,
  Gavel,
  Shield,
  ChevronRight,
  ChevronLeft,
  Sliders,
  Users,
  Award,
  AlertTriangle,
  Flame,
  Radio,
  Share2,
  Edit3,
  Check,
  RefreshCw,
  HelpCircle,
  Tv
} from 'lucide-react';
import StageAmbientBackground from '@/components/host/StageAmbientBackground';

// ── DEBATE FORMAT TYPES ──
export type DebateFormatId =
  | 'asian_parliamentary'
  | 'british_parliamentary'
  | 'oxford'
  | 'lincoln_douglas'
  | 'turncoat'
  | 'mun_caucus'
  | 'custom';

export interface DebateSpeakerSlot {
  id: string;
  title: string;
  side: 'Gov' | 'Opp' | 'Neutral' | 'Aff' | 'Neg' | 'OG' | 'OO' | 'CG' | 'CO';
  defaultDurationSec: number;
  poiAllowed: boolean;
  speakerName?: string;
}

export interface DebateFormatConfig {
  id: DebateFormatId;
  name: string;
  tagline: string;
  description: string;
  defaultSubstantiveSec: number;
  defaultReplySec?: number;
  defaultPoiStartSec: number;
  defaultPoiEndSec: number;
  defaultGraceSec: number;
  speakers: DebateSpeakerSlot[];
}

// ── STANDARD DEBATE PRESETS (ALL CONFIGURABLE) ──
export const DEBATE_FORMAT_PRESETS: Record<DebateFormatId, DebateFormatConfig> = {
  asian_parliamentary: {
    id: 'asian_parliamentary',
    name: 'Asian Parliamentary (3v3)',
    tagline: 'Standard 3v3 Substantive & Reply format',
    description: '3 speakers per side. 6 Substantive speeches + 2 Reply speeches. POIs allowed between 1st & 6th minute.',
    defaultSubstantiveSec: 7 * 60, // 7 mins
    defaultReplySec: 4 * 60,       // 4 mins
    defaultPoiStartSec: 60,        // 1 min
    defaultPoiEndSec: 6 * 60,      // 6 mins
    defaultGraceSec: 20,           // 20s
    speakers: [
      { id: 'ap_pm', title: 'Prime Minister (PM)', side: 'Gov', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'ap_lo', title: 'Leader of Opposition (LO)', side: 'Opp', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'ap_dpm', title: 'Deputy Prime Minister (DPM)', side: 'Gov', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'ap_dlo', title: 'Deputy Leader of Opp (DLO)', side: 'Opp', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'ap_gw', title: 'Government Whip (GW)', side: 'Gov', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'ap_ow', title: 'Opposition Whip (OW)', side: 'Opp', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'ap_or', title: 'Opposition Reply (OR)', side: 'Opp', defaultDurationSec: 4 * 60, poiAllowed: false },
      { id: 'ap_gr', title: 'Government Reply (GR)', side: 'Gov', defaultDurationSec: 4 * 60, poiAllowed: false },
    ],
  },
  british_parliamentary: {
    id: 'british_parliamentary',
    name: 'British Parliamentary (BP / Worlds)',
    tagline: '4 Teams: OG, OO, CG, CO',
    description: 'World Universities Debating Championship standard. 4 teams of 2. 7-min speeches with protected 1st & last minutes.',
    defaultSubstantiveSec: 7 * 60,
    defaultPoiStartSec: 60,
    defaultPoiEndSec: 6 * 60,
    defaultGraceSec: 15,
    speakers: [
      { id: 'bp_pm', title: 'Prime Minister (OG)', side: 'OG', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'bp_lo', title: 'Leader of Opposition (OO)', side: 'OO', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'bp_dpm', title: 'Deputy Prime Minister (OG)', side: 'OG', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'bp_dlo', title: 'Deputy Leader of Opp (OO)', side: 'OO', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'bp_mg', title: 'Member for Government (CG)', side: 'CG', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'bp_mo', title: 'Member for Opposition (CO)', side: 'CO', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'bp_gw', title: 'Government Whip (CG)', side: 'CG', defaultDurationSec: 7 * 60, poiAllowed: true },
      { id: 'bp_ow', title: 'Opposition Whip (CO)', side: 'CO', defaultDurationSec: 7 * 60, poiAllowed: true },
    ],
  },
  oxford: {
    id: 'oxford',
    name: 'Oxford / Traditional Parliamentary',
    tagline: '2v2 Proposition vs Opposition',
    description: 'Constructive round, cross-examination, and closing rebuttals. Configurable floor debate buffer.',
    defaultSubstantiveSec: 5 * 60,
    defaultReplySec: 3 * 60,
    defaultPoiStartSec: 60,
    defaultPoiEndSec: 4 * 60,
    defaultGraceSec: 15,
    speakers: [
      { id: 'ox_p1', title: '1st Proposition (Constructive)', side: 'Gov', defaultDurationSec: 5 * 60, poiAllowed: true },
      { id: 'ox_o1', title: '1st Opposition (Constructive)', side: 'Opp', defaultDurationSec: 5 * 60, poiAllowed: true },
      { id: 'ox_p2', title: '2nd Proposition (Rebuttal)', side: 'Gov', defaultDurationSec: 4 * 60, poiAllowed: true },
      { id: 'ox_o2', title: '2nd Opposition (Rebuttal)', side: 'Opp', defaultDurationSec: 4 * 60, poiAllowed: true },
      { id: 'ox_or', title: 'Opposition Closing Summary', side: 'Opp', defaultDurationSec: 3 * 60, poiAllowed: false },
      { id: 'ox_pr', title: 'Proposition Final Reply', side: 'Gov', defaultDurationSec: 3 * 60, poiAllowed: false },
    ],
  },
  lincoln_douglas: {
    id: 'lincoln_douglas',
    name: 'Lincoln-Douglas (1v1)',
    tagline: 'Philosophical & Policy 1v1 Values Debate',
    description: 'Affirmative vs Negative. Strict alternating constructive, cross-examination, and rebuttal times.',
    defaultSubstantiveSec: 6 * 60,
    defaultPoiStartSec: 0,
    defaultPoiEndSec: 0,
    defaultGraceSec: 10,
    speakers: [
      { id: 'ld_ac', title: 'Affirmative Constructive (AC)', side: 'Aff', defaultDurationSec: 6 * 60, poiAllowed: false },
      { id: 'ld_ncx', title: 'Negative Cross-Ex of Aff (CX)', side: 'Neg', defaultDurationSec: 3 * 60, poiAllowed: false },
      { id: 'ld_nc', title: 'Negative Constructive & 1NR', side: 'Neg', defaultDurationSec: 7 * 60, poiAllowed: false },
      { id: 'ld_acx', title: 'Affirmative Cross-Ex of Neg (CX)', side: 'Aff', defaultDurationSec: 3 * 60, poiAllowed: false },
      { id: 'ld_1ar', title: '1st Affirmative Rebuttal (1AR)', side: 'Aff', defaultDurationSec: 4 * 60, poiAllowed: false },
      { id: 'ld_nr', title: 'Negative Final Rebuttal (2NR)', side: 'Neg', defaultDurationSec: 6 * 60, poiAllowed: false },
      { id: 'ld_2ar', title: '2nd Affirmative Rebuttal (2AR)', side: 'Aff', defaultDurationSec: 3 * 60, poiAllowed: false },
    ],
  },
  turncoat: {
    id: 'turncoat',
    name: 'Turncoat / Extempore Debate',
    tagline: 'Single Speaker Debates Both Sides',
    description: 'Speaker begins FOR the motion, bell rings at midpoint to turn and argue AGAINST the motion, ending with synthesis.',
    defaultSubstantiveSec: 5 * 60,
    defaultPoiStartSec: 2 * 60 + 30, // Turn bell at 2:30
    defaultPoiEndSec: 4 * 60 + 30,   // Final warning at 4:30
    defaultGraceSec: 15,
    speakers: [
      { id: 'tc_s1', title: 'Speaker 1 (Turncoat Stance)', side: 'Neutral', defaultDurationSec: 5 * 60, poiAllowed: false },
      { id: 'tc_s2', title: 'Speaker 2 (Turncoat Stance)', side: 'Neutral', defaultDurationSec: 5 * 60, poiAllowed: false },
      { id: 'tc_s3', title: 'Speaker 3 (Turncoat Stance)', side: 'Neutral', defaultDurationSec: 5 * 60, poiAllowed: false },
      { id: 'tc_s4', title: 'Speaker 4 (Turncoat Stance)', side: 'Neutral', defaultDurationSec: 5 * 60, poiAllowed: false },
    ],
  },
  mun_caucus: {
    id: 'mun_caucus',
    name: 'MUN Committee / GSL / Caucus',
    tagline: 'General Speakers List & Moderated Caucuses',
    description: 'Configurable delegate speaking times with yield options and total caucus chronometer.',
    defaultSubstantiveSec: 90, // 90s GSL
    defaultPoiStartSec: 0,
    defaultPoiEndSec: 75,      // 15s warning
    defaultGraceSec: 10,
    speakers: [
      { id: 'mun_gsl', title: 'General Speakers List (GSL)', side: 'Neutral', defaultDurationSec: 90, poiAllowed: false },
      { id: 'mun_mod', title: 'Moderated Caucus Speaker', side: 'Neutral', defaultDurationSec: 60, poiAllowed: false },
      { id: 'mun_unmod', title: 'Unmoderated Caucus Consultation', side: 'Neutral', defaultDurationSec: 15 * 60, poiAllowed: false },
    ],
  },
  custom: {
    id: 'custom',
    name: 'Custom / Freeform Debate Timer',
    tagline: 'Configure any speech time, warnings & grace',
    description: 'Zero constraints. Choose exact minutes & seconds, custom POI points, and custom rounds.',
    defaultSubstantiveSec: 5 * 60,
    defaultPoiStartSec: 60,
    defaultPoiEndSec: 4 * 60,
    defaultGraceSec: 20,
    speakers: [
      { id: 'cust_spk1', title: 'Round 1 Speaker', side: 'Gov', defaultDurationSec: 5 * 60, poiAllowed: true },
      { id: 'cust_spk2', title: 'Round 2 Speaker', side: 'Opp', defaultDurationSec: 5 * 60, poiAllowed: true },
      { id: 'cust_spk3', title: 'Round 3 Speaker', side: 'Gov', defaultDurationSec: 5 * 60, poiAllowed: true },
      { id: 'cust_spk4', title: 'Round 4 Speaker', side: 'Opp', defaultDurationSec: 5 * 60, poiAllowed: true },
    ],
  },
};

function DebateTimerInner() {
  const searchParams = useSearchParams();
  const initialFormatParam = (searchParams?.get('format') as DebateFormatId) || 'asian_parliamentary';
  const initialMotionParam = searchParams?.get('motion') || '';

  // ── CORE STATE ──
  const [formatId, setFormatId] = useState<DebateFormatId>(
    DEBATE_FORMAT_PRESETS[initialFormatParam] ? initialFormatParam : 'asian_parliamentary'
  );
  const activePreset = DEBATE_FORMAT_PRESETS[formatId] || DEBATE_FORMAT_PRESETS.asian_parliamentary;

  // Active Motion / Debate Topic
  const [motion, setMotion] = useState<string>(
    initialMotionParam || 'This House Would Implement A Universal Sovereign Asset Framework'
  );
  const [isEditingMotion, setIsEditingMotion] = useState(false);
  const [motionInput, setMotionInput] = useState(motion);

  // Speakers State for Active Format (allows custom names & durations per speaker)
  const [speakers, setSpeakers] = useState<DebateSpeakerSlot[]>(activePreset.speakers);
  const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);

  // Timing Configurations for Current Format (FULLY CONFIGURABLE IN ALL MODES)
  const [speechDurationSec, setSpeechDurationSec] = useState<number>(
    activePreset.speakers[0]?.defaultDurationSec || activePreset.defaultSubstantiveSec
  );
  const [poiStartSec, setPoiStartSec] = useState<number>(activePreset.defaultPoiStartSec);
  const [poiEndSec, setPoiEndSec] = useState<number>(activePreset.defaultPoiEndSec);
  const [graceSec, setGraceSec] = useState<number>(activePreset.defaultGraceSec);

  // Active Clock Engine
  const [remainingSec, setRemainingSec] = useState<number>(speechDurationSec);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [countDirection, setCountDirection] = useState<'down' | 'up'>('down');

  // Input states inside Configuration Drawer
  const [configMinInput, setConfigMinInput] = useState<string>(Math.floor(speechDurationSec / 60).toString());
  const [configSecInput, setConfigSecInput] = useState<string>((speechDurationSec % 60).toString());
  const [configGraceInput, setConfigGraceInput] = useState<string>(graceSec.toString());
  const [configPoiStartMinInput, setConfigPoiStartMinInput] = useState<string>(Math.floor(poiStartSec / 60).toString());
  const [configPoiEndMinInput, setConfigPoiEndMinInput] = useState<string>(Math.floor(poiEndSec / 60).toString());

  // ── SYNTHESIZED WEB AUDIO BELLS (REALISTIC HARMONICS & GAVEL STRIKES) ──
  const playSound = useCallback((type: 'single_bell' | 'double_bell' | 'continuous' | 'gavel' | 'poi') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      if (type === 'single_bell') {
        // High brass debate desk bell (Harmonics: 1200Hz, 2400Hz, 3600Hz)
        [1200, 2400, 3600].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.3 / (idx + 1), ctx.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 2.1);
        });
      } else if (type === 'double_bell') {
        // Double Desk Bell with 250ms gap
        [0, 0.25].forEach((delay) => {
          [1200, 2400].forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
            gain.gain.setValueAtTime(0, ctx.currentTime + delay);
            gain.gain.linearRampToValueAtTime(0.35 / (idx + 1), ctx.currentTime + delay + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 1.8);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 1.9);
          });
        });
      } else if (type === 'gavel') {
        // Resonant wooden gavel rap (Low wood thump + crisp acoustic knock)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.8, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.28);
      } else if (type === 'poi') {
        // Crisp POI notification chime
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      } else if (type === 'continuous') {
        // Rapid 3-strike gavel/bell warning when overtime exceeds grace
        [0, 0.18, 0.36].forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1400, ctx.currentTime + delay);
          gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + delay);
          osc.stop(ctx.currentTime + delay + 0.3);
        });
      }
    } catch {
      // AudioContext blocked by browser policy
    }
  }, [soundEnabled]);

  // When format changes: reload preset speakers and default timings
  const handleFormatChange = (newFormat: DebateFormatId) => {
    const preset = DEBATE_FORMAT_PRESETS[newFormat];
    setFormatId(newFormat);
    setSpeakers(preset.speakers);
    setCurrentSpeakerIndex(0);

    const initialDur = preset.speakers[0]?.defaultDurationSec || preset.defaultSubstantiveSec;
    setSpeechDurationSec(initialDur);
    setRemainingSec(initialDur);
    setElapsedSec(0);
    setPoiStartSec(preset.defaultPoiStartSec);
    setPoiEndSec(preset.defaultPoiEndSec);
    setGraceSec(preset.defaultGraceSec);

    // Sync input states
    setConfigMinInput(Math.floor(initialDur / 60).toString());
    setConfigSecInput((initialDur % 60).toString());
    setConfigGraceInput(preset.defaultGraceSec.toString());
    setConfigPoiStartMinInput(Math.floor(preset.defaultPoiStartSec / 60).toString());
    setConfigPoiEndMinInput(Math.floor(preset.defaultPoiEndSec / 60).toString());

    setIsRunning(false);
  };

  // Switch Current Speaker Slot
  const handleSelectSpeaker = (index: number) => {
    if (index < 0 || index >= speakers.length) return;
    setCurrentSpeakerIndex(index);
    const targetSlot = speakers[index];
    const dur = targetSlot.defaultDurationSec || speechDurationSec;
    setRemainingSec(dur);
    setElapsedSec(0);
    setIsRunning(false);
  };

  // ── ACTIVE TICK LOOP ──
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedSec((prev) => prev + 1);

      setRemainingSec((prev) => {
        const next = prev - 1;

        // POI window open bell (e.g. at 1st min in 7-min speech: remaining = 6m)
        if (poiStartSec > 0 && speechDurationSec - prev === poiStartSec) {
          playSound('single_bell');
        }

        // POI window close / 1-minute warning bell (e.g. at 6th min: remaining = 1m)
        if (poiEndSec > 0 && speechDurationSec - prev === poiEndSec) {
          playSound('single_bell');
        }

        // Time up! (0 seconds remaining) -> Double Bell
        if (prev === 1 && next === 0) {
          playSound('double_bell');
        }

        // Grace period expired (overtime > graceSec) -> Continuous Bell / Gavel
        if (next < 0 && Math.abs(next) === graceSec) {
          playSound('continuous');
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, speechDurationSec, poiStartSec, poiEndSec, graceSec, playSound]);

  // Toggle Run / Pause
  const toggleRun = () => {
    if (!isRunning) {
      playSound('gavel');
    }
    setIsRunning(!isRunning);
  };

  // Reset Timer to Current Speaker's Allocated Duration
  const handleReset = () => {
    setIsRunning(false);
    const curSlot = speakers[currentSpeakerIndex];
    const dur = curSlot?.defaultDurationSec || speechDurationSec;
    setRemainingSec(dur);
    setElapsedSec(0);
  };

  // Quick In-Flight Adjustments (+30s, +1m, -30s)
  const adjustRemainingSeconds = (delta: number) => {
    setRemainingSec((prev) => prev + delta);
  };

  // Apply Changes from Configuration Drawer
  const handleApplyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = Math.max(0, parseInt(configMinInput || '0', 10));
    const secs = Math.max(0, Math.min(59, parseInt(configSecInput || '0', 10)));
    const totalSec = Math.max(10, mins * 60 + secs);

    const graceVal = Math.max(0, parseInt(configGraceInput || '0', 10));
    const poiStartMin = Math.max(0, parseInt(configPoiStartMinInput || '0', 10));
    const poiEndMin = Math.max(0, parseInt(configPoiEndMinInput || '0', 10));

    setSpeechDurationSec(totalSec);
    setGraceSec(graceVal);
    setPoiStartSec(poiStartMin * 60);
    setPoiEndSec(poiEndMin * 60);

    // Update active speaker duration
    setSpeakers((prev) => {
      const copy = [...prev];
      if (copy[currentSpeakerIndex]) {
        copy[currentSpeakerIndex] = {
          ...copy[currentSpeakerIndex],
          defaultDurationSec: totalSec,
        };
      }
      return copy;
    });

    setRemainingSec(totalSec);
    setElapsedSec(0);
    setIsRunning(false);
    setIsSettingsOpen(false);
    playSound('gavel');
  };

  // Update Speaker Name
  const handleUpdateSpeakerName = (index: number, name: string) => {
    setSpeakers((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index] = { ...copy[index], speakerName: name };
      }
      return copy;
    });
  };

  // Fullscreen Toggle for Projectors & Stage Screens
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // ── FORMAT TIME HELPER ──
  const formatTimerDigits = (secValue: number) => {
    const isNegative = secValue < 0;
    const absSec = Math.abs(secValue);
    const mins = Math.floor(absSec / 60);
    const secs = absSec % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return isNegative ? `-${formatted}` : formatted;
  };

  // ── POI STATUS PHASE COMPUTATION ──
  const currentSlot = speakers[currentSpeakerIndex] || speakers[0];
  const isOvertime = remainingSec < 0;
  const isGraceOvertime = isOvertime && Math.abs(remainingSec) <= graceSec;
  const isHardOvertime = isOvertime && Math.abs(remainingSec) > graceSec;

  // Has POI window opened and not closed?
  const isInPoiWindow =
    currentSlot?.poiAllowed &&
    elapsedSec >= poiStartSec &&
    elapsedSec < poiEndSec &&
    !isOvertime;

  const isProtectedStart =
    currentSlot?.poiAllowed &&
    elapsedSec < poiStartSec &&
    !isOvertime;

  const isProtectedEnd =
    currentSlot?.poiAllowed &&
    elapsedSec >= poiEndSec &&
    !isOvertime;

  // Status Badge Metadata
  let statusBadgeColor = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  let statusBadgeText = 'ACTIVE SPEECH';
  let statusIcon = <Clock className="w-4 h-4 text-cyan-400" />;

  if (isHardOvertime) {
    statusBadgeColor = 'bg-rose-600/30 text-rose-300 border-rose-500 animate-pulse';
    statusBadgeText = 'OVERTIME &bull; CEASE SPEAKING';
    statusIcon = <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />;
  } else if (isGraceOvertime) {
    statusBadgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/50';
    statusBadgeText = `GRACE PERIOD ACTIVE (${graceSec - Math.abs(remainingSec)}s LEFT)`;
    statusIcon = <Bell className="w-4 h-4 text-amber-400 animate-spin" />;
  } else if (isInPoiWindow) {
    statusBadgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
    statusBadgeText = 'POIs OPEN &bull; POINTS OF INFORMATION ACCEPTED';
    statusIcon = <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />;
  } else if (isProtectedStart) {
    statusBadgeColor = 'bg-neutral-800/80 text-neutral-300 border-white/10';
    statusBadgeText = 'PROTECTED TIME &bull; NO POIs ALLOWED (1ST MINUTE)';
    statusIcon = <Shield className="w-4 h-4 text-neutral-400" />;
  } else if (isProtectedEnd) {
    statusBadgeColor = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
    statusBadgeText = 'FINAL MINUTE WARNING &bull; POIs CLOSED';
    statusIcon = <Bell className="w-4 h-4 text-amber-400" />;
  }

  // Progress percentage
  const progressPercent = speechDurationSec > 0
    ? Math.max(0, Math.min(100, (elapsedSec / speechDurationSec) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-[#020307] text-white font-sans antialiased relative selection:bg-amber-500/30 selection:text-amber-200 flex flex-col justify-between overflow-x-hidden">
      {/* ── AMBIENT STAGE SPOTLIGHT ── */}
      <StageAmbientBackground theme="host" />

      {/* ── 1. TOP HEADER & FORMAT SELECTOR ── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <Link
            href="/host"
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 transition cursor-pointer flex items-center gap-2 text-xs font-mono font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ZEN.HOST</span>
          </Link>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10 overflow-x-auto max-w-full">
            <span className="px-2.5 py-1 text-[11px] font-mono text-amber-400 flex items-center gap-1 font-bold">
              <Gavel className="w-3.5 h-3.5" /> DEBATE MODE:
            </span>

            {(Object.keys(DEBATE_FORMAT_PRESETS) as DebateFormatId[]).map((fKey) => {
              const preset = DEBATE_FORMAT_PRESETS[fKey];
              const isSelected = formatId === fKey;
              return (
                <button
                  key={fKey}
                  type="button"
                  onClick={() => handleFormatChange(fKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-space whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 font-black'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {preset.name.split('(')[0].trim()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Stage Controls */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          <Link
            href="/host/timer"
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Stage Timer</span>
          </Link>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
              soundEnabled
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-white/5 border-white/10 text-neutral-500'
            }`}
            title={soundEnabled ? 'Mute Synthetic Bells' : 'Enable Synthetic Bells'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
            title="Configure Timings, POI Bells & Grace Periods"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>Configure Timer</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs transition cursor-pointer"
            title="Toggle Stage Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── 2. MAIN STAGE DEBATE ARENA ── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 flex flex-col justify-center space-y-8">
        {/* Motion / Resolution Banner */}
        <section className="text-center space-y-2 max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
            <Gavel className="w-3.5 h-3.5" />
            <span>{activePreset.name} &bull; PARLIAMENTARY CHAMBER</span>
          </div>

          {isEditingMotion ? (
            <div className="flex items-center gap-2 justify-center max-w-2xl mx-auto">
              <input
                type="text"
                value={motionInput}
                onChange={(e) => setMotionInput(e.target.value)}
                placeholder="Enter debate motion..."
                className="w-full bg-[#101322] border border-amber-500/50 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setMotion(motionInput.trim() || 'This House Believes Debate Shapes The World');
                  setIsEditingMotion(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs"
              >
                Save
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setMotionInput(motion);
                setIsEditingMotion(true);
              }}
              className="group cursor-pointer flex items-center justify-center gap-2"
              title="Click to edit motion"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black font-space text-white tracking-tight leading-snug group-hover:text-amber-300 transition">
                &ldquo;{motion}&rdquo;
              </h2>
              <Edit3 className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition opacity-0 group-hover:opacity-100" />
            </div>
          )}
        </section>

        {/* Current Speaker Cue & Team Side */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#0d1120] border border-white/10 shadow-lg">
            <span
              className={`w-3 h-3 rounded-full ${
                currentSlot.side === 'Gov' || currentSlot.side === 'OG' || currentSlot.side === 'CG' || currentSlot.side === 'Aff'
                  ? 'bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                  : currentSlot.side === 'Opp' || currentSlot.side === 'OO' || currentSlot.side === 'CO' || currentSlot.side === 'Neg'
                  ? 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                  : 'bg-amber-400'
              }`}
            />
            <span className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Side: <strong className="text-white">{currentSlot.side}</strong>
            </span>
            <span className="text-neutral-600">&bull;</span>
            <span className="text-sm font-bold text-white font-space">
              {currentSlot.title}
            </span>
            {currentSlot.speakerName && (
              <>
                <span className="text-neutral-600">&bull;</span>
                <span className="text-xs text-amber-300 font-mono">
                  ({currentSlot.speakerName})
                </span>
              </>
            )}
          </div>

          {/* Status Phase Pill */}
          <div className={`px-4 py-2 rounded-2xl border text-xs font-mono font-bold flex items-center gap-2 tracking-wide transition-all ${statusBadgeColor}`}>
            {statusIcon}
            <span dangerouslySetInnerHTML={{ __html: statusBadgeText }} />
          </div>
        </div>

        {/* ── GIANT HIGH-CONTRAST DIGITAL CHRONOMETER ── */}
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            {/* Theatrical backlight glow */}
            <div
              className={`absolute inset-0 blur-3xl opacity-20 transition-all duration-700 ${
                isHardOvertime
                  ? 'bg-rose-500'
                  : isGraceOvertime
                  ? 'bg-amber-500'
                  : isInPoiWindow
                  ? 'bg-emerald-500'
                  : 'bg-amber-400'
              }`}
            />

            {/* Huge Digits */}
            <div
              className={`relative z-10 text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-black font-space tracking-tight select-none tabular-nums transition-colors ${
                isHardOvertime
                  ? 'text-rose-400 drop-shadow-[0_0_40px_rgba(244,63,94,0.6)]'
                  : isGraceOvertime
                  ? 'text-amber-400 drop-shadow-[0_0_40px_rgba(245,158,11,0.5)]'
                  : isInPoiWindow
                  ? 'text-emerald-300 drop-shadow-[0_0_35px_rgba(16,185,129,0.4)]'
                  : 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]'
              }`}
            >
              {formatTimerDigits(remainingSec)}
            </div>
          </div>

          {/* Progress Track */}
          <div className="w-full max-w-xl bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5 relative">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isHardOvertime
                  ? 'bg-rose-500'
                  : isGraceOvertime
                  ? 'bg-amber-500'
                  : isInPoiWindow
                  ? 'bg-emerald-400'
                  : 'bg-gradient-to-r from-amber-500 to-orange-400'
              }`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
            {/* Markers for POI start and end */}
            {poiStartSec > 0 && speechDurationSec > 0 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_5px_#22d3ee]"
                style={{ left: `${(poiStartSec / speechDurationSec) * 100}%` }}
                title="POI Window Opens (Single Bell)"
              />
            )}
            {poiEndSec > 0 && speechDurationSec > 0 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_5px_#f59e0b]"
                style={{ left: `${(poiEndSec / speechDurationSec) * 100}%` }}
                title="POI Window Closes (1 Min Warning Bell)"
              />
            )}
          </div>

          {/* Elapsed vs Allocated Telemetry */}
          <div className="flex items-center gap-6 text-xs font-mono text-neutral-400">
            <div>
              Elapsed: <strong className="text-white">{formatTimerDigits(elapsedSec)}</strong>
            </div>
            <div>&bull;</div>
            <div>
              Allocated: <strong className="text-amber-400">{formatTimerDigits(speechDurationSec)}</strong>
            </div>
            <div>&bull;</div>
            <div>
              Grace Buffer: <strong className="text-neutral-300">+{graceSec}s</strong>
            </div>
          </div>
        </div>

        {/* ── 3. CHRONOMETER CONTROL DECK ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto w-full">
          {/* Previous Speaker */}
          <button
            type="button"
            onClick={() => handleSelectSpeaker(currentSpeakerIndex - 1)}
            disabled={currentSpeakerIndex === 0}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            title="Previous Speaker"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={toggleRun}
            className={`px-8 py-4 rounded-2xl font-black font-space text-sm uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer shadow-xl ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-400 text-black shadow-rose-500/25 active:scale-95'
                : 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 hover:brightness-110 text-black shadow-amber-500/30 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause Chronometer</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Speech</span>
              </>
            )}
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer active:scale-95"
            title="Reset to allocated speech time"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Next Speaker */}
          <button
            type="button"
            onClick={() => handleSelectSpeaker(currentSpeakerIndex + 1)}
            disabled={currentSpeakerIndex === speakers.length - 1}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            title="Next Speaker"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* ── 4. QUICK IN-FLIGHT ADJUSTMENTS & MANUAL BELL TRIGGERS ── */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Quick Time Bumps */}
          <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10 text-xs font-mono">
            <span className="px-2 text-neutral-500 font-bold">ADJUST:</span>
            <button
              type="button"
              onClick={() => adjustRemainingSeconds(30)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition"
            >
              +30s
            </button>
            <button
              type="button"
              onClick={() => adjustRemainingSeconds(60)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition"
            >
              +1m
            </button>
            <button
              type="button"
              onClick={() => adjustRemainingSeconds(-30)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition"
            >
              -30s
            </button>
            <button
              type="button"
              onClick={() => adjustRemainingSeconds(-15)}
              className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition"
            >
              -15s
            </button>
          </div>

          {/* Manual Bell & Gavel Sound Board for Adjudicator */}
          <div className="flex items-center gap-1.5 p-1 bg-amber-500/10 rounded-2xl border border-amber-500/30 text-xs font-mono">
            <span className="px-2 text-amber-400 font-bold flex items-center gap-1">
              <Gavel className="w-3 h-3" /> BELLS:
            </span>
            <button
              type="button"
              onClick={() => playSound('single_bell')}
              className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition cursor-pointer"
              title="Ring Single Bell (1 min mark / POI bell)"
            >
              🔔 1 Bell
            </button>
            <button
              type="button"
              onClick={() => playSound('double_bell')}
              className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition cursor-pointer"
              title="Ring Double Bell (Time Up)"
            >
              🔔🔔 2 Bells
            </button>
            <button
              type="button"
              onClick={() => playSound('gavel')}
              className="px-2.5 py-1 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 transition cursor-pointer"
              title="Gavel Strike Knock"
            >
              🔨 Gavel
            </button>
            <button
              type="button"
              onClick={() => playSound('poi')}
              className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition cursor-pointer"
              title="POI Ping Alert"
            >
              ⚡ POI Ping
            </button>
          </div>
        </div>

        {/* ── 5. SPEAKER ROSTER SEQUENCE SHEET ── */}
        <section className="bg-[#0a0d18] border border-white/10 rounded-3xl p-5 max-w-5xl mx-auto w-full shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold font-space text-white uppercase tracking-wider">
                Debate Speaker Roster &bull; {activePreset.name}
              </h3>
            </div>
            <div className="text-xs font-mono text-neutral-400">
              Active: <strong className="text-white">{currentSpeakerIndex + 1}</strong> of {speakers.length} Speakers
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {speakers.map((spk, idx) => {
              const isActive = idx === currentSpeakerIndex;
              const isPast = idx < currentSpeakerIndex;

              return (
                <div
                  key={spk.id}
                  onClick={() => handleSelectSpeaker(idx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md shadow-amber-500/15 ring-1 ring-amber-400/50'
                      : isPast
                      ? 'bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40 text-neutral-400">
                      #{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        spk.side === 'Gov' || spk.side === 'OG' || spk.side === 'CG' || spk.side === 'Aff'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : spk.side === 'Opp' || spk.side === 'OO' || spk.side === 'CO' || spk.side === 'Neg'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {spk.side}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white truncate font-space">
                      {spk.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      {formatTimerDigits(spk.defaultDurationSec)}
                    </div>
                  </div>

                  {/* Speaker Name Tag Input */}
                  <input
                    type="text"
                    value={spk.speakerName || ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleUpdateSpeakerName(idx, e.target.value)}
                    placeholder="Enter delegate name..."
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white placeholder-neutral-600 focus:outline-none focus:border-amber-400"
                  />
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── 6. FOOTER TELEMETRY ── */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-white/[0.08] text-[11px] font-mono text-neutral-500">
        <div>ZEN.HOST Stage Chronometer &bull; Pure Web Audio &bull; 100% Configurable In All Modes</div>
        <div className="flex items-center gap-3">
          <Link href="/host" className="hover:text-amber-400 transition">
            ZEN.HOST Dais OS
          </Link>
          <span>&bull;</span>
          <Link href="/committee" className="hover:text-amber-400 transition">
            ZEN.COMMITTEE
          </Link>
        </div>
      </footer>

      {/* ── 7. CONFIGURATION DRAWER / MODAL (APPLIES TO ALL MODES) ── */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0b0f1c] border border-amber-500/40 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold font-space text-white uppercase tracking-wider">
                  Configure Debate Timer
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleApplyConfig} className="space-y-4 text-xs font-mono">
              <div className="text-neutral-400 leading-relaxed font-sans text-xs">
                Configure timing milestones for <strong className="text-white">{activePreset.name}</strong>. All parameters apply directly to the active speaking slot.
              </div>

              {/* 1. Speech Duration (Minutes & Seconds) */}
              <div className="space-y-1.5">
                <label className="text-neutral-300 font-bold uppercase tracking-wider text-[11px]">
                  Allocated Speech Duration
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-1">Minutes:</span>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      value={configMinInput}
                      onChange={(e) => setConfigMinInput(e.target.value)}
                      className="w-full bg-[#101322] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-1">Seconds:</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={configSecInput}
                      onChange={(e) => setConfigSecInput(e.target.value)}
                      className="w-full bg-[#101322] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. POI Milestones (Start & End Minutes) */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <label className="text-neutral-300 font-bold uppercase tracking-wider text-[11px]">
                  Points of Information (POI) Bells
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-1">POI Window Opens At (Min):</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={configPoiStartMinInput}
                      onChange={(e) => setConfigPoiStartMinInput(e.target.value)}
                      className="w-full bg-[#101322] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block mb-1">POI Closes / Warning (Min):</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={configPoiEndMinInput}
                      onChange={(e) => setConfigPoiEndMinInput(e.target.value)}
                      className="w-full bg-[#101322] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Grace Period Buffer (Seconds) */}
              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <label className="text-neutral-300 font-bold uppercase tracking-wider text-[11px]">
                  Grace Period Buffer Before Continuous Bell (Seconds)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={configGraceInput}
                  onChange={(e) => setConfigGraceInput(e.target.value)}
                  className="w-full bg-[#101322] border border-white/10 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-neutral-500">
                  Default 20s in Asian Parliamentary, 15s in BP. Double bell rings at 0s; continuous overtime gavel rings once grace period expires.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black uppercase font-space transition shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  Apply Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DebateTimerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#020307] text-white flex items-center justify-center font-mono text-xs">
          Loading Debate Competition Timer...
        </div>
      }
    >
      <DebateTimerInner />
    </Suspense>
  );
}

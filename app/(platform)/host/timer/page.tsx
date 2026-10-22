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
  Coffee,
  Sparkles,
  ArrowLeft,
  Plus,
  Minus,
  Settings,
  Bell,
  CheckCircle2,
  Flame,
  Zap,
  Timer,
  ChevronRight,
} from 'lucide-react';
import StageAmbientBackground from '@/components/host/StageAmbientBackground';

type TimerMode = 'pomodoro' | 'countdown' | 'stopwatch';
type PomodoroPhase = 'work' | 'short_break' | 'long_break';

function PomodoroTimerInner() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams?.get('mode') as TimerMode) || 'pomodoro';

  const [mode, setMode] = useState<TimerMode>(initialMode);

  // ── POMODORO STATE ──
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work');
  const [workDuration, setWorkDuration] = useState(25 * 60); // 25 min in seconds
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60); // 5 min
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60); // 15 min
  const [pomodoroCycle, setPomodoroCycle] = useState(1);
  const [totalCompletedCycles, setTotalCompletedCycles] = useState(0);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [taskNote, setTaskNote] = useState('');

  // ── COUNTDOWN STATE ──
  const [countdownDuration, setCountdownDuration] = useState(5 * 60); // 5 min default
  const [customMinutesInput, setCustomMinutesInput] = useState('5');

  // ── STOPWATCH STATE ──
  const [stopwatchElapsedSeconds, setStopwatchElapsedSeconds] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  // ── ACTIVE CLOCK RUNTIME ──
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synthesized Web Audio Chimes
  const playChime = useCallback((type: 'start' | 'complete' | 'warning') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();

      if (type === 'complete') {
        // Soft meditative singing bowl harmonic
        const freqs = [528, 660, 792];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.25 / (i + 1), ctx.currentTime + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + i * 0.1);
          osc.stop(ctx.currentTime + 3.0);
        });
      } else if (type === 'start') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'warning') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.65);
      }
    } catch {
      // Audio not permitted or supported
    }
  }, [soundEnabled]);

  // Sync mode changes to appropriate clock initial state
  useEffect(() => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'work') setRemainingSeconds(workDuration);
      else if (pomodoroPhase === 'short_break') setRemainingSeconds(shortBreakDuration);
      else setRemainingSeconds(longBreakDuration);
    } else if (mode === 'countdown') {
      setRemainingSeconds(countdownDuration);
    } else if (mode === 'stopwatch') {
      setStopwatchElapsedSeconds(0);
    }
  }, [mode, pomodoroPhase, workDuration, shortBreakDuration, longBreakDuration, countdownDuration]);

  // Active Timer Tick Loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (mode === 'stopwatch') {
        setStopwatchElapsedSeconds((prev) => prev + 1);
      } else {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Timer expired!
            playChime('complete');
            if (mode === 'pomodoro') {
              // Advance pomodoro cycle
              if (pomodoroPhase === 'work') {
                const nextCycle = pomodoroCycle + 1;
                setTotalCompletedCycles((c) => c + 1);
                if (pomodoroCycle >= 4) {
                  setPomodoroPhase('long_break');
                  setPomodoroCycle(1);
                  return longBreakDuration;
                } else {
                  setPomodoroPhase('short_break');
                  setPomodoroCycle(nextCycle);
                  return shortBreakDuration;
                }
              } else {
                setPomodoroPhase('work');
                return workDuration;
              }
            }
            setIsRunning(false);
            return 0;
          }
          if (prev === 11) {
            playChime('warning');
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    mode,
    pomodoroPhase,
    pomodoroCycle,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    playChime,
  ]);

  const toggleRun = () => {
    if (!isRunning) {
      playChime('start');
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'work') setRemainingSeconds(workDuration);
      else if (pomodoroPhase === 'short_break') setRemainingSeconds(shortBreakDuration);
      else setRemainingSeconds(longBreakDuration);
    } else if (mode === 'countdown') {
      setRemainingSeconds(countdownDuration);
    } else if (mode === 'stopwatch') {
      setStopwatchElapsedSeconds(0);
      setLaps([]);
    }
  };

  const addSeconds = (secs: number) => {
    if (mode === 'stopwatch') return;
    setRemainingSeconds((prev) => Math.max(10, prev + secs));
  };

  const setCustomMinutes = (mins: number) => {
    const secs = mins * 60;
    setCountdownDuration(secs);
    setRemainingSeconds(secs);
    setIsRunning(false);
  };

  const handleRecordLap = () => {
    if (mode === 'stopwatch') {
      setLaps((prev) => [stopwatchElapsedSeconds, ...prev]);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Format Helper: MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format Hours:MM:SS for longer sessions
  const formatStopwatch = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeDisplayTime =
    mode === 'stopwatch'
      ? formatStopwatch(stopwatchElapsedSeconds)
      : formatTime(remainingSeconds);

  // Compute progress percentage
  const totalPhaseDuration =
    mode === 'pomodoro'
      ? pomodoroPhase === 'work'
        ? workDuration
        : pomodoroPhase === 'short_break'
        ? shortBreakDuration
        : longBreakDuration
      : countdownDuration;

  const progressPercent =
    mode === 'stopwatch'
      ? 100
      : totalPhaseDuration > 0
      ? Math.max(0, Math.min(100, ((totalPhaseDuration - remainingSeconds) / totalPhaseDuration) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-[#03050a] text-white font-sans antialiased relative selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col justify-between overflow-x-hidden">
      {/* ── THEATRICAL STAGE AMBIENCE ── */}
      <StageAmbientBackground theme="host" />

      {/* ── 1. TOP NAVBAR & CONTROLS ── */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between border-b border-white/[0.08]">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/host"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 transition cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ZEN.HOST</span>
          </Link>

          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setMode('pomodoro')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-space transition flex items-center gap-1.5 cursor-pointer ${
                mode === 'pomodoro'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>🍅</span>
              <span>Pomodoro</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('countdown')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-space transition flex items-center gap-1.5 cursor-pointer ${
                mode === 'countdown'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Normal Timer</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('stopwatch')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-space transition flex items-center gap-1.5 cursor-pointer ${
                mode === 'stopwatch'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>Stopwatch</span>
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              soundEnabled
                ? 'bg-white/[0.05] border-white/15 text-cyan-300'
                : 'bg-white/[0.02] border-white/5 text-neutral-500'
            }`}
            title={soundEnabled ? 'Sound alerts enabled' : 'Muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 transition cursor-pointer"
            title="Configure Durations"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/10 transition cursor-pointer"
            title="Fullscreen Stage Display"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── 2. MAIN ACTIVE CLOCK CANVAS ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full my-auto space-y-8">
        {/* Phase Pill (for Pomodoro) */}
        {mode === 'pomodoro' && (
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md animate-fade-in shadow-lg">
            <button
              type="button"
              onClick={() => {
                setPomodoroPhase('work');
                setRemainingSeconds(workDuration);
                setIsRunning(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-space transition cursor-pointer flex items-center gap-1.5 ${
                pomodoroPhase === 'work'
                  ? 'bg-rose-500 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>🎯 Focus</span>
              <span className="text-[10px] font-mono">25m</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPomodoroPhase('short_break');
                setRemainingSeconds(shortBreakDuration);
                setIsRunning(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-space transition cursor-pointer flex items-center gap-1.5 ${
                pomodoroPhase === 'short_break'
                  ? 'bg-teal-400 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>☕ Short Break</span>
              <span className="text-[10px] font-mono">5m</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPomodoroPhase('long_break');
                setRemainingSeconds(longBreakDuration);
                setIsRunning(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold font-space transition cursor-pointer flex items-center gap-1.5 ${
                pomodoroPhase === 'long_break'
                  ? 'bg-indigo-400 text-black shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>🌴 Long Break</span>
              <span className="text-[10px] font-mono">15m</span>
            </button>
          </div>
        )}

        {/* Task Title Focus Input (Optional) */}
        {mode === 'pomodoro' && (
          <div className="w-full max-w-md">
            <input
              type="text"
              value={taskNote}
              onChange={(e) => setTaskNote(e.target.value)}
              placeholder="What are you working on right now?"
              className="w-full text-center px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-rose-400/50 transition font-outfit"
            />
          </div>
        )}

        {/* Giant Stage Chronometer Display */}
        <div className="relative flex flex-col items-center justify-center p-6 sm:p-12 rounded-[40px] bg-gradient-to-b from-black/80 to-[#060a14]/90 border border-white/[0.12] shadow-[0_25px_80px_rgba(0,0,0,0.8)] backdrop-blur-2xl w-full max-w-2xl">
          {/* Subtle Progress Bar */}
          {mode !== 'stopwatch' && (
            <div className="absolute top-0 left-8 right-8 h-1 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  mode === 'pomodoro'
                    ? pomodoroPhase === 'work'
                      ? 'bg-rose-500'
                      : 'bg-teal-400'
                    : 'bg-cyan-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}

          {/* Large Digital Clock Digits */}
          <div
            className={`font-mono font-black tracking-tight text-center select-none text-7xl sm:text-9xl my-4 tabular-nums transition-colors duration-300 ${
              mode === 'pomodoro'
                ? pomodoroPhase === 'work'
                  ? 'text-white'
                  : 'text-teal-300'
                : mode === 'countdown' && remainingSeconds <= 10
                ? 'text-amber-400 animate-pulse'
                : 'text-white'
            }`}
          >
            {activeDisplayTime}
          </div>

          {/* Pomodoro Cycles Dots */}
          {mode === 'pomodoro' && (
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all ${
                    step < pomodoroCycle
                      ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                      : step === pomodoroCycle
                      ? 'bg-rose-400/80 animate-ping'
                      : 'bg-white/15'
                  }`}
                  title={`Interval ${step} of 4`}
                />
              ))}
              <span className="text-xs font-mono text-neutral-400 ml-2">
                Round {pomodoroCycle} of 4 &bull; Total Cycles: {totalCompletedCycles}
              </span>
            </div>
          )}

          {/* Primary Stage Action Buttons */}
          <div className="flex items-center gap-4 flex-wrap justify-center pt-2">
            <button
              type="button"
              onClick={toggleRun}
              className={`px-8 sm:px-12 py-4 rounded-2xl font-black font-space text-sm sm:text-base uppercase tracking-wider transition shadow-xl cursor-pointer active:scale-95 flex items-center gap-3 ${
                isRunning
                  ? 'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20'
                  : mode === 'pomodoro'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-black hover:brightness-110 shadow-rose-500/25'
                  : 'bg-gradient-to-r from-cyan-500 to-teal-400 text-black hover:brightness-110 shadow-cyan-500/25'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer active:scale-95"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {mode === 'stopwatch' && (
              <button
                type="button"
                onClick={handleRecordLap}
                disabled={!isRunning}
                className="px-5 py-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 hover:text-white font-mono text-xs font-bold uppercase transition cursor-pointer active:scale-95 disabled:opacity-30"
              >
                Record Lap
              </button>
            )}
          </div>

          {/* Quick Increments (+1m, +5m, -1m) for Normal Countdown */}
          {mode === 'countdown' && (
            <div className="flex items-center gap-2 pt-6">
              <button
                type="button"
                onClick={() => addSeconds(-60)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-neutral-400 hover:text-white border border-white/10 transition cursor-pointer"
              >
                -1m
              </button>
              <button
                type="button"
                onClick={() => addSeconds(60)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-neutral-400 hover:text-white border border-white/10 transition cursor-pointer"
              >
                +1m
              </button>
              <button
                type="button"
                onClick={() => addSeconds(300)}
                className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-neutral-400 hover:text-white border border-white/10 transition cursor-pointer"
              >
                +5m
              </button>
            </div>
          )}
        </div>

        {/* ── 3. PRESET PICKERS & LAP LEDGER ── */}
        {mode === 'countdown' && (
          <div className="space-y-3 w-full max-w-xl text-center">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
              Quick Timer Presets
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[1, 2, 3, 5, 10, 15, 20, 30, 45, 60].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setCustomMinutes(mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                    countdownDuration === mins * 60
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 border border-white/10'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stopwatch Laps Table */}
        {mode === 'stopwatch' && laps.length > 0 && (
          <div className="w-full max-w-md rounded-2xl bg-black/50 border border-white/10 p-4 space-y-2 max-h-48 overflow-y-auto">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase border-b border-white/10 pb-1">
              <span>Lap #</span>
              <span>Split Time</span>
            </div>
            {laps.map((lapSec, i) => (
              <div
                key={lapSec + i}
                className="flex items-center justify-between text-xs font-mono text-neutral-200 py-0.5"
              >
                <span>Lap {laps.length - i}</span>
                <span className="font-bold text-emerald-400">{formatStopwatch(lapSec)}</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── 4. CONFIGURE DURATIONS MODAL ── */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#090d16] border border-white/15 p-6 space-y-5 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  TIMER CONFIGURATION
                </div>
                <h3 className="text-base font-black font-space">Customize Interval Times</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 text-lg cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Focus Work Time (Minutes)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={workDuration / 60}
                  onChange={(e) => {
                    const m = parseInt(e.target.value, 10) || 25;
                    setWorkDuration(m * 60);
                    if (pomodoroPhase === 'work') setRemainingSeconds(m * 60);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Short Break (Min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={shortBreakDuration / 60}
                    onChange={(e) => {
                      const m = parseInt(e.target.value, 10) || 5;
                      setShortBreakDuration(m * 60);
                      if (pomodoroPhase === 'short_break') setRemainingSeconds(m * 60);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Long Break (Min)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={longBreakDuration / 60}
                    onChange={(e) => {
                      const m = parseInt(e.target.value, 10) || 15;
                      setLongBreakDuration(m * 60);
                      if (pomodoroPhase === 'long_break') setRemainingSeconds(m * 60);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 text-black font-black font-space text-xs uppercase tracking-wider cursor-pointer shadow-md"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. FOOTER ── */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 border-t border-white/[0.06]">
        <div>ZEN.HOST Stage Timer &bull; No accounts required. Saves progress in session.</div>
        <div className="flex items-center gap-4">
          <Link href="/host" className="hover:text-neutral-300 font-mono">
            Host Dashboard
          </Link>
          <Link href="/committee" className="hover:text-amber-400 font-mono">
            ZEN.COMMITTEE
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default function PomodoroTimerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#03050a] text-white flex items-center justify-center font-mono text-xs">Loading Timer Stage...</div>}>
      <PomodoroTimerInner />
    </Suspense>
  );
}

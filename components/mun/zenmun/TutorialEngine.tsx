'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  X,
  Sparkles,
  Shield,
  Command,
  Keyboard,
  Clock,
  Mic,
  Gavel,
  BookOpen,
} from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';
import { TUTORIAL_STEPS_CONTENT, TutorialStepDef } from '@/types/zenMun';

interface TargetRect {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TutorialEngine() {
  const { session, setSession, nextTutorialStep, prevTutorialStep, endTutorial } = useZenMun();
  const { isActive, currentStep, welcomeModalOpen } = session.tutorial;

  const [targetRects, setTargetRects] = useState<TargetRect[]>([]);
  const [activeTab, setActiveTab] = useState<'tour' | 'hotkeys'>('tour');

  const currentStepData: TutorialStepDef =
    TUTORIAL_STEPS_CONTENT[currentStep - 1] || TUTORIAL_STEPS_CONTENT[0];
  const isFinal = currentStep === TUTORIAL_STEPS_CONTENT.length;

  // Track target bounding rects dynamically
  useEffect(() => {
    if (!isActive) {
      setTargetRects([]);
      return;
    }

    const updateRects = () => {
      const rects: TargetRect[] = [];
      if (currentStepData && currentStepData.targets) {
        currentStepData.targets.forEach((targetId) => {
          const el = document.getElementById(targetId);
          if (el) {
            const b = el.getBoundingClientRect();
            if (b.width > 0 && b.height > 0) {
              rects.push({
                id: targetId,
                top: b.top,
                left: b.left,
                width: b.width,
                height: b.height,
              });
            }
          }
        });
      }
      setTargetRects(rects);
    };

    updateRects();
    window.addEventListener('resize', updateRects);
    window.addEventListener('scroll', updateRects, true);
    const interval = setInterval(updateRects, 300);

    return () => {
      window.removeEventListener('resize', updateRects);
      window.removeEventListener('scroll', updateRects, true);
      clearInterval(interval);
    };
  }, [isActive, currentStep, currentStepData]);

  // Keyboard navigation during tour
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (isFinal) endTutorial();
        else nextTutorialStep();
      } else if (e.key === 'ArrowLeft' && currentStep > 1) {
        prevTutorialStep();
      } else if (e.key === 'Escape') {
        endTutorial();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, currentStep, isFinal, nextTutorialStep, prevTutorialStep, endTutorial]);

  // Highlight bold/keywords
  const renderFormattedSpeech = (text: string, highlightWords?: string[]) => {
    if (!highlightWords || highlightWords.length === 0) return text;
    const escaped = highlightWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => {
      const isMatch = highlightWords.some((w) => w.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <span key={i} className="text-cyan-300 font-extrabold underline decoration-cyan-400/40 underline-offset-2">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // ─────────────────────────────────────────────────────────────
  // 1. WELCOME & PROTOCOL COMMAND MODAL (Sovereign Diplomatic Nexus)
  // ─────────────────────────────────────────────────────────────
  if (welcomeModalOpen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
        <div className="w-full max-w-lg bg-[#080d1a] rounded-3xl border border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.95)] p-7 space-y-6 text-white relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => {
              setSession((prev) => ({
                ...prev,
                sessionState: 'in-session',
                tutorial: { ...prev.tutorial, welcomeModalOpen: false, isActive: false, isCompleted: true },
              }));
            }}
            className="absolute top-4 right-4 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer z-10"
            title="Close Protocol Modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Sovereign Emblem & Title */}
          <div className="text-center space-y-3 relative z-10">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-cyan-500/20 via-white/5 to-amber-500/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_35px_rgba(6,182,212,0.25)] relative group">
              <Shield className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400/20 border border-amber-400/60 flex items-center justify-center">
                <Gavel className="w-3 h-3 text-amber-300" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono font-black uppercase tracking-widest text-cyan-300 mb-2">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>ZENVITRA DAIS NEXUS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                COMMITTEE COMMAND SUITE
              </h2>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed mt-1">
                The high-performance diplomatic operating system for Model UN, summit presidiums, and parliamentary debate.
              </p>
            </div>
          </div>

          {/* Mode Tabs: Interactive Tour vs Keyboard Shortcuts */}
          <div className="flex rounded-xl bg-black/50 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('tour')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'tour'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Interactive Protocol Tour</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hotkeys')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'hotkeys'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Hotkeys &amp; Rules</span>
            </button>
          </div>

          {/* Content Pane */}
          {activeTab === 'tour' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Dual Caucus Clocks</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Track total moderated caucus time and individual speaking slots simultaneously.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live Yields &amp; RTR</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-normal">
                    Yield to Chair, questions, or delegations with a separate Right of Reply buffer.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSession((prev) => ({
                      ...prev,
                      sessionState: 'in-session',
                      tutorial: { ...prev.tutorial, welcomeModalOpen: false, isActive: true, currentStep: 1 },
                    }));
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/25 cursor-pointer active:scale-95 flex items-center gap-1.5"
                >
                  <span>LAUNCH PROTOCOL TOUR</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSession((prev) => ({
                      ...prev,
                      sessionState: 'in-session',
                      tutorial: { ...prev.tutorial, welcomeModalOpen: false, isActive: false, isCompleted: true },
                    }));
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer active:scale-95 border border-white/10"
                >
                  ENTER LIVE DAIS
                </button>
              </div>
            </div>
          ) : (
            /* Hotkeys & Protocol Cheatsheet */
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-neutral-300 font-medium">Start / Pause Timer</span>
                  <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-[11px] text-cyan-300">Space</kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-neutral-300 font-medium">Next Speaker in Queue</span>
                  <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-[11px] text-cyan-300">N</kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-neutral-300 font-medium">Reset Clock to Full Time</span>
                  <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-[11px] text-cyan-300">R</kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-neutral-300 font-medium">Raise Motion / Caucus</span>
                  <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-[11px] text-cyan-300">M</kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-neutral-300 font-medium">Roll Call &amp; Attendance</span>
                  <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-[11px] text-cyan-300">C</kbd>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <span className="text-neutral-300 font-medium">Yield Active Speaker Floor</span>
                  <kbd className="px-2 py-0.5 rounded bg-black/60 border border-white/20 font-mono text-[11px] text-cyan-300">Y</kbd>
                </div>
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setSession((prev) => ({
                      ...prev,
                      sessionState: 'in-session',
                      tutorial: { ...prev.tutorial, welcomeModalOpen: false, isActive: false, isCompleted: true },
                    }));
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs uppercase tracking-wider transition cursor-pointer active:scale-98 shadow-md shadow-emerald-500/20"
                >
                  START SESSION
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If tour is not actively triggered, render nothing
  if (!isActive) return null;

  // ─────────────────────────────────────────────────────────────
  // 2. ACTIVE INTERACTIVE TOUR HUD (Cyber-Sovereign Target Spotlight)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] select-none">
      {/* Dynamic Keyframes */}
      <style>{`
        @keyframes sovereignHaloPulse {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.9), 0 0 25px rgba(6, 182, 212, 0.45);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.95), 0 0 40px rgba(251, 191, 36, 0.6);
          }
        }
        .animate-sovereign-halo {
          animation: sovereignHaloPulse 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Full-screen Darkened Backdrop SVG with transparent holes cut out for targets */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[80]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="zen-spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRects.map((t) => (
              <rect
                key={`cutout-${t.id}`}
                x={t.left - 6}
                y={t.top - 6}
                width={t.width + 12}
                height={t.height + 12}
                rx="14"
                fill="black"
              />
            ))}
          </mask>
        </defs>

        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(3, 4, 7, 0.65)"
          mask="url(#zen-spotlight-mask)"
        />
      </svg>

      {/* Flashing Laser Rings around target elements */}
      {targetRects.map((t) => (
        <div
          key={`flash-ring-${t.id}`}
          style={{
            top: t.top - 6,
            left: t.left - 6,
            width: t.width + 12,
            height: t.height + 12,
          }}
          className="fixed pointer-events-none z-[85] rounded-2xl animate-sovereign-halo"
        >
          <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-400 shadow-[0_0_10px_#06b6d4]" />
          </span>
        </div>
      ))}

      {/* Top Floating Step Controller */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto z-[90]">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#080d1a]/95 backdrop-blur-md shadow-2xl border border-white/15 text-xs font-bold text-white">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={prevTutorialStep}
            className={`flex items-center gap-1 cursor-pointer transition ${
              currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-cyan-300'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <span className="font-mono text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px]">
            STEP {currentStep} / {TUTORIAL_STEPS_CONTENT.length}
          </span>

          <button
            type="button"
            onClick={isFinal ? endTutorial : nextTutorialStep}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer font-black"
          >
            <span>{isFinal ? 'Finish Guide' : 'Next'}</span>
            {!isFinal && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Top-Right Dismiss Button */}
      <div className="absolute top-4 right-6 pointer-events-auto z-[90]">
        <button
          type="button"
          onClick={endTutorial}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition shadow-md border border-white/15 flex items-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Guide</span>
        </button>
      </div>

      {/* Sovereign Floating Command HUD Card (Bottom Right) */}
      <div className="absolute bottom-6 right-6 max-w-sm w-full pointer-events-auto z-[90] animate-fade-in">
        <div className="p-5 rounded-3xl bg-[#080d1a]/95 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] space-y-3.5 text-white relative overflow-hidden">
          {/* Subtle ambient corner gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <Command className="w-3 h-3 text-cyan-300" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-cyan-300 truncate max-w-[200px]">
                {currentStepData.title}
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {currentStep}/{TUTORIAL_STEPS_CONTENT.length}
            </span>
          </div>

          {/* Formatted Guide Copy */}
          <p className="text-xs text-neutral-300 leading-relaxed font-medium">
            {renderFormattedSpeech(currentStepData.text, currentStepData.highlightWords)}
          </p>

          {/* Bottom Card Controls */}
          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="text-[10px] text-neutral-400 font-mono">
              Press <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/15 text-white">Enter</kbd> to advance
            </span>
            <button
              type="button"
              onClick={isFinal ? endTutorial : nextTutorialStep}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase text-[10px] tracking-wider transition cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>{isFinal ? 'Done' : 'Next Step'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialEngine;

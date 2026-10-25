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
  // Lock body scroll when welcome modal or interactive tour is active
  useEffect(() => {
    if (welcomeModalOpen || isActive) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [welcomeModalOpen, isActive]);


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
  // 1. WELCOME & PROTOCOL COMMAND MODAL (Zenvitra Mascot Welcome)
  // ─────────────────────────────────────────────────────────────
  if (welcomeModalOpen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#14261b]/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
        <div className="w-full max-w-2xl bg-[#0E131F] rounded-[32px] border border-white/10 text-white shadow-[0_20px_70px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-[#1f2937] relative overflow-visible">
          {/* Zeno the Sovereign Envoy Mascot perched on top */}
          <div className="absolute -top-16 left-8 sm:left-12 pointer-events-none z-20">
            <img
              src="/assets/zeno-welcome.png"
              alt="Zeno the Sovereign Envoy"
              className="w-28 h-28 object-contain drop-shadow-xl"
            />
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => {
              try {
                localStorage.setItem('zenvitra_has_seen_dais_tutorial_v1', 'true');
              } catch {}
              setSession((prev) => ({
                ...prev,
                sessionState: 'in-session',
                tutorial: { ...prev.tutorial, welcomeModalOpen: false, isActive: false, isCompleted: true },
              }));
            }}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#9ca3af] hover:text-[#1f2937] hover:bg-black/5 transition cursor-pointer z-10"
            title="Skip tutorial"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 2-Column Welcome Suite matching Zenvitra Dais Standard */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-7 sm:gap-8 items-center pt-2">
            {/* Left Column: Greeting & Actions */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C5A46D]/15 text-[#C5A46D] text-[10px] font-mono font-bold tracking-wider uppercase">
                <Gavel className="w-3 h-3" />
                <span>Zenvitra Dais Protocol</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#1f2421] tracking-tight leading-tight">
                Have you used Zenvitra Dais before?
              </h2>

              <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed font-normal">
                Zeno has a short interactive tour ready. He lights up each quarter of the chamber, letting you test gavel controls, speaker queues, and motions as you go. Prefer to watch first? The dais guide runs a full committee session, from roll call to the final vote.
              </p>

              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSession((prev) => ({
                      ...prev,
                      sessionState: 'in-session',
                      tutorial: { ...prev.tutorial, welcomeModalOpen: false, isActive: true, currentStep: 1 },
                    }));
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#C5A46D] via-[#DFBA73] to-[#C5A46D] text-[#08090C] font-black text-sm tracking-tight transition shadow-lg shadow-[#C5A46D]/25 cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                >
                  <span>Show me around</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.setItem('zenvitra_has_seen_dais_tutorial_v1', 'true');
                    } catch {}
                    setSession((prev) => ({
                      ...prev,
                      sessionState: 'in-session',
                      tutorial: { ...prev.tutorial, welcomeModalOpen: false, isActive: false, isCompleted: true },
                    }));
                  }}
                  className="w-full py-2.5 px-6 rounded-2xl bg-[#141A29] hover:bg-[#1C2438] text-slate-300 font-bold text-xs tracking-tight transition cursor-pointer active:scale-98 text-center border border-white/10"
                >
                  Skip tutorial
                </button>
              </div>
            </div>

            {/* Right Column: Chair Video Guide Card */}
            <div className="md:col-span-5 bg-[#141A29] border border-white/10 rounded-2xl p-3 shadow-2xs space-y-2">
              <div className="space-y-0.5 px-1">
                <div className="text-[10px] font-mono font-bold text-[#8c7860] uppercase tracking-wider flex items-center gap-1">
                  <span>🏛️</span>
                  <span>Zenvitra Dais Guide</span>
                </div>
                <div className="text-xs font-bold text-[#1f2937]">
                  Your First Committee, Start to Finish
                </div>
              </div>

              {/* Video Preview Thumbnail */}
              <div className="relative rounded-xl overflow-hidden aspect-video bg-black/10 border border-white/10 group cursor-pointer shadow-inner">
                <img
                  src="/assets/chair_guide_video_thumb.png"
                  alt="Zenvitra Dais Guide Video Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C5A46D] to-[#9E7D47] text-[#08090C] font-black border-2 border-[#E6D1A5] flex items-center justify-center shadow-[0_0_20px_rgba(197,164,109,0.4)] group-hover:scale-110 transition">
                    <div className="w-0 h-0 border-y-6 border-y-transparent border-l-10 border-l-white ml-1" />
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-[#78716c] px-1 font-medium leading-tight">
                Watch how a dais operates on Zenvitra from roll-call quorum to division bell voting in under 3 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If tour is not actively triggered, render nothing
  if (!isActive) return null;

  // ─────────────────────────────────────────────────────────────
  // 2. ACTIVE INTERACTIVE TOUR HUD (Zenvitra Spotlight Tour)
  // ─────────────────────────────────────────────────────────────
  // Parse bullet points for current step
  const getBulletPoints = () => {
    if (currentStep === 2) {
      return [
        'Speakers, timers, motions, voting, chat and documents, all on one screen.',
        'Built to run the whole session, from the first gavel to the last.',
        'Click anywhere or press Next to keep going.',
      ];
    }
    if (currentStep === 4) {
      return [
        'Type a country in the bar below and press Enter.',
        'Or click a delegation in the sidebar.',
        'The tour moves on once 3 are on the list.',
      ];
    }
    // General sentence splitter into bullets
    const sentences = currentStepData.text
      .split(/(?<=[.?!])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return sentences.length > 0 ? sentences : [currentStepData.text];
  };

  const bullets = getBulletPoints();

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] select-none">
      {/* Dynamic Keyframes for Spotlight Halo */}
      <style>{`
        @keyframes zenSpotlightHalo {
          0%, 100% {
            box-shadow: 0 0 0 2px rgba(27, 61, 41, 0.9), 0 0 20px rgba(212, 175, 55, 0.5);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.95), 0 0 30px rgba(212, 175, 55, 0.8);
          }
        }
        .animate-zen-halo {
          animation: zenSpotlightHalo 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* Full-screen Darkened Forest Green Backdrop SVG with transparent holes cut out for targets */}
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
          fill="rgba(19, 38, 27, 0.72)"
          mask="url(#zen-spotlight-mask)"
        />
      </svg>

      {/* Flashing Gold/Forest Rings around target elements */}
      {targetRects.map((t) => (
        <div
          key={`flash-ring-${t.id}`}
          style={{
            top: t.top - 6,
            left: t.left - 6,
            width: t.width + 12,
            height: t.height + 12,
          }}
          className="fixed pointer-events-none z-[85] rounded-2xl animate-zen-halo"
        />
      ))}

      {/* Floating Zenvitra Step Card with Zeno Mascot */}
      <div className="fixed top-24 right-8 sm:right-16 max-w-md w-full pointer-events-auto z-[95] animate-in fade-in slide-in-from-top-4">
        <div className="bg-[#0E131F] rounded-[26px] border border-white/10 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-6 space-y-4 text-[#1f2937] relative overflow-visible">
          {/* Zeno Pointer Mascot perched on top of card */}
          <div className="absolute -top-14 left-8 pointer-events-none z-20">
            <img
              src="/assets/zeno.png"
              alt="Zeno Dais Guide"
              className="w-20 h-20 object-contain drop-shadow-md"
            />
          </div>

          {/* Top Bar: Step Counter & End Tutorial */}
          <div className="flex items-center justify-between border-b border-[#f0ece1] pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-extrabold text-[#C5A46D] tracking-wider uppercase bg-[#C5A46D]/15 px-2 py-0.5 rounded-md">
                ZENVITRA DAIS
              </span>
              <span className="text-xs font-mono font-bold text-[#8c7860]">
                {currentStep}/{TUTORIAL_STEPS_CONTENT.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem('zenvitra_has_seen_dais_tutorial_v1', 'true');
                } catch {}
                endTutorial();
              }}
              className="text-xs font-bold text-[#8c7860] hover:text-[#1f2421] transition cursor-pointer"
            >
              End tutorial
            </button>
          </div>

          {/* Title */}
          <h3 className="text-xl font-black font-serif text-[#1f2421] tracking-tight">
            {currentStepData.title}
          </h3>

          {/* Bullet List */}
          <ul className="space-y-2.5 text-xs text-[#57534e] leading-relaxed font-normal">
            {bullets.map((b, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-500 font-bold shrink-0 mt-0.5">&bull;</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          {/* Bottom Card Controls */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f0ece1]">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={prevTutorialStep}
              className={`px-4 py-2 rounded-xl bg-[#141A29] text-slate-300 border border-white/10 font-bold text-xs transition ${
                currentStep === 1 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#1C2438] cursor-pointer'
              }`}
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => {
                if (isFinal) {
                  try {
                    localStorage.setItem('zenvitra_has_seen_dais_tutorial_v1', 'true');
                  } catch {}
                  endTutorial();
                } else {
                  nextTutorialStep();
                }
              }}
              className="px-5 py-2 rounded-xl bg-[#C5A46D] hover:bg-[#DFBA73] text-[#08090C] font-black text-xs transition cursor-pointer shadow-xs active:scale-95"
            >
              {currentStep === 4 ? 'Skip' : isFinal ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialEngine;

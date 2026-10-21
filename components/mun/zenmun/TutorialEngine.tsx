'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X, Sparkles, CheckCircle2 } from 'lucide-react';
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
  const { session, setSession, nextTutorialStep, prevTutorialStep, skipTutorial, endTutorial } = useZenMun();
  const { isActive, currentStep, welcomeModalOpen } = session.tutorial;

  const [targetRects, setTargetRects] = useState<TargetRect[]>([]);
  const [stickTipCoord, setStickTipCoord] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const stickRef = useRef<HTMLDivElement>(null);

  const currentStepData: TutorialStepDef =
    TUTORIAL_STEPS_CONTENT[currentStep - 1] || TUTORIAL_STEPS_CONTENT[0];
  const isFinal = currentStep === 17;

  // Measure target elements bounding rectangles dynamically
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

      // Measure guiding tip of Zeno's outstretched wing
      if (stickRef.current) {
        const b = stickRef.current.getBoundingClientRect();
        // Zeno's outstretched wing tip is at x: 14%, y: 44% of the container
        setStickTipCoord({
          x: b.left + b.width * 0.14,
          y: b.top + b.height * 0.44,
        });
      } else {
        setStickTipCoord({
          x: window.innerWidth - 240,
          y: window.innerHeight - 220,
        });
      }
    };

    updateRects();
    const handleResize = () => updateRects();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', updateRects, true);

    // Continuous RAF / interval tracking for dynamic layout changes
    const interval = setInterval(updateRects, 300);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', updateRects, true);
      clearInterval(interval);
    };
  }, [isActive, currentStep, currentStepData]);

  // Welcome Modal: Matches Screenshot 2026-10-18 023509.png
  if (welcomeModalOpen) {
    return (
      <div className="fixed inset-0 z-100 bg-[#243928]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none">
        <div className="w-full max-w-sm bg-[#F0EDE4] rounded-3xl border border-[#D6D1C4] shadow-2xl p-7 text-center space-y-6">
          {/* Zeno Welcome Mascot */}
          <div className="w-56 h-52 mx-auto flex items-center justify-center">
            <img
              src="/assets/zeno.png"
              alt="Zeno the Diplomatic Owl Guide"
              className="w-full h-full object-contain drop-shadow-xl select-none"
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-[#1A1D1A] tracking-tight uppercase leading-snug">
              HAVE YOU USED ZENVITRA MUN BEFORE?
            </h2>
            <p className="text-xs text-[#7A7870] max-w-xs mx-auto leading-relaxed">
              Zeno has a short interactive run-through prepared for you.
            </p>
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
              className="px-6 py-3 rounded-full bg-[#243928] hover:bg-[#324f38] text-[#E4DB98] font-black text-xs uppercase tracking-wider transition shadow-md cursor-pointer active:scale-95"
            >
              SHOW ME AROUND
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
              className="px-5 py-3 rounded-full bg-[#DCD9CE] hover:bg-[#cfcbc0] text-[#243928] font-bold text-xs uppercase tracking-wider transition cursor-pointer border border-[#C8C4B8]"
            >
              SKIP TUTORIAL
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive) return null;

  // Formatter for highlighting keywords inside speech bubble
  const renderFormattedSpeech = (text: string, highlightWords: string[] = []) => {
    if (!highlightWords || highlightWords.length === 0) {
      return text;
    }

    const escaped = highlightWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isMatch = highlightWords.some((w) => w.toLowerCase() === part.toLowerCase());
      if (isMatch) {
        return (
          <span
            key={i}
            className="text-[#A1853B] font-black bg-[#E4DB98]/30 px-1 py-0.5 rounded cursor-pointer transition hover:bg-[#E4DB98]/60 inline-block"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="fixed inset-0 z-90 pointer-events-none select-none">
      <style>{`
        @keyframes tutorialFlashHalo {
          0%, 100% {
            box-shadow: 0 0 25px rgba(228, 219, 152, 0.95), 0 0 60px rgba(217, 119, 6, 0.5), inset 0 0 15px rgba(228, 219, 152, 0.6);
            border-color: #E4DB98;
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 50px rgba(245, 158, 11, 1), 0 0 90px rgba(245, 158, 11, 0.8), inset 0 0 25px rgba(245, 158, 11, 0.8);
            border-color: #F59E0B;
            transform: scale(1.02);
          }
        }
        @keyframes beamFlowDash {
          to {
            stroke-dashoffset: -28;
          }
        }
        .animate-tutorial-halo {
          animation: tutorialFlashHalo 1.4s ease-in-out infinite;
        }
        .animate-beam-flow {
          animation: beamFlowDash 1s linear infinite;
        }
      `}</style>
      
      {/* ─────────────────────────────────────────────────────────────
          1. FULL SCREEN SPOTLIGHT SVG MASK
             Dims entire screen EXCEPT active targets which shine crisp
      ───────────────────────────────────────────────────────────── */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="tutorial-spotlight-mask">
            {/* White base = fully visible overlay */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutouts = transparent holes letting UI shine through */}
            {targetRects.map((t) => (
              <rect
                key={`cutout-${t.id}`}
                x={t.left - 6}
                y={t.top - 6}
                width={t.width + 12}
                height={t.height + 12}
                rx="16"
                fill="black"
              />
            ))}
          </mask>

          {/* Golden energy beam gradient */}
          <linearGradient id="beam-gold-gradient" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#E4DB98" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.85" />
          </linearGradient>

          {/* Inter-Target Relationship Gradient */}
          <linearGradient id="inter-target-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity="0.95" />
            <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.95" />
          </linearGradient>

          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Backdrop overlay with holes cut out for targets */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(15, 24, 18, 0.52)"
          mask="url(#tutorial-spotlight-mask)"
        />

        {/* 1. BEAM FROM GAVIN'S POINTER STICK TO EACH ACTIVE TARGET */}
        {targetRects.map((t) => {
          const targetX = t.left + t.width / 2;
          const targetY = t.top + t.height / 2;
          const startX = stickTipCoord.x || window.innerWidth - 260;
          const startY = stickTipCoord.y || window.innerHeight - 280;

          // Smooth curved path to target
          const ctrlX = (startX + targetX) / 2;
          const ctrlY = Math.min(startY, targetY) - 60;

          return (
            <g key={`beam-${t.id}`}>
              {/* Glowing animated dashed connector beam */}
              <path
                d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${targetX} ${targetY}`}
                fill="none"
                stroke="url(#beam-gold-gradient)"
                strokeWidth="4"
                strokeDasharray="10 6"
                filter="url(#glow)"
                className="animate-beam-flow"
              />

              {/* Pulsing target contact indicator */}
              <circle cx={targetX} cy={targetY} r="12" fill="#E4DB98" className="animate-ping opacity-60" />
              <circle cx={targetX} cy={targetY} r="6" fill="#F59E0B" stroke="#FFF" strokeWidth="2.5" />
            </g>
          );
        })}

        {/* 2. INTER-TARGET RELATIONSHIP CONNECTOR BEAMS (SHOWING HOW RELATED ELEMENTS CONNECT) */}
        {targetRects.length >= 2 &&
          targetRects.map((t1, idx) => {
            if (idx === targetRects.length - 1) return null;
            const t2 = targetRects[idx + 1];

            const x1 = t1.left + t1.width / 2;
            const y1 = t1.top + t1.height / 2;
            const x2 = t2.left + t2.width / 2;
            const y2 = t2.top + t2.height / 2;

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - 40;

            return (
              <g key={`rel-beam-${t1.id}-${t2.id}`}>
                {/* Dynamic Inter-Relationship Connecting Line */}
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke="url(#inter-target-gradient)"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  filter="url(#glow)"
                  className="animate-beam-flow"
                />

                {/* Relationship Node Badge */}
                <circle cx={midX} cy={midY + 15} r="14" fill="#243928" stroke="#E4DB98" strokeWidth="2.5" />
                <text
                  x={midX}
                  y={midY + 19}
                  textAnchor="middle"
                  fill="#E4DB98"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  🔗
                </text>
              </g>
            );
          })}
      </svg>

      {/* ─────────────────────────────────────────────────────────────
          2. FLASHING GOLDEN HALOS AROUND TARGET ELEMENTS
      ───────────────────────────────────────────────────────────── */}
      {targetRects.map((t) => (
        <div
          key={`flash-ring-${t.id}`}
          style={{
            top: t.top - 6,
            left: t.left - 6,
            width: t.width + 12,
            height: t.height + 12,
          }}
          className="fixed pointer-events-none z-85 rounded-2xl border-2 border-[#E4DB98] animate-tutorial-halo"
        >
          {/* Sparkle chip in corner */}
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 shadow-[0_0_10px_#F59E0B]" />
          </span>
        </div>
      ))}

      {/* ─────────────────────────────────────────────────────────────
          3. TOP NAVIGATION PILL: [ < Back ] [ 4/17 ] [ Skip > / Next > ]
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-auto z-95">
        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-full bg-white shadow-xl border border-[#D6D1C4] text-xs font-bold text-[#1A1D1A]">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={prevTutorialStep}
            className={`flex items-center gap-1 cursor-pointer transition ${
              currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:text-[#243928]'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <span className="font-mono text-[#7A7870] px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#EFECE4]">
            {currentStep}/17
          </span>

          <button
            type="button"
            onClick={isFinal ? endTutorial : nextTutorialStep}
            className="flex items-center gap-1 text-[#243928] hover:underline cursor-pointer font-black"
          >
            <span>{isFinal ? 'Finish >' : currentStepData.actionLabel || 'Next >'}</span>
            {!isFinal && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. TOP-RIGHT END TUTORIAL BUTTON
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute top-4 right-6 pointer-events-auto z-95">
        <button
          type="button"
          onClick={endTutorial}
          className="px-4 py-2 rounded-xl bg-[#243928] hover:bg-[#324f38] text-white text-xs font-bold cursor-pointer transition shadow-md flex items-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>End Tutorial</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          5. ZENO MASCOT WITH GUIDING GESTURE & SPEECH BUBBLE
      ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-2 right-6 max-w-sm pointer-events-auto z-95 flex flex-col items-end">
        
        {/* Mascot Speech Bubble Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#D6D1C4] shadow-2xl relative space-y-3 mb-2 animate-fade-in max-w-xs sm:max-w-sm">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#F0EDE4] pb-2">
            <div className="text-xs font-black uppercase text-[#243928] flex items-center gap-1.5">
              <span>Zeno &bull; Dais Guide</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <span className="text-[10px] font-mono text-[#7A7870] bg-[#FAF9F5] px-2 py-0.5 rounded border border-[#EAE6DC]">
              Step {currentStep}/17
            </span>
          </div>

          {/* Speech Text with Gold Formatted Keywords linking to UI */}
          <p className="text-xs text-[#2A2D2A] leading-relaxed font-medium">
            {renderFormattedSpeech(currentStepData.text, currentStepData.highlightWords)}
          </p>

          {/* Diamond Tail pointing down to Zeno */}
          <div className="w-3 h-3 bg-white rotate-45 border-r border-b border-[#D6D1C4] absolute -bottom-1.5 right-20" />
        </div>

        {/* Zeno Mascot Illustration */}
        <div ref={stickRef} className="relative w-52 sm:w-60 h-auto drop-shadow-2xl">
          <img
            src="/assets/zeno.png"
            alt="Zeno the Diplomatic Owl pointing to Dais components"
            className="w-full h-auto object-contain select-none pointer-events-none animate-fade-in"
          />
        </div>
      </div>
    </div>
  );
}

export default TutorialEngine;

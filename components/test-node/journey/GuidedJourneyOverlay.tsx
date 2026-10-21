'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Shield,
  Layers,
  RotateCcw,
  ExternalLink,
  Lock,
  UserCheck,
  AlertCircle,
  Play,
  Eye,
  X
} from 'lucide-react';
import { useJourney } from '@/context/JourneyContext';
import { JOURNEY_STEPS, JourneyStepId, DemoRole } from '@/lib/test-node/journeyStateMachine';

export function GuidedJourneyOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    session,
    currentStep,
    nextStep,
    prevStep,
    progressPercentage,
    activeRole,
    activePersona,
    isGuidedActive,
    setMode,
    setRole,
    completeCurrentStep,
    skipCurrentStep,
    goBackStep,
    advanceStep,
    jumpToStep,
    resetJourney,
  } = useJourney();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // If user has switched to free explore, display a minimized launcher badge
  if (!isGuidedActive) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setMode('GUIDED')}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-105 transition-all cursor-pointer border border-cyan-400/50"
        >
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>Resume Guided Demo ({progressPercentage}%)</span>
        </button>
      </div>
    );
  }

  const roleMismatch = currentStep.requiredRole && currentStep.requiredRole !== activeRole;

  const handleNextOrComplete = () => {
    // If we're on the last step or want to complete
    completeCurrentStep();
    if (nextStep) {
      if (nextStep.route && pathname !== nextStep.route) {
        router.push(nextStep.route);
      }
    }
  };

  const handleNavigateToStep = (stepId: JourneyStepId, route: string) => {
    jumpToStep(stepId);
    if (route && pathname !== route) {
      router.push(route);
    }
    setIsExpanded(false);
  };

  return (
    <>
      {/* ── PERSISTENT BOTTOM FLOATING GUIDANCE DOCK ── */}
      <aside 
        aria-label="Guided Demo Navigation Dock"
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#070b14]/95 border-t border-cyan-500/30 backdrop-blur-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.8)] transition-all duration-300"
      >
        {/* Dynamic Progress Indicator Strip */}
        <div className="w-full bg-slate-900 h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            {/* Left: Step Meta & Drawer Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 flex items-center justify-center hover:bg-cyan-500/20 transition cursor-pointer shrink-0"
                title={isExpanded ? 'Collapse journey map' : 'Expand full 12-step journey map'}
              >
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-400 text-black font-black font-mono text-[10px] uppercase tracking-wider">
                    STEP {currentStep.displayStep} OF 12
                  </span>
                  <span className="font-mono text-[11px] text-cyan-300 font-bold tracking-tight">
                    {currentStep.appName}
                  </span>
                  <span className="hidden sm:inline text-neutral-500 text-xs">•</span>
                  <span className="hidden sm:inline font-mono text-[11px] text-neutral-400">
                    {progressPercentage}% Complete
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm sm:text-base tracking-tight flex items-center gap-2 mt-0.5">
                  <span>{currentStep.title}</span>
                  {currentStep.isOptional && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                      Optional
                    </span>
                  )}
                </h4>
              </div>
            </div>

            {/* Middle: Active Objective snippet (desktop only) */}
            <div className="hidden lg:flex items-center gap-2 max-w-md bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-300">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="truncate">
                <span className="text-white font-medium">Objective: </span>
                <span className="text-neutral-400">{currentStep.objective}</span>
              </div>
            </div>

            {/* Right: Controls & Navigation */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              {/* Back button */}
              {prevStep && (
                <button
                  type="button"
                  onClick={goBackStep}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-neutral-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Previous Step"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Back</span>
                </button>
              )}

              {/* Skip button (only if optional) */}
              {currentStep.isOptional && (
                <button
                  type="button"
                  onClick={skipCurrentStep}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-400 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  title="Skip optional step"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Skip</span>
                </button>
              )}

              {/* Action / Next Button */}
              <button
                type="button"
                onClick={handleNextOrComplete}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition hover:scale-102 cursor-pointer"
              >
                <span>{nextStep ? 'Complete & Next' : 'Finish Journey'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Free Explore toggle */}
              <button
                type="button"
                onClick={() => setMode('FREE_EXPLORE')}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                title="Switch to Free Explore mode"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Role Alignment Warning (if step needs a specific role and user isn't on it) */}
          {roleMismatch && (
            <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-2 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  This step expects the <strong className="text-white uppercase">{currentStep.requiredRole}</strong> role. You are currently viewing as <strong className="text-white uppercase">{activeRole}</strong>.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRole(currentStep.requiredRole)}
                className="px-2.5 py-1 rounded bg-amber-400 text-black font-bold font-mono text-[10px] uppercase hover:bg-amber-300 transition cursor-pointer shrink-0"
              >
                Auto-Switch to {currentStep.requiredRole}
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── EXPANDABLE 12-STEP JOURNEY MAP DRAWER ── */}
      {isExpanded && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-6 transition-opacity animate-in fade-in duration-200">
          <div className="w-full sm:max-w-4xl max-h-[85vh] bg-[#070b14] border border-cyan-500/30 sm:rounded-2xl flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-600 p-0.5">
                  <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                    <Compass className="w-4 h-4 text-cyan-300" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-black text-white text-lg tracking-tight uppercase">
                    Guided Journey Map • Section 4A
                  </h3>
                  <p className="text-xs text-neutral-400">
                    12-step end-to-end interactive simulation across all ZENVITRA modules.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetJourney}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Reset Journey Progress"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Persona Strip */}
            <div className="px-6 py-3 bg-cyan-950/30 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <img
                  src={activePersona.avatar}
                  alt={activePersona.name}
                  className="w-7 h-7 rounded-full object-cover border border-cyan-400"
                />
                <div>
                  <span className="text-white font-bold">{activePersona.name}</span>
                  <span className="text-cyan-400 font-mono text-[11px] ml-1.5">({activePersona.handle})</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase">
                  {activePersona.roleTitle}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400 text-[11px]">Role Switcher:</span>
                {(['DELEGATE', 'EXECUTIVE_BOARD', 'SECRETARIAT', 'ORGANISER', 'COMMUNITY_MEMBER'] as DemoRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase transition cursor-pointer ${
                      activeRole === r
                        ? 'bg-cyan-400 text-black font-black'
                        : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* 12 Steps List */}
            <div className="p-6 overflow-y-auto space-y-3 max-h-[55vh]">
              {JOURNEY_STEPS.map((step) => {
                const status = session.stepStatuses[step.id];
                const isCurrent = session.currentStepId === step.id;
                const isLocked = status === 'LOCKED';
                const isCompleted = status === 'COMPLETED';
                const isSkipped = status === 'SKIPPED';

                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/50'
                        : isCompleted
                        ? 'bg-emerald-500/5 border-emerald-500/30'
                        : isLocked
                        ? 'bg-white/[0.01] border-white/5 opacity-50'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <div className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : isLocked ? (
                            <Lock className="w-5 h-5 text-neutral-600" />
                          ) : isSkipped ? (
                            <SkipForward className="w-5 h-5 text-amber-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-cyan-400">
                              STEP {step.displayStep} • {step.appName}
                            </span>
                            {step.isOptional && (
                              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-neutral-800 text-neutral-400">
                                Optional
                              </span>
                            )}
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">
                              Requires: {step.requiredRole}
                            </span>
                          </div>

                          <h4 className="text-white font-bold text-sm tracking-tight mt-0.5">
                            {step.title}
                          </h4>
                          <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                            {step.subtitle}
                          </p>

                          {/* Checklists for active step */}
                          {isCurrent && (
                            <div className="mt-3 p-3 rounded-lg bg-black/40 border border-cyan-500/20 space-y-1.5 text-xs">
                              <span className="text-cyan-300 font-bold block mb-1">Active Checklist:</span>
                              {step.checklist.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-neutral-300">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Step Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        {!isLocked && (
                          <button
                            type="button"
                            onClick={() => handleNavigateToStep(step.id, step.route)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase flex items-center gap-1 transition cursor-pointer ${
                              isCurrent
                                ? 'bg-cyan-400 text-black hover:bg-cyan-300'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                          >
                            <span>{isCurrent ? 'Current' : 'Go to Step'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {isLocked && (
                          <span className="font-mono text-[11px] text-neutral-600 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="px-6 py-3.5 bg-black/60 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-mono">
                Progress: <strong className="text-white">{progressPercentage}%</strong> ({session.stepStatuses['J10_SUMMARY'] === 'COMPLETED' ? '12/12 Complete' : 'In Progress'})
              </span>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold transition cursor-pointer"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

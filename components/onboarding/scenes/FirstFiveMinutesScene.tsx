'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  User,
  Compass,
  Sparkles,
  Radio,
  ShieldCheck,
  Check
} from 'lucide-react';

interface FirstFiveMinutesSceneProps {
  onNext: () => void;
}

interface ActionTask {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

const TASKS: ActionTask[] = [
  {
    id: 'profile',
    step: '01',
    title: 'COMPLETE YOUR PROFILE',
    description: 'Add your profile picture, bio, interests, and institution.',
    icon: User,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
  },
  {
    id: 'events',
    step: '02',
    title: 'EXPLORE EVENTS & SUMMITS',
    description: 'Find a MUN or youth forum you want to participate in.',
    icon: Compass,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
  },
  {
    id: 'interests',
    step: '03',
    title: 'FOLLOW YOUR INTERESTS',
    description: 'Customize what you want to discover across diplomacy, technology, and debates.',
    icon: Sparkles,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
  },
  {
    id: 'community',
    step: '04',
    title: 'EXPLORE THE COMMUNITY',
    description: 'Check ZEN.PULSE to see what young leaders are discussing and publishing.',
    icon: Radio,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
  },
  {
    id: 'passport',
    step: '05',
    title: 'BUILD YOUR PASSPORT',
    description: 'Participate, contribute, and collect verified credentials for your long-term dossier.',
    icon: ShieldCheck,
    color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
  },
];

export function FirstFiveMinutesScene({ onNext }: FirstFiveMinutesSceneProps) {
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(['profile']);

  const toggleTask = (id: string) => {
    setCompletedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const isAllDone = completedTaskIds.length >= 3;

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-4 py-6 sm:py-10 select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="text-[11px] font-mono tracking-[0.25em] text-neutral-400 uppercase">
          08 &bull; ACTION CHECKLIST
        </div>
        <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white uppercase max-w-2xl leading-tight">
          YOUR FIRST <span className="text-emerald-400">5 MINUTES.</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono">
          &ldquo;Five quick steps to get oriented and establish your sovereign footprint.&rdquo;
        </p>
      </div>

      {/* Interactive Checklist Stack */}
      <div className="w-full space-y-3">
        {TASKS.map((task, idx) => {
          const isDone = completedTaskIds.includes(task.id);
          const Icon = task.icon;
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              onClick={() => toggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 text-left ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'bg-white/[0.02] border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${task.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-500 font-bold">{task.step}</span>
                    <h3 className="text-xs sm:text-sm font-bold text-white font-mono">{task.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">{task.description}</p>
                </div>
              </div>

              <div className="shrink-0">
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-black">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <Circle className="w-6 h-6 text-neutral-600 hover:text-neutral-400 transition" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Pill */}
      <div className="mt-8 text-center space-y-2">
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
          {completedTaskIds.length} OF {TASKS.length} EXPLORED &bull; {isAllDone ? "YOU'RE READY." : 'CLICK ITEMS TO MARK'}
        </span>
      </div>

      {/* Next CTA */}
      <div className="mt-6">
        <button
          type="button"
          onClick={onNext}
          className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer group"
        >
          <span>CLAIM ONBOARDING REWARDS</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

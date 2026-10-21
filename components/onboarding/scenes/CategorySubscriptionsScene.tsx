'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCheck,
  Sparkles,
  ArrowRight,
  Flame,
  Globe2,
  Newspaper,
  Radio,
  BookOpen,
  Layers
} from 'lucide-react';
import {
  PRESS_CATEGORIES,
  NEWS_CATEGORIES,
  PULSE_TOPICS,
  getCategorySubscriptions,
  saveCategorySubscriptions,
  markCategorySubscriptionsScreenSeen,
  CategorySubscriptionState
} from '@/lib/categorySubscriptionService';

interface CategorySubscriptionsSceneProps {
  onNext: () => void;
  userName?: string;
}

export function CategorySubscriptionsScene({
  onNext,
  userName,
  isFromSkip = false,
}: CategorySubscriptionsSceneProps & { isFromSkip?: boolean }) {
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'press' | 'pulse'>('all');
  const [selectedSubs, setSelectedSubs] = useState<CategorySubscriptionState>({
    news: [],
    press: [],
    pulse: [],
  });

  // Load existing user subscriptions
  useEffect(() => {
    const existing = getCategorySubscriptions();
    setSelectedSubs(existing);
  }, []);

  const toggle = (platform: 'news' | 'press' | 'pulse', catId: string) => {
    setSelectedSubs((prev) => {
      const list = prev[platform] || [];
      const exists = list.some((c) => c.toUpperCase() === catId.toUpperCase());
      const nextList = exists
        ? list.filter((c) => c.toUpperCase() !== catId.toUpperCase())
        : [...list, catId];

      const updated = {
        ...prev,
        [platform]: nextList
      };
      saveCategorySubscriptions(updated);
      return updated;
    });
  };

  const selectAllInPlatform = (platform: 'news' | 'press' | 'pulse') => {
    const allIds =
      platform === 'news'
        ? NEWS_CATEGORIES.map((c) => c.id)
        : platform === 'press'
        ? PRESS_CATEGORIES.map((c) => c.id)
        : PULSE_TOPICS.map((c) => c.id);

    setSelectedSubs((prev) => {
      const updated = {
        ...prev,
        [platform]: allIds
      };
      saveCategorySubscriptions(updated);
      return updated;
    });
  };

  const MIN_REQUIRED_SUBSCRIPTIONS = 5;
  const totalSelected =
    selectedSubs.news.length + selectedSubs.press.length + selectedSubs.pulse.length;
  const isSatisfied = totalSelected >= MIN_REQUIRED_SUBSCRIPTIONS;

  const handleSaveAndContinue = () => {
    if (!isSatisfied) return;
    saveCategorySubscriptions(selectedSubs);
    markCategorySubscriptionsScreenSeen(userName);
    onNext();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-4 sm:py-6 select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/10 via-amber-500/10 to-purple-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Mandatory Notice if user skipped tour */}
      {isFromSkip && (
        <div className="mb-4 w-full max-w-xl mx-auto px-4 py-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center justify-center gap-2 text-center animate-pulse">
          <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Tour skipped! Please select at least 5 topic channels to calibrate your feed before entering.</span>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] font-mono tracking-widest uppercase mb-1">
          <Bell className="w-3.5 h-3.5" />
          <span>REAL-TIME DISPATCH INTELLIGENCE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white uppercase max-w-2xl leading-tight">
          SUBSCRIBE TO <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-400 to-purple-400 tracking-normal">Your Topics</span>
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 font-mono max-w-xl mx-auto">
          Choose at least <span className="text-amber-400 font-bold">5 topics</span> you want to follow. Receive instantaneous notifications when new policy bills, diplomatic news, and press dispatches drop.
        </p>
      </div>

      {/* Filter Tabs & Quick Action Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-5 border-b border-white/10 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/10 rounded-2xl text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Categories ({NEWS_CATEGORIES.length + PRESS_CATEGORIES.length + PULSE_TOPICS.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'news'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>News Wire</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('press')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'press'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Press Enclave</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pulse')}
            className={`px-3 py-1.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pulse'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Pulse Commons</span>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-neutral-400">
            Selected: <strong className="text-cyan-300 font-bold">{totalSelected}</strong> Topics
          </span>
          <span className="text-white/20">|</span>
          <button
            type="button"
            onClick={() => {
              selectAllInPlatform('news');
              selectAllInPlatform('press');
              selectAllInPlatform('pulse');
            }}
            className="text-cyan-400 hover:text-cyan-300 text-[11px] underline cursor-pointer"
          >
            Select All
          </button>
        </div>
      </div>

      {/* Categories Grid Container */}
      <div className="w-full space-y-6 max-h-[380px] sm:max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
        {/* NEWS CATEGORIES */}
        {(activeTab === 'all' || activeTab === 'news') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase flex items-center gap-2">
                <Globe2 className="w-3.5 h-3.5" />
                <span>ZEN.NEWS GLOBAL WIRE ({NEWS_CATEGORIES.length})</span>
              </span>
              <button
                type="button"
                onClick={() => selectAllInPlatform('news')}
                className="text-[10px] font-mono text-neutral-400 hover:text-white cursor-pointer"
              >
                + Select All News
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {NEWS_CATEGORIES.map((cat) => {
                const isSelected = selectedSubs.news.some(
                  (c) => c.toUpperCase() === cat.id.toUpperCase()
                );
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggle('news', cat.id)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 cursor-pointer group ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{cat.icon}</span>
                      <span className="text-xs font-mono font-semibold truncate">
                        {cat.label}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-cyan-400 text-black'
                          : 'border border-white/20 group-hover:border-white/40'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PRESS CATEGORIES */}
        {(activeTab === 'all' || activeTab === 'press') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase flex items-center gap-2">
                <Newspaper className="w-3.5 h-3.5" />
                <span>ZEN.PRESS EDITORIAL &amp; SOVEREIGN GAZETTE ({PRESS_CATEGORIES.length})</span>
              </span>
              <button
                type="button"
                onClick={() => selectAllInPlatform('press')}
                className="text-[10px] font-mono text-neutral-400 hover:text-white cursor-pointer"
              >
                + Select All Press
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2.5">
              {PRESS_CATEGORIES.map((cat) => {
                const isSelected = selectedSubs.press.some(
                  (c) => c.toUpperCase() === cat.id.toUpperCase()
                );
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggle('press', cat.id)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 cursor-pointer group ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{cat.icon}</span>
                      <span className="text-xs font-mono font-semibold truncate">
                        {cat.label}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-black'
                          : 'border border-white/20 group-hover:border-white/40'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PULSE TOPICS */}
        {(activeTab === 'all' || activeTab === 'pulse') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold tracking-wider text-purple-400 uppercase flex items-center gap-2">
                <Radio className="w-3.5 h-3.5" />
                <span>ZEN.PULSE COMMUNITY COMMONS ({PULSE_TOPICS.length})</span>
              </span>
              <button
                type="button"
                onClick={() => selectAllInPlatform('pulse')}
                className="text-[10px] font-mono text-neutral-400 hover:text-white cursor-pointer"
              >
                + Select All Pulse
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2.5">
              {PULSE_TOPICS.map((cat) => {
                const isSelected = selectedSubs.pulse.some(
                  (c) => c.toUpperCase() === cat.id.toUpperCase()
                );
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggle('pulse', cat.id)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-2 cursor-pointer group ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-white/[0.02] border-white/10 hover:border-white/20 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base shrink-0">{cat.icon}</span>
                      <span className="text-xs font-mono font-semibold truncate">
                        {cat.label}
                      </span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-purple-400 text-black'
                          : 'border border-white/20 group-hover:border-white/40'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation & Continue Button */}
      <div className="mt-7 flex flex-col sm:flex-row items-center justify-between gap-4 w-full pt-4 border-t border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            {isSatisfied ? (
              <CheckCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
            <span className={isSatisfied ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
              {isSatisfied
                ? `✓ ${totalSelected} topics subscribed (Threshold met)`
                : `Select at least 5 topics to continue (${totalSelected}/5 chosen)`}
            </span>
          </div>
          <span className="hidden sm:inline text-neutral-600">&bull;</span>
          <span className="text-neutral-500 text-[11px]">
            Adjustable anytime in Settings
          </span>
        </div>

        <button
          type="button"
          disabled={!isSatisfied}
          onClick={handleSaveAndContinue}
          className={`w-full sm:w-auto px-7 py-3 rounded-2xl font-display font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg active:scale-95 ${
            isSatisfied
              ? 'bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-400 hover:opacity-95 text-black shadow-[0_0_30px_rgba(6,182,212,0.35)] cursor-pointer'
              : 'bg-white/10 text-neutral-500 border border-white/10 cursor-not-allowed opacity-60'
          }`}
        >
          <span>
            {isSatisfied
              ? `Confirm Subscriptions & Continue (${totalSelected})`
              : `Pick ${MIN_REQUIRED_SUBSCRIPTIONS - totalSelected} More Topics`}
          </span>
          <ArrowRight className={`w-4 h-4 ${isSatisfied ? 'text-black' : 'text-neutral-500'}`} />
        </button>
      </div>
    </div>
  );
}

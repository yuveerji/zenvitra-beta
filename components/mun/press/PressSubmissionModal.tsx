'use client';

import React, { useState } from 'react';
import { X, Send, Newspaper, AlertCircle, Clock } from 'lucide-react';
import { DiasButton } from '../dias/DiasButton';
import { DiasInput } from '../dias/DiasInput';
import { DiasBadge } from '../dias/DiasBadge';

export interface PressSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDispatch: (dispatch: {
    headline: string;
    leadAgency: string;
    publicationType: string;
    bodyText: string;
    embargoMinutes?: number;
  }) => void;
}

export const PressSubmissionModal: React.FC<PressSubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmitDispatch,
}) => {
  const [headline, setHeadline] = useState('');
  const [leadAgency, setLeadAgency] = useState('REUTERS');
  const [pubType, setPubType] = useState('PRESS_RELEASE');
  const [bodyText, setBodyText] = useState('');
  const [hasEmbargo, setHasEmbargo] = useState(false);
  const [embargoMinutes, setEmbargoMinutes] = useState(15);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      setError('Headline is required.');
      return;
    }
    if (!bodyText.trim()) {
      setError('Article body text is required.');
      return;
    }

    onSubmitDispatch({
      headline,
      leadAgency,
      publicationType: pubType,
      bodyText,
      embargoMinutes: hasEmbargo ? embargoMinutes : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090B]/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-2xl bg-[#111318] border border-[#232731] rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#181B21] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#181B21] border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
              <Newspaper className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  File Press Dispatch
                </h3>
                <DiasBadge variant="gold" size="sm">
                  IPC WIRE
                </DiasBadge>
              </div>
              <p className="text-xs text-[#9A9DA5]">
                Submit articles, breaking communiqués, or embargoed releases
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9A9DA5] hover:text-[#F4F2ED] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {error && (
            <div className="p-3 rounded-xl bg-[#822424]/20 border border-[#822424]/40 text-[#FCA5A5] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#9A9DA5] uppercase mb-1">
                News Agency / Publication
              </label>
              <select
                className="w-full bg-[#08090B] border border-[#232731] text-xs text-[#F4F2ED] rounded-xl px-3 py-2.5 outline-none focus:border-[#C5A46D]"
                value={leadAgency}
                onChange={(e) => setLeadAgency(e.target.value)}
              >
                <option value="REUTERS">Reuters Wire</option>
                <option value="PTI">Press Trust of India (PTI)</option>
                <option value="BBC">BBC Diplomatic Desk</option>
                <option value="THE_HINDU">The Hindu</option>
                <option value="AL_JAZEERA">Al Jazeera English</option>
                <option value="TASS">TASS Russian News Agency</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9A9DA5] uppercase mb-1">
                Publication Type
              </label>
              <select
                className="w-full bg-[#08090B] border border-[#232731] text-xs text-[#F4F2ED] rounded-xl px-3 py-2.5 outline-none focus:border-[#C5A46D]"
                value={pubType}
                onChange={(e) => setPubType(e.target.value)}
              >
                <option value="PRESS_RELEASE">Official Press Release</option>
                <option value="ARTICLE">News Article / Analysis</option>
                <option value="EDITORIAL">Editorial Opinion</option>
                <option value="COMMUNIQUE">Joint Communiqué</option>
              </select>
            </div>
          </div>

          <DiasInput
            label="Headline"
            placeholder="e.g. UN Security Council Deadlocked Over Maritime Sanctions Resolution"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#9A9DA5] uppercase">
              Story Content
            </label>
            <textarea
              rows={5}
              className="w-full bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] text-[#F4F2ED] placeholder-[#575B66] text-xs rounded-xl p-3 outline-none"
              placeholder="GENEVA — Delegations in the chamber today engaged in heated debate..."
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
            />
          </div>

          {/* Embargo Toggle */}
          <div className="p-4 rounded-xl bg-[#08090B] border border-[#1F232B] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A46D]" />
                <span className="text-xs font-semibold text-[#F4F2ED]">
                  Time-Locked Embargo
                </span>
              </div>
              <input
                type="checkbox"
                checked={hasEmbargo}
                onChange={(e) => setHasEmbargo(e.target.checked)}
                className="rounded border-[#232731] text-[#C5A46D] focus:ring-[#C5A46D] h-4 w-4 bg-[#111318]"
              />
            </div>
            {hasEmbargo && (
              <div className="flex items-center gap-3 pt-2">
                <label className="text-xs text-[#9A9DA5]">Hold release for:</label>
                <select
                  className="bg-[#111318] border border-[#232731] text-xs text-[#F4F2ED] rounded-lg px-2.5 py-1"
                  value={embargoMinutes}
                  onChange={(e) => setEmbargoMinutes(Number(e.target.value))}
                >
                  <option value={5}>5 Minutes</option>
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>1 Hour</option>
                </select>
                <span className="text-[11px] text-[#575B66]">Cannot be viewed until time expires</span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DiasButton variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </DiasButton>
            <DiasButton variant="gold" size="sm" type="submit" leftIcon={<Send className="w-3.5 h-3.5" />}>
              Submit to Editor Desk
            </DiasButton>
          </div>
        </form>
      </div>
    </div>
  );
};

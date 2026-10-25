'use client';

import React, { useState } from 'react';
import { HelpCircle, Plus, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { DiasButton } from '../dias/DiasButton';
import { DiasBadge } from '../dias/DiasBadge';
import { DiasCard } from '../dias/DiasCard';
import { DiasInput } from '../dias/DiasInput';

export interface ParliamentaryQuestion {
  id: string;
  type: 'STARRED' | 'UNSTARRED' | 'CALLING_ATTENTION';
  fromSeat: string;
  targetMinistry: string;
  questionText: string;
  replyText?: string;
  status: 'PENDING' | 'ADMITTED' | 'ANSWERED' | 'DISALLOWED';
  createdAt: string;
}

export interface QuestionHourDeskProps {
  questions: ParliamentaryQuestion[];
  onAskQuestion: (q: { type: 'STARRED' | 'UNSTARRED'; ministry: string; text: string; fromSeat: string }) => void;
  onAnswerQuestion?: (id: string, reply: string) => void;
  isChair?: boolean;
}

export const QuestionHourDesk: React.FC<QuestionHourDeskProps> = ({
  questions,
  onAskQuestion,
  onAnswerQuestion,
  isChair = false,
}) => {
  const [isAsking, setIsAsking] = useState(false);
  const [qType, setQType] = useState<'STARRED' | 'UNSTARRED'>('STARRED');
  const [ministry, setMinistry] = useState('Ministry of External Affairs');
  const [text, setText] = useState('');
  const [fromSeat, setFromSeat] = useState('OPPOSITION BENCH');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAskQuestion({ type: qType, ministry, text, fromSeat });
    setText('');
    setIsAsking(false);
  };

  return (
    <div className="space-y-4 text-left select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#181B21]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#F4F2ED]">
              Question Hour & Ministerial Inquiries
            </h3>
            <DiasBadge variant="gold" size="sm">
              LOK SABHA RULES
            </DiasBadge>
          </div>
          <p className="text-xs text-[#9A9DA5]">
            Starred questions require oral answers on the floor; unstarred questions receive written replies
          </p>
        </div>
        <DiasButton
          variant="gold"
          size="sm"
          onClick={() => setIsAsking(!isAsking)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          {isAsking ? 'Close Form' : 'Submit Question'}
        </DiasButton>
      </div>

      {isAsking && (
        <form onSubmit={handleSubmit} className="p-5 rounded-2xl bg-[#111318] border border-[#232731] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#9A9DA5] uppercase mb-1">
                Question Type
              </label>
              <select
                className="w-full bg-[#08090B] border border-[#232731] text-xs text-[#F4F2ED] rounded-xl px-3 py-2 outline-none focus:border-[#C5A46D]"
                value={qType}
                onChange={(e) => setQType(e.target.value as any)}
              >
                <option value="STARRED">Starred (Oral Floor Answer)</option>
                <option value="UNSTARRED">Unstarred (Written Record)</option>
              </select>
            </div>
            <div>
              <DiasInput
                label="Asking Member / Bench"
                value={fromSeat}
                onChange={(e) => setFromSeat(e.target.value)}
              />
            </div>
            <div>
              <DiasInput
                label="Target Ministry"
                value={ministry}
                onChange={(e) => setMinistry(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9A9DA5] uppercase mb-1">
              Question Text
            </label>
            <textarea
              rows={2}
              className="w-full bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] text-[#F4F2ED] placeholder-[#575B66] text-xs rounded-xl p-3 outline-none"
              placeholder="Will the Minister be pleased to state..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <DiasButton variant="ghost" size="sm" type="button" onClick={() => setIsAsking(false)}>
              Cancel
            </DiasButton>
            <DiasButton variant="gold" size="sm" type="submit" leftIcon={<Send className="w-3.5 h-3.5" />}>
              Table Question
            </DiasButton>
          </div>
        </form>
      )}

      {questions.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-[#232731] bg-[#111318]/40 text-center space-y-2">
          <HelpCircle className="w-8 h-8 text-[#575B66] mx-auto" />
          <p className="text-sm font-medium text-[#F4F2ED]">No Questions Tabled Yet</p>
          <p className="text-xs text-[#9A9DA5] max-w-sm mx-auto">
            Members may submit questions directed to specific government ministries during Question Hour.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((q) => (
            <DiasCard key={q.id} variant="elevated" className="p-4 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <DiasBadge variant={q.type === 'STARRED' ? 'gold' : 'charcoal'} size="sm">
                    {q.type}
                  </DiasBadge>
                  <span className="text-xs font-semibold text-[#F4F2ED]">
                    From: {q.fromSeat}
                  </span>
                </div>
                <span className="text-xs text-[#9A9DA5] font-mono">
                  To: {q.targetMinistry}
                </span>
              </div>
              <p className="text-xs text-[#F4F2ED] leading-relaxed">
                "{q.questionText}"
              </p>
              {q.replyText ? (
                <div className="p-3 rounded-xl bg-[#08090B] border border-[#1F232B] space-y-1">
                  <span className="text-[10px] uppercase font-mono text-[#86EFAC] block">
                    Ministerial Reply:
                  </span>
                  <p className="text-xs text-[#9A9DA5] leading-relaxed">
                    {q.replyText}
                  </p>
                </div>
              ) : (
                <div className="text-[11px] text-[#C5A46D] font-mono flex items-center gap-1.5 pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A46D] animate-pulse" />
                  Awaiting Ministerial Response on Floor
                </div>
              )}
            </DiasCard>
          ))}
        </div>
      )}
    </div>
  );
};

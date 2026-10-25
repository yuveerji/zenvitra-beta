'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Save, FileText, Check, AlertCircle, Layers } from 'lucide-react';
import { DiasButton } from '../dias/DiasButton';
import { DiasInput } from '../dias/DiasInput';
import { DiasBadge } from '../dias/DiasBadge';

export interface BillClauseInput {
  index: number;
  title: string;
  body: string;
}

export interface BillEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  committeeId: string;
  onBillCreated: (bill: any) => void;
}

export const BillEditorModal: React.FC<BillEditorModalProps> = ({
  isOpen,
  onClose,
  committeeId,
  onBillCreated,
}) => {
  const [title, setTitle] = useState('');
  const [sponsoringSeat, setSponsoringSeat] = useState('TREASURY BENCH');
  const [ministry, setMinistry] = useState('Ministry of External Affairs');
  const [objectives, setObjectives] = useState('');
  const [clauses, setClauses] = useState<BillClauseInput[]>([
    {
      index: 1,
      title: 'Short Title and Commencement',
      body: 'This Act may be called the Diplomatic Maritime Corridors Act, 2026. It shall come into force on such date as the Government may appoint.',
    },
    {
      index: 2,
      title: 'Definitions and Territorial Scope',
      body: 'In this Act, unless the context otherwise requires, "Territorial Waters" and "Economic Corridors" shall have the meanings respectively assigned to them.',
    },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddClause = () => {
    const nextIndex = clauses.length + 1;
    setClauses([
      ...clauses,
      {
        index: nextIndex,
        title: `Clause ${nextIndex}`,
        body: '',
      },
    ]);
  };

  const handleRemoveClause = (idx: number) => {
    if (clauses.length <= 1) return;
    const filtered = clauses.filter((_, i) => i !== idx);
    const reindexed = filtered.map((c, i) => ({ ...c, index: i + 1 }));
    setClauses(reindexed);
  };

  const handleClauseChange = (idx: number, field: 'title' | 'body', val: string) => {
    const updated = [...clauses];
    updated[idx][field] = val;
    setClauses(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Bill Title is required.');
      return;
    }
    if (!objectives.trim()) {
      setError('Statement of Objectives & Reasons is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/mun/committees/${committeeId}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_BILL',
          title,
          sponsoringSeat,
          ministry,
          objectives,
          clauses,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create bill');
      }

      onBillCreated(data.bill);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090B]/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-4xl bg-[#111318] border border-[#232731] rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#181B21] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#181B21] border border-[#C5A46D]/30 flex items-center justify-center text-[#C5A46D]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Legislative Bill Editor
                </h3>
                <DiasBadge variant="gold" size="sm">
                  PARLIAMENT
                </DiasBadge>
              </div>
              <p className="text-xs text-[#9A9DA5]">
                Draft statutory clauses for introduction in Lok Sabha / Rajya Sabha
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#9A9DA5] hover:text-[#F4F2ED] hover:bg-[#181B21] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
          {error && (
            <div className="p-3.5 rounded-xl bg-[#822424]/20 border border-[#822424]/40 text-[#FCA5A5] text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Metadata Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <DiasInput
                label="Bill Long Title"
                placeholder="e.g. The Maritime Security and Sovereign Trade Corridors Bill, 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <DiasInput
                label="Sponsoring Member / Bench"
                placeholder="e.g. Treasury Bench / Hon. Minister"
                value={sponsoringSeat}
                onChange={(e) => setSponsoringSeat(e.target.value)}
              />
            </div>
          </div>

          <div>
            <DiasInput
              label="Ministry / Department"
              placeholder="e.g. Ministry of External Affairs"
              value={ministry}
              onChange={(e) => setMinistry(e.target.value)}
            />
          </div>

          {/* Statement of Objectives & Reasons */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium tracking-wide uppercase text-[#9A9DA5]">
              Statement of Objects and Reasons (Preamble)
            </label>
            <textarea
              rows={3}
              className="w-full bg-[#08090B] border border-[#232731] focus:border-[#C5A46D] text-[#F4F2ED] placeholder-[#575B66] text-sm rounded-xl p-3.5 transition-colors outline-none"
              placeholder="Outline the necessity and legal justification for introducing this legislation..."
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
            />
          </div>

          {/* Clauses List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-[#181B21]">
              <span className="text-xs font-semibold text-[#F4F2ED] tracking-wide uppercase flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-[#C5A46D]" />
                Statutory Clauses ({clauses.length})
              </span>
              <button
                type="button"
                onClick={handleAddClause}
                className="text-xs font-semibold text-[#C5A46D] hover:text-[#E6D1A5] flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Clause
              </button>
            </div>

            {clauses.map((clause, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#08090B] border border-[#1F232B] space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-[#181B21] text-[#C5A46D] text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {clause.index}
                    </span>
                    <input
                      className="bg-transparent text-xs font-semibold text-[#F4F2ED] outline-none border-b border-transparent focus:border-[#C5A46D] px-1 py-0.5 flex-1"
                      value={clause.title}
                      onChange={(e) => handleClauseChange(idx, 'title', e.target.value)}
                      placeholder="Clause Title"
                    />
                  </div>
                  {clauses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveClause(idx)}
                      className="text-[#575B66] hover:text-[#F87171] p-1 rounded-lg transition-colors"
                      title="Remove Clause"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  className="w-full bg-[#111318] border border-[#232731] focus:border-[#C5A46D] text-[#F4F2ED] placeholder-[#575B66] text-xs rounded-xl p-3 transition-colors outline-none"
                  placeholder="Statutory wording of this clause..."
                  value={clause.body}
                  onChange={(e) => handleClauseChange(idx, 'body', e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#181B21] bg-[#0C0E12] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#575B66]">
            VERSION 1.0 • STATUTORY DRAFT
          </span>
          <div className="flex items-center gap-3">
            <DiasButton variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </DiasButton>
            <DiasButton
              variant="gold"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleSubmit}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Introduce Bill to Chamber
            </DiasButton>
          </div>
        </div>
      </div>
    </div>
  );
};

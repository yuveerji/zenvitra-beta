'use client';

import React, { useState } from 'react';
import { X, Send, ShieldAlert, Lock, AlertCircle, Flame } from 'lucide-react';
import { DiasButton } from '../dias/DiasButton';
import { DiasInput } from '../dias/DiasInput';
import { DiasBadge } from '../dias/DiasBadge';

export interface DirectiveComposerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDirective: (directive: {
    title: string;
    actionType: string;
    fromSeat: string;
    targetRecipients: string[];
    content: string;
    isConfidential: boolean;
  }) => void;
}

export const DirectiveComposer: React.FC<DirectiveComposerProps> = ({
  isOpen,
  onClose,
  onSubmitDirective,
}) => {
  const [title, setTitle] = useState('');
  const [actionType, setActionType] = useState('COVERT_OPS');
  const [fromSeat, setFromSeat] = useState('DIRECTORATE OF INTELLIGENCE');
  const [target, setTarget] = useState('CRISIS_DIRECTOR,MINISTRY_OF_DEFENCE');
  const [content, setContent] = useState('');
  const [isConfidential, setIsConfidential] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Directive title is required.');
      return;
    }
    if (!content.trim()) {
      setError('Directive operational orders are required.');
      return;
    }

    const recipients = target.split(',').map((s) => s.trim()).filter(Boolean);

    onSubmitDirective({
      title,
      actionType,
      fromSeat,
      targetRecipients: recipients,
      content,
      isConfidential,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090B]/85 backdrop-blur-md animate-in fade-in select-none">
      <div className="w-full max-w-2xl bg-[#111318] border border-[#822424]/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#181B21] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#822424]/20 border border-[#822424]/40 flex items-center justify-center text-[#FCA5A5]">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#F4F2ED]">
                  Compose Crisis Directive
                </h3>
                <DiasBadge variant="crimson" size="sm">
                  CLASSIFIED
                </DiasBadge>
              </div>
              <p className="text-xs text-[#9A9DA5]">
                Targeted covert or diplomatic orders for execution by Crisis Directorate
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
                Action Classification
              </label>
              <select
                className="w-full bg-[#08090B] border border-[#232731] text-xs text-[#F4F2ED] rounded-xl px-3 py-2.5 outline-none focus:border-[#C5A46D]"
                value={actionType}
                onChange={(e) => setActionType(e.target.value)}
              >
                <option value="COVERT_OPS">Covert Operation</option>
                <option value="TROOP_DEPLOYMENT">Troop / Fleet Deployment</option>
                <option value="DIPLOMATIC_NOTE">Diplomatic Demarche</option>
                <option value="SANCTION">Economic Sanction Order</option>
                <option value="INTELLIGENCE_LEAK">Controlled Media Leak</option>
              </select>
            </div>

            <div>
              <DiasInput
                label="Issuing Seat / Portfolio"
                value={fromSeat}
                onChange={(e) => setFromSeat(e.target.value)}
              />
            </div>
          </div>

          <DiasInput
            label="Directive Codename / Title"
            placeholder="e.g. Operation Northern Shield • Naval Interdiction"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <DiasInput
            label="Target Recipients (comma-separated)"
            placeholder="e.g. CRISIS_DIRECTOR, DEFENCE_MINISTER"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            helperText="Only specified seats and the Crisis Director can read this directive"
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#9A9DA5] uppercase">
              Operational Orders & Contingencies
            </label>
            <textarea
              rows={4}
              className="w-full bg-[#08090B] border border-[#232731] focus:border-[#822424] text-[#F4F2ED] placeholder-[#575B66] text-xs rounded-xl p-3 outline-none"
              placeholder="Specify coordinates, assets committed, objectives, and fallout containment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-xl bg-[#08090B] border border-[#1F232B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#FCA5A5]" />
              <span className="text-xs text-[#F4F2ED]">Strictly Confidential (Isolated from Public Feed)</span>
            </div>
            <input
              type="checkbox"
              checked={isConfidential}
              onChange={(e) => setIsConfidential(e.target.checked)}
              className="rounded border-[#232731] text-[#822424] focus:ring-[#822424] h-4 w-4 bg-[#111318]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DiasButton variant="ghost" size="sm" type="button" onClick={onClose}>
              Cancel
            </DiasButton>
            <DiasButton variant="gold" size="sm" type="submit" leftIcon={<Send className="w-3.5 h-3.5" />}>
              Dispatch Directive
            </DiasButton>
          </div>
        </form>
      </div>
    </div>
  );
};

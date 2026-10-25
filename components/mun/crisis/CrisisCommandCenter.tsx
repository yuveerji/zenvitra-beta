'use client';

import React, { useState } from 'react';
import { Flame, Plus, ShieldAlert, Lock, CheckCircle2, XCircle, AlertTriangle, Radio } from 'lucide-react';
import { DiasButton } from '../dias/DiasButton';
import { DiasBadge } from '../dias/DiasBadge';
import { DiasCard } from '../dias/DiasCard';
import { DirectiveComposer } from './DirectiveComposer';

export interface CrisisDirectiveItem {
  id: string;
  directiveNumber: string;
  title: string;
  actionType: string;
  fromSeat: string;
  targetRecipients: string[];
  content: string;
  isConfidential: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXECUTED';
  createdAt: string;
}

export interface CrisisCommandCenterProps {
  directives: CrisisDirectiveItem[];
  onDispatchDirective: (d: any) => void;
  onUpdateStatus?: (id: string, status: 'APPROVED' | 'REJECTED' | 'EXECUTED') => void;
  isDirector?: boolean;
}

export const CrisisCommandCenter: React.FC<CrisisCommandCenterProps> = ({
  directives,
  onDispatchDirective,
  onUpdateStatus,
  isDirector = true,
}) => {
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  return (
    <div className="space-y-5 text-left select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#181B21]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#F4F2ED]">
              Cabinet & Crisis Terminal
            </h3>
            <DiasBadge variant="crimson" size="sm">
              WAR ROOM
            </DiasBadge>
          </div>
          <p className="text-xs text-[#9A9DA5]">
            Targeted covert operations, troop orders, and confidential intelligence communiqués
          </p>
        </div>
        <DiasButton
          variant="gold"
          size="sm"
          onClick={() => setIsComposerOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          Dispatch Directive
        </DiasButton>
      </div>

      {/* Emergency Crisis Feed Banner */}
      <div className="p-3.5 rounded-2xl bg-[#822424]/15 border border-[#822424]/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
          <span className="text-xs font-mono font-bold text-[#FCA5A5] uppercase">
            LIVE CRISIS PROTOCOL ACTIVE
          </span>
        </div>
        <span className="text-[11px] text-[#9A9DA5] font-mono">
          Directives restricted to authorized portfolios
        </span>
      </div>

      {directives.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-[#232731] bg-[#111318]/40 text-center space-y-3">
          <ShieldAlert className="w-8 h-8 text-[#575B66] mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#F4F2ED]">No Directives Dispatched</p>
            <p className="text-xs text-[#9A9DA5] max-w-sm mx-auto">
              Portfolios can submit covert directives to the Crisis Directorate to shift chamber dynamics.
            </p>
          </div>
          <DiasButton
            variant="charcoal"
            size="sm"
            onClick={() => setIsComposerOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Draft First Directive
          </DiasButton>
        </div>
      ) : (
        <div className="space-y-3">
          {directives.map((d) => (
            <DiasCard key={d.id} variant="elevated" className="p-5 space-y-3 border-[#2A2E39]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#FCA5A5] px-2 py-0.5 rounded bg-[#822424]/20 border border-[#822424]/40">
                    {d.directiveNumber}
                  </span>
                  <DiasBadge
                    variant={
                      d.status === 'EXECUTED'
                        ? 'emerald'
                        : d.status === 'REJECTED'
                        ? 'crimson'
                        : 'amber'
                    }
                    size="sm"
                  >
                    {d.status}
                  </DiasBadge>
                  {d.isConfidential && (
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#181B21] text-[#9A9DA5] border border-[#232731] flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#C5A46D]" /> Confidential
                    </span>
                  )}
                </div>
                <span className="text-xs text-[#9A9DA5]">
                  From: <strong className="text-[#F4F2ED]">{d.fromSeat}</strong>
                </span>
              </div>

              <h4 className="text-base font-semibold text-[#F4F2ED]">
                {d.title}
              </h4>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                {d.content}
              </p>

              <div className="pt-2 text-[11px] font-mono text-[#575B66]">
                Target: {d.targetRecipients.join(', ')} • Type: {d.actionType}
              </div>

              {isDirector && d.status === 'PENDING' && onUpdateStatus && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#181B21]">
                  <DiasButton
                    variant="danger"
                    size="sm"
                    onClick={() => onUpdateStatus(d.id, 'REJECTED')}
                  >
                    Reject
                  </DiasButton>
                  <DiasButton
                    variant="gold"
                    size="sm"
                    onClick={() => onUpdateStatus(d.id, 'EXECUTED')}
                  >
                    Authorize & Execute
                  </DiasButton>
                </div>
              )}
            </DiasCard>
          ))}
        </div>
      )}

      <DirectiveComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onSubmitDirective={(data) => {
          onDispatchDirective({
            ...data,
            id: `dir_${Date.now()}`,
            directiveNumber: `DIR-2026-${String(directives.length + 1).padStart(2, '0')}`,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
          });
        }}
      />
    </div>
  );
};

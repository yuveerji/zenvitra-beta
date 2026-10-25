'use client';

import React, { useState } from 'react';
import { Scale, Check, X, Vote, AlertCircle } from 'lucide-react';
import { DiasButton } from '../dias/DiasButton';
import { DiasBadge } from '../dias/DiasBadge';
import { DiasCard } from '../dias/DiasCard';

export interface AmendmentItem {
  id: string;
  clauseId: string;
  proposedBySeat: string;
  proposedText: string;
  rationale: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN' | 'INCORPORATED';
  createdAt: string;
  clauseTitle?: string;
  billTitle?: string;
}

export interface AmendmentReviewDeckProps {
  amendments: AmendmentItem[];
  onDecideAmendment: (amendmentId: string, status: 'ACCEPTED' | 'REJECTED' | 'INCORPORATED') => void;
  onPutAmendmentToVote: (amendment: AmendmentItem) => void;
  isChair?: boolean;
}

export const AmendmentReviewDeck: React.FC<AmendmentReviewDeckProps> = ({
  amendments,
  onDecideAmendment,
  onPutAmendmentToVote,
  isChair = true,
}) => {
  return (
    <div className="space-y-4 text-left select-none">
      <div className="flex items-center justify-between pb-3 border-b border-[#181B21]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#F4F2ED]">
              Statutory Amendments Desk
            </h3>
            <DiasBadge variant="amber" size="sm">
              FLOOR PROPOSALS
            </DiasBadge>
          </div>
          <p className="text-xs text-[#9A9DA5]">
            Line-item legislative changes proposed to statutory clauses by Members of the House
          </p>
        </div>
      </div>

      {amendments.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-[#232731] bg-[#111318]/40 text-center space-y-2">
          <Scale className="w-8 h-8 text-[#575B66] mx-auto" />
          <p className="text-sm font-medium text-[#F4F2ED]">No Pending Amendments</p>
          <p className="text-xs text-[#9A9DA5] max-w-sm mx-auto">
            When members propose amendments to active bill clauses, they will appear here for review or division voting.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {amendments.map((am) => (
            <DiasCard key={am.id} variant="elevated" className="p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#E6D1A5]">
                    Proposed by: {am.proposedBySeat}
                  </span>
                  <DiasBadge
                    variant={
                      am.status === 'ACCEPTED' || am.status === 'INCORPORATED'
                        ? 'emerald'
                        : am.status === 'REJECTED'
                        ? 'crimson'
                        : 'amber'
                    }
                    size="sm"
                  >
                    {am.status}
                  </DiasBadge>
                </div>
                {am.clauseTitle && (
                  <span className="text-xs text-[#9A9DA5] font-mono">
                    Target: {am.clauseTitle}
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-[#08090B] border border-[#1F232B] space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-[#C5A46D] block">
                  Proposed statutory wording:
                </span>
                <p className="text-xs text-[#F4F2ED] font-serif italic">
                  "{am.proposedText}"
                </p>
              </div>

              {am.rationale && (
                <p className="text-xs text-[#9A9DA5]">
                  <strong className="text-[#F4F2ED]">Rationale:</strong> {am.rationale}
                </p>
              )}

              {isChair && am.status === 'PENDING' && (
                <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-[#181B21]">
                  <DiasButton
                    variant="outline"
                    size="sm"
                    onClick={() => onPutAmendmentToVote(am)}
                    leftIcon={<Vote className="w-3.5 h-3.5" />}
                  >
                    Put Amendment to Vote
                  </DiasButton>
                  <DiasButton
                    variant="danger"
                    size="sm"
                    onClick={() => onDecideAmendment(am.id, 'REJECTED')}
                    leftIcon={<X className="w-3.5 h-3.5" />}
                  >
                    Reject
                  </DiasButton>
                  <DiasButton
                    variant="gold"
                    size="sm"
                    onClick={() => onDecideAmendment(am.id, 'ACCEPTED')}
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Accept & Incorporate
                  </DiasButton>
                </div>
              )}
            </DiasCard>
          ))}
        </div>
      )}
    </div>
  );
};

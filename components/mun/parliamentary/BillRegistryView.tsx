'use client';

import React, { useState } from 'react';
import { FileText, Plus, ChevronDown, ChevronUp, Layers, CheckCircle, ShieldCheck, Scale, ExternalLink } from 'lucide-react';
import { DiasButton } from '../dias/DiasButton';
import { DiasBadge } from '../dias/DiasBadge';
import { DiasCard } from '../dias/DiasCard';

export interface BillRegistryViewProps {
  bills: any[];
  onOpenCreateModal: () => void;
  onSelectActiveBill: (bill: any) => void;
  activeBillId?: string | null;
  onProposeAmendment: (clauseId: string, billTitle: string) => void;
  isChair?: boolean;
}

export const BillRegistryView: React.FC<BillRegistryViewProps> = ({
  bills,
  onOpenCreateModal,
  onSelectActiveBill,
  activeBillId,
  onProposeAmendment,
  isChair = true,
}) => {
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedBillId(expandedBillId === id ? null : id);
  };

  const getStageVariant = (stage: string) => {
    switch (stage) {
      case 'PASSED':
        return 'emerald';
      case 'REJECTED':
        return 'crimson';
      case 'VOTING':
      case 'AMENDMENT':
        return 'amber';
      case 'UNDER_DEBATE':
      case 'INTRODUCED':
        return 'gold';
      default:
        return 'charcoal';
    }
  };

  return (
    <div className="space-y-5 text-left select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#181B21]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#F4F2ED]">
              Parliamentary Bill Registry
            </h3>
            <DiasBadge variant="gold" size="sm">
              LEGISLATIVE
            </DiasBadge>
          </div>
          <p className="text-xs text-[#9A9DA5]">
            Statutory bills introduced in the House for clause-by-clause debate and division
          </p>
        </div>
        {isChair && (
          <DiasButton
            variant="gold"
            size="sm"
            onClick={onOpenCreateModal}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Draft New Bill
          </DiasButton>
        )}
      </div>

      {bills.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-[#232731] bg-[#111318]/50 text-center space-y-3">
          <FileText className="w-8 h-8 text-[#575B66] mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#F4F2ED]">No Bills Introduced Yet</p>
            <p className="text-xs text-[#9A9DA5] max-w-sm mx-auto">
              The Treasury Bench or recognized private members can introduce statutory legislation for debate.
            </p>
          </div>
          {isChair && (
            <DiasButton
              variant="charcoal"
              size="sm"
              onClick={onOpenCreateModal}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Draft First Bill
            </DiasButton>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {bills.map((bill) => {
            const isExpanded = expandedBillId === bill.id;
            const isActive = activeBillId === bill.id;

            return (
              <DiasCard
                key={bill.id}
                variant="elevated"
                className={`p-5 transition-all ${
                  isActive ? 'border-[#C5A46D] shadow-[0_0_20px_rgba(197,164,109,0.15)]' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#C5A46D] px-2 py-0.5 rounded bg-[#181B21] border border-[#2A2E39]">
                        {bill.billNumber}
                      </span>
                      <DiasBadge variant={getStageVariant(bill.stage)} size="sm">
                        {bill.stage.replace('_', ' ')}
                      </DiasBadge>
                      {isActive && (
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#22C55E]/20 text-[#86EFAC] border border-[#22C55E]/40 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                          ON FLOOR
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#9A9DA5]">
                      Sponsor: <strong className="text-[#F4F2ED]">{bill.sponsoringSeat}</strong>
                    </span>
                  </div>

                  <h4 className="text-base font-semibold text-[#F4F2ED] leading-snug">
                    {bill.title}
                  </h4>
                  <p className="text-xs text-[#9A9DA5] line-clamp-2 leading-relaxed">
                    {bill.objectives}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#181B21]">
                    <div className="flex items-center gap-4 text-xs text-[#9A9DA5]">
                      <span>{bill.clauses?.length || 0} Clauses</span>
                      <span>•</span>
                      <span>Ministry: {bill.ministry || 'General'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpand(bill.id)}
                        className="p-1.5 rounded-lg bg-[#181B21] text-[#9A9DA5] hover:text-[#F4F2ED] text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        {isExpanded ? (
                          <>
                            Hide Clauses <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            View Clauses <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>

                      <DiasButton
                        variant={isActive ? 'charcoal' : 'gold'}
                        size="sm"
                        onClick={() => onSelectActiveBill(bill)}
                      >
                        {isActive ? 'Active on Floor' : 'Put to Floor Debate'}
                      </DiasButton>
                    </div>
                  </div>

                  {/* Expanded Clauses View */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-[#181B21] space-y-3 animate-in fade-in">
                      <span className="text-xs font-semibold text-[#E6D1A5] uppercase tracking-wider block">
                        Statutory Clauses
                      </span>
                      <div className="space-y-2.5">
                        {(bill.clauses || []).map((clause: any) => (
                          <div
                            key={clause.id}
                            className="p-3.5 rounded-xl bg-[#08090B] border border-[#1F232B] space-y-2 text-left"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-[#F4F2ED]">
                                Clause {clause.clauseIndex}: {clause.clauseTitle}
                              </span>
                              <button
                                onClick={() => onProposeAmendment(clause.id, bill.title)}
                                className="text-[11px] font-semibold text-[#C5A46D] hover:underline"
                              >
                                + Propose Amendment
                              </button>
                            </div>
                            <p className="text-xs text-[#9A9DA5] leading-relaxed">
                              {clause.clauseBody}
                            </p>
                            {clause.amendments?.length > 0 && (
                              <div className="pt-2 border-t border-[#181B21] space-y-1">
                                <span className="text-[10px] uppercase font-mono text-[#E6D1A5]">
                                  Amendments Proposed ({clause.amendments.length}):
                                </span>
                                {clause.amendments.map((am: any) => (
                                  <div
                                    key={am.id}
                                    className="p-2 rounded-lg bg-[#111318] text-[11px] text-[#9A9DA5] flex items-center justify-between"
                                  >
                                    <span>
                                      By {am.proposedBySeat}: "{am.proposedText}"
                                    </span>
                                    <DiasBadge
                                      variant={am.status === 'ACCEPTED' ? 'emerald' : 'charcoal'}
                                      size="sm"
                                    >
                                      {am.status}
                                    </DiasBadge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DiasCard>
            );
          })}
        </div>
      )}
    </div>
  );
};

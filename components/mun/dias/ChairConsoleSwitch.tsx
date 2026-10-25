'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, ShieldCheck } from 'lucide-react';
import { useChairPermissions } from '@/hooks/useChairPermissions';

export interface ChairConsoleSwitchProps {
  sessionCode: string;
  onSwitch?: () => void;
  className?: string;
}

/**
 * Reusable authorization-aware Chair Console Switch component.
 * STRICT SECURITY LAW:
 * This button is ONLY rendered if the authenticated user holds an active,
 * authorized Chair or Secretariat assignment for this chamber.
 * Normal delegates, participants, and unassigned users will NEVER see this button.
 */
export const ChairConsoleSwitch: React.FC<ChairConsoleSwitchProps> = ({
  sessionCode,
  onSwitch,
  className = '',
}) => {
  const { canAccessChairConsole, assignedRole, isLoading } = useChairPermissions(sessionCode);

  // If loading or unauthorized, render NOTHING
  if (isLoading || !canAccessChairConsole) {
    return null;
  }

  const content = (
    <div className="flex items-center gap-1.5">
      <Gavel className="w-3.5 h-3.5 text-[#6366F1]" />
      <span className="hidden sm:inline">Switch to Chair Console</span>
      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#6366F1]/20 text-[#C7D2FE] font-bold">
        {assignedRole}
      </span>
    </div>
  );

  if (onSwitch) {
    return (
      <button
        onClick={onSwitch}
        className={`px-3 py-1.5 rounded-xl bg-[#6366F1]/15 hover:bg-[#6366F1]/25 border border-[#6366F1]/40 text-[#C7D2FE] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${className}`}
        title={`Switch to Chair Console (${assignedRole} clearance)`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={`/dias/${sessionCode}?role=chair`}>
      <button
        className={`px-3 py-1.5 rounded-xl bg-[#6366F1]/15 hover:bg-[#6366F1]/25 border border-[#6366F1]/40 text-[#C7D2FE] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${className}`}
        title={`Switch to Chair Console (${assignedRole} clearance)`}
      >
        {content}
      </button>
    </Link>
  );
};

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
      <Gavel className="w-3.5 h-3.5 text-[#C5A46D]" />
      <span className="hidden sm:inline">Switch to Chair Console</span>
      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#C5A46D]/20 text-[#E6D1A5] font-bold">
        {assignedRole}
      </span>
    </div>
  );

  if (onSwitch) {
    return (
      <button
        onClick={onSwitch}
        className={`px-3 py-1.5 rounded-xl bg-[#C5A46D]/15 hover:bg-[#C5A46D]/25 border border-[#C5A46D]/40 text-[#E6D1A5] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${className}`}
        title={`Switch to Chair Console (${assignedRole} clearance)`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link href={`/dias/${sessionCode}?role=chair`}>
      <button
        className={`px-3 py-1.5 rounded-xl bg-[#C5A46D]/15 hover:bg-[#C5A46D]/25 border border-[#C5A46D]/40 text-[#E6D1A5] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${className}`}
        title={`Switch to Chair Console (${assignedRole} clearance)`}
      >
        {content}
      </button>
    </Link>
  );
};

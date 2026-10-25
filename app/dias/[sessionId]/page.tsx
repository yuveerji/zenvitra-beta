'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { ShieldAlert, ArrowRight, Home, Lock } from 'lucide-react';
import { DiasWorkspace } from '@/components/mun/dias/DiasWorkspace';
import { DelegateWorkspace } from '@/components/mun/dias/DelegateWorkspace';
import { useChairPermissions } from '@/hooks/useChairPermissions';
import { DiasButton } from '@/components/mun/dias/DiasButton';
import { DiasBadge } from '@/components/mun/dias/DiasBadge';

function DiasSessionInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = ((params?.sessionId as string) || 'IF8RV5').toUpperCase();
  const initialRoleParam = searchParams.get('role');

  const { canAccessChairConsole, assignedRole, isLoading: isAuthLoading, reason } = useChairPermissions(sessionId);

  // If user requested chair via query param but doesn't have permission, default to delegate
  const [activeRole, setActiveRole] = useState<'chair' | 'delegate'>(() => {
    if (initialRoleParam === 'delegate') return 'delegate';
    return 'delegate'; // Default to delegate until permissions confirmed
  });

  // When auth resolves, if user specifically asked for chair and is authorized, switch to chair
  useEffect(() => {
    if (!isAuthLoading) {
      if (initialRoleParam === 'chair' && canAccessChairConsole) {
        setActiveRole('chair');
      } else if (initialRoleParam === 'chair' && !canAccessChairConsole) {
        setActiveRole('chair'); // Will trigger the access-denied shield screen
      }
    }
  }, [initialRoleParam, canAccessChairConsole, isAuthLoading]);

  const [sessionMeta, setSessionMeta] = useState({
    committeeName: 'Diplomatic Chamber',
    committeeAcronym: 'CHAMBER',
    topic: 'Chamber Deliberation & Procedure',
    isIndianCommittee: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('zenvitra_dias_active_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.committeeName) {
          setSessionMeta({
            committeeName: parsed.committeeName,
            committeeAcronym: parsed.committeeAcronym || 'CHAMBER',
            topic: parsed.topic || 'General Diplomatic Deliberation',
            isIndianCommittee: Boolean(parsed.isIndianCommittee),
          });
        }
      }
    } catch {}
  }, [sessionId]);

  // ── DELEGATE WORKSPACE ──
  if (activeRole === 'delegate') {
    return (
      <DelegateWorkspace
        sessionCode={sessionId}
        committeeName={sessionMeta.committeeName}
        committeeAcronym={sessionMeta.committeeAcronym}
        topic={sessionMeta.topic}
        isIndianCommittee={sessionMeta.isIndianCommittee}
        onSwitchToChair={() => {
          if (canAccessChairConsole) {
            setActiveRole('chair');
          }
        }}
      />
    );
  }

  // ── UNAUTHORIZED CHAIR ATTEMPT ACCESS-DENIED SHIELD ──
  if (!isAuthLoading && !canAccessChairConsole) {
    return (
      <div className="min-h-screen w-screen bg-[#08090B] text-[#F4F2ED] flex flex-col items-center justify-center p-6 text-center font-sans select-none antialiased">
        <div className="max-w-md w-full bg-[#111318] border border-[#232731] rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <DiasBadge variant="indigo" size="sm">
              CHAIR CLEARANCE REQUIRED
            </DiasBadge>
            <h1 className="text-xl font-serif text-[#F4F2ED]">
              Restricted Presiding Officer Dais
            </h1>
            <p className="text-xs text-[#9A9DA5] leading-relaxed">
              Access to the Chair Console is strictly reserved for authorized Secretariat and Chair appointments.
              {reason && <span className="block mt-1 font-mono text-amber-300/80">({reason})</span>}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#08090B] border border-[#181B21] text-left space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9A9DA5]">Target Chamber:</span>
              <span className="text-[#F4F2ED] font-semibold">{sessionMeta.committeeAcronym}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9A9DA5]">Session Passcode:</span>
              <span className="text-[#6366F1] font-mono">{sessionId}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#9A9DA5]">Your Active Role:</span>
              <span className="text-[#9A9DA5] font-mono">{assignedRole}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <DiasButton
              onClick={() => setActiveRole('delegate')}
              variant="indigo"
              size="md"
              className="w-full justify-center"
              rightIcon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Proceed to Delegate Command Centre
            </DiasButton>

            <Link href="/dias" className="w-full">
              <DiasButton variant="charcoal" size="md" className="w-full justify-center" leftIcon={<Home className="w-4 h-4" />}>
                Return to Summit Fleet
              </DiasButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTHORIZED CHAIR CONSOLE ──
  return (
    <DiasWorkspace
      sessionCode={sessionId}
      committeeName={sessionMeta.committeeName}
      committeeAcronym={sessionMeta.committeeAcronym}
      topic={sessionMeta.topic}
      isIndianCommittee={sessionMeta.isIndianCommittee}
      onSwitchToDelegate={() => setActiveRole('delegate')}
    />
  );
}

export default function DiasSessionPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#08090B] flex items-center justify-center text-[#6366F1] font-mono text-xs">
          CONNECTING TO SOVEREIGN CHAMBER...
        </div>
      }
    >
      <DiasSessionInner />
    </Suspense>
  );
}

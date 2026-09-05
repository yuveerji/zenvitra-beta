'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface EnterZenvitraButtonProps {
  className?: string;
  label?: string;
  loggedOutLabel?: string;
  loggedInLabel?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
}

export function EnterZenvitraButton({
  className = 'px-8 py-4 rounded-full bg-white text-black font-semibold text-xs hover:bg-neutral-100 transition-all duration-300 flex items-center gap-2.5 shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.35)] btn-glow',
  label,
  loggedOutLabel = 'Enter Zenvitra',
  loggedInLabel = 'Enter Platform',
  showIcon = true,
  icon
}: EnterZenvitraButtonProps) {
  const { profile, isAuthenticated, isMockMode } = useAuth();
  const [hasSavedSession, setHasSavedSession] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('zenvitra_session_user');
      if (stored) {
        setHasSavedSession(true);
      }
    } catch (_) {}
  }, []);

  const isLoggedIn = Boolean(profile || isAuthenticated || isMockMode || hasSavedSession);
  const targetHref = isLoggedIn ? '/pulse' : '/login?redirect=/pulse';
  const displayLabel = label || (isLoggedIn ? loggedInLabel : loggedOutLabel);

  return (
    <Link
      href={targetHref}
      className={`inline-flex items-center justify-center gap-2.5 select-none transition cursor-pointer ${className}`}
    >
      <span>{displayLabel}</span>
      {showIcon && (icon || <ArrowRight className="w-4 h-4 shrink-0" />)}
    </Link>
  );
}

export default EnterZenvitraButton;

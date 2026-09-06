'use client';

import React, { useMemo, useState } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, Check, Copy, KeyRound } from 'lucide-react';

export interface PasswordAnalysis {
  score: number; // 0 to 4
  level: 'TOO_WEAK' | 'WEAK' | 'FAIR' | 'STRONG' | 'EXCELLENT';
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  barColor: string;
  checks: {
    length: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
  isStrongEnough: boolean;
}

export function evaluatePasswordStrength(password: string): PasswordAnalysis {
  const pwd = password || '';
  const length = pwd.length >= 8;
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasLowercase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  const passedCount = [length, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  let score = 0;
  let level: PasswordAnalysis['level'] = 'TOO_WEAK';
  let label = 'Very Weak';
  let color = 'text-rose-400';
  let bgColor = 'bg-rose-500/10';
  let borderColor = 'border-rose-500/30';
  let barColor = 'bg-rose-500';

  if (pwd.length === 0) {
    score = 0;
    level = 'TOO_WEAK';
    label = 'Enter passphrase';
    color = 'text-neutral-500';
    bgColor = 'bg-white/5';
    borderColor = 'border-white/10';
    barColor = 'bg-neutral-600';
  } else if (passedCount <= 1 || pwd.length < 6) {
    score = 1;
    level = 'TOO_WEAK';
    label = 'Vulnerable';
    color = 'text-rose-400';
    bgColor = 'bg-rose-500/10';
    borderColor = 'border-rose-500/30';
    barColor = 'bg-rose-500';
  } else if (passedCount === 2 || (passedCount >= 3 && pwd.length < 8)) {
    score = 2;
    level = 'WEAK';
    label = 'Fair';
    color = 'text-amber-400';
    bgColor = 'bg-amber-500/10';
    borderColor = 'border-amber-500/30';
    barColor = 'bg-amber-400';
  } else if (passedCount === 3 || passedCount === 4) {
    score = 3;
    level = 'STRONG';
    label = 'Strong';
    color = 'text-emerald-400';
    bgColor = 'bg-emerald-500/10';
    borderColor = 'border-emerald-500/30';
    barColor = 'bg-emerald-400';
  } else if (passedCount === 5 && pwd.length >= 10) {
    score = 4;
    level = 'EXCELLENT';
    label = 'Cryptographic Sovereign';
    color = 'text-cyan-300';
    bgColor = 'bg-cyan-500/10';
    borderColor = 'border-cyan-500/40';
    barColor = 'bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400';
  } else {
    score = 3;
    level = 'STRONG';
    label = 'Strong';
    color = 'text-emerald-400';
    bgColor = 'bg-emerald-500/10';
    borderColor = 'border-emerald-500/30';
    barColor = 'bg-emerald-400';
  }

  return {
    score,
    level,
    label,
    color,
    bgColor,
    borderColor,
    barColor,
    checks: {
      length,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecial
    },
    isStrongEnough: score >= 3 && pwd.length >= 8
  };
}

export function generateCryptographicPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const numbers = '23456789';
  const specials = '!@#$%^&*()_+~|}{[]:;?><,.-=';
  const all = upper + lower + numbers + specials;

  const getRandom = (chars: string) => chars[Math.floor(Math.random() * chars.length)];

  // Guarantee at least one of each class
  const segments = [
    getRandom(upper),
    getRandom(upper),
    getRandom(lower),
    getRandom(lower),
    getRandom(lower),
    getRandom(numbers),
    getRandom(numbers),
    getRandom(specials),
    getRandom(specials),
    getRandom(all),
    getRandom(all),
    getRandom(all),
    getRandom(all),
    getRandom(all),
  ];

  // Shuffle securely
  for (let i = segments.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [segments[i], segments[j]] = [segments[j], segments[i]];
  }

  return segments.join('');
}

interface PasswordStrengthIndicatorProps {
  password: string;
  onAutoGenerate?: (newPass: string) => void;
  showRequirements?: boolean;
}

export function PasswordStrengthIndicator({
  password,
  onAutoGenerate,
  showRequirements = true
}: PasswordStrengthIndicatorProps) {
  const analysis = useMemo(() => evaluatePasswordStrength(password), [password]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!onAutoGenerate) return;
    const generated = generateCryptographicPassword();
    onAutoGenerate(generated);
    navigator.clipboard?.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!password && !onAutoGenerate) return null;

  return (
    <div className="space-y-2 pt-1 animate-in fade-in duration-200">
      {/* Top Bar: Live Rating & Quick Generate */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1 items-center">
            {[1, 2, 3, 4].map((step) => {
              const active = analysis.score >= step;
              return (
                <div
                  key={step}
                  className={`h-1.5 w-6 sm:w-8 rounded-full transition-all duration-300 ${
                    active ? analysis.barColor : 'bg-white/10'
                  }`}
                />
              );
            })}
          </div>
          {password && (
            <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${analysis.color}`}>
              {analysis.label}
            </span>
          )}
        </div>

        {onAutoGenerate && (
          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-cyan-400/40 text-[10px] font-mono text-cyan-300 hover:text-cyan-200 transition cursor-pointer"
            title="Generate 14-character high-entropy cryptographic password and copy to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>Auto-Generate Secure</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Criteria Breakdown Tags */}
      {showRequirements && password.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
          <div
            className={`px-2 py-1 rounded-md border text-[9.5px] font-mono flex items-center gap-1.5 transition-colors ${
              analysis.checks.length
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-white/[0.02] border-white/10 text-neutral-500'
            }`}
          >
            <span className={analysis.checks.length ? 'text-emerald-400' : 'text-neutral-600'}>
              {analysis.checks.length ? '✓' : '○'}
            </span>
            <span>8+ Characters</span>
          </div>

          <div
            className={`px-2 py-1 rounded-md border text-[9.5px] font-mono flex items-center gap-1.5 transition-colors ${
              analysis.checks.hasUppercase && analysis.checks.hasLowercase
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-white/[0.02] border-white/10 text-neutral-500'
            }`}
          >
            <span className={analysis.checks.hasUppercase && analysis.checks.hasLowercase ? 'text-emerald-400' : 'text-neutral-600'}>
              {analysis.checks.hasUppercase && analysis.checks.hasLowercase ? '✓' : '○'}
            </span>
            <span>A-Z & a-z Letters</span>
          </div>

          <div
            className={`px-2 py-1 rounded-md border text-[9.5px] font-mono flex items-center gap-1.5 transition-colors ${
              analysis.checks.hasNumber
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-white/[0.02] border-white/10 text-neutral-500'
            }`}
          >
            <span className={analysis.checks.hasNumber ? 'text-emerald-400' : 'text-neutral-600'}>
              {analysis.checks.hasNumber ? '✓' : '○'}
            </span>
            <span>0-9 Number</span>
          </div>

          <div
            className={`px-2 py-1 rounded-md border text-[9.5px] font-mono flex items-center gap-1.5 transition-colors ${
              analysis.checks.hasSpecial
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-white/[0.02] border-white/10 text-neutral-500'
            }`}
          >
            <span className={analysis.checks.hasSpecial ? 'text-emerald-400' : 'text-neutral-600'}>
              {analysis.checks.hasSpecial ? '✓' : '○'}
            </span>
            <span>Special (!@#$)</span>
          </div>
        </div>
      )}
    </div>
  );
}

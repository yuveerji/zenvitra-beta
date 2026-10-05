'use client';

import React from 'react';
import { X, Check, Sparkles, Users, Newspaper, Terminal, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SOVEREIGN_ROLE_CONFIGS, SovereignRoleType, resolveUserRole } from '@/lib/roleExperience';

interface RoleExperienceSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RoleExperienceSwitcherModal({
  isOpen,
  onClose,
}: RoleExperienceSwitcherModalProps) {
  const { profile, switchRole } = useAuth();

  if (!isOpen) return null;

  const currentRole = resolveUserRole(profile?.role);

  const selectableRoles: SovereignRoleType[] = ['delegate', 'journalist', 'architect'];

  const handleSelectRole = (role: SovereignRoleType) => {
    switchRole(role as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#090b0e] border border-white/15 p-6 shadow-2xl space-y-6 text-white overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-purple-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-white border border-white/15 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Sovereign Persona Switcher
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Experience Zenvitra through specialized diplomatic, press, or protocol lenses.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 text-neutral-400 hover:text-white hover:bg-white/15 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Options */}
        <div className="relative z-10 space-y-3">
          {selectableRoles.map((rId) => {
            const config = SOVEREIGN_ROLE_CONFIGS[rId];
            const isCurrent = currentRole === rId;
            const Icon = rId === 'delegate' ? Users : rId === 'journalist' ? Newspaper : Terminal;

            return (
              <button
                key={rId}
                type="button"
                onClick={() => handleSelectRole(rId)}
                className={`w-full p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-start justify-between gap-3 group relative overflow-hidden ${
                  isCurrent
                    ? `${config.borderClass} bg-white/[0.06] shadow-lg shadow-black/40 ring-1 ring-white/20`
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl border shrink-0 transition-transform group-hover:scale-105 ${
                    isCurrent ? config.badgeClass : 'bg-white/5 border-white/10 text-neutral-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-sans font-bold text-sm text-white">
                        {config.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-sans font-extrabold uppercase tracking-wider border ${config.badgeClass}`}>
                        {config.badge}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                      {config.tagline}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {config.capabilities.map((cap) => (
                        <span key={cap} className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-neutral-300 font-sans font-medium">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-1 shrink-0">
                  {isCurrent ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-sans font-bold bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      <Check className="w-3 h-3" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-400 font-sans group-hover:text-white flex items-center gap-1 transition">
                      <span>Switch</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="relative z-10 p-3 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-400 font-sans flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Switching your persona immediately adapts your sidebar, home directive, feed filters, and quick superpowers without logging out.</span>
        </div>

      </div>
    </div>
  );
}

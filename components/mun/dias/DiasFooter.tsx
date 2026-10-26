'use client';

import React from 'react';
import Link from 'next/link';
import { Gavel, ShieldCheck, Globe2, ArrowUpRight } from 'lucide-react';
import { useDiasTheme } from '@/context/DiasThemeContext';

export const DiasFooter: React.FC = () => {
  const { isLight } = useDiasTheme();

  return (
    <footer
      className={`border-t text-xs pt-16 pb-12 transition-colors duration-300 ${
        isLight
          ? 'bg-slate-50 border-slate-200 text-slate-600'
          : 'bg-[#050608] border-[#181B21] text-[#9A9DA5]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b ${
            isLight ? 'border-slate-200' : 'border-[#181B21]'
          }`}
        >
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  isLight
                    ? 'bg-indigo-50 border border-indigo-200 text-indigo-600'
                    : 'bg-[#111318] border border-[#6366F1]/40 text-[#6366F1]'
                }`}
              >
                <Gavel className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-bold tracking-[0.2em] uppercase ${
                    isLight ? 'text-slate-900' : 'text-[#F4F2ED]'
                  }`}
                >
                  ZENVITRA
                </span>
                <span
                  className={`text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                    isLight
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-[#6366F1]/20 text-[#C7D2FE] border border-[#6366F1]/30'
                  }`}
                >
                  DIAS
                </span>
              </div>
            </div>
            <p
              className={`text-xs max-w-sm leading-relaxed ${
                isLight ? 'text-slate-500' : 'text-[#717684]'
              }`}
            >
              The premier digital operating system for diplomatic summits, parliamentary simulations, and Model United Nations live sessions worldwide. Engineered for zero latency, real-time procedural clarity, and sovereign data integrity.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-indigo-600 pt-2">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Seeded Data Guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Globe2 className="w-3.5 h-3.5" />
                Global &amp; Indian Protocols
              </span>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="space-y-3 text-left">
            <h4
              className={`text-xs uppercase font-semibold tracking-wider ${
                isLight ? 'text-slate-900' : 'text-[#F4F2ED]'
              }`}
            >
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dias/tour"
                  className={`font-semibold transition-colors flex items-center gap-1 ${
                    isLight
                      ? 'text-indigo-600 hover:text-indigo-700'
                      : 'text-[#C7D2FE] hover:text-[#F4F2ED]'
                  }`}
                >
                  Explore Dias Tour <ArrowUpRight className="w-3 h-3 text-indigo-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/dias?dais=true"
                  className={`transition-colors flex items-center gap-1 ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Live Dias Console <ArrowUpRight className="w-3 h-3 text-neutral-500" />
                </Link>
              </li>
              <li>
                <Link
                  href="/chamber"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Chamber Floor
                </Link>
              </li>
              <li>
                <Link
                  href="/mun/matrix"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Country Matrix
                </Link>
              </li>
              <li>
                <Link
                  href="/mun/chits"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Diplomatic Chits
                </Link>
              </li>
              <li>
                <Link
                  href="/conferences"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Conferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Simulations & Presets */}
          <div className="space-y-3 text-left">
            <h4
              className={`text-xs uppercase font-semibold tracking-wider ${
                isLight ? 'text-slate-900' : 'text-[#F4F2ED]'
              }`}
            >
              Simulations
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dias/features#parliament"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Indian Parliament (Lok Sabha)
                </Link>
              </li>
              <li>
                <Link
                  href="/dias/features#un"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  UN General Assembly &amp; UNSC
                </Link>
              </li>
              <li>
                <Link
                  href="/dias/features#press"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  International Press Corps (IPC)
                </Link>
              </li>
              <li>
                <Link
                  href="/dias/features#crisis"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Cabinet &amp; Crisis Directives
                </Link>
              </li>
              <li>
                <Link
                  href="/dias/features#bills"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Legislative Bill Editor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & Legal */}
          <div className="space-y-3 text-left">
            <h4
              className={`text-xs uppercase font-semibold tracking-wider ${
                isLight ? 'text-slate-900' : 'text-[#F4F2ED]'
              }`}
            >
              Governance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Rules of Procedure (RoP)
                </Link>
              </li>
              <li>
                <Link
                  href="/minor-privacy"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  Youth &amp; Minor Safeguards
                </Link>
              </li>
              <li>
                <Link
                  href="/zen-support"
                  className={`transition-colors ${
                    isLight ? 'hover:text-slate-900 text-slate-600' : 'hover:text-[#F4F2ED]'
                  }`}
                >
                  ZEN.SUPPORT Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] ${
            isLight ? 'text-slate-500' : 'text-[#575B66]'
          }`}
        >
          <p>© {new Date().getFullYear()} ZENVITRA SOVEREIGN PLATFORMS. BY YOUTH. FOR YOUTH. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] text-indigo-600">VERSION 2.4.0 — DIPLOMATIC RUNTIME</span>
            <Link
              href="/"
              className={`transition-colors ${
                isLight ? 'hover:text-slate-900' : 'hover:text-[#F4F2ED]'
              }`}
            >
              Zenvitra Ecosystem
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

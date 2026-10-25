import React from 'react';
import Link from 'next/link';
import { Gavel, ShieldCheck, Globe2, FileText, ArrowUpRight } from 'lucide-react';

export const DiasFooter: React.FC = () => {
  return (
    <footer className="bg-[#050608] border-t border-[#181B21] text-[#9A9DA5] text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-[#181B21]">
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#111318] border border-[#6366F1]/40 flex items-center justify-center text-[#6366F1]">
                <Gavel className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-[0.2em] text-[#F4F2ED] uppercase">
                  ZENVITRA
                </span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[#6366F1]/20 text-[#C7D2FE] border border-[#6366F1]/30">
                  DIAS
                </span>
              </div>
            </div>
            <p className="text-xs text-[#717684] max-w-sm leading-relaxed">
              The premier digital operating system for diplomatic summits, parliamentary simulations, and Model United Nations live sessions worldwide. Engineered for zero latency, real-time procedural clarity, and sovereign data integrity.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-[#6366F1] pt-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Zero Seeded Data Guarantee
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5" />
                Global & Indian Protocols
              </span>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold text-[#F4F2ED] tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dias/tour" className="hover:text-[#F4F2ED] text-[#C7D2FE] font-semibold transition-colors flex items-center gap-1">
                  Explore Dias Tour <ArrowUpRight className="w-3 h-3 text-[#6366F1]" />
                </Link>
              </li>
              <li>
                <Link href="/dias?dais=true" className="hover:text-[#F4F2ED] transition-colors flex items-center gap-1">
                  Live Dias Console <ArrowUpRight className="w-3 h-3 text-[#575B66]" />
                </Link>
              </li>
              <li>
                <Link href="/chamber" className="hover:text-[#F4F2ED] transition-colors">
                  Chamber Floor
                </Link>
              </li>
              <li>
                <Link href="/mun/matrix" className="hover:text-[#F4F2ED] transition-colors">
                  Country Matrix
                </Link>
              </li>
              <li>
                <Link href="/mun/chits" className="hover:text-[#F4F2ED] transition-colors">
                  Diplomatic Chits
                </Link>
              </li>
              <li>
                <Link href="/conferences" className="hover:text-[#F4F2ED] transition-colors">
                  Conferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Simulations & Presets */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold text-[#F4F2ED] tracking-wider">
              Simulations
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dias/features#parliament" className="hover:text-[#F4F2ED] transition-colors">
                  Indian Parliament (Lok Sabha)
                </Link>
              </li>
              <li>
                <Link href="/dias/features#un" className="hover:text-[#F4F2ED] transition-colors">
                  UN General Assembly & UNSC
                </Link>
              </li>
              <li>
                <Link href="/dias/features#press" className="hover:text-[#F4F2ED] transition-colors">
                  International Press Corps (IPC)
                </Link>
              </li>
              <li>
                <Link href="/dias/features#crisis" className="hover:text-[#F4F2ED] transition-colors">
                  Cabinet & Crisis Directives
                </Link>
              </li>
              <li>
                <Link href="/dias/features#bills" className="hover:text-[#F4F2ED] transition-colors">
                  Legislative Bill Editor
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Governance & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-semibold text-[#F4F2ED] tracking-wider">
              Governance
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-[#F4F2ED] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#F4F2ED] transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="hover:text-[#F4F2ED] transition-colors">
                  Rules of Procedure (RoP)
                </Link>
              </li>
              <li>
                <Link href="/minor-privacy" className="hover:text-[#F4F2ED] transition-colors">
                  Youth & Minor Safeguards
                </Link>
              </li>
              <li>
                <Link href="/zen-support" className="hover:text-[#F4F2ED] transition-colors">
                  ZEN.SUPPORT Desk
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#575B66]">
          <p>© {new Date().getFullYear()} ZENVITRA SOVEREIGN PLATFORMS. BY YOUTH. FOR YOUTH. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] text-[#6366F1]/80">VERSION 2.4.0 — DIPLOMATIC RUNTIME</span>
            <Link href="/" className="hover:text-[#F4F2ED] transition-colors">
              Zenvitra Ecosystem
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

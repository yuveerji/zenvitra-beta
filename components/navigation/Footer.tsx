import React from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#06070a]/90 backdrop-blur-xl px-6 py-6 font-mono text-xs text-neutral-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-neutral-400" />
          <span>CRYPTOGRAPHICALLY SEALED // ZERO DATA SELLING</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/terms" className="hover:text-white transition">Terms</Link>
          <Link href="/manifesto" className="hover:text-white transition">Manifesto</Link>
        </div>
      </div>
    </footer>
  );
};
'use client';

import React, { useEffect, useState } from 'react';
import { X, Copy, Check, QrCode, RefreshCw } from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';

export function QrCodeOverlay() {
  const { session, regenerateSessionCode, showQrOverlay, setShowQrOverlay } = useZenMun();
  const [copied, setCopied] = useState(false);
  const [rotated, setRotated] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowQrOverlay(false);
    };
    if (showQrOverlay) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showQrOverlay, setShowQrOverlay]);

  if (!showQrOverlay) return null;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(session.sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    regenerateSessionCode();
    setRotated(true);
    setTimeout(() => setRotated(false), 1500);
  };

  const formattedCode = session.sessionCode.split('').join(' ');

  return (
    <div
      onClick={() => setShowQrOverlay(false)}
      className="fixed inset-0 z-[9999] bg-[#030407]/95 backdrop-blur-xl text-white flex flex-col justify-between p-8 sm:p-14 animate-fade-in cursor-pointer select-none"
    >
      {/* Top Bar with Close */}
      <div className="flex items-center justify-between w-full">
        <div className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-cyan-400">
          SESSION CODE • LIVE ROOM PROJECTION
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowQrOverlay(false);
          }}
          className="text-white/60 hover:text-white p-2 rounded-full cursor-pointer transition hover:bg-white/10"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Center Giant Code */}
      <div className="text-center my-auto py-12">
        <div className="text-[12vw] font-black font-mono tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 leading-none drop-shadow-[0_0_60px_rgba(6,182,212,0.35)]">
          {formattedCode}
        </div>
        <div className="text-sm sm:text-lg text-cyan-300 font-mono tracking-widest uppercase pt-6 opacity-90">
          Enter this 6-character code to join the dais floor
        </div>
      </div>

      {/* Bottom Block (Split Left Info / Right QR) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 pt-8 border-t border-white/10">
        <div className="space-y-2 text-left">
          <div className="text-xs uppercase tracking-widest text-neutral-400 font-mono">Join at</div>
          <div className="text-xl sm:text-3xl font-black text-white font-mono">
            zenvitra.xyz/join
          </div>
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition shadow-xl active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Code Copied!' : 'Copy Code'}</span>
            </button>
            <button
              type="button"
              onClick={handleRotate}
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition border border-white/20 active:scale-95"
              title="Generate a fresh unseeded code"
            >
              <RefreshCw className={`w-4 h-4 ${rotated ? 'animate-spin' : ''}`} />
              <span>{rotated ? 'Generated!' : 'New Code'}</span>
            </button>
          </div>
        </div>

        {/* Clean SVG QR Code */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="p-4 bg-white rounded-3xl shadow-2xl flex flex-col items-center gap-2 shrink-0 cursor-default"
        >
          <svg
            className="w-36 h-36 sm:w-44 sm:h-44"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Position Squares */}
            <rect x="5" y="5" width="25" height="25" rx="3" fill="#0c1220" />
            <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
            <rect x="13" y="13" width="9" height="9" rx="1.5" fill="#0c1220" />

            <rect x="70" y="5" width="25" height="25" rx="3" fill="#0c1220" />
            <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
            <rect x="78" y="13" width="9" height="9" rx="1.5" fill="#0c1220" />

            <rect x="5" y="70" width="25" height="25" rx="3" fill="#0c1220" />
            <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
            <rect x="13" y="78" width="9" height="9" rx="1.5" fill="#0c1220" />

            {/* Stylized QR Matrix Pattern */}
            <rect x="36" y="8" width="6" height="6" fill="#0c1220" />
            <rect x="46" y="8" width="6" height="6" fill="#0c1220" />
            <rect x="56" y="8" width="6" height="6" fill="#0c1220" />

            <rect x="36" y="18" width="6" height="6" fill="#0c1220" />
            <rect x="50" y="18" width="12" height="6" fill="#0c1220" />

            <rect x="8" y="36" width="6" height="6" fill="#0c1220" />
            <rect x="18" y="36" width="6" height="6" fill="#0c1220" />
            <rect x="28" y="36" width="6" height="6" fill="#0c1220" />
            <rect x="38" y="36" width="8" height="8" rx="2" fill="#06b6d4" />
            <rect x="52" y="36" width="6" height="6" fill="#0c1220" />
            <rect x="64" y="36" width="6" height="6" fill="#0c1220" />
            <rect x="76" y="36" width="6" height="6" fill="#0c1220" />
            <rect x="86" y="36" width="6" height="6" fill="#0c1220" />

            <rect x="8" y="48" width="12" height="6" fill="#0c1220" />
            <rect x="26" y="48" width="6" height="6" fill="#0c1220" />
            <rect x="38" y="48" width="6" height="6" fill="#0c1220" />
            <rect x="50" y="48" width="8" height="8" rx="2" fill="#06b6d4" />
            <rect x="66" y="48" width="10" height="6" fill="#0c1220" />
            <rect x="82" y="48" width="10" height="6" fill="#0c1220" />

            <rect x="8" y="60" width="6" height="6" fill="#0c1220" />
            <rect x="20" y="60" width="10" height="6" fill="#0c1220" />
            <rect x="36" y="60" width="6" height="6" fill="#0c1220" />
            <rect x="46" y="60" width="14" height="6" fill="#0c1220" />
            <rect x="66" y="60" width="6" height="6" fill="#0c1220" />
            <rect x="78" y="60" width="14" height="6" fill="#0c1220" />

            <rect x="36" y="74" width="8" height="6" fill="#0c1220" />
            <rect x="48" y="74" width="6" height="6" fill="#0c1220" />
            <rect x="60" y="74" width="8" height="6" fill="#0c1220" />
            <rect x="74" y="74" width="6" height="6" fill="#0c1220" />
            <rect x="86" y="74" width="6" height="6" fill="#0c1220" />

            <rect x="36" y="86" width="14" height="6" fill="#0c1220" />
            <rect x="56" y="86" width="6" height="6" fill="#0c1220" />
            <rect x="68" y="86" width="14" height="6" fill="#0c1220" />
            <rect x="88" y="86" width="6" height="6" fill="#0c1220" />
          </svg>
          <span className="text-[10px] font-mono font-bold text-neutral-800 uppercase tracking-wider">
            Scan to Join
          </span>
        </div>
      </div>

      <div className="text-center text-[11px] font-mono text-neutral-400 pt-4">
        Click anywhere or press Escape to close
      </div>
    </div>
  );
}

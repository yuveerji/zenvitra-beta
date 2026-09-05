'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface LegalGateModalProps {
  isOpen: boolean;
  type: 'PRIVACY' | 'TOS';
  onComplete: () => void;
}

export function LegalGateModal({ isOpen, type, onComplete }: LegalGateModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  // Reset verification whenever the document type changes
  useEffect(() => {
    setHasScrolledToBottom(false);
  }, [type]);

  // Check if content is already fully visible without needing to scroll
  const checkInitialVisibility = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight + 10) {
      setHasScrolledToBottom(true);
    }
  }, []);

  // IntersectionObserver: Triggers when the bottom sentinel enters viewport
  useEffect(() => {
    if (!isOpen) return;

    checkInitialVisibility();

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasScrolledToBottom(true);
        }
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
      }
    );

    const sentinel = bottomSentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) observer.unobserve(sentinel);
      observer.disconnect();
    };
  }, [isOpen, type, checkInitialVisibility]);

  // Fallback onScroll handler with generous tolerance
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    if (scrollHeight - scrollTop - clientHeight <= 60) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-2xl w-full bg-[#07080b] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
              {type === 'PRIVACY' ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-sans text-lg text-white font-semibold">
                {type === 'PRIVACY' ? 'Sovereign Privacy Charter' : 'Platform Terms of Service'}
              </h3>
              <p className="font-mono text-[11px] text-neutral-400">
                Scroll to the bottom of the document to unlock confirmation
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-amber-300 border border-white/5 uppercase tracking-widest">
            Step Gate
          </span>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-300 leading-relaxed font-sans border-b border-white/5 relative"
        >
          {type === 'PRIVACY' ? (
            <>
              <p className="font-mono text-amber-300 uppercase tracking-widest">
                [ZENVITRA PROTOCOL: ZERO SURVEILLANCE INVARIANT]
              </p>
              <p>
                Zenvitra operates strictly on a non-surveillance foundation. We do not track cross-site behavioral telemetry, sell demographic packets to third-party ad networks, or execute rage-inducing algorithmic weighting across your feed.
              </p>
              <p>
                All personal peer-to-peer transmissions across ZEN.CHAT utilize client-side ECDH key-pairs (Curve P-256) combined with symmetric AES-256-GCM ciphers. Private decryption keys reside entirely on your client device.
              </p>
              <p>
                Contributions to the Public Impact Ledger are verified transparently to support open-source Linux computer installations across schools while preserving individual anonymity where requested.
              </p>
              <p>
                Every user is granted sovereign data ownership. You reserve the absolute right to export, prune, or completely wipe your cryptographic identity node at any point in time without retention penalties.
              </p>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400">
                End of Privacy Charter. By clicking acknowledge, you confirm understanding of our cryptographic privacy standards.
              </div>
            </>
          ) : (
            <>
              <p className="font-mono text-amber-300 uppercase tracking-widest">
                [ZENVITRA PROTOCOL: DELEGATE CODE &amp; TERMS]
              </p>
              <p>
                By claiming a verified node identity on Zenvitra, you commit to high-signal intellectual engagement, youth diplomacy, and constructive discourse across open discussions and summits.
              </p>
              <p>
                Organizers utilizing ZEN.EVENTS and ZEN.BOOK retain complete ownership of their event intellectual property, delegate lists, and custom registration configurations.
              </p>
              <p>
                Slander, automated spam scraping, coordinate spoofing, and malicious intrusion into closed committee rooms will lead to immediate node revocation without appeal.
              </p>
              <p>
                Civic contributions and charitable allocations operate under a zero-kickback invariant to protect public trust.
              </p>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400">
                End of Terms of Service. Acknowledging unlocks full access to ZEN.PULSE, ZEN.EVENTS, and ZEN.PRESS.
              </div>
            </>
          )}

          {/* Sentinel Element Target */}
          <div ref={bottomSentinelRef} className="h-4 w-full pointer-events-none" />
        </div>

        {/* Modal Footer */}
        <div className="p-6 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            {hasScrolledToBottom ? (
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Fully Reviewed
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-500">
                <AlertCircle className="w-4 h-4" /> Scroll down to unlock button
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={!hasScrolledToBottom}
            onClick={onComplete}
            className="px-6 py-2.5 rounded-full bg-white text-black font-mono text-xs font-semibold hover:bg-neutral-200 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-lg cursor-pointer"
          >
            Acknowledge &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
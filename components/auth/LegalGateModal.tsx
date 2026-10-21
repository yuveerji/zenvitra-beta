'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Scale, X, ExternalLink } from 'lucide-react';

interface LegalGateModalProps {
  isOpen: boolean;
  type: 'PRIVACY' | 'TOS' | 'CONSTITUTION';
  onComplete: () => void;
  onClose?: () => void;
  isMinor?: boolean;
}

export function LegalGateModal({ isOpen, type, onComplete, onClose, isMinor }: LegalGateModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);

  // Reset verification whenever the document type changes
  useEffect(() => {
    setHasScrolledToBottom(false);
  }, [type, isMinor]);

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
  }, [isOpen, type, isMinor, checkInitialVisibility]);

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
      <div className="max-w-2xl w-full bg-[#07080b] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col max-h-[85vh] shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isMinor 
                ? 'bg-amber-400/10 border border-amber-400/20 text-amber-300' 
                : 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-300'
            }`}>
              {type === 'PRIVACY' ? (
                <ShieldCheck className="w-5 h-5" />
              ) : type === 'TOS' ? (
                <FileText className="w-5 h-5" />
              ) : (
                <Scale className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-sans text-lg text-white font-semibold flex items-center gap-2">
                {type === 'PRIVACY' 
                  ? (isMinor ? 'Under-18 Privacy & Parental Consent Policy' : 'Sovereign Privacy Charter') 
                  : type === 'TOS'
                  ? (isMinor ? 'Minor Terms of Service & Parental Consent Accord' : 'Platform Terms of Service')
                  : 'ZENVITRA Sovereign Youth Constitution'}
              </h3>
              <p className="font-mono text-[11px] text-neutral-400">
                {type === 'CONSTITUTION'
                  ? 'Guiding charter for democratic youth assembly, high-signal diplomacy, and ethical participation.'
                  : isMinor 
                  ? 'Dedicated Under-18 safeguards under DPDP Act, 2023. Scroll to unlock.' 
                  : 'Scroll to the bottom of the document to unlock confirmation.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest border ${
              isMinor 
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' 
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
            }`}>
              {type === 'CONSTITUTION' ? 'Youth Accord' : isMinor ? 'Under-18 Gate' : 'Step Gate'}
            </span>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-300 leading-relaxed font-sans border-b border-white/5 relative"
        >
          {type === 'PRIVACY' ? (
            isMinor ? (
              <>
                <p className="font-mono text-amber-300 uppercase tracking-widest">
                  [ZENVITRA PROTOCOL: UNDER-18 DPDP 2023 SAFEGUARDS]
                </p>
                <p>
                  In accordance with India&apos;s Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025, ZENVITRA provides special statutory protections for all delegates, debaters, and citizens under 18 years of age.
                </p>
                <p>
                  <strong>Zero Targeted Ads &amp; Zero Behavioural Tracking:</strong> We never track behavioural movements across the platform to serve targeted advertisements. Children are never commodified or profiled for marketing purposes.
                </p>
                <p>
                  <strong>Protected Coordinates:</strong> Private telephone numbers, email addresses, residential coordinates, and parent contacts are strictly shielded from public directories, search engine indexing, and third-party brokers.
                </p>
                <p>
                  <strong>Verifiable Guardian Consent:</strong> Parents or lawful guardians must verify consent for minor account creation and event registrations. Parents retain the unconditional right to review, update, or cryptographically erase their child&apos;s data at any time.
                </p>
                <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-400/20 text-neutral-300 space-y-2">
                  <div className="text-amber-300 font-bold font-mono text-[11px]">DPDP Redressal Desk</div>
                  <div>
                    For parental rights, consent verification, or grievance redressal, contact <a href="mailto:privacy@zenvitra.xyz" className="text-white underline">privacy@zenvitra.xyz</a>.
                  </div>
                  <div>
                    <a
                      href="/minor-privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-amber-300 underline font-mono text-[11px] hover:text-white"
                    >
                      <span>Read Complete 6-Part Minor Privacy Policy (Opens in new tab)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="font-mono text-cyan-300 uppercase tracking-widest">
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
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400 space-y-1">
                  <div>End of Privacy Charter. By clicking acknowledge, you confirm understanding of our cryptographic privacy standards.</div>
                  <div>
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-300 underline font-mono text-[11px] hover:text-white"
                    >
                      <span>Read Complete 22-Part Standard Privacy Policy (Opens in new tab)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            )
          ) : type === 'TOS' ? (
            isMinor ? (
              <>
                <p className="font-mono text-amber-300 uppercase tracking-widest">
                  [ZENVITRA PROTOCOL: MINOR CIVIC ACCORD &amp; TERMS]
                </p>
                <p>
                  <strong>Age Accuracy &amp; Sovereign Representation:</strong> You confirm that the age coordinates you provide are truthful. Falsifying your age or bypassing guardian authorization is strictly prohibited.
                </p>
                <p>
                  <strong>Parental / Guardian Sponsoring:</strong> In compliance with Indian contract law and statutory youth protections, users under 18 participate under the awareness and consent of their parent or lawful guardian.
                </p>
                <p>
                  <strong>Diplomatic Decorum &amp; Mutual Respect:</strong> All participants, regardless of age, have the sovereign right to debate fearlessly, express viewpoints, and challenge orthodoxies. Harassment, abuse, coordinate doxxing, or malicious intrusion will result in immediate suspension.
                </p>
                <p>
                  <strong>Statutory Supremacy:</strong> No clause in these terms supersedes or reduces any statutory rights granted to minors and guardians under mandatory national laws.
                </p>
                <div className="p-4 rounded-xl bg-amber-500/[0.05] border border-amber-400/20 text-neutral-300 space-y-2">
                  <div className="text-amber-300 font-bold font-mono text-[11px]">Minor Support Desk</div>
                  <div>
                    Secretariat &amp; Parental Liaison: <a href="mailto:support@zenvitra.xyz" className="text-white underline">support@zenvitra.xyz</a>.
                  </div>
                  <div>
                    <a
                      href="/minor-terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-amber-300 underline font-mono text-[11px] hover:text-white"
                    >
                      <span>Read Complete 8-Section Minor Terms of Service (Opens in new tab)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="font-mono text-cyan-300 uppercase tracking-widest">
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
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400 space-y-1">
                  <div>End of Terms of Service. Acknowledging unlocks full access to ZEN.PULSE, ZEN.EVENTS, and ZEN.PRESS.</div>
                  <div>
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-cyan-300 underline font-mono text-[11px] hover:text-white"
                    >
                      <span>Read Complete 46-Section Standard Terms of Service (Opens in new tab)</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </>
            )
          ) : (
            /* CONSTITUTION */
            <>
              <p className="font-mono text-cyan-300 uppercase tracking-widest">
                [ZENVITRA SOVEREIGN YOUTH CONSTITUTION — FUNDAMENTAL CANONS]
              </p>
              <p>
                <strong>Article I — Sovereign Freedom of Expression:</strong> Every student, delegate, and youth thinker retains the inalienable right to intellectual exploration, diplomatic dissent, and creative discourse without fear of partisan retribution.
              </p>
              <p>
                <strong>Article II — High-Signal Civic Decorum:</strong> Civil discourse demands rigorous argumentation over ad-hominem attacks. Defamation, coordinated harassment, hate speech, and bad-faith manipulation violate the sovereign covenant and warrant immediate node revocation.
              </p>
              <p>
                <strong>Article III — Youth Democracy &amp; Bill Voting:</strong> Every verified youth citizen holds equal franchise in platform plebiscites, bill ratifications, motion debates, and consensus governance across the /vote and /mun assemblies.
              </p>
              <p>
                <strong>Article IV — Anti-Doxxing &amp; Identity Sovereignty:</strong> No member&apos;s real-world private coordinates, physical residence, school registry, or family telephone numbers may be published, disclosed, or extorted. Identity sovereignty is protected by end-to-end client cryptographic principles.
              </p>
              <p>
                <strong>Article V — 10% Public School Computing Aid:</strong> ZENVITRA operates an unalterable civic tithe: at least 10% of revenue is dedicated to installing open-source computer workstations in underprivileged schools, verified on an open public ledger.
              </p>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-400 space-y-2">
                <div>By acknowledging the Constitution, you bind your node to these democratic, high-signal principles.</div>
                <div>
                  <a
                    href="/constitution"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-300 underline font-mono text-[11px] hover:text-white"
                  >
                    <span>Read Full 7-Article Sovereign Youth Constitution (Opens in new tab)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
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

          <div className="flex items-center gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-white/5 text-neutral-300 hover:text-white font-mono text-xs hover:bg-white/10 transition cursor-pointer"
              >
                Close
              </button>
            )}
            <button
              type="button"
              disabled={!hasScrolledToBottom}
              onClick={onComplete}
              className={`px-6 py-2.5 rounded-full font-mono text-xs font-semibold transition disabled:opacity-30 disabled:cursor-not-allowed shadow-lg cursor-pointer ${
                isMinor 
                  ? 'bg-amber-400 text-black hover:bg-amber-300' 
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              Acknowledge Accord &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

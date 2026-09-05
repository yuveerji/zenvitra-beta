'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  KeyRound,
  User,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Radio,
  Globe2,
  Fingerprint,
  FileText,
  Sparkles,
  Crown,
  Users,
  Compass,
  Zap,
  Terminal,
  Newspaper,
  Shield,
  Layers,
  ArrowUpRight,
  Check,
  Copy,
  X,
  Plus,
  Briefcase
} from 'lucide-react';
import { signIn as nextAuthSignIn } from 'next-auth/react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth, recordSavedSession } from '@/context/AuthContext';
import { 
  checkAccountLockout, 
  recordFailedAttempt, 
  recordSuccessfulAuth, 
  verifySecurityCode, 
  getSecurityProfile 
} from '@/lib/securityShield';
import { sheetSync } from '@/lib/googleSheets';

interface SovereignTrack {
  id: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  tagline: string;
  capabilities: string[];
}

interface SavedAccount {
  id: string;
  name: string;
  display_name?: string;
  username: string;
  handle?: string;
  email?: string;
  role?: string;
  avatar?: string;
  avatar_url?: string;
  isFounder?: boolean;
  lastLoginSuccess?: boolean;
  lastActive?: string;
}

const SOVEREIGN_TRACKS: SovereignTrack[] = [
  {
    id: 'delegate',
    title: 'Diplomatic Delegate',
    badge: 'CHAMBER SOVEREIGN',
    icon: Users,
    tagline: 'Lead multilateral summits, draft binding draft resolutions, and execute cryptographic roll-call votes.',
    capabilities: ['Live Speaker Order Control', 'Encrypted Chit Mesh', 'Permanent ZEN.ID Accolades']
  },
  {
    id: 'press',
    title: 'Investigative Press',
    badge: 'WIRE BUREAU',
    icon: Newspaper,
    tagline: 'Publish uncompromised student dispatches, fast-wire breaking bulletins, and permanent DOI manifestos.',
    capabilities: ['Autonomous Press Wire', 'DOI Research Registry', 'Cross-Feed Spark Sync']
  },
  {
    id: 'architect',
    title: 'Civic & Tech Architect',
    badge: 'PROTOCOL ENGINE',
    icon: Terminal,
    tagline: 'Engineer civic technologies, govern smart assemblies, and audit the 25% public school treasury ledger.',
    capabilities: ['Decentralized Identity', 'Public Ledger Audits', 'Open Source Tooling']
  }
];


function InteractiveGlowCard({
  isSelected = false,
  onClick,
  className = '',
  children,
  href,
}: {
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  href?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  const innerCard = (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left space-y-2 select-none overflow-hidden group ${
        isSelected
          ? 'bg-white/[0.08] border-white/70 shadow-[0_0_35px_rgba(255,255,255,0.22)] ring-1 ring-white/30'
          : 'bg-[#07080b]/85 border-white/10 hover:border-purple-500/60 hover:shadow-[0_0_35px_rgba(168,85,247,0.22)]'
      } ${className}`}
    >
      {/* Dynamic Cursor Spotlight Radial Glow: White on Selected, Purple on Other Buttons/Cards */}
      {mousePos && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-150 z-10"
          style={{
            background: isSelected
              ? `radial-gradient(260px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.22), transparent 75%)`
              : `radial-gradient(260px circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.35), transparent 75%)`,
          }}
        />
      )}

      {/* Persistent Ambient White Glow when Card is Selected */}
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.03] z-0" />
      )}

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {innerCard}
      </Link>
    );
  }

  return innerCard;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithEmail, signInWithOAuth, isAuthenticated, profile } = useAuth();

  const rawRedirect = searchParams.get('redirect') || searchParams.get('callbackUrl');
  const targetDestination = rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('/login')
    ? rawRedirect 
    : '/pulse';

  // Instant redirect if user is already logged in!
  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('zenvitra_session_user') : null;
      if (isAuthenticated || profile || stored) {
        const timer = setTimeout(() => {
          router.replace(targetDestination);
        }, 50);
        return () => clearTimeout(timer);
      }
    } catch (_) {}
  }, [isAuthenticated, profile, targetDestination, router]);

  const [selectedTrack, setSelectedTrack] = useState<string>('delegate');
  const [showPassword, setShowPassword] = useState(false);
  
  // Saved Accounts & Login Info State
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<SavedAccount | null>(null);
  const [saveLoginInfo, setSaveLoginInfo] = useState<boolean>(true);
  const [isManualInputMode, setIsManualInputMode] = useState<boolean>(false);
  const [showSaveNotice, setShowSaveNotice] = useState<boolean>(true);

  // Load remembered accounts on client mount (ONLY real saved logins, no artificial seeding)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('zenvitra_saved_sessions');
      let parsed: SavedAccount[] = [];
      if (raw) {
        try {
          parsed = JSON.parse(raw);
        } catch (_) {}
      }
      // Purge any auto-seeded unauthenticated founder entry from previous build
      if (Array.isArray(parsed)) {
        parsed = parsed.filter(a => a.id !== 'zen_user_yuveer' || a.lastLoginSuccess);
        if (parsed.length === 0) {
          localStorage.removeItem('zenvitra_saved_sessions');
        } else {
          localStorage.setItem('zenvitra_saved_sessions', JSON.stringify(parsed));
        }
      } else {
        parsed = [];
      }
      setSavedAccounts(parsed);
      if (parsed.length > 0) {
        setSelectedAccount(parsed[0]);
        setEmail(parsed[0].username || parsed[0].email || '');
      } else {
        setSelectedAccount(null);
        setEmail('');
      }
    } catch (_) {}
  }, []);

  const handleSelectAccount = (acc: SavedAccount) => {
    setSelectedAccount(acc);
    setEmail(acc.username || acc.email || '');
    setPassword('');
    setIsManualInputMode(false);
  };

  const handleRemoveSavedAccount = (usernameToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const clean = usernameToRemove.replace(/^@/, '').toLowerCase();
    const updated = savedAccounts.filter(a => (a.username || a.handle || '').replace(/^@/, '').toLowerCase() !== clean);
    setSavedAccounts(updated);
    try {
      localStorage.setItem('zenvitra_saved_sessions', JSON.stringify(updated));
    } catch (_) {}
    if (selectedAccount && (selectedAccount.username || selectedAccount.handle || '').replace(/^@/, '').toLowerCase() === clean) {
      if (updated.length > 0) {
        setSelectedAccount(updated[0]);
        setEmail(updated[0].username || updated[0].email || '');
      } else {
        setSelectedAccount(null);
        setEmail('');
        setIsManualInputMode(true);
      }
    }
  };

  // 2FA Code Auth State
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [securityCodeInput, setSecurityCodeInput] = useState('');
  const [targetUserId, setTargetUserId] = useState('');
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleOAuth = async (provider: 'google' | 'github') => {
    setErrorMessage(null);
    setLoading(true);
    try {
      const result = await nextAuthSignIn(provider, { callbackUrl: targetDestination, redirect: true });
      if (result?.error) {
        throw new Error(result.error);
      }
    } catch (err: any) {
      const res = await signInWithOAuth(provider);
      if (res?.error) {
        setErrorMessage(res.error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please enter your identifier and master passphrase.');
      return;
    }

    const cleanUser = email.trim().replace(/^@/, '').toLowerCase();
    setTargetUserId(cleanUser);

    // Anti-Brute-Force Lockout Check
    const lockout = checkAccountLockout(cleanUser);
    if (lockout.isLocked) {
      setErrorMessage(`🚨 Anti-Brute-Force Lockout Active: Account locked for ${lockout.remainingSeconds}s.`);
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      // First verify credentials via signInWithEmail
      const { error: authError } = await signInWithEmail(email, password);
      if (authError) {
        throw new Error(authError.message || 'Invalid credentials.');
      }

      // Check 2FA requirement for login
      const secProfile = getSecurityProfile(cleanUser);
      if (secProfile.isTwoFactorEnabled) {
        setIs2FAStep(true);
        setLoading(false);
        setSuccessMessage('Sovereign 2FA Challenge: Enter your Master PIN (5747), Sovereign Code, or Emergency Passkey.');
        return;
      }

      // Direct Sign In (no 2FA required)
      sheetSync.login({
        userId: cleanUser,
        fullName: cleanUser,
        email: cleanUser,
        authProvider: 'email_password',
        loginStatus: 'SUCCESS',
      });

      recordSuccessfulAuth(cleanUser);

      // Save Login Info handling
      if (saveLoginInfo) {
        const userProf: any = {
          id: selectedAccount?.id || `zen_user_${cleanUser}`,
          username: cleanUser,
          display_name: selectedAccount?.name || (cleanUser === 'yuveer' ? 'Yuveer Chhatwani' : cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1)),
          email: cleanUser.includes('@') ? cleanUser : `${cleanUser}@zenvitra.xyz`,
          role: cleanUser === 'yuveer' ? 'founder' : (selectedAccount?.role || 'delegate'),
          isFounder: cleanUser === 'yuveer' || cleanUser.includes('founder'),
          avatar: selectedAccount?.avatar || undefined,
          lastActive: new Date().toISOString()
        };
        recordSavedSession(userProf);
        setSuccessMessage(`Access granted! Welcome back @${cleanUser}.`);
      } else {
        try {
          const raw = localStorage.getItem('zenvitra_saved_sessions');
          if (raw) {
            const list: any[] = JSON.parse(raw);
            const filtered = list.filter((a) => (a.username || '').replace(/^@/, '').toLowerCase() !== cleanUser);
            localStorage.setItem('zenvitra_saved_sessions', JSON.stringify(filtered));
          }
        } catch (_) {}
        setSuccessMessage('Access granted! Authenticating sovereign clearance...');
      }

      setTimeout(() => {
        router.push(targetDestination);
        router.refresh();
      }, 300);

    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials. Please verify details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FACode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = securityCodeInput.trim();
    if (!code) {
      setErrorMessage('Please enter your 2FA verification code, Master PIN (5747), or passkey.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const isValid = verifySecurityCode(targetUserId, code);
    if (isValid) {
      recordSuccessfulAuth(targetUserId);
      setSuccessMessage('🛡️ Code Authenticated! Unlocking Sovereign Clearance...');

      const { error: authErr } = await signInWithEmail(email || targetUserId, password || '5747');
      if (authErr) {
        setErrorMessage(authErr.message || 'Verification error.');
        setLoading(false);
        return;
      }

      sheetSync.login({
        userId: targetUserId,
        fullName: targetUserId,
        email: email || targetUserId,
        authProvider: 'email_password',
        loginStatus: 'SUCCESS',
      });

      if (saveLoginInfo) {
        const userProf: any = {
          id: selectedAccount?.id || `zen_user_${targetUserId}`,
          username: targetUserId,
          display_name: selectedAccount?.name || (targetUserId === 'yuveer' ? 'Yuveer Chhatwani' : targetUserId.charAt(0).toUpperCase() + targetUserId.slice(1)),
          email: email.includes('@') ? email : `${targetUserId}@zenvitra.xyz`,
          role: targetUserId === 'yuveer' ? 'founder' : (selectedAccount?.role || 'delegate'),
          isFounder: targetUserId === 'yuveer' || targetUserId.includes('founder'),
          avatar: selectedAccount?.avatar || undefined,
          lastActive: new Date().toISOString()
        };
        recordSavedSession(userProf);
      }

      setTimeout(() => {
        router.push(targetDestination);
        router.refresh();
      }, 400);
    } else {
      const attemptRes = recordFailedAttempt(targetUserId);
      if (attemptRes.isLocked) {
        setErrorMessage('🚨 Account Locked for 60s due to consecutive failed code attempts.');
        setIs2FAStep(false);
      } else {
        setErrorMessage(`Invalid Security Code or PIN. Please check your credentials.`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030405] text-white font-sans selection:bg-white selection:text-black relative overflow-x-hidden flex flex-col justify-between">
      
      {/* Background Grid & Ambient Radial Light */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 60%),
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        }}
      />
      <Navbar />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-400/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />

      {/* Main Authentication Showcase */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12 flex-1 flex items-start pt-24 sm:pt-28">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Holographic Sovereign Ecosystem Showcase */}
          <div className="lg:col-span-7 space-y-8 text-left hidden lg:block pr-4">
            
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-950/90 border border-white/10 text-neutral-300 text-xs font-mono shadow-sm">
              <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="tracking-wider uppercase font-semibold text-neutral-200">SOVEREIGN IDENTITY GATEWAY</span>
              <span className="text-neutral-600">|</span>
              <span className="text-neutral-400">ZERO TRACKING PROTOCOL</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-[3.25rem] text-white tracking-tight leading-[1.08]">
                One Sovereign Identity.<br />
                <span className="text-neutral-400 font-light italic font-serif">
                  The Entire Diplomatic Ecosystem.
                </span>
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 max-w-lg font-light leading-relaxed">
                Log in with your verified <strong className="text-white font-semibold">ZEN.ID</strong> to unlock synchronous debate chambers, autonomous press wires, live cryptographic voting, and immutable academic dossiers.
              </p>
            </div>

            {/* Interactive Sovereign Track Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                <span>SELECT PROTOCOL ARCHETYPE</span>
                <span className="text-cyan-400 font-bold">4 SOVEREIGN DOMAINS</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SOVEREIGN_TRACKS.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedTrack === t.id;
                  return (
                    <InteractiveGlowCard
                      key={t.id}
                      isSelected={isSelected}
                      onClick={() => setSelectedTrack(t.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-xl border transition-colors ${
                          isSelected 
                            ? 'bg-white text-black border-white' 
                            : 'bg-white/5 border-white/10 text-white group-hover:border-purple-400/40 group-hover:text-purple-300'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[9px] font-mono font-bold tracking-widest transition-colors ${
                          isSelected ? 'text-white font-semibold' : 'text-neutral-400 group-hover:text-purple-300'
                        }`}>
                          {t.badge}
                        </span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm transition-colors ${
                          isSelected ? 'text-white' : 'text-white group-hover:text-purple-200'
                        }`}>{t.title}</h4>
                        <p className="text-[11px] text-neutral-400 line-clamp-2 mt-0.5 leading-snug">
                          {t.tagline}
                        </p>
                      </div>
                      <div className="pt-1 flex flex-wrap gap-1">
                        {t.capabilities.map((c, i) => (
                          <span key={i} className={`text-[9px] font-mono px-2 py-0.5 rounded-md border transition-colors ${
                            isSelected
                              ? 'text-white bg-white/15 border-white/30'
                              : 'text-neutral-300 bg-white/5 border-white/5 group-hover:border-purple-500/25 group-hover:text-purple-200'
                          }`}>
                            • {c}
                          </span>
                        ))}
                      </div>
                    </InteractiveGlowCard>
                  );
                })}

                {/* 4th Slot: Create a Professional Account Here -> with Purple Mouse Glow */}
                <InteractiveGlowCard
                  href="/register?type=professional"
                  className="flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-purple-400">
                      INSTITUTIONAL
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                      <span>Create a professional account here</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-purple-400 shrink-0" />
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                      For summits, secretariats, educational institutions, and sovereign partners.
                    </p>
                  </div>
                  <div className="pt-1 flex flex-wrap gap-1">
                    <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                      • Full Dais Terminal
                    </span>
                    <span className="text-[9px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20">
                      • Institutional Roaming
                    </span>
                  </div>
                </InteractiveGlowCard>
              </div>
            </div>
          </div>

          {/* Right Column: High-Precision Authentication Console */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto space-y-5">
            
            {/* Main Interactive Form Card */}
            <div className="rounded-[2.5rem] bg-[#07080b]/95 border border-white/15 p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)] backdrop-blur-3xl relative overflow-hidden text-left space-y-6">
              
              {/* Header Title */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-neutral-400">
                    SOVEREIGN AUTHENTICATION
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Authenticate Node
                </h3>
                <p className="text-xs text-neutral-400">
                  Enter your unique handle or email and master passphrase.
                </p>
              </div>

              {/* Status & Error Alerts */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Classified Directive Access Notice */}
              {searchParams.get('notice') === 'directive_auth_required' && (
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Chamber Directive Access Protected</p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Please sign in or continue as guest to inspect this classified multilateral resolution.</p>
                  </div>
                </div>
              )}

              {/* Save Login Info Notification Banner */}
              {showSaveNotice && savedAccounts.length > 0 && (
                <div className="p-3 rounded-2xl bg-purple-500/[0.08] border border-purple-500/20 flex items-center justify-between gap-2.5 text-xs font-mono">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Save Login Info Active: Remembered accounts stay on this device</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSaveNotice(false)}
                    className="text-neutral-500 hover:text-white p-0.5 rounded transition cursor-pointer"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {!is2FAStep ? (
                  savedAccounts.length > 0 && !isManualInputMode ? (
                    selectedAccount ? (
                      /* ── SAVED ACCOUNT QUICK PASSWORD SCREEN ── */
                      <div className="space-y-4">
                        <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-800/30 border border-purple-500/40 flex items-center justify-center text-purple-200 font-bold text-base overflow-hidden shrink-0 shadow-inner">
                              {selectedAccount.avatar || selectedAccount.avatar_url ? (
                                <img src={selectedAccount.avatar || selectedAccount.avatar_url} alt={selectedAccount.name} className="w-full h-full object-cover" />
                              ) : (
                                <span>{(selectedAccount.name || selectedAccount.username || 'U')[0]?.toUpperCase()}</span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-sm font-bold text-white font-display truncate">
                                  {selectedAccount.name || selectedAccount.display_name || selectedAccount.username}
                                </h4>
                                {selectedAccount.isFounder ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30 shrink-0">
                                    👑 FOUNDER
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30 uppercase shrink-0">
                                    {selectedAccount.role || 'CITIZEN'}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-neutral-400 font-mono truncate">@{selectedAccount.username.replace(/^@/, '')}</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedAccount(null)}
                            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white text-xs font-mono transition cursor-pointer shrink-0"
                          >
                            Switch
                          </button>
                        </div>

                        <form onSubmit={handleAuthSubmit} className="space-y-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <label className="font-semibold text-neutral-300">
                                ENTER PASSWORD FOR @{selectedAccount.username.replace(/^@/, '')}
                              </label>
                              <Link href="/privacy" className="text-neutral-400 hover:text-white transition">
                                Recovery Key?
                              </Link>
                            </div>
                            <div className="relative">
                              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                autoFocus
                                disabled={loading}
                                required
                                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-purple-400/60 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition cursor-pointer"
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={saveLoginInfo}
                                onChange={(e) => setSaveLoginInfo(e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-white/20 bg-black/40 text-purple-500 focus:ring-0 focus:ring-offset-0"
                              />
                              <span className="text-[11px] font-mono text-neutral-400">Save login info on this device</span>
                            </label>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSavedAccount(selectedAccount.username, e)}
                              className="text-[11px] font-mono text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                            >
                              Remove from device
                            </button>
                          </div>

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-white/20 active:scale-[0.98] disabled:opacity-50"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Unlocking Sovereign Session...</span>
                              </>
                            ) : (
                              <>
                                <span>Sign In as @{selectedAccount.username.replace(/^@/, '')}</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>

                          <div className="pt-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setIsManualInputMode(true);
                                setEmail('');
                                setPassword('');
                              }}
                              className="text-xs font-mono text-neutral-400 hover:text-white transition cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <User className="w-3.5 h-3.5" />
                              <span>Sign in with another account</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      /* ── SAVED ACCOUNTS LIST ── */
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-neutral-400 font-semibold tracking-wider flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-purple-400" />
                            <span>Saved Accounts On This Device</span>
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">{savedAccounts.length} saved</span>
                        </div>

                        <div className="space-y-2">
                          {savedAccounts.map((acc) => (
                            <div
                              key={acc.id || acc.username}
                              onClick={() => handleSelectAccount(acc)}
                              className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/40 transition flex items-center justify-between gap-3 cursor-pointer group"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold overflow-hidden shrink-0">
                                  {acc.avatar || acc.avatar_url ? (
                                    <img src={acc.avatar || acc.avatar_url} alt={acc.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span>{(acc.name || acc.username || 'U')[0]?.toUpperCase()}</span>
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-white truncate">{acc.name || acc.display_name || acc.username}</span>
                                    {acc.isFounder && (
                                      <span className="px-1 py-0.5 rounded text-[8px] bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                                        FOUNDER
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-neutral-400 font-mono truncate">@{acc.username.replace(/^@/, '')}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-[10px] font-mono text-purple-400 group-hover:text-purple-300 transition">
                                  Insert Password &rarr;
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => handleRemoveSavedAccount(acc.username, e)}
                                  title="Remove account from device"
                                  className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsManualInputMode(true);
                            setEmail('');
                            setPassword('');
                          }}
                          className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-neutral-300 font-mono text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Use Another Account</span>
                        </button>
                      </div>
                    )
                  ) : (
                    /* ── STANDARD CREDENTIAL INPUT FORM ── */
                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      {savedAccounts.length > 0 && (
                        <div className="flex items-center justify-between pb-1">
                          <button
                            type="button"
                            onClick={() => {
                              setIsManualInputMode(false);
                              if (savedAccounts.length > 0) {
                                setSelectedAccount(savedAccounts[0]);
                                setEmail(savedAccounts[0].username || savedAccounts[0].email || '');
                              }
                            }}
                            className="text-xs font-mono text-purple-400 hover:text-purple-300 transition cursor-pointer flex items-center gap-1.5"
                          >
                            <span>&larr; Back to saved accounts ({savedAccounts.length})</span>
                          </button>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-semibold text-neutral-300 flex items-center justify-between">
                          <span>IDENTIFIER (@HANDLE OR EMAIL)</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="@username or email"
                            disabled={loading}
                            required
                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-white/40 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <label className="font-semibold text-neutral-300">MASTER PASSPHRASE</label>
                          <Link href="/privacy" className="text-neutral-400 hover:text-white transition">
                            Recovery Key?
                          </Link>
                        </div>
                        <div className="relative">
                          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••"
                            disabled={loading}
                            required
                            className="w-full pl-10 pr-11 py-3 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-white/40 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={saveLoginInfo}
                            onChange={(e) => setSaveLoginInfo(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-white/20 bg-black/40 text-purple-500 focus:ring-0 focus:ring-offset-0"
                          />
                          <span className="text-[11px] font-mono text-neutral-400">Save login info on this device</span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-white/20 active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Validating Credentials...</span>
                          </>
                        ) : (
                          <>
                            <span>Enter Sovereign Platform</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      {/* Social OAuth Providers */}
                      <div className="pt-2 space-y-2.5">
                        <div className="relative flex py-1 items-center">
                          <div className="flex-grow border-t border-white/10" />
                          <span className="flex-shrink mx-3 text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                            OR CONNECT WITH
                          </span>
                          <div className="flex-grow border-t border-white/10" />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleOAuth('google')}
                            disabled={loading}
                            className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/25 text-white font-mono text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                            <span>Google</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOAuth('github')}
                            disabled={loading}
                            className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/25 text-white font-mono text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                            <span>GitHub</span>
                          </button>
                        </div>
                      </div>
                    </form>
                  )
                ) : (
                  <form onSubmit={handleVerify2FACode} className="space-y-4">
                    <div className="flex items-center justify-between pb-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIs2FAStep(false);
                          setErrorMessage(null);
                        }}
                        className="text-xs font-mono text-purple-400 hover:text-purple-300 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>&larr; Back to password</span>
                      </button>
                      <span className="text-[10px] font-mono text-neutral-500">2FA Challenge</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Shield className="w-4 h-4 text-emerald-400" />
                        <span>Sovereign Identity Verification</span>
                      </div>
                      <p className="text-[11px] font-mono text-neutral-400 leading-relaxed">
                        Enter your Master PIN (e.g. <strong className="text-emerald-300 font-bold">5747</strong>), Sovereign Passkey, or 10-digit 2FA code.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono font-semibold text-neutral-300">
                        CLEARANCE CODE OR MASTER PIN
                      </label>
                      <input
                        type="text"
                        value={securityCodeInput}
                        onChange={(e) => setSecurityCodeInput(e.target.value)}
                        placeholder="e.g. 5747 or ZNV@2026!FOUNDER#99"
                        autoFocus
                        disabled={loading}
                        required
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center font-mono text-base tracking-widest text-emerald-300 focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-black font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Validating Clearance...</span>
                        </>
                      ) : (
                        <>
                          <span>Verify Sovereign Clearance</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}

              {/* Footer Switcher */}
              <div className="pt-4 border-t border-white/10 text-center space-y-3">
                <p className="text-xs text-neutral-400 font-mono">
                  Don't have a sovereign key?{' '}
                  <Link href="/register" className="text-white font-bold hover:underline">
                    Mint New ZEN.ID &rarr;
                  </Link>
                </p>

                <div className="flex items-center justify-center gap-4 text-[11px] font-mono text-neutral-500 pt-1">
                  <Link href="/join-core-team" className="hover:text-neutral-300 transition flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>Join Core Team</span>
                  </Link>
                  <span>&bull;</span>
                  <Link href="/privacy" className="hover:text-neutral-300 transition">
                    Constitutional Ledger
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030407] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
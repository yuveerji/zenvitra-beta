'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  KeyRound, 
  Lock, 
  Smartphone, 
  Laptop, 
  Trash2, 
  RefreshCw, 
  Copy, 
  Check, 
  AlertTriangle, 
  Activity, 
  PowerOff, 
  X,
  Fingerprint,
  QrCode,
  Flame,
  Globe2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  getSecurityProfile, 
  saveSecurityProfile, 
  toggleTwoFactorAuth, 
  revokeSession, 
  killAllOtherSessions, 
  toggleAccountFreeze, 
  generateBackupRecoveryCodes,
  regenerateSovereignCode,
  UserSecurityProfile,
  logSecurityEvent
} from '@/lib/securityShield';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';

export function SecurityShieldModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { profile, user } = useAuth();
  const userId = profile?.id || user?.id || 'active_session';

  const [activeTab, setActiveTab] = useState<'2fa' | 'sessions' | 'lockdown' | 'logs'>('2fa');
  const [securityProfile, setSecurityProfile] = useState<UserSecurityProfile | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedKeys, setCopiedKeys] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const secretKey = 'JBSWY3DPEHPK3PXP';
  const userAccount = profile?.username || user?.user_metadata?.user_name || (user?.email ? user.email.split('@')[0] : 'user');
  const otpAuthUri = `otpauth://totp/Zenvitra:${encodeURIComponent(userAccount)}?secret=${secretKey}&issuer=Zenvitra&algorithm=SHA1&digits=6&period=30`;

  useEffect(() => {
    let isSubscribed = true;
    QRCode.toDataURL(otpAuthUri, {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((dataUrl) => {
        if (isSubscribed) setQrCodeDataUrl(dataUrl);
      })
      .catch((err) => {
        console.error('Failed to generate TOTP QR Code:', err);
      });

    return () => {
      isSubscribed = false;
    };
  }, [otpAuthUri]);

  useEffect(() => {
    if (isOpen) {
      const data = getSecurityProfile(userId);
      setSecurityProfile(data);
    }
  }, [isOpen, userId]);

  if (!isOpen || !securityProfile) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle2FA = () => {
    const nextState = !securityProfile.isTwoFactorEnabled;
    const res = toggleTwoFactorAuth(userId, nextState);
    setSecurityProfile({
      ...securityProfile,
      isTwoFactorEnabled: nextState,
      twoFactorSecret: res.secret || securityProfile.twoFactorSecret,
      backupRecoveryCodes: res.backupCodes,
    });
    showToast(nextState ? '🛡️ 2FA Code Authentication Activated' : '⚠️ 2FA Disabled');
  };

  const handleRegenerateBackupKeys = () => {
    const newKeys = generateBackupRecoveryCodes();
    const updated = {
      ...securityProfile,
      backupRecoveryCodes: newKeys,
    };
    saveSecurityProfile(updated);
    setSecurityProfile(updated);
    logSecurityEvent(userId, 'BACKUP_CODES_REGENERATED', 'Regenerated emergency anti-lockout backup passkeys.', 'WARNING');
    showToast('🔑 5 New Backup Passkeys Generated');
  };

  const handleRegenerateSovereignCode = () => {
    const newCode = regenerateSovereignCode(userId);
    setSecurityProfile(getSecurityProfile(userId));
    showToast('⚡ New 10-Digit Sovereign Code Generated');
  };

  const handleRevokeSession = (sessionId: string) => {
    revokeSession(userId, sessionId);
    setSecurityProfile(getSecurityProfile(userId));
    showToast('🚫 Remote Session Revoked');
  };

  const handleKillAllSessions = () => {
    killAllOtherSessions(userId);
    setSecurityProfile(getSecurityProfile(userId));
    showToast('🚨 Anti-Theft Activated: All Remote Sessions Terminated');
  };

  const handleToggleFreeze = () => {
    const isFrozen = toggleAccountFreeze(userId);
    setSecurityProfile(getSecurityProfile(userId));
    showToast(isFrozen ? '🔒 EMERGENCY LOCKDOWN: Account Frozen' : '🔓 Account Lockdown Lifted');
  };

  const copyToClipboard = (text: string, type: 'code' | 'keys') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'code') {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedKeys(true);
        setTimeout(() => setCopiedKeys(false), 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[150] overflow-y-auto bg-black/85 backdrop-blur-md flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 text-white font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-3xl bg-[#08090d] border border-white/15 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.95)] flex flex-col my-auto max-h-[90vh] overflow-hidden relative"
      >
        {/* ── TOP HEADER ── */}
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm tracking-tight text-white flex items-center gap-2">
                <span>SOVEREIGN ACCOUNT SHIELD &amp; ANTI-THEFT</span>
                {securityProfile.isAccountFrozen && (
                  <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/40">
                    FROZEN
                  </span>
                )}
              </h2>
              <p className="font-mono text-[10px] text-zinc-400">CRYPTOGRAPHIC DEFENSE SUITE V-1.0</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-18 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-cyan-600 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── NAVIGATION TABS ── */}
        <div className="grid grid-cols-4 border-b border-white/10 bg-black/30 font-mono text-xs">
          <button
            onClick={() => setActiveTab('2fa')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === '2fa'
                ? 'border-cyan-400 text-white bg-white/[0.04]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2FA Code Auth</span>
            <span className="sm:hidden">2FA</span>
          </button>

          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'sessions'
                ? 'border-cyan-400 text-white bg-white/[0.04]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Anti-Theft Sessions</span>
            <span className="sm:hidden">Sessions</span>
          </button>

          <button
            onClick={() => setActiveTab('lockdown')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'lockdown'
                ? 'border-rose-400 text-rose-300 bg-rose-500/[0.05]'
                : 'border-transparent text-zinc-400 hover:text-rose-300'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lockdown</span>
            <span className="sm:hidden">Lock</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-3 border-b-2 font-medium flex items-center justify-center gap-2 transition cursor-pointer ${
              activeTab === 'logs'
                ? 'border-cyan-400 text-white bg-white/[0.04]'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audit Logs</span>
            <span className="sm:hidden">Logs</span>
          </button>
        </div>

        {/* ── TAB CONTENTS (Scrollable Body) ── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* ════ TAB 1: 2FA & CODE AUTHENTICATION ════ */}
          {activeTab === '2fa' && (
            <div className="space-y-6">
              {/* Master 2FA Toggle */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-display font-bold text-sm text-white">
                      10-Digit Sovereign Code Authentication
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Require your unique 10-digit cryptographic security code on new device sign-ins and sensitive credential updates.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                    securityProfile.isTwoFactorEnabled
                      ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                      : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{securityProfile.isTwoFactorEnabled ? 'ENABLED' : 'DISABLED'}</span>
                </button>
              </div>

              {/* Dynamic 10-Digit Sovereign Code Stage */}
              {securityProfile.isTwoFactorEnabled && (
                <div className="p-5 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-cyan-300 font-bold uppercase tracking-wider">
                      ACTIVE 10-DIGIT SOVEREIGN PASSKEY CODE
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleRegenerateSovereignCode}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer transition"
                        title="Generate a new random 10-digit code"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Randomize / Regenerate</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(securityProfile.twoFactorSecret || '', 'code')}
                        className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition"
                      >
                        {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-center p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 shadow-inner">
                    <span className="font-mono text-2xl sm:text-4xl font-black text-cyan-200 tracking-[0.25em] select-all">
                      {securityProfile.twoFactorSecret ? `${securityProfile.twoFactorSecret.slice(0, 5)} ${securityProfile.twoFactorSecret.slice(5)}` : 'Generating...'}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-400 text-center">
                    This is your unique 10-digit Sovereign Code. Everyone has a distinct cryptographic code.
                  </p>
                </div>
              )}

              {/* Authenticator Apps (Google Authenticator / Authy / 1Password) */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-purple-400" />
                    <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                      Google Authenticator &amp; Authy (TOTP 2FA)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    AUTHY / GOOGLE AUTH READY
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  Link any standard Time-based One-Time Password (TOTP) authenticator application on your smartphone.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-4 p-4 rounded-xl bg-black border border-white/15 flex flex-col items-center justify-center text-center space-y-2">
                    <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-lg overflow-hidden relative">
                      {qrCodeDataUrl ? (
                        <img
                          src={qrCodeDataUrl}
                          alt="Scan QR Code with Google Authenticator or Authy"
                          className="w-full h-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                          <QrCode className="w-8 h-8 animate-pulse" />
                        </div>
                      )}
                    </div>
                    <span className="font-mono text-[9px] text-zinc-400 font-semibold tracking-wider">SCAN VIA APP</span>
                  </div>

                  <div className="sm:col-span-8 space-y-3 font-mono text-xs text-zinc-300">
                    <div>
                      <span className="text-[10px] text-zinc-500 block uppercase">SECRET KEY (MANUAL ENTRY):</span>
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-white/10 mt-1">
                        <code className="text-purple-300 font-bold tracking-widest text-xs">JBSWY3DPEHPK3PXP</code>
                        <button
                          type="button"
                          onClick={() => copyToClipboard('JBSWY3DPEHPK3PXP', 'code')}
                          className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-400 space-y-1 font-sans">
                      <p>1. Open <strong>Google Authenticator</strong> or <strong>Authy</strong>.</p>
                      <p>2. Tap <strong>+</strong> &rarr; <strong>Enter setup key</strong>.</p>
                      <p>3. Account: <code>Zenvitra (@{profile?.username || 'user'})</code>.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Backup Recovery Passkeys */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    <h4 className="font-display font-bold text-xs text-white uppercase tracking-wider">
                      Emergency Anti-Lockout Backup Passkeys
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRegenerateBackupKeys}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] font-mono text-zinc-300 flex items-center gap-1 cursor-pointer transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Regenerate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(securityProfile.backupRecoveryCodes.join('\n'), 'keys')}
                      className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono text-white flex items-center gap-1 cursor-pointer transition font-bold"
                    >
                      {copiedKeys ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKeys ? 'Copied' : 'Copy All'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {securityProfile.backupRecoveryCodes.map((key, i) => (
                    <div
                      key={key}
                      className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-zinc-300"
                    >
                      <span className="text-[10px] text-zinc-500 font-bold">#{i + 1}</span>
                      <span className="font-bold tracking-widest text-amber-200/90">{key}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400">1-USE</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anti-Phishing Guard Phrase */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="font-mono text-[10px] text-zinc-400 uppercase font-bold block">
                    ANTI-PHISHING PHRASE:
                  </span>
                  <span className="font-mono font-bold text-white tracking-wider">
                    {securityProfile.antiPhishingPhrase || 'SOVEREIGN-YOUTH-SHIELD-2026'}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  VERIFIED GENUINE
                </span>
              </div>
            </div>
          )}

          {/* ════ TAB 2: ANTI-THEFT ACTIVE SESSIONS ════ */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              {/* Anti-Theft Kill Switch Banner */}
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <h3 className="font-bold text-sm text-rose-200">
                      Anti-Theft Remote Session Kill Switch
                    </h3>
                  </div>
                  <p className="text-xs text-rose-300/80">
                    Suspect unauthorized access or lost a device? Instantly terminate all other active logins.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleKillAllSessions}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg"
                >
                  <PowerOff className="w-3.5 h-3.5" />
                  <span>Kill All Remote Sessions</span>
                </button>
              </div>

              {/* Sessions List */}
              <div className="space-y-3">
                <span className="font-mono text-xs text-zinc-400 font-bold uppercase tracking-wider block">
                  AUTHORIZED ACTIVE DEVICES ({securityProfile.activeSessions.length})
                </span>

                <div className="space-y-2.5">
                  {securityProfile.activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                        session.isCurrent
                          ? 'bg-cyan-500/[0.04] border-cyan-500/30'
                          : 'bg-white/[0.02] border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/15 flex items-center justify-center text-white shrink-0">
                          {session.deviceName.includes('Mobile') || session.deviceName.includes('iPhone') ? (
                            <Smartphone className="w-5 h-5 text-cyan-400" />
                          ) : (
                            <Laptop className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="truncate text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white truncate">{session.deviceName}</span>
                            {session.isCurrent ? (
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                THIS DEVICE
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono text-zinc-400">{session.location}</span>
                            )}
                          </div>
                          <div className="font-mono text-[10px] text-zinc-400 space-x-2 pt-0.5">
                            <span>{session.browser}</span>
                            <span>&bull;</span>
                            <span>{session.os}</span>
                            <span>&bull;</span>
                            <span>{session.ipAddress}</span>
                          </div>
                        </div>
                      </div>

                      {!session.isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleRevokeSession(session.id)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 font-mono text-xs transition cursor-pointer shrink-0 flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ TAB 3: ANTI-BRUTE-FORCE & EMERGENCY LOCKDOWN ════ */}
          {activeTab === 'lockdown' && (
            <div className="space-y-6">
              {/* Anti-Brute-Force Status */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Anti-Brute-Force &amp; Intrusion Shield</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                    PROTECTED
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Adaptive IP rate limiting and exponential lockout enforce a 60s cooldown after 5 failed attempts, completely blocking automated credential stuffing.
                </p>
                <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-zinc-300 flex items-center justify-between">
                  <span>Failed Attempts Recorded:</span>
                  <strong className="text-emerald-400">{securityProfile.failedLoginAttempts} / 5</strong>
                </div>
              </div>

              {/* Emergency Account Lockdown / Freeze */}
              <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <h3 className="font-bold text-sm text-rose-200">Emergency Account Lockdown</h3>
                </div>
                <p className="text-xs text-rose-200/80 leading-relaxed">
                  If you suspect your identity is being impersonated or compromised, activate Emergency Lockdown. This halts all public broadcasts, revokes API keys, and prevents profile modifications until unlocked via your Master Recovery Key.
                </p>

                <button
                  type="button"
                  onClick={handleToggleFreeze}
                  className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                    securityProfile.isAccountFrozen
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-rose-600 hover:bg-rose-500 text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>{securityProfile.isAccountFrozen ? 'LIFT EMERGENCY LOCKDOWN' : 'ACTIVATE EMERGENCY LOCKDOWN'}</span>
                </button>
              </div>
            </div>
          )}

          {/* ════ TAB 4: AUDIT LOGS & INTRUSION STREAM ════ */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-zinc-400 font-bold uppercase tracking-wider">
                  CRYPTOGRAPHIC SECURITY AUDIT TRAIL ({securityProfile.auditLogs.length})
                </span>
                <span className="text-[10px] font-mono text-zinc-500">IMMUTABLE LOCAL RECORD</span>
              </div>

              <div className="space-y-2.5">
                {securityProfile.auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 flex items-start justify-between gap-3 text-left"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                            log.status === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : log.status === 'WARNING'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {log.eventType}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">{log.ipAddress}</span>
                      </div>
                      <p className="text-xs text-zinc-200">{log.description}</p>
                    </div>

                    <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ── FOOTER ── */}
        <div className="h-14 px-6 border-t border-white/10 flex items-center justify-between bg-black/50 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>SOVEREIGN MATRIX SHIELD ACTIVE</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}

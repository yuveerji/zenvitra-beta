'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, ShieldCheck, Copy, Check, ExternalLink, QrCode } from 'lucide-react';
import { ZenPassport, getVerificationLevelDetails, VerificationLevel } from '@/lib/passport';

export interface PassportQrModalProps {
  passport?: ZenPassport;
  passportId?: string;
  fullName?: string;
  username?: string;
  verificationLevel?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PassportQrModal({ 
  passport, 
  passportId: rawPassportId,
  fullName: rawFullName,
  username: rawUsername,
  verificationLevel: rawLevel,
  isOpen, 
  onClose 
}: PassportQrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [hasCopied, setHasCopied] = useState(false);

  const passportId = passport?.passportId || rawPassportId || 'ZNV-2026-8F42K7';
  const fullName = passport?.fullName || rawFullName || 'Authenticated Citizen';
  const levelNum = (passport?.verification?.level ?? rawLevel ?? 1) as VerificationLevel;
  const levelMeta = getVerificationLevelDetails(levelNum);

  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/passport/verify/${passportId}`
    : `https://zenvitra.com/passport/verify/${passportId}`;

  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(verificationUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, [isOpen, verificationUrl]);

  if (!isOpen) return null;

  const copyLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-7 rounded-[2rem] bg-[#07080b] border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.9)] text-left space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">ZEN.PASSPORT QR</h3>
              <p className="text-[11px] font-mono text-neutral-400">Cryptographic Identity Verification</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white text-black shadow-inner space-y-3">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`QR for ${passportId}`} className="w-52 h-52 object-contain" />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center font-mono text-xs text-neutral-400">
              Generating Cryptographic QR...
            </div>
          )}
          <div className="text-center space-y-0.5">
            <span className="font-mono text-xs font-black tracking-widest text-black">
              {passportId}
            </span>
            <p className="text-[10px] font-sans font-medium text-neutral-600">
              Scan with any mobile camera to verify credentials
            </p>
          </div>
        </div>

        {/* Verification Summary */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-neutral-300">
            <span>FULL NAME:</span>
            <span className="text-white font-bold">{fullName}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-300">
            <span>PASSPORT ID:</span>
            <span className="text-cyan-400 font-bold">{passportId}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-300">
            <span>VERIFICATION STATUS:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {levelMeta.tag}
            </span>
          </div>
          <div className="flex items-center justify-between text-neutral-300">
            <span>MEMBER SINCE:</span>
            <span className="text-white font-bold">{passport?.memberSince || 2026}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={copyLink}
            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{hasCopied ? 'Link Copied' : 'Copy Verification URL'}</span>
          </button>
          <a
            href={verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-mono text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-purple-950/30 text-center font-bold"
          >
            <span>Open Terminal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default PassportQrModal;

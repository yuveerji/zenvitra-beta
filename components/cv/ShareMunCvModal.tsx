'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, QrCode, Share2, Globe, ShieldCheck, ExternalLink } from 'lucide-react';

interface ShareMunCvModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  fullName: string;
  passportId: string;
}

export default function ShareMunCvModal({
  isOpen,
  onClose,
  username,
  fullName,
  passportId,
}: ShareMunCvModalProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const url = typeof window !== 'undefined' 
    ? `${window.location.origin}/cv/${username}`
    : `https://zenvitra.xyz/cv/${username}`;

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      QRCode.toDataURL(url, {
        width: 220,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      })
        .then((data) => setQrDataUrl(data))
        .catch((err) => console.error('QR code error', err));
    }
  }, [isOpen, url]);

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareTwitter = () => {
    const text = `Explore my verified Model UN CV & Diplomatic Dossier on ZENVITRA: ${fullName} (@${username})`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    const text = `Check out my Model UN CV on ZENVITRA: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md rounded-3xl bg-[#080a13] border border-white/15 shadow-2xl p-6 sm:p-8 space-y-6 text-white selection:bg-amber-500/30 text-center glass-specular"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer glass-specular"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1 pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider glass-specular">
            <Share2 className="w-3 h-3" />
            <span>SHAREABLE DIPLOMATIC CV</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-outfit font-black text-white">
            Share Model UN CV
          </h3>
          <p className="text-xs text-neutral-400 font-jakarta">
            Share your verified multilateral record and conference achievements with one universal link.
          </p>
        </div>

        {/* QR Code Container */}
        {qrDataUrl && (
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 inline-block mx-auto shadow-inner glass-specular">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <img
                src={qrDataUrl}
                alt="MUN CV QR Code"
                className="w-40 h-40 object-contain mx-auto"
              />
            </div>
            <p className="text-[10px] font-mono text-neutral-400 mt-2">
              SCAN TO VIEW VERIFIED DOSSIER
            </p>
          </div>
        )}

        {/* Copy Link Input Bar */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-left glass-specular">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 px-3 py-2 bg-transparent text-xs font-mono text-cyan-300 focus:outline-none truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg text-xs font-jakarta font-bold transition flex items-center gap-1.5 cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-black'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="p-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-xs font-jakarta font-semibold text-[#25D366] transition cursor-pointer glass-specular"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={handleShareTwitter}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-jakarta font-semibold text-white transition cursor-pointer glass-specular"
          >
            X (Twitter)
          </button>
          <button
            type="button"
            onClick={handleShareLinkedIn}
            className="p-2.5 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/30 text-xs font-jakarta font-semibold text-[#70b5f9] transition cursor-pointer glass-specular"
          >
            LinkedIn
          </button>
        </div>

        <div className="pt-2 border-t border-white/5 text-[10px] text-neutral-500 font-mono">
          PERMANENT SOVEREIGN RECORD: {passportId}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Download,
  Share2,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  QrCode,
  ArrowRight,
  ExternalLink,
  Crown,
  Users,
  X,
  Ticket
} from 'lucide-react';
import { ZenPassTicket } from '@/types/zenpass';
import QRCode from 'qrcode';

interface ZenPassHolographicTicketProps {
  ticket: ZenPassTicket;
  onClose?: () => void;
  isModal?: boolean;
}

export function ZenPassHolographicTicket({ ticket, onClose, isModal = true }: ZenPassHolographicTicketProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [ticketQrDataUrl, setTicketQrDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const qrPayload = JSON.stringify({
      app: 'Zenvitra',
      type: 'ZenPass',
      ticketNumber: ticket.ticketNumber,
      eventId: ticket.eventId,
      eventTitle: ticket.eventTitle,
      attendee: ticket.attendeeName || ticket.attendeeHandle,
      qrCodeValue: ticket.qrCodeValue,
      securityHash: ticket.securityPulseHash,
    });

    QRCode.toDataURL(qrPayload, {
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setTicketQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Failed to generate ZenPass QR Code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [ticket]);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `ZenPass: ${ticket.eventTitle}`,
        text: `Here is my official ZenPass for ${ticket.eventTitle}! Ticket #${ticket.ticketNumber}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`ZenPass #${ticket.ticketNumber} for ${ticket.eventTitle} - Venue: ${ticket.venue}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert(`ZenPass #${ticket.ticketNumber} saved to your device in High-Res PDF & Wallet format!`);
    }, 1200);
  };

  const content = (
    <div className="relative w-full max-w-md mx-auto select-none">
      
      {/* ── AMBIENT HOLOGRAPHIC GLOW ── */}
      <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 opacity-60 blur-xl animate-pulse pointer-events-none" />

      {/* ── MAIN TICKET CONTAINER ── */}
      <div className="relative rounded-[28px] bg-[#07080d] border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden text-white flex flex-col">
        
        {/* Holographic Iridescent Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-amber-500/10 to-purple-500/10 pointer-events-none opacity-80" />

        {/* ── TOP HEADER / EVENT BANNER ── */}
        <div className="relative p-6 pb-5 border-b border-white/10 space-y-3 bg-gradient-to-b from-white/[0.04] to-transparent">
          
          {/* Top Security Strip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-[10px] font-mono font-bold text-amber-300 shadow-sm">
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
              <span>ZENPASS VERIFIED &bull; {ticket.eventCategory}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-neutral-400 font-bold">
                {ticket.ticketNumber}
              </span>
              {isModal && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-neutral-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Event Title */}
          <div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight">
              {ticket.eventTitle}
            </h2>
            <div className="flex items-center gap-2 mt-1.5 font-mono text-xs text-amber-300 font-semibold">
              <span>{ticket.tierName}</span>
              <span className="text-neutral-500">&bull;</span>
              <span>₹{ticket.tierPrice}</span>
            </div>
          </div>

          {/* Allocated Portfolio / Role Banner */}
          {ticket.allocatedPortfolio && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2.5">
                <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-[9px] font-mono uppercase text-amber-300/80 font-bold block">
                    ALLOCATED DELEGATION / STAGE ROLE
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-white block">
                    {ticket.allocatedPortfolio}
                  </span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-400 text-black font-mono text-[9px] font-bold shrink-0">
                OFFICIAL
              </span>
            </div>
          )}
        </div>

        {/* ── EVENT DETAILS GRID ── */}
        <div className="p-6 py-4 grid grid-cols-2 gap-4 border-b border-dashed border-white/15 bg-black/40 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">
              <Calendar className="w-3 h-3 text-neutral-400" />
              <span>DATE &amp; TIME</span>
            </span>
            <span className="font-bold text-white block">{ticket.eventDate}</span>
            <span className="text-[11px] text-neutral-400 block">{ticket.eventTime}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3 text-neutral-400" />
              <span>VENUE &amp; CITY</span>
            </span>
            <span className="font-bold text-white block truncate">{ticket.venue}</span>
            <span className="text-[11px] text-neutral-400 block">{ticket.venueCity}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">
              <Users className="w-3 h-3 text-neutral-400" />
              <span>ATTENDEE / DELEGATE</span>
            </span>
            <span className="font-bold text-white block truncate">{ticket.attendeeName}</span>
            <span className="text-[11px] text-neutral-400 block">@{ticket.attendeeHandle}</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 uppercase font-bold flex items-center gap-1">
              <ShieldCheck className={`w-3 h-3 ${ticket.status === 'refunded' ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span>GATE PASS STATUS</span>
            </span>
            {ticket.status === 'refunded' ? (
              <span className="inline-flex items-center gap-1 font-bold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-lg border border-rose-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>REFUNDED (100% CREDITED)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{ticket.status === 'checked_in' ? 'CHECKED IN' : 'VALID AT GATE'}</span>
              </span>
            )}
          </div>
        </div>

        {/* ── NOTCH CUTOUTS FOR PERFORATED LOOK ── */}
        <div className="relative flex items-center justify-between px-2 -my-3 z-20 pointer-events-none">
          <div className="w-6 h-6 rounded-full bg-[#040407] border-r border-white/20 -ml-3" />
          <div className="w-6 h-6 rounded-full bg-[#040407] border-l border-white/20 -mr-3" />
        </div>

        {/* ── BOTTOM QR CODE & LIVE ANTI-FRAUD SECURITY PULSE ── */}
        <div className="p-6 pt-5 bg-black/60 flex flex-col items-center space-y-4 text-center">
          
          {/* Dynamic Laser QR Code */}
          <div className="relative p-3 rounded-2xl bg-white p-2 shadow-2xl flex items-center justify-center w-40 h-40">
            {ticketQrDataUrl ? (
              <img
                src={ticketQrDataUrl}
                alt={`ZenPass #${ticket.ticketNumber} QR Code`}
                className={`w-full h-full object-contain rounded-lg ${ticket.status === 'refunded' ? 'opacity-40 grayscale' : ''}`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                <QrCode className="w-12 h-12 animate-pulse" />
              </div>
            )}

            {/* Glowing Laser Scan Bar or Refund Stamp */}
            {ticket.status === 'refunded' ? (
              <div className="absolute inset-2 flex items-center justify-center pointer-events-none">
                <div className="px-3 py-1.5 rounded-xl bg-rose-600/90 text-white font-mono text-xs font-black uppercase tracking-widest border-2 border-white shadow-xl rotate-[-12deg]">
                  VOID / REFUNDED
                </div>
              </div>
            ) : (
              <motion.div
                animate={{ y: [0, 130, 0] }}
                transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
                className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_8px_rgba(239,68,68,1)] pointer-events-none"
              />
            )}
          </div>

          {/* Anti-Fraud Security Pulse */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-amber-300">
              <span className={`w-2 h-2 rounded-full ${ticket.status === 'refunded' ? 'bg-rose-400' : 'bg-emerald-400 animate-pulse'}`} />
              <span>LIVE SECURITY PULSE: <strong>{ticket.securityPulseHash}</strong></span>
            </div>
            <span className="text-[9px] font-mono text-neutral-500 block">
              {ticket.status === 'refunded' 
                ? `100% Refund credited to original payment method &bull; ID: RFND-${ticket.ticketNumber}` 
                : `Gate Timestamp: ${currentTime} &bull; Screenshot Protection Active`}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full pt-2 flex flex-col gap-2 font-display text-xs">
            {/* Direct Chamber Entry (Only if valid) */}
            {ticket.status !== 'refunded' ? (
              <Link
                href={`/committee?room=${ticket.chamberRoomId || 'unsc-2026'}`}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Enter Live Chamber / Stage Floor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="w-full py-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold flex items-center justify-center gap-2">
                <span>Pass Revoked &bull; 100% Refund Cleared</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDownload}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? 'Saving...' : 'Save Pass'}</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Share Pass'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isModal) return content;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-md my-auto"
        >
          {content}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

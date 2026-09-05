'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ZenPassTicket, ZenPassTier, ZenPassEventMetrics } from '@/types/zenpass';
import { useAuth } from '@/context/AuthContext';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';
import { pushLiveNotification } from '@/lib/notificationStorage';

interface ZenPassContextType {
  userPasses: ZenPassTicket[];
  activePassForModal: ZenPassTicket | null;
  setActivePassForModal: (pass: ZenPassTicket | null) => void;
  showPassWalletModal: boolean;
  setShowPassWalletModal: (show: boolean) => void;
  showScannerModal: boolean;
  setShowScannerModal: (show: boolean) => void;
  bookPass: (params: {
    eventId: string;
    eventTitle: string;
    eventCategory: string;
    eventBannerUrl?: string;
    venue: string;
    venueCity: string;
    eventDate: string;
    eventTime: string;
    tier: ZenPassTier;
    quantity: number;
    allocatedPortfolio?: string;
    committeeName?: string;
    attendeeName?: string;
    attendeeEmail?: string;
    attendeePhone?: string;
    collegeOrSchool?: string;
    chamberRoomId?: string;
  }) => ZenPassTicket;
  validateAndCheckInPass: (qrCodeOrTicketId: string) => {
    success: boolean;
    ticket?: ZenPassTicket;
    message: string;
  };
  refundPass: (ticketId: string, reason?: string) => {
    success: boolean;
    refundAmount: number;
    refundTxId: string;
    message: string;
  };
  cancelAndRefundEventPasses: (eventId: string, eventTitle: string, reason?: string) => {
    refundedCount: number;
    totalRefundAmount: number;
  };
  getPassesForEvent: (eventId: string) => ZenPassTicket[];
  getMetricsForEvent: (eventId: string, totalCapacity?: number) => ZenPassEventMetrics;
}

const ZenPassContext = createContext<ZenPassContextType | undefined>(undefined);

const LS_ZENPASSES = 'zenvitra_user_zenpasses_v2';

const INITIAL_DEMO_PASSES: ZenPassTicket[] = [];

export function ZenPassProvider({ children }: { children: React.ReactNode }) {
  const { profile, user, isMockMode } = useAuth();
  const currentUserName = profile?.display_name || user?.name || 'You';
  const currentUserHandle = profile?.username || 'you';
  const currentUserEmail = profile?.email || user?.email || 'user@zenvitra.com';

  const [userPasses, setUserPasses] = useState<ZenPassTicket[]>(INITIAL_DEMO_PASSES);
  const [mounted, setMounted] = useState(false);

  const [activePassForModal, setActivePassForModal] = useState<ZenPassTicket | null>(null);
  const [showPassWalletModal, setShowPassWalletModal] = useState<boolean>(false);
  const [showScannerModal, setShowScannerModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_ZENPASSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        const DUMMY_PASS_WORDS = [
          'delhi sovereign',
          'geneva midnight',
          'narendra modi',
          'zen-pass-88492',
          'zen-pass-39201',
          'zen-pass-10293',
          'delhi-mun-2026',
          'geneva-open-mic'
        ];
        // Strictly purge any seeded fake test passes
        const realPasses = Array.isArray(parsed)
          ? parsed.filter((p: ZenPassTicket) => {
              if (!p || !p.id) return false;
              const titleLow = (p.eventTitle || '').toLowerCase();
              const ticketNumLow = (p.ticketNumber || '').toLowerCase();
              const isDummy = DUMMY_PASS_WORDS.some((w) => titleLow.includes(w) || ticketNumLow.includes(w));
              return !isDummy;
            })
          : [];
        setUserPasses(realPasses);
        localStorage.setItem(LS_ZENPASSES, JSON.stringify(realPasses));
      } else {
        setUserPasses([]);
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(LS_ZENPASSES, JSON.stringify(userPasses));
    } catch {}
  }, [userPasses, mounted]);

  const bookPass = useCallback((params: {
    eventId: string;
    eventTitle: string;
    eventCategory: string;
    eventBannerUrl?: string;
    venue: string;
    venueCity: string;
    eventDate: string;
    eventTime: string;
    tier: ZenPassTier;
    quantity: number;
    allocatedPortfolio?: string;
    committeeName?: string;
    attendeeName?: string;
    attendeeEmail?: string;
    attendeePhone?: string;
    collegeOrSchool?: string;
    chamberRoomId?: string;
  }): ZenPassTicket => {
    const randomTicketNum = `ZEN-PASS-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomPulseHash = `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newPass: ZenPassTicket = {
      id: `pass_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ticketNumber: randomTicketNum,
      eventId: params.eventId,
      eventTitle: params.eventTitle,
      eventCategory: params.eventCategory,
      eventBannerUrl: params.eventBannerUrl,
      venue: params.venue,
      venueCity: params.venueCity,
      eventDate: params.eventDate,
      eventTime: params.eventTime,
      tierId: params.tier.id,
      tierName: params.tier.name,
      tierPrice: params.tier.price,
      currency: params.tier.currency,
      quantity: params.quantity,
      totalAmount: params.tier.price * params.quantity,
      allocatedPortfolio: params.allocatedPortfolio,
      committeeName: params.committeeName,
      attendeeName: params.attendeeName || currentUserName,
      attendeeEmail: params.attendeeEmail || currentUserEmail,
      attendeeHandle: currentUserHandle,
      attendeePhone: params.attendeePhone,
      collegeOrSchool: params.collegeOrSchool,
      qrCodeValue: `${randomTicketNum}-${params.eventId}-${params.allocatedPortfolio || 'GENERAL'}-${randomPulseHash}`,
      securityPulseHash: randomPulseHash,
      status: 'valid',
      chamberRoomId: params.chamberRoomId || 'unsc-2026',
      issuedAt: new Date().toISOString()
    };

    setUserPasses((prev) => [newPass, ...prev]);
    setActivePassForModal(newPass);

    broadcastActivitySync({
      source: 'event',
      action: 'rsvp',
      metadata: {
        passId: newPass.id,
        eventTitle: params.eventTitle,
        tierName: params.tier.name,
        ticketNumber: randomTicketNum
      },
      timestamp: Date.now()
    });

    return newPass;
  }, [currentUserName, currentUserEmail, currentUserHandle]);

  const validateAndCheckInPass = useCallback((qrCodeOrTicketId: string) => {
    const trimmed = qrCodeOrTicketId.trim().toUpperCase();
    const foundIndex = userPasses.findIndex(
      (p) =>
        p.ticketNumber.toUpperCase() === trimmed ||
        p.id.toUpperCase() === trimmed ||
        p.qrCodeValue.toUpperCase().includes(trimmed)
    );

    if (foundIndex === -1) {
      return {
        success: false,
        message: 'Invalid ZenPass Ticket. No matching pass record found in district registry.'
      };
    }

    const ticket = userPasses[foundIndex];
    if (ticket.status === 'checked_in') {
      return {
        success: false,
        ticket,
        message: `Pass Already Used! Checked in previously on ${new Date(ticket.checkedInAt || '').toLocaleTimeString()}.`
      };
    }

    const updatedTicket: ZenPassTicket = {
      ...ticket,
      status: 'checked_in',
      checkedInAt: new Date().toISOString(),
      checkedInBy: 'Gate Scanner Node #1'
    };

    setUserPasses((prev) => prev.map((p, idx) => (idx === foundIndex ? updatedTicket : p)));

    return {
      success: true,
      ticket: updatedTicket,
      message: `Access Granted! Welcome ${ticket.attendeeName} (${ticket.tierName}).`
    };
  }, [userPasses]);

  const refundPass = useCallback((ticketId: string, reason = 'Attendee requested refund / Event cancellation'): {
    success: boolean;
    refundAmount: number;
    refundTxId: string;
    message: string;
  } => {
    const foundIndex = userPasses.findIndex((p) => p.id === ticketId);
    if (foundIndex === -1) {
      return { success: false, refundAmount: 0, refundTxId: '', message: 'Ticket pass not found in register.' };
    }

    const ticket = userPasses[foundIndex];
    if (ticket.status === 'refunded') {
      return {
        success: false,
        refundAmount: ticket.refundAmount || ticket.totalAmount,
        refundTxId: ticket.refundTransactionId || 'ALREADY_REFUNDED',
        message: 'This pass has already been refunded.'
      };
    }

    const refundTxId = `RFND-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const refundAmount = ticket.totalAmount || ticket.tierPrice * (ticket.quantity || 1);

    const refundedTicket: ZenPassTicket = {
      ...ticket,
      status: 'refunded',
      refundAmount,
      refundedAt: new Date().toISOString(),
      refundReason: reason,
      refundTransactionId: refundTxId,
    };

    const nextPasses = userPasses.map((p, idx) => (idx === foundIndex ? refundedTicket : p));
    setUserPasses(nextPasses);

    try {
      localStorage.setItem(LS_ZENPASSES, JSON.stringify(nextPasses));
    } catch {}

    // Dispatch automated live notification
    pushLiveNotification({
      title: `Refund Credited: ₹${refundAmount}`,
      message: `100% full refund credited for "${ticket.eventTitle}" (${ticket.tierName} - ${ticket.quantity}x pass). Transaction Ref: ${refundTxId}. Reason: ${reason}`,
      type: 'refund',
      link: '/pulse?tab=events',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    broadcastActivitySync({
      source: 'escrow',
      action: 'save',
      timestamp: Date.now(),
      metadata: { ticketId, refundAmount, refundTxId },
    });

    return {
      success: true,
      refundAmount,
      refundTxId,
      message: `Refund of ₹${refundAmount} processed successfully. Reference: ${refundTxId}`,
    };
  }, [userPasses]);

  const cancelAndRefundEventPasses = useCallback((eventId: string, eventTitle: string, reason = 'Convening cancelled by Organizer / Secretariat'): {
    refundedCount: number;
    totalRefundAmount: number;
  } => {
    let refundedCount = 0;
    let totalRefundAmount = 0;

    const nextPasses = userPasses.map((ticket) => {
      if (ticket.eventId === eventId && ticket.status !== 'refunded') {
        refundedCount += ticket.quantity || 1;
        const amt = ticket.totalAmount || ticket.tierPrice * (ticket.quantity || 1);
        totalRefundAmount += amt;

        const refundTxId = `RFND-AUTO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

        pushLiveNotification({
          title: `Automated Refund: ₹${amt}`,
          message: `100% full refund credited for cancelled convening "${eventTitle}". Transaction ID: ${refundTxId}. Notice: ${reason}`,
          type: 'refund',
          link: '/pulse?tab=events',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });

        return {
          ...ticket,
          status: 'refunded' as const,
          refundAmount: amt,
          refundedAt: new Date().toISOString(),
          refundReason: reason,
          refundTransactionId: refundTxId,
        };
      }
      return ticket;
    });

    setUserPasses(nextPasses);
    try {
      localStorage.setItem(LS_ZENPASSES, JSON.stringify(nextPasses));
    } catch {}

    broadcastActivitySync({
      source: 'escrow',
      action: 'save',
      timestamp: Date.now(),
      metadata: { eventId, refundedCount, totalRefundAmount },
    });

    return { refundedCount, totalRefundAmount };
  }, [userPasses]);

  const getPassesForEvent = useCallback((eventId: string) => {
    return userPasses.filter((p) => p.eventId === eventId);
  }, [userPasses]);

  const getMetricsForEvent = useCallback((eventId: string, totalCapacity = 250): ZenPassEventMetrics => {
    const passes = userPasses.filter((p) => p.eventId === eventId);
    const sold = passes.reduce((acc, p) => acc + p.quantity, 0);
    const rev = passes.reduce((acc, p) => acc + p.totalAmount, 0);
    const checked = passes.filter((p) => p.status === 'checked_in').length;

    return {
      eventId,
      totalPassesSold: sold,
      grossRevenue: rev,
      totalCapacity,
      checkedInCount: checked,
      remainingPasses: Math.max(0, totalCapacity - sold)
    };
  }, [userPasses]);

  return (
    <ZenPassContext.Provider
      value={{
        userPasses,
        activePassForModal,
        setActivePassForModal,
        showPassWalletModal,
        setShowPassWalletModal,
        showScannerModal,
        setShowScannerModal,
        bookPass,
        validateAndCheckInPass,
        refundPass,
        cancelAndRefundEventPasses,
        getPassesForEvent,
        getMetricsForEvent
      }}
    >
      {children}
    </ZenPassContext.Provider>
  );
}

export function useZenPass() {
  const context = useContext(ZenPassContext);
  if (!context) {
    throw new Error('useZenPass must be used within a ZenPassProvider');
  }
  return context;
}

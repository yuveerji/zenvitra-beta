'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Ticket, 
  Clock, 
  Radio, 
  ArrowUpRight, 
  ShieldCheck, 
  Sparkles,
  Navigation,
  Trash2,
  AlertCircle,
  MoreHorizontal,
  X
} from 'lucide-react';
import { ZenEvent, EventAttendee } from '@/types/events';
import { useZenEvents } from '@/context/ZenEventsPlatformContext';
import { useZenPass } from '@/context/ZenPassContext';
import { ZenPassBookingModal } from './ZenPassBookingModal';

interface EventCardProps {
  event: ZenEvent;
  onOpenModal?: (event: ZenEvent) => void;
}

export function EventCard({ event, onOpenModal }: EventCardProps) {
  const { getUserRsvpStatus, setActiveEventId, setActiveView, deleteEvent, cancelEvent, currentUserId } = useZenEvents();
  const { getPassesForEvent, setActivePassForModal } = useZenPass();
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showManageMenu, setShowManageMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOrganizer = event.organizerId === currentUserId;

  const eventPasses = getPassesForEvent(event.id);
  const myPass = eventPasses[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handlePassButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (myPass) {
      setActivePassForModal(myPass);
    } else {
      setShowBookingModal(true);
    }
  };

  const openDetail = () => {
    if (onOpenModal) {
      onOpenModal(event);
    } else {
      setActiveEventId(event.id);
      setActiveView('detail');
    }
  };

  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = eventDate.getDate();

  const goingCount = event.attendees.filter((a: EventAttendee) => a.status === 'going').length;

  const getTypeBadge = () => {
    switch (event.type) {
      case 'physical':
        return { label: 'IN-PERSON', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'virtual':
        return { label: 'VIRTUAL MESH', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
      case 'hybrid':
      default:
        return { label: 'HYBRID MATRIX', color: 'bg-violet-500/15 text-violet-300 border-violet-500/30' };
    }
  };

  const typeBadge = getTypeBadge();

  return (
    <>
      <div
        onClick={openDetail}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col justify-between bg-[#07080c] border border-white/10 hover:border-amber-400/40 hover:-translate-y-1 shadow-xl"
      >
        {/* Dynamic Cursor Spotlight Radial */}
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-200 z-[2]"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, rgba(245, 158, 11, 0.08), transparent 75%)`,
          }}
        />

        {/* Cover Image Container */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-900 z-[1]">
          {event.coverImage ? (
            <img
              src={event.coverImage}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full bg-[#0d0a1a] flex items-center justify-center p-6 text-center">
              <Sparkles className="w-10 h-10 text-purple-400/40 group-hover:text-purple-300 transition-colors" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#090810] via-transparent to-black/60 pointer-events-none" />

          {/* Date Box Top Left */}
          <div className="absolute top-4 left-4 rounded-2xl p-2 bg-black/80 backdrop-blur-xl border border-white/15 text-center min-w-[52px] shadow-lg">
            <span className="block font-mono text-[10px] font-bold text-amber-300 tracking-wider">{month}</span>
            <span className="block font-display text-xl font-bold text-white leading-tight">{day}</span>
          </div>

          {/* Badges Top Right */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border backdrop-blur-md ${typeBadge.color}`}>
              {typeBadge.label}
            </span>
            {event.status === 'cancelled' && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/30 border border-rose-500/80 text-rose-300 text-[10px] font-mono font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                CANCELLED
              </span>
            )}
            {event.status === 'live' && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-mono font-bold animate-pulse">
                <Radio className="w-2.5 h-2.5" />
                LIVE
              </span>
            )}

            {/* Organizer Quick-Manage Button */}
            {isOrganizer && event.status !== 'cancelled' && (
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowManageMenu(!showManageMenu);
                  }}
                  className="p-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-neutral-300 hover:text-white hover:bg-black/90 transition cursor-pointer"
                  title="Manage Event"
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>

                {showManageMenu && (
                  <div
                    className="absolute right-0 top-full mt-1 w-48 rounded-xl bg-neutral-950 border border-white/15 shadow-2xl z-20 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEvent(event.id, 'Cancelled by organizer from event card');
                        setShowManageMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-mono text-rose-300 hover:bg-rose-500/10 transition flex items-center gap-2 cursor-pointer"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      Cancel &amp; Refund All
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowManageMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-mono text-rose-300 hover:bg-rose-500/10 transition flex items-center gap-2 cursor-pointer border-t border-white/5"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      Delete Permanently
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Distance Proximity Badge Bottom Left */}
          {typeof event.distanceKm === 'number' && (
            <div className="absolute bottom-3 left-4">
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 backdrop-blur-md border border-cyan-500/40 shadow-sm">
                <Navigation className="w-2.5 h-2.5 text-cyan-400" />
                <span>{event.distanceKm} km away</span>
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 space-y-4 z-[3]">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest block">
              {event.category}
            </span>

            <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
              {event.title}
            </h3>

            <p className="text-xs text-neutral-400 line-clamp-2 font-sans">
              {event.description}
            </p>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/5">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 truncate max-w-[170px]">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="truncate">{event.location}</span>
              </span>
              <span className="flex items-center gap-1 font-bold text-amber-300">
                <span>{event.ticketPrice ? `₹${event.ticketPrice}` : 'Free / Pass'}</span>
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-neutral-500" />
                <span>{goingCount} Registered</span>
              </span>
              {event.capacity && (
                <span className="text-neutral-400">
                  {event.capacity - goingCount > 0 ? `${event.capacity - goingCount} spots left` : 'Sold out'}
                </span>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-2 flex items-center gap-2">
              {event.status === 'cancelled' ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (myPass) setActivePassForModal(myPass);
                    else openDetail();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition cursor-pointer"
                >
                  <span>{myPass ? '🚫 Cancelled (View Refunded Pass)' : '🚫 Convening Cancelled'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePassButtonClick}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    myPass
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
                      : 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-105'
                  }`}
                >
                  {myPass ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>View My ZenPass</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Book ZenPass</span>
                    </>
                  )}
                </button>
              )}

              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-amber-400/40 text-neutral-400 group-hover:text-amber-300 transition">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <ZenPassBookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          event={event}
        />
      )}

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full max-w-sm rounded-3xl bg-neutral-950 border border-rose-500/30 p-6 space-y-4 shadow-2xl font-sans">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">Delete Event</h3>
                <p className="text-[11px] font-mono text-neutral-400">Permanent Removal</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Permanently delete <strong>{event.title}</strong>? All paid tickets will be automatically refunded.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:bg-white/10 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteEvent(event.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-display font-bold text-xs transition cursor-pointer shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventCard;

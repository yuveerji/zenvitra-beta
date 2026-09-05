'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit3, Calendar, Clock, MapPin, DollarSign, Users, Tag, CheckCircle2 } from 'lucide-react';
import { ZenEvent, EventCategory, EventStatus } from '@/types/events';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: ZenEvent;
  onSave: (eventId: string, updates: Partial<ZenEvent>) => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
}) => {
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [category, setCategory] = useState<EventCategory>(event.category);
  const [status, setStatus] = useState<EventStatus>(event.status);
  const [date, setDate] = useState(event.date ? event.date.split('T')[0] : '');
  const [time, setTime] = useState(event.time || '');
  const [location, setLocation] = useState(event.location || '');
  const [city, setCity] = useState(event.city || '');
  const [capacity, setCapacity] = useState<number>(event.capacity ?? 100);
  const [ticketPrice, setTicketPrice] = useState<number>(event.ticketPrice ?? 0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave(event.id, {
      title,
      description,
      category,
      status,
      date,
      time,
      location,
      city,
      capacity: Math.max(1, capacity),
      ticketPrice: Math.max(0, ticketPrice),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-xl rounded-3xl bg-[#090a0f] border border-cyan-500/20 shadow-2xl p-6 sm:p-8 space-y-6 my-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Edit3 className="w-5 h-5" />
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">Edit Convening Specifications</h3>
              </div>
              <p className="text-xs text-neutral-400">
                Update core dates, capacity, ticketing rates, and venue details
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Event specifications updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-mono text-neutral-300 block mb-1">Convening / Summit Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-mono text-neutral-300 block mb-1">Description & Mandate</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as EventCategory)}
                  className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="MUN">MUN Conference</option>
                  <option value="DEBATE">Debate Tournament</option>
                  <option value="PARLIAMENT">Youth Parliament</option>
                  <option value="POLICY">Policy Round-Table</option>
                  <option value="WORKSHOP">Diplomatic Workshop</option>
                  <option value="NETWORKING">Diplomatic Reception</option>
                  <option value="OTHER">Other Summit</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Summit Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live in Session</option>
                  <option value="past">Concluded / Past</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Dates & Times */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Convene Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Start Time</label>
                <input
                  type="text"
                  placeholder="e.g. 09:30 AM IST"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Venue / Location Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Venue / Physical Location</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">City / Region</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Capacity & Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Seating Capacity</label>
                <input
                  type="number"
                  min="1"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-neutral-300 block mb-1">Delegate Fee (₹ INR)</label>
                <input
                  type="number"
                  min="0"
                  value={ticketPrice}
                  onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#111422] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition"
              >
                Save Modifications
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

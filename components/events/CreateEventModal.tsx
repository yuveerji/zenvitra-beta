'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Clock, 
  Image as ImageIcon, 
  Tag, 
  Sparkles, 
  Layers, 
  Users,
  Check,
  Upload
} from 'lucide-react';
import { useZenEvents, KNOWN_CITIES } from '@/context/ZenEventsPlatformContext';
import { EventCategory, EventType } from '@/types/events';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
];

export function CreateEventModal() {
  const { createEvent, setActiveView } = useZenEvents();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0]);
  const [customCover, setCustomCover] = useState('');
  const [type, setType] = useState<EventType>('hybrid');
  const [category, setCategory] = useState<EventCategory>('SUMMIT');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('18:00 - 21:00 UTC');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [ticketPrice, setTicketPrice] = useState<number | undefined>(499);
  const [capacity, setCapacity] = useState<number | undefined>(200);
  const [tagInput, setTagInput] = useState('diplomacy, youth, summit');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be under 10MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const resultUrl = event.target.result as string;
          setCustomCover(resultUrl);
          setCoverImage(resultUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !location.trim()) return;

    const tags = tagInput.split(',').map((t) => t.trim()).filter(Boolean);
    const finalCover = customCover.trim() || coverImage;

    const matchedCity = KNOWN_CITIES.find(c => c.value.toLowerCase() === city.toLowerCase());
    const lat = matchedCity?.lat || (city === 'New Delhi' ? 28.6139 : undefined);
    const lng = matchedCity?.lng || (city === 'New Delhi' ? 77.2090 : undefined);

    createEvent({
      title: title.trim(),
      description: description.trim(),
      coverImage: finalCover,
      type,
      category,
      date,
      time: time.trim() || '18:00 UTC',
      location: location.trim(),
      city: city.trim() || 'New Delhi',
      latitude: lat,
      longitude: lng,
      ticketPrice: ticketPrice || 0,
      capacity: capacity ? Number(capacity) : undefined,
      tags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-2xl p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center font-sans">
      <div className="relative w-full max-w-2xl my-auto max-h-[92vh] overflow-y-auto rounded-3xl border border-white/15 bg-gradient-to-b from-[#0e121c] to-[#06080e] p-6 sm:p-8 shadow-[0_0_80px_rgba(0,0,0,0.9)] space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-0.5 shadow-md">
              <div className="w-full h-full rounded-[14px] bg-[#06080c] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Convene a Sovereign Event</h2>
              <p className="text-xs font-mono text-neutral-400">Launch a summit, workshop, or youth forum assembly.</p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('list')}
            className="p-2 rounded-2xl bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">CONVENING TITLE *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Zenvitra Global Diplomacy Summit 2026"
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Type & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">CONVENING TYPE</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-4 py-3 rounded-2xl bg-[#080a10] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="hybrid">Hybrid Matrix (Physical + Virtual)</option>
                <option value="physical">In-Person Physical Summit</option>
                <option value="virtual">Virtual Mesh Stream</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-4 py-3 rounded-2xl bg-[#080a10] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="SUMMIT">SUMMIT (MUNs, G20, UN)</option>
                <option value="WORKSHOP">WORKSHOP</option>
                <option value="KEYNOTE">KEYNOTE</option>
                <option value="MEETUP">MEETUP (Open Mics &amp; Slams)</option>
                <option value="HACKATHON">HACKATHON</option>
              </select>
            </div>
          </div>

          {/* City & Ticket Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">CITY / METROPOLE *</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#080a10] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              >
                {KNOWN_CITIES.filter(c => c.value !== 'ALL').map((c) => (
                  <option key={c.value} value={c.value}>{c.name}</option>
                ))}
                <option value="Other">Other / Custom Global</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">ZENPASS BASE PRICE (₹)</label>
              <input
                type="number"
                value={ticketPrice || ''}
                onChange={(e) => setTicketPrice(e.target.value ? Number(e.target.value) : 0)}
                placeholder="e.g. 499 (0 for Free)"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">DATE *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#080a10] border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">TIME SCHEDULE</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 18:00 - 21:00 UTC"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Location & Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">LOCATION / VENUE *</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. India Habitat Centre, Lodhi Road, New Delhi"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono font-semibold text-neutral-300">CAPACITY QUOTA</label>
              <input
                type="number"
                value={capacity || ''}
                onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Leave blank for unlimited"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">SYNOPSIS & AGENDA</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the assembly objective, key delegates, resolution voting procedures..."
              className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 resize-none focus:outline-none focus:border-cyan-500/50 leading-relaxed"
            />
          </div>

          {/* Cover Image Preset Picker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono font-semibold text-neutral-300">COVER ARTWORK</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Upload From Device</span>
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-4 gap-2">
              {COVER_PRESETS.map((preset, i) => (
                <div
                  key={i}
                  onClick={() => { setCoverImage(preset); setCustomCover(''); }}
                  className={`relative h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                    coverImage === preset && !customCover ? 'border-cyan-400 scale-95 shadow-[0_0_15px_rgba(0,242,254,0.4)]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={preset} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customCover}
                onChange={(e) => {
                  setCustomCover(e.target.value);
                  if (e.target.value) setCoverImage(e.target.value);
                }}
                placeholder="Or paste custom HTTPS image URL..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white transition cursor-pointer shrink-0"
                title="Upload file"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-neutral-300">TAGS (COMMA SEPARATED)</label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. summit, mun, diplomacy, leadership"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveView('list')}
              className="px-5 py-2.5 rounded-2xl border border-white/10 font-mono text-xs text-neutral-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_30px_rgba(255,255,255,0.25)] cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Launch Convening</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

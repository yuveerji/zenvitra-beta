'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Lock, 
  FileText, 
  BookOpen, 
  Feather, 
  Scale, 
  Music, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  Layers,
  Award
} from 'lucide-react';
import { PulsePostFormat } from '@/types/pulse';
import { MASTER_BADGES, isFoundingMember } from '@/lib/badgeSystem';
import { InlineContentRenderer } from '@/components/common/InlineContentRenderer';

interface FinalDraftPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  title: string;
  content: string;
  images: string[];
  postFormat: PulsePostFormat;
  selectedFont: string;
  tags: string[];
  privacy: 'public' | 'community' | 'mesh';
  authorName: string;
  authorUsername: string;
  authorAvatar?: string;
  authorBadge?: string;
  attachedSong?: {
    title: string;
    artist: string;
    audioUrl?: string;
  } | null;
  sources?: Array<{
    name: string;
    url: string;
    label?: string;
  }>;
}

export function FinalDraftPreviewModal({
  isOpen,
  onClose,
  onConfirmPublish,
  title,
  content,
  images,
  postFormat,
  selectedFont,
  tags,
  privacy,
  authorName,
  authorUsername,
  authorAvatar,
  authorBadge,
  attachedSong,
  sources,
}: FinalDraftPreviewModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen) return null;

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  const cleanHandle = (authorUsername || 'delegate').toLowerCase().replace(/^@/, '');
  const isFounder = cleanHandle === 'yuveer' || cleanHandle === 'founder';
  const effectiveBadgeKey = authorBadge || (isFounder ? 'FOUNDER' : (isFoundingMember(cleanHandle) ? 'FOUNDING MEMBER' : 'DELEGATE'));
  const badgeMeta = MASTER_BADGES[effectiveBadgeKey as keyof typeof MASTER_BADGES] || MASTER_BADGES['DELEGATE'];

  const getFormatDetails = () => {
    switch (postFormat) {
      case 'blog':
        return { label: 'Blog & Journal Article', icon: BookOpen, color: 'text-cyan-300 bg-cyan-950/60 border-cyan-500/30' };
      case 'poetry':
        return { label: 'Poetry & Lyrical Verses', icon: Feather, color: 'text-violet-300 bg-violet-950/60 border-violet-500/30' };
      case 'essay':
        return { label: 'Civic Policy Essay', icon: FileText, color: 'text-amber-300 bg-amber-950/60 border-amber-500/30' };
      case 'treaty':
        return { label: 'Treaty & Civic Accord', icon: Scale, color: 'text-emerald-300 bg-emerald-950/60 border-emerald-500/30' };
      default:
        return { label: 'Sovereign Dispatch', icon: Sparkles, color: 'text-indigo-300 bg-indigo-950/60 border-indigo-500/30' };
    }
  };

  const formatMeta = getFormatDetails();
  const FormatIcon = formatMeta.icon;

  const validSources = (sources || []).filter(s => s.name.trim() || s.url.trim());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#090b10] border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto text-white"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.95), 0 0 45px rgba(6,182,212,0.12)'
        }}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white font-display flex items-center gap-2">
                Check Your Final Draft
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Review formatting, media sequence, and citations before broadcasting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 ${formatMeta.color}`}>
              <FormatIcon className="w-3.5 h-3.5" />
              <span>{formatMeta.label}</span>
            </span>

            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-neutral-300 flex items-center gap-1">
              {privacy === 'public' && <Globe className="w-3 h-3 text-emerald-400" />}
              {privacy === 'community' && <ShieldCheck className="w-3 h-3 text-cyan-400" />}
              {privacy === 'mesh' && <Lock className="w-3 h-3 text-amber-400" />}
              <span className="capitalize">{privacy}</span>
            </span>
          </div>

          <div className="flex items-center gap-3 text-neutral-400 text-[11px] font-mono">
            <span>{wordCount} words</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>~{readTimeMin} min read</span>
            </span>
          </div>
        </div>

        {/* Live Draft Canvas Preview */}
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-b from-[#0f121a] to-[#080a10] border border-white/15 space-y-5 shadow-lg">
          {/* Author Header */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-400 to-blue-500 p-[2px] shrink-0">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-sm text-white uppercase overflow-hidden">
                  {authorAvatar ? (
                    <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
                  ) : (
                    (authorName || authorUsername || 'U')[0]?.toUpperCase()
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-sm text-white font-sans">{authorName || authorUsername}</h4>
                  <span className={`px-2 py-0.2 rounded-full border text-[10px] font-bold font-sans ${badgeMeta.colorClass}`}>
                    {badgeMeta.icon} {badgeMeta.label}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 font-mono">@{authorUsername}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 uppercase">
              Final Draft
            </span>
          </div>

          {/* Title (if present) */}
          {title.trim() && (
            <h1 
              className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
              style={{
                fontFamily: selectedFont === 'serif' ? 'var(--font-serif), Georgia, serif' : 'Clash Display, var(--font-space), sans-serif'
              }}
            >
              {title.trim()}
            </h1>
          )}

          {/* Photo Gallery / Carousel Preview (in exact user-rearranged sequence) */}
          {images.length > 0 && (
            <div className="space-y-2">
              <div className="relative w-full aspect-video sm:aspect-[16/10] rounded-2xl overflow-hidden bg-black/80 border border-white/15 shadow-xl group">
                <img 
                  src={images[activePhotoIdx]} 
                  alt={`Photo ${activePhotoIdx + 1}`}
                  className="w-full h-full object-contain"
                />

                {/* Counter Pill */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-mono font-bold text-white shadow-md flex items-center gap-1">
                  <Layers className="w-3 h-3 text-cyan-400" />
                  <span>{activePhotoIdx + 1} / {images.length}</span>
                </div>

                {/* Left/Right Carousel Nav (if multiple images) */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition cursor-pointer shadow-md"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhotoIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-white/20 transition cursor-pointer shadow-md"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails row if multiple photos */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        idx === activePhotoIdx ? 'border-cyan-400 scale-105 shadow-md shadow-cyan-500/20' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-black/80 px-1 text-[8px] font-mono text-white">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Article / Dispatch Body Text */}
          <div className="text-sm leading-relaxed text-neutral-200 font-sans">
            <InlineContentRenderer content={content} />
          </div>

          {/* Attached Audio/Song */}
          {attachedSong && (
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-300">
                <Music className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{attachedSong.title}</p>
                <p className="text-[10px] text-purple-300 truncate">{attachedSong.artist}</p>
              </div>
            </div>
          )}

          {/* Attached Verified Sources */}
          {validSources.length > 0 && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                Attached Sources &amp; Citations ({validSources.length})
              </span>
              <div className="space-y-1.5">
                {validSources.map((src, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-neutral-300">
                    <span className="font-semibold text-white truncate mr-2">{src.name || src.label}</span>
                    {src.url && (
                      <a href={src.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px] shrink-0 font-mono">
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              {tags.map((t, i) => (
                <span key={i} className="text-xs text-cyan-400 font-mono">
                  {t.startsWith('#') ? t : `#${t}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-neutral-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Editing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirmPublish();
            }}
            className="w-full sm:w-auto px-7 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm &amp; Dispatch Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

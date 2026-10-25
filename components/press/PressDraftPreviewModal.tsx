'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  Globe2, 
  ShieldCheck, 
  FileText, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { PressCategory } from '@/types/press';

interface PressDraftPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmPublish: () => void;
  title: string;
  excerpt?: string;
  content: string; // HTML or Markdown
  images: string[];
  category: PressCategory | string;
  tags: string[];
  authorName: string;
  authorUsername: string;
  sources?: Array<{
    name: string;
    url: string;
    label?: string;
  }>;
  isSubmitting?: boolean;
}

export function PressDraftPreviewModal({
  isOpen,
  onClose,
  onConfirmPublish,
  title,
  excerpt,
  content,
  images,
  category,
  tags,
  authorName,
  authorUsername,
  sources,
  isSubmitting = false,
}: PressDraftPreviewModalProps) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen) return null;

  const validImages = images.filter(Boolean);
  const currentPhoto = validImages[activePhotoIdx] || validImages[0];
  const validSources = (sources || []).filter(s => s && (s.name?.trim() || s.url?.trim()));

  // Estimate word count
  const rawText = content ? content.replace(/<[^>]*>/g, ' ').trim() : '';
  const wordCount = rawText ? rawText.split(/\s+/).length : 0;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#090b10] border border-white/15 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto text-white"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.95), 0 0 45px rgba(168,85,247,0.12)'
        }}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
                <span>Check Your Final Draft</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300">
                  Pre-Publish Verification
                </span>
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Inspect your layout, rearranged photos, citations, and typography
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Article Meta Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold uppercase">
              {category}
            </span>
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              <span>{readTimeMin} min read ({wordCount} words)</span>
            </span>
          </div>

          <div className="text-neutral-400">
            By <strong className="text-white">{authorName}</strong> (@{authorUsername.replace(/^@/, '')})
          </div>
        </div>

        {/* Title & Excerpt */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-3xl font-display font-bold text-white leading-tight">
            {title || 'Untitled Dispatch'}
          </h1>
          {excerpt && (
            <p className="text-sm sm:text-base font-serif italic text-neutral-300 border-l-2 border-purple-400 pl-3">
              {excerpt}
            </p>
          )}
        </div>

        {/* Multi-Photo Interactive Carousel */}
        {validImages.length > 0 && (
          <div className="space-y-3">
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-black/60 border border-white/15">
              <img
                src={currentPhoto}
                alt={`Photo ${activePhotoIdx + 1}`}
                className="w-full h-full object-cover"
              />

              {validImages.length > 1 && (
                <>
                  {/* Left / Right Carousel Buttons */}
                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : validImages.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePhotoIdx((prev) => (prev < validImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition cursor-pointer backdrop-blur-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {/* Slide Counter Pill */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3 text-purple-400" />
                    <span>{activePhotoIdx + 1} / {validImages.length}</span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails Strip */}
            {validImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 no-scrollbar">
                {validImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activePhotoIdx === idx
                        ? 'border-purple-400 ring-2 ring-purple-400/30'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-mono px-1 rounded text-white">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Body Preview */}
        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/10 max-h-72 overflow-y-auto space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400 pb-2 border-b border-white/[0.06]">
            <FileText className="w-3 h-3 text-purple-400" />
            <span>Article Body Text</span>
          </div>

          {content.includes('<') && content.includes('>') ? (
            <div 
              className="text-sm font-sans leading-relaxed text-neutral-200 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-sm font-sans leading-relaxed text-neutral-200 whitespace-pre-wrap">
              {content || 'No body text provided.'}
            </div>
          )}
        </div>

        {/* Citations & Sources */}
        {validSources.length > 0 && (
          <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-2.5">
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Evidence Citations ({validSources.length})</span>
            </div>
            <div className="space-y-1.5">
              {validSources.map((src, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono text-neutral-300">
                  <span className="flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">[{i + 1}]</span>
                    <span>{src.name || 'Unnamed Source'}</span>
                  </span>
                  {src.url && (
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline truncate max-w-[200px]"
                    >
                      <span className="truncate">{src.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t, idx) => (
              <span key={idx} className="text-[11px] font-mono text-neutral-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-lg">
                {t.startsWith('#') ? t : `#${t}`}
              </span>
            ))}
          </div>
        )}

        {/* Actions Bottom Bar */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-mono text-xs transition cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Editing</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onConfirmPublish();
            }}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-400 hover:via-indigo-400 hover:to-cyan-400 text-white font-display font-bold text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(168,85,247,0.4)] cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Publishing...' : 'Looks Perfect — Publish Wire'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

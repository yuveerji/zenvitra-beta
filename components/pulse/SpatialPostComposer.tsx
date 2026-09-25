'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, HelpCircle, FileText, Sparkles, Scale, Send, Image as ImageIcon, Smile, X, Film, Upload } from 'lucide-react';
import { UniversalEmojiGifPicker } from '@/components/common/UniversalEmojiGifPicker';

export type PostMode = 'WRITE' | 'ASK' | 'REPORT' | 'CREATE' | 'DEBATE';

interface SpatialPostComposerProps {
  onPublish?: (post: { mode: PostMode; title: string; content: string; images?: string[] }) => void;
  onOpenFluxComposer?: () => void;
}

export function SpatialPostComposer({ onPublish, onOpenFluxComposer }: SpatialPostComposerProps) {
  const router = useRouter();
  const [activeMode, setActiveMode] = useState<PostMode>('ASK');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaList, setMediaList] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modes: { key: PostMode; label: string; icon: any; color: string; placeholder: string }[] = [
    { key: 'WRITE', label: 'WRITE', icon: Edit3, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', placeholder: 'Draft your perspective, essay, or youth dispatch...' },
    { key: 'ASK', label: 'ASK', icon: HelpCircle, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', placeholder: 'What crucial question should young minds debate today?' },
    { key: 'REPORT', label: 'REPORT', icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', placeholder: 'File an on-the-ground report with verified sources...' },
    { key: 'CREATE', label: 'CREATE', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', placeholder: 'Share a creative project, campaign, or artwork...' },
    { key: 'DEBATE', label: 'DEBATE', icon: Scale, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', placeholder: 'Frame a formal resolution or controversial policy thesis...' },
  ];

  const currentModeInfo = modes.find((m) => m.key === activeMode) || modes[0];

  const handleModeSelect = (key: PostMode) => {
    if (key === 'REPORT') {
      router.push('/press');
      return;
    }
    if (key === 'DEBATE') {
      router.push('/discussions');
      return;
    }
    if (key === 'WRITE') {
      router.push('/press');
      return;
    }
    if (key === 'ASK') {
      setActiveMode('ASK');
      return;
    }
    setActiveMode(key);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          if (loadEvt.target?.result) {
            setMediaList((prev) => [...prev, loadEvt.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && mediaList.length === 0) return;
    if (onPublish) {
      onPublish({ 
        mode: activeMode, 
        title: title.trim(), 
        content: content.trim(), 
        images: mediaList 
      });
    }
    setTitle('');
    setContent('');
    setMediaList([]);
  };

  return (
    <div className="rounded-3xl bg-[#08090d]/95 border border-white/[0.08] p-6 space-y-4 backdrop-blur-2xl shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">
          WHAT&apos;S ON YOUR MIND?
        </span>
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${currentModeInfo.color}`}>
          {currentModeInfo.label} MODE
        </span>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = activeMode === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => handleModeSelect(m.key)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Composer Inputs */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {(activeMode === 'ASK' || activeMode === 'DEBATE' || activeMode === 'REPORT') && (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={activeMode === 'DEBATE' ? 'Motion / Thesis Title...' : 'Headline / Topic...'}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] text-sm text-white font-outfit placeholder:text-neutral-600 focus:outline-none focus:border-white/20"
          />
        )}

        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={currentModeInfo.placeholder}
          className="w-full px-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-sm text-neutral-200 font-outfit placeholder:text-neutral-600 focus:outline-none focus:border-white/20 resize-none leading-relaxed"
        />

        {/* Uploaded Media Preview Tray */}
        {mediaList.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
            {mediaList.map((media, idx) => {
              const isVideo = media.startsWith('data:video') || media.includes('.mp4') || media.includes('.webm') || media.includes('.mov');
              return (
                <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 shrink-0 bg-black/60 group">
                  {isVideo ? (
                    <video src={media} className="w-full h-full object-cover" />
                  ) : (
                    <img src={media} alt="Upload Preview" className="w-full h-full object-cover" />
                  )}
                  {isVideo && (
                    <div className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-black/80 text-[8px] font-mono text-cyan-300 flex items-center gap-0.5">
                      <Film className="w-2.5 h-2.5" />
                      <span>VID</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setMediaList((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 hover:bg-rose-600 text-white transition cursor-pointer"
                    title="Remove media"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-neutral-500">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Root Upload Media (Image / Video) */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono cursor-pointer"
              title="Upload Image or Video from Device"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Upload Media</span>
            </button>

            {/* Emojis & GIPHY GIFs Picker */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono cursor-pointer"
              title="World Emojis & GIPHY GIFs"
            >
              <Smile className="w-3.5 h-3.5 text-amber-400" />
              <span>GIF &amp; Emoji</span>
            </button>

            <UniversalEmojiGifPicker
              isOpen={showEmojiPicker}
              onClose={() => setShowEmojiPicker(false)}
              position="modal"
              onSelectEmoji={(emoji) => {
                setContent((prev) => prev + emoji);
              }}
              onSelectGif={(gifUrl) => {
                setMediaList((prev) => [...prev, gifUrl]);
                setShowEmojiPicker(false);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenFluxComposer) {
                  onOpenFluxComposer();
                } else {
                  fileInputRef.current?.click();
                }
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-600/30 to-purple-600/30 hover:from-fuchsia-600/50 hover:to-purple-600/50 text-fuchsia-200 border border-fuchsia-500/40 text-xs font-mono font-bold transition shadow-sm cursor-pointer"
              title="Post FLUX Reel (Video)"
            >
              <Film className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>POST FLUX</span>
            </button>

            <button
              type="submit"
              disabled={!content.trim() && mediaList.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-mono font-bold text-xs hover:bg-neutral-200 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              <span>POST DISPATCH</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

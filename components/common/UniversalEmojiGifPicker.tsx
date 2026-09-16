'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Sparkles, Image as ImageIcon, Smile, X, Clock, Loader2, Check } from 'lucide-react';
import { UNIVERSAL_EMOJI_CATEGORIES, EmojiItem } from '@/lib/universalEmojis';

export interface UniversalEmojiGifPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
  onSelectGif?: (gifUrl: string) => void;
  position?: 'top' | 'bottom' | 'modal' | 'dropdown';
  className?: string;
}

interface GiphyGifItem {
  id: string;
  title: string;
  url: string;
  previewUrl: string;
  width: number;
  height: number;
}

export function UniversalEmojiGifPicker({
  isOpen,
  onClose,
  onSelectEmoji,
  onSelectGif,
  position = 'modal',
  className = '',
}: UniversalEmojiGifPickerProps) {
  const [activeTab, setActiveTab] = useState<'emoji' | 'gif'>('emoji');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('smileys');
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const [hoveredEmoji, setHoveredEmoji] = useState<EmojiItem | null>(null);

  // GIF states
  const [gifResults, setGifResults] = useState<GiphyGifItem[]>([]);
  const [isLoadingGifs, setIsLoadingGifs] = useState(false);
  const [gifSearch, setGifSearch] = useState('');

  const pickerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load recent emojis from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('zen_recent_emojis');
        if (stored) {
          setRecentEmojis(JSON.parse(stored));
        }
      } catch (_) {}
    }
  }, []);

  // Fetch GIFs when tab opens or query changes
  useEffect(() => {
    if (!isOpen || activeTab !== 'gif') return;
    const fetchGifs = async () => {
      setIsLoadingGifs(true);
      try {
        const endpoint = gifSearch.trim()
          ? `/api/giphy?q=${encodeURIComponent(gifSearch.trim())}&limit=24`
          : '/api/giphy?limit=24';
        const res = await fetch(endpoint);
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          setGifResults(data.data);
        }
      } catch (err) {
        console.error('Failed to load GIFs:', err);
      } finally {
        setIsLoadingGifs(false);
      }
    };

    const timer = setTimeout(fetchGifs, gifSearch ? 350 : 0);
    return () => clearTimeout(timer);
  }, [isOpen, activeTab, gifSearch]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, activeTab]);

  // Filter emojis based on search query
  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return UNIVERSAL_EMOJI_CATEGORIES;

    return UNIVERSAL_EMOJI_CATEGORIES.map((cat) => {
      const matched = cat.emojis.filter(
        (e) =>
          e.char.includes(q) ||
          e.name.toLowerCase().includes(q) ||
          e.keywords.some((kw) => kw.toLowerCase().includes(q))
      );
      return { ...cat, emojis: matched };
    }).filter((cat) => cat.emojis.length > 0);
  }, [searchQuery]);

  const handleEmojiClick = (emoji: string, item?: EmojiItem) => {
    onSelectEmoji(emoji);
    // Update recents
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(0, 24);
    setRecentEmojis(updated);
    try {
      localStorage.setItem('zen_recent_emojis', JSON.stringify(updated));
    } catch (_) {}
  };

  const handleGifClick = (gif: GiphyGifItem) => {
    if (onSelectGif) {
      onSelectGif(gif.url);
      onClose();
    }
  };

  if (!isOpen) return null;

  const content = (
    <div
      ref={pickerRef}
      className={`bg-[#0a0c16]/95 border border-white/15 backdrop-blur-2xl rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-left z-[100] ${
        position === 'modal' ? 'w-[94vw] max-w-md h-[520px]' : 'w-80 sm:w-96 h-[440px]'
      } ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ── HEADER & TABS ── */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => {
              setActiveTab('emoji');
              setSearchQuery('');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
              activeTab === 'emoji'
                ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span>Emojis</span>
          </button>

          {onSelectGif && (
            <button
              type="button"
              onClick={() => {
                setActiveTab('gif');
                setGifSearch('');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer ${
                activeTab === 'gif'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>GIPHY</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="p-3 border-b border-white/10 bg-black/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            ref={searchInputRef}
            type="text"
            value={activeTab === 'emoji' ? searchQuery : gifSearch}
            onChange={(e) => {
              if (activeTab === 'emoji') setSearchQuery(e.target.value);
              else setGifSearch(e.target.value);
            }}
            placeholder={
              activeTab === 'emoji'
                ? 'Search all emojis (e.g. fire, skull, heart, flag)...'
                : 'Search GIFs on GIPHY...'
            }
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-cyan-400 transition placeholder:text-zinc-500"
          />
          {(activeTab === 'emoji' ? searchQuery : gifSearch) && (
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'emoji') setSearchQuery('');
                else setGifSearch('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── EMOJI TAB CONTENT ── */}
      {activeTab === 'emoji' && (
        <>
          {/* Category Icons Quick Jump */}
          {!searchQuery && (
            <div className="flex items-center gap-1 px-2.5 py-1.5 border-b border-white/10 overflow-x-auto no-scrollbar bg-black/30">
              {recentEmojis.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('recent')}
                  className={`p-1.5 rounded-xl text-xs transition cursor-pointer shrink-0 ${
                    selectedCategory === 'recent'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Frequently Used"
                >
                  <Clock className="w-3.5 h-3.5" />
                </button>
              )}
              {UNIVERSAL_EMOJI_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const el = document.getElementById(`cat-${cat.id}`);
                    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`px-2 py-1 rounded-xl text-sm transition cursor-pointer shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-white/15 border border-white/25 scale-110'
                      : 'hover:bg-white/5 opacity-70 hover:opacity-100'
                  }`}
                  title={cat.name}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
          )}

          {/* Emoji Grid Scroll View */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
            {/* Recents */}
            {!searchQuery && recentEmojis.length > 0 && selectedCategory === 'recent' && (
              <div id="cat-recent" className="space-y-1.5">
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Frequently Used</span>
                </h4>
                <div className="grid grid-cols-8 gap-1">
                  {recentEmojis.map((char, i) => (
                    <button
                      key={`recent-${char}-${i}`}
                      type="button"
                      onClick={() => handleEmojiClick(char)}
                      className="w-9 h-9 rounded-xl hover:bg-white/15 flex items-center justify-center text-xl transition-all cursor-pointer hover:scale-125 select-none"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filteredCategories.map((cat) => (
              <div key={cat.id} id={`cat-${cat.id}`} className="space-y-1.5">
                <div className="sticky top-0 bg-[#0a0c16]/95 backdrop-blur-md py-1 z-10 flex items-center justify-between">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </h4>
                  <span className="text-[9px] font-mono text-zinc-500">{cat.emojis.length}</span>
                </div>

                <div className="grid grid-cols-8 gap-1">
                  {cat.emojis.map((item, idx) => (
                    <button
                      key={`${cat.id}-${item.char}-${idx}`}
                      type="button"
                      onMouseEnter={() => setHoveredEmoji(item)}
                      onClick={() => handleEmojiClick(item.char, item)}
                      className="w-9 h-9 rounded-xl hover:bg-white/15 flex items-center justify-center text-xl transition-all cursor-pointer hover:scale-125 select-none"
                      title={item.name}
                    >
                      {item.char}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="py-12 text-center text-zinc-500 font-mono text-xs space-y-1">
                <p>No matching emojis found</p>
                <p className="text-[10px] text-zinc-600">Try searching another term like "smile", "fire", or "flag"</p>
              </div>
            )}
          </div>

          {/* Bottom Preview Bar */}
          <div className="px-3 py-2 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs font-mono text-zinc-400 min-h-[36px]">
            {hoveredEmoji ? (
              <div className="flex items-center gap-2 truncate">
                <span className="text-xl">{hoveredEmoji.char}</span>
                <span className="text-zinc-200 capitalize truncate">{hoveredEmoji.name}</span>
              </div>
            ) : (
              <span className="text-[11px] text-zinc-500">Pick any emoji from across the world</span>
            )}
          </div>
        </>
      )}

      {/* ── GIPHY TAB CONTENT ── */}
      {activeTab === 'gif' && (
        <div className="flex-1 overflow-y-auto p-3 no-scrollbar">
          {isLoadingGifs ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-400 font-mono text-xs py-16">
              <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
              <span>Fetching trending GIFs...</span>
            </div>
          ) : (
            <>
              <div className="columns-2 gap-2 space-y-2">
                {gifResults.map((gif) => (
                  <div
                    key={gif.id}
                    onClick={() => handleGifClick(gif)}
                    className="group relative rounded-2xl overflow-hidden cursor-pointer bg-zinc-900 border border-white/10 hover:border-pink-500/50 transition-all break-inside-avoid shadow-sm hover:scale-[1.02]"
                  >
                    <img
                      src={gif.previewUrl || gif.url}
                      alt={gif.title}
                      loading="lazy"
                      className="w-full object-cover transition duration-200 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-2">
                      <span className="text-[10px] font-mono text-white truncate drop-shadow">
                        {gif.title || 'Send GIF'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {gifResults.length === 0 && !isLoadingGifs && (
                <div className="py-16 text-center text-zinc-500 font-mono text-xs space-y-2">
                  <ImageIcon className="w-8 h-8 mx-auto text-zinc-600" />
                  <p>No GIFs found for "{gifSearch}"</p>
                  <p className="text-[10px] text-zinc-600">Try searching "applause", "laugh", or "reaction"</p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );

  if (position === 'modal') {
    return (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
          onClick={onClose}
        />
        <div className="relative z-10">{content}</div>
      </div>
    );
  }

  return content;
}


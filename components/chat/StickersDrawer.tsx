'use client';

import React, { useState } from 'react';
import { Sparkles, Plus, X, Image as ImageIcon } from 'lucide-react';
import { useZenChat } from '@/context/ZenChatPlatformContext';

interface StickersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSticker: (url: string, name?: string) => void;
}

export function StickersDrawer({ isOpen, onClose, onSelectSticker }: StickersDrawerProps) {
  const { customStickers, createCustomSticker } = useZenChat();
  const [activeTab, setActiveTab] = useState<'sovereign' | 'custom'>('sovereign');
  const [newStickerEmoji, setNewStickerEmoji] = useState('');
  const [newStickerName, setNewStickerName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStickerEmoji.trim() || !newStickerName.trim()) return;
    createCustomSticker(newStickerName.trim(), newStickerEmoji.trim());
    setNewStickerEmoji('');
    setNewStickerName('');
    setShowCreateModal(false);
  };

  return (
    <div className="absolute bottom-16 right-4 w-72 sm:w-80 rounded-3xl bg-[#0c0d14] border border-purple-500/30 shadow-2xl p-4 z-50 space-y-3 select-none backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-purple-300">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>SOVEREIGN STICKER PACK</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-neutral-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-1 border-b border-white/[0.04] pb-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('sovereign')}
            className={`px-3 py-1 rounded-xl text-[10px] font-mono transition ${
              activeTab === 'sovereign'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                : 'text-neutral-400 hover:bg-white/[0.04]'
            }`}
          >
            Diplomatic
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 rounded-xl text-[10px] font-mono transition ${
              activeTab === 'custom'
                ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                : 'text-neutral-400 hover:bg-white/[0.04]'
            }`}
          >
            Custom ({customStickers.length})
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="p-1.5 rounded-lg bg-purple-500/15 text-purple-300 hover:bg-purple-500/25 transition text-[10px] font-mono flex items-center gap-1"
          title="Create Custom Sticker"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Grid of stickers */}
      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
        {customStickers.map((stk) => (
          <button
            key={stk.id}
            type="button"
            onClick={() => {
              onSelectSticker(stk.url, stk.name);
              onClose();
            }}
            className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] hover:scale-110 active:scale-95 transition flex flex-col items-center justify-center gap-1 group"
            title={stk.name}
          >
            <span className="text-2xl">{stk.url}</span>
            <span className="font-mono text-[8px] text-neutral-500 truncate max-w-full group-hover:text-purple-300">
              {stk.name}
            </span>
          </button>
        ))}
      </div>

      {/* Create Custom Sticker Sub-Modal */}
      {showCreateModal && (
        <div className="p-3 rounded-2xl bg-black/80 border border-purple-500/40 space-y-2">
          <span className="font-mono text-[9px] text-purple-300 block">CREATE CUSTOM STICKER:</span>
          <input
            type="text"
            placeholder="Emoji / Symbol (e.g. 🛸)"
            value={newStickerEmoji}
            onChange={(e) => setNewStickerEmoji(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Sticker Label (e.g. Alien Tech)"
            value={newStickerName}
            onChange={(e) => setNewStickerName(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-2 py-1 rounded-lg text-[10px] text-neutral-400"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="px-3 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-bold"
            >
              Save Sticker
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

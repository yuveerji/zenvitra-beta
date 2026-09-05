'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, Sparkles, X, Send, Eye, Flame, Shield, RotateCw, Type, Smile, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenChat } from '@/context/ZenChatPlatformContext';

interface GlimpseSnapModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetConversationId?: string;
}

const STICKER_STAMPS = ['⚡', '📜', '🔥', '💎', '🏛️', '🤝', '🎯', '💡', '🛡️', '👑', '✨', '👁️'];

export function GlimpseSnapModal({ isOpen, onClose, targetConversationId }: GlimpseSnapModalProps) {
  const { sendSnap, conversations, activeConversationId } = useZenChat();

  const [step, setStep] = useState<'capture' | 'edit'>('capture');
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [captionColor, setCaptionColor] = useState('#ffffff');
  const [isOneView, setIsOneView] = useState(true);
  const [audience, setAudience] = useState<'all' | 'followers' | 'close_friends'>('all');
  const [appliedStickers, setAppliedStickers] = useState<string[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string>(targetConversationId || activeConversationId || '');
  const [showStickerPicker, setShowStickerPicker] = useState(false);

  // Camera stream
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  useEffect(() => {
    if (isOpen && step === 'capture' && !mediaUrl) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode }, audio: false })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Fallback if camera unavailable
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, step, facingMode, mediaUrl]);

  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setMediaUrl(dataUrl);
        setStep('edit');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUrl(event.target.result as string);
          setStep('edit');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSticker = (stk: string) => {
    setAppliedStickers((prev) => [...prev, stk]);
    setShowStickerPicker(false);
  };

  const handleSendSnap = () => {
    if (!mediaUrl) return;
    const target = selectedConvId || activeConversationId || (conversations.length > 0 ? conversations[0].id : undefined);
    sendSnap(
      {
        mediaUrl,
        caption: caption.trim() || undefined,
        stickers: appliedStickers.length > 0 ? appliedStickers : undefined,
        isOneView,
        audience,
      },
      target
    );
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setMediaUrl(null);
    setCaption('');
    setAppliedStickers([]);
    setStep('capture');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md h-[90vh] max-h-[720px] rounded-[3rem] bg-[#07080c] border border-white/10 overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Top Bar Controls */}
          <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-auto">
            <button
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-black transition"
            >
              <X className="w-4 h-4" />
            </button>

            {step === 'capture' ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
                  className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-black transition"
                  title="Flip Camera"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Sticker tool */}
                <button
                  onClick={() => setShowStickerPicker(!showStickerPicker)}
                  className="p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:bg-black transition"
                  title="Add Sticker"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* ── STEP 1: CAMERA CAPTURE STAGE ── */}
          {step === 'capture' && (
            <div className="relative flex-1 w-full bg-black flex flex-col items-center justify-between p-6">
              {/* Video Viewfinder */}
              <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="relative z-20 pt-14 text-center">
                <span className="px-3 py-1 rounded-full bg-black/60 border border-white/15 text-[10px] font-mono text-purple-300">
                  📸 GLIMPSE INSTANT CAMERA
                </span>
              </div>

              {/* Bottom Capture Deck */}
              <div className="relative z-20 w-full flex items-center justify-around pb-6 pt-4">
                {/* Gallery Upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:scale-105 transition"
                  title="Upload from Device"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Shutter Button */}
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="w-18 h-18 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-[0_0_30px_rgba(255,255,255,0.4)] cursor-pointer"
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400" />
                </button>

                {/* Blank balancer */}
                <div className="w-12 h-12" />
              </div>
            </div>
          )}

          {/* ── STEP 2: PHOTO EDITOR STAGE ── */}
          {step === 'edit' && mediaUrl && (
            <div className="relative flex-1 w-full bg-black flex flex-col justify-between overflow-hidden">
              {/* Image Preview Canvas */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img src={mediaUrl} alt="Snap preview" className="w-full h-full object-cover" />

                {/* Sticker Stamps Overlay */}
                {appliedStickers.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none flex flex-wrap items-center justify-center gap-4 p-8">
                    {appliedStickers.map((stk, i) => (
                      <span key={i} className="text-5xl filter drop-shadow-lg animate-bounce">
                        {stk}
                      </span>
                    ))}
                  </div>
                )}

                {/* Caption Text Overlay */}
                {caption && (
                  <div className="absolute bottom-32 inset-x-4 p-3 bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 text-center text-sm font-sans font-medium text-white shadow-2xl">
                    {caption}
                  </div>
                )}
              </div>

              {/* Sticker Selector Drawer */}
              {showStickerPicker && (
                <div className="absolute top-16 inset-x-6 p-4 rounded-3xl bg-[#0c0d14]/95 border border-white/20 backdrop-blur-xl z-40 space-y-3">
                  <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block">
                    Stamp Sovereign Sticker:
                  </span>
                  <div className="grid grid-cols-6 gap-2">
                    {STICKER_STAMPS.map((stk) => (
                      <button
                        key={stk}
                        type="button"
                        onClick={() => handleAddSticker(stk)}
                        className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] text-2xl hover:scale-125 transition flex items-center justify-center"
                      >
                        {stk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="relative z-20 pt-14" />

              {/* Editing Controls & Dispatch Bar */}
              <div className="relative z-20 p-4 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
                {/* Caption Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a sovereign caption..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-purple-400 backdrop-blur-md"
                  />
                </div>

                {/* Mode & Audience Toggles */}
                <div className="flex items-center justify-between gap-2 pt-1 font-mono text-[10px]">
                  {/* One-View Instant vs Persistent Snap */}
                  <button
                    type="button"
                    onClick={() => setIsOneView(!isOneView)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition ${
                      isOneView
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : 'bg-white/10 border-white/15 text-neutral-300'
                    }`}
                  >
                    {isOneView ? <Eye className="w-3.5 h-3.5 text-rose-400" /> : <Flame className="w-3.5 h-3.5 text-amber-400" />}
                    <span>{isOneView ? '1-View Instant ⏱️' : 'Chat Snap 🔥'}</span>
                  </button>

                  {/* Audience */}
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-white text-[10px] font-mono focus:outline-none"
                  >
                    <option value="all">🌐 All Delegates</option>
                    <option value="followers">👥 Followers</option>
                    <option value="close_friends">⭐ Inner Caucus</option>
                  </select>
                </div>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSendSnap}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:opacity-95 transition cursor-pointer"
                >
                  <Send className="w-4 h-4 text-black" />
                  <span>Send Glimpse Snap</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Copy, Check, Users, UserPlus, Shield } from 'lucide-react';
import { ZenDocument, ZenDocCollaborator } from '@/types/docs';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDoc: ZenDocument;
  onToast: (msg: string) => void;
}

export function ShareModal({ isOpen, onClose, activeDoc, onToast }: ShareModalProps) {
  const [inviteInput, setInviteInput] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<'EDITOR' | 'COMMENTER' | 'VIEWER'>('EDITOR');
  const [copied, setCopied] = useState<boolean>(false);
  const [collaborators, setCollaborators] = useState<ZenDocCollaborator[]>(activeDoc.collaborators || []);

  useEffect(() => {
    if (activeDoc.collaborators) {
      setCollaborators(activeDoc.collaborators);
    }
  }, [activeDoc.collaborators]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      onToast('Copied sovereign document link to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      onToast('Failed to copy link to clipboard');
    }
  };

  const handleAddCollaborator = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanHandle = inviteInput.trim().replace(/^@/, '');
    if (!cleanHandle) return;

    const colors = ['#06b6d4', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newCollaborator: ZenDocCollaborator = {
      id: `collab-${Date.now()}`,
      name: cleanHandle.charAt(0).toUpperCase() + cleanHandle.slice(1),
      handle: cleanHandle,
      role: selectedRole === 'COMMENTER' ? 'VIEWER' : selectedRole,
      color: randomColor,
      active: true
    };

    setCollaborators((prev) => [...prev, newCollaborator]);
    onToast(`Invited @${cleanHandle} as ${selectedRole.toLowerCase()}`);
    setInviteInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-modal-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl bg-[#0b0e17] border border-cyan-500/30 p-6 sm:p-8 space-y-6 shadow-2xl relative text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 font-mono text-[10px] uppercase font-bold border border-cyan-500/20">
                  <Users className="w-3 h-3 text-cyan-400" />
                  <span>Access Control</span>
                </div>
                <h3 id="share-modal-title" className="text-xl font-bold font-display text-white truncate max-w-[360px]">
                  Share &ldquo;{activeDoc.title}&rdquo;
                </h3>
                <p className="text-xs text-neutral-400 font-mono">
                  Grant sovereign co-authoring or viewing permissions.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                title="Close modal"
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Invite Form */}
            <div className="space-y-4">
              <form onSubmit={handleAddCollaborator} className="space-y-2">
                <label htmlFor="delegate-input" className="text-xs font-mono text-neutral-300 block">
                  Add Co-Sponsors or Signatories
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="delegate-input"
                      type="text"
                      value={inviteInput}
                      onChange={(e) => setInviteInput(e.target.value)}
                      placeholder="Enter delegate @handle or email..."
                      className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-neutral-500 focus:border-cyan-400 focus:outline-none transition font-mono"
                    />
                  </div>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as 'EDITOR' | 'COMMENTER' | 'VIEWER')}
                    className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-neutral-300 focus:outline-none focus:border-cyan-400 cursor-pointer font-mono"
                    title="Select collaborator role"
                  >
                    <option value="EDITOR">Editor</option>
                    <option value="COMMENTER">Commenter</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                  <button
                    type="submit"
                    disabled={!inviteInput.trim()}
                    title="Send invite"
                    className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-black font-mono text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite</span>
                  </button>
                </div>
              </form>

              {/* People with access list */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase font-bold tracking-wider">
                    People with access ({collaborators.length})
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400/80">Sovereign Roster</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {collaborators.length > 0 ? (
                    collaborators.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs hover:border-white/10 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] text-white shadow-sm ring-1 ring-white/10"
                            style={{ backgroundColor: c.color || '#06b6d4' }}
                          >
                            {c.name ? c.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white block">{c.name}</span>
                              {c.active && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Active now" />
                              )}
                            </div>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {c.handle ? `@${c.handle}` : 'Delegate'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                              c.role === 'OWNER'
                                ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                                : c.role === 'EDITOR'
                                ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                                : 'bg-neutral-500/15 text-neutral-300 border-white/10'
                            }`}
                          >
                            {c.role}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-neutral-500 font-mono">
                      No collaborators currently registered.
                    </div>
                  )}
                </div>
              </div>

              {/* General Access Link Section */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-white font-medium block truncate">General Access</span>
                    <span className="text-[11px] text-neutral-400 block truncate">
                      Anyone with sovereign delegate link can view
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  title="Copy link to clipboard"
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-black" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>

              {/* Cryptographic Footnote */}
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 pt-1">
                <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Zero telemetry or corporate tracking. Access state signed cryptographically.</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

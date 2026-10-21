'use client';

import React, { useState } from 'react';
import { 
  Flame, 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  Sparkles, 
  BarChart2, 
  CheckCircle2,
  Users
} from 'lucide-react';
import { TestNodeProvider, useTestNode } from '@/context/TestNodeContext';
import { TestNodeShell } from '@/components/test-node/TestNodeShell';

function TestPulseContent() {
  const { posts, addPost, likePost, votePoll, activePersona } = useTestNode();
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('#ApexMun2026');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    addPost(newPostContent.trim(), [newPostTag.trim()]);
    setNewPostContent('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#0a0d18] to-black border border-amber-500/30 space-y-2 text-left">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            ZEN.PULSE // SYNTHETIC SOCIAL ECOSYSTEM
          </span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
            ZERO PRODUCTION LEAKAGE
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
          Community Discussions, Polls &amp; Activity
        </h1>
        <p className="text-xs text-neutral-400 font-sans">
          Experiment with sovereign social interactions, policy polls, and delegate reactions. Posts and likes created here are strictly sandboxed.
        </p>
      </div>

      {/* Post Composer */}
      <form onSubmit={handleCreatePost} className="p-5 rounded-3xl bg-[#080d1c] border border-white/15 space-y-3 text-left">
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <img src={activePersona.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-cyan-400" />
          <span className="font-bold text-white">Share a dispatch as {activePersona.name} ({activePersona.role})</span>
        </div>

        <textarea
          rows={3}
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What is your delegation deliberating today? Draft a dispatch..."
          className="w-full bg-[#111422] border border-white/15 rounded-2xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 resize-none font-sans"
        />

        <div className="flex items-center justify-between gap-3 pt-1 font-mono text-xs">
          <input
            type="text"
            value={newPostTag}
            onChange={(e) => setNewPostTag(e.target.value)}
            placeholder="#Tag"
            className="bg-[#111422] border border-white/10 rounded-xl px-3 py-1.5 text-cyan-300 text-xs w-36 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish to Sandbox</span>
          </button>
        </div>
      </form>

      {/* Posts Stream */}
      <div className="space-y-4 text-left">
        {posts.map((post) => {
          const totalPollVotes = post.poll ? post.poll.options.reduce((acc, opt) => acc + opt.votes, 0) : 0;

          return (
            <div
              key={post.id}
              className="p-6 rounded-3xl bg-[#080d1c] border border-white/10 space-y-4 transition hover:border-white/20"
            >
              {/* Post Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={post.authorAvatar} alt="" className="w-10 h-10 rounded-full object-cover border border-cyan-400/40" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{post.authorName}</span>
                      <span className="px-2 py-0.2 rounded bg-white/10 text-[9px] font-mono text-cyan-300 font-bold">
                        {post.authorBadge}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      @{post.authorHandle} &bull; {post.timestamp}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line">
                {post.content}
              </p>

              {/* Tags */}
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-400">
                {post.tags.map((t, idx) => (
                  <span key={idx}>{t}</span>
                ))}
              </div>

              {/* Interactive Poll Component if present */}
              {post.poll && (
                <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2.5">
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-cyan-400" />
                    <span>{post.poll.question}</span>
                  </div>

                  <div className="space-y-2">
                    {post.poll.options.map((opt, oIdx) => {
                      const pct = totalPollVotes > 0 ? Math.round((opt.votes / totalPollVotes) * 100) : 0;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => votePoll(post.id, oIdx)}
                          className="w-full text-left p-2.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 transition cursor-pointer relative overflow-hidden group"
                        >
                          <div
                            className="absolute inset-0 bg-cyan-500/15 pointer-events-none transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                          <div className="relative z-10 flex items-center justify-between font-mono text-xs">
                            <span className="text-neutral-200 group-hover:text-white">{opt.text}</span>
                            <span className="font-bold text-cyan-300">{pct}% ({opt.votes})</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 text-right">
                    Total Simulated Votes: {totalPollVotes}
                  </div>
                </div>
              )}

              {/* Interaction Rail */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between font-mono text-xs text-neutral-400">
                <button
                  type="button"
                  onClick={() => likePost(post.id)}
                  className="flex items-center gap-1.5 hover:text-rose-400 transition cursor-pointer"
                >
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                  <span>{post.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1.5 text-neutral-500">
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount} Comments</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function TestPulsePage() {
  return (
    <TestNodeProvider>
      <TestNodeShell>
        <TestPulseContent />
      </TestNodeShell>
    </TestNodeProvider>
  );
}

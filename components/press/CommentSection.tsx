'use client';

import React, { useState, useMemo } from 'react';
import {
  Send,
  Trash2,
  Reply,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PressComment } from '@/types/press';
import { useZenPress } from '@/context/ZenPressPlatformContext';

interface CommentSectionProps {
  articleId: string;
}

const REACTION_EMOJIS = ['👍', '🔥', '💯', '❤️', '😂'];

export function CommentSection({ articleId }: CommentSectionProps) {
  const {
    getComments,
    addComment,
    deleteComment,
    addCommentReaction,
    currentUserId,
  } = useZenPress();

  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  const comments = getComments(articleId);

  const topLevel = useMemo(
    () => comments.filter((c) => !c.parentId),
    [comments],
  );

  const repliesMap = useMemo(() => {
    const map: Record<string, PressComment[]> = {};
    comments.forEach((c) => {
      if (c.parentId) {
        if (!map[c.parentId]) map[c.parentId] = [];
        map[c.parentId].push(c);
      }
    });
    return map;
  }, [comments]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addComment(articleId, newComment);
    setNewComment('');
  };

  const handleReplySubmit = (parentId: string) => {
    if (!replyText.trim()) return;
    addComment(articleId, replyText, parentId);
    setReplyText('');
    setReplyingTo(null);
    setExpandedReplies((prev) => new Set(prev).add(parentId));
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderComment = (comment: PressComment, isReply = false) => {
    const replies = repliesMap[comment.id] || [];
    const isExpanded = expandedReplies.has(comment.id);
    const isOwn = comment.authorId === currentUserId;

    return (
      <div key={comment.id} className={`${isReply ? 'ml-8 pl-4 border-l border-white/5' : ''}`}>
        <div className="group/cmt py-3">
          {/* Author Row */}
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-white/8 border border-white/8 flex items-center justify-center text-[9px] font-mono font-bold text-white uppercase">
                {comment.authorName[0]}
              </div>
              <span className="font-mono text-[11px] text-neutral-200">
                {comment.authorName}
              </span>
              <span className="font-mono text-[10px] text-neutral-600">
                {formatTime(comment.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover/cmt:opacity-100 transition">
              {!isReply && (
                <button
                  onClick={() => {
                    setReplyingTo(replyingTo === comment.id ? null : comment.id);
                    setReplyText('');
                  }}
                  className="p-1 rounded text-neutral-500 hover:text-neutral-300 hover:bg-white/5 transition cursor-pointer"
                >
                  <Reply className="w-3 h-3" />
                </button>
              )}
              {isOwn && (
                <button
                  onClick={() => deleteComment(comment.id)}
                  className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <p className="text-xs text-neutral-300 leading-relaxed pl-7">
            {comment.content}
          </p>

          {/* Reactions */}
          <div className="flex items-center gap-1 mt-2 pl-7">
            {REACTION_EMOJIS.map((emoji) => {
              const rxn = comment.reactions.find((r) => r.emoji === emoji);
              const hasReacted = rxn?.users.includes(currentUserId);
              return (
                <button
                  key={emoji}
                  onClick={() => addCommentReaction(comment.id, emoji)}
                  className={`px-1.5 py-0.5 rounded-md text-[11px] transition cursor-pointer ${
                    hasReacted
                      ? 'bg-white/10 border border-white/15'
                      : 'hover:bg-white/5 opacity-40 hover:opacity-100'
                  }`}
                >
                  {emoji}
                  {rxn && rxn.count > 0 && (
                    <span className="ml-0.5 font-mono text-[9px] text-neutral-400">
                      {rxn.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reply Input */}
        {replyingTo === comment.id && (
          <div className="ml-8 pl-4 border-l border-white/5 pb-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit(comment.id)}
                placeholder="Write a reply…"
                className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-xs font-mono text-white placeholder:text-neutral-600 focus:border-white/20 focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => handleReplySubmit(comment.id)}
                disabled={!replyText.trim()}
                className="p-1.5 rounded-lg bg-white text-black hover:bg-neutral-200 transition disabled:opacity-30 cursor-pointer"
              >
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {replies.length > 0 && (
          <>
            <button
              onClick={() => toggleReplies(comment.id)}
              className="flex items-center gap-1 ml-8 text-[10px] font-mono text-neutral-500 hover:text-neutral-300 transition cursor-pointer mb-1"
            >
              {isExpanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
            {isExpanded &&
              replies.map((reply) => renderComment(reply, true))}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <h4 className="font-mono text-sm font-semibold text-white">
        Comments{' '}
        <span className="text-neutral-500 font-normal">({comments.length})</span>
      </h4>

      {/* New Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-start gap-2">
        <div className="w-6 h-6 rounded-md bg-white/10 border border-white/10 flex items-center justify-center text-[9px] font-mono font-bold text-white uppercase shrink-0 mt-0.5">
          Y
        </div>
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/8 text-xs font-mono text-white placeholder:text-neutral-600 focus:border-white/20 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="p-2 rounded-xl bg-white text-black hover:bg-neutral-200 transition disabled:opacity-30 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="divide-y divide-white/5">
        {topLevel.length === 0 && (
          <p className="text-xs font-mono text-neutral-600 py-4 text-center">
            No comments yet. Be the first to share your thoughts.
          </p>
        )}
        {topLevel.map((c) => renderComment(c))}
      </div>
    </div>
  );
}

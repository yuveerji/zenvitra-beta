'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  PressArticle,
  PressComment,
  PressCategory,
  PressSortBy,
  PressView,
} from '@/types/press';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';

/* ─────────── helpers ─────────── */

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80) +
    '-' +
    Date.now().toString(36)
  );
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  const words = text.trim().split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

function extractExcerpt(html: string, maxLen = 180): string {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

/* ─────────── context shape ─────────── */

interface ZenPressContextType {
  /* articles */
  articles: PressArticle[];
  filteredArticles: PressArticle[];
  myDrafts: PressArticle[];
  myPublished: PressArticle[];
  bookmarkedArticles: PressArticle[];
  getArticleById: (id: string) => PressArticle | undefined;
  createArticle: (data: {
    title: string;
    content: string;
    category: PressCategory;
    tags: string[];
    sourceName: string;
    sourceUrl: string;
    coverImage?: string;
    excerpt?: string;
    isOfficial?: boolean;
    status?: 'draft' | 'published';
  }) => string;
  updateArticle: (
    id: string,
    data: Partial<
      Pick<PressArticle, 'title' | 'content' | 'category' | 'tags' | 'coverImage' | 'status' | 'excerpt' | 'isOfficial' | 'sourceName' | 'sourceUrl'>
    >,
  ) => void;
  publishArticle: (id: string) => void;
  deleteArticle: (id: string) => void;
  upvoteArticle: (id: string) => void;
  toggleBookmark: (id: string) => void;

  /* comments */
  getComments: (articleId: string) => PressComment[];
  addComment: (articleId: string, content: string, parentId?: string) => void;
  deleteComment: (commentId: string) => void;
  addCommentReaction: (commentId: string, emoji: string) => void;

  /* filters & view */
  activeCategory: PressCategory | 'ALL';
  setActiveCategory: (c: PressCategory | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  sortBy: PressSortBy;
  setSortBy: (s: PressSortBy) => void;
  activeView: PressView;
  setActiveView: (v: PressView) => void;
  activeArticleId: string | null;
  setActiveArticleId: (id: string | null) => void;
  editingArticleId: string | null;
  setEditingArticleId: (id: string | null) => void;
  editingArticle: PressArticle | null;
  setEditingArticle: (article: PressArticle | null) => void;

  /* current user */
  currentUserId: string;
  currentUserName: string;
  currentUserUsername: string;
}

/* ─────────── ZERO SEEDED DATA (CLEAN LIVE PLATFORM) ─────────── */

const INITIAL_OFFICIAL_ARCHIVES: PressArticle[] = [];

const ZenPressContext = createContext<ZenPressContextType | undefined>(undefined);

/* ─────────── localStorage keys ─────────── */

const LS_ARTICLES = 'zenvitra_press_articles_v4_clean';
const LS_COMMENTS = 'zenvitra_press_comments_v4_clean';

/* ─────────── provider ─────────── */

export function ZenPressPlatformProvider({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();

  const currentUserId = profile?.id || user?.id || profile?.email || 'guest_user';
  const currentUserName = profile?.display_name || user?.name || 'Guest Contributor';
  const currentUserUsername = profile?.username || 'you';

  /* ── state ── */

  const [allArticles, setAllArticles] = useState<PressArticle[]>(INITIAL_OFFICIAL_ARCHIVES);
  const [allComments, setAllComments] = useState<PressComment[]>([]);

  const [activeCategory, setActiveCategory] = useState<PressCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<PressSortBy>('latest');
  const [activeView, setActiveView] = useState<PressView>('feed');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  /* ── persistence ── */

  useEffect(() => {
    try {
      const safeParse = (val: string | null, fallback: any) => {
        if (!val || !val.trim() || val === 'undefined' || val === 'null') return fallback;
        try { 
          const parsed = JSON.parse(val);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
        } catch (_) { return fallback; }
      };

      const stored = localStorage.getItem(LS_ARTICLES);
      setAllArticles(safeParse(stored, INITIAL_OFFICIAL_ARCHIVES));

      const storedComments = localStorage.getItem(LS_COMMENTS);
      setAllComments(safeParse(storedComments, []));
    } catch (_) {}
  }, []);

  const saveArticles = useCallback((next: PressArticle[]) => {
    setAllArticles(next);
    try {
      localStorage.setItem(LS_ARTICLES, JSON.stringify(next));
      broadcastActivitySync({ source: 'press', action: 'update', timestamp: Date.now() });
    } catch (_) {}
  }, []);

  const saveComments = useCallback((next: PressComment[]) => {
    setAllComments(next);
    try {
      localStorage.setItem(LS_COMMENTS, JSON.stringify(next));
    } catch (_) {}
  }, []);

  /* ── derived lists ── */

  const publishedArticles = useMemo(() => {
    let list = allArticles.filter((a) => a.status === 'published');

    if (activeCategory !== 'ALL') {
      list = list.filter((a) => a.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.authorName.toLowerCase().includes(q),
      );
    }

    if (sortBy === 'latest') {
      list.sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
    } else if (sortBy === 'popular') {
      list.sort((a, b) => b.upvotes - a.upvotes);
    } else {
      list.sort((a, b) => new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime());
    }

    return list;
  }, [allArticles, activeCategory, searchQuery, sortBy]);

  const myDrafts = useMemo(
    () =>
      allArticles
        .filter((a) => a.authorId === currentUserId && a.status === 'draft')
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [allArticles, currentUserId],
  );

  const myPublished = useMemo(
    () =>
      allArticles
        .filter((a) => a.authorId === currentUserId && a.status === 'published')
        .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()),
    [allArticles, currentUserId],
  );

  const bookmarkedArticles = useMemo(
    () => allArticles.filter((a) => a.bookmarkedBy.includes(currentUserId) && a.status === 'published'),
    [allArticles, currentUserId],
  );

  const getArticleById = useCallback(
    (id: string) => allArticles.find((a) => a.id === id),
    [allArticles],
  );

  const editingArticle = useMemo(
    () => (editingArticleId ? allArticles.find((a) => a.id === editingArticleId) || null : null),
    [allArticles, editingArticleId],
  );

  const setEditingArticle = useCallback(
    (article: PressArticle | null) => {
      setEditingArticleId(article ? article.id : null);
    },
    [],
  );

  /* ── article CRUD ── */

  const createArticle = useCallback(
    (data: {
      title: string;
      content: string;
      category: PressCategory;
      tags: string[];
      sourceName: string;
      sourceUrl: string;
      coverImage?: string;
      excerpt?: string;
      isOfficial?: boolean;
      status?: 'draft' | 'published';
    }): string => {
      const now = new Date().toISOString();
      const id = 'art_' + Date.now();
      const status = data.status || 'published';
      const article: PressArticle = {
        id,
        title: data.title.trim(),
        slug: generateSlug(data.title),
        content: data.content,
        excerpt: data.excerpt || extractExcerpt(data.content),
        coverImage: data.coverImage?.trim() || undefined,
        sourceName: data.sourceName.trim(),
        sourceUrl: data.sourceUrl.trim(),
        authorId: currentUserId,
        authorName: currentUserName,
        authorUsername: currentUserUsername,
        category: data.category,
        tags: data.tags,
        status,
        isOfficial: data.isOfficial || false,
        createdAt: now,
        updatedAt: now,
        publishedAt: status === 'published' ? now : undefined,
        readingTimeMinutes: estimateReadingTime(data.content),
        upvotes: 0,
        upvotedBy: [],
        bookmarkedBy: [],
        commentCount: 0,
      };
      saveArticles([article, ...allArticles]);

      if (status === 'published') {
        setActiveView('feed');
      } else {
        setActiveView('my-articles');
      }

      return id;
    },
    [allArticles, currentUserId, currentUserName, currentUserUsername, saveArticles, setActiveView],
  );

  const updateArticle = useCallback(
    (
      id: string,
      data: Partial<Pick<PressArticle, 'title' | 'content' | 'category' | 'tags' | 'coverImage' | 'status' | 'excerpt' | 'isOfficial' | 'sourceName' | 'sourceUrl'>>,
    ) => {
      const now = new Date().toISOString();
      const updated = allArticles.map((a) => {
        if (a.id !== id) return a;
        const merged = { ...a, ...data, updatedAt: now };
        if (data.content !== undefined && !data.excerpt) {
          merged.excerpt = extractExcerpt(data.content);
          merged.readingTimeMinutes = estimateReadingTime(data.content);
        }
        if (data.title !== undefined) {
          merged.slug = generateSlug(data.title);
        }
        if (data.status === 'published' && a.status === 'draft') {
          merged.publishedAt = now;
        }
        return merged;
      });
      saveArticles(updated);

      if (data.status === 'published') {
        setActiveView('feed');
        setEditingArticleId(null);
      }
    },
    [allArticles, saveArticles],
  );

  const publishArticle = useCallback(
    (id: string) => {
      updateArticle(id, { status: 'published' });
    },
    [updateArticle],
  );

  const deleteArticle = useCallback(
    (id: string) => {
      saveArticles(allArticles.filter((a) => a.id !== id));
      saveComments(allComments.filter((c) => c.articleId !== id));
      if (activeArticleId === id) {
        setActiveArticleId(null);
        setActiveView('feed');
      }
      if (editingArticleId === id) {
        setEditingArticleId(null);
        setActiveView('my-articles');
      }
    },
    [allArticles, allComments, activeArticleId, editingArticleId, saveArticles, saveComments],
  );

  const upvoteArticle = useCallback(
    (id: string) => {
      const updated = allArticles.map((a) => {
        if (a.id !== id) return a;
        const hasVoted = a.upvotedBy.includes(currentUserId);
        if (hasVoted) {
          return {
            ...a,
            upvotes: a.upvotes - 1,
            upvotedBy: a.upvotedBy.filter((u) => u !== currentUserId),
          };
        }
        return {
          ...a,
          upvotes: a.upvotes + 1,
          upvotedBy: [...a.upvotedBy, currentUserId],
        };
      });
      saveArticles(updated);
    },
    [allArticles, currentUserId, saveArticles],
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      const updated = allArticles.map((a) => {
        if (a.id !== id) return a;
        const isBookmarked = a.bookmarkedBy.includes(currentUserId);
        if (isBookmarked) {
          return { ...a, bookmarkedBy: a.bookmarkedBy.filter((u) => u !== currentUserId) };
        }
        return { ...a, bookmarkedBy: [...a.bookmarkedBy, currentUserId] };
      });
      saveArticles(updated);
    },
    [allArticles, currentUserId, saveArticles],
  );

  /* ── comments ── */

  const getComments = useCallback(
    (articleId: string) =>
      allComments
        .filter((c) => c.articleId === articleId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [allComments],
  );

  const addComment = useCallback(
    (articleId: string, content: string, parentId?: string) => {
      if (!content.trim()) return;
      const now = new Date().toISOString();
      const id = 'cmt_' + Date.now();
      const comment: PressComment = {
        id,
        articleId,
        authorId: currentUserId,
        authorName: currentUserName,
        authorUsername: currentUserUsername,
        content: content.trim(),
        parentId,
        createdAt: now,
        reactions: [],
      };
      const nextComments = [...allComments, comment];
      saveComments(nextComments);

      // update article commentCount
      const nextArticles = allArticles.map((a) => {
        if (a.id === articleId) {
          return { ...a, commentCount: a.commentCount + 1 };
        }
        return a;
      });
      saveArticles(nextArticles);
    },
    [allArticles, allComments, currentUserId, currentUserName, currentUserUsername, saveArticles, saveComments],
  );

  const deleteComment = useCallback(
    (commentId: string) => {
      const target = allComments.find((c) => c.id === commentId);
      if (!target) return;

      // also remove children
      const idsToDelete = new Set<string>([commentId]);
      allComments.forEach((c) => {
        if (c.parentId === commentId) idsToDelete.add(c.id);
      });

      const nextComments = allComments.filter((c) => !idsToDelete.has(c.id));
      saveComments(nextComments);

      // decrement article commentCount
      const nextArticles = allArticles.map((a) => {
        if (a.id === target.articleId) {
          return {
            ...a,
            commentCount: Math.max(0, a.commentCount - idsToDelete.size),
          };
        }
        return a;
      });
      saveArticles(nextArticles);
    },
    [allArticles, allComments, saveArticles, saveComments],
  );

  const addCommentReaction = useCallback(
    (commentId: string, emoji: string) => {
      const updated = allComments.map((c) => {
        if (c.id !== commentId) return c;
        const existingIdx = c.reactions.findIndex((r) => r.emoji === emoji);
        let nextReactions = [...c.reactions];

        if (existingIdx >= 0) {
          const rxn = nextReactions[existingIdx];
          const hasReacted = rxn.users.includes(currentUserId);
          if (hasReacted) {
            const nextUsers = rxn.users.filter((u) => u !== currentUserId);
            if (nextUsers.length === 0) {
              nextReactions.splice(existingIdx, 1);
            } else {
              nextReactions[existingIdx] = {
                ...rxn,
                count: rxn.count - 1,
                users: nextUsers,
              };
            }
          } else {
            nextReactions[existingIdx] = {
              ...rxn,
              count: rxn.count + 1,
              users: [...rxn.users, currentUserId],
            };
          }
        } else {
          nextReactions.push({ emoji, count: 1, users: [currentUserId] });
        }

        return { ...c, reactions: nextReactions };
      });
      saveComments(updated);
    },
    [allComments, currentUserId, saveComments],
  );

  /* ── context value ── */

  return (
    <ZenPressContext.Provider
      value={{
        articles: publishedArticles,
        filteredArticles: publishedArticles,
        myDrafts,
        myPublished,
        bookmarkedArticles,
        getArticleById,
        createArticle,
        updateArticle,
        publishArticle,
        deleteArticle,
        upvoteArticle,
        toggleBookmark,
        getComments,
        addComment,
        deleteComment,
        addCommentReaction,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        activeView,
        setActiveView,
        activeArticleId,
        setActiveArticleId,
        editingArticleId,
        setEditingArticleId,
        editingArticle,
        setEditingArticle,
        currentUserId,
        currentUserName,
        currentUserUsername,
      }}
    >
      {children}
    </ZenPressContext.Provider>
  );
}

export function useZenPress() {
  const context = useContext(ZenPressContext);
  if (!context) {
    return {
      articles: [],
      filteredArticles: [],
      myDrafts: [],
      myPublished: [],
      bookmarkedArticles: [],
      getArticleById: () => undefined,
      createArticle: async () => ({} as any),
      updateArticle: () => {},
      deleteArticle: () => {},
      publishArticle: () => {},
      archiveArticle: () => {},
      toggleClap: () => {},
      toggleBookmark: () => {},
      addComment: () => {},
      activeView: 'feed',
      setActiveView: () => {},
      activeCategory: 'ALL',
      setActiveCategory: () => {},
      activeTab: 'all',
      setActiveTab: () => {},
      activeArticleId: null,
      setActiveArticleId: () => {},
      searchQuery: '',
      setSearchQuery: () => {},
      editingArticleId: null,
      setEditingArticleId: () => {},
      currentUserId: 'anonymous',
      currentUserName: 'Anonymous',
      currentUserUsername: 'anonymous',
      isEditor: false,
    } as unknown as ZenPressContextType;
  }
  return context;
}

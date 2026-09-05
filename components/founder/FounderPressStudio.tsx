'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  PenLine,
  Eye,
  Save,
  Send,
  Sparkles,
  Crown,
  ShieldAlert,
  FileText,
  Check,
  X,
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  CheckSquare,
  Trash2,
  ExternalLink,
  Share2,
  Radio,
  Search,
  Maximize2,
  Minimize2,
  Columns,
  Layers,
  Clock,
  BookOpen,
  Download,
  FolderOpen,
  Flame,
  AlertTriangle,
  Lightbulb,
  Scroll,
  Sliders,
  CheckCircle2,
  Video,
  Music
} from 'lucide-react';
import { PressArticle, PressCategory, ArticleStatus } from '@/types/press';
import { broadcastActivitySync } from '@/lib/reactiveActivityHub';

const LS_ARTICLES = 'zenvitra_press_articles_v4_clean';
const LS_PULSE_POSTS = 'zenvitra_pulse_posts_v6';
const LS_FOUNDER_DRAFT = 'zenvitra_founder_press_draft_v1';

const COVER_PRESETS = [
  {
    name: 'Sovereign Matrix',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1600&auto=format&fit=crop',
    tag: 'CYBERNETIC GOLD'
  },
  {
    name: 'Geneva Assembly',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=1600&auto=format&fit=crop',
    tag: 'DIPLOMACY'
  },
  {
    name: 'Cosmic Horizon',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop',
    tag: 'ARCHITECTURE'
  },
  {
    name: 'Constitutional Dawn',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop',
    tag: 'FOUNDER DECREE'
  },
  {
    name: 'Global Youth Wire',
    url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1600&auto=format&fit=crop',
    tag: 'PRESS WIRE'
  }
];

const DISPATCH_BADGES = [
  { id: 'FOUNDER_DISPATCH', label: '👑 Sovereign Founder Dispatch', color: 'border-amber-400/40 text-amber-300 bg-amber-400/10' },
  { id: 'CONSTITUTIONAL_DIRECTIVE', label: '📜 Constitutional Directive', color: 'border-purple-400/40 text-purple-300 bg-purple-400/10' },
  { id: 'INVESTIGATIVE_EXPOSE', label: '🔍 Sovereign Investigative Exposé', color: 'border-rose-400/40 text-rose-300 bg-rose-400/10' },
  { id: 'CRITICAL_BULLETIN', label: '🚨 Critical Platform Bulletin', color: 'border-red-500/50 text-red-300 bg-red-500/15 animate-pulse' },
  { id: 'YOUTH_MANIFESTO', label: '⚡ Youth Manifesto Chapter', color: 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10' },
];

const CATEGORIES: PressCategory[] = [
  'MANIFESTO',
  'ARCHITECTURE',
  'UPDATES',
  'EDITORIAL',
  'COMMUNITY',
];

interface FounderPressStudioProps {
  onArticlePublished?: (article: PressArticle) => void;
  notify?: (msg: string) => void;
}

export function FounderPressStudio({ onArticlePublished, notify }: FounderPressStudioProps) {
  // Navigation View inside Studio: 'editor' | 'archive'
  const [studioView, setStudioView] = useState<'editor' | 'archive'>('editor');

  // Form Fields
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [customSlug, setCustomSlug] = useState(false);
  const [category, setCategory] = useState<PressCategory>('MANIFESTO');
  const [dispatchBadge, setDispatchBadge] = useState('FOUNDER_DISPATCH');
  const [tagsInput, setTagsInput] = useState('#founder, #sovereign, #charter, #plenary');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [sourceName, setSourceName] = useState('Zenvitra Founder Executive Office');
  const [sourceUrl, setSourceUrl] = useState('https://zenvitra.org/manifesto');

  // Feature Toggles
  const [includeSignature, setIncludeSignature] = useState(true);
  const [syndicateToPulse, setSyndicateToPulse] = useState(true);
  const [pinToTop, setPinToTop] = useState(true);
  const [broadcastNotification, setBroadcastNotification] = useState(true);

  // Editor Layout Modes
  const [viewMode, setViewMode] = useState<'dual' | 'edit_only' | 'preview_only'>('dual');
  const [zenMode, setZenMode] = useState(false);

  // Status & Telemetry
  const [wordCount, setWordCount] = useState(0);
  const [readTimeMin, setReadTimeMin] = useState(1);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Article Database State
  const [allArticles, setAllArticles] = useState<PressArticle[]>([]);
  const [searchFilter, setSearchFilter] = useState('');

  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    if (notify) notify(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Load articles from localStorage
  const loadArticles = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(LS_ARTICLES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAllArticles(parsed);
          return;
        }
      }
    } catch (_) {}
    setAllArticles([]);
  }, []);

  useEffect(() => {
    loadArticles();
    window.addEventListener('storage', loadArticles);
    return () => window.removeEventListener('storage', loadArticles);
  }, [loadArticles]);

  // Live Metrics update (Words & Reading Time)
  const updateMetrics = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    setWordCount(words);
    setReadTimeMin(Math.max(1, Math.ceil(words / 220)));
  }, []);

  // Load auto-saved draft if starting fresh
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedDraft = localStorage.getItem(LS_FOUNDER_DRAFT);
      if (savedDraft && !editingId) {
        const d = JSON.parse(savedDraft);
        if (d.title) setTitle(d.title);
        if (d.subtitle) setSubtitle(d.subtitle);
        if (d.slug) setSlug(d.slug);
        if (d.category) setCategory(d.category);
        if (d.dispatchBadge) setDispatchBadge(d.dispatchBadge);
        if (d.tagsInput) setTagsInput(d.tagsInput);
        if (d.excerpt) setExcerpt(d.excerpt);
        if (d.coverImage) setCoverImage(d.coverImage);
        if (d.content && editorRef.current) {
          editorRef.current.innerHTML = d.content;
          updateMetrics();
        }
      }
    } catch (_) {}
  }, [editingId, updateMetrics]);

  // Generate slug from title
  useEffect(() => {
    if (!customSlug && title) {
      const s = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 60);
      setSlug(s);
    }
  }, [title, customSlug]);

  // Periodic Auto-save
  useEffect(() => {
    const timer = setInterval(() => {
      if (!editorRef.current) return;
      const content = editorRef.current.innerHTML;
      if (!title.trim() && !content.trim()) return;

      const draftPayload = {
        title,
        subtitle,
        slug,
        category,
        dispatchBadge,
        tagsInput,
        excerpt,
        coverImage,
        content,
        timestamp: Date.now()
      };
      try {
        localStorage.setItem(LS_FOUNDER_DRAFT, JSON.stringify(draftPayload));
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (_) {}
    }, 6000);

    return () => clearInterval(timer);
  }, [title, subtitle, slug, category, dispatchBadge, tagsInput, excerpt, coverImage]);

  // Formatting helper
  const execFormat = (cmd: string, val: string | undefined = undefined) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    updateMetrics();
  };

  // Custom Founder Component Insertions
  const insertFounderCallout = (type: 'decree' | 'crisis' | 'policy' | 'article') => {
    let html = '';
    if (type === 'decree') {
      html = `
        <div style="border: 1px solid rgba(251, 191, 36, 0.4); background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(0, 0, 0, 0.6)); border-radius: 16px; padding: 18px 24px; margin: 24px 0; font-family: monospace;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: bold; color: #fbbf24; text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em; margin-bottom: 8px;">
            👑 EXECUTIVE FOUNDER DECREE
          </div>
          <div style="font-size: 14px; color: #fef08a; line-height: 1.6; font-style: italic;">
            "State your supreme sovereign directive, policy standard, or founding vision principle here..."
          </div>
        </div><p></p>
      `;
    } else if (type === 'crisis') {
      html = `
        <div style="border: 1px solid rgba(244, 63, 94, 0.5); background: linear-gradient(135deg, rgba(225, 29, 72, 0.15), rgba(0, 0, 0, 0.7)); border-radius: 16px; padding: 18px 24px; margin: 24px 0; font-family: monospace;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: bold; color: #fda4af; text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em; margin-bottom: 8px;">
            🚨 EMERGENCY WIRE & CRISIS BULLETIN
          </div>
          <div style="font-size: 13px; color: #ffffff; line-height: 1.6;">
            Detail the immediate emergency development, parliamentary motion, or network event.
          </div>
        </div><p></p>
      `;
    } else if (type === 'policy') {
      html = `
        <div style="border: 1px solid rgba(34, 211, 238, 0.4); background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(0, 0, 0, 0.6)); border-radius: 16px; padding: 18px 24px; margin: 24px 0; font-family: monospace;">
          <div style="display: flex; align-items: center; gap: 8px; font-weight: bold; color: #67e8f9; text-transform: uppercase; font-size: 11px; letter-spacing: 0.15em; margin-bottom: 8px;">
            💡 ARCHITECTURAL SPECIFICATION
          </div>
          <div style="font-size: 13px; color: #e0f2fe; line-height: 1.6;">
            Outline the cryptographic, economic, or school modernization mechanics with empirical data.
          </div>
        </div><p></p>
      `;
    } else if (type === 'article') {
      html = `
        <div style="border-left: 3px solid #c084fc; padding-left: 16px; margin: 20px 0; font-family: monospace; font-size: 13px; color: #e9d5ff;">
          <strong style="color: #f3e8ff;">ARTICLE REFERENCE:</strong> "Cite specific clauses of the Zenvitra Sovereign Charter or 25% Profit Endowment Mandate."
        </div><p></p>
      `;
    }
    execFormat('insertHTML', html);
  };

  const insertDivider = () => {
    const html = `
      <div style="margin: 36px 0; display: flex; align-items: center; justify-content: center; gap: 12px;">
        <div style="height: 1px; flex-grow: 1; background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent);"></div>
        <span style="color: #fbbf24; font-size: 12px;">👑 • ⚡ • 👑</span>
        <div style="height: 1px; flex-grow: 1; background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.5), transparent);"></div>
      </div><p></p>
    `;
    execFormat('insertHTML', html);
  };

  const insertImageDialog = () => {
    const url = prompt('Enter direct image URL (HTTPS):');
    if (!url) return;
    const caption = prompt('Enter image caption (optional):') || '';
    const html = `
      <figure style="margin: 28px 0; text-align: center;">
        <img src="${url}" alt="${caption}" style="max-width: 100%; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.8);" />
        ${caption ? `<figcaption style="margin-top: 8px; font-family: monospace; font-size: 11px; color: #a3a3a3;">${caption}</figcaption>` : ''}
      </figure><p></p>
    `;
    execFormat('insertHTML', html);
  };

  const insertVideoEmbed = () => {
    const url = prompt('Enter YouTube or Vimeo URL:');
    if (!url) return;
    let embedUrl = url;
    if (url.includes('youtube.com/watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
      embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    const html = `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 16px; margin: 28px 0; border: 1px solid rgba(255,255,255,0.15);">
        <iframe src="${embedUrl}" style="position: absolute; top:0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
      </div><p></p>
    `;
    execFormat('insertHTML', html);
  };

  // Direct Cover File Upload
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        setCoverImage(evt.target.result as string);
        showToast('Cover image loaded from local device');
      }
    };
    reader.readAsDataURL(file);
  };

  // Compile full article payload
  const compileArticle = (status: ArticleStatus): PressArticle => {
    let contentHtml = editorRef.current?.innerHTML || '';

    // Append digital signature if enabled
    if (includeSignature && !contentHtml.includes('SOVEREIGN SIGNATURE HASH')) {
      const now = new Date().toUTCString();
      const randomHash = Math.random().toString(36).substring(2, 12).toUpperCase();
      contentHtml += `
        <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(251, 191, 36, 0.25); display: flex; flex-direction: column; gap: 8px; font-family: monospace; font-size: 11px; color: #fbbf24;">
          <div style="font-weight: bold; letter-spacing: 0.1em;">
            👑 RATIFIED BY THE OFFICE OF THE FOUNDER
          </div>
          <div style="color: #d4d4d8;">
            Yuveer &bull; Sovereign System Architect & Founder, Zenvitra Youth Network
          </div>
          <div style="color: #71717a; font-size: 9px; letter-spacing: 0.05em;">
            SEAL TIMESTAMP: ${now} &bull; SOVEREIGN SIGNATURE HASH: SHA256-ZN-${randomHash}
          </div>
        </div>
      `;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const nowIso = new Date().toISOString();
    const finalId = editingId || `art_founder_${Date.now()}`;

    return {
      id: finalId,
      title: title.trim() || 'Untitled Founder Dispatch',
      slug: slug || `founder-dispatch-${Date.now().toString(36)}`,
      content: contentHtml,
      excerpt: excerpt.trim() || (editorRef.current?.innerText.slice(0, 180).trim() + '…') || 'Founder executive memorandum.',
      coverImage: coverImage || undefined,
      sourceName: sourceName.trim() || 'Zenvitra Founder Executive Office',
      sourceUrl: sourceUrl.trim() || 'https://zenvitra.org',
      authorId: 'yuveer',
      authorName: 'Yuveer',
      authorUsername: 'yuveer',
      authorAvatar: '👑',
      category,
      tags: tags.length > 0 ? tags : ['founder', 'sovereign'],
      status,
      isOfficial: true,
      createdAt: nowIso,
      updatedAt: nowIso,
      publishedAt: status === 'published' ? nowIso : undefined,
      readingTimeMinutes: readTimeMin,
      upvotes: 7,
      upvotedBy: ['yuveer'],
      bookmarkedBy: [],
      commentCount: 0,
    };
  };

  // Save as Draft
  const handleSaveDraft = () => {
    const article = compileArticle('draft');
    const existing = allArticles.filter((a) => a.id !== article.id);
    const updated = [article, ...existing];
    setAllArticles(updated);
    try {
      localStorage.setItem(LS_ARTICLES, JSON.stringify(updated));
      localStorage.removeItem(LS_FOUNDER_DRAFT);
      showToast('💾 Dispatch saved to Founder Drafts');
    } catch (_) {}
  };

  // Publish Worldwide to /press
  const handlePublish = () => {
    if (!title.trim()) {
      showToast('⚠️ Please enter an article title before publishing.');
      return;
    }

    const article = compileArticle('published');
    const existing = allArticles.filter((a) => a.id !== article.id);

    // If pin to top, place at index 0
    const updated = [article, ...existing];
    setAllArticles(updated);

    try {
      localStorage.setItem(LS_ARTICLES, JSON.stringify(updated));
      localStorage.removeItem(LS_FOUNDER_DRAFT);

      // 1. Trigger live Press sync
      broadcastActivitySync({
        source: 'press',
        action: 'create',
        timestamp: Date.now(),
        metadata: { id: article.id, title: article.title }
      });

      // 2. Syndicate to ZEN.PULSE if requested
      if (syndicateToPulse) {
        try {
          const storedPosts = JSON.parse(localStorage.getItem(LS_PULSE_POSTS) || '[]');
          const pulsePost = {
            id: `post_from_press_${article.id}`,
            authorId: 'yuveer',
            authorName: 'Yuveer',
            authorUsername: 'yuveer',
            authorRole: 'FOUNDER',
            content: `📰 [FOUNDER DISPATCH PUBLISHED]\n\n"${article.title}"\n\n${article.excerpt}\n\nRead full report on ZEN.PRESS: /press`,
            images: article.coverImage ? [article.coverImage] : [],
            location: 'Founder Wire Desk',
            tags: ['founder', 'press', article.category.toLowerCase()],
            createdAt: new Date().toISOString(),
            likes: 12,
            likedBy: ['yuveer'],
            reposts: 4,
            repostedBy: [],
            replyCount: 0,
            postType: 'treaty',
          };
          localStorage.setItem(LS_PULSE_POSTS, JSON.stringify([pulsePost, ...storedPosts]));
          broadcastActivitySync({
            source: 'post',
            action: 'create',
            timestamp: Date.now()
          });
        } catch (_) {}
      }

      // 3. Browser Notification
      if (broadcastNotification && typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          new Notification('👑 New Founder Dispatch Published', {
            body: `"${article.title}" by @yuveer is now live on ZEN.PRESS!`,
            icon: '/favicon.ico'
          });
        }
      }

      showToast(`🚀 Worldwide Broadcast Active! "${article.title}" published to /press`);
      if (onArticlePublished) onArticlePublished(article);

      // Reset form
      setEditingId(null);
      setTitle('');
      setSubtitle('');
      setExcerpt('');
      if (editorRef.current) editorRef.current.innerHTML = '';
      updateMetrics();
    } catch (err: any) {
      showToast(`Error publishing: ${err.message}`);
    }
  };

  // Load article to edit
  const handleEditArticle = (art: PressArticle) => {
    setEditingId(art.id);
    setTitle(art.title);
    setSlug(art.slug);
    setCustomSlug(true);
    setCategory(art.category);
    setTagsInput(art.tags.map((t) => `#${t}`).join(', '));
    setExcerpt(art.excerpt);
    setCoverImage(art.coverImage || COVER_PRESETS[0].url);
    setSourceName(art.sourceName);
    setSourceUrl(art.sourceUrl);
    setStudioView('editor');
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = art.content;
        updateMetrics();
      }
    }, 100);
    showToast(`Loaded article: "${art.title}"`);
  };

  // Delete article
  const handleDeleteArticle = (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this Founder article from the Press wire?')) return;
    const updated = allArticles.filter((a) => a.id !== id);
    setAllArticles(updated);
    try {
      localStorage.setItem(LS_ARTICLES, JSON.stringify(updated));
      broadcastActivitySync({ source: 'press', action: 'delete', timestamp: Date.now() });
      showToast('Article deleted from wire.');
    } catch (_) {}
  };

  // Export as Markdown
  const handleExportMarkdown = () => {
    const md = `# ${title}\n\n**Author:** Yuveer (@yuveer)\n**Category:** ${category}\n**Tags:** ${tagsInput}\n**Date:** ${new Date().toISOString()}\n\n---\n\n${editorRef.current?.innerText || ''}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug || 'founder-dispatch'}.md`;
    a.click();
    showToast('Exported article as Markdown');
  };

  const filteredArchive = allArticles.filter((a) => {
    const q = searchFilter.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.authorUsername.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`space-y-6 w-full text-white font-sans ${zenMode ? 'fixed inset-0 z-[100] bg-black p-6 overflow-y-auto' : ''}`}>
      {/* ── TOP EXECUTIVE CONTROL BAR ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-[#090b14] border border-amber-500/30 shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-rose-500/20 to-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[10px] text-amber-300 font-bold uppercase tracking-widest">
                PERSONAL PRESS BUREAU &bull; OPERATOR @yuveer
              </span>
            </div>
            <h2 className="font-display font-bold text-xl text-white">
              Sovereign Founder Press Studio
            </h2>
          </div>
        </div>

        {/* View Toggles & Actions */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono">
          <div className="flex items-center bg-black/60 p-1 rounded-2xl border border-white/10">
            <button
              type="button"
              onClick={() => setStudioView('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${
                studioView === 'editor'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Editor Studio</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setStudioView('archive');
                loadArticles();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${
                studioView === 'archive'
                  ? 'bg-amber-400 text-black shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Wire Archive ({allArticles.length})</span>
            </button>
          </div>

          <Link
            href="/press"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition"
          >
            <span>Live /press</span>
            <ExternalLink className="w-3 h-3 text-amber-400" />
          </Link>

          <button
            type="button"
            onClick={() => setZenMode(!zenMode)}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
            title="Toggle Zen Fullscreen Mode"
          >
            {zenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-black border border-amber-400/40 text-amber-200 text-xs font-mono flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button type="button" onClick={() => setFeedback(null)} className="text-neutral-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODE A: FOUNDER ARTICLES ARCHIVE & MANAGEMENT
      ───────────────────────────────────────────────────────────── */}
      {studioView === 'archive' && (
        <div className="p-6 rounded-3xl bg-[#080a10] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 font-mono text-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search headlines, tags, excerpts..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black border border-white/15 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/60"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle('');
                setSubtitle('');
                setExcerpt('');
                if (editorRef.current) editorRef.current.innerHTML = '';
                setStudioView('editor');
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Draft New Dispatch</span>
            </button>
          </div>

          <div className="space-y-3">
            {filteredArchive.length === 0 ? (
              <div className="p-12 text-center text-neutral-500 font-mono text-xs border border-dashed border-white/10 rounded-2xl">
                No articles found matching query. Click "Draft New Dispatch" to author your first article.
              </div>
            ) : (
              filteredArchive.map((art) => (
                <div
                  key={art.id}
                  className="p-5 rounded-2xl bg-black/60 border border-white/10 hover:border-amber-400/30 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        art.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}>
                        {art.status}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                        {art.category}
                      </span>
                      {art.isOfficial && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                          👑 FOUNDER OFFICIAL
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-neutral-500">
                        {new Date(art.createdAt).toLocaleDateString()} &bull; {art.readingTimeMinutes} min read
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-base text-white hover:text-amber-300 transition truncate">
                      {art.title}
                    </h3>

                    <p className="text-xs text-neutral-400 font-sans line-clamp-2">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => handleEditArticle(art)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <PenLine className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit</span>
                    </button>
                    <Link
                      href="/press"
                      target="_blank"
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
                      title="View on Wire"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODE B: COMPLETE WYSIWYG FOUNDER EDITOR STUDIO
      ───────────────────────────────────────────────────────────── */}
      {studioView === 'editor' && (
        <div className="space-y-6">
          {/* Metadata & Headline Config Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#080a10] border border-amber-500/30 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                  Dispatch Meta &amp; Sovereign Attribution
                </span>
              </div>
              <div className="text-[11px] font-mono text-neutral-400">
                {lastSavedTime && <span>Auto-saved: {lastSavedTime} &bull; </span>}
                <strong className="text-amber-300">{wordCount} Words</strong> &bull; {readTimeMin} min read
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest font-semibold block">
                  Headline / Directive Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. The Sovereign Charter: Decoupling Youth Discourse from Ad Algorithms"
                  className="w-full px-5 py-3.5 rounded-2xl bg-black border border-white/15 text-white font-display font-bold text-lg sm:text-xl placeholder-neutral-600 focus:outline-none focus:border-amber-400/60 shadow-inner"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                  Lead Subtitle / Deck (Optional)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. An executive memorandum tabling 100% secular governance and hardcoded 25% profit educational endowment."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-neutral-200 text-xs font-mono placeholder-neutral-600 focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>

            {/* Custom Slug & Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-neutral-400 uppercase">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PressCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white focus:outline-none focus:border-amber-400/50 cursor-pointer"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 uppercase">Founder Ribbon Type</label>
                <select
                  value={dispatchBadge}
                  onChange={(e) => setDispatchBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-amber-300 focus:outline-none focus:border-amber-400/50 cursor-pointer"
                >
                  {DISPATCH_BADGES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 uppercase">Vanity Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setCustomSlug(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="custom-slug"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-amber-400/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 uppercase">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="#founder, #policy, #sovereign"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/15 text-neutral-300 font-mono text-xs focus:outline-none focus:border-amber-400/50"
                />
              </div>
            </div>

            {/* Cover Image Preset Selector */}
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-neutral-400 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cover Artwork &amp; Backdrop</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 font-mono text-[10px] transition cursor-pointer flex items-center gap-1 border border-white/10"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload Device Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Cover Wallpapers Presets */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
                {COVER_PRESETS.map((preset) => (
                  <div
                    key={preset.name}
                    onClick={() => setCoverImage(preset.url)}
                    className={`relative h-18 rounded-xl overflow-hidden cursor-pointer border transition group ${
                      coverImage === preset.url
                        ? 'border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-2 ring-amber-400/40'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-2">
                      <span className="font-mono text-[9px] text-white font-bold truncate">{preset.name}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Cover URL input */}
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Or paste custom cover image URL (HTTPS)..."
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/10 text-neutral-300 font-mono text-xs focus:outline-none focus:border-amber-400/50"
              />
            </div>

            {/* Executive Syndication Toggles */}
            <div className="p-4 rounded-2xl bg-black/70 border border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono text-left">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-neutral-300">
                <input
                  type="checkbox"
                  checked={syndicateToPulse}
                  onChange={(e) => setSyndicateToPulse(e.target.checked)}
                  className="rounded border-white/20 text-amber-400 focus:ring-0 bg-black cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-400" />
                  <span>Cross-Post to ZEN.PULSE</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-neutral-300">
                <input
                  type="checkbox"
                  checked={pinToTop}
                  onChange={(e) => setPinToTop(e.target.checked)}
                  className="rounded border-white/20 text-amber-400 focus:ring-0 bg-black cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pin as Lead Wire Story</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-neutral-300">
                <input
                  type="checkbox"
                  checked={includeSignature}
                  onChange={(e) => setIncludeSignature(e.target.checked)}
                  className="rounded border-white/20 text-amber-400 focus:ring-0 bg-black cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5 text-purple-400" />
                  <span>Digital Founder Seal</span>
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white text-neutral-300">
                <input
                  type="checkbox"
                  checked={broadcastNotification}
                  onChange={(e) => setBroadcastNotification(e.target.checked)}
                  className="rounded border-white/20 text-amber-400 focus:ring-0 bg-black cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Global Push Alert</span>
                </span>
              </label>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              WYSIWYG FORMATTING TOOLBAR
          ───────────────────────────────────────────────────────────── */}
          <div className="sticky top-2 z-30 p-2.5 rounded-2xl bg-[#0a0d18]/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl flex items-center justify-between gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
            {/* Group 1: History */}
            <div className="flex items-center gap-1 shrink-0 border-r border-white/10 pr-2">
              <button
                type="button"
                onClick={() => execFormat('undo')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
                title="Undo"
              >
                <Undo className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execFormat('redo')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
                title="Redo"
              >
                <Redo className="w-4 h-4" />
              </button>
            </div>

            {/* Group 2: Text Styling */}
            <div className="flex items-center gap-1 shrink-0 border-r border-white/10 pr-2">
              <button
                type="button"
                onClick={() => execFormat('bold')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white font-bold transition"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execFormat('italic')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white italic transition"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execFormat('underline')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white underline transition"
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execFormat('strikeThrough')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition"
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            {/* Group 3: Headings */}
            <div className="flex items-center gap-1 shrink-0 border-r border-white/10 pr-2">
              <button
                type="button"
                onClick={() => execFormat('formatBlock', '<h1>')}
                className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white font-bold"
                title="Heading 1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => execFormat('formatBlock', '<h2>')}
                className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white font-bold"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => execFormat('formatBlock', '<h3>')}
                className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white font-bold"
                title="Heading 3"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => execFormat('formatBlock', '<p>')}
                className="px-2.5 py-1 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white font-mono"
                title="Paragraph"
              >
                ¶
              </button>
            </div>

            {/* Group 4: Alignment */}
            <div className="flex items-center gap-1 shrink-0 border-r border-white/10 pr-2">
              <button
                type="button"
                onClick={() => execFormat('justifyLeft')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white"
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execFormat('justifyCenter')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white"
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execFormat('justifyRight')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white"
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            {/* Group 5: Lists & Quotes */}
            <div className="flex items-center gap-1 shrink-0 border-r border-white/10 pr-2">
              <button
                type="button"
                onClick={() => execFormat('insertUnorderedList')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white"
                title="Bullet List"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execFormat('insertOrderedList')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white"
                title="Numbered List"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => execFormat('formatBlock', '<blockquote>')}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white"
                title="Blockquote"
              >
                <Quote className="w-4 h-4" />
              </button>
            </div>

            {/* Group 6: Custom Callouts & Media */}
            <div className="flex items-center gap-1.5 shrink-0 border-r border-white/10 pr-2">
              <button
                type="button"
                onClick={() => insertFounderCallout('decree')}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 cursor-pointer"
                title="Insert Founder Decree Box"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Decree</span>
              </button>
              <button
                type="button"
                onClick={() => insertFounderCallout('crisis')}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 cursor-pointer"
                title="Insert Crisis Callout"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Crisis</span>
              </button>
              <button
                type="button"
                onClick={() => insertFounderCallout('policy')}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 cursor-pointer"
                title="Insert Policy Box"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Policy</span>
              </button>
              <button
                type="button"
                onClick={insertImageDialog}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer"
                title="Insert Image"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={insertVideoEmbed}
                className="p-2 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer"
                title="Embed Video"
              >
                <Video className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={insertDivider}
                className="px-2 py-1 rounded-lg hover:bg-white/10 text-amber-400 font-bold cursor-pointer"
                title="Insert Crest Divider"
              >
                ―✦―
              </button>
            </div>

            {/* Group 7: View Mode Switcher */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('edit_only')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'edit_only' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'}`}
                title="Editor Only"
              >
                <PenLine className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('dual')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'dual' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'}`}
                title="Dual Pane (Edit + Live Preview)"
              >
                <Columns className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview_only')}
                className={`p-1.5 rounded-lg transition cursor-pointer ${viewMode === 'preview_only' ? 'bg-white/20 text-white' : 'text-neutral-400 hover:text-white'}`}
                title="Preview Only"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              DUAL-PANE EDITOR & READER PREVIEW
          ───────────────────────────────────────────────────────────── */}
          <div className={`grid gap-6 ${viewMode === 'dual' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {/* LEFT PANE: WYSIWYG Editable Document */}
            {(viewMode === 'dual' || viewMode === 'edit_only') && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#040508] border border-white/15 min-h-[600px] flex flex-col space-y-4 shadow-2xl text-left">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] font-mono text-neutral-400">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>FOUNDER DOCUMENT COMPOSER</span>
                  </span>
                  <span>HTML &bull; RICH STYLING ACTIVE</span>
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  onInput={updateMetrics}
                  className="flex-1 w-full min-h-[500px] text-neutral-100 font-sans text-base leading-relaxed focus:outline-none selection:bg-amber-400 selection:text-black space-y-4"
                  style={{ wordBreak: 'break-word' }}
                />
              </div>
            )}

            {/* RIGHT PANE: Real-time Live Reader View (/press Simulation) */}
            {(viewMode === 'dual' || viewMode === 'preview_only') && (
              <div className="p-6 sm:p-8 rounded-3xl bg-[#08090f] border border-amber-500/20 min-h-[600px] shadow-2xl text-left space-y-6 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[11px] font-mono text-amber-300">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Citizen Reader View (/press)</span>
                  </span>
                  <span className="text-neutral-500">REAL-TIME SIMULATION</span>
                </div>

                {/* Article Header Preview */}
                <div className="space-y-4">
                  {/* Category & Ribbon */}
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 font-mono text-xs font-bold uppercase">
                      {category}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>FOUNDER OFFICIAL</span>
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      &bull; {readTimeMin} min read &bull; {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight leading-tight">
                    {title || 'Untitled Founder Dispatch'}
                  </h1>

                  {/* Subtitle */}
                  {subtitle && (
                    <p className="text-sm font-sans text-neutral-300 italic leading-relaxed">
                      {subtitle}
                    </p>
                  )}

                  {/* Founder Profile Stamp */}
                  <div className="flex items-center gap-3 py-3 border-y border-white/10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-md">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-sm text-amber-300">
                        👑
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Yuveer</span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[9px] font-bold">
                          FOUNDER
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-mono">
                        @yuveer &bull; Sovereign System Architect
                      </p>
                    </div>
                  </div>

                  {/* Cover Image Preview */}
                  {coverImage && (
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-56 sm:h-72 w-full">
                      <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Rendered Body Preview */}
                  <div
                    className="prose prose-invert max-w-none text-neutral-200 text-sm leading-relaxed space-y-4 pt-2"
                    dangerouslySetInnerHTML={{
                      __html: editorRef.current?.innerHTML || '<p className="text-neutral-500 italic">Body content will render here in real time as you compose...</p>'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              BOTTOM ACTION PUBLISHING DOCK
          ───────────────────────────────────────────────────────────── */}
          <div className="p-5 rounded-3xl bg-[#090b14] border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 font-mono text-xs text-neutral-400">
              <button
                type="button"
                onClick={handleExportMarkdown}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer border border-white/10"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .MD</span>
              </button>
              <span>Status: <strong className="text-amber-400">FOUNDER CLEARANCE LEVEL 0</strong></span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-white/10"
              >
                <Save className="w-4 h-4 text-neutral-300" />
                <span>Save to Drafts</span>
              </button>

              <button
                type="button"
                onClick={handlePublish}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-display font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_25px_rgba(251,191,36,0.4)] transform hover:scale-[1.02]"
              >
                <Send className="w-4 h-4" />
                <span>Publish Worldwide to /press &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FounderPressStudio;

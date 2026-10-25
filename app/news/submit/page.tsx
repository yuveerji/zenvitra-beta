'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Send, 
  Radio, 
  Newspaper, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  ExternalLink, 
  Globe2, 
  Clock, 
  Flame, 
  ShieldCheck, 
  Scale, 
  Share2, 
  Plus, 
  Trash2, 
  Eye, 
  Layers, 
  AlertCircle,
  HelpCircle,
  Building2,
  BookOpen,
  Check,
  Upload,
  Image as ImageIcon,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Crop,
  Link as LinkIcon,
  RefreshCw,
  Grid,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  Info
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  NewsCategory, 
  NewsStory, 
  NewsTimelineUpdate, 
  NewsSourceCitation, 
  NewsCoverAdjustment 
} from '@/types/news';
import { PressArticle, PressCategory } from '@/types/press';
import { PulsePost } from '@/types/pulse';
import { notifyCategorySubscribers } from '@/lib/categorySubscriptionService';
import { DesktopModeAdvisory } from '@/components/common/DesktopModeAdvisory';
import { PressDraftPreviewModal } from '@/components/press/PressDraftPreviewModal';

const CATEGORIES: { value: NewsCategory; label: string; pressCategory: PressCategory; color: string }[] = [
  { value: 'BREAKING', label: 'Breaking News', pressCategory: 'UPDATES', color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
  { value: 'INTERNATIONAL_AFFAIRS', label: 'International Affairs', pressCategory: 'EDITORIAL', color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10' },
  { value: 'INDIA', label: 'India National', pressCategory: 'EDITORIAL', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  { value: 'WORLD', label: 'World Affairs', pressCategory: 'EDITORIAL', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { value: 'YOUTH', label: 'Youth & Model UN', pressCategory: 'COMMUNITY', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { value: 'TECHNOLOGY', label: 'Technology & Cyber', pressCategory: 'ARCHITECTURE', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { value: 'AI', label: 'Artificial Intelligence', pressCategory: 'ARCHITECTURE', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
  { value: 'EDUCATION', label: 'Education & Civics', pressCategory: 'COMMUNITY', color: 'text-teal-400 border-teal-500/30 bg-teal-500/10' },
  { value: 'ECONOMY', label: 'Global Economy & Trade', pressCategory: 'EDITORIAL', color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
  { value: 'ENVIRONMENT', label: 'Climate & Environment', pressCategory: 'MANIFESTO', color: 'text-green-400 border-green-500/30 bg-green-500/10' },
  { value: 'SCIENCE', label: 'Science & Research', pressCategory: 'ARCHITECTURE', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  { value: 'SOCIETY', label: 'Society & Culture', pressCategory: 'MANIFESTO', color: 'text-pink-400 border-pink-500/30 bg-pink-500/10' },
];

const PRESET_COVERS = [
  { label: 'Breaking News Ticker', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Global Diplomacy Summit', url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Chamber Plenary Floor', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Science & AI Mesh', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Climate Action Assembly', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' },
];

interface FormSourceItem {
  id: string;
  name: string;        // e.g. "TOI - Article X"
  url: string;         // e.g. "https://timesofindia..."
  label: string;       // e.g. "Source #1"
  domain?: string;
  isLoading?: boolean;
  error?: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) + '-' + Math.random().toString(36).substring(2, 6);
}

export default function SubmitNewsWirePage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const authorName = profile?.display_name || user?.name || 'Sovereign Correspondent';
  const authorUsername = (profile?.username || 'correspondent').toLowerCase().replace(/^@/, '');
  const authorId = profile?.id || user?.id || 'usr_news_author';

  // Form State
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState<NewsCategory>('BREAKING');
  const [location, setLocation] = useState('New Delhi // Global Wire Mesh');
  const [summary, setSummary] = useState('');
  const [whatHappened, setWhatHappened] = useState('');
  const [isBreaking, setIsBreaking] = useState(true);
  const [tagsInput, setTagsInput] = useState('#Wire, #LiveDispatch, #Breaking');

  // Custom Image Upload & Photo Adjuster State
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [galleryImages, setGalleryImages] = useState<string[]>([PRESET_COVERS[0].url]);
  const [showFinalDraftModal, setShowFinalDraftModal] = useState(false);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const movePhoto = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= galleryImages.length) return;
    setGalleryImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      setCoverImage(copy[0] || PRESET_COVERS[0].url);
      return copy;
    });
  };

  const removePhoto = (idx: number) => {
    setGalleryImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      const fallback = next.length > 0 ? next : [PRESET_COVERS[0].url];
      setCoverImage(fallback[0]);
      return fallback;
    });
  };
  const [coverAdjustment, setCoverAdjustment] = useState<NewsCoverAdjustment>({
    scale: 1,
    positionX: 50,
    positionY: 50,
    aspectRatio: '16:9',
    fit: 'cover',
  });
  const [showAdjuster, setShowAdjuster] = useState(false);
  const [showRuleOfThirds, setShowRuleOfThirds] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-Source State (Strictly Zero Seeded Data: initialized with one empty source card)
  const [sources, setSources] = useState<FormSourceItem[]>([
    {
      id: 'src_1',
      name: '',
      url: '',
      label: 'Source #1',
      domain: '',
    }
  ]);
  
  // Structured investigative elements
  const [timelineItems, setTimelineItems] = useState<{ time: string; headline: string; content: string }[]>([
    {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      headline: 'Initial Wire Flash Dispatched',
      content: 'Primary verification received from accredited diplomatic/civic correspondents on the ground.'
    }
  ]);
  const [whatWeKnow, setWhatWeKnow] = useState<string[]>([
    'Primary facts independently verified across sovereign communication channels.',
    'Official records or communique statements have been archived.'
  ]);
  const [whatRemainsUnclear, setWhatRemainsUnclear] = useState<string[]>([
    'Long-term implementation timelines pending committee review.'
  ]);
  const [article12Affirmed, setArticle12Affirmed] = useState(false);

  // Preview Mode
  const [previewTab, setPreviewTab] = useState<'news' | 'press' | 'pulse'>('news');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIds, setSubmittedIds] = useState<{ newsId: string; pressId: string; pulseId: string } | null>(null);

  // Custom Image File Handlers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const res = reader.result;
          setGalleryImages((prev) => {
            const isDefaultOnly = prev.length === 1 && prev[0] === PRESET_COVERS[0].url;
            const updated = isDefaultOnly ? [res] : [...prev, res];
            setCoverImage(updated[0]);
            return updated;
          });
          setShowAdjuster(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            const res = reader.result;
            setGalleryImages((prev) => {
              const isDefaultOnly = prev.length === 1 && prev[0] === PRESET_COVERS[0].url;
              const updated = isDefaultOnly ? [res] : [...prev, res];
              setCoverImage(updated[0]);
              return updated;
            });
            setShowAdjuster(true);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleResetAdjuster = () => {
    setCoverAdjustment({
      scale: 1,
      positionX: 50,
      positionY: 50,
      aspectRatio: '16:9',
      fit: 'cover',
    });
  };

  // Dynamic Multiple Sources Handlers & Automated URL Heading Reader
  const handleAddSource = () => {
    const nextIndex = sources.length + 1;
    setSources([
      ...sources,
      {
        id: `src_${Date.now()}_${nextIndex}`,
        name: '',
        url: '',
        label: `Source #${nextIndex}`,
        domain: '',
      }
    ]);
  };

  const handleRemoveSource = (idx: number) => {
    const remaining = sources.filter((_, i) => i !== idx);
    const reindexed = remaining.map((s, i) => ({
      ...s,
      label: `Source #${i + 1}`,
    }));
    setSources(
      reindexed.length > 0 
        ? reindexed 
        : [{ id: `src_${Date.now()}`, name: '', url: '', label: 'Source #1', domain: '' }]
    );
  };

  const handleUpdateSource = (idx: number, field: 'name' | 'url', val: string) => {
    setSources((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s))
    );
  };

  const handleFetchUrlHeading = async (idx: number, customUrl?: string) => {
    const targetUrl = (customUrl !== undefined ? customUrl : sources[idx]?.url || '').trim();
    if (!targetUrl) return;

    setSources((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, isLoading: true, error: undefined } : s))
    );

    try {
      const res = await fetch('/api/fetch-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSources((prev) =>
          prev.map((s, i) =>
            i === idx
              ? {
                  ...s,
                  name: data.formattedHeading || `${data.publication} - ${data.title}`,
                  domain: data.domain,
                  isLoading: false,
                  error: undefined,
                }
              : s
          )
        );
      } else {
        setSources((prev) =>
          prev.map((s, i) =>
            i === idx
              ? {
                  ...s,
                  error: data.error || 'Could not auto-read heading',
                  isLoading: false,
                }
              : s
          )
        );
      }
    } catch {
      setSources((prev) =>
        prev.map((s, i) =>
          i === idx
            ? {
                ...s,
                error: 'Network error fetching title',
                isLoading: false,
              }
            : s
        )
      );
    }
  };

  // Dynamic Timeline & Fact Handlers
  const handleAddTimelineItem = () => {
    setTimelineItems([
      ...timelineItems,
      {
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        headline: '',
        content: ''
      }
    ]);
  };

  const handleRemoveTimelineItem = (idx: number) => {
    setTimelineItems(timelineItems.filter((_, i) => i !== idx));
  };

  const handleAddWhatWeKnow = () => {
    setWhatWeKnow([...whatWeKnow, '']);
  };

  const handleRemoveWhatWeKnow = (idx: number) => {
    setWhatWeKnow(whatWeKnow.filter((_, i) => i !== idx));
  };

  const handleAddWhatRemainsUnclear = () => {
    setWhatRemainsUnclear([...whatRemainsUnclear, '']);
  };

  const handleRemoveWhatRemainsUnclear = (idx: number) => {
    setWhatRemainsUnclear(whatRemainsUnclear.filter((_, i) => i !== idx));
  };

  // Submit Handler: Multi-Platform Triple-Sync
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) {
      alert('Please enter a headline for this news wire.');
      return;
    }
    if (!summary.trim()) {
      alert('Please enter an executive summary / lead paragraph.');
      return;
    }
    if (!whatHappened.trim()) {
      alert('Please enter the full dispatch body / report.');
      return;
    }
    if (!article12Affirmed) {
      alert('You must affirm Article 12 compliance (truthfulness & factual integrity) before transmitting to the wire.');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const uniqueSuffix = Date.now().toString(36);
      const cleanSlug = generateSlug(headline);
      const parsedTags = Array.from(new Set(
        tagsInput
          .split(',')
          .map(t => t.trim())
          .filter(Boolean)
          .map(t => (t.startsWith('#') ? t : `#${t}`))
      ));

      const selectedCategoryObj = CATEGORIES.find(c => c.value === category) || CATEGORIES[0];

      // Format Valid Sources
      const validSources: NewsSourceCitation[] = sources
        .filter(s => s.url.trim() || s.name.trim())
        .map((s, i) => {
          let cleanUrl = s.url.trim();
          if (cleanUrl && !cleanUrl.startsWith('http')) {
            cleanUrl = `https://${cleanUrl}`;
          }
          let resolvedDomain = s.domain;
          if (!resolvedDomain && cleanUrl) {
            try {
              resolvedDomain = new URL(cleanUrl).hostname;
            } catch {
              resolvedDomain = 'External Source';
            }
          }
          return {
            id: s.id || `src_${uniqueSuffix}_${i + 1}`,
            name: s.name.trim() || (resolvedDomain ? `${resolvedDomain} - Article` : `Source #${i + 1}`),
            url: cleanUrl || 'https://zenvitra.xyz/news',
            label: s.label || `Source #${i + 1}`,
            domain: resolvedDomain || '',
          };
        });

      const primarySourceName = validSources[0]?.name || 'Zenvitra Sovereign Wire & Investigative Desk';
      const primarySourceUrl = validSources[0]?.url || 'https://zenvitra.xyz/news';

      // ── 1. COMPOSE & SAVE NEWS STORY (ZEN.NEWS) ──
      const newsId = `news_${uniqueSuffix}`;
      const newsTimeline: NewsTimelineUpdate[] = timelineItems
        .filter(t => t.headline.trim() || t.content.trim())
        .map((t, idx) => ({
          id: `tl_${newsId}_${idx + 1}`,
          time: t.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          headline: t.headline || headline,
          content: t.content || summary,
          sourceName: primarySourceName,
          sourceUrl: primarySourceUrl,
          isConfirmed: true,
        }));

      if (newsTimeline.length === 0) {
        newsTimeline.push({
          id: `tl_${newsId}_initial`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          headline,
          content: summary,
          sourceName: primarySourceName,
          sourceUrl: primarySourceUrl,
          isConfirmed: true,
        });
      }

      const newsStory: NewsStory = {
        id: newsId,
        slug: cleanSlug,
        headline: headline.trim(),
        category,
        isBreaking,
        isDeveloping: true,
        publishedAt: now,
        lastUpdatedAt: now,
        location: location.trim() || 'Global Wire Mesh',
        coverImage: galleryImages[0] || coverImage.trim() || PRESET_COVERS[0].url,
        images: galleryImages,
        coverAdjustment: coverAdjustment,
        summary: summary.trim(),
        whatHappened: whatHappened.trim(),
        timeline: newsTimeline,
        whatWeKnow: whatWeKnow.filter(k => k.trim()),
        whatRemainsUnclear: whatRemainsUnclear.filter(u => u.trim()),
        sources: validSources,
        contextExplanation: {
          background: `Transmitted under Article 12 of the Zenvitra Sovereign Constitution. Verified by accredited correspondent @${authorUsername} on the sovereign desk.`,
          keyTerms: [
            { term: 'Article 12', definition: 'Constitutional guarantee of factual news wire transmission without platform censorship.' },
            { term: category, definition: `Designated diplomatic sector: ${selectedCategoryObj.label}` }
          ],
          relevantInstitutions: ['Zenvitra Wire Desk', 'Accredited Sovereign Bureau', 'International Diplomatic Mesh'],
          previousDevelopments: ['Initial wire clearance authenticated.', 'Cross-platform broadcast initiated across News, Press, and Pulse.']
        },
        readCount: 1,
      };

      if (typeof window !== 'undefined') {
        const existingNewsRaw = localStorage.getItem('zenvitra_news_stories_v2_clean');
        const existingNews: NewsStory[] = existingNewsRaw ? JSON.parse(existingNewsRaw) : [];
        localStorage.setItem('zenvitra_news_stories_v2_clean', JSON.stringify([newsStory, ...existingNews]));
        window.dispatchEvent(new CustomEvent('zenvitra_news_sync'));
      }

      // ── 2. COMPOSE & SAVE PRESS ARTICLE (ZEN.PRESS) ──
      const pressId = `press_${uniqueSuffix}`;
      const wireFormattedTitle = headline.startsWith('[WIRE') 
        ? headline 
        : `[WIRE // ${category}] ${headline.trim()}`;
      
      const formattedContent = whatHappened.startsWith('DATELINE:')
        ? whatHappened
        : `**DATELINE: ${location.toUpperCase()} // ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}**\n\n${whatHappened.trim()}`;

      const pressArticle: PressArticle = {
        id: pressId,
        title: wireFormattedTitle,
        slug: cleanSlug,
        content: formattedContent,
        excerpt: summary.trim(),
        coverImage: galleryImages[0] || coverImage.trim() || PRESET_COVERS[0].url,
        images: galleryImages,
        coverAdjustment: coverAdjustment,
        sourceName: primarySourceName,
        sourceUrl: primarySourceUrl,
        sources: validSources,
        authorId,
        authorName,
        authorUsername,
        category: selectedCategoryObj.pressCategory,
        tags: Array.from(new Set(['#Wire', '#LiveDispatch', `#${category}`, ...parsedTags])),
        status: 'published',
        isOfficial: true,
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
        readingTimeMinutes: Math.max(1, Math.round(whatHappened.split(/\s+/).length / 200)),
        upvotes: 1,
        upvotedBy: [authorId],
        bookmarkedBy: [],
        commentCount: 0,
      };

      if (typeof window !== 'undefined') {
        const existingPressRaw = localStorage.getItem('zenvitra_press_articles_v4_clean');
        const existingPress: PressArticle[] = existingPressRaw ? JSON.parse(existingPressRaw) : [];
        localStorage.setItem('zenvitra_press_articles_v4_clean', JSON.stringify([pressArticle, ...existingPress]));
        localStorage.setItem('zenvitra_press_articles_v3_clean', JSON.stringify([pressArticle, ...existingPress]));
        window.dispatchEvent(new CustomEvent('zenvitra_press_sync'));
      }

      // ── 3. COMPOSE & SAVE PULSE FEED POST (ZEN.PULSE) ──
      const pulseId = `pulse_wire_${uniqueSuffix}`;
      const pulseContent = `⚡ **OFFICIAL WIRE DISPATCH [${category}]**\n\n### ${headline.trim()}\n\n${summary.trim()}\n\n${whatHappened.slice(0, 300)}...\n\n[Read full wire report in Newsroom →](/news) • [Full analysis in Press Bureau →](/press?article=${pressId})`;

      const pulsePost: PulsePost = {
        id: pulseId,
        authorId,
        authorName,
        authorUsername,
        authorRole: 'correspondent',
        content: pulseContent,
        images: galleryImages.length > 0 ? galleryImages : (coverImage ? [coverImage] : []),
        location: location.trim(),
        tags: Array.from(new Set(['#Wire', '#LiveDispatch', `#${category}`, ...parsedTags])),
        sourceName: primarySourceName,
        sourceUrl: `/press?article=${pressId}`,
        createdAt: now,
        likes: 0,
        likedBy: [],
        reposts: 0,
        repostedBy: [],
        replyCount: 0,
        civicReliabilityScore: 99,
        citations: validSources.map((vs, idx) => ({
          id: `cit_${uniqueSuffix}_${idx}`,
          symbolOrId: `WIRE-${uniqueSuffix.toUpperCase()}-${idx + 1}`,
          type: 'NATIONAL_NEWSPAPER',
          title: vs.name,
          institution: vs.domain || vs.name,
          archiveUrl: vs.url,
          sha256Hash: `0x${uniqueSuffix}${idx}998a4`,
          verifiedCount: 1,
          verifiedBy: [authorUsername]
        }))
      };

      (pulsePost as any).sources = validSources;
      (pulsePost as any).coverAdjustment = coverAdjustment;

      if (typeof window !== 'undefined') {
        const existingPulseRaw = localStorage.getItem('zenvitra_pulse_posts_v9_clean');
        const existingPulse: PulsePost[] = existingPulseRaw ? JSON.parse(existingPulseRaw) : [];
        localStorage.setItem('zenvitra_pulse_posts_v9_clean', JSON.stringify([pulsePost, ...existingPulse]));
        window.dispatchEvent(new CustomEvent('zenvitra_pulse_sync'));
        window.dispatchEvent(new Event('storage'));
      }

      // ── 4. AUTOMATICALLY FORMAT & DELIVER DISPATCH NOTIFICATIONS TO SUBSCRIBERS ──
      try {
        notifyCategorySubscribers({
          platform: 'news',
          category: category,
          title: headline.trim(),
          authorName: authorName,
          excerpt: summary.trim(),
          link: `/news?story=${newsId}`,
          itemId: newsId,
        });

        notifyCategorySubscribers({
          platform: 'press',
          category: selectedCategoryObj.pressCategory,
          title: headline.trim(),
          authorName: authorName,
          excerpt: summary.trim(),
          link: `/press?article=${pressId}`,
          itemId: pressId,
        });

        notifyCategorySubscribers({
          platform: 'pulse',
          category: category,
          title: headline.trim(),
          authorName: authorName,
          excerpt: summary.trim(),
          link: `/pulse`,
          itemId: pulseId,
        });
      } catch (e) {
        console.warn('Subscription notification dispatch warning:', e);
      }

      setSubmittedIds({ newsId, pressId, pulseId });
    } catch (err: any) {
      alert(`Submission failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeSourcesPreview = sources.filter(s => s.url.trim() || s.name.trim());

  return (
    <div className="min-h-screen bg-[#030406] text-white flex flex-col font-sans selection:bg-rose-500/30">
      <Navbar />

      <main className="flex-1 pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8 text-left">
        <DesktopModeAdvisory studioName="News Wire & Editorial Desk" storageKey="zen_news_editor" />
        
        {/* INTERCONNECTED GLOBAL HUB BAR */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs transition"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>ZEN.NEWS</span>
            </Link>

            <Link
              href="/press"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs transition"
            >
              <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
              <span>ZEN.PRESS</span>
            </Link>

            <Link
              href="/pulse"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-mono text-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>ZEN.PULSE</span>
            </Link>

            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(244,63,94,0.25)]">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>SUBMIT WIRE (Active Desk)</span>
            </span>
          </div>

          <Link
            href="/constitution#article-12"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-amber-300 transition"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Charter Art. XII &bull; Freedom of Sovereign Press</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        {/* DISTINCT EDITORS ARCHITECTURE & SYNDICATION CLARIFICATION BANNER */}
        <div className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-cyan-950/20 to-neutral-950 border border-purple-500/30 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3 h-3" />
                <span>Specialized Editorial Architecture</span>
              </span>
              <span className="text-xs font-mono text-cyan-300/80">
                Triple-Sync Broadcast
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
              <strong className="text-white">ZEN.PRESS</strong> and <strong className="text-white">ZEN.PULSE</strong> feature separate, specialized editors tailored for their formats (long-form investigative journalism vs. interactive social dispatches and treaties). Any news story transmitted here from the News Wire automatically syndicates and reflects live across <strong className="text-rose-400">ZEN.NEWS</strong>, <strong className="text-cyan-400">ZEN.PRESS</strong>, and <strong className="text-purple-400">ZEN.PULSE</strong> simultaneously.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/press"
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-cyan-300 font-mono text-xs flex items-center gap-1.5 transition"
              title="Open the dedicated long-form Article Editor for ZEN.PRESS"
            >
              <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
              <span>ZEN.PRESS Bureau Editor ↗</span>
            </Link>
            <Link
              href="/pulse"
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-purple-300 font-mono text-xs flex items-center gap-1.5 transition"
              title="Open the dedicated Social & Treaty Composer for ZEN.PULSE"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>ZEN.PULSE Composer ↗</span>
            </Link>
          </div>
        </div>

        {/* HERO TITLE & EXPLANATION */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 font-mono text-xs font-bold uppercase tracking-wider">
              Universal Wire Desk
            </span>
            <span className="text-xs font-mono text-neutral-400">
              One-Click Triple Synchronization
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
            Transmit News Wire &amp; Press Article
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-3xl leading-relaxed">
            Publish breaking dispatches, investigative reports, or conference communiqués with custom visual framing and verified multi-source citations.
          </p>
        </div>

        {/* SUCCESS STATE MODAL / BANNER */}
        {submittedIds && (
          <div className="rounded-3xl bg-gradient-to-b from-emerald-950/80 via-emerald-950/40 to-black border-2 border-emerald-500/50 p-6 sm:p-10 space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-white">Wire Transmitted Across All Platforms!</h3>
                <p className="text-emerald-300/80 text-sm">Your news dispatch has been verified and syndicated live into all 3 platforms.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/news"
                className="group p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-rose-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-rose-400 mb-2">
                    <Radio className="w-5 h-5" />
                    <span className="text-[10px] font-mono uppercase bg-rose-500/10 px-2 py-0.5 rounded">Live Story</span>
                  </div>
                  <h4 className="font-bold text-white group-hover:text-rose-300 transition">View on ZEN.NEWS</h4>
                  <p className="text-xs text-neutral-400 mt-1">Live card in the breaking and sector stream with interactive timeline.</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-mono text-rose-300">
                  <span>Open Newsroom</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/press"
                className="group p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-cyan-400 mb-2">
                    <Newspaper className="w-5 h-5" />
                    <span className="text-[10px] font-mono uppercase bg-cyan-500/10 px-2 py-0.5 rounded">Full Article</span>
                  </div>
                  <h4 className="font-bold text-white group-hover:text-cyan-300 transition">Read on ZEN.PRESS</h4>
                  <p className="text-xs text-neutral-400 mt-1">Published long-form report with author desk, reading time and citations.</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-mono text-cyan-300">
                  <span>Open Bureau</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/pulse"
                className="group p-5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-purple-400 mb-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-mono uppercase bg-purple-500/10 px-2 py-0.5 rounded">Feed Dispatch</span>
                  </div>
                  <h4 className="font-bold text-white group-hover:text-purple-300 transition">Inspect on ZEN.PULSE</h4>
                  <p className="text-xs text-neutral-400 mt-1">Official wire dispatch in social feed with source citation &amp; comments.</p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-xs font-mono text-purple-300">
                  <span>Open Pulse Feed</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSubmittedIds(null);
                  setHeadline('');
                  setSummary('');
                  setWhatHappened('');
                  setArticle12Affirmed(false);
                  setSources([{ id: `src_${Date.now()}`, name: '', url: '', label: 'Source #1', domain: '' }]);
                  handleResetAdjuster();
                }}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition cursor-pointer"
              >
                Transmit Another News Wire +
              </button>
            </div>
          </div>
        )}

        {/* MAIN COMPOSITION & PREVIEW SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: FORM */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
            
            {/* 1. SECTOR & CATEGORY SELECTOR */}
            <div className="rounded-3xl bg-[#07090e] border border-white/10 p-6 space-y-4">
              <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>01. Sector &amp; Category</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-medium transition flex flex-col justify-between gap-1 cursor-pointer ${
                      category === cat.value
                        ? 'bg-white/15 border-white text-white shadow-lg'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-bold">{cat.label}</span>
                    <span className="text-[10px] font-mono opacity-70">#{cat.value}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-neutral-300">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-black text-rose-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Flag as Breaking News Flash (High-Priority Broadcast)</span>
                </label>
              </div>
            </div>

            {/* 2. HEADLINE & LOCATION */}
            <div className="rounded-3xl bg-[#07090e] border border-white/10 p-6 space-y-4">
              <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>02. Headline &amp; Dateline</span>
              </label>

              <div>
                <span className="text-xs text-neutral-400 mb-1.5 block">Headline / Title *</span>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Delegates Unveil Historic Sovereign Resolution at Plenary Assembly..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white text-base sm:text-lg font-semibold placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-neutral-400 mb-1.5 block">Dateline / Geographic Node *</span>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New Delhi // Global Wire Mesh"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none transition"
                  />
                </div>

                <div>
                  <span className="text-xs text-neutral-400 mb-1.5 block">Byline / Author Handle</span>
                  <input
                    type="text"
                    disabled
                    value={`${authorName} (@${authorUsername})`}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-neutral-400 text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 3. COVER VISUAL WITH CUSTOM UPLOAD & PHOTO ADJUSTER */}
            <div className="rounded-3xl bg-[#07090e] border border-white/10 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  <span>03. Cover Visual &amp; Photo Adjuster</span>
                </label>

                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setShowAdjuster(!showAdjuster)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border cursor-pointer ${
                      showAdjuster
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                        : 'bg-white/[0.04] border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    <span>{showAdjuster ? 'Hide Adjuster' : 'Adjust Framing & Zoom'}</span>
                  </button>
                )}
              </div>

              {/* Upload Dropzone & File Input */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 text-center ${
                  isDragging
                    ? 'border-purple-400 bg-purple-500/10'
                    : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-purple-400/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
                  <Upload className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">
                    Upload Custom Photo or Drag &amp; Drop
                  </p>
                  <p className="text-xs text-neutral-400 font-mono">
                    Supports high-resolution PNG, JPG, WEBP, SVG
                  </p>
                </div>
              </div>

              {/* Direct Image URL fallback */}
              <div>
                <span className="text-xs text-neutral-400 mb-1.5 block">Or Paste Direct Image URL:</span>
                <input
                  type="url"
                  value={coverImage.startsWith('data:') ? '' : coverImage}
                  onChange={(e) => {
                    setCoverImage(e.target.value);
                  }}
                  placeholder="https://..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-neutral-600 focus:border-purple-500/50 focus:outline-none transition font-mono"
                />
              </div>

              {/* Presets */}
              <div>
                <span className="text-xs text-neutral-400 mb-2 block">Quick Visual Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COVERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setCoverImage(preset.url);
                        setGalleryImages((prev) => [preset.url, ...prev.filter(p => p !== preset.url)]);
                        handleResetAdjuster();
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono border transition cursor-pointer ${
                        coverImage === preset.url
                          ? 'bg-purple-500/20 border-purple-400 text-purple-200 font-bold'
                          : 'bg-white/[0.04] border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MULTI-PHOTO GALLERY & REORDERING STRIP */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                      Photo Sequence &amp; Rearrangement ({galleryImages.length} Photos)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-mono text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Multiple Photos</span>
                  </button>
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group shrink-0 w-32 h-24 rounded-2xl overflow-hidden border border-white/20 bg-black/60 shadow-lg"
                    >
                      <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      {/* Badge */}
                      <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 border border-white/20 text-[9px] font-mono font-bold text-white flex items-center gap-1">
                        {idx === 0 ? <span className="text-amber-400 font-bold">#1 Cover</span> : <span>#{idx + 1}</span>}
                      </div>

                      {/* Rearrange & Remove Overlay Controls */}
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/95 via-black/85 to-transparent flex items-center justify-between gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => movePhoto(idx, idx - 1)}
                          className="p-1 rounded-md bg-white/10 hover:bg-purple-500/40 text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
                          title="Move photo left"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="p-1 rounded-md bg-white/10 hover:bg-rose-500/50 text-rose-300 cursor-pointer transition"
                          title="Remove this photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          disabled={idx === galleryImages.length - 1}
                          onClick={() => movePhoto(idx, idx + 1)}
                          className="p-1 rounded-md bg-white/10 hover:bg-purple-500/40 text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
                          title="Move photo right"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-24 rounded-2xl border-2 border-dashed border-white/20 hover:border-purple-400 text-neutral-400 hover:text-purple-300 flex flex-col items-center justify-center gap-1.5 transition shrink-0 cursor-pointer bg-white/[0.02]"
                    title="Add another photo to article"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[10px] font-mono">+ Add Photo</span>
                  </button>
                </div>
              </div>

              {/* INTERACTIVE PHOTO ADJUSTER STUDIO */}
              {coverImage && (showAdjuster || true) && (
                <div className="p-4 sm:p-5 rounded-2xl bg-black/70 border border-purple-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-purple-400" />
                      <span>Live Photo Framing &amp; Focal Adjuster</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowRuleOfThirds(!showRuleOfThirds)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition cursor-pointer flex items-center gap-1 ${
                          showRuleOfThirds
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Grid className="w-3 h-3" />
                        <span>Rule of 3rds</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetAdjuster}
                        className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Framed Preview Box */}
                  <div 
                    className={`w-full overflow-hidden rounded-xl relative border border-white/20 bg-neutral-950 transition-all ${
                      coverAdjustment.aspectRatio === '16:9'
                        ? 'aspect-[16/9]'
                        : coverAdjustment.aspectRatio === '21:9'
                        ? 'aspect-[21/9]'
                        : coverAdjustment.aspectRatio === '4:3'
                        ? 'aspect-[4/3]'
                        : 'aspect-square'
                    }`}
                  >
                    <img
                      src={coverImage}
                      alt="Cover Preview"
                      className="w-full h-full transition-all duration-75 select-none"
                      style={{
                        transform: `scale(${coverAdjustment.scale})`,
                        transformOrigin: `${coverAdjustment.positionX}% ${coverAdjustment.positionY}%`,
                        objectPosition: `${coverAdjustment.positionX}% ${coverAdjustment.positionY}%`,
                        objectFit: coverAdjustment.fit,
                      }}
                    />

                    {/* Rule of Thirds Grid Overlay */}
                    {showRuleOfThirds && (
                      <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-cyan-400/30">
                        <div className="border-r border-b border-cyan-400/30" />
                        <div className="border-r border-b border-cyan-400/30" />
                        <div className="border-b border-cyan-400/30" />
                        <div className="border-r border-b border-cyan-400/30" />
                        <div className="border-r border-b border-cyan-400/30" />
                        <div className="border-b border-cyan-400/30" />
                        <div className="border-r border-cyan-400/30" />
                        <div className="border-r border-cyan-400/30" />
                        <div />
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-white/80 border border-white/10 pointer-events-none">
                      {Math.round(coverAdjustment.scale * 100)}% Zoom &bull; Focal ({coverAdjustment.positionX}%, {coverAdjustment.positionY}%)
                    </div>
                  </div>

                  {/* Sliders Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                    {/* Zoom / Scale */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                        <span className="flex items-center gap-1">
                          <ZoomIn className="w-3.5 h-3.5 text-purple-400" />
                          <span>Zoom Scale</span>
                        </span>
                        <span className="text-purple-300 font-bold">{Math.round(coverAdjustment.scale * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.05"
                        value={coverAdjustment.scale}
                        onChange={(e) =>
                          setCoverAdjustment({ ...coverAdjustment, scale: parseFloat(e.target.value) })
                        }
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>

                    {/* Horizontal Focal Pan (X) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                        <span>Horizontal Pan (X)</span>
                        <span className="text-cyan-300 font-bold">{coverAdjustment.positionX}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={coverAdjustment.positionX}
                        onChange={(e) =>
                          setCoverAdjustment({ ...coverAdjustment, positionX: parseInt(e.target.value, 10) })
                        }
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    {/* Vertical Focal Pan (Y) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                        <span>Vertical Pan (Y)</span>
                        <span className="text-rose-300 font-bold">{coverAdjustment.positionY}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={coverAdjustment.positionY}
                        onChange={(e) =>
                          setCoverAdjustment({ ...coverAdjustment, positionY: parseInt(e.target.value, 10) })
                        }
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Aspect Ratio & Fit Modes */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Aspect Ratio:</span>
                      {(['16:9', '21:9', '4:3', '1:1'] as const).map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setCoverAdjustment({ ...coverAdjustment, aspectRatio: ratio })}
                          className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                            coverAdjustment.aspectRatio === ratio
                              ? 'bg-purple-500/25 border-purple-400 text-purple-200 font-bold'
                              : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400">Fit Mode:</span>
                      <button
                        type="button"
                        onClick={() => setCoverAdjustment({ ...coverAdjustment, fit: 'cover' })}
                        className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          coverAdjustment.fit === 'cover'
                            ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Cover (Fill)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverAdjustment({ ...coverAdjustment, fit: 'contain' })}
                        className={`px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                          coverAdjustment.fit === 'contain'
                            ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold'
                            : 'bg-white/5 border-white/10 text-neutral-400 hover:text-white'
                        }`}
                      >
                        Contain (Fit)
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. EXECUTIVE SUMMARY & FULL BODY */}
            <div className="rounded-3xl bg-[#07090e] border border-white/10 p-6 space-y-4">
              <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>04. Report Body &amp; Lead</span>
              </label>

              <div>
                <span className="text-xs text-neutral-400 mb-1.5 block">Executive Summary / Lead Paragraph * (Appears on cards &amp; wire tickers)</span>
                <textarea
                  required
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A concise, factual 2-3 sentence synopsis of the breaking situation or investigation..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none transition"
                />
              </div>

              <div>
                <span className="text-xs text-neutral-400 mb-1.5 block">Full Dispatch Body / What Happened * (Markdown supported)</span>
                <textarea
                  required
                  rows={8}
                  value={whatHappened}
                  onChange={(e) => setWhatHappened(e.target.value)}
                  placeholder="Comprehensive dispatch narrative, context, quotes, diplomatic outcomes, and verifiable details..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-white text-sm placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none transition leading-relaxed font-sans"
                />
              </div>
            </div>

            {/* 5. TIMELINE UPDATES */}
            <div className="rounded-3xl bg-[#07090e] border border-white/10 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>05. Chronological Timeline Updates</span>
                </label>
                <button
                  type="button"
                  onClick={handleAddTimelineItem}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Timestamp</span>
                </button>
              </div>

              <div className="space-y-3">
                {timelineItems.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2 relative">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const updated = [...timelineItems];
                          updated[idx].time = e.target.value;
                          setTimelineItems(updated);
                        }}
                        placeholder="Time (e.g. 14:30 IST)"
                        className="bg-black/40 border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono text-emerald-300 w-36"
                      />
                      {timelineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTimelineItem(idx)}
                          className="text-neutral-500 hover:text-rose-400 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={item.headline}
                      onChange={(e) => {
                        const updated = [...timelineItems];
                        updated[idx].headline = e.target.value;
                        setTimelineItems(updated);
                      }}
                      placeholder="Timeline headline..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white placeholder:text-neutral-600"
                    />
                    <textarea
                      rows={2}
                      value={item.content}
                      onChange={(e) => {
                        const updated = [...timelineItems];
                        updated[idx].content = e.target.value;
                        setTimelineItems(updated);
                      }}
                      placeholder="Timeline detail or development update..."
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-300 placeholder:text-neutral-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* 6. VERIFIED FACTS & UNCLEAR POINTS */}
            <div className="rounded-3xl bg-[#07090e] border border-white/10 p-6 space-y-4">
              <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>06. Fact Architecture (Anti-Hallucination)</span>
              </label>

              {/* What We Know */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>What We Know (Verified Facts)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddWhatWeKnow}
                    className="text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
                  >
                    + Add Fact
                  </button>
                </div>
                {whatWeKnow.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...whatWeKnow];
                        updated[idx] = e.target.value;
                        setWhatWeKnow(updated);
                      }}
                      placeholder="Verified factual development..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    {whatWeKnow.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveWhatWeKnow(idx)}
                        className="text-neutral-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* What Remains Unclear */}
              <div className="space-y-2 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>What Remains Unclear (Ongoing Investigation)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddWhatRemainsUnclear}
                    className="text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
                  >
                    + Add Point
                  </button>
                </div>
                {whatRemainsUnclear.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...whatRemainsUnclear];
                        updated[idx] = e.target.value;
                        setWhatRemainsUnclear(updated);
                      }}
                      placeholder="Unverified or unfolding detail..."
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                    {whatRemainsUnclear.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveWhatRemainsUnclear(idx)}
                        className="text-neutral-500 hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 7. MANDATORY MULTI-SOURCE CITATIONS & AUTOMATED URL HEADING READER */}
            <div className="rounded-3xl bg-[#07090e] border border-white/10 p-6 space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span>07. Verified Sources (Multiple Citations with Auto-Heading)</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddSource}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 text-xs font-mono font-bold transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Another Source</span>
                </button>
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Paste any source URL (e.g. Times of India, Reuters, The Hindu). The engine will automatically read the article headline and format it as <code className="text-indigo-300 font-mono">TOI - Article X (Source #1)</code> as a clickable link.
              </p>

              <div className="space-y-4">
                {sources.map((src, idx) => (
                  <div key={src.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 relative group">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-mono text-xs font-bold">
                          {src.label}
                        </span>
                        {src.domain && (
                          <span className="text-[11px] font-mono text-neutral-500">
                            {src.domain}
                          </span>
                        )}
                      </div>

                      {sources.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSource(idx)}
                          className="text-neutral-500 hover:text-rose-400 transition cursor-pointer p-1"
                          title="Remove source"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      {/* URL INPUT WITH AUTO-FETCH BUTTON */}
                      <div className="sm:col-span-7 space-y-1">
                        <span className="text-[11px] text-neutral-400 block font-mono">Source URL (Paste Link):</span>
                        <div className="relative flex items-center">
                          <input
                            type="url"
                            value={src.url}
                            onChange={(e) => handleUpdateSource(idx, 'url', e.target.value)}
                            onBlur={() => {
                              if (src.url.trim() && !src.name.trim()) {
                                handleFetchUrlHeading(idx);
                              }
                            }}
                            placeholder="https://timesofindia.indiatimes.com/..."
                            className="w-full bg-black/60 border border-white/15 rounded-xl pl-3 pr-24 py-2 text-white text-xs font-mono placeholder:text-neutral-600 focus:border-indigo-500/50 focus:outline-none transition"
                          />
                          <button
                            type="button"
                            disabled={src.isLoading || !src.url.trim()}
                            onClick={() => handleFetchUrlHeading(idx)}
                            className="absolute right-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/40 text-indigo-300 text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-40"
                          >
                            <RefreshCw className={`w-3 h-3 ${src.isLoading ? 'animate-spin' : ''}`} />
                            <span>{src.isLoading ? 'Reading...' : 'Fetch Title'}</span>
                          </button>
                        </div>
                      </div>

                      {/* HEADING / PUBLICATION DISPLAY */}
                      <div className="sm:col-span-5 space-y-1">
                        <span className="text-[11px] text-neutral-400 block font-mono">Parsed Heading / Bureau:</span>
                        <input
                          type="text"
                          value={src.name}
                          onChange={(e) => handleUpdateSource(idx, 'name', e.target.value)}
                          placeholder="e.g. TOI - Article X"
                          className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-white text-xs font-semibold placeholder:text-neutral-600 focus:border-indigo-500/50 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    {src.error && (
                      <div className="text-[11px] font-mono text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{src.error} (You can enter the headline manually)</span>
                      </div>
                    )}

                    {/* LIVE CLICKABLE SOURCE BADGE */}
                    {src.url.trim() && (
                      <div className="pt-1 flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase">Clickable Link Preview:</span>
                        <a
                          href={src.url.startsWith('http') ? src.url : `https://${src.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono transition group/link"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-link/hover:translate-x-0.5 group-link/hover:-translate-y-0.5 transition-transform" />
                          <span className="font-bold">{src.name || src.url}</span>
                          <span className="text-[10px] bg-cyan-500/20 px-1.5 py-0.2 rounded text-cyan-200 font-bold">{src.label}</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <span className="text-xs text-neutral-400 mb-1.5 block">Tags (comma separated)</span>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="#Wire, #LiveDispatch, #Breaking"
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-2 text-white text-sm placeholder:text-neutral-600 focus:border-rose-500/50 focus:outline-none transition font-mono"
                />
              </div>

              {/* ARTICLE 12 AFFIRMATION */}
              <div className="pt-3 border-t border-white/10">
                <label className="flex items-start gap-3 cursor-pointer p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
                  <input
                    type="checkbox"
                    required
                    checked={article12Affirmed}
                    onChange={(e) => setArticle12Affirmed(e.target.checked)}
                    className="w-4 h-4 rounded border-amber-400/40 bg-black text-amber-500 focus:ring-0 mt-0.5 cursor-pointer shrink-0"
                  />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-amber-300 block">
                      Affirmation of Constitutional Article XII Compliance
                    </span>
                    <p className="text-amber-200/80 leading-relaxed font-sans">
                      I solemnly affirm that this dispatch represents verifiable factual truth, authentic diplomatic proceedings, or accredited civic reporting under Article 12 of the Zenvitra Sovereign Constitution. It carries zero defamatory fiction or manufactured falsehood.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* CHECK FINAL DRAFT BUTTON */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => {
                  if (!headline.trim()) {
                    alert('Please enter a headline first.');
                    return;
                  }
                  if (!summary.trim() || !whatHappened.trim()) {
                    alert('Please fill in the summary and story report before checking final draft.');
                    return;
                  }
                  setShowFinalDraftModal(true);
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold font-display text-sm sm:text-base transition cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
              >
                <Eye className="w-4 h-4" />
                <span>Check Your Final Draft (All Formats &amp; Photos)</span>
              </button>

            {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-cyan-500 hover:from-rose-400 hover:via-purple-500 hover:to-cyan-400 text-white font-bold font-display text-base sm:text-lg shadow-[0_0_35px_rgba(244,63,94,0.35)] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? 'Transmitting Across Wire...' : 'Publish Across Network & Wire (Triple-Sync)'}</span>
              </button>
              <p className="text-center font-mono text-xs text-neutral-500 mt-2">
                Synchronously writes to ZEN.NEWS &bull; ZEN.PRESS &bull; ZEN.PULSE
              </p>
            </div>
          </form>

          {/* RIGHT COLUMN: MULTI-CHANNEL LIVE PREVIEW */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-32 space-y-4">
              
              {/* Preview Header & Tabs */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <span>Live Channel Reflections</span>
                </div>

                <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/10 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('news')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      previewTab === 'news' ? 'bg-rose-500/30 text-rose-300 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    ZEN.NEWS
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('press')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      previewTab === 'press' ? 'bg-cyan-500/30 text-cyan-300 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    ZEN.PRESS
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('pulse')}
                    className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      previewTab === 'pulse' ? 'bg-purple-500/30 text-purple-300 font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    ZEN.PULSE
                  </button>
                </div>
              </div>

              {/* 1. ZEN.NEWS PREVIEW */}
              {previewTab === 'news' && (
                <div className="rounded-3xl bg-[#090b12] border border-rose-500/30 p-5 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                      {isBreaking ? '🔥 BREAKING WIRE' : `#${category}`}
                    </span>
                    <span className="text-neutral-500">{location}</span>
                  </div>

                  {coverImage && (
                    <div 
                      className={`rounded-2xl overflow-hidden relative border border-white/10 ${
                        coverAdjustment.aspectRatio === '16:9'
                          ? 'aspect-[16/9]'
                          : coverAdjustment.aspectRatio === '21:9'
                          ? 'aspect-[21/9]'
                          : coverAdjustment.aspectRatio === '4:3'
                          ? 'aspect-[4/3]'
                          : 'aspect-square'
                      }`}
                    >
                      <img 
                        src={coverImage} 
                        alt="Cover" 
                        className="w-full h-full"
                        style={{
                          transform: `scale(${coverAdjustment.scale})`,
                          transformOrigin: `${coverAdjustment.positionX}% ${coverAdjustment.positionY}%`,
                          objectPosition: `${coverAdjustment.positionX}% ${coverAdjustment.positionY}%`,
                          objectFit: coverAdjustment.fit,
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
                    </div>
                  )}

                  <h3 className="text-lg font-bold font-display text-white leading-snug">
                    {headline || 'Headline will appear here...'}
                  </h3>

                  <p className="text-xs text-neutral-300 line-clamp-3 leading-relaxed">
                    {summary || 'Executive summary lead paragraph will appear here...'}
                  </p>

                  {/* Multi-Sources Badges */}
                  {activeSourcesPreview.length > 0 && (
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block font-bold">
                        Verified Sources ({activeSourcesPreview.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeSourcesPreview.map((src, i) => (
                          <a
                            key={i}
                            href={src.url.startsWith('http') ? src.url : `https://${src.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{src.name || src.url}</span>
                            <span className="text-[9px] opacity-70">({src.label})</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Micro Timeline snippet */}
                  <div className="pt-3 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                      Timeline Progress ({timelineItems.length} Anchors)
                    </span>
                    <div className="space-y-1.5">
                      {timelineItems.slice(0, 2).map((t, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs">
                          <span className="font-mono text-[10px] text-rose-400 shrink-0">{t.time}</span>
                          <span className="text-neutral-300 text-xs line-clamp-1">{t.headline || 'Update'}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-white/5">
                    <span>Source: {activeSourcesPreview[0]?.name || 'Sovereign Desk'}</span>
                    <span className="text-rose-400">ZEN.NEWS Card &rarr;</span>
                  </div>
                </div>
              )}

              {/* 2. ZEN.PRESS PREVIEW */}
              {previewTab === 'press' && (
                <div className="rounded-3xl bg-[#090b12] border border-cyan-500/30 p-5 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      [WIRE // {category}]
                    </span>
                    <span className="text-neutral-500">{Math.max(1, Math.round((whatHappened || '').split(/\s+/).length / 200))} min read</span>
                  </div>

                  {coverImage && (
                    <div 
                      className={`rounded-2xl overflow-hidden relative border border-white/10 ${
                        coverAdjustment.aspectRatio === '16:9'
                          ? 'aspect-[16/9]'
                          : coverAdjustment.aspectRatio === '21:9'
                          ? 'aspect-[21/9]'
                          : coverAdjustment.aspectRatio === '4:3'
                          ? 'aspect-[4/3]'
                          : 'aspect-square'
                      }`}
                    >
                      <img 
                        src={coverImage} 
                        alt="Cover" 
                        className="w-full h-full"
                        style={{
                          transform: `scale(${coverAdjustment.scale})`,
                          transformOrigin: `${coverAdjustment.positionX}% ${coverAdjustment.positionY}%`,
                          objectPosition: `${coverAdjustment.positionX}% ${coverAdjustment.positionY}%`,
                          objectFit: coverAdjustment.fit,
                        }}
                      />
                    </div>
                  )}

                  <h3 className="text-lg font-bold font-display text-white leading-snug">
                    {headline || 'Press Report Title...'}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-sans text-neutral-400">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold text-[10px]">
                      {authorName[0]}
                    </div>
                    <span>{authorName} (@{authorUsername})</span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-neutral-300 leading-relaxed max-h-36 overflow-hidden">
                    <strong className="text-cyan-400">DATELINE: {location.toUpperCase()}</strong> — {whatHappened || 'Full dispatch content will be formatted and typeset into the permanent press bureau records with authentic citations...'}
                  </div>

                  {/* Multi-Sources Badges in Press */}
                  {activeSourcesPreview.length > 0 && (
                    <div className="p-3 rounded-xl bg-cyan-500/[0.05] border border-cyan-500/20 space-y-1.5">
                      <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block font-bold">
                        Attached Bureau Citations ({activeSourcesPreview.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeSourcesPreview.map((src, i) => (
                          <a
                            key={i}
                            href={src.url.startsWith('http') ? src.url : `https://${src.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono transition"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>{src.name || src.url}</span>
                            <span className="text-[9px] opacity-70">({src.label})</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-white/5">
                    <span>Verified Desk: {activeSourcesPreview[0]?.name || 'Sovereign Press Wire'}</span>
                    <span className="text-cyan-400">ZEN.PRESS Bureau &rarr;</span>
                  </div>
                </div>
              )}

              {/* 3. ZEN.PULSE PREVIEW */}
              {previewTab === 'pulse' && (
                <div className="rounded-3xl bg-[#090b12] border border-purple-500/30 p-5 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center font-bold text-xs text-purple-300">
                        {authorName[0]}
                      </div>
                      <div>
                        <span className="font-bold text-white text-xs block">{authorName}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">@{authorUsername} &bull; CORRESPONDENT</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-[10px] font-mono text-purple-300">
                      ⚡ WIRE POST
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-neutral-200 space-y-2 leading-relaxed">
                    <div className="font-mono text-rose-400 text-[11px] font-bold">
                      ⚡ OFFICIAL WIRE DISPATCH [{category}]
                    </div>
                    <div className="font-bold text-white text-sm">
                      {headline || 'Headline in Pulse Feed...'}
                    </div>
                    <p className="text-neutral-300 text-xs line-clamp-3">
                      {summary || 'Summary preview in Pulse feed...'}
                    </p>
                  </div>

                  {coverImage && (
                    <div 
                      className={`rounded-xl overflow-hidden border border-white/10 ${
                        coverAdjustment.aspectRatio === '16:9'
                          ? 'aspect-[16/9]'
                          : coverAdjustment.aspectRatio === '21:9'
                          ? 'aspect-[21/9]'
                          : coverAdjustment.aspectRatio === '4:3'
                          ? 'aspect-[4/3]'
                          : 'aspect-square'
                      }`}
                    >
                      <img 
                        src={coverImage} 
                        alt="Cover" 
                        className="w-full h-full"
                        style={{
                          transform: `scale(${coverAdjustment.scale})`,
                          transformOrigin: `${coverAdjustment.positionX}% ${coverAdjustment.positionY}%`,
                          objectPosition: `${coverAdjustment.positionX}% ${coverAdjustment.positionY}%`,
                          objectFit: coverAdjustment.fit,
                        }}
                      />
                    </div>
                  )}

                  {/* Multi-Sources Link Pills in Pulse */}
                  {activeSourcesPreview.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {activeSourcesPreview.map((src, i) => (
                        <a
                          key={i}
                          href={src.url.startsWith('http') ? src.url : `https://${src.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-[11px] font-sans transition"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                          <span>{src.name || src.url}</span>
                          <span className="text-[9px] opacity-75">({src.label})</span>
                          <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-2 border-t border-white/5">
                    <span className="text-purple-300">Reliability Score: 99/100</span>
                    <span className="text-neutral-400">ZEN.PULSE Stream &rarr;</span>
                  </div>
                </div>
              )}

              {/* Platform Connectivity Explanation */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2 text-xs text-neutral-400">
                <span className="font-mono font-bold text-neutral-200 block uppercase tracking-wider text-[11px]">
                  How Multi-Channel Reflection Works:
                </span>
                <p className="leading-relaxed">
                  Upon submission, the Zenvitra dispatch engine formats and synchronously broadcasts the payload across the three sovereign channels:
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px] text-neutral-300">
                  <li><strong className="text-rose-400">ZEN.NEWS</strong>: Added to live ticker &amp; category stream with verified sources and adjusted framing.</li>
                  <li><strong className="text-cyan-400">ZEN.PRESS</strong>: Added to bureau records with citation archive and reading times.</li>
                  <li><strong className="text-purple-400">ZEN.PULSE</strong>: Broadcast into live social wire feed with clickable source pills.</li>
                </ul>
              </div>

            </div>
          </div>

        </div>

      </main>

      <Footer />
      {/* Final Draft Review Modal */}
      <PressDraftPreviewModal
        isOpen={showFinalDraftModal}
        onClose={() => setShowFinalDraftModal(false)}
        onConfirmPublish={() => {
          setShowFinalDraftModal(false);
          const formElement = document.querySelector('form');
          if (formElement) {
            formElement.requestSubmit();
          }
        }}
        title={headline}
        excerpt={summary}
        content={whatHappened}
        images={galleryImages}
        category={category}
        tags={tagsInput.split(',').map((t) => t.trim()).filter(Boolean)}
        authorName={authorName}
        authorUsername={authorUsername}
        sources={sources}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

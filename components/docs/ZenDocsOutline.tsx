'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, RefreshCw, ChevronLeft } from 'lucide-react';

export interface ZenDocsOutlineProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  onToggle: () => void;
}

interface OutlineItem {
  id: string;
  text: string;
  fullText: string;
  level: 1 | 2 | 3;
  element: HTMLElement;
}

export function ZenDocsOutline({
  editorRef,
  isVisible,
  onToggle,
}: ZenDocsOutlineProps) {
  const [headings, setHeadings] = useState<OutlineItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const parseHeadings = useCallback(() => {
    const container = editorRef.current;
    if (!container) {
      setHeadings([]);
      return;
    }

    const candidateElements = Array.from(
      container.querySelectorAll<HTMLElement>('h1, h2, h3, p, div, li')
    );

    const parsed: OutlineItem[] = [];
    const registered = new Set<HTMLElement>();

    candidateElements.forEach((el, index) => {
      const tagName = el.tagName.toLowerCase();
      const rawText = el.innerText?.trim() || '';
      if (!rawText) return;

      // Heading elements H1, H2, H3
      if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
        const level: 1 | 2 | 3 = tagName === 'h1' ? 1 : tagName === 'h2' ? 2 : 3;
        const clean = rawText.replace(/\s+/g, ' ');
        if (!el.id) {
          el.id = `heading-${index}`;
        }
        parsed.push({
          id: el.id,
          text: clean.length > 36 ? `${clean.slice(0, 33)}...` : clean,
          fullText: clean,
          level,
          element: el,
        });
        registered.add(el);
        return;
      }

      // Check leaf blocks for operative clause / section patterns (e.g. '1. Calls upon')
      if (el.querySelector('h1, h2, h3, p, div')) return;

      let parent = el.parentElement;
      let isInsideRegistered = false;
      while (parent && parent !== container) {
        if (registered.has(parent)) {
          isInsideRegistered = true;
          break;
        }
        parent = parent.parentElement;
      }
      if (isInsideRegistered) return;

      const operativeRegex = /^(\d+[\.\)]\s+[A-Za-z]+|Article\s+[IVXLCDM\d]+|Section\s+\d+|[A-Z][a-z]+\s+\d+[\.\:])/i;
      if (operativeRegex.test(rawText)) {
        const clean = rawText.replace(/\s+/g, ' ');
        if (!el.id) {
          el.id = `clause-${index}`;
        }
        parsed.push({
          id: el.id,
          text: clean.length > 36 ? `${clean.slice(0, 33)}...` : clean,
          fullText: clean,
          level: 3,
          element: el,
        });
        registered.add(el);
      }
    });

    setHeadings(parsed);
    if (parsed.length > 0 && !activeId) {
      setActiveId(parsed[0].id);
    }
  }, [editorRef, activeId]);

  // Re-parse on interval (every 2 seconds)
  useEffect(() => {
    parseHeadings();
    const interval = setInterval(parseHeadings, 2000);
    return () => clearInterval(interval);
  }, [parseHeadings]);

  // Dynamic active heading tracking via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          const match = headings.find((h) => h.element === visible.target);
          if (match) setActiveId(match.id);
        }
      },
      { root: null, rootMargin: '-10% 0px -70% 0px', threshold: 0 }
    );

    headings.forEach((h) => {
      if (h.element) observer.observe(h.element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    parseHeadings();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleScrollToHeading = (item: OutlineItem) => {
    setActiveId(item.id);
    if (item.element) {
      item.element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isVisible ? 208 : 0,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`h-full shrink-0 flex flex-col overflow-hidden bg-[#0a0d15]/80 backdrop-blur-md transition-colors ${
        isVisible ? 'border-r border-white/[0.06]' : 'border-r-0 pointer-events-none'
      }`}
      aria-label="Document Outline"
    >
      <div className="w-52 h-full flex flex-col min-h-0 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-white/90 tracking-wide uppercase">Outline</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleManualRefresh}
              title="Refresh outline"
              className="p-1 rounded text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onToggle}
              title="Collapse outline"
              className="p-1 rounded text-white/40 hover:text-white/80 hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tree View / Empty State */}
        {headings.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <List className="w-5 h-5 text-white/20 mb-2" />
            <p className="text-xs text-white/40 italic">No headings found</p>
            <p className="text-[10px] text-white/20 mt-1 leading-relaxed">
              Add headings or clauses to view structure
            </p>
          </div>
        ) : (
          <nav className="flex-1 py-2 overflow-y-auto space-y-0.5">
            {headings.map((item) => {
              const isActive = activeId === item.id;
              const indentClass =
                item.level === 1 ? 'font-semibold' : item.level === 2 ? 'indent-4' : 'indent-8 text-[11px]';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleScrollToHeading(item)}
                  title={item.fullText}
                  className={`w-full text-left py-1.5 px-3 transition-colors text-xs flex items-center group cursor-pointer border-l-2 ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 font-medium'
                      : 'border-transparent text-white/60 hover:text-white hover:bg-white/[0.04]'
                  } ${indentClass}`}
                >
                  <span className="truncate block w-full">{item.text}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </motion.aside>
  );
}

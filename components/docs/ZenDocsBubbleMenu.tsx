'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';

export interface ZenDocsBubbleMenuProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onStrikethrough: () => void;
  onTextColor: (color: string) => void;
  onHighlight: (color: string) => void;
  onAlignment: (align: 'left' | 'center' | 'right' | 'justify') => void;
}

export function ZenDocsBubbleMenu({
  editorRef,
  onBold,
  onItalic,
  onUnderline,
  onStrikethrough,
  onTextColor,
  onHighlight,
  onAlignment
}: ZenDocsBubbleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const updatePosition = useCallback(() => {
    if (typeof window === 'undefined') return;

    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      setIsVisible(false);
      return;
    }

    const editor = editorRef.current;
    if (!editor) {
      setIsVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const commonAncestor = range.commonAncestorContainer;
    const targetNode =
      commonAncestor.nodeType === Node.ELEMENT_NODE
        ? commonAncestor
        : commonAncestor.parentNode;

    if (!targetNode || !editor.contains(targetNode)) {
      setIsVisible(false);
      return;
    }

    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setIsVisible(false);
      return;
    }

    // Determine bubble dimensions (or sensible defaults before DOM measure)
    const menuWidth = menuRef.current?.offsetWidth || 380;
    const menuHeight = menuRef.current?.offsetHeight || 44;

    // Position 8px above selection, centered horizontally
    let x = rect.left + rect.width / 2 - menuWidth / 2;
    let y = rect.top - menuHeight - 8;

    // If overflowing above viewport, flip 8px below selection
    if (y < 8) {
      y = rect.bottom + 8;
    }

    // Clamp horizontally and vertically within viewport bounds
    const padding = 12;
    const clampedX = Math.max(padding, Math.min(window.innerWidth - menuWidth - padding, x));
    const clampedY = Math.max(padding, Math.min(window.innerHeight - menuHeight - padding, y));

    setPosition({ x: clampedX, y: clampedY });
    setIsVisible(true);
  }, [editorRef]);

  // Selection change, scroll, and resize listeners
  useEffect(() => {
    document.addEventListener('selectionchange', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      document.removeEventListener('selectionchange', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [updatePosition]);

  // Dismiss on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const actionButtonClass =
    'p-1.5 rounded-lg hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer flex items-center justify-center w-8 h-8';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={menuRef}
          role="toolbar"
          aria-label="Text formatting bubble menu"
          initial={{ opacity: 0, scale: 0.9, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
          onMouseDown={(e) => e.preventDefault()}
          className="fixed z-40 rounded-xl bg-[#0e121e]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-1 flex items-center gap-0.5 select-none pointer-events-auto"
        >
          {/* Formatting Group */}
          <button
            type="button"
            title="Bold"
            aria-label="Bold"
            onMouseDown={(e) => {
              e.preventDefault();
              onBold();
            }}
            className={actionButtonClass}
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Italic"
            aria-label="Italic"
            onMouseDown={(e) => {
              e.preventDefault();
              onItalic();
            }}
            className={actionButtonClass}
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Underline"
            aria-label="Underline"
            onMouseDown={(e) => {
              e.preventDefault();
              onUnderline();
            }}
            className={actionButtonClass}
          >
            <Underline className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Strikethrough"
            aria-label="Strikethrough"
            onMouseDown={(e) => {
              e.preventDefault();
              onStrikethrough();
            }}
            className={actionButtonClass}
          >
            <Strikethrough className="w-4 h-4" />
          </button>

          {/* Separator */}
          <div className="h-5 w-px bg-white/15 mx-0.5" />

          {/* Text Colors Group */}
          <button
            type="button"
            title="Cyan text"
            aria-label="Cyan text color"
            onMouseDown={(e) => {
              e.preventDefault();
              onTextColor('#06b6d4');
            }}
            className="w-7 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-cyan-400 border border-white/30 shadow-sm transition hover:scale-110" />
          </button>

          <button
            type="button"
            title="Amber text"
            aria-label="Amber text color"
            onMouseDown={(e) => {
              e.preventDefault();
              onTextColor('#f59e0b');
            }}
            className="w-7 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-amber-400 border border-white/30 shadow-sm transition hover:scale-110" />
          </button>

          <button
            type="button"
            title="White text"
            aria-label="White text color"
            onMouseDown={(e) => {
              e.preventDefault();
              onTextColor('#ffffff');
            }}
            className="w-7 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <span className="w-4 h-4 rounded-full bg-white border border-white/30 shadow-sm transition hover:scale-110" />
          </button>

          {/* Separator */}
          <div className="h-5 w-px bg-white/15 mx-0.5" />

          {/* Highlight Group */}
          <button
            type="button"
            title="Yellow highlight"
            aria-label="Yellow highlight"
            onMouseDown={(e) => {
              e.preventDefault();
              onHighlight('#fef08a');
            }}
            className={`${actionButtonClass} relative hover:text-amber-300`}
          >
            <Highlighter className="w-4 h-4 text-amber-300" />
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-300 ring-1 ring-black/40" />
          </button>

          <button
            type="button"
            title="Cyan highlight"
            aria-label="Cyan highlight"
            onMouseDown={(e) => {
              e.preventDefault();
              onHighlight('#a5f3fc');
            }}
            className={`${actionButtonClass} relative hover:text-cyan-300`}
          >
            <Highlighter className="w-4 h-4 text-cyan-300" />
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-300 ring-1 ring-black/40" />
          </button>

          {/* Separator */}
          <div className="h-5 w-px bg-white/15 mx-0.5" />

          {/* Alignment Group */}
          <button
            type="button"
            title="Align left"
            aria-label="Align left"
            onMouseDown={(e) => {
              e.preventDefault();
              onAlignment('left');
            }}
            className={actionButtonClass}
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Align center"
            aria-label="Align center"
            onMouseDown={(e) => {
              e.preventDefault();
              onAlignment('center');
            }}
            className={actionButtonClass}
          >
            <AlignCenter className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Align right"
            aria-label="Align right"
            onMouseDown={(e) => {
              e.preventDefault();
              onAlignment('right');
            }}
            className={actionButtonClass}
          >
            <AlignRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            title="Justify"
            aria-label="Justify text"
            onMouseDown={(e) => {
              e.preventDefault();
              onAlignment('justify');
            }}
            className={actionButtonClass}
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

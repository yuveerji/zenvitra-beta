'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FounderNoteRendererProps {
  body: string;
  defaultExpanded?: boolean;
  collapsible?: boolean;
  className?: string;
  size?: 'compact' | 'standard';
  isExpanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
  hideDuplicateTitle?: boolean;
  cardTitle?: string;
}

function renderFormattedText(text: string): React.ReactNode {
  if (!text) return text;
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  if (tokens.length === 1) return text.replace(/\*/g, '');

  return tokens.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2).replace(/\*/g, '')}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="text-zinc-200 italic font-medium">
          {part.slice(1, -1).replace(/\*/g, '')}
        </em>
      );
    }
    return part.replace(/\*/g, '');
  });
}

export function FounderNoteRenderer({
  body,
  defaultExpanded = false,
  collapsible = true,
  className = '',
  size = 'standard',
  isExpanded: controlledExpanded,
  onToggleExpanded,
  hideDuplicateTitle = false,
  cardTitle = '',
}: FounderNoteRendererProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = (val: boolean) => {
    if (controlledExpanded === undefined) {
      setInternalExpanded(val);
    }
    onToggleExpanded?.(val);
  };

  if (!body) return null;

  // 1. Normalize line breaks
  // 2. Isolate any line containing 3+ hyphens (---), em-dashes (———), asterisks (***), or underscores (___)
  //    into a distinct standalone divider block
  // 3. Ensure any markdown headings (e.g. #, ##, ###) are separated into their own distinct block
  const normalizedBody = body
    .replace(/\r\n/g, '\n')
    .replace(/^[ \t]*(-{3,}|—{2,}|\*{3,}|_{3,})[ \t]*$/gm, '\n\n__DIVIDER__\n\n')
    .replace(/^(#{1,6}\s+[^\n]+)\n(?!\n)/gm, '$1\n\n');

  // Split into structural blocks
  const sections = normalizedBody.split(/\n\n+/).filter((s) => s.trim().length > 0);

  const cleanCompare = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const renderContent = () => {
    return sections.map((section, idx) => {
      const trimmed = section.trim();
      if (!trimmed) return null;

      // Divider line with centered diamond aura (converts "---" into dividing effect)
      const isDivider =
        trimmed === '__DIVIDER__' ||
        /^\s*(-{3,}|—{2,}|\*{3,}|_{3,})\s*$/.test(trimmed);

      if (isDivider) {
        return (
          <div key={idx} className="my-5 flex items-center gap-3 select-none" role="separator">
            <div className="h-px bg-gradient-to-r from-transparent via-rose-500/40 to-rose-500/60 flex-1" />
            <span className="text-[10px] font-mono text-rose-400/80 tracking-widest select-none drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">❖</span>
            <div className="h-px bg-gradient-to-r from-rose-500/60 via-rose-500/40 to-transparent flex-1" />
          </div>
        );
      }

      // Strip asterisks for heading and tagline checks
      const textWithoutStars = trimmed.replace(/\*/g, '').trim();
      if (!textWithoutStars) return null;

      // Check for closing signoff tagline (e.g., "BY YOUTH. FOR YOUTH. OWNED BY NO AGENDA.")
      if (
        textWithoutStars.includes('BY YOUTH. FOR YOUTH. OWNED BY NO AGENDA') ||
        textWithoutStars.startsWith('BY YOUTH. FOR YOUTH')
      ) {
        return (
          <p
            key={idx}
            className={`pt-2 font-display font-bold text-amber-300/90 tracking-wider text-xs sm:text-sm select-none`}
          >
            {textWithoutStars}
          </p>
        );
      }

      // Check if this is a markdown header (#, ##, ### ...)
      if (trimmed.startsWith('#')) {
        const headingText = trimmed.replace(/^#{1,6}\s+/, '').replace(/\*/g, '').trim();
        if (
          cleanCompare(headingText) === 'anotefromthefounder' ||
          (hideDuplicateTitle &&
            cardTitle &&
            cleanCompare(headingText) === cleanCompare(cardTitle))
        ) {
          return null;
        }
        return (
          <h3
            key={idx}
            className={`pt-1 pb-0.5 font-display font-bold text-white tracking-tight ${
              size === 'compact' ? 'text-xs sm:text-[13px]' : 'text-sm sm:text-base'
            }`}
          >
            {renderFormattedText(headingText)}
          </h3>
        );
      }

      // Check if this is an all-caps section header (e.g., "WHAT IF THERE WAS ANOTHER WAY?")
      const isHeader =
        textWithoutStars.length > 3 &&
        textWithoutStars.length < 80 &&
        textWithoutStars === textWithoutStars.toUpperCase() &&
        /[A-Z]/.test(textWithoutStars) &&
        !textWithoutStars.includes('\n');

      if (isHeader) {
        if (
          cleanCompare(textWithoutStars) === 'anotefromthefounder' ||
          (hideDuplicateTitle &&
            cardTitle &&
            cleanCompare(textWithoutStars) === cleanCompare(cardTitle))
        ) {
          return null;
        }
        return (
          <h4
            key={idx}
            className={`pt-2 pb-1 font-display font-bold text-rose-200 tracking-wide flex items-center gap-2 ${
              size === 'compact' ? 'text-xs sm:text-[13px]' : 'text-sm sm:text-base'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <span>{textWithoutStars}</span>
          </h4>
        );
      }

      // Check for quote or single emphasis lines ending with a dash or quote
      const isQuote = trimmed.startsWith('"') && trimmed.endsWith('"');
      if (isQuote) {
        return (
          <blockquote
            key={idx}
            className={`my-2 pl-3 py-1 border-l-2 border-rose-500/40 text-amber-200/90 font-mono italic ${
              size === 'compact' ? 'text-[11px]' : 'text-xs sm:text-sm'
            }`}
          >
            {renderFormattedText(trimmed)}
          </blockquote>
        );
      }

      // Regular paragraph - handle internal single newlines as line breaks
      const lines = trimmed.split('\n');
      return (
        <p
          key={idx}
          className={`text-zinc-300 leading-relaxed font-outfit font-normal tracking-wide ${
            size === 'compact' ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'
          }`}
        >
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {renderFormattedText(line)}
              {lIdx < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  const readableSectionsCount = sections.filter((s) => {
    const trimmed = s.trim();
    if (trimmed === '__DIVIDER__') return false;
    if (cleanCompare(trimmed) === 'anotefromthefounder') return false;
    if (hideDuplicateTitle && cardTitle) {
      const headingText = trimmed.replace(/^#{1,6}\s+/, '').trim();
      if (cleanCompare(headingText) === cleanCompare(cardTitle)) return false;
    }
    return true;
  }).length;

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`space-y-2.5 transition-all duration-300 relative ${
          collapsible && !isExpanded ? (size === 'compact' ? 'max-h-36 overflow-hidden' : 'max-h-56 overflow-hidden') : ''
        }`}
      >
        {renderContent()}

        {collapsible && !isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-[#0d0914] via-[#0d0914]/90 to-transparent pointer-events-none" />
        )}
      </div>

      {collapsible && (
        <div className="pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle(!isExpanded);
            }}
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold text-rose-300 hover:text-rose-200 transition-colors bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Collapse Note</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Read Full Founder's Note ({readableSectionsCount} sections)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

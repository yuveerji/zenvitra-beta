'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { ZenDocument } from '@/types/docs';

interface ZenDocsCanvasProps {
  activeDoc: ZenDocument;
  editorRef: React.RefObject<HTMLDivElement | null>;
  paperMode: 'light' | 'dark';
  zoomLevel: number;
  fontFamily: string;
  fontSize: number;
  lineSpacing: string;
  showRuler: boolean;
  onInput: () => void;
}

export function ZenDocsCanvas({
  activeDoc,
  editorRef,
  paperMode,
  zoomLevel,
  fontFamily,
  fontSize,
  lineSpacing,
  showRuler,
  onInput,
}: ZenDocsCanvasProps) {
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync line numbers to editor content height
  const updateLineNumbers = useCallback(() => {
    if (!editorRef.current || !lineNumbersRef.current) return;
    const editorEl = editorRef.current;
    const lineNumEl = lineNumbersRef.current;

    // Calculate approximate line count based on content height / line height
    const computedStyle = window.getComputedStyle(editorEl);
    const lineHeight = parseFloat(computedStyle.lineHeight) || (fontSize * parseFloat(lineSpacing));
    const contentHeight = editorEl.scrollHeight;
    const lineCount = Math.max(1, Math.ceil(contentHeight / lineHeight));

    // Generate line numbers
    const numbers: string[] = [];
    for (let i = 1; i <= lineCount; i++) {
      numbers.push(String(i));
    }

    lineNumEl.innerHTML = numbers
      .map(
        (n) =>
          `<div style="height: ${lineHeight}px; display: flex; align-items: flex-start; padding-top: 2px;">${n}</div>`
      )
      .join('');
  }, [editorRef, fontSize, lineSpacing]);

  useEffect(() => {
    updateLineNumbers();
    const observer = new MutationObserver(updateLineNumbers);
    if (editorRef.current) {
      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
    return () => observer.disconnect();
  }, [editorRef, updateLineNumbers]);

  // Update line numbers on zoom/font changes
  useEffect(() => {
    const timer = setTimeout(updateLineNumbers, 100);
    return () => clearTimeout(timer);
  }, [zoomLevel, fontFamily, fontSize, lineSpacing, updateLineNumbers]);

  const isLight = paperMode === 'light';

  return (
    <div className="flex-1 flex justify-center overflow-x-auto py-6 relative">
      <div
        className="transition-transform duration-200 flex flex-col items-center"
        style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
      >
        {/* Horizontal Ruler */}
        {showRuler && (
          <div
            className={`w-[816px] h-5 border-b flex items-center justify-between text-[8px] font-mono select-none px-12 mb-1 print:hidden ${
              isLight
                ? 'bg-neutral-100 border-neutral-200 text-neutral-400'
                : 'bg-[#111522]/60 border-white/[0.06] text-neutral-600'
            }`}
          >
            <div className="flex justify-between w-full">
              {['1"', '2"', '3"', '4"', '5"', '6"', '7"'].map((mark, i) => (
                <span key={mark} className={i === 3 ? 'text-cyan-500/60 font-bold' : ''}>
                  {mark}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* A4 Paper Sheet */}
        <div
          className={`w-[816px] min-h-[1056px] relative transition-colors duration-300 border print:p-0 print:border-none print:shadow-none print:w-full print:bg-white print:text-black ${
            isLight
              ? 'bg-[#fcfdfe] text-[#111827] border-neutral-200/80 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.5)] rounded-sm'
              : 'bg-[#111522] text-[#e5e7eb] border-white/[0.08] shadow-[0_25px_80px_-20px_rgba(6,182,212,0.06)] rounded-lg'
          }`}
          style={{
            fontFamily: fontFamily,
            lineHeight: lineSpacing,
          }}
        >
          {/* Specular top highlight for dark mode */}
          {!isLight && (
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
          )}

          {/* Header Watermark */}
          <div className={`flex items-center justify-between text-[9px] font-mono select-none px-16 sm:px-20 pt-12 pb-6 ${
            isLight ? 'text-neutral-400' : 'text-neutral-600'
          }`}>
            <span>{activeDoc.docCode}</span>
            <span className={`uppercase font-bold tracking-[0.2em] text-[8px] ${
              isLight ? 'text-cyan-600/50' : 'text-cyan-400/30'
            }`}>
              {activeDoc.committeeOrChamber}
            </span>
            <span>Page 1</span>
          </div>

          {/* Content Area with Gutter Line Numbers */}
          <div className="flex px-8 sm:px-10">
            {/* Gutter Line Numbers */}
            <div
              ref={lineNumbersRef}
              className={`w-8 shrink-0 text-right pr-3 select-none font-mono text-[10px] print:hidden ${
                isLight ? 'text-neutral-300' : 'text-neutral-700'
              }`}
              style={{
                fontSize: `${Math.max(9, fontSize - 2)}pt`,
                lineHeight: lineSpacing,
              }}
              aria-hidden="true"
            />

            {/* Editable Document Body */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={onInput}
              className={`flex-1 outline-none min-h-[850px] leading-relaxed px-8 sm:px-10 pb-20 ${
                isLight ? 'selection:bg-cyan-400/20' : 'selection:bg-cyan-500/20'
              }`}
              style={{
                fontSize: `${fontSize}pt`,
              }}
            />
          </div>

          {/* Footer Watermark */}
          <div className={`px-16 sm:px-20 pb-10 pt-8 border-t border-dashed flex items-center justify-between text-[8px] font-mono select-none ${
            isLight
              ? 'border-neutral-200 text-neutral-300'
              : 'border-white/[0.06] text-neutral-700'
          }`}>
            <span>ZENVITRA SOVEREIGN MESH • ZERO AD SURVEILLANCE</span>
            <span>25% CIVIC ENDOWMENT RATIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
}

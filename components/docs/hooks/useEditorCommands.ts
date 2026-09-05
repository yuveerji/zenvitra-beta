'use client';

import { useCallback, RefObject } from 'react';
import { UN_PREAMBLE_PREFIXES, UN_OPERATIVE_PREFIXES, INDIAN_BILL_SECTIONS } from '@/lib/docsData';

export interface EditorCommandsOptions {
  editorRef: RefObject<HTMLDivElement | null>;
  paperMode: 'light' | 'dark';
  onContentChange: () => void;
  onSave: (overrides?: Record<string, unknown>) => void;
  onToast: (msg: string) => void;
}

export function useEditorCommands({
  editorRef,
  paperMode,
  onContentChange,
  onSave,
  onToast,
}: EditorCommandsOptions) {
  const textColor = paperMode === 'light' ? '#1f2937' : '#e5e7eb';
  const subTextColor = paperMode === 'light' ? '#374151' : '#d1d5db';
  const headingColor = paperMode === 'light' ? '#111827' : '#f3f4f6';

  const focusEditor = useCallback(() => {
    editorRef.current?.focus();
  }, [editorRef]);

  const execCmd = useCallback(
    (command: string, value?: string) => {
      if (typeof document !== 'undefined') {
        document.execCommand(command, false, value);
        focusEditor();
        onContentChange();
      }
    },
    [focusEditor, onContentChange]
  );

  // Formatting toggles
  const toggleBold = useCallback(() => execCmd('bold'), [execCmd]);
  const toggleItalic = useCallback(() => execCmd('italic'), [execCmd]);
  const toggleUnderline = useCallback(() => execCmd('underline'), [execCmd]);
  const toggleStrikethrough = useCallback(() => execCmd('strikeThrough'), [execCmd]);

  // Alignment
  const setAlignment = useCallback(
    (align: 'left' | 'center' | 'right' | 'justify') => {
      const cmdMap = { left: 'justifyLeft', center: 'justifyCenter', right: 'justifyRight', justify: 'justifyFull' };
      execCmd(cmdMap[align]);
    },
    [execCmd]
  );

  // Lists
  const toggleBulletList = useCallback(() => execCmd('insertUnorderedList'), [execCmd]);
  const toggleNumberedList = useCallback(() => execCmd('insertOrderedList'), [execCmd]);

  // Indent
  const indent = useCallback(() => execCmd('indent'), [execCmd]);
  const outdent = useCallback(() => execCmd('outdent'), [execCmd]);

  // Clear formatting
  const clearFormatting = useCallback(() => execCmd('removeFormat'), [execCmd]);

  // Text color
  const setTextColor = useCallback((color: string) => execCmd('foreColor', color), [execCmd]);
  const setHighlight = useCallback((color: string) => execCmd('hiliteColor', color), [execCmd]);

  // Undo / Redo
  const undo = useCallback(() => execCmd('undo'), [execCmd]);
  const redo = useCallback(() => execCmd('redo'), [execCmd]);

  // Insert HTML at cursor
  const insertHTML = useCallback(
    (html: string) => {
      execCmd('insertHTML', html);
    },
    [execCmd]
  );

  // Insert horizontal rule
  const insertDivider = useCallback(() => {
    execCmd('insertHorizontalRule');
    onToast('Inserted divider');
  }, [execCmd, onToast]);

  // Insert heading
  const insertHeading = useCallback(
    (level: 1 | 2 | 3) => {
      const sizes = { 1: '22px', 2: '18px', 3: '15px' };
      const html = `<h${level} style="font-size: ${sizes[level]}; font-weight: 800; margin: 16px 0 8px 0; color: ${headingColor};">Heading ${level}</h${level}>`;
      insertHTML(html);
      onToast(`Inserted Heading ${level}`);
    },
    [insertHTML, headingColor, onToast]
  );

  // Insert blockquote
  const insertBlockquote = useCallback(() => {
    const html = `<blockquote style="border-left: 3px solid #06b6d4; padding-left: 16px; margin: 16px 0; font-style: italic; color: ${subTextColor};">Enter quote text here…</blockquote>`;
    insertHTML(html);
    onToast('Inserted blockquote');
  }, [insertHTML, subTextColor, onToast]);

  // UN Preamble clause
  const insertPreambleClause = useCallback(
    (prefix: string) => {
      const html = `<p style="font-size: 14px; line-height: 1.8; color: ${textColor};"><strong style="text-decoration: underline;">${prefix}</strong> the crucial imperative of transparent multilateral digital cooperation,</p>`;
      insertHTML(html);
      onToast(`Inserted preambular clause "${prefix}"`);
    },
    [insertHTML, textColor, onToast]
  );

  // UN Operative clause
  const insertOperativeClause = useCallback(
    (prefix: string) => {
      const count = (editorRef.current?.innerText.match(/\d+\.\s/g)?.length || 0) + 1;
      const html = `<p style="font-size: 14px; line-height: 1.8; color: ${textColor};"><strong>${count}. <span style="text-decoration: underline;">${prefix}</span></strong> all participating sovereign nodes to establish verifiable safety standards;</p>`;
      insertHTML(html);
      onToast(`Inserted operative clause "${prefix}"`);
    },
    [editorRef, insertHTML, textColor, onToast]
  );

  // Indian Bill section
  const insertBillSection = useCallback(
    (sec: { prefix: string; placeholder: string }) => {
      const html = `<h3 style="font-size: 14px; font-weight: bold; margin-top: 18px; margin-bottom: 6px; color: ${headingColor};">${sec.prefix}</h3><p style="font-size: 13px; line-height: 1.8; color: ${subTextColor};">${sec.placeholder.replace(/\\n/g, '<br />')}</p>`;
      insertHTML(html);
      onToast(`Inserted Parliamentary ${sec.prefix.split('.')[0]}`);
    },
    [insertHTML, headingColor, subTextColor, onToast]
  );

  // Sovereign cryptographic seal
  const insertSovereignSeal = useCallback(() => {
    const hash =
      '0x' +
      Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const sealHtml = `<div style="margin: 32px 0; padding: 16px 20px; border-radius: 12px; border: 1.5px solid #06b6d4; background: ${paperMode === 'light' ? '#f0fdf4' : '#082f49'}; font-family: monospace; font-size: 11px;">
  <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(6,182,212,0.3); padding-bottom: 8px; margin-bottom: 8px;">
    <span style="font-weight: 800; color: #0891b2;">🛡️ ZENVITRA CONSTITUTIONAL SOVEREIGN SEAL &bull; RATIFIED</span>
    <span style="color: #059669; font-weight: bold;">25% CIVIC ENDOWMENT LOCKED</span>
  </div>
  <p style="margin: 4px 0; color: ${paperMode === 'light' ? '#374151' : '#93c5fd'};"><strong>SHA-256 HASH:</strong> ${hash}</p>
  <p style="margin: 4px 0; color: ${paperMode === 'light' ? '#4b5563' : '#60a5fa'};"><strong>PLENIPOTENTIARY STAMP:</strong> Authenticated by Sovereign Node Yuveer on ${new Date().toISOString()}</p>
</div>`;
    insertHTML(sealHtml);
    onSave({ cryptographicHash: hash, sealedAt: new Date().toISOString() });
    onToast('Stamped Sovereign Cryptographic Seal');
  }, [paperMode, insertHTML, onSave, onToast]);

  // Selection state
  const getSelectedText = useCallback(() => {
    const sel = window.getSelection();
    return sel?.toString() || '';
  }, []);

  const isSelectionActive = useCallback(() => {
    const sel = window.getSelection();
    return sel ? !sel.isCollapsed && (sel.toString().length > 0) : false;
  }, []);

  return {
    execCmd,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
    setAlignment,
    toggleBulletList,
    toggleNumberedList,
    indent,
    outdent,
    clearFormatting,
    setTextColor,
    setHighlight,
    undo,
    redo,
    insertHTML,
    insertDivider,
    insertHeading,
    insertBlockquote,
    insertPreambleClause,
    insertOperativeClause,
    insertBillSection,
    insertSovereignSeal,
    getSelectedText,
    isSelectionActive,
    focusEditor,
    // Export constants for slash menu
    preamblePrefixes: UN_PREAMBLE_PREFIXES,
    operativePrefixes: UN_OPERATIVE_PREFIXES,
    billSections: INDIAN_BILL_SECTIONS,
  };
}

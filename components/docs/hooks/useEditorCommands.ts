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

  // High-Tech Divider with glowing diamond aura
  const insertDivider = useCallback(() => {
    const dividerHtml = `<div style="margin: 24px 0; display: flex; align-items: center; gap: 12px; user-select: none;" role="separator"><div style="height: 1px; background: linear-gradient(to right, transparent, rgba(6,182,212,0.4), rgba(6,182,212,0.7)); flex: 1;"></div><span style="font-size: 11px; font-family: monospace; color: #06b6d4; letter-spacing: 0.2em;">❖</span><div style="height: 1px; background: linear-gradient(to right, rgba(6,182,212,0.7), rgba(6,182,212,0.4), transparent); flex: 1;"></div></div><p><br></p>`;
    insertHTML(dividerHtml);
    onToast('Inserted divider');
  }, [insertHTML, onToast]);

  // Insert Table (Word & Google Docs style)
  const insertTable = useCallback(
    (rows: number = 3, cols: number = 3) => {
      const borderColor = paperMode === 'light' ? '#cbd5e1' : 'rgba(255,255,255,0.15)';
      const headerBg = paperMode === 'light' ? '#f1f5f9' : 'rgba(255,255,255,0.06)';
      
      let html = `<table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; border: 1px solid ${borderColor};">`;
      html += '<thead><tr>';
      for (let c = 0; c < cols; c++) {
        html += `<th style="border: 1px solid ${borderColor}; background: ${headerBg}; padding: 8px 12px; font-weight: 700; text-align: left; color: ${headingColor};">Header ${c + 1}</th>`;
      }
      html += '</tr></thead><tbody>';
      for (let r = 0; r < rows; r++) {
        html += '<tr>';
        for (let c = 0; c < cols; c++) {
          html += `<td style="border: 1px solid ${borderColor}; padding: 8px 12px; color: ${textColor};">Cell ${r + 1},${c + 1}</td>`;
        }
        html += '</tr>';
      }
      html += '</tbody></table><p><br></p>';
      insertHTML(html);
      onToast(`Inserted ${rows}x${cols} Table`);
    },
    [insertHTML, paperMode, headingColor, textColor, onToast]
  );

  // Insert Image
  const insertImage = useCallback(
    (url: string, caption?: string) => {
      if (!url) return;
      const html = `<figure style="margin: 20px 0; text-align: center;"><img src="${url}" alt="${caption || 'Document Image'}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); display: inline-block;" />${caption ? `<figcaption style="font-size: 11px; color: ${subTextColor}; margin-top: 6px; font-style: italic;">${caption}</figcaption>` : ''}</figure><p><br></p>`;
      insertHTML(html);
      onToast('Inserted image');
    },
    [insertHTML, subTextColor, onToast]
  );

  // Insert Link
  const insertLink = useCallback(
    (url: string, text?: string) => {
      if (!url) return;
      const label = text || url;
      const html = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #06b6d4; text-decoration: underline; font-weight: 500;">${label}</a>`;
      insertHTML(html);
      onToast('Inserted hyperlink');
    },
    [insertHTML, onToast]
  );

  // Insert Checklist
  const insertChecklist = useCallback(() => {
    const html = `<div style="display: flex; align-items: flex-start; gap: 8px; margin: 4px 0;"><input type="checkbox" style="margin-top: 4px; accent-color: #06b6d4; width: 14px; height: 14px; cursor: pointer;" /><span style="color: ${textColor};">Task checklist item...</span></div><p><br></p>`;
    insertHTML(html);
    onToast('Inserted checklist');
  }, [insertHTML, textColor, onToast]);

  // Apply Heading & Styles
  const applyStyle = useCallback(
    (style: 'p' | 'title' | 'subtitle' | 'h1' | 'h2' | 'h3' | 'h4' | 'code') => {
      if (style === 'p') {
        execCmd('formatBlock', '<p>');
        onToast('Applied Normal text');
      } else if (style === 'title') {
        const sel = window.getSelection()?.toString() || 'Document Title';
        insertHTML(`<h1 style="font-size: 32px; font-weight: 900; line-height: 1.2; margin: 24px 0 12px 0; color: ${headingColor}; letter-spacing: -0.02em;">${sel}</h1><p><br></p>`);
        onToast('Applied Title style');
      } else if (style === 'subtitle') {
        const sel = window.getSelection()?.toString() || 'Document Subtitle';
        insertHTML(`<p style="font-size: 16px; line-height: 1.5; color: ${subTextColor}; margin-bottom: 20px; font-weight: 400;">${sel}</p><p><br></p>`);
        onToast('Applied Subtitle style');
      } else if (style === 'code') {
        const sel = window.getSelection()?.toString() || '// Enter code here...';
        const codeBg = paperMode === 'light' ? '#f1f5f9' : '#0f172a';
        insertHTML(`<pre style="background: ${codeBg}; padding: 14px 16px; border-radius: 10px; font-family: monospace; font-size: 12px; overflow-x: auto; border: 1px solid rgba(255,255,255,0.1); color: #06b6d4;"><code>${sel}</code></pre><p><br></p>`);
        onToast('Applied Code block');
      } else {
        execCmd('formatBlock', `<${style}>`);
        onToast(`Applied ${style.toUpperCase()}`);
      }
    },
    [execCmd, insertHTML, headingColor, subTextColor, paperMode, onToast]
  );

  // Insert formatted Date
  const insertDate = useCallback(() => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    insertHTML(`<span style="font-family: monospace; color: #06b6d4; font-weight: 600;">${formattedDate}</span> `);
    onToast('Inserted current date');
  }, [insertHTML, onToast]);

  // Insert Special Character
  const insertSpecialChar = useCallback(
    (char: string) => {
      insertHTML(char);
      onToast(`Inserted ${char}`);
    },
    [insertHTML, onToast]
  );

  // Import from Whiteboard
  const importWhiteboard = useCallback(() => {
    if (typeof window === 'undefined') return;
    const whiteboardData = localStorage.getItem('zen_whiteboard_export_last');
    if (!whiteboardData) {
      onToast('No saved Whiteboard drawing found! Open Whiteboard, sketch, and click Export.');
      return;
    }
    const html = `<div style="margin: 20px 0; text-align: center;"><img src="${whiteboardData}" alt="Whiteboard Export" style="max-width: 100%; border-radius: 12px; border: 1.5px solid rgba(6,182,212,0.4); box-shadow: 0 12px 36px rgba(0,0,0,0.35); display: inline-block;" /><div style="font-size: 10px; color: #06b6d4; font-family: monospace; font-weight: bold; margin-top: 6px; letter-spacing: 0.1em;">🎨 ZEN.WHITEBOARD EMBEDDED RECORD</div></div><p><br></p>`;
    insertHTML(html);
    onToast('Imported Whiteboard drawing into Document!');
  }, [insertHTML, onToast]);

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
  <p style="margin: 4px 0; color: ${paperMode === 'light' ? '#4b5563' : '#60a5fa'};"><strong>PLENIPOTENTIARY STAMP:</strong> Authenticated by Sovereign Authority on ${new Date().toISOString()}</p>
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
    insertTable,
    insertImage,
    insertLink,
    insertChecklist,
    applyStyle,
    insertDate,
    insertSpecialChar,
    importWhiteboard,
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

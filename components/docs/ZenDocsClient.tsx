'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Scale, CheckCircle2 } from 'lucide-react';
import { useDocumentEditor } from './hooks/useDocumentEditor';
import { useEditorCommands } from './hooks/useEditorCommands';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ZenDocsToolbar } from './ZenDocsToolbar';
import { ZenDocsCanvas } from './ZenDocsCanvas';
import { ZenDocsBubbleMenu } from './ZenDocsBubbleMenu';
import { ZenDocsSlashMenu } from './ZenDocsSlashMenu';
import { ZenDocsOutline } from './ZenDocsOutline';
import { ZenDocsSidebar } from './ZenDocsSidebar';
import { ZenDocsStatusBar } from './ZenDocsStatusBar';
import { ZenDocsCommandPalette } from './ZenDocsCommandPalette';
import { ZenDocsHomeDashboard } from './ZenDocsHomeDashboard';
import { ExportFormat, exportDocument } from '@/lib/exportDocument';
import {
  ShareModal,
  TableToChamberModal,
  DocumentStatsModal,
  AiCopilotModal,
  DocTasksModal,
  DocVersionHistoryModal,
  PublishToPressModal,
  SaveAsModal,
} from './modals';

export function ZenDocsClient() {
  const editor = useDocumentEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChangeRef = useRef<boolean>(false);

  // UI Drawer & Modal State
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showOutline, setShowOutline] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState<boolean>(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isTasksModalOpen, setIsTasksModalOpen] = useState<boolean>(false);
  const [isVersionsModalOpen, setIsVersionsModalOpen] = useState<boolean>(false);
  const [isPublishPressModalOpen, setIsPublishPressModalOpen] = useState<boolean>(false);
  const [isSaveAsModalOpen, setIsSaveAsModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Export Document Handler
  const handleExportFormat = useCallback((format: ExportFormat) => {
    if (editorRef.current && editor.activeDoc) {
      const rawText = editorRef.current.innerText || '';
      const currentDoc = {
        ...editor.activeDoc,
        contentHtml: editorRef.current.innerHTML || editor.activeDoc.contentHtml,
      };
      exportDocument(currentDoc, format, rawText);
      editor.triggerToast(`Exported document as ${format.toUpperCase()}`);
    }
  }, [editor]);

  // Slash Command State
  const [isSlashMenuOpen, setIsSlashMenuOpen] = useState<boolean>(false);
  const [slashPosition, setSlashPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [slashQuery, setSlashQuery] = useState<string>('');

  // Handle Input in editor
  const handleEditorInput = useCallback(() => {
    isInternalChangeRef.current = true;
    if (editorRef.current) {
      const text = editorRef.current.innerText || '';
      editor.updateTelemetry(text);
      editor.saveDocument({ contentHtml: editorRef.current.innerHTML });
    }
  }, [editor]);

  // Commands Hook
  const commands = useEditorCommands({
    editorRef,
    paperMode: editor.paperMode,
    onContentChange: handleEditorInput,
    onSave: (overrides) => editor.saveDocument(overrides),
    onToast: editor.triggerToast,
  });

  // Global Keyboard Shortcuts
  useKeyboardShortcuts({
    onSave: () => {
      if (editorRef.current) {
        editor.saveDocument({ contentHtml: editorRef.current.innerHTML });
        editor.triggerToast('Saved to Sovereign Storage');
      }
    },
    onPrint: () => window.print(),
    onToggleStar: editor.toggleStar,
    onOpenCommandPalette: () => setIsCommandPaletteOpen(true),
    onCloseAll: () => {
      setIsCommandPaletteOpen(false);
      setIsShareModalOpen(false);
      setIsTableModalOpen(false);
      setIsStatsModalOpen(false);
      setIsAiModalOpen(false);
      setIsTasksModalOpen(false);
      setIsVersionsModalOpen(false);
      setIsPublishPressModalOpen(false);
      setIsSaveAsModalOpen(false);
      setIsSlashMenuOpen(false);
      setShowSidebar(false);
    },
  });

  // Sync content when active document changes
  useEffect(() => {
    if (editorRef.current && editor.activeDoc) {
      if (!isInternalChangeRef.current) {
        editorRef.current.innerHTML = editor.activeDoc.contentHtml || '<p>Start typing your sovereign resolution, bill, or draft here...</p>';
      }
      editor.updateTelemetry(editorRef.current.innerText || '');
    }
    isInternalChangeRef.current = false;
  }, [editor.activeDocId, editor.activeDoc]);

  // Detect Slash command trigger on keydown
  const handleEditorKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '/') {
      setTimeout(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect && rect.top > 0) {
            setSlashPosition({
              x: Math.min(window.innerWidth - 320, Math.max(16, rect.left)),
              y: Math.min(window.innerHeight - 350, rect.bottom + 8),
            });
            setSlashQuery('');
            setIsSlashMenuOpen(true);
          }
        }
      }, 10);
    } else if (isSlashMenuOpen) {
      if (e.key === 'Escape') {
        setIsSlashMenuOpen(false);
      } else if (e.key === 'Backspace') {
        setTimeout(() => {
          const selection = window.getSelection();
          const text = selection?.anchorNode?.textContent || '';
          const lastSlash = text.lastIndexOf('/');
          if (lastSlash === -1) {
            setIsSlashMenuOpen(false);
          } else {
            setSlashQuery(text.slice(lastSlash + 1));
          }
        }, 10);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setSlashQuery((prev) => prev + e.key);
      }
    }
  }, [isSlashMenuOpen]);

  // Export to Markdown
  const handleExportMarkdown = useCallback(() => {
    if (!editorRef.current) return;
    const text = editorRef.current.innerText;
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${editor.activeDoc.title.replace(/\s+/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    editor.triggerToast('Downloaded document as Markdown (.md)');
  }, [editor]);

  // Table to Chamber Flow
  const handleTableToChamber = useCallback(() => {
    editor.saveDocument({ status: 'TABLED' });
    setIsTableModalOpen(true);
  }, [editor]);

  // Render SSR Loading Shell until mounted
  if (!editor.isMounted) {
    return (
      <div className="min-h-screen bg-[#06080e] text-neutral-200 flex flex-col justify-between font-sans pt-20 sm:pt-24">
        <div className="print:hidden">
          <Navbar />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 py-32">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Scale className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div className="text-center space-y-1.5">
            <h3 className="text-white font-display font-bold text-base tracking-wide">
              ZEN.DOCS Sovereign Drafting Studio
            </h3>
            <p className="text-xs text-neutral-500 font-mono">
              Synchronizing cryptographically verified resolutions and bills...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080e] text-neutral-200 flex flex-col justify-between font-sans selection:bg-cyan-500/30 pt-20 sm:pt-24 print:pt-0 print:bg-white print:text-black">
      <div className="print:hidden">
        <Navbar />
      </div>

      {/* Floating Toast Notification */}
      {editor.toastMessage && (
        <div className="fixed top-24 right-6 z-50 px-4 py-2.5 rounded-2xl bg-cyan-500 text-black font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-white/20">
          <CheckCircle2 className="w-4 h-4 text-black" />
          <span>{editor.toastMessage}</span>
        </div>
      )}

      {/* View Switcher: Dashboard Hub vs Canvas Editor */}
      {editor.activeView === 'DASHBOARD' ? (
        <ZenDocsHomeDashboard
          documents={editor.documents}
          activeDocId={editor.activeDocId}
          activeWorkspaceId={editor.activeWorkspaceId}
          onSelectDocument={editor.setActiveDocId}
          onCreateDocument={editor.createDocument}
          onCreateFromTemplate={editor.createFromTemplate}
          onDeleteDocument={editor.deleteDocument}
          onToggleTrash={editor.toggleTrash}
          onToggleStar={(id) => {
            if (id === editor.activeDocId) {
              editor.toggleStar();
            } else {
              editor.setActiveDocId(id);
              editor.toggleStar();
            }
          }}
          onSwitchToEditor={() => editor.setActiveView('EDITOR')}
          onWorkspaceChange={editor.setActiveWorkspaceId}
          onExportDocument={(doc) => {
            editor.setActiveDocId(doc.id);
            setIsSaveAsModalOpen(true);
          }}
        />
      ) : (
        /* Main Studio Shell */
        <div className="max-w-[1600px] mx-auto w-full px-2 sm:px-4 lg:px-6 py-3 flex-1 flex flex-col space-y-3">
          {/* Unified Top Toolbar */}
          <ZenDocsToolbar
            activeDoc={editor.activeDoc}
            isStarred={editor.isStarred}
            saveStatus={editor.saveStatus}
            paperMode={editor.paperMode}
            onToggleSidebar={() => setShowSidebar(true)}
            onSwitchToDashboard={() => editor.setActiveView('DASHBOARD')}
            onSave={() => {
              if (editorRef.current) {
                editor.saveDocument({ contentHtml: editorRef.current.innerHTML });
                editor.triggerToast('Saved to Sovereign Storage');
              }
            }}
            onOpenSaveAsModal={() => setIsSaveAsModalOpen(true)}
            onExportFormat={handleExportFormat}
            onPrint={() => window.print()}
            onOpenStats={() => setIsStatsModalOpen(true)}
            onMoveToTrash={() => editor.toggleTrash(editor.activeDocId)}
            onTitleChange={(title) => editor.saveDocument({ title })}
            onToggleStar={editor.toggleStar}
            onBold={commands.toggleBold}
            onItalic={commands.toggleItalic}
            onUnderline={commands.toggleUnderline}
            onStrikethrough={commands.toggleStrikethrough}
            onAlignment={commands.setAlignment}
            onBulletList={commands.toggleBulletList}
            onNumberedList={commands.toggleNumberedList}
            onTogglePaperMode={() => {
              const nextMode = editor.paperMode === 'light' ? 'dark' : 'light';
              editor.setPaperMode(nextMode);
              editor.saveDocument({ paperMode: nextMode });
            }}
            onOpenTasks={() => setIsTasksModalOpen(true)}
            onOpenVersions={() => setIsVersionsModalOpen(true)}
            onPublishToPress={() => setIsPublishPressModalOpen(true)}
            onShare={() => setIsShareModalOpen(true)}
            onTableToChamber={handleTableToChamber}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />

          {/* Workspace: Outline Sidebar + A4 Canvas */}
          <div className="flex-1 flex gap-4 min-h-[750px] relative">
            {/* Collapsible Document Outline Navigator */}
            <ZenDocsOutline
              editorRef={editorRef}
              isVisible={showOutline}
              onToggle={() => setShowOutline(!showOutline)}
            />

            {/* Canvas Sheet */}
            <div className="flex-1 flex flex-col" onKeyDown={handleEditorKeyDown}>
              <ZenDocsCanvas
                activeDoc={editor.activeDoc}
                editorRef={editorRef}
                paperMode={editor.paperMode}
                zoomLevel={editor.zoomLevel}
                fontFamily={editor.fontFamily}
                fontSize={editor.fontSize}
                lineSpacing={editor.lineSpacing}
                showRuler={editor.showRuler}
                onInput={handleEditorInput}
              />
            </div>
          </div>

          {/* Bottom Status Bar */}
          <ZenDocsStatusBar
            saveStatus={editor.saveStatus}
            docCode={editor.activeDoc.docCode}
            wordCount={editor.wordCount}
            charCount={editor.charCount}
            zoomLevel={editor.zoomLevel}
            fontFamily={editor.fontFamily}
            fontSize={editor.fontSize}
            lineSpacing={editor.lineSpacing}
            onZoomChange={editor.setZoomLevel}
            onFontFamilyChange={(font) => {
              editor.setFontFamily(font);
              commands.execCmd('fontName', font);
              editor.saveDocument({ fontFamily: font });
            }}
            onFontSizeChange={(size) => {
              editor.setFontSize(size);
              commands.execCmd('fontSize', String(Math.min(7, Math.max(1, Math.floor(size / 4)))));
              editor.saveDocument({ fontSize: size });
            }}
            onLineSpacingChange={(spacing) => {
              editor.setLineSpacing(spacing);
              editor.saveDocument({ lineSpacing: spacing });
            }}
          />
        </div>
      )}

      {/* Floating Bubble Formatting Menu on Selection */}
      <ZenDocsBubbleMenu
        editorRef={editorRef}
        onBold={commands.toggleBold}
        onItalic={commands.toggleItalic}
        onUnderline={commands.toggleUnderline}
        onStrikethrough={commands.toggleStrikethrough}
        onTextColor={commands.setTextColor}
        onHighlight={commands.setHighlight}
        onAlignment={commands.setAlignment}
      />

      {/* Floating Slash Command Menu */}
      <ZenDocsSlashMenu
        isOpen={isSlashMenuOpen}
        position={slashPosition}
        searchQuery={slashQuery}
        onClose={() => setIsSlashMenuOpen(false)}
        onInsertPreamble={(prefix) => {
          commands.insertPreambleClause(prefix);
          setIsSlashMenuOpen(false);
        }}
        onInsertOperative={(prefix) => {
          commands.insertOperativeClause(prefix);
          setIsSlashMenuOpen(false);
        }}
        onInsertBillSection={(sec) => {
          commands.insertBillSection(sec);
          setIsSlashMenuOpen(false);
        }}
        onInsertSeal={() => {
          commands.insertSovereignSeal();
          setIsSlashMenuOpen(false);
        }}
        onInsertDivider={() => {
          commands.insertDivider();
          setIsSlashMenuOpen(false);
        }}
        onInsertHeading={(level) => {
          commands.insertHeading(level);
          setIsSlashMenuOpen(false);
        }}
        onInsertBlockquote={() => {
          commands.insertBlockquote();
          setIsSlashMenuOpen(false);
        }}
        onOpenAI={() => {
          setIsSlashMenuOpen(false);
          setIsAiModalOpen(true);
        }}
      />

      {/* Left Slide-out Document Library Drawer */}
      <ZenDocsSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        documents={editor.documents}
        activeDocId={editor.activeDocId}
        onSelectDocument={(id) => {
          editor.setActiveDocId(id);
          setShowSidebar(false);
        }}
        onCreateDocument={(type) => {
          editor.createDocument(type);
          setShowSidebar(false);
        }}
        onDeleteDocument={editor.deleteDocument}
      />

      {/* Cmd+K Command Palette */}
      <ZenDocsCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onCreateDocument={editor.createDocument}
        onPrint={() => window.print()}
        onExportMarkdown={handleExportMarkdown}
        onExportFormat={handleExportFormat}
        onOpenSaveAsModal={() => setIsSaveAsModalOpen(true)}
        onTogglePaperMode={() => {
          const next = editor.paperMode === 'light' ? 'dark' : 'light';
          editor.setPaperMode(next);
          editor.saveDocument({ paperMode: next });
        }}
        onToggleRuler={() => editor.setShowRuler(!editor.showRuler)}
        onToggleOutline={() => setShowOutline(!showOutline)}
        onSetZoom={editor.setZoomLevel}
        onInsertSeal={commands.insertSovereignSeal}
        onInsertDivider={commands.insertDivider}
        onInsertHeading={commands.insertHeading}
        onInsertBlockquote={commands.insertBlockquote}
        onOpenAI={() => setIsAiModalOpen(true)}
        onOpenStats={() => setIsStatsModalOpen(true)}
        onToggleStar={editor.toggleStar}
        onShare={() => setIsShareModalOpen(true)}
        onTableToChamber={handleTableToChamber}
        paperMode={editor.paperMode}
        documentNames={editor.documents.map((d) => ({ id: d.id, title: d.title }))}
        onSwitchDocument={editor.setActiveDocId}
      />

      {/* Modals */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        activeDoc={editor.activeDoc}
        onToast={editor.triggerToast}
      />

      <TableToChamberModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
        activeDoc={editor.activeDoc}
        onToast={editor.triggerToast}
      />

      <DocumentStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        wordCount={editor.wordCount}
        charCount={editor.charCount}
        activeDoc={editor.activeDoc}
      />

      <AiCopilotModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onInsertHTML={commands.insertHTML}
        paperMode={editor.paperMode}
        onToast={editor.triggerToast}
      />

      <DocTasksModal
        isOpen={isTasksModalOpen}
        onClose={() => setIsTasksModalOpen(false)}
        activeDoc={editor.activeDoc}
        onAddTask={editor.addTask}
        onToggleTask={editor.toggleTask}
      />

      <DocVersionHistoryModal
        isOpen={isVersionsModalOpen}
        onClose={() => setIsVersionsModalOpen(false)}
        activeDoc={editor.activeDoc}
        onSaveSnapshot={editor.saveVersionSnapshot}
      />

      <PublishToPressModal
        isOpen={isPublishPressModalOpen}
        onClose={() => setIsPublishPressModalOpen(false)}
        activeDoc={editor.activeDoc}
        onConfirmPublish={editor.publishToPress}
      />

      <SaveAsModal
        isOpen={isSaveAsModalOpen}
        onClose={() => setIsSaveAsModalOpen(false)}
        activeDoc={editor.activeDoc}
        onToast={editor.triggerToast}
      />

      <div className="print:hidden">
        <Footer />
      </div>
    </div>
  );
}

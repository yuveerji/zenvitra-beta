'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ZenDocument, ZenDocType, ZenDocTask, ZenDocComment, ZenDocVersion } from '@/types/docs';
import { INITIAL_DOCUMENTS, LS_ZEN_DOCS, DOC_TEMPLATES, DocTemplateDefinition, INITIAL_WORKSPACES } from '@/lib/docsData';

interface DocumentEditorState {
  documents: ZenDocument[];
  activeDocId: string;
  activeDoc: ZenDocument;
  activeView: 'EDITOR' | 'DASHBOARD';
  activeWorkspaceId: string;
  isMounted: boolean;
  paperMode: 'light' | 'dark';
  zoomLevel: number;
  fontFamily: string;
  fontSize: number;
  lineSpacing: string;
  isStarred: boolean;
  showRuler: boolean;
  saveStatus: string;
  wordCount: number;
  charCount: number;
  toastMessage: string | null;
}

interface DocumentEditorActions {
  setDocuments: React.Dispatch<React.SetStateAction<ZenDocument[]>>;
  setActiveDocId: (id: string) => void;
  setActiveView: (view: 'EDITOR' | 'DASHBOARD') => void;
  setActiveWorkspaceId: (id: string) => void;
  setPaperMode: (mode: 'light' | 'dark') => void;
  setZoomLevel: (zoom: number) => void;
  setFontFamily: (font: string) => void;
  setFontSize: (size: number) => void;
  setLineSpacing: (spacing: string) => void;
  toggleStar: () => void;
  setShowRuler: (show: boolean) => void;
  createDocument: (type: ZenDocType, title?: string, initialHtml?: string) => void;
  createFromTemplate: (templateId: string) => void;
  deleteDocument: (id: string) => void;
  toggleTrash: (id: string) => void;
  saveDocument: (overrides?: Partial<ZenDocument>) => void;
  addTask: (title: string, assignee: string, dueDate?: string) => void;
  toggleTask: (taskId: string) => void;
  addComment: (text: string) => void;
  resolveComment: (commentId: string) => void;
  saveVersionSnapshot: (label?: string) => void;
  publishToPress: () => void;
  updateTelemetry: (text: string) => void;
  triggerToast: (msg: string) => void;
}

export type UseDocumentEditorReturn = DocumentEditorState & DocumentEditorActions;

export function useDocumentEditor(): UseDocumentEditorReturn {
  const [isMounted, setIsMounted] = useState(false);
  const [documents, setDocuments] = useState<ZenDocument[]>(INITIAL_DOCUMENTS);
  const [activeDocId, setActiveDocIdRaw] = useState<string>(INITIAL_DOCUMENTS[0]?.id || 'DOC-UN-2026-001');
  const [activeView, setActiveView] = useState<'EDITOR' | 'DASHBOARD'>('EDITOR');
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>('ws-foundation');
  const [paperMode, setPaperMode] = useState<'light' | 'dark'>('light');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [fontFamily, setFontFamily] = useState('Times New Roman');
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState('1.5');
  const [isStarred, setIsStarred] = useState(false);
  const [showRuler, setShowRuler] = useState(true);
  const [saveStatus, setSaveStatus] = useState('Saved to Sovereign Storage');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeDoc = documents.find((d) => d.id === activeDocId) || documents[0] || INITIAL_DOCUMENTS[0];

  // Hydrate from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(LS_ZEN_DOCS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocuments(parsed);
          setActiveDocIdRaw(parsed[0].id);
          setIsStarred(Boolean(parsed[0].starred));
          if (parsed[0].paperMode) setPaperMode(parsed[0].paperMode);
          if (parsed[0].fontFamily) setFontFamily(parsed[0].fontFamily);
          if (parsed[0].fontSize) setFontSize(parsed[0].fontSize);
          if (parsed[0].lineSpacing) setLineSpacing(parsed[0].lineSpacing);
        }
      }
    } catch (e) {
      console.error('Error hydrating ZenDocs storage', e);
    }
  }, []);

  const triggerToast = useCallback((msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const persistToStorage = useCallback((docs: ZenDocument[]) => {
    try {
      localStorage.setItem(LS_ZEN_DOCS, JSON.stringify(docs));
    } catch {}
  }, []);

  const setActiveDocId = useCallback((id: string) => {
    setActiveDocIdRaw(id);
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      setIsStarred(Boolean(doc.starred));
      if (doc.paperMode) setPaperMode(doc.paperMode);
      if (doc.fontFamily) setFontFamily(doc.fontFamily);
      if (doc.fontSize) setFontSize(doc.fontSize);
      if (doc.lineSpacing) setLineSpacing(doc.lineSpacing);
    }
  }, [documents]);

  const saveDocument = useCallback((overrides?: Partial<ZenDocument>) => {
    setSaveStatus('Saving…');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    setDocuments((prev) => {
      const updatedDocs = prev.map((d) => {
        if (d.id !== activeDocId) return d;
        return {
          ...d,
          paperMode,
          fontFamily,
          fontSize,
          lineSpacing,
          starred: isStarred,
          updatedAt: new Date().toISOString(),
          version: (d.version || 1) + 1,
          ...overrides,
        };
      });
      persistToStorage(updatedDocs);
      return updatedDocs;
    });

    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('All changes saved');
    }, 400);
  }, [activeDocId, paperMode, fontFamily, fontSize, lineSpacing, isStarred, persistToStorage]);

  const toggleStar = useCallback(() => {
    const next = !isStarred;
    setIsStarred(next);
    setDocuments((prev) => {
      const updated = prev.map((d) =>
        d.id === activeDocId ? { ...d, starred: next, updatedAt: new Date().toISOString() } : d
      );
      persistToStorage(updated);
      return updated;
    });
    triggerToast(next ? 'Document starred' : 'Document unstarred');
  }, [isStarred, activeDocId, persistToStorage, triggerToast]);

  const createDocument = useCallback((type: ZenDocType, customTitle?: string, customHtml?: string) => {
    const docId = `DOC-${Date.now()}`;
    let title = customTitle || 'Untitled Document';
    let docCode = `ZEN/DOC/${Date.now().toString().slice(-4)}`;
    let initialHtml = customHtml || '';
    let committee = 'General Plenary';
    let font = 'Inter';

    if (!customHtml) {
      if (type === 'UN_RESOLUTION') {
        title = customTitle || 'NAME YOUR DRAFT RESOLUTION';
        docCode = `UNSC/RES/79/DRAFT-${Date.now().toString().slice(-3)}`;
        committee = 'UN General Assembly';
        font = 'Times New Roman';
        initialHtml = `<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-size: 11px; letter-spacing: 0.18em; font-family: monospace; font-weight: bold; color: #4b5563; text-transform: uppercase; margin-bottom: 8px;">United Nations Security Council &bull; Seventy-Ninth Session</p>
  <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 10px 0; color: #111827;">${title}</h1>
  <p style="font-size: 12px; color: #4b5563; margin: 0;"><strong>Sponsors:</strong> Primary Delegation &nbsp;|&nbsp; <strong>Signatories:</strong> Co-Sponsors</p>
</div>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 14px; line-height: 1.8; font-style: italic; color: #1f2937;"><em>The Security Council,</em></p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;"><strong style="text-decoration: underline;">Guided by</strong> the fundamental principles of sovereign compute governance and non-surveillance,</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;"><strong>1. <span style="text-decoration: underline;">Calls upon</span></strong> all Member States to establish open cryptographic verification protocols;</p>
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;"><strong>2. <span style="text-decoration: underline;">Decides</span></strong> to remain actively seized of the matter.</p>`;
      } else if (type === 'INDIAN_BILL') {
        title = customTitle || 'NAME YOUR BILL';
        docCode = `BILL/PARL/2026/${Date.now().toString().slice(-3)}`;
        committee = 'Lok Sabha';
        font = 'Georgia';
        initialHtml = `<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-size: 11px; letter-spacing: 0.15em; font-family: monospace; font-weight: bold; color: #6b7280; text-transform: uppercase; margin-bottom: 6px;">As Introduced in Lok Sabha &bull; Bill of 2026</p>
  <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 10px 0; color: #111827;">${title}</h1>
  <p style="font-size: 12px; font-style: italic; color: #4b5563; margin: 0;">A Bill to [State the Long Title / Objectives of Your Bill].</p>
</div>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 13px; line-height: 1.8; font-style: italic; text-align: center; color: #374151;">BE it enacted by Parliament in the Seventy-Seventh Year of the Republic of India as follows:—</p>
<h3 style="font-size: 14px; font-weight: bold; margin-top: 20px; margin-bottom: 8px; color: #111827;">1. Short title, extent and commencement.—</h3>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">(1) This Act may be called the ${title} Act, 2026.<br />(2) It extends to the whole of India.</p>`;
      } else if (type === 'POLICY_WORKING_PAPER') {
        title = customTitle || 'NAME YOUR WORKING PAPER';
        docCode = `WP/MUN/2026/${Date.now().toString().slice(-3)}`;
        committee = 'Working Group';
        font = 'Inter';
        initialHtml = `<h1 style="font-size: 22px; font-weight: 800; color: #111827;">${title}</h1>
<p style="font-size: 12px; color: #6b7280; font-family: monospace;">Authors: Delegation Bloc &bull; Working Group on [Topic]</p>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 16px 0;" />
<h3 style="font-size: 15px; font-weight: bold; color: #111827;">1. Core Diplomatic Objectives</h3>
<p style="font-size: 13px; line-height: 1.8; color: #374151;">Outline specific diplomatic mechanisms, proposed clauses, and verification protocols agreed upon by the signatory bloc.</p>`;
      } else if (type === 'CONSTITUENT_ARTICLE') {
        title = customTitle || 'NAME YOUR CONSTITUTION ARTICLE';
        docCode = `CONST/ART/${Date.now().toString().slice(-3)}`;
        committee = 'Constituent Assembly';
        font = 'Georgia';
        initialHtml = `<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-size: 11px; letter-spacing: 0.15em; font-family: monospace; font-weight: bold; color: #6b7280; text-transform: uppercase;">Constituent Assembly of India &bull; Drafting Session</p>
  <h1 style="font-size: 20px; font-weight: 800; margin: 8px 0; color: #111827;">${title}</h1>
</div>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;">Draft constitutional provisions, fundamental rights, and sovereign protections here.</p>`;
      } else if (type === 'CRISIS_DIRECTIVE') {
        title = customTitle || 'NAME YOUR CRISIS DIRECTIVE';
        docCode = `CRISIS/DIR/${Date.now().toString().slice(-3)}`;
        committee = 'Crisis Cabinet';
        font = 'Courier New';
        initialHtml = `<div style="text-align: center; margin-bottom: 24px;">
  <p style="font-size: 11px; letter-spacing: 0.18em; font-family: monospace; font-weight: bold; color: #dc2626; text-transform: uppercase;">TOP SECRET &bull; IMMEDIATE ACTION DIRECTIVE</p>
  <h1 style="font-size: 22px; font-weight: 800; margin: 8px 0; color: #111827;">${title}</h1>
</div>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;"><strong>Directive Orders &amp; Covert Actions:</strong> Specify deployed assets, covert intelligence tasks, and immediate operational milestones.</p>`;
      } else {
        title = customTitle || 'NAME YOUR DOCUMENT';
        initialHtml = `<h1 style="font-size: 24px; font-weight: 800; margin-bottom: 8px; color: #111827;">${title}</h1>
<p style="font-size: 13px; color: #6b7280; margin-bottom: 20px;">Sovereign Workspace &bull; Zenvitra Platform</p>
<hr style="border: none; border-top: 1.5px solid #d1d5db; margin: 20px 0;" />
<p style="font-size: 14px; line-height: 1.8; color: #1f2937;">Start drafting your sovereign essay, research paper, proposal, or notes here…</p>`;
      }
    }

    const newDoc: ZenDocument = {
      id: docId,
      title,
      docCode,
      docType: type,
      committeeOrChamber: committee,
      status: 'DRAFT',
      leadSponsors: ['You (Primary Author)'],
      signatories: [],
      contentHtml: initialHtml,
      paperMode: 'light',
      fontFamily: font,
      fontSize: 12,
      zoomLevel: 100,
      lineSpacing: '1.5',
      starred: false,
      workspaceId: activeWorkspaceId,
      collaborators: [
        { id: 'u-self', name: 'You (Author)', handle: 'author', color: '#06b6d4', role: 'OWNER', active: true },
      ],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      version: 1,
    };

    setDocuments((prev) => {
      const next = [newDoc, ...prev];
      persistToStorage(next);
      return next;
    });
    setActiveDocIdRaw(newDoc.id);
    setFontFamily(font);
    setPaperMode('light');
    setFontSize(12);
    setIsStarred(false);
    setActiveView('EDITOR');
    triggerToast(`Created new document: ${title}`);
  }, [activeWorkspaceId, persistToStorage, triggerToast]);

  const createFromTemplate = useCallback((templateId: string) => {
    const tmpl = DOC_TEMPLATES.find((t) => t.id === templateId);
    if (!tmpl) return;
    createDocument(tmpl.type, tmpl.title, tmpl.initialHtml);
    triggerToast(`Created document from template: ${tmpl.title}`);
  }, [createDocument, triggerToast]);

  const deleteDocument = useCallback((id: string) => {
    setDocuments((prev) => {
      const next = prev.filter((d) => d.id !== id);
      if (next.length === 0) {
        const fallback = INITIAL_DOCUMENTS;
        persistToStorage(fallback);
        setActiveDocIdRaw(fallback[0].id);
        return fallback;
      }
      if (activeDocId === id) {
        setActiveDocIdRaw(next[0].id);
      }
      persistToStorage(next);
      return next;
    });
    triggerToast('Document permanently deleted');
  }, [activeDocId, persistToStorage, triggerToast]);

  const toggleTrash = useCallback((id: string) => {
    setDocuments((prev) => {
      const next = prev.map((d) => {
        if (d.id === id) {
          const isTrash = !d.isTrash;
          return { ...d, isTrash, updatedAt: new Date().toISOString() };
        }
        return d;
      });
      persistToStorage(next);
      return next;
    });
    triggerToast('Document updated');
  }, [persistToStorage, triggerToast]);

  const addTask = useCallback((title: string, assignee: string, dueDate?: string) => {
    const task: ZenDocTask = {
      id: `task-${Date.now()}`,
      title,
      assignee,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    saveDocument({
      tasks: [...(activeDoc.tasks || []), task],
    });
    triggerToast(`Assigned task to ${assignee}`);
  }, [activeDoc, saveDocument, triggerToast]);

  const toggleTask = useCallback((taskId: string) => {
    const updatedTasks = (activeDoc.tasks || []).map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveDocument({ tasks: updatedTasks });
  }, [activeDoc, saveDocument]);

  const addComment = useCallback((text: string) => {
    const comment: ZenDocComment = {
      id: `comment-${Date.now()}`,
      author: 'You (Author)',
      authorHandle: 'author',
      avatar: '#06b6d4',
      text,
      createdAt: new Date().toISOString(),
      resolved: false,
    };
    saveDocument({
      comments: [...(activeDoc.comments || []), comment],
    });
    triggerToast('Comment posted');
  }, [activeDoc, saveDocument, triggerToast]);

  const resolveComment = useCallback((commentId: string) => {
    const updatedComments = (activeDoc.comments || []).map((c) =>
      c.id === commentId ? { ...c, resolved: true } : c
    );
    saveDocument({ comments: updatedComments });
    triggerToast('Comment resolved');
  }, [activeDoc, saveDocument, triggerToast]);

  const saveVersionSnapshot = useCallback((label?: string) => {
    const currentVer = activeDoc.version || 1;
    const versionEntry: ZenDocVersion = {
      id: `ver-${Date.now()}`,
      versionNumber: currentVer,
      label: label || `Snapshot v${currentVer}.0`,
      timestamp: new Date().toISOString(),
      author: 'You (Author)',
      summary: `Document updated at ${new Date().toLocaleTimeString()}`,
      contentHtml: activeDoc.contentHtml,
    };
    saveDocument({
      versions: [...(activeDoc.versions || []), versionEntry],
      version: currentVer + 1,
    });
    triggerToast(`Saved Version Snapshot v${currentVer}.0`);
  }, [activeDoc, saveDocument, triggerToast]);

  const publishToPress = useCallback(() => {
    saveDocument({
      status: 'PUBLISHED',
      publishedToPress: true,
      pressSlug: `zen-press-${activeDoc.id.toLowerCase()}`,
    });
    triggerToast('Successfully published article to ZENVITRA Press!');
  }, [activeDoc, saveDocument, triggerToast]);

  const updateTelemetry = useCallback((text: string) => {
    const clean = text.trim();
    const words = clean ? clean.split(/\s+/).filter(Boolean).length : 0;
    setWordCount(words);
    setCharCount(text.length);
  }, []);

  return {
    documents,
    activeDocId,
    activeDoc,
    activeView,
    activeWorkspaceId,
    isMounted,
    paperMode,
    zoomLevel,
    fontFamily,
    fontSize,
    lineSpacing,
    isStarred,
    showRuler,
    saveStatus,
    wordCount,
    charCount,
    toastMessage,
    setDocuments,
    setActiveDocId,
    setActiveView,
    setActiveWorkspaceId,
    setPaperMode,
    setZoomLevel,
    setFontFamily,
    setFontSize,
    setLineSpacing,
    toggleStar,
    setShowRuler,
    createDocument,
    createFromTemplate,
    deleteDocument,
    toggleTrash,
    saveDocument,
    addTask,
    toggleTask,
    addComment,
    resolveComment,
    saveVersionSnapshot,
    publishToPress,
    updateTelemetry,
    triggerToast,
  };
}

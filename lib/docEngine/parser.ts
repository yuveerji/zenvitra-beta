import { DocumentType, DocumentClause, DocumentChapter, ValidationIssue, ClauseSubItem, DocumentSchedule } from '@/types/solutions';

export interface ParsedDocResult {
  detectedType: DocumentType;
  confidence: number; // 0 to 100
  typeLabel: string;
  title: string;
  preamble: string;
  enactingFormula: string;
  chapters: DocumentChapter[];
  clauses: DocumentClause[];
  schedules?: DocumentSchedule[];
  validationIssues: ValidationIssue[];
  totalClauses: number;
  totalSections: number;
  totalTables: number;
  totalCharts: number;
  totalMetrics: number;
}

export const DOCUMENT_TYPE_METADATA: Record<DocumentType, { label: string; badge: string; structureName: string; sectionName: string }> = {
  LEGISLATIVE_BILL: { label: 'Legislation (Bill / Act)', badge: 'LEGISLATION', structureName: 'Chapters → Clauses → Sub-clauses', sectionName: 'Clauses' },
  DRAFT_RESOLUTION: { label: 'Multilateral Resolution', badge: 'RESOLUTION', structureName: 'Preambulatory → Operative Clauses', sectionName: 'Clauses' },
  POLICY_WHITEPAPER: { label: 'Policy Framework / Brief', badge: 'POLICY', structureName: 'Objectives → Provisions → Implementation', sectionName: 'Provisions' },
  TREATY_CHARTER: { label: 'International Treaty / Charter', badge: 'TREATY', structureName: 'Preamble → Articles → Paragraphs', sectionName: 'Articles' },
  CONSTITUTION: { label: 'Constitution / Bylaws', badge: 'CONSTITUTION', structureName: 'Parts → Articles → Clauses', sectionName: 'Articles' },
  RULEBOOK: { label: 'Procedural Rulebook', badge: 'RULEBOOK', structureName: 'Chapters → Rules → Sub-rules', sectionName: 'Rules' },
  REPORT: { label: 'Official Commission Report', badge: 'REPORT', structureName: 'Summary → Findings → Recommendations', sectionName: 'Sections' },
  PROPOSAL: { label: 'Civic Project Proposal', badge: 'PROPOSAL', structureName: 'Problem → Solution → Milestones', sectionName: 'Provisions' },
  AGREEMENT: { label: 'Accord / Agreement / MOU', badge: 'AGREEMENT', structureName: 'Articles → Mutual Obligations', sectionName: 'Articles' },
  AMENDMENT: { label: 'Statutory Amendment', badge: 'AMENDMENT', structureName: 'Original → Proposed Modification', sectionName: 'Amendments' },
  DIRECTIVE: { label: 'Executive / Crisis Directive', badge: 'DIRECTIVE', structureName: 'Directives → Orders → Authorities', sectionName: 'Directives' },
  PRESS_RELEASE: { label: 'Official Press Dispatch', badge: 'PRESS RELEASE', structureName: 'Headline → Body → Statements', sectionName: 'Statements' },
  MANIFESTO: { label: 'Civic Manifesto', badge: 'MANIFESTO', structureName: 'Principles → Core Pledges', sectionName: 'Pledges' },
  PAPER: { label: 'Academic Policy Paper', badge: 'PAPER', structureName: 'Abstract → Analysis → References', sectionName: 'Sections' },
  WORKING_PAPER: { label: 'Working Paper', badge: 'WORKING PAPER', structureName: 'Preamble → Operative Recommendations', sectionName: 'Clauses' },
};

/**
 * Automatically detects the document classification from text patterns
 */
export function detectDocumentType(rawText: string): { type: DocumentType; confidence: number; label: string } {
  const text = rawText.toUpperCase();

  // 1. Legislative Bill
  if (
    text.includes('A BILL') ||
    text.includes('BE IT ENACTED') ||
    text.includes('SHORT TITLE AND COMMENCEMENT') ||
    (text.includes('BILL, 202') && text.includes('CLAUSE')) ||
    text.includes('THE GAZETTE OF INDIA') ||
    text.includes('PARLIAMENT OF INDIA') ||
    text.includes('LOK SABHA')
  ) {
    return { type: 'LEGISLATIVE_BILL', confidence: 95, label: 'Legislation (Bill / Act)' };
  }

  // 2. Draft Resolution (UN / MUN)
  if (
    text.includes('DRAFT RESOLUTION') ||
    (text.includes('GENERAL ASSEMBLY') && (text.includes('NOTING') || text.includes('CALLS UPON') || text.includes('OPERATIVE'))) ||
    text.includes('PREAMBULATORY CLAUSES') ||
    (text.includes('SPONSORS:') && text.includes('SIGNATORIES:')) ||
    text.includes('GUIDED BY THE CHARTER')
  ) {
    return { type: 'DRAFT_RESOLUTION', confidence: 94, label: 'Multilateral Resolution' };
  }

  // 3. Treaty / Convention
  if (
    text.includes('TREATY') ||
    text.includes('CONVENTION') ||
    text.includes('HIGH CONTRACTING PARTIES') ||
    text.includes('IN WITNESS WHEREOF') ||
    (text.includes('RATIFICATION') && text.includes('DEPOSITARY'))
  ) {
    return { type: 'TREATY_CHARTER', confidence: 90, label: 'International Treaty / Charter' };
  }

  // 4. Constitution
  if (
    text.includes('CONSTITUTION OF') ||
    text.includes('WE, THE PEOPLE') ||
    (text.includes('FUNDAMENTAL RIGHTS') && text.includes('DIRECTIVE PRINCIPLES')) ||
    (text.includes('PART I') && text.includes('ARTICLE 1'))
  ) {
    return { type: 'CONSTITUTION', confidence: 92, label: 'Constitution / Bylaws' };
  }

  // 5. Procedural Rulebook
  if (
    text.includes('RULES OF PROCEDURE') ||
    text.includes('STANDING ORDERS') ||
    text.includes('ORDER OF BUSINESS') ||
    (text.includes('RULE 1') && text.includes('QUORUM'))
  ) {
    return { type: 'RULEBOOK', confidence: 88, label: 'Procedural Rulebook' };
  }

  // 6. Report / Inquiry
  if (
    text.includes('EXECUTIVE SUMMARY') ||
    text.includes('METHODOLOGY') ||
    text.includes('KEY FINDINGS') ||
    (text.includes('RECOMMENDATIONS') && text.includes('BACKGROUND'))
  ) {
    return { type: 'REPORT', confidence: 86, label: 'Official Commission Report' };
  }

  // 7. Crisis / Cabinet Directive
  if (
    text.includes('DIRECTIVE') ||
    text.includes('EXECUTIVE ORDER') ||
    text.includes('CABINET ORDER') ||
    text.includes('IMMEDIATE ACTION DIRECTIVE')
  ) {
    return { type: 'DIRECTIVE', confidence: 88, label: 'Executive / Crisis Directive' };
  }

  // 8. Press Release
  if (
    text.includes('FOR IMMEDIATE RELEASE') ||
    text.includes('PRESS RELEASE') ||
    text.includes('PRESS COMMUNIQUE') ||
    text.includes('MEDIA ADVISORY')
  ) {
    return { type: 'PRESS_RELEASE', confidence: 94, label: 'Official Press Dispatch' };
  }

  // 9. Manifesto
  if (
    text.includes('MANIFESTO') ||
    text.includes('OUR DECLARATION') ||
    text.includes('CORE PLEDGES')
  ) {
    return { type: 'MANIFESTO', confidence: 85, label: 'Civic Manifesto' };
  }

  // 10. Amendment
  if (
    text.includes('PROPOSED AMENDMENT') ||
    text.includes('MOTION TO AMEND') ||
    (text.includes('STRIKE OUT') && text.includes('SUBSTITUTE'))
  ) {
    return { type: 'AMENDMENT', confidence: 87, label: 'Statutory Amendment' };
  }

  // Default to Policy Whitepaper / Bill
  return { type: 'LEGISLATIVE_BILL', confidence: 70, label: 'Legislation (Bill / Act)' };
}

/**
 * Strips raw URLs, markdown link syntax, and source noise while preserving readable text
 */
export function cleanDocumentText(text: string): string {
  if (!text) return '';
  return text
    // 1. Convert markdown links [Label](url) -> if Label is a URL or empty, remove; else keep Label
    .replace(/\[([^\]]+)\]\((?:https?:\/\/[^\s)]+|www\.[^\s)]+)\)/gi, (_, label) => {
      const trimmed = label.trim();
      if (/^(?:https?:\/\/|www\.)/i.test(trimmed)) return '';
      return trimmed;
    })
    // 2. Remove angle bracket links <https://...>
    .replace(/<https?:\/\/[^>]+>/gi, '')
    // 3. Remove raw URLs with prefixes like Source: https://...
    .replace(/(?:Source|Ref|Available at|URL|See|Link):\s*(?:https?:\/\/|www\.)[^\s<>"')]+/gi, '')
    // 4. Remove bare URLs
    .replace(/\b(?:https?:\/\/|www\.)[^\s<>"')]+(?:\b|\/)?/gi, '')
    // 5. Remove leftover empty parentheses or brackets
    .replace(/\(\s*\)/g, '')
    .replace(/\[\s*\]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

const WORD_OR_NUM_TO_ROMAN: Record<string, string> = {
  '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V',
  '6': 'VI', '7': 'VII', '8': 'VIII', '9': 'IX', '10': 'X',
  '11': 'XI', '12': 'XII', '13': 'XIII', '14': 'XIV', '15': 'XV',
  '16': 'XVI', '17': 'XVII', '18': 'XVIII', '19': 'XIX', '20': 'XX',
  ONE: 'I', TWO: 'II', THREE: 'III', FOUR: 'IV', FIVE: 'V',
  SIX: 'VI', SEVEN: 'VII', EIGHT: 'VIII', NINE: 'IX', TEN: 'X',
  ELEVEN: 'XI', TWELVE: 'XII', THIRTEEN: 'XIII', FOURTEEN: 'XIV', FIFTEEN: 'XV',
  SIXTEEN: 'XVI', SEVENTEEN: 'XVII', EIGHTEEN: 'XVIII', NINETEEN: 'XIX', TWENTY: 'XX',
};

/**
 * Universal Document Parser & Structuring Engine (ZEN.DOCENGINE)
 */
export function parseDocument(rawText: string, forcedType?: DocumentType): ParsedDocResult {
  const sanitizedText = cleanDocumentText(rawText);
  const cleanText = sanitizedText.replace(/\r\n/g, '\n').trim();
  const detection = detectDocumentType(cleanText);
  const docType = forcedType || detection.type;

  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract Title
  let title = 'UNTITLED LEGISLATIVE PROPOSAL';
  let titleEndIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const l = lines[i];
    const strippedL = l.replace(/^[#\s*—:-]+/, '').replace(/[*_~`]/g, '').trim();
    if (
      strippedL.toUpperCase().startsWith('THE ') &&
      (strippedL.toUpperCase().includes('BILL') || strippedL.toUpperCase().includes('ACT') || strippedL.toUpperCase().includes('POLICY') || strippedL.toUpperCase().includes('RESOLUTION') || strippedL.toUpperCase().includes('CHARTER'))
    ) {
      title = strippedL;
      titleEndIndex = i;
      break;
    } else if (strippedL.toUpperCase().includes('BILL, 202') || strippedL.toUpperCase().includes('ACT, 202') || strippedL.toUpperCase().includes('RESOLUTION')) {
      title = strippedL;
      titleEndIndex = i;
      break;
    }
  }

  // If no specialized title line was found, take the very first non-empty line
  if (title === 'UNTITLED LEGISLATIVE PROPOSAL' && lines.length > 0) {
    title = lines[0].replace(/^[#\s*—:-]+/, '').replace(/[*_~`]/g, '').trim();
    titleEndIndex = 0;
  }

  // 2. Extract Enacting Formula & Preamble
  let enactingFormula = '';
  let preamble = '';
  const chapters: DocumentChapter[] = [];
  const clauses: DocumentClause[] = [];
  const schedules: DocumentSchedule[] = [];
  const validationIssues: ValidationIssue[] = [];

  let currentChapterNumber = 'General';
  let currentChapterTitle = 'General Provisions';
  let activeClause: DocumentClause | null = null;
  let activeSchedule: DocumentSchedule | null = null;
  let activeSubClauses: ClauseSubItem[] = [];
  let inCodeBlock = false;

  const chapterRegex = /^(?:CHAPTER|PART)\s+([IVXLCDM\d]+|[A-Za-z]+)(?:[—:.-]|\s+—|\s+-|\s*:|\s+|$)(.*)$/i;
  const scheduleRegex = /^(?:THE\s+)?([A-Z0-9IVXLCDM\w\s-]+SCHEDULE|SCHEDULE\s+[A-Z0-9IVXLCDM\w-]+)[—:\s.-]*(.*)$/i;
  const clauseRegex = /^(?:CLAUSE|SECTION|ARTICLE|RULE)?\s*(\d+)[\.\s—:-]+(.*)$/i;
  const subClauseRegex = /^(\(\d+\)|\([a-zA-Z]\)|\([ivxlcdmIVXLCDM]+\)|\[\w+\]|\d+\.\d+|\([a-zA-Z\d]+\)\.|\d+\)|\b[a-zA-Z]\)|\b[a-zA-Z]\.)\s*(.*)$/;
  const enactingRegex = /^(?:BE\s+it\s+enacted|WHEREAS|AND\s+WHEREAS|HAVING\s+CONSIDERED|NOTING\s+WITH\s+SATISFACTION)/i;

  let bodyStartIndex = titleEndIndex + 1;

  const finalizeClause = (clause: DocumentClause | null, subClauses: ClauseSubItem[]): DocumentClause | null => {
    if (!clause) return null;
    if (subClauses.length > 0) {
      clause.subClauses = [...subClauses];
    }
    clause.text = cleanDocumentText(clause.text || '');
    if (clause.title) {
      clause.title = cleanDocumentText(clause.title)
        .replace(/^[#\s*—:;–-]+/, '')
        .replace(/[;.:—–-]+$/, '')
        .trim();
    }
    // If text is identical to title (ignoring trailing punctuation/dashes), clear text so it never duplicates in rendering
    if (clause.text && clause.title) {
      const cleanT = clause.title.replace(/^[#\s*—:;–-]+/, '').replace(/[;.:—–-]+$/, '').trim().toLowerCase();
      const cleanB = clause.text.replace(/^[#\s*—:;–-]+/, '').replace(/[;.:—–-]+$/, '').trim().toLowerCase();
      if (cleanT === cleanB) {
        clause.text = '';
      }
    }
    if (!clause.text && (!clause.subClauses || clause.subClauses.length === 0)) {
      clause.text = clause.title ? '' : `Clause ${clause.clauseNumber}`;
    }
    return clause;
  };

  for (let i = bodyStartIndex; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    // Clean string without markdown header hashes, leading em-dashes or asterisks for structural matching
    const strippedLine = trimmedLine.replace(/^[#\s*—:–-]+/, '').replace(/[*_~`]/g, '').trim();

    // Code block tracking (for charts, graphs, and kpis)
    if (trimmedLine.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (activeSchedule) {
        activeSchedule.content += `\n${line}`;
      } else if (activeClause) {
        activeClause.text += `\n${line}`;
      }
      continue;
    }
    if (inCodeBlock) {
      if (activeSchedule) {
        activeSchedule.content += `\n${line}`;
      } else if (activeClause) {
        activeClause.text += `\n${line}`;
      }
      continue;
    }

    // Markdown Table Row preservation
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      if (activeSchedule) {
        activeSchedule.content += `\n${line}`;
      } else if (activeClause) {
        activeClause.text += `\n${line}`;
      }
      continue;
    }

    // Check for Enacting formula
    if (enactingRegex.test(strippedLine) || strippedLine.toLowerCase().includes('be it enacted by parliament')) {
      enactingFormula = trimmedLine;
      continue;
    }

    // Check for Preamble / Purpose preamble phrases
    if (
      strippedLine.toUpperCase().startsWith('A BILL TO') || 
      strippedLine.toUpperCase().startsWith('AN ACT TO') ||
      strippedLine.toUpperCase().startsWith('A RESOLUTION TO')
    ) {
      preamble = trimmedLine;
      continue;
    }

    // Check for Schedule header (e.g. "THE FIRST SCHEDULE" or "SCHEDULE I")
    const schedMatch = strippedLine.match(scheduleRegex);
    if (schedMatch) {
      if (activeClause) {
        const finalized = finalizeClause(activeClause, activeSubClauses);
        if (finalized) clauses.push(finalized);
        activeClause = null;
        activeSubClauses = [];
      }
      if (activeSchedule) {
        schedules.push(activeSchedule);
      }

      const schedNum = schedMatch[1].trim().toUpperCase();
      const schedTitle = schedMatch[2]?.trim() || 'Statutory Annexure';
      activeSchedule = {
        id: `sched_${schedules.length + 1}_${Date.now()}`,
        number: schedNum,
        title: schedTitle,
        content: '',
        isMakerSchedule: true
      };
      continue;
    }

    // If currently consuming a Schedule, append text to schedule content
    if (activeSchedule) {
      // Check if a new chapter or clause starts while inside schedule
      const isNewChap = chapterRegex.test(strippedLine);
      const isNewClause = /^(?:CLAUSE|SECTION|ARTICLE|RULE|\d+\.)/i.test(strippedLine);
      if (!isNewChap && !isNewClause) {
        activeSchedule.content = activeSchedule.content ? `${activeSchedule.content}\n${line}` : line;
        continue;
      } else {
        // Close schedule
        schedules.push(activeSchedule);
        activeSchedule = null;
      }
    }

    // Check for Chapter / Part header (e.g. "# CHAPTER XII", "CHAPTER I — PRELIMINARY", "CHAPTER 1", "PART II")
    const chapMatch = strippedLine.match(/^(?:CHAPTER|PART)\s+([IVXLCDM\d]+|[A-Za-z]+)(?:[—:.-]|\s+—|\s+-|\s*:|\s+|$)(.*)$/i);
    if (chapMatch) {
      const rawNum = chapMatch[1].trim().toUpperCase();
      const romanNum = WORD_OR_NUM_TO_ROMAN[rawNum] || (/^[IVXLCDM]+$/.test(rawNum) ? rawNum : rawNum);
      
      let chapTitle = cleanDocumentText(chapMatch[2]?.trim() || '').replace(/^[—:.-]+/, '').trim();
      // If chapter title was on the next line (e.g. line 1: CHAPTER I, line 2: PRELIMINARY)
      if (!chapTitle && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        const nextStripped = nextLine.replace(/^[#\s*—:-]+/, '').replace(/[*_~`]/g, '').trim();
        if (
          !/^(?:CHAPTER|PART|CLAUSE|SECTION|ARTICLE|RULE|\d+[\.\)])/i.test(nextStripped) &&
          !/^(?:BE\s+it\s+enacted|WHEREAS|AND\s+WHEREAS)/i.test(nextStripped) &&
          nextLine.length < 90
        ) {
          chapTitle = cleanDocumentText(nextStripped);
          i++; // advance past title line
        }
      }
      if (!chapTitle) {
        chapTitle = 'General Provisions';
      }

      if (activeClause) {
        const finalized = finalizeClause(activeClause, activeSubClauses);
        if (finalized) clauses.push(finalized);
        activeClause = null;
        activeSubClauses = [];
      }

      currentChapterNumber = `Chapter ${romanNum}`;
      currentChapterTitle = chapTitle;
      const isDataChapter = /data|metric|statistics|outlay|budget|empirical|analytical/i.test(currentChapterTitle);
      
      const chapId = `chap_${chapters.length + 1}`;
      chapters.push({
        id: chapId,
        number: currentChapterNumber,
        title: currentChapterTitle,
        clauseIds: [],
        isDataChapter
      });
      continue;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SUBCLAUSE EXTRACTION & CONTINUOUS CLAUSE BINDING
    // ─────────────────────────────────────────────────────────────────────────
    if (activeClause) {
      // 1. Standalone Subclause Marker on its own line (e.g. line 1 is "1." or "(1)", line 2 has the text)
      const standaloneMarkerMatch = strippedLine.match(/^(\(\d+\)|\([a-zA-Z]\)|\([ivxlcdmIVXLCDM]+\)|\d+\.|\d+\)|\b[a-zA-Z]\.|\b[a-zA-Z]\))$/);
      if (standaloneMarkerMatch && i + 1 < lines.length) {
        const nextLine = lines[i + 1].trim();
        const nextStripped = nextLine.replace(/^[#\s*—:-]+/, '').replace(/[*_~`]/g, '').trim();
        if (
          !/^(?:CHAPTER|PART|CLAUSE|SECTION|ARTICLE|RULE)/i.test(nextStripped) &&
          nextLine.length > 0
        ) {
          let sNum = standaloneMarkerMatch[1];
          if (/^\d+\.$/.test(sNum)) sNum = `(${sNum.slice(0, -1)})`;
          else if (/^\d+\)$/.test(sNum)) sNum = `(${sNum.slice(0, -1)})`;
          else if (/^[a-zA-Z][\.\)]$/.test(sNum)) sNum = `(${sNum[0].toLowerCase()})`;

          activeSubClauses.push({
            number: sNum,
            text: cleanDocumentText(nextLine)
          });
          i++; // advance past text line
          continue;
        }
      }

      // 2. Explicit Subclause Marker on the same line:
      // (1) Text..., (a) Text..., (i) Text..., [a] Text..., 1) Text..., a) Text..., a. Text...
      const explicitSubMatch = strippedLine.match(/^(\(\d+\)|\([a-zA-Z]\)|\([ivxlcdmIVXLCDM]+\)|\[\w+\]|\d+\.\d+|\([a-zA-Z\d]+\)\.|\d+\)|\b[a-zA-Z]\)|\b[a-zA-Z]\.)\s+(.*)$/);
      if (explicitSubMatch) {
        let sNum = explicitSubMatch[1];
        if (/^\d+\)$/.test(sNum)) sNum = `(${sNum.slice(0, -1)})`;
        else if (/^[a-zA-Z][\.\)]$/.test(sNum)) sNum = `(${sNum[0].toLowerCase()})`;

        activeSubClauses.push({
          number: sNum,
          text: cleanDocumentText(explicitSubMatch[2].trim())
        });
        continue;
      }

      // 3. Bullet points inside an active clause
      const bulletMatch = strippedLine.match(/^[-*•—]\s+(.*)$/);
      if (bulletMatch) {
        const bText = bulletMatch[1].trim();
        const nestedM = bText.match(/^(\(\d+\)|\([a-zA-Z]\)|\d+[\.\)]|[a-zA-Z][\.\)])\s*(.*)$/);
        if (nestedM) {
          let sNum = nestedM[1];
          if (/^\d+[\.\)]$/.test(sNum)) sNum = `(${sNum.replace(/\D/g, '')})`;
          else if (/^[a-zA-Z][\.\)]$/.test(sNum)) sNum = `(${sNum[0].toLowerCase()})`;
          activeSubClauses.push({ number: sNum, text: cleanDocumentText(nestedM[2].trim()) });
        } else {
          const defM = bText.match(/^(["“'][^"”']+["”'])\s*(?:means|includes|is|shall|—|-|:)\s*(.*)$/i);
          if (defM) {
            const letter = String.fromCharCode(97 + (activeSubClauses.length % 26));
            activeSubClauses.push({
              number: `(${letter})`,
              text: `**${defM[1]}** means ${cleanDocumentText(defM[2].trim())}`
            });
          } else {
            activeSubClauses.push({ number: '•', text: cleanDocumentText(bText) });
          }
        }
        continue;
      }

      // 4. Definition items without bullet (e.g. "term" means ... or 'term' includes ...)
      const defMatch = strippedLine.match(/^(["“'][^"”']+["”'])\s*(?:means|includes|is|shall|—|-|:)\s*(.*)$/i);
      if (defMatch && (/definition/i.test(activeClause.title || '') || /definition/i.test(activeClause.text || '') || activeSubClauses.length > 0)) {
        const letter = String.fromCharCode(97 + (activeSubClauses.length % 26));
        activeSubClauses.push({
          number: `(${letter})`,
          text: `**${defMatch[1]}** means ${cleanDocumentText(defMatch[2].trim())}`
        });
        continue;
      }

      // 5. Numbered point (e.g. subclauses "1. the supremacy of the Constitution;" inside Clause 4)
      const numberedPointMatch = strippedLine.match(/^(\d+)[\.\)]\s*(.*)$/);
      if (numberedPointMatch) {
        const lineNum = parseInt(numberedPointMatch[1], 10);
        const restOfLine = numberedPointMatch[2].trim();
        const currentClauseNum = parseInt(activeClause.clauseNumber, 10);

        // Disqualify if it has an explicit clause keyword like "CLAUSE 5", "SECTION 5"
        const hasExplicitClauseWord = /^(?:CLAUSE|SECTION|ARTICLE|RULE)\b/i.test(strippedLine);

        // CRITICAL: If lineNum is greater than or equal to currentClauseNum + 1 (e.g. at Clause 2, lineNum is 3),
        // this is NEVER a subclause of Clause 2. It is the next top-level clause in the statute!
        const isNextTopLevelClause = !isNaN(currentClauseNum) && lineNum >= currentClauseNum + 1;

        // A numbered line without brackets is ONLY a subclause if:
        // 1) Numbering resets or is less than/equal to the active clause number (e.g. points 1, 2, 3 inside Clause 4)
        // 2) It continues an active subclause list that started with (1) AND is <= currentClauseNum
        const isSubclauseNumber = !isNaN(currentClauseNum) && lineNum <= currentClauseNum;
        const isSeqSub = activeSubClauses.length > 0 && lineNum === activeSubClauses.length + 1 && lineNum <= currentClauseNum;

        if (!hasExplicitClauseWord && !isNextTopLevelClause && (isSubclauseNumber || isSeqSub)) {
          activeSubClauses.push({
            number: `(${lineNum})`,
            text: cleanDocumentText(restOfLine)
          });
          continue;
        }
      }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // NEW TOP-LEVEL CLAUSE / SECTION
    // ─────────────────────────────────────────────────────────────────────────
    const clauseMatch = strippedLine.match(/^(?:CLAUSE|SECTION|ARTICLE|RULE)?\s*(\d+)[\.\s—:–-]+(.*)$/i);
    const isExplicitClause = /^(?:CLAUSE|SECTION|ARTICLE|RULE)\b|^\d+[\.\s—:–-]/i.test(strippedLine);

    if (clauseMatch && isExplicitClause) {
      if (activeClause) {
        const finalized = finalizeClause(activeClause, activeSubClauses);
        if (finalized) clauses.push(finalized);
        activeSubClauses = [];
      }

      const num = clauseMatch[1];
      let rawTitleAndText = clauseMatch[2]?.trim() || '';
      // Strip leading and trailing dashes, colons, dots, hyphens
      let cleanTitleAndText = rawTitleAndText.replace(/^[#\s*—:–-]+/, '').replace(/[;.:—–-]+$/, '').trim();
      let clauseTitle = '';
      let clauseText = '';

      // Check if there is an internal separator dividing title and body text on the same line
      // e.g. "Governing principles — Every power and duty..."
      const titleSplit = cleanTitleAndText.split(/\s*[—–-]\s+|\s*\.\s+(?=[A-Z])/);
      if (titleSplit.length > 1 && titleSplit[0].length < 80 && titleSplit[1].trim().length > 0) {
        clauseTitle = titleSplit[0].replace(/^[#\s*—:-]+/, '').replace(/[;.:—–-]+$/, '').trim();
        clauseText = titleSplit.slice(1).join(' — ').trim();
      } else if (
        cleanTitleAndText.length < 90 &&
        i + 1 < lines.length &&
        !/^(?:CHAPTER|PART|CLAUSE|SECTION|ARTICLE|RULE|\d+[\.\)]|#)/i.test(lines[i + 1].trim()) &&
        !subClauseRegex.test(lines[i + 1].trim()) &&
        lines[i + 1].trim().length > 0
      ) {
        // Single title line followed by body text on the next line
        clauseTitle = cleanTitleAndText;
        clauseText = lines[i + 1].trim();
        i++;
      } else if (cleanTitleAndText.length < 90 && !subClauseRegex.test(cleanTitleAndText)) {
        // Title only (e.g. "1. A record of the system's purpose —")
        clauseTitle = cleanTitleAndText;
        clauseText = '';
      } else {
        // Substantive text without standalone title
        clauseTitle = '';
        clauseText = cleanTitleAndText;
      }

      // Discard duplicate/redundant title (e.g. "Clause 5" or "Section 5")
      if (
        clauseTitle.toLowerCase() === `clause ${num.toLowerCase()}` ||
        clauseTitle.toLowerCase() === `section ${num.toLowerCase()}` ||
        clauseTitle.toLowerCase() === num.toLowerCase()
      ) {
        clauseTitle = '';
      }

      // Check if clauseText starts with an embedded subclause (e.g. "(1) Every public authority...")
      if (clauseText) {
        const subM = clauseText.match(/^(\(\d+\)|\([a-zA-Z]\)|\([ivxlcdmIVXLCDM]+\)|\[\w+\]|\d+\.\d+|\([a-zA-Z\d]+\)\.|\d+\)|\b[a-zA-Z]\)|\b[a-zA-Z]\.)\s+(.*)$/);
        if (subM) {
          let sNum = subM[1];
          if (/^\d+\)$/.test(sNum)) sNum = `(${sNum.slice(0, -1)})`;
          else if (/^[a-zA-Z][\.\)]$/.test(sNum)) sNum = `(${sNum[0].toLowerCase()})`;
          activeSubClauses.push({
            number: sNum,
            text: cleanDocumentText(subM[2].trim())
          });
          clauseText = '';
        }
      }

      activeClause = {
        id: `clause_${num}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        clauseNumber: num,
        title: clauseTitle || undefined,
        type: docType === 'DRAFT_RESOLUTION' ? 'OPERATIVE' : docType === 'TREATY_CHARTER' ? 'ARTICLE' : 'SECTION',
        text: cleanDocumentText(clauseText),
        chapterNumber: currentChapterNumber || undefined,
        chapterTitle: currentChapterTitle || undefined,
        subClauses: []
      };

      // Register with chapter if one is active
      if (chapters.length > 0) {
        const currentChapObj = chapters[chapters.length - 1];
        if (currentChapObj && currentChapObj.clauseIds) {
          currentChapObj.clauseIds.push(activeClause.id!);
        }
      }
      continue;
    }

    // If text belongs to active clause body (append as regular continuous text, NEVER create fake subclauses)
    if (activeClause) {
      activeClause.text = activeClause.text ? `${activeClause.text}\n\n${trimmedLine}` : trimmedLine;
    } else {
      // General introductory text before first clause
      if (!preamble) {
        preamble = trimmedLine;
      } else {
        preamble += ` ${trimmedLine}`;
      }
    }
  }

  // Close active schedule if present
  if (activeSchedule) {
    schedules.push(activeSchedule);
  }

  // Push the final active clause
  if (activeClause) {
    const finalized = finalizeClause(activeClause, activeSubClauses);
    if (finalized) clauses.push(finalized);
  }

  // Fallback: If no clauses were recognized via regex, structure text by paragraphs
  if (clauses.length === 0 && cleanText.length > 0) {
    const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    paragraphs.forEach((p, idx) => {
      const pLines = p.trim().split('\n');
      const pTitle = pLines[0].length < 60 ? pLines[0] : `Section ${idx + 1}`;
      const pBody = pLines.length > 1 ? pLines.slice(1).join(' ') : pLines[0];

      clauses.push({
        id: `clause_${idx + 1}`,
        clauseNumber: String(idx + 1),
        title: pTitle,
        type: 'SECTION',
        text: pBody,
        chapterNumber: 'Chapter I',
        chapterTitle: 'General Provisions',
        subClauses: []
      });
    });

    if (chapters.length === 0) {
      chapters.push({
        id: 'chap_1',
        number: 'Chapter I',
        title: 'General Provisions',
        clauseIds: clauses.map(c => c.id!)
      });
    }
  }

  // 3. Automated Validation & Issue Scanner
  // A. Numbering check (duplicates or skips)
  const seenNumbers = new Set<string>();
  const parsedNumbers: number[] = [];

  clauses.forEach((c) => {
    const num = parseInt(c.clauseNumber, 10);
    if (!isNaN(num)) parsedNumbers.push(num);

    if (seenNumbers.has(c.clauseNumber)) {
      validationIssues.push({
        id: `issue_num_dup_${c.clauseNumber}`,
        type: 'numbering',
        title: `Duplicate Clause Number (${c.clauseNumber})`,
        description: `Clause ${c.clauseNumber} appears more than once in the document.`,
        clauseNumber: c.clauseNumber,
        suggestedFix: `Renumber sequentially.`
      });
    }
    seenNumbers.add(c.clauseNumber);
  });

  // Check for skipped numbering
  for (let k = 0; k < parsedNumbers.length - 1; k++) {
    if (parsedNumbers[k + 1] > parsedNumbers[k] + 1) {
      validationIssues.push({
        id: `issue_num_skip_${parsedNumbers[k]}`,
        type: 'numbering',
        title: `Skipped Numbering (between ${parsedNumbers[k]} and ${parsedNumbers[k + 1]})`,
        description: `There is a gap in numbering between Clause ${parsedNumbers[k]} and Clause ${parsedNumbers[k + 1]}.`,
        clauseNumber: String(parsedNumbers[k]),
        suggestedFix: `Verify if a clause was omitted or adjust numbering sequence.`
      });
    }
  }

  // B. Cross-reference validation (e.g. references to Clause X that doesn't exist)
  clauses.forEach((c) => {
    const fullClauseContent = `${c.text} ${c.subClauses?.map(s => s.text).join(' ') || ''}`;
    const refMatches = fullClauseContent.matchAll(/(?:section|clause|article)\s+(\d+)/gi);
    for (const match of refMatches) {
      const referencedNum = match[1];
      if (!seenNumbers.has(referencedNum)) {
        validationIssues.push({
          id: `issue_ref_${c.clauseNumber}_to_${referencedNum}`,
          type: 'structural',
          title: `Dangling Reference to Clause ${referencedNum}`,
          description: `Clause ${c.clauseNumber} references Clause ${referencedNum}, but Clause ${referencedNum} was not found in the document.`,
          clauseNumber: c.clauseNumber,
          suggestedFix: `Check if Clause ${referencedNum} was deleted or update reference.`
        });
      }
    }

    // C. Check for missing definitions of competent authority or prescribed terms
    if (
      fullClauseContent.toLowerCase().includes('competent authority') &&
      !clauses.some(cl => cl.title?.toLowerCase().includes('definition') && cl.text.toLowerCase().includes('competent authority'))
    ) {
      if (!validationIssues.some(i => i.id === 'issue_missing_competent_auth')) {
        validationIssues.push({
          id: 'issue_missing_competent_auth',
          type: 'missing_info',
          title: 'Undefined Term: "competent authority"',
          description: 'The document refers to a "competent authority" but does not define which authority in Clause 2 (Definitions).',
          clauseNumber: c.clauseNumber,
          suggestedFix: 'Add definition for "competent authority" under Clause 2.'
        });
      }
    }

    // D. Incomplete provisions (ends abruptly)
    const trimmed = c.text.trim();
    if (trimmed.endsWith(',') || trimmed.endsWith(';') || trimmed.endsWith('and') || trimmed.endsWith('or')) {
      validationIssues.push({
        id: `issue_incomplete_${c.clauseNumber}`,
        type: 'incomplete',
        title: `Incomplete Provision in Clause ${c.clauseNumber}`,
        description: `Clause ${c.clauseNumber} ends with "${trimmed.slice(-10)}" without a concluding period.`,
        clauseNumber: c.clauseNumber,
        suggestedFix: 'Ensure all provisions conclude with full sentences or final punctuation.'
      });
    }
  });

  chapters.forEach(chap => {
    chap.clauses = clauses.filter(c => c.chapterNumber === chap.number);
  });

  const totalTables = (cleanText.match(/\|[\s-]+\|/g) || []).length;
  const totalCharts = (cleanText.match(/```chart/gi) || []).length;
  const totalMetrics = (cleanText.match(/```kpi/gi) || []).length;

  return {
    detectedType: docType,
    confidence: detection.confidence,
    typeLabel: DOCUMENT_TYPE_METADATA[docType]?.label || 'Structured Document',
    title,
    preamble,
    enactingFormula,
    chapters,
    clauses,
    schedules,
    validationIssues,
    totalClauses: clauses.length,
    totalSections: clauses.length + chapters.length,
    totalTables,
    totalCharts,
    totalMetrics
  };
}

export interface UnparsedSegment {
  id: string;
  originalIndex: number;
  text: string;
  suggestedType: 'CLAUSE' | 'PREAMBLE' | 'ANNEXURE' | 'TABLE_DATA' | 'METADATA';
  detectionReason: string;
  wordCount: number;
}

export interface DocumentAnalysisReport {
  parsedDoc: ParsedDocResult;
  totalInputLines: number;
  totalInputWords: number;
  matchedLinesCount: number;
  coveragePercent: number;
  unparsedSegments: UnparsedSegment[];
  hasLeftoverContent: boolean;
}

/**
 * Intelligent Data Analysis Engine:
 * Converts document into clauses and identifies unparsed paragraphs or orphan sections
 * so the author can review and decide if anything was left behind.
 */
export function analyzeDocumentWithLeftovers(rawText: string): DocumentAnalysisReport {
  const parsedDoc = parseDocument(rawText);
  const cleanText = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // Split into natural logical paragraphs (separated by blank lines or headers)
  const rawParagraphs = cleanText
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  const totalInputWords = cleanText.split(/\s+/).filter(Boolean).length;
  const totalInputLines = cleanText.split('\n').length;

  // Build a corpus of all text contained in parsed structures
  const parsedCorpus: string[] = [
    parsedDoc.title?.toLowerCase() || '',
    parsedDoc.preamble?.toLowerCase() || '',
    parsedDoc.enactingFormula?.toLowerCase() || '',
    ...parsedDoc.chapters.map(ch => `${ch.number} ${ch.title} ${ch.description || ch.summary || ''}`.toLowerCase()),
    ...parsedDoc.clauses.map(cl => `${cl.clauseNumber} ${cl.title || ''} ${cl.text} ${(cl.subClauses || cl.subItems)?.map((s: ClauseSubItem) => s.text).join(' ') || ''}`.toLowerCase()),
  ];

  const unparsedSegments: UnparsedSegment[] = [];

  rawParagraphs.forEach((para, idx) => {
    // Ignore pure dividers, short metadata stamps, or single symbols
    if (para.length < 18 || /^[=\-_#*~`\s]+$/.test(para)) return;

    // Check if this paragraph is already incorporated into any parsed clause or header
    const sampleSnippet = para.slice(0, Math.min(para.length, 50)).toLowerCase();
    const isAlreadyParsed = parsedCorpus.some(corp => corp.includes(sampleSnippet));

    if (!isAlreadyParsed) {
      // Determine suggested classification
      const lower = para.toLowerCase();
      let suggestedType: UnparsedSegment['suggestedType'] = 'CLAUSE';
      let detectionReason = 'Unnumbered paragraph or provision';

      if (
        lower.startsWith('whereas') ||
        lower.startsWith('affirming') ||
        lower.startsWith('recalling') ||
        lower.startsWith('guided by') ||
        lower.startsWith('deeply concerned') ||
        lower.startsWith('noting') ||
        lower.startsWith('bearing in mind')
      ) {
        suggestedType = 'PREAMBLE';
        detectionReason = 'Preambulatory or introductory clause without numerical prefix';
      } else if (
        lower.startsWith('urges') ||
        lower.startsWith('mandates') ||
        lower.startsWith('resolves') ||
        lower.startsWith('calls upon') ||
        lower.startsWith('decides') ||
        lower.startsWith('requests') ||
        lower.startsWith('be it enacted') ||
        lower.includes('shall be responsible') ||
        lower.includes('punishable with') ||
        lower.includes('shall ensure that')
      ) {
        suggestedType = 'CLAUSE';
        detectionReason = 'Operative requirement missing standard clause number';
      } else if (para.includes('|') && para.split('\n').some(l => l.includes('|'))) {
        suggestedType = 'TABLE_DATA';
        detectionReason = 'Tabular or matrix data not attached to a clause';
      } else if (
        lower.startsWith('schedule') ||
        lower.startsWith('annexure') ||
        lower.startsWith('appendix') ||
        lower.startsWith('exhibit')
      ) {
        suggestedType = 'ANNEXURE';
        detectionReason = 'Statutory appendix, schedule, or reference document';
      } else if (
        lower.includes('confidential') ||
        lower.includes('all rights reserved') ||
        lower.includes('drafted on') ||
        lower.includes('page ')
      ) {
        suggestedType = 'METADATA';
        detectionReason = 'Disclaimers, page numbering, or publication metadata';
      }

      unparsedSegments.push({
        id: `unparsed_${idx}_${Date.now()}`,
        originalIndex: idx,
        text: para,
        suggestedType,
        detectionReason,
        wordCount: para.split(/\s+/).filter(Boolean).length
      });
    }
  });

  const unparsedWords = unparsedSegments.reduce((acc, s) => acc + s.wordCount, 0);
  const matchedWords = Math.max(0, totalInputWords - unparsedWords);
  const coveragePercent = totalInputWords > 0 
    ? Math.min(100, Math.max(10, Math.round((matchedWords / totalInputWords) * 100))) 
    : 100;

  return {
    parsedDoc,
    totalInputLines,
    totalInputWords,
    matchedLinesCount: totalInputLines - unparsedSegments.length,
    coveragePercent,
    unparsedSegments,
    hasLeftoverContent: unparsedSegments.length > 0
  };
}


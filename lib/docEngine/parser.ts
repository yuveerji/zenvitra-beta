import { DocumentType, DocumentClause, DocumentChapter, ValidationIssue, ClauseSubItem } from '@/types/solutions';

export interface ParsedDocResult {
  detectedType: DocumentType;
  confidence: number; // 0 to 100
  typeLabel: string;
  title: string;
  preamble: string;
  enactingFormula: string;
  chapters: DocumentChapter[];
  clauses: DocumentClause[];
  validationIssues: ValidationIssue[];
  totalClauses: number;
  totalSections: number;
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
 * Universal Document Parser & Structuring Engine (ZEN.DOCENGINE)
 */
export function parseDocument(rawText: string, forcedType?: DocumentType): ParsedDocResult {
  const cleanText = rawText.replace(/\r\n/g, '\n').trim();
  const detection = detectDocumentType(cleanText);
  const docType = forcedType || detection.type;

  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Extract Title
  let title = 'UNTITLED LEGISLATIVE PROPOSAL';
  let titleEndIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const l = lines[i];
    if (
      l.toUpperCase().startsWith('THE ') &&
      (l.toUpperCase().includes('BILL') || l.toUpperCase().includes('ACT') || l.toUpperCase().includes('POLICY') || l.toUpperCase().includes('RESOLUTION') || l.toUpperCase().includes('CHARTER'))
    ) {
      title = l;
      titleEndIndex = i;
      break;
    } else if (l.toUpperCase().includes('BILL, 202') || l.toUpperCase().includes('ACT, 202') || l.toUpperCase().includes('RESOLUTION')) {
      title = l;
      titleEndIndex = i;
      break;
    }
  }

  // If no specialized title line was found, take the very first non-empty line
  if (title === 'UNTITLED LEGISLATIVE PROPOSAL' && lines.length > 0) {
    title = lines[0];
    titleEndIndex = 0;
  }

  // 2. Extract Enacting Formula & Preamble
  let enactingFormula = '';
  let preamble = '';
  const chapters: DocumentChapter[] = [];
  const clauses: DocumentClause[] = [];
  const validationIssues: ValidationIssue[] = [];

  let currentChapterNumber = 'General';
  let currentChapterTitle = 'General Provisions';
  let activeClause: DocumentClause | null = null;
  let activeSubClauses: ClauseSubItem[] = [];

  const chapterRegex = /^(?:CHAPTER|PART)\s+([IVXLCDM\d]+)[—:\s-]+(.*)$/i;
  const clauseRegex = /^(?:CLAUSE|SECTION|ARTICLE|RULE)?\s*(\d+)[\.\s—:-]+(.*)$/i;
  const subClauseRegex = /^(\d+\.\d+|\(\w+\)|\[\w+\])\s+(.*)$/i;
  const enactingRegex = /^(?:BE\s+it\s+enacted|WHEREAS|AND\s+WHEREAS|HAVING\s+CONSIDERED|NOTING\s+WITH\s+SATISFACTION)/i;

  let bodyStartIndex = titleEndIndex + 1;

  for (let i = bodyStartIndex; i < lines.length; i++) {
    const line = lines[i];

    // Check for Enacting formula
    if (enactingRegex.test(line) || line.toLowerCase().includes('be it enacted by parliament')) {
      enactingFormula = line;
      continue;
    }

    // Check for Preamble / Purpose preamble phrases
    if (
      line.toUpperCase().startsWith('A BILL TO') || 
      line.toUpperCase().startsWith('AN ACT TO') ||
      line.toUpperCase().startsWith('A RESOLUTION TO')
    ) {
      preamble = line;
      continue;
    }

    // Check for Chapter / Part header
    const chapMatch = line.match(chapterRegex);
    if (chapMatch) {
      if (activeClause) {
        if (activeSubClauses.length > 0) {
          activeClause.subClauses = [...activeSubClauses];
        }
        clauses.push(activeClause);
        activeClause = null;
        activeSubClauses = [];
      }

      currentChapterNumber = `Chapter ${chapMatch[1].toUpperCase()}`;
      currentChapterTitle = chapMatch[2].trim() || 'General';
      
      const chapId = `chap_${chapters.length + 1}`;
      chapters.push({
        id: chapId,
        number: currentChapterNumber,
        title: currentChapterTitle,
        clauseIds: []
      });
      continue;
    }

    // Check for Sub-clause (e.g. "6.1 Every institute..." or "(a) 'coaching' means...")
    const subMatch = line.match(subClauseRegex);
    if (subMatch && activeClause) {
      activeSubClauses.push({
        number: subMatch[1],
        text: subMatch[2].trim()
      });
      continue;
    }

    // Check for Main Clause / Section
    const clauseMatch = line.match(clauseRegex);
    // Ensure this line actually looks like a clause (digits at start or preceded by 'Clause/Section')
    const isExplicitClause = /^(?:CLAUSE|SECTION|ARTICLE|RULE|\d+\.)/i.test(line);

    if (clauseMatch && isExplicitClause) {
      if (activeClause) {
        if (activeSubClauses.length > 0) {
          activeClause.subClauses = [...activeSubClauses];
        }
        clauses.push(activeClause);
        activeSubClauses = [];
      }

      const num = clauseMatch[1];
      let clauseTitleAndText = clauseMatch[2].trim();
      let clauseTitle = `Clause ${num}`;
      let clauseText = clauseTitleAndText;

      // Extract clause title if separated by dash, period, or em-dash
      // e.g. "Short Title and Commencement. — (1) This Act may..."
      const titleSplit = clauseTitleAndText.split(/[.—–-]\s+/);
      if (titleSplit.length > 1 && titleSplit[0].length < 60) {
        clauseTitle = titleSplit[0].trim();
        clauseText = titleSplit.slice(1).join(' — ').trim();
      } else if (clauseTitleAndText.length < 50 && i + 1 < lines.length && !clauseRegex.test(lines[i + 1])) {
        // Line itself might just be the clause title, with text following on next lines
        clauseTitle = clauseTitleAndText;
        clauseText = lines[i + 1];
        i++; // skip next line as it's the body
      }

      // If chapter doesn't exist yet, create a default preliminary chapter
      if (chapters.length === 0) {
        chapters.push({
          id: 'chap_1',
          number: 'Chapter I',
          title: 'Preliminary',
          clauseIds: []
        });
        currentChapterNumber = 'Chapter I';
        currentChapterTitle = 'Preliminary';
      }

      activeClause = {
        id: `clause_${num}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        clauseNumber: num,
        title: clauseTitle,
        type: docType === 'DRAFT_RESOLUTION' ? 'OPERATIVE' : docType === 'TREATY_CHARTER' ? 'ARTICLE' : 'SECTION',
        text: clauseText || clauseTitle,
        chapterNumber: currentChapterNumber,
        chapterTitle: currentChapterTitle,
        subClauses: []
      };

      // Register with chapter
      const currentChapObj = chapters[chapters.length - 1];
      if (currentChapObj && currentChapObj.clauseIds) {
        currentChapObj.clauseIds.push(activeClause.id!);
      }
      continue;
    }

    // If text belongs to active clause body
    if (activeClause) {
      if (activeClause.text && !activeClause.text.endsWith('.')) {
        activeClause.text += ` ${line}`;
      } else {
        // Might be a paragraph sub-clause without explicit numbering
        activeSubClauses.push({
          number: `(${String.fromCharCode(97 + activeSubClauses.length)})`,
          text: line
        });
      }
    } else {
      // General introductory text before first clause
      if (!preamble) {
        preamble = line;
      } else {
        preamble += ` ${line}`;
      }
    }
  }

  // Push the final active clause
  if (activeClause) {
    if (activeSubClauses.length > 0) {
      activeClause.subClauses = [...activeSubClauses];
    }
    clauses.push(activeClause);
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

  return {
    detectedType: docType,
    confidence: detection.confidence,
    typeLabel: DOCUMENT_TYPE_METADATA[docType]?.label || 'Structured Document',
    title,
    preamble,
    enactingFormula,
    chapters,
    clauses,
    validationIssues,
    totalClauses: clauses.length,
    totalSections: clauses.length + chapters.length
  };
}

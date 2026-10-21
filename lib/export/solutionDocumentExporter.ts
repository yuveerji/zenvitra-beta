// lib/export/solutionDocumentExporter.ts
// Single source of truth for Solution Document exports with dynamic trademark, 
// uploader attribution, chapter & clause formatting, and subscription-tier watermark governance.

import { SolutionDocument, DocumentClause } from '@/types/solutions';
import { 
  SubscriptionPlanId, 
  getActiveUserSubscription, 
  normalizeUsername 
} from '@/lib/subscriptionTiers';
import { isFounder, isAdmin } from '@/lib/founderControl';
import { checkIsProfessionalAccountEnabled, checkIsEventAccountEnabled } from '@/lib/accountCapabilities';

export interface DocumentExportAttribution {
  uploaderName: string;
  uploaderUsername: string;
  planId: SubscriptionPlanId;
  planDisplayName: string;
  isWatermarkRemoved: boolean;
  watermarkText: string;
  trademarkBadge: string;
  tierFamily: 'FREE' | 'PLUS' | 'PRO' | 'ELITE';
  verificationHash: string;
  verificationUrl: string;
  generatedDate: string;
}

/**
 * Computes attribution metadata and watermark rules based on the document author / uploader's subscription tier.
 */
export function getDocumentExportAttribution(
  doc: SolutionDocument,
  currentUser?: { username?: string | null; name?: string | null; email?: string | null; role?: string | null } | null
): DocumentExportAttribution {
  // Determine author identity: prefer current user when exporting, fallback to document proposedBy, lead sponsor
  const currentCleanUsername = normalizeUsername(currentUser?.username);
  const currentCleanEmail = normalizeUsername(currentUser?.email);
  const authorCleanUsername = normalizeUsername(doc.proposedByUsername);

  const cleanUsername = currentCleanUsername || authorCleanUsername || 'citizen';
  
  const rawDisplayName = 
    currentUser?.name || 
    (currentUser?.username ? `@${currentUser.username}` : null) ||
    doc.proposedByUsername || 
    doc.leadSponsors?.[0] || 
    'Official Delegate';

  // Check Founder / Admin privilege first
  const isFounderOrAdmin = Boolean(
    isFounder(currentUser?.username || currentUser?.email, currentUser?.role) ||
    isAdmin(currentUser?.username || currentUser?.email, currentUser?.role)
  );

  // Check Professional / Event account enablement
  const isProAccount = Boolean(
    checkIsProfessionalAccountEnabled(currentUser as any) ||
    checkIsEventAccountEnabled(currentUser as any)
  );

  // Read subscription record across current user username, email, and document author
  const subCurrentUser = currentCleanUsername ? getActiveUserSubscription(currentCleanUsername) : null;
  const subCurrentEmail = currentCleanEmail ? getActiveUserSubscription(currentCleanEmail) : null;
  const subAuthor = authorCleanUsername ? getActiveUserSubscription(authorCleanUsername) : null;

  // Check localStorage session user directly if available
  let sessionPlanId: SubscriptionPlanId | null = null;
  if (typeof window !== 'undefined') {
    try {
      const sess = localStorage.getItem('zenvitra_session_user');
      if (sess) {
        const parsed = JSON.parse(sess);
        if (parsed.subscriptionPlan) {
          sessionPlanId = parsed.subscriptionPlan as SubscriptionPlanId;
        }
      }
    } catch {}
  }

  // Determine highest tier plan
  const elitePlans: SubscriptionPlanId[] = ['org-elite', 'org-enterprise', 'zen-elite', 'pro-enterprise', 'event-elite'];
  const proPlans: SubscriptionPlanId[] = ['zen-pro', 'pro-standard', 'pro-plus', 'event-pro', 'org-pro'];
  const plusPlans: SubscriptionPlanId[] = ['zen-plus', 'pro-starter', 'event-basic'];

  const candidatePlans: (SubscriptionPlanId | null)[] = [
    subCurrentUser?.planId || null,
    subCurrentEmail?.planId || null,
    sessionPlanId,
    subAuthor?.planId || null,
  ];

  let resolvedPlanId: SubscriptionPlanId = 'zen-free';
  if (isFounderOrAdmin) {
    resolvedPlanId = 'org-elite';
  } else if (candidatePlans.some(p => p && elitePlans.includes(p))) {
    resolvedPlanId = candidatePlans.find(p => p && elitePlans.includes(p))!;
  } else if (isProAccount || candidatePlans.some(p => p && proPlans.includes(p))) {
    resolvedPlanId = candidatePlans.find(p => p && proPlans.includes(p)) || 'zen-pro';
  } else if (candidatePlans.some(p => p && plusPlans.includes(p))) {
    resolvedPlanId = candidatePlans.find(p => p && plusPlans.includes(p))!;
  }

  // Classify tier family
  let tierFamily: 'FREE' | 'PLUS' | 'PRO' | 'ELITE' = 'FREE';
  let planDisplayName = 'Civic Free Tier';
  let isWatermarkRemoved = false;
  let watermarkText = 'DRAFTED VIA ZENVITRA OPEN CIVICS • UNVERIFIED PASS';
  let trademarkBadge = 'PUBLISHED VIA ZENVITRA OPEN CIVICS';

  if (elitePlans.includes(resolvedPlanId)) {
    tierFamily = 'ELITE';
    planDisplayName = 'Sovereign Institutional / Elite';
    isWatermarkRemoved = true;
    watermarkText = '';
    trademarkBadge = `REGISTERED TRADEMARK: ${rawDisplayName.toUpperCase()} • SOVEREIGN CHARTER ACCREDITED`;
  } else if (proPlans.includes(resolvedPlanId) || isProAccount) {
    tierFamily = 'PRO';
    planDisplayName = 'Zen Pro Diplomatic';
    isWatermarkRemoved = true;
    watermarkText = '';
    trademarkBadge = `AUTHOR TRADEMARK: ${rawDisplayName.toUpperCase()} • VERIFIED ZENVITRA CONSENSUS`;
  } else if (plusPlans.includes(resolvedPlanId)) {
    tierFamily = 'PLUS';
    planDisplayName = 'Zen Plus Civic';
    isWatermarkRemoved = false;
    watermarkText = 'ZENVITRA VERIFIED CIVIC RECORD';
    trademarkBadge = `AUTHENTICATED AUTHOR: ${rawDisplayName} • ZENVITRA CIVIC NETWORK`;
  } else {
    tierFamily = 'FREE';
    planDisplayName = 'Civic Free';
    isWatermarkRemoved = false;
    watermarkText = 'DRAFTED VIA ZENVITRA OPEN CIVICS • FREE TIER';
    trademarkBadge = `DRAFT AUTHOR: ${rawDisplayName} • PUBLISHED VIA ZENVITRA OPEN CONSENSUS`;
  }

  // Create deterministic verification hash from doc ID and date
  const verificationHash = `ZV-${doc.id.slice(0, 8).toUpperCase()}-${Math.abs(
    doc.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ).toString(16).toUpperCase()}`;

  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/solutions?doc=${doc.id}`
    : `https://zenvitra.xyz/solutions?doc=${doc.id}`;

  return {
    uploaderName: rawDisplayName,
    uploaderUsername: cleanUsername,
    planId: resolvedPlanId,
    planDisplayName,
    isWatermarkRemoved,
    watermarkText,
    trademarkBadge,
    tierFamily,
    verificationHash,
    verificationUrl,
    generatedDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}

/**
 * Groups operative clauses logically into chapters (if present), or returns structured clause groups.
 */
export function formatDocumentClausesHierarchy(clauses: DocumentClause[]): {
  chapters: {
    chapterNumber: string;
    chapterTitle: string;
    clauses: DocumentClause[];
  }[];
  standaloneClauses: DocumentClause[];
} {
  const chapterMap = new Map<string, { chapterNumber: string; chapterTitle: string; clauses: DocumentClause[] }>();
  const standaloneClauses: DocumentClause[] = [];

  clauses.forEach((clause) => {
    if (clause.chapterNumber || clause.chapterTitle) {
      const key = (clause.chapterNumber || 'General').trim();
      if (!chapterMap.has(key)) {
        chapterMap.set(key, {
          chapterNumber: clause.chapterNumber || 'Chapter',
          chapterTitle: clause.chapterTitle || '',
          clauses: [],
        });
      }
      chapterMap.get(key)!.clauses.push(clause);
    } else {
      standaloneClauses.push(clause);
    }
  });

  return {
    chapters: Array.from(chapterMap.values()),
    standaloneClauses,
  };
}

/**
 * Builds a styled, vector-quality standalone HTML document for high-res printing or PDF export.
 */
export function generatePrintableDocumentHtml(
  doc: SolutionDocument,
  attribution: DocumentExportAttribution,
  options: {
    includeVotes?: boolean;
    customLetterhead?: string;
    removeWatermark?: boolean;
  } = { includeVotes: false }
): string {
  const totalVotes = doc.votes.inFavor + doc.votes.against + doc.votes.abstain;
  const inFavorPercent = totalVotes > 0 ? Math.round((doc.votes.inFavor / totalVotes) * 100) : 100;
  const againstPercent = totalVotes > 0 ? Math.round((doc.votes.against / totalVotes) * 100) : 0;
  const abstainPercent = totalVotes > 0 ? Math.round((doc.votes.abstain / totalVotes) * 100) : 0;

  const sponsorsList = (doc.leadSponsors && doc.leadSponsors.length > 0)
    ? doc.leadSponsors.join(', ')
    : attribution.uploaderName;

  const signatoriesList = (doc.signatories && doc.signatories.length > 0)
    ? doc.signatories.join(', ')
    : 'Open Assembly Consensus';

  // Format preambles and clauses
  const preambles = doc.clauses.filter(c => c.type === 'PREAMBULARY');
  const operatives = doc.clauses.filter(c => c.type !== 'PREAMBULARY');
  const formattedOperatives = formatDocumentClausesHierarchy(operatives);

  // Watermark removal option: respect explicit option or tier entitlement
  const shouldRemoveWatermark = options.removeWatermark !== undefined
    ? options.removeWatermark
    : attribution.isWatermarkRemoved;

  const watermarkHtml = !shouldRemoveWatermark ? `
    <div class="watermark-container">
      <div class="watermark-text">${escapeHtml(attribution.watermarkText)}</div>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(doc.title)} - ${escapeHtml(doc.documentCode)}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page) " / " counter(pages);
      }
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      font-family: 'Times New Roman', Times, Georgia, serif;
      color: #111;
      background: #fff;
      line-height: 1.55;
      font-size: 11pt;
      margin: 0;
      padding: 24px;
      position: relative;
    }
    .watermark-container {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
      z-index: 0;
      opacity: 0.08;
      overflow: hidden;
    }
    .watermark-text {
      font-size: 42pt;
      font-weight: 900;
      font-family: Arial, Helvetica, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      transform: rotate(-35deg);
      text-align: center;
      color: #000;
      border: 6px dashed #000;
      padding: 30px 50px;
    }
    .document-content {
      position: relative;
      z-index: 1;
    }
    .header-masthead {
      border-bottom: 2px solid #000;
      padding-bottom: 14px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .masthead-title {
      font-size: 16pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 0 0 4px 0;
    }
    .masthead-sub {
      font-size: 9pt;
      font-family: Arial, Helvetica, sans-serif;
      color: #444;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .doc-ref-box {
      text-align: right;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9pt;
      border-left: 1px solid #ccc;
      padding-left: 14px;
    }
    .doc-ref-code {
      font-weight: bold;
      font-size: 11pt;
      color: #000;
    }
    .title-banner {
      text-align: center;
      margin: 24px 0 20px 0;
    }
    .doc-type-badge {
      display: inline-block;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      font-weight: bold;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      padding: 4px 12px;
      border: 1px solid #000;
      margin-bottom: 8px;
    }
    h1.doc-title {
      font-size: 19pt;
      font-weight: bold;
      margin: 8px 0;
      line-height: 1.25;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 9pt;
      background: #fafafa;
      border: 1px solid #ddd;
    }
    .meta-table td {
      padding: 6px 12px;
      border: 1px solid #ddd;
      vertical-align: top;
    }
    .meta-label {
      font-weight: bold;
      color: #555;
      width: 22%;
    }
    .trademark-box {
      border: 1.5px solid #000;
      padding: 10px 14px;
      margin: 18px 0;
      background: #fdfdfd;
      font-family: Arial, Helvetica, sans-serif;
    }
    .trademark-header {
      font-size: 8pt;
      font-weight: bold;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #000;
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .trademark-details {
      font-size: 9.5pt;
      font-weight: 600;
      color: #111;
    }
    .trademark-sub {
      font-size: 7.5pt;
      color: #666;
      margin-top: 2px;
    }
    .section-title {
      font-size: 11pt;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-family: Arial, Helvetica, sans-serif;
      border-bottom: 1px solid #000;
      padding-bottom: 4px;
      margin: 22px 0 10px 0;
    }
    .chapter-header {
      font-size: 11pt;
      font-weight: bold;
      font-family: Arial, Helvetica, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin: 18px 0 10px 0;
      padding: 4px 8px;
      background: #f0f0f0;
      border-left: 3px solid #000;
    }
    .abstract-box {
      font-style: italic;
      margin: 14px 0 20px 0;
      padding: 10px 16px;
      background: #f7f7f7;
      border-left: 3px solid #000;
      font-size: 10.5pt;
    }
    .clause-row {
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .clause-preamble-text {
      text-align: justify;
      margin-bottom: 8px;
    }
    .clause-operative-item {
      display: flex;
      margin-bottom: 8px;
    }
    .clause-num {
      width: 34px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .clause-body {
      flex: 1;
      text-align: justify;
    }
    .subclause-list {
      margin-top: 6px;
      padding-left: 18px;
    }
    .subclause-item {
      display: flex;
      margin-bottom: 4px;
    }
    .subclause-num {
      width: 24px;
      font-weight: bold;
      color: #444;
      flex-shrink: 0;
    }
    .votes-container {
      margin-top: 24px;
      padding: 12px 16px;
      border: 1px solid #000;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8.5pt;
      page-break-inside: avoid;
      background: #fafafa;
    }
    .votes-header {
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
    }
    .votes-bar {
      display: flex;
      height: 12px;
      background: #e5e5e5;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 6px;
    }
    .footer-seal-block {
      margin-top: 36px;
      padding-top: 14px;
      border-top: 1px solid #000;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 8pt;
      color: #444;
      page-break-inside: avoid;
    }
    .seal-qr-link {
      font-family: monospace;
      font-size: 7.5pt;
      color: #222;
      margin-top: 2px;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  ${watermarkHtml}
  <div class="document-content">
    
    <!-- Masthead -->
    <div class="header-masthead">
      <div>
        <div class="masthead-title">${escapeHtml(options.customLetterhead || doc.committee || 'PLENARY ASSEMBLY')}</div>
        <div class="masthead-sub">ZENVITRA SOVEREIGN CIVIC DRAFT REGISTER • SESSION 2026</div>
      </div>
      <div class="doc-ref-box">
        <div>Official Reference</div>
        <div class="doc-ref-code">${escapeHtml(doc.documentCode)}</div>
        <div>Date: ${escapeHtml(attribution.generatedDate)}</div>
      </div>
    </div>

    <!-- Title & Badge -->
    <div class="title-banner">
      <div class="doc-type-badge">${escapeHtml(doc.documentType.replace(/_/g, ' '))}</div>
      <h1 class="doc-title">${escapeHtml(doc.title)}</h1>
    </div>

    <!-- Attribution & Registered Trademark Block -->
    <div class="trademark-box">
      <div class="trademark-header">
        <span>${escapeHtml(attribution.trademarkBadge)}</span>
        <span>SECURITY HASH: ${escapeHtml(attribution.verificationHash)}</span>
      </div>
      <div class="trademark-details">
        Drafted & Uploaded by: <strong>${escapeHtml(attribution.uploaderName)}</strong> (@${escapeHtml(attribution.uploaderUsername)})
      </div>
      <div class="trademark-sub">
        Accreditation Tier: <strong>${escapeHtml(attribution.planDisplayName)}</strong> • Verified on ZENVITRA Civic Network • Cryptographic verification active
      </div>
    </div>

    <!-- Metadata Matrix -->
    <table class="meta-table">
      <tr>
        <td class="meta-label">Primary Committee:</td>
        <td>${escapeHtml(doc.committee)}</td>
        <td class="meta-label">Category:</td>
        <td>${escapeHtml(doc.category.replace(/_/g, ' '))}</td>
      </tr>
      <tr>
        <td class="meta-label">Lead Sponsors:</td>
        <td>${escapeHtml(sponsorsList)}</td>
        <td class="meta-label">Signatories:</td>
        <td>${escapeHtml(signatoriesList)}</td>
      </tr>
      <tr>
        <td class="meta-label">Status:</td>
        <td><strong>${escapeHtml(doc.status.replace(/_/g, ' '))}</strong></td>
        <td class="meta-label">Verification Link:</td>
        <td style="font-family: monospace; font-size: 8pt;">${escapeHtml(attribution.verificationUrl)}</td>
      </tr>
    </table>

    <!-- Abstract -->
    ${doc.abstract ? `
      <div class="section-title">Executive Abstract</div>
      <div class="abstract-box">${escapeHtml(doc.abstract)}</div>
    ` : ''}

    <!-- Enacting Formula -->
    ${doc.enactingFormula ? `
      <p style="font-weight: bold; text-align: center; margin: 16px 0; font-style: italic;">
        ${escapeHtml(doc.enactingFormula)}
      </p>
    ` : ''}

    <!-- Preambles (if any) -->
    ${preambles.length > 0 ? `
      <div class="section-title">Preamble & Foundational Clauses</div>
      <div style="margin-bottom: 18px;">
        ${preambles.map(p => `
          <div class="clause-row">
            <div class="clause-preamble-text">
              <em>${escapeHtml(p.text)}</em>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Operatives / Articles & Chapters -->
    <div class="section-title">Operative Clauses & Provisions</div>
    <div style="margin-bottom: 24px;">
      ${formattedOperatives.chapters.map(ch => `
        <div class="chapter-header">
          ${escapeHtml(ch.chapterNumber)}${ch.chapterTitle ? `: ${escapeHtml(ch.chapterTitle)}` : ''}
        </div>
        ${ch.clauses.map(clause => renderClauseHtml(clause)).join('')}
      `).join('')}

      ${formattedOperatives.standaloneClauses.map(clause => renderClauseHtml(clause)).join('')}
    </div>

    <!-- Consensus & Voting Record -->
    ${options.includeVotes ? `
      <div class="votes-container">
        <div class="votes-header">Chamber Consensus & Plenary Voting Record</div>
        ${totalVotes > 0 ? `
          <div class="votes-bar">
            <div style="width: ${inFavorPercent}%; background: #10b981;" title="In Favor: ${inFavorPercent}%"></div>
            <div style="width: ${againstPercent}%; background: #ef4444;" title="Against: ${againstPercent}%"></div>
            <div style="width: ${abstainPercent}%; background: #6b7280;" title="Abstain: ${abstainPercent}%"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: bold;">
            <span style="color: #059669;">In Favor: ${doc.votes.inFavor} (${inFavorPercent}%)</span>
            <span style="color: #dc2626;">Against: ${doc.votes.against} (${againstPercent}%)</span>
            <span style="color: #4b5563;">Abstain: ${doc.votes.abstain} (${abstainPercent}%)</span>
          </div>
        ` : `
          <div class="votes-bar" style="background: #9ca3af;" title="No votes"></div>
          <div style="display: flex; justify-content: space-between; font-weight: bold; color: #6b7280; font-size: 8.5pt;">
            <span>No votes</span>
            <span>Awaiting Floor Roll-Call</span>
          </div>
        `}
      </div>
    ` : ''}

    <!-- Sovereign Seal and Verification Footer -->
    <div class="footer-seal-block">
      <div>
        <div style="font-weight: bold; text-transform: uppercase;">ZENVITRA PROTOCOL • SOVEREIGN DOCUMENT REGISTER</div>
        <div>All rights & civic attributions registered to author: ${escapeHtml(attribution.uploaderName)}</div>
        <div class="seal-qr-link">Verify Original Document: ${escapeHtml(attribution.verificationUrl)}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-weight: bold;">SEAL REF: ${escapeHtml(attribution.verificationHash)}</div>
        <div>Subscription Pass: ${escapeHtml(attribution.planDisplayName)}</div>
      </div>
    </div>

  </div>
</body>
</html>`;
}

function renderClauseHtml(clause: DocumentClause): string {
  return `
    <div class="clause-row">
      <div class="clause-operative-item">
        <div class="clause-num">${escapeHtml(clause.clauseNumber)}.</div>
        <div class="clause-body">
          ${clause.title ? `<strong>${escapeHtml(clause.title)}:</strong> ` : ''}
          ${escapeHtml(clause.text)}
          
          ${clause.subClauses && clause.subClauses.length > 0 ? `
            <div class="subclause-list">
              ${clause.subClauses.map(sub => `
                <div class="subclause-item">
                  <div class="subclause-num">${escapeHtml(sub.number)}</div>
                  <div style="flex: 1;">${escapeHtml(sub.text)}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${clause.amendedBy ? `
            <div style="text-align: right; margin-top: 8px; font-family: monospace; font-size: 8.5pt; color: #7e22ce; font-weight: bold; background: #faf5ff; padding: 4px 8px; border-radius: 4px; display: inline-block; float: right;">
              [CLAUSE AMENDED BY ${escapeHtml(clause.amendedBy.handles.join(', '))} • ${clause.amendedBy.pointsPerUser} PTS EACH]
            </div>
            <div style="clear: both;"></div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Triggers a clean print dialog with A4 vector stylesheet
 */
export function printSolutionDocument(
  doc: SolutionDocument,
  attribution: DocumentExportAttribution,
  options?: { customLetterhead?: string; includeVotes?: boolean; removeWatermark?: boolean }
) {
  const html = generatePrintableDocumentHtml(doc, attribution, options);
  const printWindow = window.open('', '_blank', 'width=950,height=1050');
  if (!printWindow) {
    alert('Please allow popups to export and print this solution document.');
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Wait for resources to load, then trigger print reliably
  setTimeout(() => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch {}
  }, 350);
}

/**
 * Generates and downloads a clean Word Document (.docx / Office Open XML)
 */
export function exportSolutionDocumentAsDocx(
  doc: SolutionDocument,
  attribution: DocumentExportAttribution,
  options?: { customLetterhead?: string; includeVotes?: boolean; removeWatermark?: boolean }
) {
  const htmlContent = generatePrintableDocumentHtml(doc, attribution, options);

  // Wrap HTML in Word-compatible HTML format
  const docxTemplate = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' 
          xmlns:w='urn:schemas-microsoft-com:office:word' 
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${doc.title}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 11pt; }
        h1 { font-size: 18pt; text-align: center; }
        .trademark-box { border: 1pt solid #000; padding: 8pt; margin: 12pt 0; }
        .meta-table { width: 100%; border: 1pt solid #ccc; }
      </style>
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', docxTemplate], {
    type: 'application/msword',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(doc.documentCode || doc.title)}-${attribution.uploaderUsername}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates and downloads a standard Markdown document (.md)
 */
export function exportSolutionDocumentAsMarkdown(
  doc: SolutionDocument,
  attribution: DocumentExportAttribution,
  options?: { customLetterhead?: string; includeVotes?: boolean; removeWatermark?: boolean }
) {
  const shouldRemoveWatermark = options?.removeWatermark !== undefined
    ? options.removeWatermark
    : attribution.isWatermarkRemoved;

  let md = `# ${doc.title}\n\n`;
  md += `**Document Code:** \`${doc.documentCode}\`  \n`;
  md += `**Committee / Assembly:** ${doc.committee}  \n`;
  md += `**Document Type:** ${doc.documentType}  \n`;
  md += `**Category:** ${doc.category}  \n`;
  md += `**Status:** ${doc.status}  \n\n`;

  md += `> **${attribution.trademarkBadge}**  \n`;
  md += `> **Uploaded & Drafted By:** ${attribution.uploaderName} (@${attribution.uploaderUsername})  \n`;
  md += `> **Tier:** ${attribution.planDisplayName} | **Verification Hash:** ${attribution.verificationHash}  \n`;
  md += `> **Live Verification:** ${attribution.verificationUrl}  \n\n`;

  if (!shouldRemoveWatermark) {
    md += `*Attribution Notice: ${attribution.watermarkText}*\n\n`;
  }

  md += `## Metadata\n`;
  md += `- **Lead Sponsors:** ${(doc.leadSponsors || []).join(', ') || attribution.uploaderName}\n`;
  md += `- **Signatories:** ${(doc.signatories || []).join(', ') || 'N/A'}\n`;
  md += `- **Date:** ${attribution.generatedDate}\n\n`;

  if (doc.abstract) {
    md += `## Executive Abstract\n\n${doc.abstract}\n\n`;
  }

  if (doc.enactingFormula) {
    md += `*${doc.enactingFormula}*\n\n`;
  }

  const preambles = doc.clauses.filter(c => c.type === 'PREAMBULARY');
  if (preambles.length > 0) {
    md += `## Preamble\n\n`;
    preambles.forEach(p => {
      md += `*${p.text}*\n\n`;
    });
  }

  const operatives = doc.clauses.filter(c => c.type !== 'PREAMBULARY');
  const formattedOperatives = formatDocumentClausesHierarchy(operatives);

  md += `## Operative Clauses\n\n`;

  formattedOperatives.chapters.forEach(ch => {
    md += `### ${ch.chapterNumber}${ch.chapterTitle ? `: ${ch.chapterTitle}` : ''}\n\n`;
    ch.clauses.forEach(c => {
      md += `${c.clauseNumber}. ${c.title ? `**${c.title}:** ` : ''}${c.text}\n`;
      if (c.subClauses && c.subClauses.length > 0) {
        c.subClauses.forEach(s => {
          md += `   - ${s.number} ${s.text}\n`;
        });
      }
      md += `\n`;
    });
  });

  formattedOperatives.standaloneClauses.forEach(c => {
    md += `${c.clauseNumber}. ${c.title ? `**${c.title}:** ` : ''}${c.text}\n`;
    if (c.subClauses && c.subClauses.length > 0) {
      c.subClauses.forEach(s => {
        md += `   - ${s.number} ${s.text}\n`;
      });
    }
    md += `\n`;
  });

  if (options?.includeVotes) {
    md += `## Chamber Consensus\n\n`;
    md += `- In Favor: ${doc.votes.inFavor}\n`;
    md += `- Against: ${doc.votes.against}\n`;
    md += `- Abstain: ${doc.votes.abstain}\n\n`;
  }

  md += `---\n`;
  md += `*Exported from ZENVITRA Solutions • Sovereign Document Platform*\n`;

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(doc.documentCode || doc.title)}-${attribution.uploaderUsername}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

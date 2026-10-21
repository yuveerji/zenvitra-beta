// lib/export/cvDocumentExporter.ts
// Official Academic & Diplomatic Model UN Curriculum Vitae Exporter.
// Strictly unbranded: zero trademarks, zero watermarks, zero promotional stamps.
// Provides two premier A4 PDF export templates:
// 1. "Geneva Diplomatic Standard" (Classic Academic / European Embassy Style)
// 2. "Modern Executive Envoy" (Contemporary Dual-Column International Leadership Style)

import { ZenPassport, MunRecord } from '@/lib/passport';

export type CvTemplateType = 'geneva-diplomatic' | 'modern-envoy';

export interface CvExportOptions {
  includeContact?: boolean;
  includeBio?: boolean;
  includeEducation?: boolean;
  includeSpeaking?: boolean;
  includePress?: boolean;
  includeVerificationStatus?: boolean;
}

/**
 * Escapes HTML entities for secure document rendering.
 */
function escapeHtml(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Safe filename slugifier
 */
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1: Geneva Diplomatic Standard (Classic Academic & Embassy Format)
// ─────────────────────────────────────────────────────────────────────────────

export function generateGenevaPrintHtml(
  passport: ZenPassport,
  options: CvExportOptions = {
    includeContact: true,
    includeBio: true,
    includeEducation: true,
    includeSpeaking: true,
    includePress: true,
    includeVerificationStatus: true,
  }
): string {
  const munRecords: MunRecord[] = passport.munRecords || [];
  const totalConferences = munRecords.length;
  const awardsCount = munRecords.filter((r) => Boolean(r.award)).length;
  const daisCount = munRecords.filter((r) => r.role === 'Executive Board' || r.role === 'Secretariat').length;
  const winRate = totalConferences > 0 ? Math.round((awardsCount / totalConferences) * 100) : 0;
  const awardsList = munRecords.filter((r) => Boolean(r.award));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Curriculum Vitae - ${escapeHtml(passport.fullName)} (Geneva Standard)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
      @bottom-right {
        content: counter(page);
        font-family: "Playfair Display", "Garamond", "Georgia", serif;
        font-size: 8pt;
        color: #71717a;
      }
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Playfair Display", "Garamond", "Georgia", "Times New Roman", serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #111827;
      background: #ffffff;
      padding: 0;
      margin: 0 auto;
      max-width: 820px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
      .record-card, .awards-table tr {
        page-break-inside: avoid;
      }
    }

    /* Print control toolbar (hidden during print) */
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin-bottom: 24px;
    }
    .print-toolbar-title {
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .print-btn {
      background: #2563eb;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover {
      background: #1d4ed8;
    }

    .cv-container {
      padding: 8px 14px;
    }

    /* Centered Classical Diplomatic Masthead */
    .cv-header {
      text-align: center;
      border-bottom: 1.5px solid #111827;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .candidate-name {
      font-size: 25pt;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #111827;
      line-height: 1.15;
    }
    .candidate-subtitle {
      font-size: 11pt;
      font-style: italic;
      color: #4b5563;
      margin-top: 6px;
      letter-spacing: 0.04em;
    }
    .meta-line {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 8px;
      font-size: 9.5pt;
      color: #4b5563;
      font-variant: small-caps;
      letter-spacing: 0.06em;
    }

    /* Formal Section Headings */
    .cv-section {
      margin-bottom: 22px;
    }
    .section-title {
      font-size: 11.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #111827;
      border-bottom: 1px solid #9ca3af;
      padding-bottom: 3px;
      margin-bottom: 12px;
    }

    /* Diplomatic Bio */
    .bio-text {
      font-size: 10pt;
      line-height: 1.6;
      color: #1f2937;
      text-align: justify;
    }

    /* Classical Stats Bar */
    .stats-bar {
      display: flex;
      justify-content: space-around;
      border: 1px solid #d1d5db;
      background: #f9fafb;
      padding: 10px 16px;
      border-radius: 4px;
      margin-bottom: 18px;
      text-align: center;
    }
    .stat-item {
      flex: 1;
    }
    .stat-val {
      font-size: 15pt;
      font-weight: 700;
      color: #111827;
      line-height: 1.1;
    }
    .stat-lbl {
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
      margin-top: 2px;
    }

    /* Honors & Awards Table */
    .awards-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 9.5pt;
      margin-top: 6px;
    }
    .awards-table th {
      text-align: left;
      font-weight: 700;
      font-size: 8.5pt;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #4b5563;
      border-bottom: 1.5px solid #d1d5db;
      padding: 6px 8px;
    }
    .awards-table td {
      padding: 7px 8px;
      border-bottom: 1px solid #e5e7eb;
      color: #1f2937;
      vertical-align: top;
    }
    .award-highlight {
      font-weight: 700;
      color: #111827;
    }

    /* Multilateral Experience Timeline */
    .record-card {
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px dotted #e5e7eb;
    }
    .record-card:last-child {
      border-bottom: none;
    }
    .record-row-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .conf-name {
      font-size: 11pt;
      font-weight: 700;
      color: #111827;
    }
    .conf-date {
      font-size: 9pt;
      color: #6b7280;
      font-style: italic;
    }
    .conf-subline {
      font-size: 9.5pt;
      color: #374151;
      margin-top: 2px;
    }
    .role-tag {
      font-variant: small-caps;
      font-weight: 700;
      color: #1f2937;
      letter-spacing: 0.05em;
    }
    .award-tag {
      font-weight: 700;
      color: #92400e;
      margin-top: 2px;
    }
    .conf-notes {
      font-size: 9pt;
      color: #4b5563;
      margin-top: 4px;
      line-height: 1.45;
    }

    /* Education Block */
    .edu-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .edu-name {
      font-size: 10.5pt;
      font-weight: 700;
      color: #111827;
    }
    .edu-sub {
      font-size: 9.5pt;
      color: #4b5563;
      font-style: italic;
    }
    .edu-year {
      font-size: 9pt;
      color: #6b7280;
    }

    /* Academic Footer */
    .cv-footer {
      margin-top: 32px;
      padding-top: 12px;
      border-top: 1px solid #d1d5db;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #9ca3af;
      font-variant: small-caps;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>

  <!-- Screen Toolbar for Printing -->
  <div class="print-toolbar no-print">
    <div class="print-toolbar-title">
      <strong>Curriculum Vitae Preview</strong> &bull; ${escapeHtml(passport.fullName)} &bull; <em>Geneva Diplomatic Standard</em>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="print-btn" onclick="window.print()">
        <span>Print / Save as PDF</span>
      </button>
      <button class="print-btn" style="background: #334155;" onclick="window.close()">
        <span>Close</span>
      </button>
    </div>
  </div>

  <div class="cv-container">
    
    <!-- Classical Masthead -->
    <header class="cv-header">
      <h1 class="candidate-name">${escapeHtml(passport.fullName)}</h1>
      ${passport.headline ? `<div class="candidate-subtitle">${escapeHtml(passport.headline)}</div>` : '<div class="candidate-subtitle">Model United Nations &bull; Diplomatic Dossier</div>'}
      
      <div class="meta-line">
        ${passport.country ? `<span>${escapeHtml(passport.countryFlag || '')} ${escapeHtml(passport.country)}</span>` : ''}
        ${options.includeEducation && passport.education?.institution ? `<span>${escapeHtml(passport.education.institution)}</span>` : ''}
        <span>Diplomatic Portfolio</span>
      </div>
    </header>

    <!-- Diplomatic Statement -->
    ${options.includeBio && passport.bio ? `
    <section class="cv-section">
      <h2 class="section-title">Summary &amp; Diplomatic Profile</h2>
      <p class="bio-text">${escapeHtml(passport.bio)}</p>
    </section>
    ` : ''}

    <!-- Statistics -->
    <section class="cv-section">
      <h2 class="section-title">Diplomatic Career Summary</h2>
      <div class="stats-bar">
        <div class="stat-item">
          <div class="stat-val">${totalConferences}</div>
          <div class="stat-lbl">Conferences</div>
        </div>
        <div class="stat-item">
          <div class="stat-val">${awardsCount}</div>
          <div class="stat-lbl">Honors &amp; Awards</div>
        </div>
        <div class="stat-item">
          <div class="stat-val">${daisCount}</div>
          <div class="stat-lbl">Dais Appointments</div>
        </div>
        <div class="stat-item">
          <div class="stat-val">${winRate}%</div>
          <div class="stat-lbl">Recognition Rate</div>
        </div>
      </div>
    </section>

    <!-- Honors Table -->
    ${awardsList.length > 0 ? `
    <section class="cv-section">
      <h2 class="section-title">Honors &amp; Distinctions</h2>
      <table class="awards-table">
        <thead>
          <tr>
            <th style="width: 28%;">Award</th>
            <th style="width: 32%;">Conference</th>
            <th style="width: 25%;">Committee &amp; Portfolio</th>
            <th style="width: 15%; text-align: right;">Session</th>
          </tr>
        </thead>
        <tbody>
          ${awardsList.map(a => `
            <tr>
              <td><span class="award-highlight">${escapeHtml(a.award)}</span></td>
              <td>${escapeHtml(a.conferenceName)}</td>
              <td>${escapeHtml(a.committee)} &bull; ${escapeHtml(a.portfolio)}</td>
              <td style="text-align: right;">${escapeHtml(a.date)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
    ` : ''}

    <!-- Multilateral Summits -->
    <section class="cv-section">
      <h2 class="section-title">Model United Nations &amp; Multilateral Experience</h2>
      ${munRecords.length === 0 ? `
        <p style="font-size: 9.5pt; color: #6b7280; font-style: italic;">No conference records archived yet.</p>
      ` : `
        <div class="records-container">
          ${munRecords.map(rec => `
            <div class="record-card">
              <div class="record-row-top">
                <span class="conf-name">${escapeHtml(rec.conferenceName)}</span>
                <span class="conf-date">${escapeHtml(rec.date)}</span>
              </div>
              <div class="conf-subline">
                <span class="role-tag">${escapeHtml(rec.role)}</span> &mdash; 
                <span>${escapeHtml(rec.committee)} &bull; <strong>${escapeHtml(rec.portfolio)}</strong> ${rec.countryFlag ? escapeHtml(rec.countryFlag) : ''}</span>
              </div>
              ${rec.award ? `
                <div class="award-tag">${escapeHtml(rec.award)}</div>
              ` : ''}
              ${rec.notes ? `
                <div class="conf-notes">${escapeHtml(rec.notes)}</div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `}
    </section>

    <!-- Education -->
    ${options.includeEducation && passport.education?.institution ? `
    <section class="cv-section">
      <h2 class="section-title">Education</h2>
      <div class="edu-row">
        <div>
          <div class="edu-name">${escapeHtml(passport.education.institution)}</div>
          <div class="edu-sub">${escapeHtml(passport.education.degreeOrGrade)}${passport.education.fieldOfStudy ? ` &bull; ${escapeHtml(passport.education.fieldOfStudy)}` : ''}</div>
        </div>
        ${passport.education.graduationYear ? `<div class="edu-year">${escapeHtml(passport.education.graduationYear)}</div>` : ''}
      </div>
    </section>
    ` : ''}

    <!-- Speaking -->
    ${options.includeSpeaking && passport.speakingRecords && passport.speakingRecords.length > 0 ? `
    <section class="cv-section">
      <h2 class="section-title">Public Speaking &amp; Parliamentary Engagements</h2>
      <div>
        ${passport.speakingRecords.map(s => `
          <div style="display: flex; justify-content: space-between; font-size: 9.5pt; margin-bottom: 5px;">
            <span><strong>${escapeHtml(s.title)}</strong> &mdash; ${escapeHtml(s.event)}</span>
            <span style="color: #6b7280; font-style: italic;">${escapeHtml(s.category)} &bull; ${escapeHtml(s.date)}</span>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Publications -->
    ${options.includePress && passport.pressRecords && passport.pressRecords.length > 0 ? `
    <section class="cv-section">
      <h2 class="section-title">Diplomatic Publications &amp; Press</h2>
      <div>
        ${passport.pressRecords.map(p => `
          <div style="display: flex; justify-content: space-between; font-size: 9.5pt; margin-bottom: 5px;">
            <span><strong>${escapeHtml(p.title)}</strong></span>
            <span style="color: #6b7280; font-style: italic;">${escapeHtml(p.publication)} &bull; ${escapeHtml(p.publishedAt)}</span>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <!-- Clean Academic Footer -->
    <footer class="cv-footer">
      <span>Curriculum Vitae &bull; ${escapeHtml(passport.fullName)}</span>
      <span>Official Record &bull; ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    </footer>

  </div>

</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2: Modern Executive Envoy (Contemporary Dual-Column Leadership Style)
// ─────────────────────────────────────────────────────────────────────────────

export function generateModernEnvoyPrintHtml(
  passport: ZenPassport,
  options: CvExportOptions = {
    includeContact: true,
    includeBio: true,
    includeEducation: true,
    includeSpeaking: true,
    includePress: true,
    includeVerificationStatus: true,
  }
): string {
  const munRecords: MunRecord[] = passport.munRecords || [];
  const totalConferences = munRecords.length;
  const awardsCount = munRecords.filter((r) => Boolean(r.award)).length;
  const daisCount = munRecords.filter((r) => r.role === 'Executive Board' || r.role === 'Secretariat').length;
  const winRate = totalConferences > 0 ? Math.round((awardsCount / totalConferences) * 100) : 0;
  const awardsList = munRecords.filter((r) => Boolean(r.award));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Curriculum Vitae - ${escapeHtml(passport.fullName)} (Modern Envoy)</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 14mm 14mm 14mm;
      @bottom-right {
        content: counter(page);
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        font-size: 8pt;
        color: #94a3b8;
      }
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 9pt;
      line-height: 1.45;
      color: #0f172a;
      background: #ffffff;
      padding: 0;
      margin: 0 auto;
      max-width: 860px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media print {
      body {
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
      }
      .record-item {
        page-break-inside: avoid;
      }
    }

    /* Print toolbar */
    .print-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #0f172a;
      color: #ffffff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      margin-bottom: 20px;
    }
    .print-btn {
      background: #0284c7;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn:hover {
      background: #0369a1;
    }

    /* Header Bar */
    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 14px;
      border-bottom: 2px solid #0f172a;
      margin-bottom: 16px;
    }
    .top-name {
      font-size: 22pt;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #0f172a;
      line-height: 1.1;
    }
    .top-headline {
      font-size: 10.5pt;
      font-weight: 600;
      color: #475569;
      margin-top: 3px;
    }
    .top-country {
      font-size: 9pt;
      font-weight: 500;
      color: #64748b;
      margin-top: 2px;
    }
    .top-badge {
      text-align: right;
    }
    .dossier-pill {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 10px;
      border-radius: 20px;
      background: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    /* Dual Column Layout */
    .dual-layout {
      display: grid;
      grid-template-columns: 32% 65%;
      gap: 3%;
    }

    /* Left Sidebar */
    .sidebar {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 12px;
      height: fit-content;
    }
    .side-section {
      margin-bottom: 16px;
    }
    .side-section:last-child {
      margin-bottom: 0;
    }
    .side-title {
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #475569;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 4px;
      margin-bottom: 8px;
    }

    /* KPI Mini Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;
    }
    .kpi-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 8px;
      text-align: center;
    }
    .kpi-num {
      font-size: 13pt;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    .kpi-lbl {
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-top: 2px;
    }

    /* Side details */
    .side-inst {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
    }
    .side-degree {
      font-size: 8pt;
      color: #475569;
    }
    .side-year {
      font-size: 7.5pt;
      color: #64748b;
      font-weight: 600;
    }

    /* Right Main Content */
    .main-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .main-section-title {
      font-size: 9.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #0f172a;
      border-bottom: 1.5px solid #0f172a;
      padding-bottom: 3px;
      margin-bottom: 10px;
    }

    .main-bio {
      font-size: 9pt;
      line-height: 1.5;
      color: #334155;
      text-align: justify;
    }

    /* Honors Callout */
    .honors-banner {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-left: 3px solid #d97706;
      border-radius: 6px;
      padding: 8px 12px;
    }
    .honor-row {
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      padding: 3px 0;
      border-bottom: 1px dashed #fde68a;
    }
    .honor-row:last-child {
      border-bottom: none;
    }
    .honor-title {
      font-weight: 700;
      color: #92400e;
    }
    .honor-conf {
      color: #78350f;
    }

    /* Timeline Items */
    .record-item {
      border-left: 2px solid #cbd5e1;
      padding-left: 10px;
      margin-bottom: 10px;
      position: relative;
    }
    .record-item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .conf-title {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
    }
    .conf-period {
      font-size: 8pt;
      font-weight: 600;
      color: #64748b;
    }
    .conf-sub {
      font-size: 8.5pt;
      color: #334155;
      margin-top: 1px;
    }
    .badge-role {
      display: inline-block;
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      padding: 1px 5px;
      border-radius: 3px;
      background: #e2e8f0;
      color: #1e293b;
      margin-right: 4px;
    }
    .badge-award {
      display: inline-block;
      font-size: 7.5pt;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 3px;
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
      margin-top: 3px;
    }
    .conf-notes-text {
      font-size: 8pt;
      color: #475569;
      margin-top: 3px;
      line-height: 1.4;
    }

    /* Footer */
    .envoy-footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 7.5pt;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- Screen Toolbar -->
  <div class="print-toolbar no-print">
    <div>
      <strong>Curriculum Vitae Preview</strong> &bull; ${escapeHtml(passport.fullName)} &bull; <em>Modern Executive Envoy</em>
    </div>
    <div style="display: flex; gap: 8px;">
      <button class="print-btn" onclick="window.print()">
        <span>Print / Save as PDF</span>
      </button>
      <button class="print-btn" style="background: #334155;" onclick="window.close()">
        <span>Close</span>
      </button>
    </div>
  </div>

  <div style="padding: 6px 12px;">

    <!-- Top Executive Header -->
    <header class="top-header">
      <div>
        <h1 class="top-name">${escapeHtml(passport.fullName)}</h1>
        <div class="top-headline">${escapeHtml(passport.headline || 'Multilateral Diplomat & Model UN Delegate')}</div>
        ${passport.country ? `<div class="top-country">${escapeHtml(passport.countryFlag || '')} ${escapeHtml(passport.country)}</div>` : ''}
      </div>
      <div class="top-badge">
        <span class="dossier-pill">Executive Diplomatic Portfolio</span>
      </div>
    </header>

    <!-- Dual Column Split -->
    <div class="dual-layout">
      
      <!-- Left Column (KPIs, Education, Public Engagements) -->
      <aside class="sidebar">
        
        <!-- Metrics -->
        <div class="side-section">
          <div class="side-title">Career Telemetry</div>
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-num">${totalConferences}</div>
              <div class="kpi-lbl">Conferences</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-num">${awardsCount}</div>
              <div class="kpi-lbl">Honors</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-num">${daisCount}</div>
              <div class="kpi-lbl">Dais Appt.</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-num">${winRate}%</div>
              <div class="kpi-lbl">Win Rate</div>
            </div>
          </div>
        </div>

        <!-- Education -->
        ${options.includeEducation && passport.education?.institution ? `
        <div class="side-section">
          <div class="side-title">Academic Background</div>
          <div class="side-inst">${escapeHtml(passport.education.institution)}</div>
          <div class="side-degree">${escapeHtml(passport.education.degreeOrGrade)}${passport.education.fieldOfStudy ? ` • ${escapeHtml(passport.education.fieldOfStudy)}` : ''}</div>
          ${passport.education.graduationYear ? `<div class="side-year">Class of ${escapeHtml(passport.education.graduationYear)}</div>` : ''}
        </div>
        ` : ''}

        <!-- Public Speaking -->
        ${options.includeSpeaking && passport.speakingRecords && passport.speakingRecords.length > 0 ? `
        <div class="side-section">
          <div class="side-title">Speaking &amp; Parliament</div>
          ${passport.speakingRecords.map(s => `
            <div style="margin-bottom: 6px;">
              <div style="font-weight: 600; font-size: 8pt; color: #0f172a;">${escapeHtml(s.title)}</div>
              <div style="font-size: 7.5pt; color: #64748b;">${escapeHtml(s.event)} &bull; ${escapeHtml(s.date)}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

        <!-- Publications -->
        ${options.includePress && passport.pressRecords && passport.pressRecords.length > 0 ? `
        <div class="side-section">
          <div class="side-title">Diplomatic Press</div>
          ${passport.pressRecords.map(p => `
            <div style="margin-bottom: 6px;">
              <div style="font-weight: 600; font-size: 8pt; color: #0f172a;">${escapeHtml(p.title)}</div>
              <div style="font-size: 7.5pt; color: #64748b;">${escapeHtml(p.publication)} &bull; ${escapeHtml(p.publishedAt)}</div>
            </div>
          `).join('')}
        </div>
        ` : ''}

      </aside>

      <!-- Right Column (Bio, Honors, Experience) -->
      <main class="main-content">
        
        <!-- Statement -->
        ${options.includeBio && passport.bio ? `
        <section>
          <div class="main-section-title">Diplomatic Statement</div>
          <p class="main-bio">${escapeHtml(passport.bio)}</p>
        </section>
        ` : ''}

        <!-- Honors Callout -->
        ${awardsList.length > 0 ? `
        <section>
          <div class="main-section-title">Honors &amp; Distinctions</div>
          <div class="honors-banner">
            ${awardsList.map(a => `
              <div class="honor-row">
                <span class="honor-title">${escapeHtml(a.award)}</span>
                <span class="honor-conf">${escapeHtml(a.conferenceName)} &bull; ${escapeHtml(a.committee)} (${escapeHtml(a.date)})</span>
              </div>
            `).join('')}
          </div>
        </section>
        ` : ''}

        <!-- Multilateral Experience -->
        <section>
          <div class="main-section-title">Model United Nations &amp; Summit Experience</div>
          ${munRecords.length === 0 ? `
            <p style="font-size: 8.5pt; color: #64748b; font-style: italic;">No summits recorded yet.</p>
          ` : `
            <div>
              ${munRecords.map(rec => `
                <div class="record-item">
                  <div class="record-item-header">
                    <span class="conf-title">${escapeHtml(rec.conferenceName)}</span>
                    <span class="conf-period">${escapeHtml(rec.date)}</span>
                  </div>
                  <div class="conf-sub">
                    <span class="badge-role">${escapeHtml(rec.role)}</span>
                    <span>${escapeHtml(rec.committee)} &bull; <strong>${escapeHtml(rec.portfolio)}</strong> ${rec.countryFlag ? escapeHtml(rec.countryFlag) : ''}</span>
                  </div>
                  ${rec.award ? `
                    <div>
                      <span class="badge-award">${escapeHtml(rec.award)}</span>
                    </div>
                  ` : ''}
                  ${rec.notes ? `
                    <div class="conf-notes-text">${escapeHtml(rec.notes)}</div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          `}
        </section>

      </main>

    </div>

    <!-- Clean Footer -->
    <footer class="envoy-footer">
      <span>Curriculum Vitae &bull; ${escapeHtml(passport.fullName)}</span>
      <span>Official Record &bull; ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
    </footer>

  </div>

</body>
</html>`;
}

/**
 * Universal HTML generator dispatching to selected template.
 */
export function generatePrintableCvHtml(
  passport: ZenPassport,
  template: CvTemplateType = 'geneva-diplomatic',
  options?: CvExportOptions
): string {
  if (template === 'modern-envoy') {
    return generateModernEnvoyPrintHtml(passport, options);
  }
  return generateGenevaPrintHtml(passport, options);
}

// ─────────────────────────────────────────────────────────────────────────────
// Markdown, Text, and JSON Exporters
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generates an unbranded, clean GitHub Flavored Markdown version of the CV.
 */
export function generateCvMarkdown(
  passport: ZenPassport,
  options: CvExportOptions = {
    includeContact: true,
    includeBio: true,
    includeEducation: true,
    includeSpeaking: true,
    includePress: true,
    includeVerificationStatus: true,
  }
): string {
  const munRecords: MunRecord[] = passport.munRecords || [];
  const totalConferences = munRecords.length;
  const awardsCount = munRecords.filter((r) => Boolean(r.award)).length;
  const daisCount = munRecords.filter((r) => r.role === 'Executive Board' || r.role === 'Secretariat').length;
  const winRate = totalConferences > 0 ? Math.round((awardsCount / totalConferences) * 100) : 0;
  const awardsList = munRecords.filter((r) => Boolean(r.award));

  let md = `# ${passport.fullName}\n`;
  if (passport.headline) {
    md += `**${passport.headline}**\n\n`;
  }
  if (passport.country) {
    md += `*${passport.countryFlag ? `${passport.countryFlag} ` : ''}${passport.country}*\n\n`;
  }

  md += `---\n\n`;

  if (options.includeBio && passport.bio) {
    md += `## Summary\n\n${passport.bio}\n\n`;
  }

  md += `## Diplomatic Record Summary\n\n`;
  md += `- **Total Conferences Attended:** ${totalConferences}\n`;
  md += `- **Honors & Awards Won:** ${awardsCount}\n`;
  md += `- **Executive Board & Dais Appointments:** ${daisCount}\n`;
  md += `- **Recognition Rate:** ${winRate}%\n\n`;

  if (awardsList.length > 0) {
    md += `## Honors & Distinctions\n\n`;
    md += `| Award | Conference | Committee & Portfolio | Session |\n`;
    md += `| :--- | :--- | :--- | :--- |\n`;
    awardsList.forEach((a) => {
      md += `| **${a.award || 'Honor'}** | ${a.conferenceName} | ${a.committee} (${a.portfolio}) | ${a.date} |\n`;
    });
    md += `\n`;
  }

  md += `## Model United Nations & Multilateral Experience\n\n`;
  if (munRecords.length === 0) {
    md += `*No conference records archived.*\n\n`;
  } else {
    munRecords.forEach((rec) => {
      md += `### ${rec.conferenceName} (${rec.date})\n`;
      md += `- **Role:** ${rec.role}\n`;
      md += `- **Committee:** ${rec.committee}\n`;
      md += `- **Portfolio:** ${rec.portfolio}${rec.countryFlag ? ` ${rec.countryFlag}` : ''}\n`;
      if (rec.award) {
        md += `- **Award / Honor:** ${rec.award}\n`;
      }
      if (rec.format) {
        md += `- **Format:** ${rec.format}\n`;
      }
      if (rec.notes) {
        md += `- **Notes:** ${rec.notes}\n`;
      }
      md += `\n`;
    });
  }

  if (options.includeEducation && passport.education?.institution) {
    md += `## Education\n\n`;
    md += `**${passport.education.institution}**\n`;
    md += `${passport.education.degreeOrGrade}${passport.education.fieldOfStudy ? ` • ${passport.education.fieldOfStudy}` : ''}`;
    if (passport.education.graduationYear) {
      md += ` (${passport.education.graduationYear})`;
    }
    md += `\n\n`;
  }

  if (options.includeSpeaking && passport.speakingRecords && passport.speakingRecords.length > 0) {
    md += `## Public Speaking & Parliamentary Engagements\n\n`;
    passport.speakingRecords.forEach((s) => {
      md += `- **${s.title}** — ${s.event} (${s.category}, ${s.date})\n`;
    });
    md += `\n`;
  }

  if (options.includePress && passport.pressRecords && passport.pressRecords.length > 0) {
    md += `## Diplomatic Publications & Press\n\n`;
    passport.pressRecords.forEach((p) => {
      md += `- **${p.title}** — *${p.publication}* (${p.publishedAt})\n`;
    });
    md += `\n`;
  }

  md += `---\n`;
  md += `*Curriculum Vitae generated for ${passport.fullName} on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*\n`;

  return md;
}

/**
 * Generates an unbranded, clean Plain Text (.txt) version of the CV.
 */
export function generateCvPlainText(passport: ZenPassport): string {
  const munRecords: MunRecord[] = passport.munRecords || [];
  const totalConferences = munRecords.length;
  const awardsCount = munRecords.filter((r) => Boolean(r.award)).length;
  const daisCount = munRecords.filter((r) => r.role === 'Executive Board' || r.role === 'Secretariat').length;
  const winRate = totalConferences > 0 ? Math.round((awardsCount / totalConferences) * 100) : 0;
  const awardsList = munRecords.filter((r) => Boolean(r.award));

  let txt = `================================================================================\n`;
  txt += `CURRICULUM VITAE: ${passport.fullName.toUpperCase()}\n`;
  if (passport.headline) txt += `${passport.headline}\n`;
  if (passport.country) txt += `Nationality/Location: ${passport.country}\n`;
  txt += `================================================================================\n\n`;

  if (passport.bio) {
    txt += `SUMMARY\n`;
    txt += `--------------------------------------------------------------------------------\n`;
    txt += `${passport.bio}\n\n`;
  }

  txt += `DIPLOMATIC RECORD SUMMARY\n`;
  txt += `--------------------------------------------------------------------------------\n`;
  txt += `Total Conferences:            ${totalConferences}\n`;
  txt += `Awards & Honors:              ${awardsCount}\n`;
  txt += `Executive Board Appointments: ${daisCount}\n`;
  txt += `Recognition Rate:             ${winRate}%\n\n`;

  if (awardsList.length > 0) {
    txt += `HONORS & DISTINCTIONS\n`;
    txt += `--------------------------------------------------------------------------------\n`;
    awardsList.forEach((a) => {
      const awardTitle = (a.award || 'Distinction').toUpperCase();
      txt += `* ${awardTitle} | ${a.conferenceName} (${a.date})\n`;
      txt += `  Committee: ${a.committee} | Portfolio: ${a.portfolio}\n\n`;
    });
  }

  txt += `MODEL UNITED NATIONS & MULTILATERAL EXPERIENCE\n`;
  txt += `--------------------------------------------------------------------------------\n`;
  munRecords.forEach((rec) => {
    txt += `${rec.conferenceName.toUpperCase()} [${rec.date}]\n`;
    txt += `Role:      ${rec.role}\n`;
    txt += `Committee: ${rec.committee}\n`;
    txt += `Portfolio: ${rec.portfolio}\n`;
    if (rec.award) txt += `Award:     ${rec.award}\n`;
    if (rec.notes) txt += `Details:   ${rec.notes}\n`;
    txt += `\n`;
  });

  if (passport.education?.institution) {
    txt += `EDUCATION\n`;
    txt += `--------------------------------------------------------------------------------\n`;
    txt += `${passport.education.institution}\n`;
    txt += `${passport.education.degreeOrGrade}${passport.education.fieldOfStudy ? ` - ${passport.education.fieldOfStudy}` : ''}`;
    if (passport.education.graduationYear) txt += ` (${passport.education.graduationYear})`;
    txt += `\n\n`;
  }

  txt += `--------------------------------------------------------------------------------\n`;
  txt += `Document generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}\n`;

  return txt;
}

/**
 * Generates clean JSON schema representation of the CV.
 */
export function generateCvJson(passport: ZenPassport): string {
  const cleanData = {
    fullName: passport.fullName,
    username: passport.username,
    headline: passport.headline || null,
    country: passport.country || null,
    bio: passport.bio || null,
    education: passport.education || null,
    metrics: {
      totalConferences: passport.munRecords?.length || 0,
      totalAwards: passport.munRecords?.filter((r) => Boolean(r.award)).length || 0,
      daisAppointments: passport.munRecords?.filter((r) => r.role === 'Executive Board' || r.role === 'Secretariat').length || 0,
    },
    munRecords: (passport.munRecords || []).map((r) => ({
      conferenceName: r.conferenceName,
      date: r.date,
      committee: r.committee,
      portfolio: r.portfolio,
      role: r.role,
      award: r.award || null,
      format: r.format || 'In-Person',
      notes: r.notes || null,
      isVerified: r.isOrganiserVerified,
    })),
    speakingRecords: passport.speakingRecords || [],
    pressRecords: passport.pressRecords || [],
    exportedAt: new Date().toISOString(),
  };

  return JSON.stringify(cleanData, null, 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Client-side Trigger Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Directly opens clean print preview window with no trademarks or watermarks.
 * Supports choosing between 'geneva-diplomatic' and 'modern-envoy'.
 */
export function exportCvAsPrintHtml(
  passport: ZenPassport, 
  template: CvTemplateType = 'geneva-diplomatic',
  options?: CvExportOptions
): void {
  if (typeof window === 'undefined') return;
  const html = generatePrintableCvHtml(passport, template, options);
  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
}

/**
 * Downloads the CV as a clean Markdown (.md) file.
 */
export function exportCvAsMarkdown(passport: ZenPassport, options?: CvExportOptions): void {
  if (typeof window === 'undefined') return;
  const md = generateCvMarkdown(passport, options);
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CV-${slugify(passport.fullName || passport.username)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the CV as a clean Plain Text (.txt) file.
 */
export function exportCvAsText(passport: ZenPassport): void {
  if (typeof window === 'undefined') return;
  const txt = generateCvPlainText(passport);
  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CV-${slugify(passport.fullName || passport.username)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the CV as a clean JSON (.json) schema.
 */
export function exportCvAsJson(passport: ZenPassport): void {
  if (typeof window === 'undefined') return;
  const json = generateCvJson(passport);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CV-${slugify(passport.fullName || passport.username)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

# ZEN.DOCS — Master Implementation Specification & Product Requirements
**ZENVITRA Operating Ecosystem — The Document Intelligence Studio**  
*Document Version: 1.0.0 • Product Architecture: Canonical Specification • Date: October 2026*

---

## 1. Executive Summary & Core Principle

**ZEN.DOCS** is ZENVITRA's central document creation, editing, intelligence, formatting, collaboration, and publishing studio. It bridges structured deliberation and professional authorship:

> **"Write once. Structure intelligently. Export professionally."**

Rather than serving as a detached text editor or a static PDF generator, **ZEN.DOCS** acts as the definitive bridge between **ZEN.SOLUTIONS** (structured youth problem analysis, legislative clauses, policy frameworks, MUN resolutions) and **ZEN.EXPORT** (publication-grade, verifiable, beautifully branded documents).

Every document produced carries dual authenticity:
1. **Personal Trademark & Attribution**: The author's personal name, initials, signature mark, institutional affiliation, and copyright reservation.
2. **ZENVITRA Platform Seal**: Verified ecosystem wordmark, document ID, and origin traceability.

---

## 2. Product Architecture & Ecosystem Blueprint

```
                      ┌────────────────────────────────────────┐
                      │          ZENVITRA CORE ENGINE          │
                      │ Accounts · Auth · Data Vault · Events  │
                      └───────────────────┬────────────────────┘
                                          │
       ┌──────────────────────────────────┴──────────────────────────────────┐
       │                                                                     │
┌──────▼──────────────────────────┐                       ┌──────────────────▼──────┐
│         ZEN.SOLUTIONS           │                       │       DOCS VAULT        │
│ Problem → Analysis → Clauses    │                       │ Revisions · Asset Vault │
└──────────────┬──────────────────┘                       └──────────────────┬──────┘
               │                                                             │
               │ (Native Bidirectional Bridge)                               │
               ▼                                                             ▼
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           ZEN.DOCS STUDIO (WORKBENCH)                             │
│                                                                                   │
│  ┌───────────────────────┐  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │     DOCS EDITOR       │  │      BRAND STUDIO      │  │   TEMPLATE ENGINE    │  │
│  │ Rich Structured Blocks│  │ Personal & Zen Branding│  │ Policy, Bills, Res   │  │
│  └───────────────────────┘  └────────────────────────┘  └──────────────────────┘  │
│  ┌───────────────────────┐  ┌────────────────────────┐  ┌──────────────────────┐  │
│  │     DOCS AI INTEL     │  │   PAGE LAYOUT & PAGER  │  │   COLLABORATION HUB  │  │
│  │ Proof, Audit, Outline │  │ Print Preview & Margins│  │ Comments & Reviews   │  │
│  └───────────────────────┘  └────────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────┬─────────────────────────────────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   │                                             │
          ┌────────▼────────┐                           ┌────────▼────────┐
          │   ZEN.EXPORT    │                           │  ZEN.PUBLISHING │
          │PDF, DOCX, MD, TX│                           │Public Web/Profile│
          └─────────────────┘                           └─────────────────┘
```

---

## 3. Main Dashboard & Workspace

The **ZEN.DOCS Studio Dashboard** provides an organized control center for all drafting and archival workflows:

1. **Studio Quick Launchers**:
   - **Blank Document**: Clean drafting canvas with configurable page geometry (A4, Letter, Custom).
   - **Template Studio**: Start with structured frameworks across governance, policy, diplomacy, and academia.
   - **From ZEN.SOLUTIONS**: Direct ingestion wizard pulling structured clauses, sponsors, analysis, and recommendations.
   - **Import Document**: Upload existing DOCX, Markdown, TXT, or text-extractable PDFs.
   - **Duplicate Project**: Clone previous layouts with styles and branding intact.

2. **Workspace Filtering & Organization**:
   - **Tabbed Views**: Recent, Drafts, In Review, Starred, Shared With Me, Templates, Archived.
   - **Hierarchical Collections**: Nested folders, contextual tags, custom document labels.
   - **Global Search**: Full-text indexing across title, body copy, author trademark, source solution ID, and clause numbers.
   - **Document Status Indicators**: `DRAFT`, `IN_REVIEW`, `APPROVED`, `PUBLISHED`, `ARCHIVED`.
   - **Clean Default State**: No synthetic mock documents; initialized strictly with user-created records.

---

## 4. Advanced Document Editor

A structured block-based rich editor designed for rigorous legislative, academic, and policy writing.

### 4.1 Text & Paragraph Formatting
- **Inline Styling**: Bold, italic, underline, strikethrough, superscript, subscript, inline code, text highlights, custom hex color palettes.
- **Hierarchy**: Heading levels H1 through H6 with automatic hierarchical section numbering (`1.0`, `1.1`, `1.1.1`).
- **Paragraph Controls**: Left, center, right, and full justification; line heights (1.0, 1.15, 1.5, 2.0); paragraph spacing and hanging indents.
- **List Engine**: Bulleted lists, numbered legal outlines, Roman numeral clauses (`(i)`, `(ii)`), nested checklists.
- **Typography Polish**: Smart quotes (`“”`), em/en dashes (`—`, `–`), ligature rendering, and non-breaking spaces.

### 4.2 Rich Document Blocks
- **Data Tables**: Configurable columns/rows, header shading, cell border controls, zebra striping, numerical alignment, formula support.
- **Policy Callouts**: Informational, cautionary, legislative note panels with customized borders and icon headers.
- **Clause Container**: Isolated, reorderable clause block with sponsor chips, status tags, and amendment history links.
- **Mathematical Equations**: KaTeX-powered inline `$...$` and display block `$$...$$` rendering.
- **Footnotes & Endnotes**: Dynamic numeric superscripting with automatic bottom-of-page paging and end-of-document collation.
- **Signature & Attestation Blocks**: Designated sign-off modules with author title, date, organization, and cryptographic verification stamps.
- **Figure & Table Captions**: Automated numbering (`Figure 1`, `Table 2.1`) linked to the Table of Contents.

### 4.3 Navigation & Productivity Tools
- **Live Document Outline**: Real-time heading tree in the collapsible left pane with click-to-jump navigation.
- **Writing Telemetry**: Real-time word count, character count, paragraph tally, reading time estimate, and page count estimate.
- **Focus Mode**: Distraction-free full-screen writing canvas hiding all toolbars and navigation chrome.
- **Continuous Autosave Engine**: Debounced background persistence with visual state indicator (`Saving...`, `All changes saved`).

---

## 5. Page Layout, Geometry & Professional Formatting

ZEN.DOCS distinguishes between the fluid digital canvas and the print-ready paginated output.

| Parameter | Options & Capabilities |
|---|---|
| **Page Sizes** | A4 (Standard ISO 216), US Letter, US Legal, Executive, A3 |
| **Orientation** | Portrait, Landscape (per section or document-wide) |
| **Margins** | Normal (1 in / 25.4 mm), Narrow (0.5 in), Moderate, Wide, or Custom Millimeter inputs |
| **Headers & Footers** | Configurable first page suppression, alternating left/right page headers, document ID stamping |
| **Pagination** | Page X of Y, Roman numerals for front matter, Arabic numerals for body |
| **Front Matter** | Automated Cover Pages with title, subtitle, author trademark, ZENVITRA seal, and date |
| **Table of Contents** | One-click auto-generation based on H1–H4 structure with dynamic page number references |
| **Watermarks** | Custom text (`DRAFT`, `CONFIDENTIAL`, `RESTRICTED`) or SVG logo with adjustable opacity and angle |
| **Page Break Logic** | Dedicated manual page breaks, section breaks (continuous / next page), widow/orphan protection |

---

## 6. ZEN.SOLUTIONS Integration — The Flagship Bridge

The native bridge between **ZEN.SOLUTIONS** and **ZEN.DOCS** guarantees seamless translation of structured policy objects into finished manuscripts.

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│          ZEN.SOLUTIONS          │           │            ZEN.DOCS             │
│                                 │           │                                 │
│ • Problem Statement             │           │ • Executive Summary             │
│ • Root Cause Analysis           │ ────────> │ • Section 1: Background         │
│ • Preamble & Enacting Formula   │  Native   │ • Preamble & General Principles │
│ • Operative Clauses (1..n)      │ Formatter │ • Numbered Clauses & Subclauses │
│ • Implementation Milestones     │           │ • Action Matrix & Roadmap Table │
│ • Endorsing Sponsors/Signatories│           │ • Attribution & Sign-off Block  │
└─────────────────────────────────┘           └─────────────────────────────────┘
```

### 6.1 Format-Specific Document Transformers

1. **Policy Paper & Reform Proposal**:
   - Executive Summary → Background & Context → Problem Definition → Policy Objectives → Proposed Reforms → Implementation Plan → Financial & Risk Analysis → Evaluation Metrics → References.
2. **Bill & Legislative Proposal**:
   - Long Title → Preamble & Enacting Formula → Chapter I: Preliminary & Definitions → Chapter II+: Substantive Clauses & Provisions → Implementation Authority & Commencement → Explanatory Memorandum. *(Clearly watermarked as "Legislative Proposal — Not Enacted Law" until officially ratified).*
3. **MUN Resolution**:
   - Committee Header & Agenda → Sponsor & Signatory Registry → Preambulatory Clauses (italicized verbs: *Recalling*, *Emphasizing*) → Operative Clauses (numbered, underlined verbs: <u>1. Urges</u>, <u>2. Calls upon</u>) → Subclauses `(a)`, `(b)` → Amendment History.
4. **Implementation Framework**:
   - Strategic Objectives → Stakeholder Responsibility Matrix (RACI) → Milestone Timeline → Resource Allocation → KPI Target Benchmarks → Risk Mitigation Matrix.
5. **Academic & Research Report**:
   - Abstract → Research Questions & Hypothesis → Literature Review & Sources → Methodology → Findings & Empirical Data Tables → Discussion & Limitations → Recommendations → Formal Bibliography.

### 6.2 Two-Way Synchronization with Conflict Protection
- **Source Linkage**: Every generated document stores `sourceSolutionId` and `sourceRevisionId`.
- **Change Tracking**: Imported blocks are tracked with metadata tags. Manual user additions (e.g. customized commentary, local case studies) are tagged as user-authored.
- **Sync Back to Solution**: When users refine a clause in ZEN.DOCS, they can initiate a "Sync Back" action.
- **Visual Conflict Resolver**: If the original solution in ZEN.SOLUTIONS was updated concurrently by co-authors, ZEN.DOCS opens a side-by-side diff modal allowing the user to pick, merge, or keep local changes without silent overwrites.

---

## 7. Personal Trademark & ZENVITRA Branding Studio

Personal attribution and platform co-branding form the cornerstone of document ownership in ZENVITRA.

### 7.1 Personal Brand Profiles
Users configure one or more personal or organizational branding identities:
- **Author Display Name & Title**: e.g., *"Aarav Mehta, Youth Envoy for Sustainable Governance"*.
- **Personal Mark / Monogram**: High-resolution PNG/SVG initials monogram or personal crest.
- **Signature Mark**: High-resolution handwritten signature graphic or typed script signature.
- **Institutional Affiliation**: Organization, university, youth council, or think tank designation.
- **Custom Legal Notice**: e.g., *"© 2026 Aarav Mehta. All rights reserved, where applicable."*
- **Personal Accent Color**: Custom hex color applied to document dividers, callout borders, and section banners.

### 7.2 ZENVITRA Brand Controls
- **Official Wordmark / Shield**: Scalable vector logo of ZENVITRA.
- **Co-Branding Modes**:
  - `CO_BRANDED` (Recommended): Author mark on the left, ZENVITRA seal on the right; "Powered by ZENVITRA" attribution.
  - `PERSONAL_ONLY`: Author branding prominent; subtle bottom footer platform attribution.
  - `ZENVITRA_OFFICIAL`: Official committee, press, or platform publication layout.
  - `CLEAN_UNBRANDED`: Minimalist academic layout without promotional badges.
- **Legal Distinction Safeguard**:
  - The studio clearly designates this as **Branding & Author Attribution**, not an automatic legal patent, trademark registration, or copyright warranty.

---

## 8. ZEN.EXPORT — Publishing & Download Engine

ZEN.EXPORT is the dedicated file-generation pipeline ensuring pixel-perfect fidelity across formats.

### 8.1 Export Format Matrix
| Output Format | Target Engine | Quality Guarantee |
|---|---|---|
| **PDF (Print-Ready)** | Serverless Headless Chromium / CSS Paged Media (`@page`) | Real vector text, embedded standard fonts, crisp A4 pagination, exact headers/footers, selectable text. |
| **DOCX (Word)** | Structured OOXML (`docx` engine) | Native Microsoft Word document with editable H1–H4 styles, genuine Word tables, bulleted lists, and header/footer fields. |
| **HTML (Web Edition)** | Semantic HTML5 + Tailwind typography | Self-contained, accessible web document with inline responsive styling. |
| **Markdown / TXT** | CommonMark Parser | Clean, portable markdown file with YAML frontmatter containing all document metadata. |

### 8.2 Production Export Invariants
1. **No Renamed Files**: Never rename an HTML file to `.pdf` or `.docx`. All files are generated by real serialization engines.
2. **Pre-Flight Validation**: Before generating downloads, the export pipeline runs checks for:
   - Overflowing table cells.
   - Broken image sources or missing author signatures.
   - Unresolved template placeholders.
3. **Audit Trail**: Every export logs an entry in `document_exports` containing the generating user ID, timestamp, revision hash, and checksum.

---

## 9. Template Studio & Marketplace

1. **Pre-Loaded Official Templates**:
   - Governance: Model UN Draft Resolution, Parliamentary Legislative Bill, National Youth Policy Proposal.
   - Strategic Planning: 12-Month Project Implementation Plan, Startup Grant Proposal, Corporate CSR Framework.
   - Academic & Research: Policy White Paper, Think Tank Briefing Memo, Empirical Research Paper.
   - Operational: Standard Operating Procedure (SOP), Formal Meeting Minutes & Action Register.
2. **Custom Template Creation**:
   - Save any completed document layout as a reusable organizational or personal template.
   - Set lockable sections, repeatable clause containers, and mandatory metadata fields.

---

## 10. AI-Powered Document Intelligence

The built-in AI copilot acts as a precision writing and auditing partner:
- **Tone Shifter**: Instantly adjust passages between *Diplomatic / UN Formal*, *Legislative Statutory*, *Persuasive Policy*, and *Academic Rigorous*.
- **Clause Restructurer**: Break lengthy paragraphs into clear subclauses with standardized introductory phrases.
- **Redundancy & Conflict Checker**: Scan across operative clauses to detect contradictory provisions or duplicate recommendations.
- **Completeness Auditor**: Verify that every proposed recommendation has an associated implementation timeframe and responsible stakeholder.
- **Citation & Verification Flag**: Highlight unbacked factual claims and prompt the author for citations.

---

## 11. Collaboration, Comments & Review Workflows

1. **Access Roles**:
   - `OWNER`: Full editing, sharing, publishing, and deletion authority.
   - `EDITOR`: Full text and structural modification rights.
   - `COMMENTER`: Read-only text access with permission to leave threaded inline annotations.
   - `VIEWER`: Read-only access with export privileges.
2. **Review Lifecycle**:
   ```
   [DRAFT] ──> [IN REVIEW] ──> [APPROVED] ──> [PUBLISHED]
                    │
                    └──> [CHANGES REQUESTED]
   ```
3. **Revision Snapshots**:
   - Point-in-time immutable revision history.
   - Side-by-side comparison between any two versions with colored additions and deletions.

---

## 12. DOCS VAULT — File Management & Storage

- **Centralized Vault**: Secure storage for all active drafts, exported binaries, and author branding assets.
- **Data Isolation**: Private by default; accessible strictly through verified session tokens.
- **Attachment Storage**: Embedded graphics, author logos, and signature marks stored securely with authenticated URLs.
- **Trash & Soft Deletion**: 30-day recovery window for deleted documents.

---

## 13. Citations, Sources & References

- **Reference Manager**: Document-level bibliography supporting APA 7th, MLA 9th, Chicago 17th, and Harvard formats.
- **Source Linkage**: Retain URLs, publishing dates, and author citations imported from ZEN.SOLUTIONS.
- **Bibliography Block**: Automatically generate an alphabetized reference section at the close of the document.

---

## 14. Document Identity, Attribution & Authenticity

To prevent counterfeit or altered documents, ZEN.DOCS assigns a cryptographic identity to every exported piece:
- **Canonical Document Code**: e.g., `ZEN-DOC/2026/POL-8839`.
- **Unique Revision SHA-256 Checksum**: Fingerprint generated upon export.
- **Verification QR Code**: Optional corner stamp on cover page linking to ZENVITRA's authenticity verification page.
- **Attribution Seal**: Author name, date, platform verification status.

---

## 15. Cross-Ecosystem Integrations

| Ecosystem Module | Integration Workflow |
|---|---|
| **ZEN.SOLUTIONS** | Primary source of structured analysis, clauses, and policy drafts. |
| **ZEN.PULSE** | Share published documents as interactive cards with reading previews. |
| **ZEN.PROFILE** | Feature verified published white papers and resolutions on the author's public portfolio. |
| **ZEN.PASSPORT** | Issue verifiable digital stamps for published resolutions and policy reforms. |
| **ZEN.MUN** | Direct export of committee working papers and adopted resolutions. |
| **ZEN.CHITS** | Attach formal deliberation minutes and moderated debate summaries. |
| **ZEN.SPACE** | Embed organizational policies and governance frameworks into working spaces. |

---

## 16. Technical Data Model & Architecture

### TypeScript Schema Specifications (`types/docs.ts`)

```typescript
export type DocumentStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
export type DocumentPageSize = 'A4' | 'LETTER' | 'LEGAL' | 'A3';
export type DocumentOrientation = 'PORTRAIT' | 'LANDSCAPE';

export interface DocumentBrandProfile {
  id: string;
  authorName: string;
  authorTitle?: string;
  affiliation?: string;
  personalLogoUrl?: string;
  signatureUrl?: string;
  brandMode: 'CO_BRANDED' | 'PERSONAL_ONLY' | 'ZENVITRA_OFFICIAL' | 'CLEAN_UNBRANDED';
  accentColor: string;
  copyrightText?: string;
  watermarkText?: string;
}

export interface DocumentMetadata {
  id: string;
  documentCode: string;
  title: string;
  subtitle?: string;
  status: DocumentStatus;
  authorUserId: string;
  sourceSolutionId?: string;
  sourceRevisionId?: string;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
  pageSize: DocumentPageSize;
  orientation: DocumentOrientation;
  brandProfile: DocumentBrandProfile;
}

export interface DocumentContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'clause' | 'table' | 'callout' | 'equation' | 'signature' | 'page_break';
  data: Record<string, any>;
  origin?: 'SOLUTION_IMPORT' | 'USER_EDIT';
}

export interface ZenDocument {
  metadata: DocumentMetadata;
  blocks: DocumentContentBlock[];
  rawContentHtml?: string;
  revision: number;
}
```

---

## 17. Phased Implementation Roadmap

- **Phase 1 — Core Studio & Personal Trademark**:
  - Live rich-text workspace with A4 layout and print preview.
  - Personal Trademark and ZENVITRA co-branding studio.
  - Native PDF and DOCX export with real formatting.
- **Phase 2 — Solutions Bridge**:
  - Ingestion wizard mapping `SolutionDocument` and `SolutionProject` into formatted blocks.
  - Format libraries: Policy Paper, Bill, MUN Resolution, Implementation Framework.
  - Two-way conflict-aware synchronization.
- **Phase 3 — Intelligence & Collaboration**:
  - AI writing assistant, policy audits, clause restructuring.
  - Shared editing, review states (`Draft`, `In Review`, `Approved`), comments.
- **Phase 4 — Publishing & Passport**:
  - Public web links, verification QR codes, and passport credential stamps.

---

## 18. Definition of Done (Acceptance Criteria)

A user can:
1. Open or create a solution in **ZEN.SOLUTIONS**.
2. Select **Open in ZEN.DOCS**, pick a format (e.g. *Policy Paper* or *MUN Resolution*), and watch structured clauses convert into an editable manuscript.
3. Configure their personal brand (Author Name, Title, Signature, Affiliation) alongside the ZENVITRA seal.
4. Preview the document in page-aware A4 layout with headers, footers, and table of contents.
5. Export a valid, high-resolution **PDF** or editable **DOCX** file containing complete attribution and metadata.
6. Return to ZEN.SOLUTIONS without losing the source project or its revision history.

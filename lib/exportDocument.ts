import { ZenDocument } from '@/types/docs';
import { 
  SubscriptionPlanId, 
  getActiveUserSubscription, 
  normalizeUsername 
} from '@/lib/subscriptionTiers';

export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'md' | 'html' | 'json';

export interface ZenDocsExportAttribution {
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
 * Derives attribution and subscription-governed trademark rules for ZEN.DOCS
 */
export function getZenDocsExportAttribution(
  doc: ZenDocument,
  currentUser?: { username?: string | null; name?: string | null; email?: string | null } | null
): ZenDocsExportAttribution {
  // Determine author identity
  const brandProfile = doc.brandProfile;
  const leadAuthor = doc.leadSponsors?.[0] || doc.collaborators?.find(c => c.role === 'OWNER')?.name;
  
  const rawDisplayName = 
    brandProfile?.authorName || 
    currentUser?.name || 
    leadAuthor || 
    'Official Author';

  const rawUsername = 
    doc.collaborators?.find(c => c.role === 'OWNER')?.handle || 
    currentUser?.username || 
    currentUser?.email || 
    'zen.citizen';

  const cleanUsername = normalizeUsername(rawUsername);

  // Read subscription record
  const subRecord = getActiveUserSubscription(cleanUsername);
  const planId: SubscriptionPlanId = subRecord?.planId || 'zen-free';

  let tierFamily: 'FREE' | 'PLUS' | 'PRO' | 'ELITE' = 'FREE';
  let planDisplayName = 'Civic Free Tier';
  let isWatermarkRemoved = false;
  let watermarkText = 'DRAFTED VIA ZEN.DOCS • FREE CIVIC TIER';
  let trademarkBadge = 'PUBLISHED VIA ZEN.DOCS OPEN CONSENSUS';

  if (['org-elite', 'org-enterprise', 'zen-elite', 'pro-enterprise', 'event-elite'].includes(planId)) {
    tierFamily = 'ELITE';
    planDisplayName = 'Sovereign Institutional / Elite';
    isWatermarkRemoved = true;
    watermarkText = '';
    trademarkBadge = `REGISTERED TRADEMARK: ${rawDisplayName.toUpperCase()} • SOVEREIGN CHARTER ACCREDITED`;
  } else if (['zen-pro', 'pro-standard', 'pro-plus', 'event-pro', 'org-pro'].includes(planId)) {
    tierFamily = 'PRO';
    planDisplayName = 'Zen Pro Diplomatic';
    isWatermarkRemoved = true;
    watermarkText = '';
    trademarkBadge = `AUTHOR TRADEMARK: ${rawDisplayName.toUpperCase()} • VERIFIED ZENVITRA CONSENSUS`;
  } else if (['zen-plus', 'pro-starter', 'event-basic'].includes(planId)) {
    tierFamily = 'PLUS';
    planDisplayName = 'Zen Plus Civic';
    isWatermarkRemoved = false;
    watermarkText = 'ZEN.DOCS VERIFIED CIVIC RECORD';
    trademarkBadge = `AUTHENTICATED AUTHOR: ${rawDisplayName} • ZENVITRA NETWORK`;
  } else {
    tierFamily = 'FREE';
    planDisplayName = 'Civic Free';
    isWatermarkRemoved = false;
    watermarkText = 'DRAFTED VIA ZEN.DOCS • FREE CIVIC TIER';
    trademarkBadge = `DRAFT AUTHOR: ${rawDisplayName} • ZEN.DOCS PLATFORM`;
  }

  const verificationHash = `ZD-${doc.id.slice(0, 8).toUpperCase()}-${Math.abs(
    doc.title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ).toString(16).toUpperCase()}`;

  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/docs?id=${doc.id}`
    : `https://zenvitra.xyz/docs?id=${doc.id}`;

  return {
    uploaderName: rawDisplayName,
    uploaderUsername: cleanUsername,
    planId,
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

export function sanitizeFilename(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'document'
  );
}

/**
 * Builds standalone printable HTML with watermarks and trademark header/footer for ZEN.DOCS
 */
export function generateZenDocsPrintableHtml(
  doc: ZenDocument,
  attribution: ZenDocsExportAttribution,
  options?: { customLetterhead?: string }
): string {
  const htmlContent = doc.contentHtml || '';
  const watermarkHtml = !attribution.isWatermarkRemoved ? `
    <div class="watermark-container">
      <div class="watermark-text">${escapeHtml(attribution.watermarkText)}</div>
    </div>
  ` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(doc.title)} - ${escapeHtml(doc.docCode)}</title>
  <style>
    @page {
      size: ${doc.pageSize || 'A4'};
      margin: 20mm 15mm 20mm 15mm;
      @bottom-right {
        content: counter(page) " / " counter(pages);
      }
    }
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: '${doc.fontFamily || 'Times New Roman'}', serif;
      font-size: ${doc.fontSize || 11}pt;
      line-height: ${doc.lineSpacing || 1.6};
      color: #111827;
      background: #fff;
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
      font-size: 40pt;
      font-weight: 900;
      font-family: Arial, sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      transform: rotate(-35deg);
      text-align: center;
      color: #000;
      border: 6px dashed #000;
      padding: 30px 50px;
    }
    .content-layer {
      position: relative;
      z-index: 1;
    }
    .header-masthead {
      border-bottom: 2px solid #000;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-family: Arial, sans-serif;
    }
    .masthead-title {
      font-size: 15pt;
      font-weight: bold;
      text-transform: uppercase;
      margin: 0 0 4px 0;
    }
    .masthead-sub {
      font-size: 9pt;
      color: #555;
      text-transform: uppercase;
    }
    .doc-ref-box {
      text-align: right;
      font-size: 9pt;
      border-left: 1px solid #ddd;
      padding-left: 12px;
    }
    .doc-ref-code {
      font-weight: bold;
      font-size: 11pt;
      color: #000;
    }
    .trademark-box {
      border: 1.5px solid #000;
      padding: 10px 14px;
      margin: 18px 0;
      background: #fafafa;
      font-family: Arial, sans-serif;
    }
    .trademark-header {
      font-size: 8pt;
      font-weight: bold;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .trademark-details {
      font-size: 9.5pt;
      font-weight: 600;
    }
    .trademark-sub {
      font-size: 7.5pt;
      color: #666;
      margin-top: 2px;
    }
    .doc-title-h1 {
      font-size: 20pt;
      font-weight: bold;
      text-align: center;
      margin: 20px 0 16px 0;
      font-family: '${doc.fontFamily || 'Times New Roman'}', serif;
    }
    .footer-seal-block {
      margin-top: 36px;
      padding-top: 14px;
      border-top: 1px solid #000;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-family: Arial, sans-serif;
      font-size: 8pt;
      color: #555;
      page-break-inside: avoid;
    }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    td, th { border: 1px solid #d1d5db; padding: 8px 12px; }
    blockquote { border-left: 3px solid #06b6d4; padding-left: 14px; margin: 16px 0; font-style: italic; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  ${watermarkHtml}
  <div class="content-layer">
    <div class="header-masthead">
      <div>
        <div class="masthead-title">${escapeHtml(options?.customLetterhead || doc.committeeOrChamber || 'SOVEREIGN DRAFT REGISTER')}</div>
        <div class="masthead-sub">ZEN.DOCS OFFICIAL PUBLISHING ENGINE</div>
      </div>
      <div class="doc-ref-box">
        <div>Ref: <span class="doc-ref-code">${escapeHtml(doc.docCode)}</span></div>
        <div>Date: ${escapeHtml(attribution.generatedDate)}</div>
      </div>
    </div>

    <div class="trademark-box">
      <div class="trademark-header">
        <span>${escapeHtml(attribution.trademarkBadge)}</span>
        <span>SECURITY HASH: ${escapeHtml(attribution.verificationHash)}</span>
      </div>
      <div class="trademark-details">
        Drafted & Uploaded by: <strong>${escapeHtml(attribution.uploaderName)}</strong> (@${escapeHtml(attribution.uploaderUsername)})
      </div>
      <div class="trademark-sub">
        Accreditation Tier: <strong>${escapeHtml(attribution.planDisplayName)}</strong> • Verified on ZENVITRA Sovereign Ledger
      </div>
    </div>

    <h1 class="doc-title-h1">${escapeHtml(doc.title)}</h1>

    <div class="document-body">
      ${htmlContent}
    </div>

    <div class="footer-seal-block">
      <div>
        <div style="font-weight: bold; text-transform: uppercase;">ZENVITRA PROTOCOL • SOVEREIGN DOCUMENT REGISTER</div>
        <div>All rights & civic attributions registered to author: ${escapeHtml(attribution.uploaderName)}</div>
        <div style="font-family: monospace; font-size: 7.5pt; margin-top: 2px;">
          Verification Link: ${escapeHtml(attribution.verificationUrl)}
        </div>
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

/**
 * Enhanced exportDocument for ZEN.DOCS that enforces dynamic trademarks and subscription watermarks
 */
export function exportDocument(
  doc: ZenDocument, 
  format: ExportFormat, 
  rawText?: string,
  currentUser?: { username?: string | null; name?: string | null; email?: string | null } | null,
  options?: { customLetterhead?: string }
): void {
  const filename = sanitizeFilename(doc.title);
  const attribution = getZenDocsExportAttribution(doc, currentUser);
  const htmlContent = doc.contentHtml || '';
  const textContent = rawText || htmlContent.replace(/<[^>]*>?/gm, ' ');

  switch (format) {
    case 'pdf': {
      // Generate styled print window with dynamic watermark and trademark badge
      if (typeof window !== 'undefined') {
        const printableHtml = generateZenDocsPrintableHtml(doc, attribution, options);
        const printWindow = window.open('', '_blank', 'width=950,height=1050');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(printableHtml);
          printWindow.document.close();
          printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
          };
        } else {
          window.print();
        }
      }
      break;
    }

    case 'docx': {
      // Generate WordprocessingML compatible HTML package with Trademark & Attribution box
      const printableHtml = generateZenDocsPrintableHtml(doc, attribution, options);
      const wordHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
xmlns:w='urn:schemas-microsoft-com:office:word' 
xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<title>${escapeHtml(doc.title)}</title>
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
@page Section1 {
  size: 595.3pt 841.9pt; /* A4 size */
  margin: 72.0pt 72.0pt 72.0pt 72.0pt;
  mso-header-margin: 35.4pt;
  mso-footer-margin: 35.4pt;
  mso-paper-source: 0;
}
div.Section1 { page: Section1; }
body {
  font-family: '${doc.fontFamily || 'Times New Roman'}', serif;
  font-size: ${doc.fontSize || 12}pt;
  line-height: ${doc.lineSpacing || '1.5'};
  color: #111827;
}
h1, h2, h3, h4 { font-family: '${doc.fontFamily || 'Times New Roman'}', serif; color: #111827; }
table { border-collapse: collapse; width: 100%; margin: 16px 0; }
td, th { border: 1px solid #d1d5db; padding: 8px 12px; }
blockquote { border-left: 3px solid #06b6d4; padding-left: 14px; margin: 16px 0; color: #374151; font-style: italic; }
</style>
</head>
<body>
<div class="Section1">
${printableHtml}
</div>
</body>
</html>`;

      const blob = new Blob(['\ufeff' + wordHtml], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8',
      });
      triggerDownload(blob, `${filename}-${attribution.uploaderUsername}.docx`);
      break;
    }

    case 'txt': {
      let fullTxt = `========================================================\n`;
      fullTxt += `${doc.title}\n`;
      fullTxt += `Document Code: ${doc.docCode}\n`;
      fullTxt += `${attribution.trademarkBadge}\n`;
      fullTxt += `Author: ${attribution.uploaderName} (@${attribution.uploaderUsername})\n`;
      fullTxt += `Tier: ${attribution.planDisplayName}\n`;
      fullTxt += `Verification Hash: ${attribution.verificationHash}\n`;
      fullTxt += `========================================================\n\n`;
      fullTxt += textContent;
      const blob = new Blob([fullTxt], { type: 'text/plain;charset=utf-8;' });
      triggerDownload(blob, `${filename}-${attribution.uploaderUsername}.txt`);
      break;
    }

    case 'md': {
      let mdHeader = `# ${doc.title}\n\n`;
      mdHeader += `**Document Code:** \`${doc.docCode}\`  \n`;
      mdHeader += `**Chamber / Committee:** ${doc.committeeOrChamber}  \n`;
      mdHeader += `**Status:** ${doc.status}  \n`;
      mdHeader += `**Version:** v${doc.version || 1}.0  \n`;
      mdHeader += `**Updated:** ${new Date(doc.updatedAt).toLocaleDateString()}  \n\n`;
      
      mdHeader += `> **${attribution.trademarkBadge}**  \n`;
      mdHeader += `> **Author / Uploader:** ${attribution.uploaderName} (@${attribution.uploaderUsername})  \n`;
      mdHeader += `> **Tier:** ${attribution.planDisplayName} | **Verification Hash:** ${attribution.verificationHash}  \n`;
      mdHeader += `> **Live Verification:** ${attribution.verificationUrl}  \n\n`;

      if (!attribution.isWatermarkRemoved) {
        mdHeader += `*Attribution Notice: ${attribution.watermarkText}*\n\n`;
      }
      
      mdHeader += `---\n\n`;
      const blob = new Blob([mdHeader + textContent], { type: 'text/markdown;charset=utf-8;' });
      triggerDownload(blob, `${filename}-${attribution.uploaderUsername}.md`);
      break;
    }

    case 'html': {
      const standaloneHtml = generateZenDocsPrintableHtml(doc, attribution, options);
      const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8;' });
      triggerDownload(blob, `${filename}-${attribution.uploaderUsername}.html`);
      break;
    }

    case 'json': {
      const payload = {
        ...doc,
        exportAttribution: attribution,
      };
      const jsonStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      triggerDownload(blob, `${filename}-sovereign-ledger.json`);
      break;
    }
  }
}

function triggerDownload(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

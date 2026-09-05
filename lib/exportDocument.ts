import { ZenDocument } from '@/types/docs';

export type ExportFormat = 'pdf' | 'docx' | 'txt' | 'md' | 'html' | 'json';

export function sanitizeFilename(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'document'
  );
}

export function exportDocument(doc: ZenDocument, format: ExportFormat, rawText?: string): void {
  const filename = sanitizeFilename(doc.title);
  const htmlContent = doc.contentHtml || '';
  const textContent = rawText || htmlContent.replace(/<[^>]*>?/gm, ' ');

  switch (format) {
    case 'pdf': {
      // Trigger native browser high-fidelity print to PDF dialog
      if (typeof window !== 'undefined') {
        window.print();
      }
      break;
    }

    case 'docx': {
      // Generate standard WordprocessingML compatible HTML package
      const wordHtml = `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
xmlns:w='urn:schemas-microsoft-com:office:word' 
xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
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
${htmlContent}
</div>
</body>
</html>`;

      const blob = new Blob(['\ufeff' + wordHtml], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=utf-8',
      });
      triggerDownload(blob, `${filename}.docx`);
      break;
    }

    case 'txt': {
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
      triggerDownload(blob, `${filename}.txt`);
      break;
    }

    case 'md': {
      const mdHeader = `# ${doc.title}\n\n` +
        `**Document Code:** ${doc.docCode}  \n` +
        `**Chamber / Committee:** ${doc.committeeOrChamber}  \n` +
        `**Status:** ${doc.status}  \n` +
        `**Version:** v${doc.version || 1}.0  \n` +
        `**Updated:** ${new Date(doc.updatedAt).toLocaleDateString()}  \n\n` +
        `---\n\n`;
      const blob = new Blob([mdHeader + textContent], { type: 'text/markdown;charset=utf-8;' });
      triggerDownload(blob, `${filename}.md`);
      break;
    }

    case 'html': {
      const standaloneHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title}</title>
  <style>
    body {
      max-width: 840px;
      margin: 40px auto;
      padding: 0 24px;
      font-family: ${doc.fontFamily || 'Inter, sans-serif'};
      font-size: ${doc.fontSize || 12}pt;
      line-height: ${doc.lineSpacing || 1.6};
      color: #111827;
      background-color: #ffffff;
    }
    @media print {
      body { margin: 0; padding: 0; max-width: 100%; }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
      const blob = new Blob([standaloneHtml], { type: 'text/html;charset=utf-8;' });
      triggerDownload(blob, `${filename}.html`);
      break;
    }

    case 'json': {
      const jsonStr = JSON.stringify(doc, null, 2);
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

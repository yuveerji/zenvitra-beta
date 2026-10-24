import { NextRequest, NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file was provided.' },
        { status: 400 }
      );
    }

    const fileName = file.name || 'document';
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    let extractedHtml = '';
    let extractedTables: string[] = [];

    if (extension === 'docx') {
      // Extract clean raw text
      const textResult = await mammoth.extractRawText({ buffer });
      extractedText = textResult.value;

      // Extract HTML to check for tables or formatted structure
      try {
        const htmlResult = await mammoth.convertToHtml({ buffer });
        extractedHtml = htmlResult.value;
      } catch (err) {
        console.warn('Mammoth HTML conversion note:', err);
      }
    } else if (extension === 'pdf') {
      // Polyfill browser DOM classes needed by pdfjs in Node.js runtime
      if (typeof (global as any).DOMMatrix === 'undefined') {
        (global as any).DOMMatrix = class DOMMatrix {
          a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
          constructor(init?: any) {
            if (Array.isArray(init) && init.length >= 6) {
              this.a = init[0]; this.b = init[1]; this.c = init[2];
              this.d = init[3]; this.e = init[4]; this.f = init[5];
            }
          }
        };
      }
      if (typeof (global as any).ImageData === 'undefined') {
        (global as any).ImageData = class ImageData {};
      }
      if (typeof (global as any).Path2D === 'undefined') {
        (global as any).Path2D = class Path2D {};
      }

      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParseModule = require('pdf-parse');
      const uint8 = new Uint8Array(buffer);

      if (pdfParseModule.PDFParse) {
        // pdf-parse v2+ Class API
        const parser = new pdfParseModule.PDFParse(uint8);
        const pdfData = await parser.getText();
        extractedText = pdfData?.text || (typeof pdfData === 'string' ? pdfData : '');
      } else if (typeof pdfParseModule === 'function') {
        // pdf-parse v1 Legacy Function API
        const pdfData = await pdfParseModule(buffer);
        extractedText = pdfData.text || '';
      } else if (typeof pdfParseModule.default === 'function') {
        const pdfData = await pdfParseModule.default(buffer);
        extractedText = pdfData.text || '';
      }
    } else if (extension === 'txt' || extension === 'md') {
      extractedText = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported format .${extension}. Please upload a PDF (.pdf), Word document (.docx), Markdown (.md), or plain text (.txt) file.`
        },
        { status: 400 }
      );
    }

    // Clean up excessive whitespace, carriage returns, and control characters
    const cleanText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
    const mimeMap: Record<string, string> = {
      pdf: 'application/pdf',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      doc: 'application/msword',
      txt: 'text/plain',
      md: 'text/markdown'
    };
    const mimeType = mimeMap[extension] || 'application/octet-stream';
    const dataUrl = buffer.length <= 10 * 1024 * 1024
      ? `data:${mimeType};base64,${buffer.toString('base64')}`
      : undefined;

    return NextResponse.json({
      success: true,
      fileName,
      fileSize: file.size,
      fileType: extension,
      text: cleanText,
      dataUrl,
      htmlPreview: extractedHtml || undefined,
      lineCount: cleanText.split('\n').length,
      wordCount: cleanText.split(/\s+/).filter(Boolean).length
    });
  } catch (error: any) {
    console.error('Document extraction error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to extract text from document.'
      },
      { status: 500 }
    );
  }
}

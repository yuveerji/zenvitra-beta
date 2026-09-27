import { NextRequest, NextResponse } from 'next/server';
import { parseDocument, detectDocumentType } from '@/lib/docEngine/parser';
import { DocumentType } from '@/types/solutions';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText, forcedType, enableAI } = body;

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return NextResponse.json({ error: 'Please provide document text to analyze.' }, { status: 400 });
    }

    // Run core universal parser
    const parsed = parseDocument(rawText, forcedType as DocumentType);

    // Optional AI Polish if Gemini API key exists in environment
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (enableAI && geminiKey) {
      try {
        const aiPrompt = `You are the ZEN.SOLUTIONS Legislative Document Parser.
Analyze this legal/policy text and return a JSON object with:
{
  "title": string,
  "enactingFormula": string,
  "preamble": string,
  "chapters": [{"number": string, "title": string}],
  "clauses": [{"clauseNumber": string, "title": string, "text": string, "subClauses": [{"number": string, "text": string}]}]
}
Text to parse:
${rawText.slice(0, 10000)}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: aiPrompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          }),
          signal: AbortSignal.timeout(8000)
        });

        if (response.ok) {
          const aiData = await response.json();
          const aiJson = JSON.parse(aiData.candidates[0].content.parts[0].text);
          if (aiJson && Array.isArray(aiJson.clauses) && aiJson.clauses.length > 0) {
            parsed.title = aiJson.title || parsed.title;
            parsed.enactingFormula = aiJson.enactingFormula || parsed.enactingFormula;
            parsed.preamble = aiJson.preamble || parsed.preamble;
          }
        }
      } catch (aiErr) {
        console.warn('[DOCENGINE-AI-ENRICH-FALLBACK]', aiErr);
      }
    }

    return NextResponse.json({
      success: true,
      parsed,
      detection: detectDocumentType(rawText)
    });
  } catch (error: any) {
    console.error('[DOCENGINE-PARSE-ERROR]', error);
    return NextResponse.json({ error: error.message || 'Failed to parse document' }, { status: 500 });
  }
}

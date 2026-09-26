import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';
export const revalidate = 86400; // 24 hours

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'zen-diplomacy-brochure.html');
    if (!fs.existsSync(filePath)) {
      return new NextResponse('Brochure file not found', { status: 404 });
    }
    const html = fs.readFileSync(filePath, 'utf-8');
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Failed to read brochure HTML:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

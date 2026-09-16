import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GIPHY_API_KEY = process.env.GIPHY_API_KEY || 'sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh';

const FALLBACK_GIFS = [
  {
    id: 'gif-1',
    title: 'Mind Blown Reaction',
    url: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/26ufdipQqU2lhNA4g/200w.gif',
    width: 480,
    height: 270,
  },
  {
    id: 'gif-2',
    title: 'Applause Cheers',
    url: 'https://media.giphy.com/media/l3q2XhfQ8oCkm1Ts4/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/l3q2XhfQ8oCkm1Ts4/200w.gif',
    width: 480,
    height: 270,
  },
  {
    id: 'gif-3',
    title: 'Thumbs Up Approval',
    url: 'https://media.giphy.com/media/111ebonMs90YLu/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/111ebonMs90YLu/200w.gif',
    width: 480,
    height: 360,
  },
  {
    id: 'gif-4',
    title: 'Laughing Hysterically',
    url: 'https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/3oEjHAUOqG3lSS0f1C/200w.gif',
    width: 480,
    height: 270,
  },
  {
    id: 'gif-5',
    title: 'Popcorn Watching Debate',
    url: 'https://media.giphy.com/media/GLbiGvv9RiPgA/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/GLbiGvv9RiPgA/200w.gif',
    width: 480,
    height: 270,
  },
  {
    id: 'gif-6',
    title: 'Diplomatic Gavel Agreement',
    url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/200w.gif',
    width: 480,
    height: 270,
  },
  {
    id: 'gif-7',
    title: 'Celebrate Party Confetti',
    url: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/artj92V8o75VPL7AeQ/200w.gif',
    width: 480,
    height: 270,
  },
  {
    id: 'gif-8',
    title: 'Cat Typing Coding Fast',
    url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
    previewUrl: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/200w.gif',
    width: 480,
    height: 360,
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.trim() || '';
  const limit = Math.min(Number(searchParams.get('limit')) || 24, 50);

  try {
    const endpoint = query
      ? `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}&rating=g`
      : `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&rating=g`;

    const res = await fetch(endpoint, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    });

    if (!res.ok) {
      throw new Error(`Giphy API returned status ${res.status}`);
    }

    const data = await res.json();
    const gifs = (data.data || []).map((item: any) => ({
      id: item.id,
      title: item.title || 'GIF',
      url: item.images?.original?.url || item.images?.fixed_height?.url,
      previewUrl: item.images?.fixed_height_small?.url || item.images?.fixed_height?.url,
      width: Number(item.images?.original?.width) || 400,
      height: Number(item.images?.original?.height) || 300,
    }));

    return NextResponse.json({
      success: true,
      source: 'Giphy API',
      query,
      gifs: gifs.length > 0 ? gifs : FALLBACK_GIFS,
    });
  } catch (error: any) {
    console.warn('Giphy fetch warning, using curated fallback:', error.message);
    const filtered = query
      ? FALLBACK_GIFS.filter(g => g.title.toLowerCase().includes(query.toLowerCase()))
      : FALLBACK_GIFS;
    return NextResponse.json({
      success: true,
      source: 'Curated Giphy Fallback',
      query,
      gifs: filtered.length > 0 ? filtered : FALLBACK_GIFS,
    });
  }
}


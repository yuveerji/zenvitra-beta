import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const listings = await db.conferenceListing.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, listings });
  } catch (error: any) {
    console.error('[CONFERENCE_LISTINGS_GET_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch conference listings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      shortName,
      category,
      format,
      venue,
      city,
      startDate,
      endDate,
      organizerName,
      organizerEmail,
      organizerPhone,
      organizerHandle,
      institution,
      description,
      coverImage,
      ticketPrice,
      tierPlans,
      committees,
      userId
    } = body;

    if (!title || !startDate || !endDate || !organizerName || !organizerEmail) {
      return NextResponse.json(
        { success: false, error: 'Title, dates, organizer name, and email are required' },
        { status: 400 }
      );
    }

    // Generate unique vanity slug
    const cleanTitle = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let slug = cleanTitle || `conf-${Date.now()}`;
    
    // Check if slug already exists, append unique suffix if so
    const existing = await db.conferenceListing.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    // Safely resolve valid foreign key for User
    let validUserId: string | null = null;
    if (userId) {
      try {
        const userById = await db.user.findUnique({
          where: { id: userId },
          select: { id: true },
        });
        if (userById) {
          validUserId = userById.id;
        }
      } catch (_) {}
    }

    // If not found by ID, attempt to match or create a local record by organizerEmail
    if (!validUserId && organizerEmail) {
      const cleanEmail = organizerEmail.trim().toLowerCase();
      try {
        const userByEmail = await db.user.findUnique({
          where: { email: cleanEmail },
          select: { id: true },
        });
        if (userByEmail) {
          validUserId = userByEmail.id;
        } else {
          const newUser = await db.user.create({
            data: {
              ...(userId && userId.length < 40 ? { id: userId } : {}),
              email: cleanEmail,
              name: organizerName?.trim() || 'Event Organizer',
              handle: organizerHandle?.trim() || cleanEmail.split('@')[0],
              username: organizerHandle?.trim()?.replace(/^@/, '') || cleanEmail.split('@')[0],
              role: 'ORGANIZER',
              roleBadge: 'ORGANIZER',
            },
          });
          validUserId = newUser.id;
        }
      } catch (_) {
        validUserId = null;
      }
    }

    const listingData = {
      slug,
      title: title.trim(),
      shortName: (shortName || title.slice(0, 10)).trim().toUpperCase(),
      category: category || 'MUN',
      format: format || 'physical',
      venue: (venue || 'Main Assembly Venue').trim(),
      city: (city || 'New Delhi').trim(),
      startDate: (() => {
        const d = new Date(startDate);
        return isNaN(d.getTime()) ? new Date() : d;
      })(),
      endDate: (() => {
        const d = new Date(endDate);
        return isNaN(d.getTime()) ? new Date(Date.now() + 86400000 * 2) : d;
      })(),
      organizerName: organizerName.trim(),
      organizerEmail: organizerEmail.trim().toLowerCase(),
      organizerPhone: organizerPhone?.trim() || null,
      organizerHandle: organizerHandle?.trim() || null,
      institution: institution?.trim() || null,
      description: (description || 'Sovereign conference and diplomatic assembly').trim(),
      coverImage: coverImage || null,
      ticketPrice: ticketPrice ? Number(ticketPrice) : 0,
      tierPlansJson: tierPlans ? JSON.stringify(tierPlans) : null,
      committeesJson: committees ? JSON.stringify(committees) : null,
      status: 'PENDING',
      verified: false,
      userId: validUserId,
    };

    let listing;
    try {
      listing = await db.conferenceListing.create({
        data: listingData,
      });
    } catch (createErr: any) {
      // If foreign key constraint is violated (P2003), fallback to userId: null to ensure conference creation succeeds
      if (createErr.code === 'P2003') {
        listing = await db.conferenceListing.create({
          data: {
            ...listingData,
            userId: null,
          },
        });
      } else {
        throw createErr;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Conference submitted successfully! Undergoing verification by ZENVITRA Core Team.',
      listing
    }, { status: 201 });
  } catch (error: any) {
    console.error('[CONFERENCE_LISTING_POST_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit conference listing' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await db.conferenceListing.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      }
    });

    if (!listing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, listing });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await db.conferenceListing.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      }
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    const {
      status,
      verifiedBy,
      venue,
      city,
      title,
      description,
      startDate,
      endDate,
      coverImage,
      format,
      ticketPrice,
      tierPlansJson,
      committeesJson,
    } = body;

    const isVerifying = status === 'VERIFIED';

    const updateData: any = {};
    if (status !== undefined) {
      updateData.status = status;
      updateData.verified = isVerifying;
      updateData.verifiedAt = isVerifying ? new Date() : existing.verifiedAt;
      if (verifiedBy) updateData.verifiedBy = verifiedBy;
    }
    if (venue !== undefined) updateData.venue = venue;
    if (city !== undefined) updateData.city = city;
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (format !== undefined) updateData.format = format;
    if (ticketPrice !== undefined) updateData.ticketPrice = Number(ticketPrice) || 0;
    if (tierPlansJson !== undefined) {
      updateData.tierPlansJson = typeof tierPlansJson === 'string' ? tierPlansJson : JSON.stringify(tierPlansJson);
    }
    if (committeesJson !== undefined) {
      updateData.committeesJson = typeof committeesJson === 'string' ? committeesJson : JSON.stringify(committeesJson);
    }
    if (startDate && !isNaN(Date.parse(startDate))) {
      updateData.startDate = new Date(startDate);
    }
    if (endDate && !isNaN(Date.parse(endDate))) {
      updateData.endDate = new Date(endDate);
    }

    const updated = await db.conferenceListing.update({
      where: { id: existing.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      message: 'Conference listing updated successfully',
      listing: updated
    });
  } catch (error: any) {
    console.error('[CONFERENCE_LISTING_PATCH_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await db.conferenceListing.findFirst({
      where: {
        OR: [{ id }, { slug: id }]
      }
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    await db.conferenceListing.delete({
      where: { id: existing.id }
    });

    return NextResponse.json({ success: true, message: 'Listing deleted' });
  } catch (error: any) {
    console.error('[CONFERENCE_LISTING_DELETE_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

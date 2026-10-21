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
    const { status, verifiedBy } = body;

    const isVerifying = status === 'VERIFIED';

    const updated = await db.conferenceListing.update({
      where: { id },
      data: {
        status: status || 'VERIFIED',
        verified: isVerifying,
        verifiedAt: isVerifying ? new Date() : null,
        verifiedBy: verifiedBy || (isVerifying ? 'ZENVITRA Secretariat' : null)
      }
    });

    return NextResponse.json({
      success: true,
      message: isVerifying 
        ? 'Conference verified and approved! It is now live across the platform.'
        : `Conference listing updated to ${status}`,
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
    await db.conferenceListing.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Listing deleted' });
  } catch (error: any) {
    console.error('[CONFERENCE_LISTING_DELETE_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

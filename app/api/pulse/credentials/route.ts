import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    const where: any = {
      isPublicOnPassport: true,
      verificationStatus: 'VERIFIED',
    };

    if (username) {
      where.userUsername = username.toLowerCase().replace(/^@/, '');
    } else if (userId) {
      where.userId = userId;
    }

    if (category) {
      where.category = category;
    }

    const credentials = await db.pulseCredential.findMany({
      where,
      orderBy: { issuedAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      credentials,
    });
  } catch (error: any) {
    console.error('Error fetching pulse credentials:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch credentials' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      userUsername,
      title,
      category = 'DELEGATE_AWARD',
      issuerName,
      issuerId,
      issuerSignature,
      proofUrl,
      auditNotes,
    } = body;

    if (!userUsername || !title?.trim() || !issuerName?.trim()) {
      return NextResponse.json(
        { success: false, error: 'userUsername, title, and issuerName are required' },
        { status: 400 }
      );
    }

    const cleanUsername = userUsername.toLowerCase().replace(/^@/, '').trim();
    const cleanUserId = userId || `user_${cleanUsername}`;
    const credentialId = `CRED-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const credential = await db.pulseCredential.create({
      data: {
        userId: cleanUserId,
        userUsername: cleanUsername,
        title: title.trim(),
        category,
        issuerName: issuerName.trim(),
        issuerId: issuerId || null,
        issuerSignature: issuerSignature || `SIG_SHA256_${Date.now()}`,
        credentialId,
        proofUrl: proofUrl || null,
        verificationStatus: 'VERIFIED',
        isPublicOnPassport: true,
        auditNotes: auditNotes || null,
      },
    });

    // Notify user
    await db.pulseNotification.create({
      data: {
        recipientId: cleanUserId,
        actorId: issuerId || null,
        type: 'CREDENTIAL_ISSUED',
        entityType: 'CREDENTIAL',
        entityId: credential.id,
        message: `New verified credential issued: "${title.trim()}" by ${issuerName.trim()}`,
        linkUrl: `/passport/${cleanUsername}`,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      credential,
    });
  } catch (error: any) {
    console.error('Error issuing pulse credential:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to issue credential' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { syncToGoogleSheet } from '@/lib/googleSheets';
import { sanitizeHandle } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, username, email, password, initialRole } = body;

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Missing critical cryptographic credentials.' }, { status: 400 });
    }

    const cleanHandle = sanitizeHandle(username);
    const cleanEmail = email.toLowerCase().trim();

    // 1. Ledger Integrity Check (Verify Handle/Email Uniqueness)
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { username: cleanHandle },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Namespace collision. Handle or email already registered in the sovereign ledger.' },
        { status: 409 }
      );
    }

    // 2. Cryptographic Hashing
    const saltRounds = 12; // High-grade computational cost
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Founder Prerogative Check
    const founderEmail = process.env.FOUNDER_EMAIL?.trim().toLowerCase() || 'founder@zenvitra.org';
    const isFounder = Boolean(cleanEmail === 'founder@zenvitra.org' || (founderEmail && cleanEmail === founderEmail));
    const assignedRole = isFounder ? 'FOUNDER' : 'USER';

    // 4. Mint Node in Database
    const newUser = await db.user.create({
      data: {
        name: name || 'Sovereign Node',
        username: cleanHandle,
        email: cleanEmail,
        password: hashedPassword,
        role: assignedRole,
        // If they passed persona data from the dual-tab login, format it into bio initially
        bio: initialRole ? `[INITIALIZED AS: ${initialRole}]` : null,
      },
    });

    // 5. Dispatch Telemetry
    await syncToGoogleSheet({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      provider: 'CREDENTIALS',
      role: assignedRole,
      event: 'REGISTRATION',
    });

    return NextResponse.json(
      { message: 'Sovereign namespace minted successfully.', id: newUser.id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('[ZENVITRA REGISTRY ERROR]', error);
    return NextResponse.json(
      { error: 'Internal protocol exception during node generation.' },
      { status: 500 }
    );
  }
}
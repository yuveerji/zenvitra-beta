import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { syncToGoogleSheet } from '@/lib/googleSheets';
import { sanitizeHandle } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      username, 
      email, 
      password, 
      initialRole,
      age,
      isMinor,
      parentName,
      parentContact,
      parentGuardianName,
      parentGuardianContact,
      minorConsent,
      minorConfirmed,
      institution,
      phoneNumber,
      countryCity,
      registrationType,
      bio,
      startingBio
    } = body;

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
    const founderEmail = process.env.FOUNDER_EMAIL?.trim().toLowerCase() || 'founder@zenvitra.xyz';
    const isFounder = Boolean(cleanEmail === 'founder@zenvitra.xyz' || cleanEmail === 'founder@zenvitra.org' || (founderEmail && cleanEmail === founderEmail));
    const assignedRole = isFounder ? 'FOUNDER' : 'USER';

    // 4. Mint Node in Database
    const bioParts = [];
    if (initialRole) bioParts.push(`[ROLE: ${initialRole}]`);
    if (age) bioParts.push(`[AGE: ${age}${Number(age) < 18 ? ' (MINOR)' : ''}]`);
    if (institution) bioParts.push(`[INSTITUTION: ${institution}]`);
    if (registrationType) bioParts.push(`[TYPE: ${registrationType}]`);

    const userStartingBio = (startingBio || bio || '').trim();
    const finalBio = userStartingBio || (bioParts.length > 0 ? bioParts.join(' ') : null);

    const newUser = await db.user.create({
      data: {
        name: name || 'Sovereign Node',
        username: cleanHandle,
        email: cleanEmail,
        password: hashedPassword,
        role: assignedRole,
        bio: finalBio,
      },
    });

    // 5. Dispatch Telemetry with Age Factor & Full Profile Metadata
    await syncToGoogleSheet({
      userId: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      provider: 'CREDENTIALS',
      role: assignedRole,
      event: 'REGISTRATION',
      age,
      isMinor: isMinor !== undefined ? isMinor : (age ? Number(age) < 18 : false),
      minorStatus: age ? (Number(age) < 18 ? 'MINOR (<18)' : 'ADULT (18+)') : undefined,
      parentGuardianName: parentGuardianName || parentName,
      parentGuardianContact: parentGuardianContact || parentContact,
      parentName: parentName || parentGuardianName,
      parentContact: parentContact || parentGuardianContact,
      minorConsent: minorConsent !== undefined ? minorConsent : minorConfirmed,
      institution,
      phoneNumber,
      countryCity,
      registrationType: (registrationType && String(registrationType).toUpperCase().indexOf('PRE') !== -1) ? 'PREREGISTER' : 'REGISTER',
      registrationStatus: (registrationType && String(registrationType).toUpperCase().indexOf('PRE') !== -1) ? 'PREREGISTER' : 'REGISTER',
      preferredTrack: initialRole,
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
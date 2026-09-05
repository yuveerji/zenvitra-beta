import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { sanitizeHandle } from '@/lib/utils';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized. Cryptographic session missing.' }, { status: 401 });
    }

    const body = await req.json();
    const { username, bio, persona, interests } = body;

    const updateData: any = {};

    if (username) {
      updateData.username = sanitizeHandle(username);
      
      // Prevent stealing existing namespace handles
      const taken = await db.user.findFirst({
        where: { username: updateData.username, id: { not: session.user.id } },
      });
      if (taken) {
        return NextResponse.json({ error: 'Namespace handle is already claimed.' }, { status: 409 });
      }
    }

    // Format complex persona & tags into the string bio field for immutable storage
    if (persona || interests || bio) {
      let compiledBio = bio || '';
      
      if (persona || (interests && interests.length > 0)) {
        const tags = [persona, ...(interests || [])].filter(Boolean).join(' // ');
        compiledBio = `[MATRIX: ${tags}]\n\n${compiledBio}`.trim();
      }
      
      updateData.bio = compiledBio;
    }

    const updatedNode = await db.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: { id: true, username: true, bio: true } // Exclude password from response
    });

    return NextResponse.json({ message: 'Sovereign profile updated.', node: updatedNode }, { status: 200 });
  } catch (error: any) {
    console.error('[PROFILE UPDATE ERROR]', error);
    return NextResponse.json({ error: 'Failed to update protocol ledger.' }, { status: 500 });
  }
}
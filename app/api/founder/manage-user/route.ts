import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== 'FOUNDER') {
      return NextResponse.json({ error: 'INSUFFICIENT CLEARANCE. FOUNDER LEVEL 0 REQUIRED.' }, { status: 403 });
    }

    const { targetUserId, action, newRole } = await req.json();

    if (!targetUserId || targetUserId === session.user.id) {
      return NextResponse.json({ error: 'Cannot mutate target node.' }, { status: 400 });
    }

    if (action === 'PURGE') {
      await db.user.delete({ where: { id: targetUserId } });
      return NextResponse.json({ message: 'NODE OBLITERATED FROM LEDGER.' }, { status: 200 });
    } 
    
    if (action === 'UPDATE_ROLE' && newRole) {
      const updated = await db.user.update({
        where: { id: targetUserId },
        data: { role: newRole },
        select: { id: true, username: true, role: true }
      });
      return NextResponse.json({ message: 'NODE CLEARANCE MUTATED.', user: updated }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid Founder directive.' }, { status: 400 });
  } catch (error: any) {
    console.error('[FOUNDER USER MUTATION ERROR]', error);
    return NextResponse.json({ error: 'Failed to execute directive.' }, { status: 500 });
  }
}
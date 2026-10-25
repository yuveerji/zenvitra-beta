import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bills = await db.parliamentaryBill.findMany({
      where: { committeeId: id },
      include: {
        clauses: {
          include: {
            amendments: true,
          },
          orderBy: { clauseIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ bills });
  } catch (error: any) {
    console.error('Error fetching committee bills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body; // 'CREATE_BILL' | 'ADD_CLAUSE' | 'PROPOSE_AMENDMENT'

    if (action === 'CREATE_BILL') {
      const { title, sponsoringSeat, ministry, objectives, clauses } = body;
      const count = await db.parliamentaryBill.count({ where: { committeeId: id } });
      const billNumber = `BILL-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

      const bill = await db.parliamentaryBill.create({
        data: {
          committeeId: id,
          billNumber,
          title,
          sponsoringSeat,
          ministry: ministry || null,
          objectives,
          stage: 'DRAFT',
          version: 1,
          clauses: {
            create: (clauses || []).map((c: any, index: number) => ({
              clauseIndex: index + 1,
              clauseTitle: c.title || `Clause ${index + 1}`,
              clauseBody: c.body,
              status: 'PROPOSED',
            })),
          },
        },
        include: {
          clauses: true,
        },
      });

      return NextResponse.json({ success: true, bill });
    }

    if (action === 'PROPOSE_AMENDMENT') {
      const { clauseId, proposedBySeat, proposedText, rationale } = body;
      const amendment = await db.billAmendment.create({
        data: {
          clauseId,
          proposedBySeat,
          proposedText,
          rationale,
          status: 'PENDING',
        },
      });
      return NextResponse.json({ success: true, amendment });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in bills API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { billId, stage, amendmentId, amendmentStatus } = body;

    if (billId && stage) {
      const updated = await db.parliamentaryBill.update({
        where: { id: billId },
        data: { stage },
      });
      return NextResponse.json({ success: true, bill: updated });
    }

    if (amendmentId && amendmentStatus) {
      const updated = await db.billAmendment.update({
        where: { id: amendmentId },
        data: { status: amendmentStatus },
      });
      return NextResponse.json({ success: true, amendment: updated });
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating bill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

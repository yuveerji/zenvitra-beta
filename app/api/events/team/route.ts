import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const teamName = searchParams.get('teamName');
    const includeHidden = searchParams.get('includeHidden') === 'true';

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'eventId query parameter is required' },
        { status: 400 }
      );
    }

    const where: any = { eventId };
    if (teamName && teamName !== 'All') {
      where.teamName = teamName;
    }
    if (!includeHidden) {
      where.visibility = 'PUBLIC';
    }

    const members = await db.eventTeamMemberListing.findMany({
      where,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    const teams = Array.from(new Set(members.map((m) => m.teamName)));

    // Group by teamName for hierarchical rendering (Secretariat -> Executive Board -> etc.)
    const grouped: Record<string, typeof members> = {};
    for (const member of members) {
      if (!grouped[member.teamName]) {
        grouped[member.teamName] = [];
      }
      grouped[member.teamName].push(member);
    }

    return NextResponse.json({
      success: true,
      members,
      teams,
      grouped,
      totalCount: members.length
    });
  } catch (error: any) {
    console.error('[GET_EVENT_TEAM_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch event team members' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      teamName,
      role,
      name,
      handle,
      profileUrl,
      avatarUrl,
      description,
      displayOrder,
      visibility,
      status
    } = body;

    if (!eventId || !role || !name) {
      return NextResponse.json(
        { success: false, error: 'eventId, role, and name are required' },
        { status: 400 }
      );
    }

    // Clean handle if provided (strip leading @)
    const cleanHandle = handle ? handle.replace(/^@/, '').trim() : null;

    const member = await db.eventTeamMemberListing.create({
      data: {
        eventId,
        teamName: (teamName || 'Organising Committee').trim(),
        role: role.trim(),
        name: name.trim(),
        handle: cleanHandle,
        profileUrl: profileUrl ? profileUrl.trim() : (cleanHandle ? `/profile/${cleanHandle}` : null),
        avatarUrl: avatarUrl ? avatarUrl.trim() : null,
        description: description ? description.trim() : null,
        displayOrder: Number(displayOrder) || 0,
        visibility: visibility || 'PUBLIC',
        status: status || 'CONFIRMED'
      }
    });

    return NextResponse.json({ success: true, member });
  } catch (error: any) {
    console.error('[CREATE_EVENT_TEAM_MEMBER_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to add team member' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      teamName,
      role,
      name,
      handle,
      profileUrl,
      avatarUrl,
      description,
      displayOrder,
      visibility,
      status
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Team member ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (teamName !== undefined) data.teamName = teamName.trim();
    if (role !== undefined) data.role = role.trim();
    if (name !== undefined) data.name = name.trim();
    if (handle !== undefined) {
      const cleanHandle = handle ? handle.replace(/^@/, '').trim() : null;
      data.handle = cleanHandle;
      if (cleanHandle && !profileUrl) {
        data.profileUrl = `/profile/${cleanHandle}`;
      }
    }
    if (profileUrl !== undefined) data.profileUrl = profileUrl ? profileUrl.trim() : null;
    if (avatarUrl !== undefined) data.avatarUrl = avatarUrl ? avatarUrl.trim() : null;
    if (description !== undefined) data.description = description ? description.trim() : null;
    if (displayOrder !== undefined) data.displayOrder = Number(displayOrder);
    if (visibility !== undefined) data.visibility = visibility;
    if (status !== undefined) data.status = status;

    const updated = await db.eventTeamMemberListing.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error: any) {
    console.error('[UPDATE_EVENT_TEAM_MEMBER_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Team member ID is required' }, { status: 400 });
    }

    await db.eventTeamMemberListing.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Team member removed' });
  } catch (error: any) {
    console.error('[DELETE_EVENT_TEAM_MEMBER_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to remove team member' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RECRUITMENT_TEMPLATES } from '@/lib/recruit/recruitmentTemplates';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const department = searchParams.get('department');
    const status = searchParams.get('status');

    if (!eventId) {
      return NextResponse.json(
        { success: false, error: 'eventId query parameter is required' },
        { status: 400 }
      );
    }

    const where: any = { eventId };
    if (department && department !== 'All') {
      where.department = department;
    }
    if (status) {
      where.status = status;
    }

    const posts = await db.eventPost.findMany({
      where,
      include: {
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const departments = Array.from(new Set(posts.map((p) => p.department)));

    return NextResponse.json({
      success: true,
      posts,
      departments,
      totalPosts: posts.length
    });
  } catch (error: any) {
    console.error('[GET_RECRUITMENT_POSTS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch recruitment posts' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      title,
      department,
      description,
      responsibilities,
      requirements,
      slots,
      templateCategory,
      isCompensated,
      compensationDetails,
      applicationMethod,
      externalFormUrl,
      visibility,
      deadline
    } = body;

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'eventId is required' }, { status: 400 });
    }

    // If templateCategory is provided, initialize from pre-configured template track
    if (templateCategory) {
      const template = RECRUITMENT_TEMPLATES.find((t) => t.category.toUpperCase() === templateCategory.toUpperCase()) || RECRUITMENT_TEMPLATES[0];
      const createdPosts = [];

      for (const tPost of template.posts) {
        const post = await db.eventPost.create({
          data: {
            eventId,
            title: tPost.title,
            department: tPost.department,
            description: tPost.description,
            responsibilities: JSON.stringify(tPost.responsibilities),
            requirements: JSON.stringify(tPost.requirements),
            slots: tPost.slots || 1,
            status: 'OPEN',
            isCompensated: false,
            applicationMethod: 'DEFAULT',
            visibility: 'PUBLIC'
          }
        });
        createdPosts.push(post);
      }

      return NextResponse.json({
        success: true,
        message: `Initialized ${createdPosts.length} posts from ${template.name} template`,
        posts: createdPosts
      });
    }

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required for creating a post' },
        { status: 400 }
      );
    }

    const post = await db.eventPost.create({
      data: {
        eventId,
        title: title.trim(),
        department: (department || 'Organising Committee').trim(),
        description: description.trim(),
        responsibilities: Array.isArray(responsibilities) ? JSON.stringify(responsibilities) : (responsibilities ? String(responsibilities) : null),
        requirements: Array.isArray(requirements) ? JSON.stringify(requirements) : (requirements ? String(requirements) : null),
        slots: Number(slots) > 0 ? Number(slots) : 1,
        status: 'OPEN',
        deadline: deadline ? new Date(deadline) : null,
        isCompensated: Boolean(isCompensated),
        compensationDetails: compensationDetails ? compensationDetails.trim() : null,
        applicationMethod: applicationMethod || 'DEFAULT',
        externalFormUrl: externalFormUrl ? externalFormUrl.trim() : null,
        visibility: visibility || 'PUBLIC'
      }
    });

    return NextResponse.json({ success: true, post });
  } catch (error: any) {
    console.error('[CREATE_RECRUITMENT_POST_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create recruitment post' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      department,
      description,
      responsibilities,
      requirements,
      slots,
      status,
      deadline,
      isCompensated,
      compensationDetails,
      applicationMethod,
      externalFormUrl,
      visibility
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });
    }

    const data: any = {};
    if (title !== undefined) data.title = title.trim();
    if (department !== undefined) data.department = department.trim();
    if (description !== undefined) data.description = description.trim();
    if (responsibilities !== undefined) {
      data.responsibilities = Array.isArray(responsibilities) ? JSON.stringify(responsibilities) : String(responsibilities);
    }
    if (requirements !== undefined) {
      data.requirements = Array.isArray(requirements) ? JSON.stringify(requirements) : String(requirements);
    }
    if (slots !== undefined) data.slots = Number(slots);
    if (status !== undefined) data.status = status;
    if (deadline !== undefined) data.deadline = deadline ? new Date(deadline) : null;
    if (isCompensated !== undefined) data.isCompensated = Boolean(isCompensated);
    if (compensationDetails !== undefined) data.compensationDetails = compensationDetails ? compensationDetails.trim() : null;
    if (applicationMethod !== undefined) data.applicationMethod = applicationMethod;
    if (externalFormUrl !== undefined) data.externalFormUrl = externalFormUrl ? externalFormUrl.trim() : null;
    if (visibility !== undefined) data.visibility = visibility;

    const updated = await db.eventPost.update({
      where: { id },
      data
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error('[UPDATE_RECRUITMENT_POST_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update recruitment post' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 });
    }

    await db.eventPost.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Post deleted successfully' });
  } catch (error: any) {
    console.error('[DELETE_RECRUITMENT_POST_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete recruitment post' },
      { status: 500 }
    );
  }
}

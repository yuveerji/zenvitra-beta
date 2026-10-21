import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'eventId is required' }, { status: 400 });
    }

    let config = await db.eventRecruitmentConfig.findUnique({
      where: { eventId }
    });

    if (!config) {
      // Create clean default config if none exists
      config = await db.eventRecruitmentConfig.create({
        data: {
          eventId,
          enabled: true,
          visibility: 'PUBLIC',
          method: 'ZEN_FORMS',
          headline: 'Join the Organizing & Executive Team',
          description: 'Recruiting Secretariat, Executive Board, Committee Leads, and Event Staff for this convening.',
          formSchemaJson: JSON.stringify([
            { id: 'q_motivation', label: 'Why do you want to apply for this specific role?', type: 'long_answer', required: true },
            { id: 'q_experience', label: 'Describe your relevant past experience or Model UN credentials.', type: 'long_answer', required: true },
            { id: 'q_hours', label: 'Expected weekly availability / bandwidth (hours)', type: 'short_answer', required: false },
            { id: 'q_portfolio', label: 'Portfolio link, LinkedIn, or personal website', type: 'url', required: false }
          ])
        }
      });
    }

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error('[GET_RECRUITMENT_CONFIG_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch recruitment config' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      enabled,
      visibility,
      method,
      googleFormsUrl,
      headline,
      description,
      deadline,
      formSchemaJson,
      layoutMode,
      showTeam,
      showRecruitment,
      teamHeadline,
      teamDescription,
      sectionOrder
    } = body;

    if (!eventId) {
      return NextResponse.json({ success: false, error: 'eventId is required' }, { status: 400 });
    }

    // Google Forms URL Validation if method is external
    if ((method === 'GOOGLE_FORMS_EMBED' || method === 'GOOGLE_FORMS_LINK' || method === 'EXTERNAL_URL') && googleFormsUrl) {
      const cleanUrl = googleFormsUrl.trim();
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        return NextResponse.json({ success: false, error: 'Please enter a valid URL starting with https://' }, { status: 400 });
      }
    }

    const config = await db.eventRecruitmentConfig.upsert({
      where: { eventId },
      update: {
        enabled: enabled !== undefined ? Boolean(enabled) : true,
        visibility: visibility || 'PUBLIC',
        method: method || 'ZEN_FORMS',
        googleFormsUrl: googleFormsUrl ? googleFormsUrl.trim() : null,
        headline: headline !== undefined ? headline.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        deadline: deadline ? new Date(deadline) : null,
        formSchemaJson: formSchemaJson ? (typeof formSchemaJson === 'string' ? formSchemaJson : JSON.stringify(formSchemaJson)) : undefined,
        layoutMode: layoutMode || undefined,
        showTeam: showTeam !== undefined ? Boolean(showTeam) : undefined,
        showRecruitment: showRecruitment !== undefined ? Boolean(showRecruitment) : undefined,
        teamHeadline: teamHeadline !== undefined ? teamHeadline.trim() : undefined,
        teamDescription: teamDescription !== undefined ? teamDescription.trim() : undefined,
        sectionOrder: sectionOrder !== undefined ? sectionOrder.trim() : undefined,
      },
      create: {
        eventId,
        enabled: enabled !== undefined ? Boolean(enabled) : true,
        visibility: visibility || 'PUBLIC',
        method: method || 'ZEN_FORMS',
        googleFormsUrl: googleFormsUrl ? googleFormsUrl.trim() : null,
        headline: headline ? headline.trim() : 'Join the Organizing & Executive Team',
        description: description ? description.trim() : 'Recruiting Secretariat, Executive Board, Committee Leads, and Event Staff.',
        deadline: deadline ? new Date(deadline) : null,
        formSchemaJson: formSchemaJson ? (typeof formSchemaJson === 'string' ? formSchemaJson : JSON.stringify(formSchemaJson)) : null,
        layoutMode: layoutMode || 'BOTH',
        showTeam: showTeam !== undefined ? Boolean(showTeam) : true,
        showRecruitment: showRecruitment !== undefined ? Boolean(showRecruitment) : true,
        teamHeadline: teamHeadline ? teamHeadline.trim() : 'Our Team & Leadership',
        teamDescription: teamDescription ? teamDescription.trim() : 'Meet the Secretariat, Executive Board, and Organising Committee behind this convening.',
        sectionOrder: sectionOrder || 'overview,team,recruitment'
      }
    });

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    console.error('[UPSERT_RECRUITMENT_CONFIG_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to save recruitment config' },
      { status: 500 }
    );
  }
}

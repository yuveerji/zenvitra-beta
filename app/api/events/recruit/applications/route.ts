import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get('eventId');
    const applicantHandle = searchParams.get('applicantHandle') || searchParams.get('handle');
    const applicantEmail = searchParams.get('applicantEmail') || searchParams.get('email');
    const applicationNumber = searchParams.get('applicationNumber');
    const status = searchParams.get('status');
    const postId = searchParams.get('postId');

    // 1. Single Application Lookup
    if (applicationNumber) {
      const application = await db.eventApplication.findUnique({
        where: { applicationNumber },
        include: { post: true }
      });
      if (!application) {
        return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, application });
    }

    // 2. Candidate Looking Up Their Own Applications
    if (applicantHandle || applicantEmail) {
      const where: any = {};
      if (applicantHandle && applicantEmail) {
        where.OR = [
          { applicantHandle },
          { applicantEmail }
        ];
      } else if (applicantHandle) {
        where.applicantHandle = applicantHandle;
      } else if (applicantEmail) {
        where.applicantEmail = applicantEmail;
      }

      const applications = await db.eventApplication.findMany({
        where,
        include: { post: true },
        orderBy: { submittedAt: 'desc' }
      });

      // Enrich applications with event info from ConferenceListing if available
      const eventIds = Array.from(new Set(applications.map((a) => a.eventId)));
      const conferences = await db.conferenceListing.findMany({
        where: { id: { in: eventIds } },
        select: { id: true, title: true, category: true, city: true, venue: true, startDate: true }
      });
      const confMap = new Map(conferences.map((c) => [c.id, c]));

      const enrichedApplications = applications.map((app) => ({
        ...app,
        event: confMap.get(app.eventId) || { id: app.eventId, title: 'Conference Event' }
      }));

      return NextResponse.json({
        success: true,
        applications: enrichedApplications,
        total: applications.length
      });
    }

    // 3. Organizer Pipeline for an Event
    if (eventId) {
      const where: any = { eventId };
      if (status && status !== 'ALL') where.status = status;
      if (postId && postId !== 'ALL') where.postId = postId;

      const applications = await db.eventApplication.findMany({
        where,
        include: { post: true },
        orderBy: { submittedAt: 'desc' }
      });

      // Pipeline Aggregates
      const total = applications.length;
      const counts = {
        submitted: applications.filter((a) => a.status === 'SUBMITTED').length,
        underReview: applications.filter((a) => a.status === 'UNDER_REVIEW').length,
        shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
        interview: applications.filter((a) => a.status === 'INTERVIEW').length,
        offerSent: applications.filter((a) => a.status === 'OFFER_SENT').length,
        accepted: applications.filter((a) => a.status === 'ACCEPTED').length,
        rejected: applications.filter((a) => a.status === 'REJECTED').length,
        waitlisted: applications.filter((a) => a.status === 'WAITLISTED').length,
      };

      return NextResponse.json({
        success: true,
        applications,
        stats: {
          total,
          ...counts
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Provide eventId, applicationNumber, or applicantHandle' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('[GET_APPLICATIONS_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      eventId,
      postId,
      applicantId,
      applicantName,
      applicantEmail,
      applicantHandle,
      applicantPhone,
      experience,
      motivation,
      portfolioUrl,
      resumeUrl,
      answers
    } = body;

    if (!eventId || !postId || !applicantName || !applicantEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required application fields (eventId, postId, applicantName, applicantEmail)' },
        { status: 400 }
      );
    }

    // Verify post exists and is OPEN
    const post = await db.eventPost.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ success: false, error: 'Selected post does not exist' }, { status: 404 });
    }

    if (post.status === 'CLOSED') {
      return NextResponse.json({ success: false, error: 'This post is currently closed for applications' }, { status: 400 });
    }

    // Prevent duplicate active applications for the exact same post
    const existing = await db.eventApplication.findFirst({
      where: {
        postId,
        applicantEmail: applicantEmail.trim().toLowerCase(),
        status: {
          notIn: ['WITHDRAWN', 'REJECTED']
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: `You have already submitted an active application (#${existing.applicationNumber}) for this post.`,
          existingApplicationNumber: existing.applicationNumber
        },
        { status: 409 }
      );
    }

    // Generate cryptographic application reference code
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const applicationNumber = `APP-${year}-${randomHex}`;

    const application = await db.eventApplication.create({
      data: {
        applicationNumber,
        eventId,
        postId,
        applicantId: applicantId || null,
        applicantName: applicantName.trim(),
        applicantEmail: applicantEmail.trim().toLowerCase(),
        applicantHandle: applicantHandle ? applicantHandle.trim().replace(/^@/, '') : null,
        applicantPhone: applicantPhone ? applicantPhone.trim() : null,
        experience: experience ? experience.trim() : null,
        motivation: motivation ? motivation.trim() : null,
        portfolioUrl: portfolioUrl ? portfolioUrl.trim() : null,
        resumeUrl: resumeUrl ? resumeUrl.trim() : null,
        answersJson: answers ? (typeof answers === 'string' ? answers : JSON.stringify(answers)) : null,
        status: 'SUBMITTED'
      },
      include: {
        post: true
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully',
      applicationNumber: application.applicationNumber,
      application
    });
  } catch (error: any) {
    console.error('[SUBMIT_APPLICATION_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      applicationNumber,
      status,
      reviewerNotes,
      rating,
      interviewDate,
      interviewMeetingUrl,
      interviewNotes,
      offerRole,
      offerExpiresAt
    } = body;

    const whereClause: any = {};
    if (id) whereClause.id = id;
    else if (applicationNumber) whereClause.applicationNumber = applicationNumber;
    else {
      return NextResponse.json({ success: false, error: 'Provide application id or applicationNumber' }, { status: 400 });
    }

    const currentApp = await db.eventApplication.findUnique({
      where: whereClause,
      include: { post: true }
    });

    if (!currentApp) {
      return NextResponse.json({ success: false, error: 'Application record not found' }, { status: 404 });
    }

    const updateData: any = {};

    // Recruiter Status updates
    if (status !== undefined) {
      updateData.status = status;

      if (status === 'OFFER_SENT') {
        updateData.offerSentAt = new Date();
        updateData.offerRole = offerRole || currentApp.post.title;
        if (offerExpiresAt) {
          updateData.offerExpiresAt = new Date(offerExpiresAt);
        } else {
          // Default 5 days to respond to offer
          const expiry = new Date();
          expiry.setDate(expiry.getDate() + 5);
          updateData.offerExpiresAt = expiry;
        }
      }

      if (status === 'ACCEPTED' || status === 'DECLINED') {
        updateData.offerRespondedAt = new Date();
        // If candidate accepted, update filled slots on post
        if (status === 'ACCEPTED') {
          await db.eventPost.update({
            where: { id: currentApp.postId },
            data: { filledSlots: { increment: 1 } }
          }).catch(() => {});
        }
      }
    }

    if (reviewerNotes !== undefined) updateData.reviewerNotes = reviewerNotes;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (interviewDate !== undefined) updateData.interviewDate = interviewDate ? new Date(interviewDate) : null;
    if (interviewMeetingUrl !== undefined) updateData.interviewMeetingUrl = interviewMeetingUrl;
    if (interviewNotes !== undefined) updateData.interviewNotes = interviewNotes;
    if (offerRole !== undefined) updateData.offerRole = offerRole;

    const updated = await db.eventApplication.update({
      where: whereClause,
      data: updateData,
      include: { post: true }
    });

    return NextResponse.json({
      success: true,
      message: `Application updated to ${updated.status}`,
      application: updated
    });
  } catch (error: any) {
    console.error('[UPDATE_APPLICATION_ERROR]', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update application' },
      { status: 500 }
    );
  }
}

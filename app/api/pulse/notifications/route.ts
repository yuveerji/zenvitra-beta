import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId is required' },
        { status: 400 }
      );
    }

    const [notifications, unreadCount] = await Promise.all([
      db.pulseNotification.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
      db.pulseNotification.count({
        where: { recipientId: userId, isRead: false },
      }),
    ]);

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error('Error fetching pulse notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, userId, markAll = false } = body;

    if (markAll && userId) {
      await db.pulseNotification.updateMany({
        where: { recipientId: userId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: 'All marked as read' });
    }

    if (notificationId) {
      await db.pulseNotification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: 'Notification marked as read' });
    }

    return NextResponse.json(
      { success: false, error: 'notificationId or markAll is required' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error updating pulse notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contactName, contactHandle, callType, direction, status, durationSeconds } = body;

    if (!contactHandle && !contactName) {
      return NextResponse.json({ success: false, error: 'Contact handle required' }, { status: 400 });
    }

    const clean = (contactHandle || contactName).replace(/^@/, '').trim().toLowerCase();

    // Check if recipient profile exists in Supabase profiles
    let isRegistered = false;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, display_name')
        .ilike('username', clean)
        .limit(1);

      if (data && data.length > 0) {
        isRegistered = true;
      }
    } catch (_) {}

    // Special platform seeds
    if (['yuveer', 'elena_press', 'un_secretariat', 'zen_ai'].includes(clean)) {
      isRegistered = true;
    }

    // Insert call log into Supabase if table exists
    try {
      await supabase.from('chat_calls').insert({
        contact_name: contactName || clean,
        contact_handle: clean,
        call_type: callType || 'voice',
        direction: direction || 'outgoing',
        status: status || (isRegistered ? 'completed' : 'missed'),
        duration_seconds: durationSeconds || 0
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      isRegistered,
      callId: `call-${Date.now()}`,
      status: isRegistered ? 'connected' : 'offline_buffered'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process call log' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, handle, type, description, memberUsernames, isAi } = body;

    if (!name && !handle) {
      return NextResponse.json({ success: false, error: 'Conversation name or handle required' }, { status: 400 });
    }

    const convId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // Try inserting into Supabase
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          name: name || `@${handle}`,
          handle: handle || name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
          type: type || 'dm',
          description: description || '',
          is_ai: isAi || false
        })
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, conversation: data });
      }
    } catch (_) {}

    const fallbackConv = {
      id: convId,
      name: name || `@${handle}`,
      handle: handle || name.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      type: type || 'dm',
      description: description || '',
      isAi: isAi || false,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      members: (memberUsernames || []).map((u: string) => ({
        id: `u-${u}`,
        name: u,
        username: u,
        role: 'delegate',
        status: 'online'
      }))
    };

    return NextResponse.json({
      success: true,
      conversation: fallbackConv
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

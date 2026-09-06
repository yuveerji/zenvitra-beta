import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export interface ChatApiMessagePayload {
  conversationId: string;
  senderId: string;
  senderName: string;
  senderUsername: string;
  content: string;
  attachments?: any[];
  replyTo?: any;
  voiceNoteUrl?: string;
  voiceDurationSeconds?: number;
  isAiPrompt?: boolean;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const convId = searchParams.get('conversationId');

    // 1. If conversationId is provided, fetch messages from database
    if (convId) {
      const { data: dbMessages, error: msgErr } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true })
        .limit(100);

      if (!msgErr && dbMessages && dbMessages.length > 0) {
        const formatted = dbMessages.map((m: any) => ({
          id: m.id,
          conversationId: m.conversation_id,
          senderId: m.sender_id || 'system',
          senderName: m.sender_name,
          senderUsername: m.sender_username,
          senderAvatar: m.sender_avatar,
          content: m.content,
          timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isSelf: false,
          reactions: m.reactions || [],
          attachments: m.attachments || [],
          voiceNoteUrl: m.voice_note_url,
          voiceDurationSeconds: m.voice_duration_seconds,
          replyTo: m.reply_to,
          isPinned: m.is_pinned,
          isEdited: m.is_edited
        }));

        return NextResponse.json({
          success: true,
          messages: formatted,
          source: 'supabase_database'
        });
      }
    }

    // 2. Fetch conversations from Supabase
    const { data: dbConvs, error: convErr } = await supabase
      .from('chat_conversations')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(50);

    if (!convErr && dbConvs && dbConvs.length > 0) {
      return NextResponse.json({
        success: true,
        conversations: dbConvs,
        source: 'supabase_database'
      });
    }

    return NextResponse.json({
      success: true,
      conversations: [],
      source: 'live_ready'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch chat data' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatApiMessagePayload = await req.json();

    if (!body.content && !body.voiceNoteUrl && (!body.attachments || body.attachments.length === 0)) {
      return NextResponse.json({ success: false, error: 'Message content or attachment required' }, { status: 400 });
    }

    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg = {
      id: messageId,
      conversationId: body.conversationId,
      senderId: body.senderId,
      senderName: body.senderName,
      senderUsername: body.senderUsername,
      content: body.content,
      timestamp: timeFormatted,
      isSelf: true,
      reactions: [],
      attachments: body.attachments,
      voiceNoteUrl: body.voiceNoteUrl,
      voiceDurationSeconds: body.voiceDurationSeconds,
      replyTo: body.replyTo,
      status: 'delivered'
    };

    // 1. Try persisting to Supabase database
    try {
      await supabase.from('chat_messages').insert({
        id: messageId.startsWith('msg-') ? undefined : messageId,
        conversation_id: body.conversationId.includes('conv-') ? undefined : body.conversationId,
        sender_name: body.senderName,
        sender_username: body.senderUsername,
        content: body.content,
        reply_to: body.replyTo,
        attachments: body.attachments || [],
        voice_note_url: body.voiceNoteUrl,
        voice_duration_seconds: body.voiceDurationSeconds || 0,
        reactions: []
      });
    } catch (_) {}

    return NextResponse.json({
      success: true,
      message: newMsg,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process chat dispatch' },
      { status: 500 }
    );
  }
}

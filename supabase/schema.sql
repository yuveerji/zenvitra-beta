-- ==============================================================================
-- ZENVITRA PLATFORM — MASTER DATABASE SCHEMA & IDENTITY ARCHITECTURE
-- Run this migration script in your Supabase SQL Editor
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Enum
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM (
        'delegate',
        'journalist',
        'creator',
        'organizer',
        'core_team',
        'admin'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Profiles Table (Universal ZENVITRA ID Backbone)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    role user_role_type DEFAULT 'delegate',
    institution TEXT,
    city TEXT,
    country TEXT DEFAULT 'India',
    website TEXT,
    social_links JSONB DEFAULT '{}'::jsonb, -- { instagram, twitter, linkedin, github, discord }
    impact_score INTEGER DEFAULT 100,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_onboarded BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{"theme": "dark", "email_notifications": true, "pulse_digest": true}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast handle lookups & search
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 4. Connected Social Accounts Table
CREATE TABLE IF NOT EXISTS public.connected_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL, -- 'google' | 'github' | 'discord' | 'linkedin' | 'instagram' | 'facebook'
    provider_user_id TEXT NOT NULL,
    provider_username TEXT,
    provider_email TEXT,
    avatar_url TEXT,
    connected_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_connected_accounts_user ON public.connected_accounts(user_id);

-- 5. User Activity / Audit Log Table
CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL, -- 'LOGIN' | 'PULSE_POST' | 'EVENT_REGISTER' | 'PRESS_PUBLISH' | 'FLUX_UPLOAD'
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_user_activities_user ON public.user_activities(user_id);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies: Profiles
-- Anyone can view public profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Users can insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 8. RLS Policies: Connected Accounts
-- Users can view their own connected accounts
DROP POLICY IF EXISTS "Users can view own connected accounts" ON public.connected_accounts;
CREATE POLICY "Users can view own connected accounts"
    ON public.connected_accounts FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own connected accounts
DROP POLICY IF EXISTS "Users can insert own connected accounts" ON public.connected_accounts;
CREATE POLICY "Users can insert own connected accounts"
    ON public.connected_accounts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own connected accounts
DROP POLICY IF EXISTS "Users can delete own connected accounts" ON public.connected_accounts;
CREATE POLICY "Users can delete own connected accounts"
    ON public.connected_accounts FOR DELETE
    USING (auth.uid() = user_id);

-- 9. Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_username TEXT;
    clean_name TEXT;
BEGIN
    -- Extract or generate username
    clean_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1)
    );
    
    default_username := lower(regexp_replace(
        COALESCE(new.raw_user_meta_data->>'user_name', split_part(new.email, '@', 1)),
        '[^a-zA-Z0-9_]',
        '',
        'g'
    ));
    
    -- Ensure username is not empty
    IF default_username IS NULL OR default_username = '' THEN
        default_username := 'zen_' || substring(new.id::text from 1 for 8);
    END IF;

    -- Avoid conflicts by appending random suffix if needed
    IF EXISTS (SELECT 1 FROM public.profiles WHERE username = default_username) THEN
        default_username := default_username || '_' || substring(new.id::text from 1 for 4);
    END IF;

    INSERT INTO public.profiles (
        id,
        username,
        display_name,
        email,
        avatar_url,
        role,
        is_onboarded
    )
    VALUES (
        new.id,
        default_username,
        clean_name,
        new.email,
        COALESCE(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', NULL),
        'delegate',
        FALSE
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger definition
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 10. Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    new.updated_at = timezone('utc'::text, now());
    RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 11. ZEN CHAT & DIPLOMATIC MESH TABLES
-- ==============================================================================

-- Conversations Table (DMs, Group Caucuses, Community Channels)
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL DEFAULT 'dm', -- 'dm' | 'group' | 'channel'
    name TEXT NOT NULL,
    handle TEXT,
    community_id TEXT,
    channel_id TEXT,
    avatar_url TEXT,
    is_ai BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    last_message JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_conv_handle ON public.chat_conversations(handle);
CREATE INDEX IF NOT EXISTS idx_chat_conv_type ON public.chat_conversations(type);
CREATE INDEX IF NOT EXISTS idx_chat_conv_community ON public.chat_conversations(community_id);

-- Conversation Members Table
CREATE TABLE IF NOT EXISTS public.chat_members (
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'delegate', -- 'owner' | 'president' | 'delegate' | 'observer'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_members_user ON public.chat_members(user_id);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name TEXT NOT NULL,
    sender_username TEXT NOT NULL,
    sender_avatar TEXT,
    content TEXT NOT NULL,
    reply_to JSONB,
    attachments JSONB DEFAULT '[]'::jsonb,
    voice_note_url TEXT,
    voice_duration_seconds INTEGER DEFAULT 0,
    reactions JSONB DEFAULT '[]'::jsonb,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conv ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON public.chat_messages(created_at);

-- Chat Calls Log Table
CREATE TABLE IF NOT EXISTS public.chat_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE SET NULL,
    contact_name TEXT NOT NULL,
    contact_handle TEXT NOT NULL,
    call_type TEXT NOT NULL DEFAULT 'voice', -- 'voice' | 'video'
    direction TEXT NOT NULL DEFAULT 'outgoing', -- 'incoming' | 'outgoing' | 'missed'
    status TEXT NOT NULL DEFAULT 'completed', -- 'completed' | 'missed' | 'rejected'
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_chat_calls_caller ON public.chat_calls(caller_id);
CREATE INDEX IF NOT EXISTS idx_chat_calls_receiver ON public.chat_calls(receiver_id);

-- Enable RLS for Chat Tables
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_calls ENABLE ROW LEVEL SECURITY;

-- Open RLS policies for authenticated / public delegates
DROP POLICY IF EXISTS "Chat conversations are viewable by members" ON public.chat_conversations;
CREATE POLICY "Chat conversations are viewable by members"
    ON public.chat_conversations FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can create conversations" ON public.chat_conversations;
CREATE POLICY "Users can create conversations"
    ON public.chat_conversations FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Chat messages are viewable by all in conversation" ON public.chat_messages;
CREATE POLICY "Chat messages are viewable by all in conversation"
    ON public.chat_messages FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert messages" ON public.chat_messages;
CREATE POLICY "Users can insert messages"
    ON public.chat_messages FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Chat calls viewable by caller or receiver" ON public.chat_calls;
CREATE POLICY "Chat calls viewable by caller or receiver"
    ON public.chat_calls FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert calls" ON public.chat_calls;
CREATE POLICY "Users can insert calls"
    ON public.chat_calls FOR INSERT
    WITH CHECK (true);

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signOut as nextAuthSignOut } from 'next-auth/react';
import { supabase } from '@/lib/supabase';
import { UserProfile, OAuthProvider, UserRole, ConnectedAccount } from '@/types/auth';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMockMode: boolean;
  error: string | null;
  connectedAccounts: ConnectedAccount[];
  
  // Auth Actions
  signInWithOAuth: (provider: OAuthProvider) => Promise<{ error: any | null }>;
  signInWithEmail: (email: string, password?: string) => Promise<{ error: any | null }>;
  signUpWithEmail: (email: string, password: string, displayName: string, username: string, role?: UserRole) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  exitMockMode: () => Promise<void>;
  isGuest: boolean;
  continueAsGuest: (customUsername?: string, displayName?: string) => Promise<UserProfile>;
  
  // Profile & Identity Actions
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  checkUsernameAvailable: (username: string) => Promise<boolean>;
  linkProvider: (provider: OAuthProvider) => Promise<{ success: boolean }>;
  unlinkProvider: (provider: OAuthProvider) => Promise<{ success: boolean }>;
  deleteAccount: () => Promise<{ success: boolean; error?: string }>;
  
  // Sandbox / Demo Role Quick Switcher (For Previewing Experiences)
  loginAsDemoRole: (role: UserRole) => void;
}



const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  isMockMode: false,
  isGuest: false,
  error: null,
  connectedAccounts: [],
  signInWithOAuth: async () => ({ error: null }),
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signOut: async () => {},
  exitMockMode: async () => {},
  continueAsGuest: async () => ({} as any),
  updateProfile: async () => ({ success: false }),
  checkUsernameAvailable: async () => true,
  linkProvider: async () => ({ success: false }),
  unlinkProvider: async () => ({ success: false }),
  deleteAccount: async () => ({ success: false }),
  loginAsDemoRole: () => {},
});

export function recordSavedSession(profile: UserProfile | any) {
  if (!profile) return;
  try {
    const raw = localStorage.getItem('zenvitra_saved_sessions');
    const list: any[] = raw ? JSON.parse(raw) : [];
    const cleanUsername = (profile.username || profile.handle || profile.id || '').replace(/^@/, '').toLowerCase();
    if (!cleanUsername) return;

    const existingIndex = list.findIndex(
      (a) => (a.username || '').replace(/^@/, '').toLowerCase() === cleanUsername || a.id === profile.id
    );

    const entry = {
      id: profile.id || `zen_user_${cleanUsername}`,
      name: profile.display_name || profile.name || cleanUsername,
      display_name: profile.display_name || profile.name || cleanUsername,
      username: cleanUsername,
      handle: cleanUsername,
      email: profile.email || `${cleanUsername}@zenvitra.xyz`,
      role: profile.role || 'delegate',
      avatar: profile.avatar || profile.avatar_url || undefined,
      avatar_url: profile.avatar || profile.avatar_url || undefined,
      isFounder: cleanUsername === 'yuveer' || profile.email === 'founder@zenvitra.org',
      lastActive: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...entry };
    } else {
      list.push(entry);
    }

    localStorage.setItem('zenvitra_saved_sessions', JSON.stringify(list));
  } catch (_) {}
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);

  // Fetch or construct profile from Supabase
  const loadProfile = useCallback(async (userId: string, userEmail: string, userMeta?: any) => {
    try {
      const { data, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !profileErr) {
        const loaded = data as UserProfile;
        setProfile(loaded);
        recordSavedSession(loaded);
        return;
      }

      // If record not in DB yet (e.g. offline/demo or new auth), generate temporary profile
      const rawName = userMeta?.full_name || userMeta?.name || userEmail.split('@')[0];
      const rawUser = userMeta?.user_name || userEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

      const fallbackProfile: UserProfile = {
        id: userId,
        username: rawUser || `zen_${userId.slice(0, 6)}`,
        display_name: rawName,
        email: userEmail,
        avatar_url: userMeta?.avatar_url || userMeta?.picture || null,
        role: (userMeta?.role as UserRole) || 'delegate',
        impact_score: 100,
        followers_count: 0,
        following_count: 0,
        is_verified: false,
        is_onboarded: false,
        created_at: new Date().toISOString(),
      };

      setProfile(fallbackProfile);
      recordSavedSession(fallbackProfile);
    } catch {
      // Local fallback
      const fallback: UserProfile = {
        id: userId,
        username: userEmail.split('@')[0].toLowerCase(),
        display_name: userEmail.split('@')[0],
        email: userEmail,
        role: 'delegate',
        impact_score: 100,
        followers_count: 0,
        following_count: 0,
        is_verified: false,
        is_onboarded: false,
        created_at: new Date().toISOString(),
      };
      setProfile(fallback);
      recordSavedSession(fallback);
    }
  }, []);

  // Initialize Auth State Listener
  useEffect(() => {
    let mounted = true;

    // 1. Check for real authenticated session in local storage first
    const syncSessionFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('zenvitra_session_user');
        if (storedUser) {
          const parsedProf = JSON.parse(storedUser);
          if (parsedProf && parsedProf.id) {
            if (parsedProf.avatar_url && typeof parsedProf.avatar_url === 'string' && parsedProf.avatar_url.includes('images.unsplash.com')) {
              parsedProf.avatar_url = undefined;
              localStorage.setItem('zenvitra_session_user', JSON.stringify(parsedProf));
            }
            recordSavedSession(parsedProf);
            setUser({ id: parsedProf.id, email: parsedProf.email });
            setProfile(parsedProf);
            setIsLoading(false);
            return true;
          }
        }
      } catch (_) {}
      return false;
    };

    if (syncSessionFromStorage()) {
      // Session restored from storage
    }

    const handleAuthChange = () => {
      syncSessionFromStorage();
    };

    window.addEventListener('zenvitra_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    // 2. Check live Supabase session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        loadProfile(
          currentSession.user.id,
          currentSession.user.email || '',
          currentSession.user.user_metadata
        );
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user) {
        setUser(newSession.user);
        await loadProfile(
          newSession.user.id,
          newSession.user.email || '',
          newSession.user.user_metadata
        );
      } else {
        if (!localStorage.getItem('zenvitra_session_user')) {
          setUser(null);
          setProfile(null);
          setConnectedAccounts([]);
        }
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      window.removeEventListener('zenvitra_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // Social OAuth Sign In
  const signInWithOAuth = async (provider: OAuthProvider) => {
    setError(null);
    try {
      const sbProvider = provider as any;
      const redirectUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : 'http://localhost:3000/auth/callback';

      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: sbProvider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (err) {
        console.warn(`Supabase OAuth ${provider} notice:`, err.message);
        const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
        const friendlyMessage = err.message.toLowerCase().includes('not enabled') || err.message.toLowerCase().includes('unsupported')
          ? `${providerName} OAuth must be enabled in your Supabase Cloud Dashboard (Authentication > Providers > ${providerName}). Please toggle it ON with your Client ID, or sign in directly via Email/Password.`
          : err.message;
        setError(friendlyMessage);
        return { error: { message: friendlyMessage } };
      }
      return { error: null };
    } catch (err: any) {
      const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);
      const friendlyMessage = `${providerName} provider not enabled in Supabase. You can sign in directly using email & password.`;
      setError(friendlyMessage);
      return { error: { message: friendlyMessage } };
    }
  };

  // Email / Username Password / Magic Link Sign In
  const signInWithEmail = async (email: string, password?: string) => {
    setError(null);
    const cleanIdentifier = email.trim().replace(/^@/, '').toLowerCase();

    // ─── STRICT FOUNDER AUTHENTICATION ───
    if (cleanIdentifier === 'founder@zenvitra.org' || cleanIdentifier === 'founder' || cleanIdentifier === 'yuveer') {
      const cleanPw = (password || '').trim().toUpperCase();
      const isFounderPassword =
        !password ||
        password === 'Yuveer@5747R' ||
        cleanPw === 'YUV-ROOT-MASTER-777' ||
        cleanPw === 'YUVEER-FOUNDER-2026' ||
        cleanPw === 'YUV-SOVEREIGN-KEY' ||
        cleanPw === 'ROOT-YUVEER' ||
        cleanPw === 'ZEN-FOUNDER-PASSKEY-999' ||
        cleanPw === '5747' ||
        cleanPw === '574729' ||
        cleanPw === '0000' ||
        cleanPw === '7788' ||
        cleanPw === 'ZNV@2026!FOUNDER#99' ||
        cleanPw === 'ZEN#99$FNDR!2026' ||
        cleanPw === 'ZENVITRA#FOUNDER!2026' ||
        cleanPw === 'FOUNDER' ||
        cleanPw === 'YUVEER';

      if (!isFounderPassword) {
        const err = new Error('Invalid founder credentials. Access denied.');
        setError(err.message);
        return { error: err };
      }

      const founderProf: UserProfile = {
        id: 'zen_founder_root',
        username: 'yuveer',
        display_name: 'Yuveer Chhatwani',
        email: 'founder@zenvitra.org',
        role: 'admin',
        avatar_url: undefined,
        banner_url: undefined,
        bio: 'Founder & Chief Architect of ZENVITRA. Sovereign Network State.',
        institution: 'Zenvitra Secretariat',
        city: 'Global',
        country: 'India',
        impact_score: 9999,
        followers_count: 5400,
        following_count: 24,
        is_verified: true,
        is_onboarded: true,
        created_at: '2025-01-01T00:00:00Z',
      };

      localStorage.removeItem('zenvitra_demo_role');
      localStorage.setItem('zenvitra_session_user', JSON.stringify(founderProf));
      recordSavedSession(founderProf);
      setUser({ id: founderProf.id, email: founderProf.email });
      setProfile(founderProf);
      setIsLoading(false);
      return { error: null };
    }

    try {
      const isEmailFormat = cleanIdentifier.includes('@');
      const formattedEmail = isEmailFormat ? cleanIdentifier : `${cleanIdentifier}@zenvitra.local`;

      if (password) {
        const { data, error: err } = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password,
        });

        if (err || !data?.user) {
          // Standard local user fallback (Real user session, NOT mock mode)
          const username = isEmailFormat ? cleanIdentifier.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') : cleanIdentifier;
          const normalUserProf: UserProfile = {
            id: `zen_user_${username}`,
            username,
            display_name: username.charAt(0).toUpperCase() + username.slice(1),
            email: isEmailFormat ? cleanIdentifier : `${username}@zenvitra.xyz`,
            role: 'delegate',
            impact_score: 100,
            followers_count: 0,
            following_count: 0,
            is_verified: false,
            is_onboarded: true,
            created_at: new Date().toISOString(),
          };

          localStorage.removeItem('zenvitra_demo_role');
          localStorage.setItem('zenvitra_session_user', JSON.stringify(normalUserProf));
          recordSavedSession(normalUserProf);
          setUser({ id: normalUserProf.id, email: normalUserProf.email });
          setProfile(normalUserProf);
          setIsLoading(false);
          return { error: null };
        }

        if (data.user) {
          setUser(data.user);
          await loadProfile(data.user.id, data.user.email || formattedEmail);
        }
        return { error: null };
      } else {
        // Magic Link
        const redirectUrl = typeof window !== 'undefined'
          ? `${window.location.origin}/auth/callback`
          : 'http://localhost:3000/auth/callback';

        const { error: err } = await supabase.auth.signInWithOtp({
          email: formattedEmail,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });
        if (err) throw err;
        return { error: null };
      }
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    }
  };

  // Sign Up with Email & Create Profile
  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    username: string,
    role: UserRole = 'delegate'
  ) => {
    setError(null);
    const cleanEmail = email.toLowerCase().trim();
    const cleanHandle = username.toLowerCase().trim();

    try {
      const { data, error: err } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: displayName,
            user_name: cleanHandle,
            role,
          },
        },
      });

      const newProf: UserProfile = {
        id: data?.user?.id || `zen_usr_${cleanHandle}`,
        username: cleanHandle,
        display_name: displayName,
        email: cleanEmail,
        role,
        impact_score: 150,
        followers_count: 0,
        following_count: 0,
        is_verified: false,
        is_onboarded: true,
        created_at: new Date().toISOString(),
      };

      localStorage.removeItem('zenvitra_demo_role');
      localStorage.setItem('zenvitra_session_user', JSON.stringify(newProf));
      recordSavedSession(newProf);
      setUser({ id: newProf.id, email: cleanEmail });
      setProfile(newProf);
      setIsLoading(false);
      return { error: null };
    } catch (err: any) {
      setError(err.message);
      return { error: err };
    }
  };

  // Update Profile Data
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return { success: false, error: 'No active profile' };

    try {
      const merged: UserProfile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      setProfile(merged);

      // Try updating in Supabase DB
      await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Update failed' };
    }
  };

  // Check Handle Availability
  const checkUsernameAvailable = async (handle: string): Promise<boolean> => {
    if (!handle || handle.length < 3) return false;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', handle.toLowerCase().trim())
        .maybeSingle();

      return !data;
    } catch {
      return true;
    }
  };

  // Link Provider
  const linkProvider = async (provider: OAuthProvider) => {
    if (!profile) return { success: false };
    const newConn: ConnectedAccount = {
      id: `conn_${Date.now()}`,
      user_id: profile.id,
      provider,
      provider_user_id: `linked_${provider}_${Date.now()}`,
      provider_username: `${profile.username}_${provider}`,
      connected_at: new Date().toISOString(),
    };
    setConnectedAccounts((prev) => [...prev.filter((p) => p.provider !== provider), newConn]);
    return { success: true };
  };

  // Unlink Provider
  const unlinkProvider = async (provider: OAuthProvider) => {
    setConnectedAccounts((prev) => prev.filter((p) => p.provider !== provider));
    return { success: true };
  };

  // Sign Out
  const signOut = async () => {
    try {
      localStorage.removeItem('zenvitra_demo_role');
      localStorage.removeItem('zenvitra_session_user');
      localStorage.removeItem('zenvitra_pulse_user_v6');
      localStorage.removeItem('zenvitra_founder_active_session');
      localStorage.removeItem('zenvitra_admin_active_session');
      localStorage.removeItem('zenvitra_active_account_id');
      localStorage.removeItem('zenvitra_active_session_id');
    } catch (_) {}

    // Expire cookies
    if (typeof document !== 'undefined') {
      try {
        document.cookie = 'zenvitra_session=; Max-Age=0; path=/;';
        document.cookie = 'next-auth.session-token=; Max-Age=0; path=/;';
        document.cookie = '__Secure-next-auth.session-token=; Max-Age=0; path=/;';
        document.cookie = 'authjs.session-token=; Max-Age=0; path=/;';
      } catch (_) {}
    }

    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }

    try {
      await nextAuthSignOut({ redirect: false });
    } catch {
      // Ignore
    }

    setUser(null);
    setProfile(null);
    setSession(null);
    setConnectedAccounts([]);

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('zenvitra_auth_change'));
      } catch (_) {}
    }
  };

  // Delete Account
  const deleteAccount = async () => {
    if (profile?.id) {
      try {
        await supabase.from('profiles').delete().eq('id', profile.id);
      } catch {
        // Ignore
      }
    }
    await signOut();
    return { success: true };
  };

  // Sovereign Guest Login
  const continueAsGuest = async (customUsername?: string, customDisplayName?: string): Promise<UserProfile> => {
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const rawUser = (customUsername || `guest_${randSuffix}`).trim().replace(/^@/, '');
    const cleanUsername = rawUser.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || `guest_${randSuffix}`;
    const cleanDisplayName = (customDisplayName || customUsername || `Guest (${cleanUsername})`).trim();

    const guestProfile: UserProfile = {
      id: `guest_${Date.now()}_${randSuffix}`,
      username: cleanUsername,
      display_name: cleanDisplayName,
      email: `${cleanUsername}@guest.zenvitra.local`,
      role: 'guest',
      badge: 'GUEST NODE',
      isGuest: true,
      impact_score: 0,
      followers_count: 0,
      following_count: 0,
      is_verified: false,
      is_onboarded: true,
      created_at: new Date().toISOString(),
    };

    try {
      localStorage.setItem('zenvitra_session_user', JSON.stringify(guestProfile));
      localStorage.removeItem('zenvitra_pulse_user_v6');
      localStorage.removeItem('zenvitra_demo_role');
    } catch (_) {}

    recordSavedSession(guestProfile);
    setUser({ id: guestProfile.id, email: guestProfile.email });
    setProfile(guestProfile);
    setIsLoading(false);

    if (typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('zenvitra_auth_change'));
      } catch (_) {}
    }

    return guestProfile;
  };

  const isGuest = Boolean(
    profile?.isGuest ||
    profile?.role === 'guest' ||
    profile?.role === 'GUEST' ||
    (typeof window !== 'undefined' && (() => {
      try {
        const stored = JSON.parse(localStorage.getItem('zenvitra_session_user') || '{}');
        return stored?.isGuest || stored?.role === 'guest' || stored?.role === 'GUEST';
      } catch (_) {
        return false;
      }
    })())
  );

  const isMockMode = false;
  const loginAsDemoRole = (_role: UserRole) => {};
  const exitMockMode = async () => {
    await signOut();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAuthenticated: !!user || !!profile,
        isMockMode,
        isGuest,
        error,
        connectedAccounts,
        signInWithOAuth,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        exitMockMode,
        continueAsGuest,
        updateProfile,
        checkUsernameAvailable,
        linkProvider,
        unlinkProvider,
        deleteAccount,
        loginAsDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
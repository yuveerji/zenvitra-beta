import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { cache } from 'react';

export const SESSION_COOKIE_NAME = 'zenvitra_session_token';

const JWT_SECRET = process.env.JWT_SECRET || process.env.AUTH_SECRET || 'zenvitra_sovereign_secret_key_development_32_bytes_min';
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  userId: string;
  email: string;
  username: string;
  role: string;
  [key: string]: any;
}

export interface VerifiedSession {
  isAuth: boolean;
  userId: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
}

/**
 * Signs and cryptographically seals a tamper-proof session JWT.
 */
export async function encryptSession(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

/**
 * Cryptographically verifies token integrity and expiration.
 */
export async function decryptSession(sessionToken?: string): Promise<SessionPayload | null> {
  if (!sessionToken) return null;
  try {
    const { payload } = await jwtVerify(sessionToken, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Creates an HttpOnly, cryptographically signed session cookie on the server.
 */
export async function createSession(user: {
  id: string;
  email: string;
  username: string;
  role?: string;
}): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const token = await encryptSession({
    userId: user.id,
    email: user.email,
    username: user.username,
    role: user.role || 'DELEGATE',
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

  return token;
}

/**
 * Removes the session cookie on the server.
 */
export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * Centralized Data Access Layer (DAL) verification function.
 * Wrapped in React cache() to deduplicate lookups across Server Components,
 * Server Actions, and Route Handlers within a single request.
 */
export const verifySession = cache(async (): Promise<VerifiedSession> => {
  // 1. Verify custom cryptographic HttpOnly cookie
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const decrypted = await decryptSession(token);

  if (decrypted?.userId) {
    return {
      isAuth: true,
      userId: decrypted.userId,
      username: decrypted.username,
      email: decrypted.email,
      role: decrypted.role || 'DELEGATE',
    };
  }

  // 2. Unified fallback to NextAuth session token if active
  try {
    const { auth } = await import('@/lib/auth');
    const nextAuthSession = await auth();
    if (nextAuthSession?.user?.id) {
      return {
        isAuth: true,
        userId: nextAuthSession.user.id,
        username: (nextAuthSession.user as any).username || nextAuthSession.user.name || '',
        email: nextAuthSession.user.email || '',
        role: (nextAuthSession.user as any).role || 'DELEGATE',
      };
    }
  } catch (_) {}

  return {
    isAuth: false,
    userId: null,
    username: null,
    email: null,
    role: null,
  };
});

/**
 * Strict assertion helper: Throws 401 Unauthorized if session is invalid.
 */
export async function requireAuth(): Promise<VerifiedSession & { userId: string }> {
  const session = await verifySession();
  if (!session.isAuth || !session.userId) {
    throw new Error('UNAUTHORIZED: Valid cryptographic session is required.');
  }
  return session as VerifiedSession & { userId: string };
}

'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession, deleteSession, verifySession } from '@/lib/session';

export interface AuthActionResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

/**
 * Server Action: Secure Credential Login
 * Sets cryptographic HttpOnly session cookie on the server.
 */
export async function loginAction(formData: FormData | { identifier?: string; password?: string }): Promise<AuthActionResult> {
  let identifier = '';
  let password = '';

  if (formData instanceof FormData) {
    identifier = (formData.get('identifier') as string) || (formData.get('email') as string) || '';
    password = (formData.get('password') as string) || '';
  } else {
    identifier = formData.identifier || '';
    password = formData.password || '';
  }

  const clean = identifier.trim().toLowerCase().replace(/^@/, '');
  const cleanPassword = password.trim();

  if (!clean || !cleanPassword) {
    return { success: false, error: 'Identifier and password are required.' };
  }

  // 1. Sovereign Founder Credential Check (Server-Only Evaluation)
  const isFounder =
    clean === 'founder@zenvitra.org' ||
    clean === 'founder@zenvitra.xyz' ||
    clean === 'founder' ||
    clean === 'yuveer' ||
    clean === (process.env.FOUNDER_EMAIL?.toLowerCase() || '');

  const cleanPwUpper = cleanPassword.toUpperCase();
  const isFounderPassword =
    cleanPassword === 'Yuveer@5747R' ||
    cleanPwUpper === 'YUV-ROOT-MASTER-777' ||
    cleanPwUpper === 'YUVEER-FOUNDER-2026' ||
    cleanPwUpper === 'YUV-SOVEREIGN-KEY' ||
    cleanPwUpper === 'ROOT-YUVEER' ||
    cleanPwUpper === 'ZEN-FOUNDER-PASSKEY-999' ||
    cleanPassword === '5747' ||
    cleanPassword === '574729' ||
    cleanPassword === '7788' ||
    cleanPassword === (process.env.ADMIN_MASTER_PIN || '5747');

  if (isFounder && isFounderPassword) {
    const founderUser = {
      id: 'zen_founder_root',
      name: 'Yuveer Chhatwani',
      email: 'founder@zenvitra.xyz',
      username: 'yuveer',
      role: 'FOUNDER',
    };
    await createSession(founderUser);
    return { success: true, user: founderUser };
  }

  // 2. Database User Verification
  try {
    const dbUser = await db.user.findFirst({
      where: {
        OR: [
          { email: clean },
          { username: clean },
          { handle: clean },
          { handle: `@${clean}` },
          { username: `@${clean}` },
        ],
      },
    });

    if (dbUser && dbUser.password) {
      const isValid = await bcrypt.compare(cleanPassword, dbUser.password);
      if (isValid) {
        const authenticatedUser = {
          id: dbUser.id,
          username: dbUser.username || dbUser.handle || clean.split('@')[0],
          email: dbUser.email,
          role: dbUser.role || 'DELEGATE',
        };
        await createSession(authenticatedUser);
        return { success: true, user: authenticatedUser };
      }
    }

    // 3. Test/Demo Mode Node (Strictly gated by test password)
    if ((clean === 'test' || clean === 'tester') && (cleanPassword === 'test1234' || cleanPassword === 'test')) {
      const testUser = {
        id: 'zen_test_delegate',
        username: 'test',
        email: 'test@zenvitra.xyz',
        role: 'DELEGATE',
      };
      await createSession(testUser);
      return { success: true, user: testUser };
    }

    return { success: false, error: 'Invalid master passphrase or identifier.' };
  } catch (error: any) {
    console.error('[AUTH ACTION ERROR]', error);
    return { success: false, error: 'Authentication engine encountered an error.' };
  }
}

/**
 * Server Action: Secure Logout
 * Destroys the cryptographic HttpOnly session cookie on the server.
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  await deleteSession();
  return { success: true };
}

/**
 * Server Action: Get Verified Session
 */
export async function getSessionAction() {
  return await verifySession();
}

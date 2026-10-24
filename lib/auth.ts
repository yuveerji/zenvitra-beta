import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import type { Provider } from 'next-auth/providers';

const providers: Provider[] = [
  Credentials({
    name: 'Credentials',
    credentials: {
      identifier: { label: 'Email or Username', type: 'text' },
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      const emailOrUsername = (credentials?.identifier || credentials?.email || '') as string;
      const password = (credentials?.password || '') as string;
      if (!emailOrUsername) return null;

      const clean = emailOrUsername.toLowerCase().trim().replace(/^@/, '');
      const cleanPw = (password || '').trim();
      const cleanPwUpper = cleanPw.toUpperCase();

      const isFounder =
        clean === 'founder@zenvitra.org' ||
        clean === 'founder@zenvitra.xyz' ||
        clean === 'founder@zenvitra.com' ||
        clean === 'founder' ||
        clean === 'yuveer' ||
        clean === (process.env.FOUNDER_EMAIL?.toLowerCase() || '');

      const isFounderPassword =
        password === 'Yuveer@5747R' ||
        cleanPwUpper === 'YUV-ROOT-MASTER-777' ||
        cleanPwUpper === 'YUVEER-FOUNDER-2026' ||
        cleanPwUpper === 'YUV-SOVEREIGN-KEY' ||
        cleanPwUpper === 'ROOT-YUVEER' ||
        cleanPwUpper === 'ZEN-FOUNDER-PASSKEY-999' ||
        cleanPw === '5747' ||
        cleanPw === '574729' ||
        cleanPw === '7788' ||
        cleanPwUpper === 'ZNV@2026!FOUNDER#99' ||
        cleanPwUpper === 'ZEN#99$FNDR!2026' ||
        cleanPwUpper === 'ZENVITRA#FOUNDER!2026' ||
        cleanPw === (process.env.ADMIN_MASTER_PIN || '5747');

      if (isFounder) {
        if (password && isFounderPassword) {
          return {
            id: 'zen_founder_root',
            name: 'Yuveer Chhatwani',
            email: 'founder@zenvitra.xyz',
            username: 'yuveer',
            role: 'FOUNDER',
          };
        }
        return null;
      }

      // Check Co-Founder (Aarush Vijayivargiya)
      const isCoFounder =
        clean === 'aarush@zenvitra.xyz' ||
        clean === 'aarush@zenvitra.com' ||
        clean === 'aarush@zenvitra.org' ||
        clean === 'aarush' ||
        clean === 'khushi@zenvitra.xyz' ||
        clean === 'khushi@zenvitra.com' ||
        clean === 'khushi';

      if (isCoFounder) {
        const isAarush = clean.includes('aarush');
        const isKhushi = clean.includes('khushi');
        const isCoFounderMatch =
          isFounderPassword ||
          cleanPw === '5747' ||
          cleanPwUpper.includes('COFOUNDER') ||
          (isAarush && (cleanPwUpper.includes('AARUSH') || cleanPwUpper === 'AARUSH-COFOUNDER-2026' || cleanPwUpper === 'COFOUNDER-AARUSH')) ||
          (isKhushi && (cleanPwUpper.includes('KHUSHI') || cleanPwUpper === 'KHUSHI-COFOUNDER-2026' || cleanPwUpper === 'COFOUNDER-KHUSHI'));

        if (password && isCoFounderMatch) {
          return {
            id: isAarush ? 'zen_cofounder_aarush' : 'zen_cofounder_khushi',
            name: isAarush ? 'Aarush Vijayivargiya' : 'Khushi R B',
            email: isAarush ? 'aarush@zenvitra.xyz' : 'khushi@zenvitra.xyz',
            username: isAarush ? 'aarush' : 'khushi',
            role: 'CO_FOUNDER',
          };
        }
        return null;
      }

      // Check QA/Test User
      const isTestUser =
        clean === 'test' ||
        clean === 'tester' ||
        clean === 'testuser' ||
        clean === 'demo' ||
        clean === 'test@zenvitra.xyz' ||
        clean === 'test@zenvitra.org';

      if (isTestUser) {
        const isAllowedTestPassword =
          cleanPw.toLowerCase() === 'test1234' ||
          cleanPw.toLowerCase() === 'test' ||
          cleanPw.toLowerCase() === 'test123' ||
          cleanPw.toLowerCase() === 'test@123';

        if (isAllowedTestPassword) {
          return {
            id: 'zen_test_delegate',
            name: 'Test Delegate',
            email: 'test@zenvitra.xyz',
            username: 'test',
            role: 'DELEGATE',
          };
        }
        return null;
      }

      // Check DB user
      try {
        const { db } = await import('@/lib/db');
        const bcrypt = (await import('bcryptjs')).default;
        
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

        if (dbUser && dbUser.password && password) {
          const isValid = await bcrypt.compare(password, dbUser.password);
          if (isValid) {
            return {
              id: dbUser.id,
              name: dbUser.name || dbUser.username || clean.split('@')[0],
              email: dbUser.email,
              username: dbUser.username || dbUser.handle || clean.split('@')[0],
              role: dbUser.role || 'DELEGATE',
            };
          }
          return null;
        }
      } catch (authErr) {
        console.warn('[NEXTAUTH-DB-AUTH-WARN]', authErr);
      }

      // Under no circumstance allow unverified credentials to sign in
      return null;
    },
  }),
];

const googleClientId = process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: 'select_account',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    })
  );
}

const githubClientId = process.env.AUTH_GITHUB_ID || process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.AUTH_GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET;

if (githubClientId && githubClientSecret) {
  providers.push(
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === new URL(baseUrl).origin) return url;
      } catch (_) {}
      return `${baseUrl}/pulse`;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'DELEGATE';
        // Default profile picture of ZENVITRA, NOT Google or GitHub account photo
        token.picture = '/assets/default-avatar.svg';

        // Check if user is newly created or existing in database
        try {
          const email = user.email?.toLowerCase().trim();
          if (email) {
            const { db } = await import('@/lib/db');
            const existing = await db.user.findFirst({
              where: { email },
            });

            const RESERVED_HANDLES = ['yuveer', 'founder', 'aarush', 'admin', 'root', 'zenvitra', 'support', 'system', 'moderator', 'chair', 'khushi'];
            let cleanHandle = (user.name || email.split('@')[0] || 'delegate')
              .toLowerCase()
              .replace(/[^a-z0-9_]/g, '');

            // External accounts must NEVER claim reserved founder/system handles
            if (RESERVED_HANDLES.includes(cleanHandle) && email !== 'founder@zenvitra.xyz' && email !== 'founder@zenvitra.org') {
              cleanHandle = `${cleanHandle}_${Math.floor(1000 + Math.random() * 9000)}`;
            }

            token.username = existing?.username || cleanHandle;

            if (!existing) {
              await db.user.create({
                data: {
                  email,
                  name: user.name || cleanHandle,
                  username: cleanHandle,
                  handle: cleanHandle,
                  role: 'DELEGATE',
                  roleBadge: 'DELEGATE',
                  verified: true,
                },
              });

              token.isNewUser = true;
              token.needsOnboarding = true;
            } else {
              token.isNewUser = false;
              token.needsOnboarding = false;
            }
          }
        } catch (dbErr) {
          console.warn('[NEXTAUTH-OAUTH-DB-SYNC-WARN]', dbErr);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        // Default profile picture of ZENVITRA, NOT Google or GitHub account photo
        session.user.image = '/assets/default-avatar.svg';
        (session.user as any).isNewUser = Boolean(token.isNewUser);
        (session.user as any).needsOnboarding = Boolean(token.needsOnboarding);
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'zenvitra_sovereign_secret_key_development_32_bytes_min',
});
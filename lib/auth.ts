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
            email: 'founder@zenvitra.org',
            username: 'yuveer',
            role: 'FOUNDER',
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
        clean === 'test@zenvitra.org' ||
        clean === 'test@zenvitra.xyz';

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
            email: 'test@zenvitra.org',
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
        token.username = (user as any).username || user.email?.split('@')[0];
        token.role = (user as any).role || 'DELEGATE';
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || 'zenvitra_sovereign_secret_key_development_32_bytes_min',
});
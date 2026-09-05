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

      const clean = emailOrUsername.toLowerCase().trim();
      const isFounder =
        clean === 'founder@zenvitra.org' ||
        clean === 'founder@zenvitra.xyz' ||
        clean === 'founder@zenvitra.com' ||
        clean === 'founder' ||
        clean === (process.env.FOUNDER_EMAIL?.toLowerCase() || '');

      const isFounderPassword =
        password === 'Yuveer@5747R' ||
        password === '5747' ||
        password === '574729' ||
        password === (process.env.ADMIN_MASTER_PIN || '5747');

      if (isFounder) {
        if (isFounderPassword) {
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

      const username = clean.includes('@') ? clean.split('@')[0] : clean;

      return {
        id: clean,
        name: username,
        email: clean.includes('@') ? clean : `${clean}@zenvitra.org`,
        username: username,
        role: 'DELEGATE',
      };
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
      const activeBase = process.env.NEXTAUTH_URL || process.env.AUTH_URL || baseUrl;
      if (url.startsWith('/')) return `${activeBase}${url}`;
      if (new URL(url).origin === new URL(activeBase).origin) return url;
      return `${activeBase}/pulse`;
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
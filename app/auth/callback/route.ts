import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const nextParam = searchParams.get('next');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mehyoegjgteuxhjnzxfz.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '',
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {
              // Server component write fallback
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.delete({ name, ...options });
            } catch {
              // Server component delete fallback
            }
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data?.user) {
      // Check if user account was created within the last 15 minutes (new sign up)
      const createdAt = data.user.created_at ? new Date(data.user.created_at).getTime() : 0;
      const isNewUser = Date.now() - createdAt < 15 * 60 * 1000;

      // If user is brand new or explicitly directed to onboarding, send directly to Onboarding Tour
      if (isNewUser || nextParam === '/onboarding') {
        const onboardingUrl = new URL('/onboarding', origin);
        onboardingUrl.searchParams.set('source', 'google_auth');
        onboardingUrl.searchParams.set('new_user', 'true');
        return NextResponse.redirect(onboardingUrl.toString());
      }

      // Existing user default to requested next or /dashboard
      const targetPath = nextParam || '/dashboard';
      return NextResponse.redirect(`${origin}${targetPath}`);
    }
  }

  // Fallback redirect
  return NextResponse.redirect(`${origin}/dashboard`);
}

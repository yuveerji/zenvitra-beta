import { handlers } from '@/lib/auth';

export const runtime = 'nodejs';

// NextAuth v5 beta exports the handlers directly from our config
export const { GET, POST } = handlers;
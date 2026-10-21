import { notFound, redirect } from 'next/navigation';
import { verifySession } from '@/lib/session';

const ALLOWED_ADMIN_ROLES = [
  'FOUNDER',
  'CO_FOUNDER',
  'CHIEF_OF_STAFF',
  'ADMIN',
  'SECRETARY_GENERAL',
  'DIRECTOR_GENERAL',
  'CHAIRPERSON',
  'VICE_CHAIR',
  'TECH_LEAD',
  'FULLSTACK_DEV',
  'DESIGN_LEAD',
  'POLICY_RESEARCHER',
  'FINANCE_LEAD',
  'OUTREACH_LEAD',
  'OPERATIONS_LEAD',
  'COMMUNITY_LEAD',
  'MODERATOR',
  'SECRETARIAT_CHAIR',
  'CORE_TEAM',
  'founder',
  'co_founder',
  'admin',
  'core_team',
];

export default async function AdminPage() {
  const session = await verifySession();

  // If user is at normal status or not in core team / admin list, throw stealth 404
  if (!session.isAuth || !session.role || !ALLOWED_ADMIN_ROLES.includes(session.role)) {
    notFound();
  }

  redirect('/core-team-panel');
}

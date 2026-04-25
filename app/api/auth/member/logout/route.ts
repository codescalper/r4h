import { clearMemberCookie } from '@/lib/auth';

export async function POST() {
  await clearMemberCookie();
  return Response.json({ success: true });
}

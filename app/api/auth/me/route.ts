import { getAdminFromCookie, getMemberFromCookie } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromCookie();
  if (admin) {
    return Response.json({ role: 'admin', id: admin.id, email: admin.email });
  }
  const member = await getMemberFromCookie();
  if (member) {
    return Response.json({ role: 'member', id: member.id, email: member.email });
  }
  return Response.json({ role: null });
}

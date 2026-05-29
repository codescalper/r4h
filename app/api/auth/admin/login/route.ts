import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, signToken, setAdminCookie } from '@/lib/auth';
import { rateLimit, getClientIp, rateLimitExceeded } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`admin-login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rl.success) return rateLimitExceeded(rl.resetAt);

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    console.log(admin);
    if (!admin) {
      return Response.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const valid = await comparePassword(password, admin.password);
    if (!valid) {
      return Response.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = signToken({ id: admin.id, email: admin.email, role: 'admin' });
    await setAdminCookie(token);

    return Response.json({ success: true, admin: { id: admin.id, email: admin.email, name: admin.name } });
  } catch (error) {
    console.error('[admin-login] UNHANDLED ERROR:', error);
    const message = process.env.NODE_ENV === 'development'
      ? String(error)
      : 'Internal server error.';
    return Response.json({ error: message }, { status: 500 });
  }
}

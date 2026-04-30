import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { comparePassword, signToken, setMemberCookie } from '@/lib/auth';
import { rateLimit, getClientIp, rateLimitExceeded } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`member-login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rl.success) return rateLimitExceeded(rl.resetAt);

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { email } });
    if (!member) {
      return Response.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (member.status === 'PENDING') {
      return Response.json({ error: 'Your application is still under review. Please wait for approval.' }, { status: 403 });
    }
    if (member.status === 'REJECTED') {
      return Response.json({ error: 'Your application was not approved. Please contact support.' }, { status: 403 });
    }
    if (!member.password) {
      return Response.json({ error: 'Please set your password first using the link sent to your email.' }, { status: 403 });
    }

    const valid = await comparePassword(password, member.password);
    if (!valid) {
      return Response.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = signToken({ id: member.id, email: member.email, role: 'member' });
    await setMemberCookie(token);

    return Response.json({
      success: true,
      member: {
        id: member.id,
        email: member.email,
        firstName: member.firstName,
        lastName: member.lastName,
      },
    });
  } catch {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

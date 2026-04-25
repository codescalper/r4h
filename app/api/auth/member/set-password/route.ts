import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json({ error: 'Token and password are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const setToken = await prisma.memberSetPasswordToken.findUnique({ where: { token } });
    if (!setToken || setToken.used || setToken.expiresAt < new Date()) {
      return Response.json({ error: 'This link is invalid or has expired. Please contact the admin.' }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { id: setToken.memberId } });
    if (!member || member.status !== 'APPROVED') {
      return Response.json({ error: 'Your account is not approved yet.' }, { status: 403 });
    }

    const hashed = await hashPassword(password);
    await prisma.$transaction([
      prisma.member.update({ where: { id: setToken.memberId }, data: { password: hashed } }),
      prisma.memberSetPasswordToken.update({ where: { id: setToken.id }, data: { used: true } }),
    ]);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

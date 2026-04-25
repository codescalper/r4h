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

    const resetToken = await prisma.adminPasswordResetToken.findUnique({ where: { token } });
    if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
      return Response.json({ error: 'This reset link is invalid or has expired.' }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    await prisma.$transaction([
      prisma.admin.update({ where: { id: resetToken.adminId }, data: { password: hashed } }),
      prisma.adminPasswordResetToken.update({ where: { id: resetToken.id }, data: { used: true } }),
    ]);

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

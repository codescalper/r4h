import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { generateSecureToken, tokenExpiresAt } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { BASE_URL, EMAIL } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required.' }, { status: 400 });
    }

    const member = await prisma.member.findUnique({ where: { email } });
    // Return success even if not found — prevent email enumeration
    if (!member || member.status !== 'APPROVED') {
      return Response.json({ success: true });
    }

    // Invalidate old tokens
    await prisma.memberPasswordResetToken.updateMany({
      where: { memberId: member.id, used: false },
      data: { used: true },
    });

    const token = generateSecureToken();
    await prisma.memberPasswordResetToken.create({
      data: { token, memberId: member.id, expiresAt: tokenExpiresAt(1) },
    });

    const resetLink = `${BASE_URL}/member/reset-password?token=${token}`;
    await sendEmail({
      to: member.email,
      subject: 'Reset Your Run4Health Password',
      template: 'forgot-password',
      vars: {
        firstName: member.firstName,
        email: member.email,
        resetLink,
        supportEmail: EMAIL,
      },
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

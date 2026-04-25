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

    const admin = await prisma.admin.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!admin) {
      return Response.json({ success: true });
    }

    // Invalidate old tokens
    await prisma.adminPasswordResetToken.updateMany({
      where: { adminId: admin.id, used: false },
      data: { used: true },
    });

    const token = generateSecureToken();
    await prisma.adminPasswordResetToken.create({
      data: {
        token,
        adminId: admin.id,
        expiresAt: tokenExpiresAt(1),
      },
    });

    const resetLink = `${BASE_URL}/admin/reset-password?token=${token}`;
    await sendEmail({
      to: admin.email,
      subject: 'Reset Your Run4Health Admin Password',
      template: 'forgot-password',
      vars: {
        firstName: admin.name,
        email: admin.email,
        resetLink,
        supportEmail: EMAIL,
      },
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

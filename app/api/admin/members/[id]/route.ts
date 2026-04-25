import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie, generateSecureToken, tokenExpiresAt } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { BASE_URL, EMAIL } from '@/lib/constants';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;
  const { status } = await request.json();

  if (!['APPROVED', 'REJECTED'].includes(status)) {
    return Response.json({ error: 'Invalid status.' }, { status: 400 });
  }

  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return Response.json({ error: 'Member not found.' }, { status: 404 });

  await prisma.member.update({ where: { id }, data: { status } });

  if (status === 'APPROVED') {
    // Create set-password token (48 hours)
    const token = generateSecureToken();
    await prisma.memberSetPasswordToken.create({
      data: { token, memberId: member.id, expiresAt: tokenExpiresAt(48) },
    });

    const setPasswordLink = `${BASE_URL}/member/set-password?token=${token}`;
    await sendEmail({
      to: member.email,
      subject: '🎉 You\'re approved! Set your Run4Health password',
      template: 'member-approval',
      vars: {
        firstName: member.firstName,
        email: member.email,
        setPasswordLink,
        loginLink: `${BASE_URL}/member/login`,
        supportEmail: EMAIL,
      },
    }).catch(() => {});
  }

  if (status === 'REJECTED') {
    await sendEmail({
      to: member.email,
      subject: 'Your Run4Health Application Update',
      template: 'member-rejection',
      vars: {
        firstName: member.firstName,
        email: member.email,
        supportEmail: EMAIL,
      },
    }).catch(() => {});
  }

  return Response.json({ success: true });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) return Response.json({ error: 'Member not found.' }, { status: 404 });

  return Response.json({ member });
}

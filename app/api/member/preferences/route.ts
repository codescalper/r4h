import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getMemberFromCookie } from '@/lib/auth';

export async function GET() {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { emailNotifications: true },
  });
  if (!member) return Response.json({ error: 'Not found' }, { status: 404 });

  return Response.json({ emailNotifications: member.emailNotifications });
}

export async function PATCH(req: NextRequest) {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (typeof body.emailNotifications !== 'boolean') {
    return Response.json({ error: 'emailNotifications must be a boolean' }, { status: 400 });
  }

  const member = await prisma.member.update({
    where: { id: user.id },
    data: { emailNotifications: body.emailNotifications },
    select: { emailNotifications: true },
  });

  return Response.json({ emailNotifications: member.emailNotifications });
}

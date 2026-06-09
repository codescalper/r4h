import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getMemberFromCookie } from '@/lib/auth';

export const runtime = 'nodejs';

/**
 * PATCH /api/member/messages/[id]
 * Marks a single message as read. The signed-in member must own the message.
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.message.findUnique({ where: { id } });
  if (!existing || existing.memberId !== user.id) {
    return Response.json({ error: 'Message not found.' }, { status: 404 });
  }

  const message = await prisma.message.update({
    where: { id },
    data: { read: true, readAt: new Date() },
  });

  return Response.json({ message });
}

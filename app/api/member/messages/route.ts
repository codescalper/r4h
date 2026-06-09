import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getMemberFromCookie } from '@/lib/auth';

export const runtime = 'nodejs';

/**
 * GET /api/member/messages
 * Returns the signed-in member's messages (inbox), newest first.
 */
export async function GET(request: NextRequest) {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unread') === 'true';

  const where: Record<string, unknown> = { memberId: user.id };
  if (unreadOnly) where.read = false;

  const [messages, unreadCount] = await Promise.all([
    prisma.message.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        admin: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.message.count({ where: { memberId: user.id, read: false } }),
  ]);

  return Response.json({ messages, unreadCount });
}

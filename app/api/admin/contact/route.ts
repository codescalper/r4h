import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const cursor = req.nextUrl.searchParams.get('cursor');
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '20', 10), 50);
  const unreadOnly = req.nextUrl.searchParams.get('unread') === 'true';

  const where: Record<string, unknown> = {};
  if (unreadOnly) where['read'] = false;
  if (cursor) where['createdAt'] = { lt: new Date(cursor) };

  const submissions = await prisma.contactSubmission.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
  });

  const hasMore = submissions.length > limit;
  const items = hasMore ? submissions.slice(0, limit) : submissions;
  const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;

  const unreadCount = await prisma.contactSubmission.count({ where: { read: false } });

  return Response.json({ submissions: items, hasMore, nextCursor, unreadCount });
}

export async function PATCH(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, read } = await req.json();
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });

  const updated = await prisma.contactSubmission.update({
    where: { id },
    data: { read: read ?? true },
  });
  return Response.json({ submission: updated });
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get('cursor');
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '12', 10), 50);

  const where: Record<string, unknown> = {};
  if (cursor) where['createdAt'] = { lt: new Date(cursor) };

  const programs = await prisma.program.findMany({
    where,
    orderBy: [{ status: 'asc' }, { date: 'asc' }, { createdAt: 'desc' }],
    take: limit + 1,
  });

  const hasMore = programs.length > limit;
  const items = hasMore ? programs.slice(0, limit) : programs;
  const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;

  return Response.json({ programs: items, hasMore, nextCursor });
}

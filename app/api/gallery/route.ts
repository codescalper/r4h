import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get('cursor');
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '18', 10), 60);

  const where: Record<string, unknown> = {};
  if (cursor) where['createdAt'] = { lt: new Date(cursor) };

  const [images, tags] = await Promise.all([
    prisma.galleryImage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      include: { tags: { include: { tag: true } } },
    }),
    prisma.galleryTag.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const hasMore = images.length > limit;
  const items = hasMore ? images.slice(0, limit) : images;
  const nextCursor = hasMore ? items[items.length - 1].createdAt.toISOString() : null;

  return Response.json({ images: items, tags, hasMore, nextCursor });
}

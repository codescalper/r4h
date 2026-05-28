import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit, getClientIp, rateLimitExceeded } from '@/lib/rate-limit';

export async function GET(req: NextRequest) {
  // Rate limit: 20 searches per minute per IP
  const ip = getClientIp(req);
  const rl = rateLimit(`search:${ip}`, { limit: 20, windowMs: 60_000 });
  if (!rl.success) return rateLimitExceeded(rl.resetAt);

  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';
  const type = req.nextUrl.searchParams.get('type') ?? 'all'; // 'posts' | 'programs' | 'all'

  if (q.length < 2) {
    return Response.json({ posts: [], programs: [] });
  }
  if (q.length > 100) {
    return Response.json({ error: 'Query too long' }, { status: 400 });
  }

  const [posts, programs] = await Promise.all([
    type !== 'programs'
      ? prisma.post.findMany({
          where: {
            status: 'APPROVED',
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { excerpt: { contains: q, mode: 'insensitive' } },
            ],
          },
          orderBy: { publishedAt: 'desc' },
          take: 6,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            category: true,
            publishedAt: true,
            images: { take: 1, select: { path: true } },
          },
        })
      : Promise.resolve([]),

    type !== 'posts'
      ? prisma.program.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { excerpt: { contains: q, mode: 'insensitive' } },
            ],
          },
          orderBy: { createdAt: 'desc' },
          take: 6,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            category: true,
            status: true,
            date: true,
          },
        })
      : Promise.resolve([]),
  ]);

  return Response.json({ posts, programs });
}

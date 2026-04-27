import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';
import type { PostStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const status = req.nextUrl.searchParams.get('status') as PostStatus | null;
  const posts = await prisma.post.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { orderBy: { order: 'asc' }, take: 1 },
      member: { select: { firstName: true, lastName: true, email: true } },
      admin: { select: { name: true, email: true } },
    },
  });
  return Response.json({ posts });
}

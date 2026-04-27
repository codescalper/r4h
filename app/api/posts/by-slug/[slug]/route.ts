import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { order: 'asc' } },
      member: { select: { firstName: true, lastName: true } },
      admin: { select: { name: true } },
    },
  });
  if (!post || post.status !== 'APPROVED') {
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
  return Response.json({ post });
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 });

  const { status, rejectionNote } = await req.json();
  const updated = await prisma.post.update({
    where: { id },
    data: {
      status,
      rejectionNote: rejectionNote ?? null,
      publishedAt: status === 'APPROVED' ? new Date() : post.publishedAt,
    },
  });
  return Response.json({ post: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 });

  await prisma.post.delete({ where: { id } });
  return Response.json({ success: true });
}

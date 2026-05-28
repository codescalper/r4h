import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';
import { notifyMembers } from '@/lib/notify-members';

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

  // Notify members when a post transitions to APPROVED
  if (status === 'APPROVED' && post.status !== 'APPROVED') {
    const fullPost = await prisma.post.findUnique({ where: { id } });
    if (fullPost) {
      notifyMembers({
        type: 'post',
        title: fullPost.title,
        excerpt: fullPost.excerpt ?? '',
        slug: fullPost.slug,
        meta: [{ label: 'Category', value: fullPost.category.replace(/_/g, ' ') }],
      }).catch(() => {/* swallow */});
    }
  }

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

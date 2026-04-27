import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie, getMemberFromCookie } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  });
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 });
  if (post.status !== 'APPROVED') {
    // Only author can see non-approved posts
    const admin = await getAdminFromCookie();
    const member = await getMemberFromCookie();
    const isAuthor =
      (admin && post.adminId === admin.id) ||
      (member && post.memberId === member.id);
    if (!isAuthor) return Response.json({ error: 'Not found' }, { status: 404 });
  }
  return Response.json({ post });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const admin = await getAdminFromCookie();
  const member = await getMemberFromCookie();
  if (!admin && !member) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 });

  const isAuthor =
    (admin && post.adminId === admin.id) ||
    (member && post.memberId === member.id);
  if (!isAuthor) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (post.status === 'APPROVED') return Response.json({ error: 'Cannot edit approved post' }, { status: 400 });

  const { title, excerpt, content, coverImagePath, category, imagePaths, status } = await req.json();
  const updated = await prisma.post.update({
    where: { id },
    data: {
      title: title?.trim() ?? post.title,
      excerpt: excerpt?.trim() ?? post.excerpt,
      content: content ?? post.content,
      coverImagePath: coverImagePath ?? post.coverImagePath,
      category: category ?? post.category,
      status: status ?? post.status,
      images: imagePaths
        ? {
            deleteMany: {},
            create: (imagePaths as string[]).map((p: string, i: number) => ({ path: p, order: i })),
          }
        : undefined,
    },
    include: { images: true },
  });
  return Response.json({ post: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const admin = await getAdminFromCookie();
  const member = await getMemberFromCookie();
  if (!admin && !member) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 });

  const isAuthor =
    (admin && post.adminId === admin.id) ||
    (member && post.memberId === member.id);
  if (!isAuthor && !admin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.post.delete({ where: { id } });
  return Response.json({ success: true });
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { path, altText, caption, tagIds } = await req.json();
  if (!path) return Response.json({ error: 'path is required' }, { status: 400 });

  const image = await prisma.galleryImage.create({
    data: {
      path,
      altText: altText ?? null,
      caption: caption ?? null,
      adminId: admin.id,
      tags: tagIds?.length
        ? { create: (tagIds as string[]).map((tagId: string) => ({ tagId })) }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });
  return Response.json({ image }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return Response.json({ error: 'id required' }, { status: 400 });

  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return Response.json({ error: 'Not found' }, { status: 404 });

  await prisma.galleryImage.delete({ where: { id } });
  return Response.json({ success: true });
}

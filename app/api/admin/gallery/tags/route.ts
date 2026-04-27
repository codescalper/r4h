import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function GET() {
  const tags = await prisma.galleryTag.findMany({ orderBy: { name: 'asc' } });
  return Response.json({ tags });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return Response.json({ error: 'Name required' }, { status: 400 });

  const slug = slugify(name.trim());
  const existing = await prisma.galleryTag.findUnique({ where: { slug } });
  if (existing) return Response.json({ tag: existing });

  const tag = await prisma.galleryTag.create({ data: { name: name.trim(), slug } });
  return Response.json({ tag }, { status: 201 });
}

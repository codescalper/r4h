import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';
import type { ProgramCategory, ProgramStatus } from '@prisma/client';

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const p = await prisma.program.findUnique({ where: { id } });
  if (!p) return Response.json({ error: 'Not found' }, { status: 404 });

  const { title, excerpt, content, coverImagePath, date, location, category, status } = await req.json();
  const updated = await prisma.program.update({
    where: { id },
    data: {
      title: title?.trim() ?? p.title,
      excerpt: excerpt?.trim() ?? p.excerpt,
      content: content ?? p.content,
      coverImagePath: coverImagePath ?? p.coverImagePath,
      date: date ? new Date(date) : p.date,
      location: location?.trim() ?? p.location,
      category: (category as ProgramCategory) ?? p.category,
      status: (status as ProgramStatus) ?? p.status,
    },
  });
  return Response.json({ program: updated });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const p = await prisma.program.findUnique({ where: { id } });
  if (!p) return Response.json({ error: 'Not found' }, { status: 404 });

  await prisma.program.delete({ where: { id } });
  return Response.json({ success: true });
}

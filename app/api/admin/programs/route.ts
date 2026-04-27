import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';
import type { ProgramCategory, ProgramStatus } from '@prisma/client';

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 60);
}
function randomSuffix(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}
async function uniqueSlug(base: string): Promise<string> {
  let slug = `${base}-${randomSuffix()}`;
  while (await prisma.program.findUnique({ where: { slug } })) {
    slug = `${base}-${randomSuffix()}`;
  }
  return slug;
}

export async function GET(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const programs = await prisma.program.findMany({
    orderBy: [{ status: 'asc' }, { date: 'asc' }],
    include: { admin: { select: { name: true, email: true } } },
  });
  return Response.json({ programs });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, excerpt, content, coverImagePath, date, location, category, status } = await req.json();
  if (!title?.trim() || !content?.trim()) {
    return Response.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const slug = await uniqueSlug(slugify(title));

  const program = await prisma.program.create({
    data: {
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() ?? null,
      content,
      coverImagePath: coverImagePath ?? null,
      date: date ? new Date(date) : null,
      location: location?.trim() ?? null,
      category: (category as ProgramCategory) ?? 'OTHER',
      status: (status as ProgramStatus) ?? 'UPCOMING',
      adminId: admin.id,
    },
  });
  return Response.json({ program }, { status: 201 });
}

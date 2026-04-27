import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie, getMemberFromCookie } from '@/lib/auth';
import type { PostCategory, PostStatus } from '@prisma/client';

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 60)
}

function randomSuffix(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = `${base}-${randomSuffix()}`
  // extremely unlikely collision but handle it
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${base}-${randomSuffix()}`
  }
  return slug
}

// GET — public: returns APPROVED posts (or member/admin sees own posts if mine=true)
export async function GET(req: NextRequest) {
  const mine = req.nextUrl.searchParams.get('mine') === 'true';
  const statusFilter = req.nextUrl.searchParams.get('status') as PostStatus | null;
  const cursor = req.nextUrl.searchParams.get('cursor'); // last post's createdAt ISO string
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '12', 10), 50);

  if (mine) {
    const admin = await getAdminFromCookie();
    const member = await getMemberFromCookie();
    if (!admin && !member) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const where = admin
      ? { adminId: admin.id }
      : { memberId: member!.id };

    const posts = await prisma.post.findMany({
      where: statusFilter ? { ...where, status: statusFilter } : where,
      orderBy: { createdAt: 'desc' },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    return Response.json({ posts });
  }

  // Public — paginated
  const where: Record<string, unknown> = { status: 'APPROVED' };
  if (cursor) where['publishedAt'] = { lt: new Date(cursor) };

  const posts = await prisma.post.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: limit + 1,
    include: { images: { orderBy: { order: 'asc' }, take: 1 } },
  });

  const hasMore = posts.length > limit;
  const items = hasMore ? posts.slice(0, limit) : posts;
  const nextCursor = hasMore ? items[items.length - 1].publishedAt?.toISOString() ?? null : null;

  return Response.json({ posts: items, hasMore, nextCursor });
}

// POST — authenticated: create post
export async function POST(req: NextRequest) {
  const admin = await getAdminFromCookie();
  const member = await getMemberFromCookie();
  if (!admin && !member) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, excerpt, content, coverImagePath, category, imagePaths, status } = body;

  if (!title?.trim() || !content?.trim()) {
    return Response.json({ error: 'Title and content are required' }, { status: 400 });
  }

  const slug = await uniqueSlug(slugify(title));
  const isAdmin = !!admin;
  // Admin posts go APPROVED; member posts go PENDING (unless explicitly DRAFT)
  const postStatus: PostStatus = isAdmin
    ? 'APPROVED'
    : (status === 'DRAFT' ? 'DRAFT' : 'PENDING');

  const post = await prisma.post.create({
    data: {
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() ?? null,
      content,
      coverImagePath: coverImagePath ?? null,
      category: (category as PostCategory) ?? 'ANNOUNCEMENT',
      status: postStatus,
      authorType: isAdmin ? 'ADMIN' : 'MEMBER',
      adminId: isAdmin ? admin.id : null,
      memberId: !isAdmin ? member!.id : null,
      publishedAt: postStatus === 'APPROVED' ? new Date() : null,
      images: imagePaths?.length
        ? { create: (imagePaths as string[]).map((p: string, i: number) => ({ path: p, order: i })) }
        : undefined,
    },
    include: { images: true },
  });

  return Response.json({ post }, { status: 201 });
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const where = status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)
    ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' }
    : {};

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        city: true,
        gender: true,
        dateOfBirth: true,
        fitnessLevel: true,
        profilePhotoPath: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.member.count({ where }),
  ]);

  return Response.json({ members, total, page, limit });
}

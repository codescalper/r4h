import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_req: NextRequest) {
  const members = await prisma.member.findMany({
    where: { status: 'APPROVED' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profilePhotoPath: true,
      city: true,
      gender: true,
    },
    orderBy: [{ gender: 'asc' }, { firstName: 'asc' }],
  });

  return Response.json({ members });
}

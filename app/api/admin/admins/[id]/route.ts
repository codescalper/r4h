import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;

  if (id === admin.id) {
    return Response.json({ error: 'You cannot remove your own admin account.' }, { status: 400 });
  }

  const target = await prisma.admin.findUnique({ where: { id } });
  if (!target) return Response.json({ error: 'Admin not found.' }, { status: 404 });

  await prisma.admin.delete({ where: { id } });

  return Response.json({ success: true });
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  // support lookup by slug first, then by id for backward compat
  const program = await prisma.program.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
  });
  if (!program) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json({ program });
}

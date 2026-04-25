import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getMemberFromCookie } from '@/lib/auth';

export async function GET() {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const records = await prisma.healthRecord.findMany({
    where: { memberId: user.id },
    orderBy: { recordedAt: 'desc' },
  });

  return Response.json({ records });
}

export async function POST(request: NextRequest) {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const body = await request.json();
  const { weight, height, thighSize, waistSize, sleepHours, notes } = body;

  const record = await prisma.healthRecord.create({
    data: {
      memberId: user.id,
      weight: weight ? parseFloat(weight) : null,
      height: height ? parseFloat(height) : null,
      thighSize: thighSize ? parseFloat(thighSize) : null,
      waistSize: waistSize ? parseFloat(waistSize) : null,
      sleepHours: sleepHours ? parseFloat(sleepHours) : null,
      notes: notes || null,
    },
  });

  return Response.json({ record });
}

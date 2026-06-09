import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getMemberFromCookie } from '@/lib/auth';

export async function GET() {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      city: true,
      gender: true,
      age: true,
      dateOfBirth: true,
      height: true,
      weight: true,
      thighSize: true,
      waistSize: true,
      sleepHours: true,
      fitnessLevel: true,
      medicalConditions: true,
      profilePhotoPath: true,
      emergencyContact: true,
      status: true,
      createdAt: true,
      emailNotifications: true,
      medicalReports: {
        orderBy: { uploadedAt: 'desc' },
        select: {
          id: true,
          path: true,
          filename: true,
          size: true,
          uploadedAt: true,
        },
      },
    },
  });

  if (!member) return Response.json({ error: 'Member not found.' }, { status: 404 });
  return Response.json({ member });
}

export async function PUT(request: NextRequest) {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const body = await request.json();
  const allowed = [
    'phone',
    'city',
    'emergencyContact',
    'medicalConditions',
    'profilePhotoPath',
  ];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key];
  }

  const member = await prisma.member.update({ where: { id: user.id }, data });
  return Response.json({ member });
}

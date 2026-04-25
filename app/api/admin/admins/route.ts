import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie, hashPassword } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const admins = await prisma.admin.findMany({
    select: { id: true, name: true, email: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  return Response.json({ admins });
}

export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { email, name, password } = await request.json();

  if (!email || !name || !password) {
    return Response.json({ error: 'Email, name, and password are required.' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.json({ error: 'Invalid email address.' }, { status: 400 });
  }

  if (password.length < 8) {
    return Response.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    return Response.json({ error: 'An admin with this email already exists.' }, { status: 409 });
  }

  const hashed = await hashPassword(password);
  const newAdmin = await prisma.admin.create({
    data: { email, name, password: hashed },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return Response.json({ admin: newAdmin }, { status: 201 });
}

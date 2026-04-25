import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getMemberFromCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donorName, donorEmail, donorPhone, amount, paymentMethod, message } = body;

    if (!donorName || !donorEmail || !amount) {
      return Response.json({ error: 'Name, email, and amount are required.' }, { status: 400 });
    }
    if (parseFloat(amount) <= 0) {
      return Response.json({ error: 'Donation amount must be greater than 0.' }, { status: 400 });
    }

    // Optionally link to member if logged in
    const user = await getMemberFromCookie();

    const donation = await prisma.donation.create({
      data: {
        donorName,
        donorEmail,
        donorPhone: donorPhone || null,
        amount: parseFloat(amount),
        paymentMethod: paymentMethod || 'UPI',
        message: message || null,
        memberId: user?.id ?? null,
        status: 'PENDING',
      },
    });

    return Response.json({ success: true, donation });
  } catch {
    return Response.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function GET() {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const donations = await prisma.donation.findMany({
    where: { memberId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return Response.json({ donations });
}

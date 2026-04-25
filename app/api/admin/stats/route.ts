import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';

export async function GET() {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const [total, pending, approved, rejected, totalDonations] = await Promise.all([
    prisma.member.count(),
    prisma.member.count({ where: { status: 'PENDING' } }),
    prisma.member.count({ where: { status: 'APPROVED' } }),
    prisma.member.count({ where: { status: 'REJECTED' } }),
    prisma.donation.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
  ]);

  return Response.json({
    totalMembers: total,
    pendingMembers: pending,
    approvedMembers: approved,
    rejectedMembers: rejected,
    totalDonationsAmount: totalDonations._sum.amount ?? 0,
  });
}

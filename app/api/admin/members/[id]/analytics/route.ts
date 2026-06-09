import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;

  const member = await prisma.member.findUnique({
    where: { id },
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
      fitnessLevel: true,
      height: true,
      weight: true,
      thighSize: true,
      waistSize: true,
      sleepHours: true,
      medicalConditions: true,
      emergencyContact: true,
      profilePhotoPath: true,
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
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!member) return Response.json({ error: 'Member not found.' }, { status: 404 });

  const [healthRecords, donations, posts] = await Promise.all([
    prisma.healthRecord.findMany({
      where: { memberId: id },
      orderBy: { recordedAt: 'asc' },
      select: {
        id: true,
        weight: true,
        height: true,
        thighSize: true,
        waistSize: true,
        sleepHours: true,
        notes: true,
        recordedAt: true,
      },
    }),
    prisma.donation.findMany({
      where: { memberId: id },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        amount: true,
        currency: true,
        paymentMethod: true,
        status: true,
        message: true,
        createdAt: true,
      },
    }),
    prisma.post.findMany({
      where: { memberId: id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  // ── Computed analytics ─────────────────────────────────────────────────────

  // BMI from latest health record or profile data
  const latestRecord = healthRecords[healthRecords.length - 1];
  const bmiHeight = latestRecord?.height ?? member.height;
  const bmiWeight = latestRecord?.weight ?? member.weight;
  const bmi =
    bmiHeight && bmiWeight
      ? parseFloat((bmiWeight / ((bmiHeight / 100) * (bmiHeight / 100))).toFixed(1))
      : null;

  // Donation totals
  const completedDonations = donations.filter((d) => d.status === 'COMPLETED');
  const totalDonated = completedDonations.reduce((sum, d) => sum + d.amount, 0);

  // Donation by month (last 12 months)
  const now = new Date();
  const donationsByMonth: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    donationsByMonth[key] = 0;
  }
  completedDonations.forEach((d) => {
    const date = new Date(d.createdAt);
    const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
    if (key in donationsByMonth) donationsByMonth[key] += d.amount;
  });

  // Post stats
  const postsByStatus = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  // Health trend data (weight, waist, sleep)
  const healthTrend = healthRecords.map((r) => ({
    date: new Date(r.recordedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    weight: r.weight,
    waistSize: r.waistSize,
    thighSize: r.thighSize,
    sleepHours: r.sleepHours,
  }));

  return Response.json({
    member,
    healthRecords,
    donations,
    posts,
    analytics: {
      bmi,
      totalDonated,
      donationCount: completedDonations.length,
      donationsByMonth: Object.entries(donationsByMonth).map(([month, amount]) => ({ month, amount })),
      postsByStatus,
      healthTrend,
      healthRecordCount: healthRecords.length,
    },
  });
}

import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminFromCookie } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { BASE_URL, EMAIL } from '@/lib/constants';

export const runtime = 'nodejs';

/**
 * GET /api/admin/messages
 * Returns the full send history (one row per recipient, newest first).
 * Optional `?scope=PERSONAL|BROADCAST` filter.
 * Optional `?memberId=xxx` filter.
 */
export async function GET(request: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const scope = searchParams.get('scope');
  const memberId = searchParams.get('memberId');

  const where: Record<string, unknown> = {};
  if (scope === 'PERSONAL' || scope === 'BROADCAST') where.scope = scope;
  if (memberId) where.memberId = memberId;

  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 200,
    include: {
      member: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  return Response.json({ messages });
}

/**
 * POST /api/admin/messages
 * Body: { subject, body, memberId? }
 * - With memberId   → personalized message to that one member (1 row + 1 email)
 * - Without memberId → broadcast: one row per approved member + one email each
 */
export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookie();
  if (!admin) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { subject, body, memberId } = await request.json();

  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    return Response.json({ error: 'Subject is required.' }, { status: 400 });
  }
  if (!body || typeof body !== 'string' || !body.trim()) {
    return Response.json({ error: 'Message body is required.' }, { status: 400 });
  }
  if (subject.length > 200) {
    return Response.json({ error: 'Subject must be 200 characters or fewer.' }, { status: 400 });
  }
  if (body.length > 10000) {
    return Response.json({ error: 'Message body must be 10000 characters or fewer.' }, { status: 400 });
  }

  const adminRow = await prisma.admin.findUnique({ where: { id: admin.id } });
  const adminName = adminRow?.name ?? 'Run4Health Team';

  const dashboardLink = `${BASE_URL}/member/dashboard`;
  const supportEmail = EMAIL || 'support@run4health.in';

  // ─── Personalized: single member ─────────────────────────────────────────
  if (memberId) {
    const member = await prisma.member.findUnique({ where: { id: memberId } });
    if (!member) {
      return Response.json({ error: 'Member not found.' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        subject: subject.trim(),
        body: body.trim(),
        scope: 'PERSONAL',
        adminId: admin.id,
        memberId: member.id,
      },
    });

    await sendEmail({
      to: member.email,
      subject: `Message from ${adminName} — ${subject.trim()}`,
      template: 'admin-message',
      vars: {
        firstName: member.firstName,
        adminName,
        subject: subject.trim(),
        body: body.trim(),
        typeBadge: 'Personal Message',
        introText: `You have a new personal message from the ${adminName} on Run4Health.`,
        dashboardLink,
        supportEmail,
      },
    }).catch(() => {});

    return Response.json({ success: true, sent: 1, message });
  }

  // ─── Broadcast: fan-out to all approved members ──────────────────────────
  const approvedMembers = await prisma.member.findMany({
    where: { status: 'APPROVED' },
    select: { id: true, firstName: true, email: true },
  });

  if (!approvedMembers.length) {
    return Response.json({ error: 'No approved members to message.' }, { status: 400 });
  }

  // Create one Message row per member so each member has their own copy
  // (read state, etc.) in their personal inbox.
  await prisma.message.createMany({
    data: approvedMembers.map((m) => ({
      subject: subject.trim(),
      body: body.trim(),
      scope: 'BROADCAST' as const,
      adminId: admin.id,
      memberId: m.id,
    })),
  });

  // Send personalized email to each approved member concurrently.
  // Errors are swallowed per-recipient so a single bad address can't break
  // the whole broadcast.
  await Promise.allSettled(
    approvedMembers.map((m) =>
      sendEmail({
        to: m.email,
        subject: `[Community Broadcast] ${subject.trim()}`,
        template: 'admin-message',
        vars: {
          firstName: m.firstName,
          adminName,
          subject: subject.trim(),
          body: body.trim(),
          typeBadge: 'Community Broadcast',
          introText: `${adminName} sent a message to the whole Run4Health community. You are receiving this as an approved member.`,
          dashboardLink,
          supportEmail,
        },
      })
    )
  );

  return Response.json({ success: true, sent: approvedMembers.length });
}

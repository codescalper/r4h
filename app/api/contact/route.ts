import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { rateLimit, getClientIp, rateLimitExceeded } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!rl.success) return rateLimitExceeded(rl.resetAt);

  const { name, email, subject, message } = await req.json();

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return Response.json({ error: 'All fields are required' }, { status: 400 });
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const submission = await prisma.contactSubmission.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    },
  });

  return Response.json({ ok: true, id: submission.id }, { status: 201 });
}

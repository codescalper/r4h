import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getMemberFromCookie } from '@/lib/auth';
import path from 'path';

export const runtime = 'nodejs';

/**
 * POST /api/member/reports
 * Body: { path: string, filename?: string, size?: number }
 * Registers a newly uploaded report file into the MemberReport table.
 */
export async function POST(request: NextRequest) {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const body = await request.json();
  const { path: filePath, filename, size } = body;

  if (!filePath || typeof filePath !== 'string') {
    return Response.json({ error: 'File path is required.' }, { status: 400 });
  }

  // Derive filename from path if not provided
  const resolvedFilename = filename || path.basename(filePath);
  const resolvedSize = typeof size === 'number' ? size : 0;

  const report = await prisma.memberReport.create({
    data: {
      memberId: user.id,
      path: filePath,
      filename: resolvedFilename,
      size: resolvedSize,
    },
    select: {
      id: true,
      path: true,
      filename: true,
      size: true,
      uploadedAt: true,
    },
  });

  return Response.json({ report });
}

/**
 * DELETE /api/member/reports?id=xxx
 * Deletes a report (only the member who owns it can delete).
 */
export async function DELETE(request: NextRequest) {
  const user = await getMemberFromCookie();
  if (!user) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return Response.json({ error: 'Report ID is required.' }, { status: 400 });

  const report = await prisma.memberReport.findUnique({ where: { id } });
  if (!report) return Response.json({ error: 'Report not found.' }, { status: 404 });
  if (report.memberId !== user.id) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  await prisma.memberReport.delete({ where: { id } });
  return Response.json({ success: true });
}

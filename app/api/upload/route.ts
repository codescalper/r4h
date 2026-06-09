import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, resolve, extname } from 'path';
import { randomBytes } from 'crypto';
import { getAdminFromCookie, getMemberFromCookie } from '@/lib/auth';

const UPLOAD_ROOT = resolve(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_REPORT_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
const ALLOWED_FOLDERS = ['news', 'user_profile', 'user_reports', 'gallery', 'programs', 'misc'];

function ext(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
  };
  return map[mime] ?? '.bin';
}

export async function POST(req: NextRequest) {
  // Auth — must be admin or approved member
  const admin = await getAdminFromCookie();
  const member = await getMemberFromCookie();
  if (!admin && !member) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const folder = req.nextUrl.searchParams.get('folder') ?? 'misc';
  if (!ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
  }

  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files.length) {
    return NextResponse.json({ error: 'No files provided' }, { status: 400 });
  }
  if (files.length > 10) {
    return NextResponse.json({ error: 'Max 10 files per upload' }, { status: 400 });
  }

  const destDir = join(UPLOAD_ROOT, folder);
  if (!existsSync(destDir)) {
    await mkdir(destDir, { recursive: true });
  }

  const results: string[] = [];

  for (const file of files) {
    const allowedTypes = folder === 'user_reports' ? ALLOWED_REPORT_TYPES : ALLOWED_IMAGE_TYPES;
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `File type ${file.type} not allowed` }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds 10 MB limit' }, { status: 400 });
    }
    const filename = `${Date.now()}_${randomBytes(6).toString('hex')}${ext(file.type)}`;
    const dest = join(destDir, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(dest, buffer);
    results.push(`/api/files/${folder}/${filename}`);
  }

  return NextResponse.json({ paths: results });
}

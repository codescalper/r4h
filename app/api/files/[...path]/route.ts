import { NextRequest, NextResponse } from 'next/server';
import { createReadStream, existsSync, statSync } from 'fs';
import { join, extname, normalize, resolve } from 'path';
import { Readable } from 'stream';

const UPLOAD_ROOT = resolve(process.cwd(), 'uploads');

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  // Prevent path traversal
  const relative = path.join('/');
  const absolute = resolve(join(UPLOAD_ROOT, relative));
  if (!absolute.startsWith(UPLOAD_ROOT)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (!existsSync(absolute)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const ext = extname(absolute).toLowerCase();
  const mime = MIME_MAP[ext] ?? 'application/octet-stream';
  const stat = statSync(absolute);
  const nodeStream = createReadStream(absolute);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;
  return new NextResponse(webStream, {
    headers: {
      'Content-Type': mime,
      'Content-Length': String(stat.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

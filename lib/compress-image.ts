import sharp from 'sharp';

const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;
const PNG_COMPRESSION_LEVEL = 9;
const MAX_DIMENSION = 2048;

export async function compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (!mimeType.startsWith('image/')) return buffer;

  const image = sharp(buffer, { failOn: 'none' });
  const metadata = await image.metadata();

  const resized = image.resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: 'inside',
    withoutEnlargement: true,
  });

  let result: Buffer;

  switch (mimeType) {
    case 'image/jpeg':
      result = await resized
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: '4:2:0' })
        .toBuffer();
      break;

    case 'image/webp':
      result = await resized
        .webp({ quality: WEBP_QUALITY, effort: 6, smartSubsample: true })
        .toBuffer();
      break;

    case 'image/png':
      result = await resized
        .png({ compressionLevel: PNG_COMPRESSION_LEVEL, palette: true, quality: 80, effort: 10 })
        .toBuffer();
      break;

    case 'image/gif':
      if ((metadata.pages ?? 1) > 1) return buffer;
      result = await resized.webp({ quality: WEBP_QUALITY, effort: 6 }).toBuffer();
      break;

    default:
      return buffer;
  }

  // Fallback: only use compressed version if it's actually smaller
  return result.length < buffer.length ? result : buffer;
}
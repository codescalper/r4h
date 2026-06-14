import sharp from 'sharp';

const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;
const PNG_COMPRESSION_LEVEL = 9;

export async function compressImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (!mimeType.startsWith('image/')) return buffer;

  const image = sharp(buffer);
  const metadata = await image.metadata();

  switch (mimeType) {
    case 'image/jpeg':
      return image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toBuffer();
    case 'image/webp':
      return image.webp({ quality: WEBP_QUALITY }).toBuffer();
    case 'image/png':
      return image.png({ compressionLevel: PNG_COMPRESSION_LEVEL, palette: true }).toBuffer();
    case 'image/gif':
      if ((metadata.pages ?? 1) > 1) return buffer;
      return image.png({ compressionLevel: PNG_COMPRESSION_LEVEL }).toBuffer();
    default:
      return buffer;
  }
}

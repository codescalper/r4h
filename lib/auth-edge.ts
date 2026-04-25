/**
 * Edge Runtime-compatible auth helpers.
 * Uses `jose` (no Node.js built-ins) — safe for middleware.ts.
 * For API routes (Node.js runtime) use lib/auth.ts instead.
 */

import { jwtVerify } from 'jose';

export type JwtPayload = {
  id: string;
  email: string;
  role: 'admin' | 'member';
};

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET env var is not set');
  return new TextEncoder().encode(secret);
}

/**
 * Verify a JWT token in Edge Runtime (middleware).
 * Returns the decoded payload or null if invalid/expired.
 */
export async function verifyTokenEdge(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}

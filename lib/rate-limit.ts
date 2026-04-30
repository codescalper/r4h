/**
 * In-memory sliding-window rate limiter.
 * Safe for single-process deployments (IIS/iisnode with one worker).
 * For multi-instance deployments, replace with a Redis-backed solution.
 */

interface Window {
  timestamps: number[];
  blocked?: boolean;
}

const store = new Map<string, Window>();

// Prune entries older than 1 hour every 10 minutes to prevent memory leaks.
setInterval(
  () => {
    const cutoff = Date.now() - 60 * 60 * 1000;
    for (const [key, win] of store.entries()) {
      win.timestamps = win.timestamps.filter((t) => t > cutoff);
      if (win.timestamps.length === 0) store.delete(key);
    }
  },
  10 * 60 * 1000,
);

export interface RateLimitOptions {
  /** Max requests allowed within the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  /** How many requests remain in the current window */
  remaining: number;
  /** Unix ms when the oldest request in the window expires */
  resetAt: number;
}

/**
 * Check and record a rate-limit hit.
 * @param key  Unique key, e.g. `"login:192.168.1.1"`
 */
export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const cutoff = now - options.windowMs;

  let win = store.get(key);
  if (!win) {
    win = { timestamps: [] };
    store.set(key, win);
  }

  // Slide the window — drop timestamps outside the range
  win.timestamps = win.timestamps.filter((t) => t > cutoff);

  const count = win.timestamps.length;
  const resetAt = win.timestamps[0] ? win.timestamps[0] + options.windowMs : now + options.windowMs;

  if (count >= options.limit) {
    return { success: false, remaining: 0, resetAt };
  }

  win.timestamps.push(now);
  return { success: true, remaining: options.limit - count - 1, resetAt };
}

/** Extract client IP from a Next.js request (works behind IIS reverse proxy). */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list; first is the originating client
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

/** Convenience: build a 429 response with Retry-After header. */
export function rateLimitExceeded(resetAt: number): Response {
  const retryAfterSecs = Math.ceil((resetAt - Date.now()) / 1000);
  return Response.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSecs),
        'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
      },
    },
  );
}

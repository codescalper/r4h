/**
 * Next.js Instrumentation Hook
 * Runs once on server startup (both dev and prod).
 * Checks DB connectivity and logs critical env var presence.
 */

export async function register() {
  // Only run on the Node.js runtime (not edge)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log('\n========================================');
    console.log('  SERVER STARTUP DIAGNOSTICS');
    console.log('========================================');

    // ── 1. Environment variable checks ──────────────────────────
    const required = ['DATABASE_URL', 'JWT_SECRET'] as const;
    let envOk = true;
    for (const key of required) {
      const val = process.env[key];
      if (!val) {
        console.error(`[startup] ❌ Missing env var: ${key}`);
        envOk = false;
      } else {
        // Log a masked version so you can confirm it's loaded without leaking secrets
        const masked = val.slice(0, 6) + '…' + val.slice(-4);
        console.log(`[startup] ✅ ${key} = ${masked}`);
      }
    }

    const optional = ['NEXT_PUBLIC_BASE_URL', 'EMAIL'] as const;
    for (const key of optional) {
      const val = process.env[key];
      console.log(`[startup] ℹ️  ${key} = ${val ?? '(not set)'}`);
    }

    if (!envOk) {
      console.error('[startup] ⚠️  One or more required env vars are missing — DB / auth will fail.\n');
    }

    // ── 2. Database connectivity check ──────────────────────────
    try {
      // Dynamically import so this module is never bundled into the edge runtime
      const { default: prisma } = await import('@/lib/prisma');
      await prisma.$queryRaw`SELECT 1`;
      console.log('[startup] ✅ Database connected successfully');

      // Verify the admin table exists and has at least one row
      const adminCount = await prisma.admin.count();
      console.log(`[startup] ℹ️  Admin table row count: ${adminCount}`);
      if (adminCount === 0) {
        console.warn('[startup] ⚠️  No admin accounts found — run the seed script or create one manually.');
      }
    } catch (err) {
      console.error('[startup] ❌ DATABASE CONNECTION FAILED:');
      console.error(err);
      console.error('[startup] ⚠️  Check DATABASE_URL and that the DB server is reachable.\n');
    }

    console.log('========================================\n');
  }
}

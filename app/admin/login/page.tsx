'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed.'); return; }
      router.push('/admin/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 p-4 relative overflow-hidden">

      {/* Background SVG decoration */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full text-primary" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
          <style>{`@media(prefers-reduced-motion:no-preference){.r4h-dash{animation:r4h-scroll 8s linear infinite}}@keyframes r4h-scroll{to{stroke-dashoffset:-240}}`}</style>
        </defs>
        <ellipse cx="50%" cy="50%" rx="44%" ry="40%" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="56"/>
        <ellipse cx="50%" cy="50%" rx="32%" ry="28%" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1.5" strokeDasharray="10 7" className="r4h-dash"/>
      </svg>

      {/* Runner silhouette — decorative */}
      <svg aria-hidden="true" className="pointer-events-none absolute bottom-10 right-8 opacity-[0.06] dark:opacity-[0.04] w-48 h-48 text-primary" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <circle cx="78" cy="16" r="9" fill="currentColor"/>
        <path d="M78 25 C74 38 68 48 62 58 L50 82 M78 25 C84 38 92 48 106 56" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M62 58 C56 70 50 80 44 96 M62 58 C70 70 74 82 72 97" stroke="currentColor" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M72 35 C62 42 54 46 44 44 M84 35 C92 40 100 48 106 56" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-foreground text-2xl font-black mb-4 shadow-lg shadow-primary/20">
            <svg viewBox="0 0 40 40" className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="R">
              <text x="6" y="30" fontSize="26" fontWeight="900" fontFamily="system-ui,sans-serif">R</text>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Run4Health</h1>
          <p className="text-muted-foreground mt-1 text-sm">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <h2 className="text-xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to your admin account</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition text-sm"
                />
                <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs px-1">
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="/admin/forgot-password" className="text-sm text-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-bold text-sm transition shadow-sm shadow-primary/20"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-6">
          Run4Health Admin — Authorized access only
        </p>
      </div>
    </div>
  );
}

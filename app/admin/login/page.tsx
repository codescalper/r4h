'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

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


      <div className="w-full max-w-md relative z-10">
        {/* Back button */}
        <div className="mb-4 text-left">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            Back to site
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card border border-border mb-4 shadow-lg shadow-primary/20 overflow-hidden">
            <Image src="/logo.png" alt="Run4Health" width={56} height={56} className="object-contain" priority />
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

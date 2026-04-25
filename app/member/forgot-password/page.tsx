'use client';

import { useState } from 'react';

export default function MemberForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/member/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white text-2xl font-black mb-4 shadow-lg">🏃</div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Run4Health</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Member Portal</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📬</div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Check your inbox</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                If your email is linked to an approved account, we've sent a reset link. It expires in <strong>1 hour</strong>.
              </p>
              <a href="/member/login" className="text-primary hover:underline text-sm font-medium">← Back to login</a>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Forgot your password?</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">
                Enter your email address and we'll send you a reset link.
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2 mb-5">
                ℹ️ Reset is only available for <strong>approved members</strong>.
              </p>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition text-sm"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold text-sm transition">
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <div className="mt-5 text-center">
                <a href="/member/login" className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">← Back to login</a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

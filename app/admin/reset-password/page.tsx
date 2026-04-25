'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Reset failed.'); return; }
      setSuccess(true);
      setTimeout(() => router.push('/admin/login'), 2500);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) return (
    <div className="text-center py-8">
      <p className="text-red-600 font-medium">Invalid or missing reset token.</p>
      <a href="/admin/forgot-password" className="mt-4 inline-block text-primary hover:underline text-sm">Request new link</a>
    </div>
  );

  return (
    <>
      {success ? (
        <div className="text-center py-4">
          <div className="text-4xl mb-3">✅</div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Password updated!</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Redirecting you to login…</p>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Create new password</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Choose a strong password for your admin account.</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">New Password</label>
              <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Confirm Password</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition text-sm"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold text-sm transition">
              {loading ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </>
      )}
    </>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white text-2xl font-black mb-4 shadow-lg">R</div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Run4Health</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Admin Portal</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-8">
          <Suspense fallback={<div className="py-8 text-center text-zinc-400 text-sm">Loading…</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

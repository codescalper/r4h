'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner";

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordsMatch = password.length > 0 && confirm.length > 0 && password === confirm
  const passwordsDontMatch = confirm.length > 0 && password !== confirm

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/member/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to set password.'); setError(data.error || 'Failed to set password.'); return; }
      toast.success("Password set successfully! Welcome to Run4Health!");
      setSuccess(true);
      setTimeout(() => router.push('/member/login'), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!token) return (
    <div className="text-center py-8">
      <p className="text-red-600 font-medium">Invalid or missing token.</p>
      <p className="text-sm text-zinc-400 mt-2">Please use the link from your approval email.</p>
    </div>
  );

  return success ? (
    <div className="text-center py-4">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">You're all set!</h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-2">Your password has been set. Welcome to Run4Health!</p>
      <p className="text-xs text-zinc-400">Redirecting to login…</p>
    </div>
  ) : (
    <>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🔐</div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">Set your password</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Welcome! You've been approved. Create a password to access your member dashboard.
        </p>
      </div>

      {error && <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">New Password</label>
          <div className="relative">
            <input type={showPass ? 'text' : 'password'} required minLength={8} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition text-sm"
            />
            <button type="button" onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs px-1">
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Confirm Password</label>
          <div className="relative">
            <input type={showConfirm ? 'text' : 'password'} required value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className={`w-full px-4 py-3 pr-12 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition text-sm ${
                passwordsMatch ? 'border-green-500 dark:border-green-400' : passwordsDontMatch ? 'border-red-400 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-700'
              }`}
            />
            <button type="button" onClick={() => setShowConfirm(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 text-xs px-1">
              {showConfirm ? 'Hide' : 'Show'}
            </button>
          </div>
          <AnimatedMatch match={passwordsMatch} mismatch={passwordsDontMatch} />
        </div>

        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-xl p-3">
          <p className="text-xs text-primary">
            💡 Use at least 8 characters with a mix of letters, numbers, and symbols for a strong password.
          </p>
        </div>

        <button type="submit" disabled={loading || passwordsDontMatch}
          className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-bold text-sm transition">
          {loading ? 'Setting password…' : 'Set Password & Join'}
        </button>
      </form>
    </>
  );
}

function AnimatedMatch({ match, mismatch }: { match: boolean; mismatch: boolean }) {
  if (!match && !mismatch) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium ${
        match ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
      }`}
    >
      <motion.span
        key={match ? 'check' : 'x'}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        {match ? '✓' : '✗'}
      </motion.span>
      {match ? 'Passwords match' : 'Passwords do not match'}
    </motion.div>
  )
}

export default function MemberSetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 dark:from-zinc-900 dark:to-zinc-800 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white text-2xl font-black mb-4 shadow-lg">🏃</div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Run4Health</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Welcome aboard!</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 p-8">
          <Suspense fallback={<div className="py-8 text-center text-zinc-400 text-sm">Loading…</div>}>
            <SetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

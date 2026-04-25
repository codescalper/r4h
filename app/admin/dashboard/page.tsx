'use client';

import { useState, useEffect, useCallback, Fragment, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarSeparator,
} from '@/components/ui/sidebar';

// ─── Types ────────────────────────────────────────────────────────────────────

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  gender: string;
  age: number | null;
  fitnessLevel: string;
  profilePhotoPath: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
};

type Donation = {
  id: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  message: string | null;
  status: string;
  createdAt: string;
};

type Stats = {
  totalMembers: number;
  pendingMembers: number;
  approvedMembers: number;
  rejectedMembers: number;
  totalDonationsAmount: number;
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    APPROVED: 'bg-primary/10 text-primary dark:bg-primary/10 text-primary',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    COMPLETED: 'bg-primary/10 text-primary dark:bg-primary/10 text-primary',
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || 'bg-zinc-100 text-zinc-600'}`}>
      {status}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, accent }: { label: string; value: string | number; icon: string; accent?: string }) {
  return (
    <div className={`rounded-2xl border ${accent || 'border-zinc-200 dark:border-zinc-700'} bg-white dark:bg-zinc-900 p-6 flex items-center gap-4 shadow-sm`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-black text-zinc-900 dark:text-white">{value}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Members Tab ──────────────────────────────────────────────────────────────

function MembersTab({ onAction }: { onAction: () => void }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [makeAdminFor, setMakeAdminFor] = useState<string | null>(null);
  const [makeAdminPwd, setMakeAdminPwd] = useState('');
  const [makeAdminLoading, setMakeAdminLoading] = useState(false);
  const [makeAdminMsg, setMakeAdminMsg] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const q = filter === 'ALL' ? '' : `?status=${filter}`;
    const res = await fetch(`/api/admin/members${q}`);
    const data = await res.json();
    setMembers(data.members || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  async function updateStatus(id: string, status: 'APPROVED' | 'REJECTED') {
    setActionLoading(id + status);
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) { fetchMembers(); onAction(); }
    } finally {
      setActionLoading(null);
    }
  }

  async function handleMakeAdmin(m: Member) {
    if (!makeAdminPwd.trim()) return;
    setMakeAdminLoading(true);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: m.email, name: `${m.firstName} ${m.lastName}`, password: makeAdminPwd }),
      });
      const data = await res.json();
      if (res.ok) {
        setMakeAdminMsg({ id: m.id, msg: `Admin account created for ${m.email}. They can now log in at /admin/login.`, ok: true });
      } else {
        setMakeAdminMsg({ id: m.id, msg: data.error || 'Failed to create admin.', ok: false });
      }
    } finally {
      setMakeAdminLoading(false);
      setMakeAdminFor(null);
      setMakeAdminPwd('');
    }
  }

  const filters: Array<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'> = ['ALL', 'PENDING', 'APPROVED', 'REJECTED'];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${filter === f ? 'bg-primary text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading members…</div>
      ) : members.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">No members found.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Member</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300 hidden lg:table-cell">City / Fitness</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300 hidden sm:table-cell">Joined</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {members.map(m => (
                <Fragment key={m.id}>
                <tr className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {m.profilePhotoPath ? (
                        <img src={m.profilePhotoPath} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 dark:bg-primary/10 text-primary text-primary flex items-center justify-center font-bold text-sm">
                          {m.firstName[0]}{m.lastName[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-zinc-900 dark:text-white">{m.firstName} {m.lastName}</p>
                        <p className="text-xs text-zinc-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-zinc-600 dark:text-zinc-400">{m.phone}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-zinc-600 dark:text-zinc-400">{m.city}</span>
                    <span className="ml-2 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">{m.fitnessLevel}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 hidden sm:table-cell text-zinc-400 text-xs">{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {m.status === 'PENDING' && (
                        <>
                          <button onClick={() => updateStatus(m.id, 'APPROVED')} disabled={!!actionLoading}
                            className="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold disabled:opacity-50 transition">
                            {actionLoading === m.id + 'APPROVED' ? '…' : 'Approve'}
                          </button>
                          <button onClick={() => updateStatus(m.id, 'REJECTED')} disabled={!!actionLoading}
                            className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold disabled:opacity-50 transition">
                            {actionLoading === m.id + 'REJECTED' ? '…' : 'Reject'}
                          </button>
                        </>
                      )}
                      {m.status === 'APPROVED' && (
                    <>
                      <button onClick={() => updateStatus(m.id, 'REJECTED')} disabled={!!actionLoading}
                        className="px-3 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-zinc-700 dark:text-zinc-300 text-xs font-semibold disabled:opacity-50 transition">
                        Revoke
                      </button>
                      <button
                        onClick={() => { setMakeAdminFor(makeAdminFor === m.id ? null : m.id); setMakeAdminPwd(''); setMakeAdminMsg(null); }}
                        disabled={!!actionLoading}
                        className="px-3 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold disabled:opacity-50 transition">
                        Make Admin
                      </button>
                    </>
                  )}
                  {m.status === 'REJECTED' && (
                    <button onClick={() => updateStatus(m.id, 'APPROVED')} disabled={!!actionLoading}
                      className="px-3 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-primary/10 dark:hover:bg-primary/10 text-zinc-700 dark:text-zinc-300 text-xs font-semibold disabled:opacity-50 transition">
                      Re-approve
                    </button>
                  )}
                    </div>
                  </td>
                </tr>
                {makeAdminFor === m.id && (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 bg-primary/5 dark:bg-primary/10 border-t border-primary/20">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          Set password for <strong>{m.firstName} {m.lastName}</strong> as admin:
                        </span>
                        <input
                          type="password"
                          value={makeAdminPwd}
                          onChange={e => setMakeAdminPwd(e.target.value)}
                          placeholder="New admin password (min 8 chars)"
                          className="flex-1 min-w-[200px] px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <button
                          onClick={() => handleMakeAdmin(m)}
                          disabled={makeAdminLoading || makeAdminPwd.length < 8}
                          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold disabled:opacity-50 transition">
                          {makeAdminLoading ? '…' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => { setMakeAdminFor(null); setMakeAdminPwd(''); }}
                          className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs font-semibold transition hover:bg-zinc-300 dark:hover:bg-zinc-600">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {makeAdminMsg?.id === m.id && (
                  <tr>
                    <td colSpan={6} className={`px-4 py-2 text-sm font-medium ${makeAdminMsg.ok ? 'bg-primary/5 text-primary' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                      {makeAdminMsg.msg}
                      <button onClick={() => setMakeAdminMsg(null)} className="ml-3 underline text-xs opacity-70 hover:opacity-100">Dismiss</button>
                    </td>
                  </tr>
                )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Donations Tab ────────────────────────────────────────────────────────────

function DonationsTab() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/donations')
      .then(r => r.json())
      .then(d => { setDonations(d.donations || []); setLoading(false); });
  }, []);

  return (
    <div>
      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading donations…</div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">No donations yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Donor</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300 hidden sm:table-cell">Method</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {donations.map(d => (
                <tr key={d.id} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-zinc-900 dark:text-white">{d.donorName}</p>
                    <p className="text-xs text-zinc-400">{d.donorEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">
                    ₹{d.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-zinc-500">{d.paymentMethod}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3 hidden md:table-cell text-zinc-400 text-xs">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Admins Tab ───────────────────────────────────────────────────────────────

function AdminsTab() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/admins');
    const data = await res.json();
    setAdmins(data.admins || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;
    setFormLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: `Admin "${form.name}" (${form.email}) created successfully.`, ok: true });
        setForm({ name: '', email: '', password: '' });
        fetchAdmins();
      } else {
        setMsg({ text: data.error || 'Failed to create admin.', ok: false });
      }
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleteLoading(id);
    try {
      const res = await fetch(`/api/admin/admins/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) { fetchAdmins(); }
      else { setMsg({ text: data.error || 'Failed to remove admin.', ok: false }); }
    } finally {
      setDeleteLoading(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Create Admin Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-1">Add New Admin</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Create a new admin account or promote an approved member by entering their email.</p>
        {msg && (
          <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium flex items-start justify-between gap-3 ${msg.ok ? 'bg-primary/10 text-primary' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} className="text-xs underline opacity-70 hover:opacity-100 flex-shrink-0">Dismiss</button>
          </div>
        )}
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="John Doe"
              required
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@example.com"
              required
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-zinc-500 mb-1">Password <span className="font-normal">(min 8 characters)</span></label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Strong password"
              required
              minLength={8}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold disabled:opacity-50 transition">
              {formLoading ? 'Creating…' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>

      {/* Admins List */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-4">All Admins</h2>
        {loading ? (
          <div className="text-center py-8 text-zinc-400">Loading…</div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8 text-zinc-400">No admins found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Admin</th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300 hidden sm:table-cell">Created</th>
                  <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {admins.map(a => (
                  <tr key={a.id} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {a.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-white">{a.name}</p>
                          <p className="text-xs text-zinc-400">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-zinc-400 text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={deleteLoading === a.id}
                        className="px-3 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold disabled:opacity-50 transition">
                        {deleteLoading === a.id ? '…' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────

function DashboardOverview({ stats }: { stats: Stats | null }) {
  if (!stats) return <div className="text-center py-12 text-zinc-400">Loading stats…</div>;
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Members" value={stats.totalMembers} icon="👥" />
        <StatCard label="Pending Review" value={stats.pendingMembers} icon="⏳" accent="border-yellow-200 dark:border-yellow-800" />
        <StatCard label="Approved Members" value={stats.approvedMembers} icon="✅" accent="border-primary/20 dark:border-primary/30" />
        <StatCard label="Total Donations" value={`₹${stats.totalDonationsAmount.toLocaleString()}`} icon="💚" accent="border-emerald-200 dark:border-emerald-800" />
      </div>
      <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl p-6">
        <h3 className="font-bold text-zinc-900 dark:text-white mb-1">👋 Welcome, Admin</h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You have <strong>{stats.pendingMembers}</strong> pending application{stats.pendingMembers !== 1 ? 's' : ''} waiting for review.
          {stats.pendingMembers > 0 ? ' Head over to the Members tab to take action.' : ' All caught up!'}
        </p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'members' | 'donations' | 'admins';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);

  const fetchStats = useCallback(async () => {
    const res = await fetch('/api/admin/stats');
    if (res.ok) { const d = await res.json(); setStats(d); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  async function handleLogout() {
    await fetch('/api/auth/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  const navItems: Array<{ tab: Tab; label: string; icon: string; badge?: number }> = [
    { tab: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { tab: 'members', label: 'Members', icon: '👥', badge: stats?.pendingMembers },
    { tab: 'donations', label: 'Donations', icon: '💚' },
    { tab: 'admins', label: 'Admins', icon: '🛡️' },
  ];

  const tabTitles: Record<Tab, string> = {
    dashboard: 'Dashboard Overview',
    members: 'Member Management',
    donations: 'Donation Records',
    admins: 'Admin Management',
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
        {/* ─── Sidebar ─── */}
        <Sidebar collapsible="offcanvas" className="border-r border-zinc-200 dark:border-zinc-800">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-base flex-shrink-0">R</div>
              <div>
                <p className="font-black text-zinc-900 dark:text-white text-sm leading-tight">Run4Health</p>
                <p className="text-xs text-zinc-400">Admin Panel</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarSeparator />

          <SidebarContent className="px-2 py-3">
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.tab}>
                  <SidebarMenuButton
                    isActive={activeTab === item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className="w-full flex items-center justify-between"
                  >
                    <span className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                    </span>
                    {item.badge != null && item.badge > 0 && (
                      <span className="ml-auto bg-yellow-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* ─── Main Content ─── */}
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* Top bar */}
          <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
            <SidebarTrigger className="flex-shrink-0" />
            <div>
              <h1 className="text-lg font-bold text-zinc-900 dark:text-white">{tabTitles[activeTab]}</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            {activeTab === 'dashboard' && <DashboardOverview stats={stats} />}
            {activeTab === 'members' && <MembersTab onAction={fetchStats} />}
            {activeTab === 'donations' && <DonationsTab />}
            {activeTab === 'admins' && <AdminsTab />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

'use client';

import React, { useState, useEffect, useCallback, Fragment, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Check, X, Trash2, Loader2, ImagePlus, Tag, Eye, LayoutDashboard, Users, Heart, ShieldCheck, FileText, Images, Dumbbell, LogOut, Mail, MessageSquare, Send, Megaphone, ChevronRight } from 'lucide-react';
import GalleryMultiUpload, { type GalleryTag as GalleryTagType } from '@/components/admin/gallery-multi-upload';

const TipTapEditor = dynamic(() => import('@/components/editor/tiptap-editor'), { ssr: false });
const TipTapViewer = dynamic(() => import('@/components/editor/tiptap-viewer'), { ssr: false });
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

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: React.ElementType; accent?: string }) {
  return (
    <div className={`rounded-2xl border bg-card p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow ${accent || 'border-border'}`}>
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black text-foreground leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1.5 font-medium truncate">{label}</p>
      </div>
    </div>
  );
}

// ─── Members Tab ──────────────────────────────────────────────────────────────

function MembersTab({ onAction }: { onAction: () => void }) {
  const router = useRouter();
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
        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Member</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">City / Fitness</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Joined</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map(m => (
                <Fragment key={m.id}>
                <tr className="bg-card hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => router.push(`/admin/dashboard/members/${m.id}`)}
                      className="flex items-center gap-3 group text-left hover:opacity-80 transition-opacity"
                    >
                      {m.profilePhotoPath ? (
                        <img src={m.profilePhotoPath} alt="" className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {m.firstName[0]}{m.lastName[0]}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                          {m.firstName} {m.lastName}
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </button>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{m.phone}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-muted-foreground">{m.city}</span>
                    <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{m.fitnessLevel}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">{new Date(m.createdAt).toLocaleDateString()}</td>
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
        <div className="text-center py-12 text-muted-foreground">Loading donations…</div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No donations yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Donor</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Method</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations.map(d => (
                <tr key={d.id} className="bg-card hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-foreground">{d.donorName}</p>
                    <p className="text-xs text-muted-foreground">{d.donorEmail}</p>
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">
                    ₹{d.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{d.paymentMethod}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs">{new Date(d.createdAt).toLocaleDateString()}</td>
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
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-1">Add New Admin</h2>
        <p className="text-sm text-muted-foreground mb-4">Create a new admin account or promote an approved member by entering their email.</p>
        {msg && (
          <div className={`mb-4 px-4 py-2.5 rounded-lg text-sm font-medium flex items-start justify-between gap-3 ${msg.ok ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} className="text-xs underline opacity-70 hover:opacity-100 flex-shrink-0">Dismiss</button>
          </div>
        )}
        <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Full Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="John Doe"
              required
              className="w-full px-3 py-2 rounded-lg border border-input bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="admin@example.com"
              required
              className="w-full px-3 py-2 rounded-lg border border-input bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">Password <span className="font-normal">(min 8 characters)</span></label>
            <input
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Strong password"
              required
              minLength={8}
              className="w-full px-3 py-2 rounded-lg border border-input bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={formLoading}
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold disabled:opacity-50 transition">
              {formLoading ? 'Creating…' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>

      {/* Admins List */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-4">All Admins</h2>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading…</div>
        ) : admins.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No admins found.</div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Admin</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Created</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.map(a => (
                  <tr key={a.id} className="bg-card hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {a.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(a.id)}
                        disabled={deleteLoading === a.id}
                        className="px-3 py-1 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-semibold disabled:opacity-50 transition">
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

// ─── Messages Tab ─────────────────────────────────────────────────────────────

type AdminMessage = {
  id: string;
  subject: string;
  body: string;
  scope: 'PERSONAL' | 'BROADCAST';
  read: boolean;
  readAt: string | null;
  createdAt: string;
  member: { id: string; firstName: string; lastName: string; email: string };
  admin: { id: string; name: string; email: string };
};

type MemberPicker = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
};

function MessagesTab() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [members, setMembers] = useState<MemberPicker[]>([]);
  const [loading, setLoading] = useState(true);

  const [recipient, setRecipient] = useState<string>('__all__');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendMsg, setSendMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [scopeFilter, setScopeFilter] = useState<'ALL' | 'PERSONAL' | 'BROADCAST'>('ALL');
  const [preview, setPreview] = useState<AdminMessage | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [m, mems] = await Promise.all([
        fetch('/api/admin/messages').then((r) => r.json()),
        fetch('/api/admin/members?status=APPROVED&limit=200').then((r) => r.json()),
      ]);
      setMessages(m.messages ?? []);
      setMembers(
        (mems.members ?? []).map((mm: MemberPicker) => ({
          id: mm.id,
          firstName: mm.firstName,
          lastName: mm.lastName,
          email: mm.email,
          status: mm.status,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const reset = () => {
    setSubject('');
    setBody('');
    setRecipient('__all__');
    setSendMsg(null);
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setSendMsg({ text: 'Subject and message body are required.', ok: false });
      return;
    }
    setSending(true);
    setSendMsg(null);
    try {
      const payload: { subject: string; body: string; memberId?: string } = {
        subject: subject.trim(),
        body: body.trim(),
      };
      if (recipient !== '__all__') payload.memberId = recipient;
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setSendMsg({ text: data.error || 'Failed to send message.', ok: false });
        return;
      }
      const recipientCount = data.sent ?? 1;
      const isBroadcast = recipient === '__all__';
      setSendMsg({
        text: isBroadcast
          ? `Broadcast sent to ${recipientCount} approved member${recipientCount !== 1 ? 's' : ''}.`
          : 'Personal message sent successfully.',
        ok: true,
      });
      reset();
      loadAll();
    } catch {
      setSendMsg({ text: 'Network error. Please try again.', ok: false });
    } finally {
      setSending(false);
    }
  };

  const filtered = messages.filter((m) => scopeFilter === 'ALL' || m.scope === scopeFilter);

  return (
    <div className="space-y-6">
      {/* Composer */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="w-4 h-4 text-primary" /> Compose Message
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Send to</Label>
              <Select value={recipient} onValueChange={setRecipient}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All approved members (broadcast)</SelectItem>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.firstName} {m.lastName} — {m.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {recipient === '__all__'
                  ? 'Each approved member gets a personal copy in their inbox.'
                  : 'This member receives a personal, addressed email.'}
              </p>
            </div>
            <div>
              <Label>Subject *</Label>
              <Input
                className="mt-1"
                placeholder="e.g. Update on the Sunday marathon"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={200}
              />
            </div>
          </div>
          <div>
            <Label>Message *</Label>
            <Textarea
              className="mt-1 h-40"
              placeholder="Write your message here. Plain text only — new lines are preserved."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={10000}
            />
            <p className="text-xs text-muted-foreground mt-1">{body.length} / 10000</p>
          </div>
          {sendMsg && (
            <div
              className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-start justify-between gap-3 ${
                sendMsg.ok
                  ? 'bg-primary/10 text-primary'
                  : 'bg-destructive/10 text-destructive'
              }`}
            >
              <span>{sendMsg.text}</span>
              <button
                onClick={() => setSendMsg(null)}
                className="text-xs underline opacity-70 hover:opacity-100 flex-shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button onClick={handleSend} disabled={sending} className="gap-2">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {recipient === '__all__' ? 'Send broadcast' : 'Send message'}
            </Button>
            <Button variant="outline" onClick={reset} disabled={sending}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Sent Messages
          </h2>
          <div className="flex items-center gap-1.5">
            {(['ALL', 'PERSONAL', 'BROADCAST'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScopeFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  scopeFilter === s
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border hover:border-primary/40'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">
            No messages sent yet. Use the composer above to send your first one.
          </p>
        ) : (
          <div className="space-y-2">
            {filtered.map((m) => (
              <button
                key={m.id}
                onClick={() => setPreview(m)}
                className="w-full text-left flex items-start gap-3 p-4 rounded-xl border border-border bg-white dark:bg-zinc-900 hover:border-primary/30 transition-colors"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    m.scope === 'BROADCAST'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {m.scope === 'BROADCAST' ? (
                    <Megaphone className="w-4 h-4" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span
                      className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
                        m.scope === 'BROADCAST'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {m.scope}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      To: {m.member.firstName} {m.member.lastName}
                    </span>
                    {m.read ? (
                      <span className="text-[10px] text-muted-foreground">· Read</span>
                    ) : (
                      <span className="text-[10px] text-primary font-semibold">· Unread</span>
                    )}
                  </div>
                  <p className="font-semibold text-sm text-foreground truncate">{m.subject}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview dialog */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{preview?.subject}</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span
                  className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
                    preview.scope === 'BROADCAST'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {preview.scope}
                </span>
                <span>To: {preview.member.firstName} {preview.member.lastName} ({preview.member.email})</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Sent on{' '}
                {new Date(preview.createdAt).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap break-words">
                {preview.body}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Dashboard Overview ───────────────────────────────────────────────────────

function DashboardOverview({ stats }: { stats: Stats | null }) {
  if (!stats) return <div className="text-center py-12 text-muted-foreground">Loading stats…</div>;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Members" value={stats.totalMembers} icon={Users} />
        <StatCard label="Pending Review" value={stats.pendingMembers} icon={Loader2} accent="border-yellow-200 dark:border-yellow-800" />
        <StatCard label="Approved Members" value={stats.approvedMembers} icon={Check} accent="border-primary/20" />
        <StatCard label="Total Donations" value={`₹${stats.totalDonationsAmount.toLocaleString()}`} icon={Heart} accent="border-primary/20" />
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 90% 50%, var(--color-primary) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <h3 className="font-black text-foreground text-lg">Good to see you, Admin 👋</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-lg">
            {stats.pendingMembers > 0
              ? `You have ${stats.pendingMembers} pending application${stats.pendingMembers !== 1 ? 's' : ''} waiting for review. Head over to the Members tab to take action.`
              : 'All caught up! No pending member applications at this time.'}
          </p>
          {stats.pendingMembers > 0 && (
            <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">{stats.pendingMembers} awaiting action</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Contacts Tab ─────────────────────────────────────────────────────────────
function ContactsTab() {
  interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
  }

  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/contact${unreadOnly ? '?unread=true' : ''}`);
      const data = await res.json();
      setSubmissions(data.submissions ?? []);
    } finally {
      setLoading(false);
    }
  }, [unreadOnly]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  async function toggleRead(id: string, current: boolean) {
    await fetch('/api/admin/contact', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read: !current }),
    });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, read: !current } : s));
  }

  const unreadCount = submissions.filter(s => !s.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Contact Inbox</h2>
          {unreadCount > 0 && <p className="text-sm text-muted-foreground mt-0.5">{unreadCount} unread message{unreadCount !== 1 ? 's' : ''}</p>}
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
            <input type="checkbox" checked={unreadOnly} onChange={e => setUnreadOnly(e.target.checked)} className="accent-primary" />
            Unread only
          </label>
          <Button variant="outline" size="sm" onClick={fetchSubmissions}><Loader2 className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : 'hidden'}`} />Refresh</Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">{unreadOnly ? 'No unread messages' : 'No messages yet'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {submissions.map(s => (
            <div
              key={s.id}
              className={`border rounded-lg overflow-hidden transition-colors ${s.read ? 'border-border bg-card' : 'border-primary/30 bg-primary/5'}`}
            >
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${s.read ? 'bg-muted-foreground/30' : 'bg-primary'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium text-foreground ${!s.read ? 'font-semibold' : ''}`}>{s.name}</span>
                    <span className="text-xs text-muted-foreground">{s.email}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{s.subject}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <button
                    onClick={e => { e.stopPropagation(); toggleRead(s.id, s.read); }}
                    className="text-xs px-2 py-0.5 rounded border border-border hover:border-primary/50 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {s.read ? 'Mark unread' : 'Mark read'}
                  </button>
                </div>
              </div>
              {expandedId === s.id && (
                <div className="px-4 pb-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mt-3 mb-1 uppercase tracking-wide">Message</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{s.message}</p>
                  <div className="mt-3">
                    <a href={`mailto:${s.email}?subject=Re: ${encodeURIComponent(s.subject)}`} className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <Mail className="w-3.5 h-3.5" /> Reply via email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'dashboard' | 'members' | 'donations' | 'admins' | 'posts' | 'gallery' | 'programs' | 'contacts' | 'messages';

// ─── Post types ─────────────────────────────────────────────────────────────────────

type PostStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
type PostCategory = 'EVENT_RECAP' | 'HEALTH_TIPS' | 'COMMUNITY_STORY' | 'ANNOUNCEMENT';

const POST_CAT_LABELS: Record<PostCategory, string> = {
  EVENT_RECAP: 'Event Recap', HEALTH_TIPS: 'Health Tips',
  COMMUNITY_STORY: 'Community Story', ANNOUNCEMENT: 'Announcement',
};
const POST_STATUS_COLORS: Record<PostStatus, string> = {
  DRAFT: 'bg-zinc-200 text-zinc-700',
  PENDING: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700',
};

interface AdminPost {
  id: string; title: string; category: PostCategory; status: PostStatus;
  createdAt: string; publishedAt: string | null; rejectionNote: string | null;
  content: string; coverImagePath: string | null;
  member: { firstName: string; lastName: string; email: string } | null;
  admin: { name: string; email: string } | null;
}

// ─── Posts Tab ──────────────────────────────────────────────────────────────────────

function PostsTab() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PostStatus | 'ALL'>('ALL');
  const [preview, setPreview] = useState<AdminPost | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const url = filter === 'ALL' ? '/api/admin/posts' : `/api/admin/posts?status=${filter}`;
    const res = await fetch(url);
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const updateStatus = async (id: string, status: PostStatus, note?: string) => {
    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectionNote: note }),
    });
    setRejecting(null); setRejectNote('');
    loadPosts();
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
    loadPosts();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 flex-wrap">
        {(['ALL', 'PENDING', 'APPROVED', 'DRAFT', 'REJECTED'] as const).map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border hover:border-primary/40'
            }`}>{s === 'ALL' ? 'All Posts' : s}
          </button>
        ))}
      </div>

      {loading ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : posts.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">No posts found.</p>
      ) : (
        <div className="space-y-2">
          {posts.map(p => (
            <div key={p.id} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white dark:bg-zinc-900 hover:border-primary/30 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${POST_STATUS_COLORS[p.status]}`}>{p.status}</span>
                  <span className="text-xs text-muted-foreground">{POST_CAT_LABELS[p.category]}</span>
                  <span className="text-xs text-muted-foreground">· {p.member ? `${p.member.firstName} ${p.member.lastName}` : p.admin?.name ?? 'Unknown'}</span>
                </div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-white">{p.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString('en-IN')}</p>
                {p.status === 'REJECTED' && p.rejectionNote && <p className="text-xs text-destructive mt-0.5">{p.rejectionNote}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setPreview(p)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Preview">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                {p.status === 'PENDING' && (
                  <>
                    <button onClick={() => updateStatus(p.id, 'APPROVED')} className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors" title="Approve">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => { setRejecting(p.id); setRejectNote(''); }} className="p-1.5 rounded-lg text-destructive hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Reject">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
                <button onClick={() => deletePost(p.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{preview?.title}</DialogTitle></DialogHeader>
          {preview && <TipTapViewer content={preview.content} />}
        </DialogContent>
      </Dialog>

      {/* Reject modal */}
      <Dialog open={!!rejecting} onOpenChange={() => setRejecting(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Post</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Reason (shown to author)</Label>
            <Textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} placeholder="Why is this being rejected?" className="h-24" />
            <div className="flex gap-2">
              <Button onClick={() => rejecting && updateStatus(rejecting, 'REJECTED', rejectNote)} className="flex-1">Reject</Button>
              <Button variant="outline" onClick={() => setRejecting(null)}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Gallery Tab ─────────────────────────────────────────────────────────────────────

interface GalleryImage {
  id: string; path: string; altText: string | null; caption: string | null;
  createdAt: string;
  tags: { tag: GalleryTagType }[];
}

function GalleryAdminTab() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [tags, setTags] = useState<GalleryTagType[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [g, t] = await Promise.all([
      fetch('/api/gallery').then(r => r.json()),
      fetch('/api/admin/gallery/tags').then(r => r.json()),
    ]);
    setImages(g.images ?? []); setTags(t.tags ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const deleteImage = async (id: string) => {
    if (!window.confirm('Delete this image?')) return;
    await fetch('/api/admin/gallery', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div className="space-y-6">
      {/* Multi-upload panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-primary" />
            Upload Images
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GalleryMultiUpload
            tags={tags}
            onUploaded={load}
            onNewTag={(tag) => setTags(prev => [...prev.filter(t => t.id !== tag.id), tag])}
          />
        </CardContent>
      </Card>

      {/* Image grid */}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">
          No images yet. Upload some above!
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map(im => (
            <div key={im.id} className="relative group rounded-xl overflow-hidden border border-border aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.path} alt={im.altText ?? ''} className="w-full h-full object-cover" />
              {im.tags[0] && (
                <div className="absolute top-1.5 left-1.5 bg-primary/90 text-white text-xs px-2 py-0.5 rounded-full">
                  {im.tags[0].tag.name}
                </div>
              )}
              {im.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                  <p className="text-white text-[10px] truncate">{im.caption}</p>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => deleteImage(im.id)} className="w-8 h-8 rounded-full bg-destructive flex items-center justify-center text-white hover:bg-destructive/80 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Programs Tab ─────────────────────────────────────────────────────────────────────

type ProgCategory = 'MARATHON' | 'YOGA' | 'CAMP' | 'CORPORATE' | 'FUN_RUN' | 'OTHER';
type ProgStatus = 'UPCOMING' | 'PAST' | 'CANCELLED';

const PROG_CAT_LABELS: Record<ProgCategory, string> = {
  MARATHON: 'Marathon', YOGA: 'Yoga', CAMP: 'Camp',
  CORPORATE: 'Corporate', FUN_RUN: 'Fun Run', OTHER: 'Other',
};

interface Program {
  id: string; title: string; excerpt: string | null; content: string;
  coverImagePath: string | null; date: string | null; location: string | null;
  category: ProgCategory; status: ProgStatus; createdAt: string;
}

function ProgramsAdminTab() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<ProgCategory>('OTHER');
  const [status, setStatus] = useState<ProgStatus>('UPCOMING');
  const [coverPath, setCoverPath] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPrograms = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/programs');
    const data = await res.json();
    setPrograms(data.programs ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadPrograms(); }, [loadPrograms]);

  const resetForm = () => {
    setTitle(''); setExcerpt(''); setContent(''); setDate(''); setLocation('');
    setCategory('OTHER'); setStatus('UPCOMING'); setCoverPath(''); setEditId(null);
    setError(''); setShowForm(false);
  };

  const uploadCover = async (file: File) => {
    setUploading(true); setUploadPct(0);
    const fd = new FormData(); fd.append('files', file);
    try {
      const res = await axios.post<{ paths: string[] }>('/api/upload?folder=programs', fd, {
        onUploadProgress(e) { if (e.total) setUploadPct(Math.round((e.loaded * 100) / e.total)); },
      });
      setCoverPath(res.data.paths[0]);
    } finally { setUploading(false); setUploadPct(0); }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) { setError('Title and content are required.'); return; }
    setError(''); setSubmitting(true);
    try {
      const body = { title, excerpt: excerpt || null, content, coverImagePath: coverPath || null, date: date || null, location: location || null, category, status };
      if (editId) {
        await fetch(`/api/admin/programs/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      } else {
        await fetch('/api/admin/programs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      }
      resetForm(); loadPrograms();
    } catch { setError('Save failed.'); }
    finally { setSubmitting(false); }
  };

  const deleteProgram = async (id: string) => {
    if (!window.confirm('Delete this program?')) return;
    await fetch(`/api/admin/programs/${id}`, { method: 'DELETE' });
    loadPrograms();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white">Programs & Events</h2>
        {!showForm && <Button size="sm" onClick={() => setShowForm(true)}>+ New Program</Button>}
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Title</Label><Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} /></div>
              <div><Label>Excerpt (optional)</Label><Input className="mt-1" value={excerpt} onChange={e => setExcerpt(e.target.value)} /></div>
              <div><Label>Date</Label><Input className="mt-1" type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
              <div><Label>Location</Label><Input className="mt-1" value={location} onChange={e => setLocation(e.target.value)} /></div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={v => setCategory(v as ProgCategory)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{(Object.keys(PROG_CAT_LABELS) as ProgCategory[]).map(c => <SelectItem key={c} value={c}>{PROG_CAT_LABELS[c]}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select value={status} onValueChange={v => setStatus(v as ProgStatus)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="UPCOMING">Upcoming</SelectItem><SelectItem value="PAST">Past</SelectItem><SelectItem value="CANCELLED">Cancelled</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            {/* Cover image */}
            <div>
              <Label>Cover Image</Label>
              <div className="flex items-center gap-3 mt-1">
                <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                  {uploading ? `${uploadPct}%` : 'Upload'}
                </Button>
                {coverPath && <img src={coverPath} alt="cover" className="h-12 w-20 object-cover rounded-lg border border-border" />}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ''; }} />
            </div>
            <div>
              <Label className="mb-1 block">Content</Label>
              <TipTapEditor content={content} onChange={setContent} folder="programs" placeholder="Describe the program…" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button onClick={handleSubmit} disabled={submitting} className="gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {editId ? 'Update' : 'Create'} Program
              </Button>
              <Button variant="outline" onClick={resetForm} disabled={submitting}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div> : programs.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-12">No programs yet.</p>
      ) : (
        <div className="space-y-2">
          {programs.map(p => (
            <div key={p.id} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white dark:bg-zinc-900 hover:border-primary/30 transition-colors">
              {p.coverImagePath && <img src={p.coverImagePath} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    p.status === 'UPCOMING' ? 'bg-green-100 text-green-700' : p.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-zinc-200 text-zinc-700'
                  }`}>{p.status}</span>
                  <span className="text-xs text-muted-foreground">{PROG_CAT_LABELS[p.category]}</span>
                  {p.date && <span className="text-xs text-muted-foreground">· {new Date(p.date).toLocaleDateString('en-IN')}</span>}
                </div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-white">{p.title}</p>
                {p.location && <p className="text-xs text-muted-foreground">{p.location}</p>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setEditId(p.id); setTitle(p.title); setExcerpt(p.excerpt ?? ''); setContent(p.content); setDate(p.date ? p.date.substring(0, 10) : ''); setLocation(p.location ?? ''); setCategory(p.category); setStatus(p.status); setCoverPath(p.coverImagePath ?? ''); setShowForm(true); }}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" title="Edit">✏️</button>
                <button onClick={() => deleteProgram(p.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" title="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

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

  const navItems: Array<{ tab: Tab; label: string; icon: React.ElementType; badge?: number }> = [
    { tab: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { tab: 'members', label: 'Members', icon: Users, badge: stats?.pendingMembers },
    { tab: 'donations', label: 'Donations', icon: Heart },
    { tab: 'admins', label: 'Admins', icon: ShieldCheck },
    { tab: 'posts', label: 'Posts', icon: FileText },
    { tab: 'gallery', label: 'Gallery', icon: Images },
    { tab: 'programs', label: 'Programs', icon: Dumbbell },
    { tab: 'contacts', label: 'Contact Inbox', icon: MessageSquare },
    { tab: 'messages', label: 'Messages', icon: Send },
  ];

  const tabTitles: Record<Tab, string> = {
    dashboard: 'Dashboard Overview',
    members: 'Member Management',
    donations: 'Donation Records',
    admins: 'Admin Management',
    posts: 'Post Management',
    gallery: 'Gallery Management',
    programs: 'Programs & Events',
    contacts: 'Contact Inbox',
    messages: 'Member Messages',
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* ─── Sidebar ─── */}
        <Sidebar collapsible="offcanvas" className="border-r border-border bg-sidebar">
          {/* Brand Header */}
          <SidebarHeader className="p-0">
            <div className="relative overflow-hidden px-5 py-4 border-b border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-sm flex-shrink-0">
                  <img src="/logo.png" alt="" className="w-5 h-5 object-contain" />
                </div>
                <div>
                  <p className="font-black text-foreground text-sm leading-none tracking-tight">Run4Health</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-medium">Admin Panel</p>
                </div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">Navigation</p>
            <SidebarMenu className="gap-0.5">
              {navItems.map(item => (
                <SidebarMenuItem key={item.tab}>
                  <SidebarMenuButton
                    isActive={activeTab === item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`w-full rounded-xl px-3 py-2.5 flex items-center justify-between transition-all ${
                      activeTab === item.tab
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className={`w-4 h-4 flex-shrink-0 ${activeTab === item.tab ? 'text-primary' : ''}`} />
                      <span className={`text-sm ${activeTab === item.tab ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
                    </span>
                    {item.badge != null && item.badge > 0 && (
                      <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* ─── Main Content ─── */}
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          {/* Top bar */}
          <header className="flex items-center gap-3 px-6 py-3.5 border-b border-border bg-card sticky top-0 z-10">
            <SidebarTrigger className="flex-shrink-0" />
            <div className="h-5 w-px bg-border mx-1" />
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-bold text-foreground leading-none">{tabTitles[activeTab]}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Run4Health Admin</p>
            </div>
          </header>

          <main className="flex-1 p-6 bg-background">
            {activeTab === 'dashboard' && <DashboardOverview stats={stats} />}
            {activeTab === 'members' && <MembersTab onAction={fetchStats} />}
            {activeTab === 'donations' && <DonationsTab />}
            {activeTab === 'admins' && <AdminsTab />}
            {activeTab === 'posts' && <PostsTab />}
            {activeTab === 'gallery' && <GalleryAdminTab />}
            {activeTab === 'programs' && <ProgramsAdminTab />}
            {activeTab === 'contacts' && <ContactsTab />}
            {activeTab === 'messages' && <MessagesTab />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

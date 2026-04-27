'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2, ImagePlus, X, Pencil, Trash2, FileText, User, Activity, Heart, LogOut } from 'lucide-react';

const TipTapEditor = dynamic(() => import('@/components/editor/tiptap-editor'), { ssr: false });
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
  height: number | null;
  weight: number | null;
  thighSize: number | null;
  waistSize: number | null;
  sleepHours: number | null;
  fitnessLevel: string;
  medicalConditions: string | null;
  emergencyContact: string | null;
  profilePhotoPath: string | null;
  status: string;
  createdAt: string;
};

type HealthRecord = {
  id: string;
  weight: number | null;
  height: number | null;
  thighSize: number | null;
  waistSize: number | null;
  sleepHours: number | null;
  notes: string | null;
  recordedAt: string;
};

type DonationRecord = {
  id: string;
  amount: number;
  paymentMethod: string;
  message: string | null;
  status: string;
  createdAt: string;
};

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({ member, onUpdate }: { member: Member; onUpdate: () => void }) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(member.phone);
  const [city, setCity] = useState(member.city);
  const [emergency, setEmergency] = useState(member.emergencyContact || '');
  const [medical, setMedical] = useState(member.medicalConditions || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function handleSave() {
    setSaving(true);
    setMsg('');
    const res = await fetch('/api/member/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, city, emergencyContact: emergency, medicalConditions: medical }),
    });
    setSaving(false);
    if (res.ok) { setMsg('Profile updated!'); setEditing(false); onUpdate(); }
  }

  const Field = ({ label, value }: { label: string; value: string | null | undefined }) => (
    <div className="py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
      <p className="text-sm font-medium text-zinc-900 dark:text-white">{value || '—'}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Avatar + name */}
      <div className="flex items-center gap-5 p-5 bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 rounded-2xl">
        {member.profilePhotoPath ? (
          <img src={member.profilePhotoPath} alt="" className="w-20 h-20 rounded-2xl object-cover border-2 border-green-300" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black">
            {member.firstName[0]}{member.lastName[0]}
          </div>
        )}
        <div>
          <h2 className="text-xl font-black text-zinc-900 dark:text-white">{member.firstName} {member.lastName}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{member.email}</p>
          <span className="mt-1.5 inline-block bg-primary/10 dark:bg-primary/10 text-primary text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
            ✅ {member.status}
          </span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-3 text-sm">Personal Details</h3>
          <Field label="Age" value={member.age?.toString()} />
          <Field label="Gender" value={member.gender} />
          <Field label="City" value={city} />
          <Field label="Fitness Level" value={member.fitnessLevel} />
          <Field label="Member Since" value={new Date(member.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-4">
          <h3 className="font-bold text-zinc-900 dark:text-white mb-3 text-sm">Health Data</h3>
          <Field label="Height" value={member.height ? `${member.height} cm` : null} />
          <Field label="Weight" value={member.weight ? `${member.weight} kg` : null} />
          <Field label="Waist" value={member.waistSize ? `${member.waistSize} cm` : null} />
          <Field label="Thigh" value={member.thighSize ? `${member.thighSize} cm` : null} />
          <Field label="Sleep Hours" value={member.sleepHours ? `${member.sleepHours} hrs/night` : null} />
        </div>
      </div>

      {/* Editable fields */}
      {msg && <div className="px-4 py-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 text-primary text-primary text-sm">{msg}</div>}

      {editing ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 space-y-4">
          <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Edit Information</h3>
          {[{ label: 'Phone', value: phone, set: setPhone }, { label: 'City', value: city, set: setCity }, { label: 'Emergency Contact', value: emergency, set: setEmergency }].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">{f.label}</label>
              <input value={f.value} onChange={e => f.set(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">Medical Conditions</label>
            <textarea value={medical} onChange={e => setMedical(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm disabled:opacity-60 transition">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
            <button onClick={() => setEditing(false)}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setEditing(true)}
          className="px-5 py-2.5 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5  transition">
          ✏️ Edit Profile
        </button>
      )}
    </div>
  );
}

// ─── Health Tab ───────────────────────────────────────────────────────────────

function HealthTab() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ weight: '', height: '', thighSize: '', waistSize: '', sleepHours: '', notes: '' });
  const [saving, setSaving] = useState(false);

  const fetchRecords = useCallback(async () => {
    const res = await fetch('/api/member/health');
    const d = await res.json();
    setRecords(d.records || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/member/health', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setShowForm(false); setForm({ weight: '', height: '', thighSize: '', waistSize: '', sleepHours: '', notes: '' }); fetchRecords(); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-zinc-900 dark:text-white">Health Records</h2>
        <button onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition">
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">New Health Entry</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[{ key: 'weight', label: 'Weight (kg)' }, { key: 'height', label: 'Height (cm)' }, { key: 'waistSize', label: 'Waist (cm)' }, { key: 'thighSize', label: 'Thigh (cm)' }, { key: 'sleepHours', label: 'Sleep (hrs)' }].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">{f.label}</label>
                <input type="number" step="0.1" value={form[f.key as keyof typeof form]} onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Notes</label>
            <input value={form.notes} onChange={e => setForm(v => ({ ...v, notes: e.target.value }))} placeholder="Optional note…"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm disabled:opacity-60 transition">
            {saving ? 'Saving…' : 'Save Entry'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading records…</div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">No health records yet. Add your first one!</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-700">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300 text-xs">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300 text-xs">Weight</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300 text-xs hidden sm:table-cell">Height</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300 text-xs hidden md:table-cell">Waist</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300 text-xs hidden md:table-cell">Thigh</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300 text-xs hidden lg:table-cell">Sleep</th>
                <th className="text-left px-4 py-3 font-semibold text-zinc-600 dark:text-zinc-300 text-xs">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {records.map(r => (
                <tr key={r.id} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{new Date(r.recordedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">{r.weight ? `${r.weight}kg` : '—'}</td>
                  <td className="px-4 py-3 text-zinc-500 hidden sm:table-cell">{r.height ? `${r.height}cm` : '—'}</td>
                  <td className="px-4 py-3 text-zinc-500 hidden md:table-cell">{r.waistSize ? `${r.waistSize}cm` : '—'}</td>
                  <td className="px-4 py-3 text-zinc-500 hidden md:table-cell">{r.thighSize ? `${r.thighSize}cm` : '—'}</td>
                  <td className="px-4 py-3 text-zinc-500 hidden lg:table-cell">{r.sleepHours ? `${r.sleepHours}h` : '—'}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{r.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Donations Tab ────────────────────────────────────────────────────────────

function DonationsTab({ member }: { member: Member }) {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ donorName: `${member.firstName} ${member.lastName}`, donorEmail: member.email, donorPhone: member.phone, amount: '', paymentMethod: 'UPI', message: '' });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('/api/donations').then(r => r.json()).then(d => { setDonations(d.donations || []); setLoading(false); });
  }, []);

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/donations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setSuccessMsg('Thank you for your donation! 💚');
      setShowForm(false);
      setForm(v => ({ ...v, amount: '', message: '' }));
      const d = await fetch('/api/donations').then(r => r.json());
      setDonations(d.donations || []);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-zinc-900 dark:text-white">My Donations</h2>
        <button onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition">
          {showForm ? 'Cancel' : '💚 Donate'}
        </button>
      </div>

      {successMsg && <div className="px-4 py-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 text-primary text-primary text-sm">{successMsg}</div>}

      {showForm && (
        <form onSubmit={handleDonate} className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-5 space-y-4">
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Make a Donation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Amount (₹) *</label>
              <input type="number" min="1" required value={form.amount} onChange={e => setForm(v => ({ ...v, amount: e.target.value }))}
                placeholder="e.g. 500"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Payment Method</label>
              <select value={form.paymentMethod} onChange={e => setForm(v => ({ ...v, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>UPI</option><option>CARD</option><option>NET_BANKING</option><option>CASH</option><option>OTHER</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Message (optional)</label>
            <input value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} placeholder="A kind message…"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm disabled:opacity-60 transition">
            {saving ? 'Processing…' : '💚 Confirm Donation'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading…</div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">No donations yet. Make your first contribution! 💚</div>
      ) : (
        <div className="space-y-3">
          {donations.map(d => (
            <div key={d.id} className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3">
              <div>
                <p className="font-bold text-primary text-lg">₹{d.amount.toLocaleString()}</p>
                <p className="text-xs text-zinc-400">{d.paymentMethod} · {new Date(d.createdAt).toLocaleDateString()}</p>
                {d.message && <p className="text-xs text-zinc-500 mt-0.5 italic">"{d.message}"</p>}
              </div>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${d.status === 'COMPLETED' ? 'bg-primary/10 text-primary dark:bg-primary/10 text-primary' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                {d.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

type Tab = 'profile' | 'health' | 'donations' | 'posts';

type PostStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED';
type PostCategory = 'EVENT_RECAP' | 'HEALTH_TIPS' | 'COMMUNITY_STORY' | 'ANNOUNCEMENT';

const CATEGORY_LABELS: Record<PostCategory, string> = {
  EVENT_RECAP: 'Event Recap',
  HEALTH_TIPS: 'Health Tips',
  COMMUNITY_STORY: 'Community Story',
  ANNOUNCEMENT: 'Announcement',
};

const STATUS_COLORS: Record<PostStatus, string> = {
  DRAFT: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300',
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

interface Post {
  id: string;
  title: string;
  category: PostCategory;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  rejectionNote: string | null;
  coverImagePath: string | null;
  content: string;
}

interface UploadFile {
  file: File;
  previewUrl: string;
  progress: number;
  path: string | null;
  error: boolean;
}

// ─── My Posts Tab ──────────────────────────────────────────────────────────────

function MyPostsTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostCategory>('ANNOUNCEMENT');
  const [content, setContent] = useState('');
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/posts?mine=true');
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const resetForm = () => {
    setTitle(''); setCategory('ANNOUNCEMENT'); setContent('');
    setUploads([]); setEditingId(null); setError('');
    setShowForm(false);
  };

  const handleFiles = async (files: FileList) => {
    const arr = Array.from(files).slice(0, 10 - uploads.length);
    if (!arr.length) return;
    const items: UploadFile[] = arr.map(file => ({
      file, previewUrl: URL.createObjectURL(file), progress: 0, path: null, error: false,
    }));
    setUploads(prev => [...prev, ...items]);
    for (const item of items) {
      const fd = new FormData();
      fd.append('files', item.file);
      try {
        const res = await axios.post<{ paths: string[] }>('/api/upload?folder=news', fd, {
          onUploadProgress(e) {
            if (!e.total) return;
            const pct = Math.round((e.loaded * 100) / e.total);
            setUploads(prev => prev.map(u => u.previewUrl === item.previewUrl ? { ...u, progress: pct } : u));
          },
        });
        setUploads(prev => prev.map(u => u.previewUrl === item.previewUrl ? { ...u, path: res.data.paths[0], progress: 100 } : u));
      } catch {
        setUploads(prev => prev.map(u => u.previewUrl === item.previewUrl ? { ...u, error: true } : u));
      }
    }
  };

  const removeUpload = (url: string) => {
    setUploads(prev => { const i = prev.find(u => u.previewUrl === url); if (i) URL.revokeObjectURL(i.previewUrl); return prev.filter(u => u.previewUrl !== url); });
  };

  const handleSubmit = async (draft = false) => {
    if (!title.trim() || !content.trim()) { setError('Title and content are required.'); return; }
    setError(''); setSubmitting(true);
    try {
      const imagePaths = uploads.filter(u => u.path).map(u => u.path!);
      const body = { title, category, content, imagePaths, coverImagePath: imagePaths[0] ?? null, status: draft ? 'DRAFT' : undefined };
      if (editingId) {
        await axios.put(`/api/posts/${editingId}`, body);
      } else {
        await axios.post('/api/posts', body);
      }
      resetForm();
      loadPosts();
    } catch { setError('Failed to save. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this post?')) return;
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    loadPosts();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">My Posts</h2>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5">
            <Pencil className="w-3.5 h-3.5" /> New Post
          </Button>
        )}
      </div>

      {showForm && (
        <Card className="border-border">
          <CardContent className="p-5 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input className="mt-1" value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={v => setCategory(v as PostCategory)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CATEGORY_LABELS) as PostCategory[]).map(c => (
                      <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-1 block">Content</Label>
              <TipTapEditor content={content} onChange={setContent} folder="news" placeholder="Write your post…" />
            </div>
            {/* Image uploads */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Images ({uploads.length}/10)</Label>
                {uploads.length < 10 && (
                  <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                    <ImagePlus className="w-3.5 h-3.5" /> Add
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }} />
              {uploads.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <AnimatePresence>
                    {uploads.map(u => (
                      <motion.div key={u.previewUrl} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                        <img src={u.previewUrl} alt="" className="w-full h-full object-cover" />
                        {u.progress < 100 && !u.error && (
                          <div className="absolute inset-0 bg-black/50 flex items-end">
                            <div className="w-full h-1"><div className="h-full bg-primary transition-all" style={{ width: `${u.progress}%` }} /></div>
                          </div>
                        )}
                        {u.error && <div className="absolute inset-0 bg-destructive/50 flex items-center justify-center"><span className="text-white text-xs">Failed</span></div>}
                        <button type="button" onClick={() => removeUpload(u.previewUrl)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80">
                          <X className="w-3 h-3" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex items-center gap-3">
              <Button onClick={() => handleSubmit(false)} disabled={submitting} className="gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                Submit for Review
              </Button>
              <Button variant="outline" onClick={() => handleSubmit(true)} disabled={submitting}>Save Draft</Button>
              <Button variant="ghost" onClick={resetForm} disabled={submitting}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No posts yet. Write your first story!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white dark:bg-zinc-900 hover:border-primary/30 transition-colors">
              {p.coverImagePath ? (
                <img src={p.coverImagePath} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                  <span className="text-xs text-muted-foreground">{CATEGORY_LABELS[p.category]}</span>
                </div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                {p.status === 'REJECTED' && p.rejectionNote && (
                  <p className="text-xs text-destructive mt-1">Rejected: {p.rejectionNote}</p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {(p.status === 'DRAFT' || p.status === 'REJECTED') && (
                  <button type="button" title="Edit" onClick={() => { setTitle(p.title); setCategory(p.category); setContent(p.content); setEditingId(p.id); setShowForm(true); setUploads([]); }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                <button type="button" title="Delete" onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
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

export default function MemberDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const res = await fetch('/api/member/profile');
    if (!res.ok) { router.push('/member/login'); return; }
    const d = await res.json();
    setMember(d.member);
    setLoading(false);
  }, [router]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  async function handleLogout() {
    await fetch('/api/auth/member/logout', { method: 'POST' });
    router.push('/member/login');
  }

  const navItems: Array<{ tab: Tab; label: string; icon: React.ElementType }> = [
    { tab: 'profile', label: 'My Profile', icon: User },
    { tab: 'health', label: 'Health Records', icon: Activity },
    { tab: 'donations', label: 'My Donations', icon: Heart },
    { tab: 'posts', label: 'My Posts', icon: FileText },
  ];

  const tabTitles: Record<Tab, string> = {
    profile: 'My Profile',
    health: 'Health Records',
    donations: 'My Donations',
    posts: 'My Posts',
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
        <p className="text-zinc-400 text-sm">Loading your dashboard…</p>
      </div>
    </div>
  );

  if (!member) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
        {/* ─── Sidebar ─── */}
        <Sidebar collapsible="offcanvas" className="border-r border-zinc-200 dark:border-zinc-800">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-3">
              {member.profilePhotoPath ? (
                <img src={member.profilePhotoPath} alt="" className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                  {member.firstName[0]}{member.lastName[0]}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="font-bold text-zinc-900 dark:text-white text-sm truncate">{member.firstName} {member.lastName}</p>
                <p className="text-xs text-zinc-400 truncate">{member.email}</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarSeparator />

          <SidebarContent className="px-2 py-3">
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.tab}>
                  <SidebarMenuButton isActive={activeTab === item.tab} onClick={() => setActiveTab(item.tab)}>
                    <span className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="mb-3 px-3 py-2.5 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30">
              <p className="text-xs text-primary text-primary font-semibold">Run4Health Member</p>
              <p className="text-xs text-primary mt-0.5">
                Since {new Date(member.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </p>
            </div>
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </SidebarFooter>
        </Sidebar>

        {/* ─── Main Content ─── */}
        <SidebarInset className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center gap-4 px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
            <SidebarTrigger className="flex-shrink-0" />
            <div>
              <h1 className="text-lg font-bold text-zinc-900 dark:text-white">{tabTitles[activeTab]}</h1>
            </div>
          </header>

          <main className="flex-1 p-6">
            {activeTab === 'profile' && <ProfileTab member={member} onUpdate={fetchProfile} />}
            {activeTab === 'health' && <HealthTab />}
            {activeTab === 'donations' && <DonationsTab member={member} />}
            {activeTab === 'posts' && <MyPostsTab />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

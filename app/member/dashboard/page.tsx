'use client';

import { useState, useEffect, useCallback } from 'react';
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

type Tab = 'profile' | 'health' | 'donations';

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

  const navItems: Array<{ tab: Tab; label: string; icon: string }> = [
    { tab: 'profile', label: 'My Profile', icon: '👤' },
    { tab: 'health', label: 'Health Records', icon: '💪' },
    { tab: 'donations', label: 'My Donations', icon: '💚' },
  ];

  const tabTitles: Record<Tab, string> = {
    profile: 'My Profile',
    health: 'Health Records',
    donations: 'My Donations',
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center">
        <div className="text-4xl mb-3">🏃</div>
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
                      <span>{item.icon}</span>
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
              <span>🚪</span>
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

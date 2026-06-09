"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  Loader2,
  ImagePlus,
  X,
  Pencil,
  Trash2,
  FileText,
  User,
  Activity,
  Heart,
  LogOut,
  Settings,
  Mail,
  Megaphone,
  Camera,
  Upload,
  Inbox,
} from "lucide-react";

const TipTapEditor = dynamic(
  () => import("@/components/editor/tiptap-editor"),
  { ssr: false },
);
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
} from "@/components/ui/sidebar";

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
  medicalReports?: {
    id: string;
    path: string;
    filename: string;
    size: number;
    uploadedAt: string;
  }[];
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

type InboxMessage = {
  id: string;
  subject: string;
  body: string;
  scope: "PERSONAL" | "BROADCAST";
  read: boolean;
  readAt: string | null;
  createdAt: string;
  admin: { id: string; name: string; email: string };
};

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="py-3 border-b border-border last:border-0">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

function ProfileTab({
  member,
  onUpdate,
}: {
  member: Member;
  onUpdate: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(member.phone);
  const [city, setCity] = useState(member.city);
  const [emergency, setEmergency] = useState(member.emergencyContact || "");
  const [medical, setMedical] = useState(member.medicalConditions || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/member/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        city,
        emergencyContact: emergency,
        medicalConditions: medical,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Profile updated!");
      setEditing(false);
      onUpdate();
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="h-16 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
        <div className="px-5 pb-5 -mt-8 flex items-end gap-4">
          {member.profilePhotoPath ? (
            <img
              src={member.profilePhotoPath}
              alt=""
              className="w-16 h-16 rounded-2xl object-cover border-4 border-card shadow-sm shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-primary border-4 border-card shadow-sm flex items-center justify-center text-primary-foreground text-xl font-black shrink-0">
              {member.firstName[0]}
              {member.lastName[0]}
            </div>
          )}
          <div className="pb-1 min-w-0">
            <h2 className="text-lg font-black text-foreground leading-tight">
              {member.firstName} {member.lastName}
            </h2>
            <p className="text-xs text-muted-foreground">{member.email}</p>
          </div>
          <div className="ml-auto pb-1 shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {member.status}
            </span>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <h3 className="font-bold text-foreground mb-3 text-sm">
            Personal Details
          </h3>
          <ProfileField label="Age" value={member.age?.toString()} />
          <ProfileField label="Gender" value={member.gender} />
          <ProfileField label="City" value={city} />
          <ProfileField label="Fitness Level" value={member.fitnessLevel} />
          <ProfileField
            label="Member Since"
            value={new Date(member.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />
        </div>

        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
          <h3 className="font-bold text-foreground mb-3 text-sm">
            Health Data
          </h3>
          <ProfileField
            label="Height"
            value={member.height ? `${member.height} cm` : null}
          />
          <ProfileField
            label="Weight"
            value={member.weight ? `${member.weight} kg` : null}
          />
          <ProfileField
            label="Waist"
            value={member.waistSize ? `${member.waistSize} cm` : null}
          />
          <ProfileField
            label="Thigh"
            value={member.thighSize ? `${member.thighSize} cm` : null}
          />
          <ProfileField
            label="Sleep Hours"
            value={member.sleepHours ? `${member.sleepHours} hrs/night` : null}
          />
        </div>
      </div>

      {/* Editable fields */}
      {msg && (
        <div className="px-4 py-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 text-primary text-primary text-sm">
          {msg}
        </div>
      )}

      {editing ? (
        <div className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm">
          <h3 className="font-bold text-foreground text-sm">
            Edit Information
          </h3>
          {[
            { label: "Phone", value: phone, set: setPhone },
            { label: "City", value: city, set: setCity },
            { label: "Emergency Contact", value: emergency, set: setEmergency },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                {f.label}
              </label>
              <input
                value={f.value}
                onChange={(e) => f.set(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Medical Conditions
            </label>
            <textarea
              value={medical}
              onChange={(e) => setMedical(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition resize-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm disabled:opacity-60 transition"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="px-5 py-2.5 rounded-xl border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5  transition"
        >
          ✏️ Edit Profile
        </button>
      )}

      {/* Files: profile photo + medical reports */}
      <FilesSection member={member} onUpdate={onUpdate} />
    </div>
  );
}

// ─── Files section (profile photo + medical report history) ──────────────────

function FilesSection({
  member,
  onUpdate,
}: {
  member: Member;
  onUpdate: () => void;
}) {
  const photoRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLInputElement>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingReport, setUploadingReport] = useState(false);
  const [filesMsg, setFilesMsg] = useState<{
    text: string;
    ok: boolean;
  } | null>(null);

  async function uploadFile(
    file: File,
    folder: "user_profile" | "user_reports",
  ): Promise<string | null> {
    const fd = new FormData();
    fd.append("files", file);
    const res = await fetch(`/api/upload?folder=${folder}`, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }
    return data.paths?.[0] ?? null;
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilesMsg(null);
    setUploadingPhoto(true);
    try {
      const path = await uploadFile(file, "user_profile");
      if (!path) throw new Error("No path returned");
      const res = await fetch("/api/member/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePhotoPath: path }),
      });
      if (!res.ok) throw new Error("Failed to save photo path");
      setFilesMsg({ text: "Profile photo updated.", ok: true });
      onUpdate();
    } catch (err) {
      setFilesMsg({
        text: err instanceof Error ? err.message : "Upload failed.",
        ok: false,
      });
    } finally {
      setUploadingPhoto(false);
      if (photoRef.current) photoRef.current.value = "";
    }
  }

  async function handleReportChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFilesMsg(null);
    setUploadingReport(true);
    try {
      const uploadedPath = await uploadFile(file, "user_reports");
      if (!uploadedPath) throw new Error("No path returned");
      // Register the report in the database
      const res = await fetch("/api/member/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: uploadedPath,
          filename: file.name,
          size: file.size,
        }),
      });
      if (!res.ok) throw new Error("Failed to save report record");
      setFilesMsg({ text: "Medical report uploaded.", ok: true });
      onUpdate();
    } catch (err) {
      setFilesMsg({
        text: err instanceof Error ? err.message : "Upload failed.",
        ok: false,
      });
    } finally {
      setUploadingReport(false);
      if (reportRef.current) reportRef.current.value = "";
    }
  }

  const reports = member.medicalReports ?? [];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm space-y-5">
      <div>
        <h3 className="font-bold text-foreground text-sm">My Files</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Update your profile photo and upload new medical reports any time.
        </p>
      </div>

      {filesMsg && (
        <div
          className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-start justify-between gap-3 ${
            filesMsg.ok
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          <span>{filesMsg.text}</span>
          <button
            onClick={() => setFilesMsg(null)}
            className="text-xs underline opacity-70 hover:opacity-100 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Profile photo */}
      <div className="grid sm:grid-cols-[120px,1fr] gap-4 items-center">
        <div>
          {member.profilePhotoPath ? (
            <img
              src={member.profilePhotoPath}
              alt="Profile"
              className="w-28 h-28 rounded-2xl object-cover border border-border"
            />
          ) : (
            <div className="w-28 h-28 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-3xl">
              {member.firstName[0]}
              {member.lastName[0]}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">Profile photo</p>
          <p className="text-xs text-muted-foreground mt-0.5 mb-2">
            JPG, PNG or WebP. Max 10 MB.
          </p>
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <button
            type="button"
            onClick={() => photoRef.current?.click()}
            disabled={uploadingPhoto}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold disabled:opacity-60 transition"
          >
            {uploadingPhoto ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
            {uploadingPhoto ? "Uploading…" : "Change photo"}
          </button>
        </div>
      </div>

      <div className="border-t border-border" />

      {/* Medical reports */}
      <div>
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Medical reports
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              PDF or image, max 10 MB. Each new upload is added to your history.
            </p>
          </div>
          <input
            ref={reportRef}
            type="file"
            accept=".pdf,image/*"
            className="hidden"
            onChange={handleReportChange}
          />
          <button
            type="button"
            onClick={() => reportRef.current?.click()}
            disabled={uploadingReport}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-foreground hover:border-primary/40 text-sm font-semibold disabled:opacity-60 transition"
          >
            {uploadingReport ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {uploadingReport ? "Uploading…" : "Upload new report"}
          </button>
        </div>

        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            No reports uploaded yet.
          </p>
        ) : (
          <ul className="divide-y divide-border border border-border rounded-xl overflow-hidden">
            {reports.map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 px-3 py-2.5 bg-card hover:bg-muted/30 text-sm"
              >
                <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href={r.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0 truncate text-foreground hover:text-primary hover:underline"
                  title={r.filename}
                >
                  {r.filename}
                </a>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(r.uploadedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Health Tab ───────────────────────────────────────────────────────────────

function HealthTab() {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    weight: "",
    height: "",
    thighSize: "",
    waistSize: "",
    sleepHours: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [uploadingReport, setUploadingReport] = useState(false);
  const reportRef = useRef<HTMLInputElement>(null);

  const fetchRecords = useCallback(async () => {
    const res = await fetch("/api/member/health");
    const d = await res.json();
    setRecords(d.records || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecords();
  }, [fetchRecords]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/member/health", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok && reportFile) {
      // Upload + register report
      setUploadingReport(true);
      try {
        const fd = new FormData();
        fd.append("files", reportFile);
        const upRes = await fetch("/api/upload?folder=user_reports", {
          method: "POST",
          body: fd,
        });
        const upData = await upRes.json();
        if (upRes.ok && upData.paths?.[0]) {
          await fetch("/api/member/reports", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              path: upData.paths[0],
              filename: reportFile.name,
              size: reportFile.size,
            }),
          });
        }
      } finally {
        setUploadingReport(false);
      }
    }
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      setReportFile(null);
      if (reportRef.current) reportRef.current.value = "";
      setForm({
        weight: "",
        height: "",
        thighSize: "",
        waistSize: "",
        sleepHours: "",
        notes: "",
      });
      fetchRecords();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground">Health Records</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition"
        >
          {showForm ? "Cancel" : "+ Add Record"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm"
        >
          <h3 className="font-bold text-sm text-foreground">
            New Health Entry
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { key: "weight", label: "Weight (kg)" },
              { key: "height", label: "Height (cm)" },
              { key: "waistSize", label: "Waist (cm)" },
              { key: "thighSize", label: "Thigh (cm)" },
              { key: "sleepHours", label: "Sleep (hrs)" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                  {f.label}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form[f.key as keyof typeof form]}
                  onChange={(e) =>
                    setForm((v) => ({ ...v, [f.key]: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Notes
            </label>
            <input
              value={form.notes}
              onChange={(e) =>
                setForm((v) => ({ ...v, notes: e.target.value }))
              }
              placeholder="Optional note…"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent"
            />
          </div>

          {/* Report upload */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Attach Report{" "}
              <span className="font-normal">(PDF or image, optional)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={reportRef}
                type="file"
                accept=".pdf,image/*"
                className="hidden"
                onChange={(e) => setReportFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => reportRef.current?.click()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:border-primary/40 hover:text-primary transition"
              >
                <Upload className="w-4 h-4" />
                {reportFile ? reportFile.name : "Choose file"}
              </button>
              {reportFile && (
                <button
                  type="button"
                  onClick={() => {
                    setReportFile(null);
                    if (reportRef.current) reportRef.current.value = "";
                  }}
                  className="text-xs text-destructive hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || uploadingReport}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm disabled:opacity-60 transition"
          >
            {saving || uploadingReport ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploadingReport ? "Uploading report…" : "Saving…"}
              </span>
            ) : (
              "Save Entry"
            )}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading records…</div>
      ) : records.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          No health records yet. Add your first one!
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs">
                  Date
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs">
                  Weight
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs hidden sm:table-cell">
                  Height
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs hidden md:table-cell">
                  Waist
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs hidden md:table-cell">
                  Thigh
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs hidden lg:table-cell">
                  Sleep
                </th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground text-xs">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {records.map((r) => (
                <tr key={r.id} className="bg-card hover:bg-muted/30 transition">
                  <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                    {new Date(r.recordedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-white">
                    {r.weight ? `${r.weight}kg` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 hidden sm:table-cell">
                    {r.height ? `${r.height}cm` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 hidden md:table-cell">
                    {r.waistSize ? `${r.waistSize}cm` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 hidden md:table-cell">
                    {r.thighSize ? `${r.thighSize}cm` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 hidden lg:table-cell">
                    {r.sleepHours ? `${r.sleepHours}h` : "—"}
                  </td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">
                    {r.notes || "—"}
                  </td>
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
  const [form, setForm] = useState({
    donorName: `${member.firstName} ${member.lastName}`,
    donorEmail: member.email,
    donorPhone: member.phone,
    amount: "",
    paymentMethod: "UPI",
    message: "",
  });
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetch("/api/donations")
      .then((r) => r.json())
      .then((d) => {
        setDonations(d.donations || []);
        setLoading(false);
      });
  }, []);

  async function handleDonate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setSuccessMsg("Thank you for your donation! 💚");
      setShowForm(false);
      setForm((v) => ({ ...v, amount: "", message: "" }));
      const d = await fetch("/api/donations").then((r) => r.json());
      setDonations(d.donations || []);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-foreground">My Donations</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition"
        >
          {showForm ? "Cancel" : "💚 Donate"}
        </button>
      </div>

      {successMsg && (
        <div className="px-4 py-3 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 text-primary text-primary text-sm">
          {successMsg}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleDonate}
          className="bg-card rounded-2xl border border-border p-5 space-y-4 shadow-sm"
        >
          <h3 className="font-bold text-sm text-foreground">Make a Donation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Amount (₹) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={form.amount}
                onChange={(e) =>
                  setForm((v) => ({ ...v, amount: e.target.value }))
                }
                placeholder="e.g. 500"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                Payment Method
              </label>
              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm((v) => ({ ...v, paymentMethod: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option>UPI</option>
                <option>CARD</option>
                <option>NET_BANKING</option>
                <option>CASH</option>
                <option>OTHER</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
              Message (optional)
            </label>
            <input
              value={form.message}
              onChange={(e) =>
                setForm((v) => ({ ...v, message: e.target.value }))
              }
              placeholder="A kind message…"
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-sm disabled:opacity-60 transition"
          >
            {saving ? "Processing…" : "💚 Confirm Donation"}
          </button>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-zinc-400">Loading…</div>
      ) : donations.length === 0 ? (
        <div className="text-center py-12 text-zinc-400">
          No donations yet. Make your first contribution! 💚
        </div>
      ) : (
        <div className="space-y-3">
          {donations.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div>
                <p className="font-bold text-primary text-lg">
                  ₹{d.amount.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-400">
                  {d.paymentMethod} ·{" "}
                  {new Date(d.createdAt).toLocaleDateString()}
                </p>
                {d.message && (
                  <p className="text-xs text-zinc-500 mt-0.5 italic">
                    &ldquo;{d.message}&rdquo;
                  </p>
                )}
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${d.status === "COMPLETED" ? "bg-primary/10 text-primary dark:bg-primary/10 text-primary" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}
              >
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

type Tab =
  | "profile"
  | "health"
  // | "donations"  // hidden
  | "posts"
  | "messages"
  | "settings";

type PostStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
type PostCategory =
  | "EVENT_RECAP"
  | "HEALTH_TIPS"
  | "COMMUNITY_STORY"
  | "ANNOUNCEMENT";

const CATEGORY_LABELS: Record<PostCategory, string> = {
  EVENT_RECAP: "Event Recap",
  HEALTH_TIPS: "Health Tips",
  COMMUNITY_STORY: "Community Story",
  ANNOUNCEMENT: "Announcement",
};

const STATUS_COLORS: Record<PostStatus, string> = {
  DRAFT: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  PENDING:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  APPROVED:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
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

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/member/preferences")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d.emailNotifications === "boolean")
          setEmailNotifications(d.emailNotifications);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggle = async (checked: boolean) => {
    setSaving(true);
    setSaved(false);
    setEmailNotifications(checked);
    try {
      await fetch("/api/member/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailNotifications: checked }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground mb-1">
          Notification Preferences
        </h2>
        <p className="text-sm text-muted-foreground">
          Control how Run4Health communicates with you.
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground leading-tight">
                Email notifications
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Receive an email whenever a new program or article is published.
                Turned on by default — you can switch it off at any time.
              </p>
              {saved && (
                <p className="text-xs text-primary font-medium mt-2 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Preference saved
                </p>
              )}
            </div>
            <div className="shrink-0 flex items-center gap-2 pt-0.5">
              {saving && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
              )}
              <Switch
                checked={emailNotifications}
                onCheckedChange={toggle}
                disabled={saving}
                aria-label="Toggle email notifications"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        More notification options will be available in a future update.
      </p>
    </div>
  );
}

// ─── My Posts Tab ──────────────────────────────────────────────────────────────

function MyPostsTab() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PostCategory>("ANNOUNCEMENT");
  const [content, setContent] = useState("");
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/posts?mine=true");
    const data = await res.json();
    setPosts(data.posts ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const resetForm = () => {
    setTitle("");
    setCategory("ANNOUNCEMENT");
    setContent("");
    setUploads([]);
    setEditingId(null);
    setError("");
    setShowForm(false);
  };

  const handleFiles = async (files: FileList) => {
    const arr = Array.from(files).slice(0, 10 - uploads.length);
    if (!arr.length) return;
    const items: UploadFile[] = arr.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      path: null,
      error: false,
    }));
    setUploads((prev) => [...prev, ...items]);
    for (const item of items) {
      const fd = new FormData();
      fd.append("files", item.file);
      try {
        const res = await axios.post<{ paths: string[] }>(
          "/api/upload?folder=news",
          fd,
          {
            onUploadProgress(e) {
              if (!e.total) return;
              const pct = Math.round((e.loaded * 100) / e.total);
              setUploads((prev) =>
                prev.map((u) =>
                  u.previewUrl === item.previewUrl
                    ? { ...u, progress: pct }
                    : u,
                ),
              );
            },
          },
        );
        setUploads((prev) =>
          prev.map((u) =>
            u.previewUrl === item.previewUrl
              ? { ...u, path: res.data.paths[0], progress: 100 }
              : u,
          ),
        );
      } catch {
        setUploads((prev) =>
          prev.map((u) =>
            u.previewUrl === item.previewUrl ? { ...u, error: true } : u,
          ),
        );
      }
    }
  };

  const removeUpload = (url: string) => {
    setUploads((prev) => {
      const i = prev.find((u) => u.previewUrl === url);
      if (i) URL.revokeObjectURL(i.previewUrl);
      return prev.filter((u) => u.previewUrl !== url);
    });
  };

  const handleSubmit = async (draft = false) => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const imagePaths = uploads.filter((u) => u.path).map((u) => u.path!);
      const body = {
        title,
        category,
        content,
        imagePaths,
        coverImagePath: imagePaths[0] ?? null,
        status: draft ? "DRAFT" : undefined,
      };
      if (editingId) {
        await axios.put(`/api/posts/${editingId}`, body);
      } else {
        await axios.post("/api/posts", body);
      }
      resetForm();
      loadPosts();
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    loadPosts();
  };

  if (loading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          My Posts
        </h2>
        {!showForm && (
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="gap-1.5"
          >
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
                <Input
                  className="mt-1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post title"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as PostCategory)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(CATEGORY_LABELS) as PostCategory[]).map(
                      (c) => (
                        <SelectItem key={c} value={c}>
                          {CATEGORY_LABELS[c]}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="mb-1 block">Content</Label>
              <TipTapEditor
                content={content}
                onChange={setContent}
                folder="news"
                placeholder="Write your post…"
              />
            </div>
            {/* Image uploads */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Images ({uploads.length}/10)</Label>
                {uploads.length < 10 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                  >
                    <ImagePlus className="w-3.5 h-3.5" /> Add
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) handleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              {uploads.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  <AnimatePresence>
                    {uploads.map((u) => (
                      <motion.div
                        key={u.previewUrl}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative aspect-square rounded-lg overflow-hidden border border-border"
                      >
                        <img
                          src={u.previewUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {u.progress < 100 && !u.error && (
                          <div className="absolute inset-0 bg-black/50 flex items-end">
                            <div className="w-full h-1">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${u.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                        {u.error && (
                          <div className="absolute inset-0 bg-destructive/50 flex items-center justify-center">
                            <span className="text-white text-xs">Failed</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeUpload(u.previewUrl)}
                          className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80"
                        >
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
              <Button
                onClick={() => handleSubmit(false)}
                disabled={submitting}
                className="gap-2"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Submit for Review
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={submitting}
              >
                Save Draft
              </Button>
              <Button variant="ghost" onClick={resetForm} disabled={submitting}>
                Cancel
              </Button>
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
          {posts.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white dark:bg-zinc-900 hover:border-primary/30 transition-colors"
            >
              {p.coverImagePath ? (
                <img
                  src={p.coverImagePath}
                  alt=""
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[p.status]}`}
                  >
                    {p.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {CATEGORY_LABELS[p.category]}
                  </span>
                </div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                  {p.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(p.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                {p.status === "REJECTED" && p.rejectionNote && (
                  <p className="text-xs text-destructive mt-1">
                    Rejected: {p.rejectionNote}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {(p.status === "DRAFT" || p.status === "REJECTED") && (
                  <button
                    type="button"
                    title="Edit"
                    onClick={() => {
                      setTitle(p.title);
                      setCategory(p.category);
                      setContent(p.content);
                      setEditingId(p.id);
                      setShowForm(true);
                      setUploads([]);
                    }}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  title="Delete"
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                >
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

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function MessagesTab({ onUnreadChange }: { onUnreadChange?: () => void }) {
  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/member/messages");
      const data = await res.json();
      setMessages(data.messages ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const open = async (m: InboxMessage) => {
    setOpenId(m.id);
    if (!m.read) {
      await fetch(`/api/member/messages/${m.id}`, { method: "PATCH" });
      setMessages((prev) =>
        prev.map((x) =>
          x.id === m.id
            ? { ...x, read: true, readAt: new Date().toISOString() }
            : x,
        ),
      );
      onUnreadChange?.();
    }
  };

  const unread = messages.filter((m) => !m.read).length;
  const openMsg = messages.find((m) => m.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Inbox className="w-5 h-5 text-primary" /> Messages from Admin
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {unread > 0
              ? `${unread} unread message${unread !== 1 ? "s" : ""}.`
              : "You are all caught up."}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          <Loader2
            className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Inbox className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No messages from the admin yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => open(m)}
              className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-colors ${
                m.read
                  ? "border-border bg-card hover:border-primary/30"
                  : "border-primary/30 bg-primary/5 dark:bg-primary/10 hover:border-primary/50"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  m.scope === "BROADCAST"
                    ? "bg-primary/10 text-primary"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {m.scope === "BROADCAST" ? (
                  <Megaphone className="w-4 h-4" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <span
                    className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      m.scope === "BROADCAST"
                        ? "bg-primary/10 text-primary"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {m.scope === "BROADCAST" ? "COMMUNITY" : "PERSONAL"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    From: {m.admin.name}
                  </span>
                  {!m.read && (
                    <span className="text-[10px] font-bold text-primary">
                      · NEW
                    </span>
                  )}
                </div>
                <p className="font-semibold text-sm text-foreground truncate">
                  {m.subject}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {m.body.slice(0, 140)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(m.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog open={!!openMsg} onOpenChange={() => setOpenId(null)}>
        <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
          {openMsg && (
            <>
              <DialogHeader>
                <DialogTitle className="pr-6">{openMsg.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                  <span
                    className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${
                      openMsg.scope === "BROADCAST"
                        ? "bg-primary/10 text-primary"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {openMsg.scope === "BROADCAST"
                      ? "COMMUNITY BROADCAST"
                      : "PERSONAL MESSAGE"}
                  </span>
                  <span>
                    From: {openMsg.admin.name} ({openMsg.admin.email})
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(openMsg.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm whitespace-pre-wrap break-words">
                  {openMsg.body}
                </div>
                {openMsg.scope === "BROADCAST" && (
                  <p className="text-xs text-muted-foreground italic">
                    This message was sent to all approved members of Run4Health.
                  </p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const res = await fetch("/api/member/profile");
    if (!res.ok) {
      router.push("/member/login");
      return;
    }
    const d = await res.json();
    setMember(d.member);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, [fetchProfile]);

  async function handleLogout() {
    await fetch("/api/auth/member/logout", { method: "POST" });
    router.push("/member/login");
  }

  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const refreshUnread = useCallback(async () => {
    try {
      const res = await fetch("/api/member/messages");
      const data = await res.json();
      setUnreadMessageCount(data.unreadCount ?? 0);
    } catch {
      // Non-fatal — leave count at 0
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshUnread();
  }, [refreshUnread]);

  const navItems: Array<{
    tab: Tab;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }> = [
    { tab: "profile", label: "My Profile", icon: User },
    { tab: "health", label: "Health Records", icon: Activity },
    // Donations tab hidden: { tab: "donations", label: "My Donations", icon: Heart },
    { tab: "posts", label: "My Posts", icon: FileText },
    {
      tab: "messages",
      label: "Messages",
      icon: Inbox,
      badge: unreadMessageCount,
    },
    { tab: "settings", label: "Settings", icon: Settings },
  ];

  const tabTitles: Record<Tab, string> = {
    profile: "My Profile",
    health: "Health Records",
    // donations: "My Donations",
    posts: "My Posts",
    messages: "Messages from Admin",
    settings: "Settings",
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">
            Loading your dashboard…
          </p>
        </div>
      </div>
    );

  if (!member) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        {/* ─── Sidebar ─── */}
        <Sidebar
          collapsible="offcanvas"
          className="border-r border-border bg-sidebar"
        >
          {/* Member hero section */}
          <SidebarHeader className="p-0">
            <div className="relative overflow-hidden px-5 py-5 border-b border-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent" />
              <div className="relative z-10 flex items-start gap-3">
                {member.profilePhotoPath ? (
                  <img
                    src={member.profilePhotoPath}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-primary/20 shrink-0 shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black text-base shrink-0 shadow-sm">
                    {member.firstName[0]}
                    {member.lastName[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-black text-foreground text-sm leading-tight truncate">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {member.email}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-[11px] font-semibold text-primary">
                      {member.fitnessLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-3 py-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">
              Menu
            </p>
            <SidebarMenu className="gap-0.5">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.tab}>
                  <SidebarMenuButton
                    isActive={activeTab === item.tab}
                    onClick={() => {
                      setActiveTab(item.tab);
                      if (item.tab === "messages") {
                        // Refresh badge after viewing
                        setTimeout(() => refreshUnread(), 500);
                      }
                    }}
                    className={`w-full rounded-xl px-3 py-2.5 flex items-center justify-between transition-all ${
                      activeTab === item.tab
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon
                        className={`w-4 h-4 shrink-0 ${activeTab === item.tab ? "text-primary" : ""}`}
                      />
                      <span
                        className={`text-sm ${activeTab === item.tab ? "font-semibold" : "font-medium"}`}
                      >
                        {item.label}
                      </span>
                    </span>
                    {item.badge != null && item.badge > 0 && (
                      <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                        {item.badge > 9 ? "9+" : item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3 border-t border-border">
            <div className="px-3 py-2.5 rounded-xl bg-muted/50 mb-2">
              <p className="text-xs font-semibold text-foreground">
                Run4Health Member
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Since{" "}
                {new Date(member.createdAt).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
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
          <header className="flex items-center gap-3 px-6 py-3.5 border-b border-border bg-card sticky top-0 z-10">
            <SidebarTrigger className="shrink-0" />
            <div className="h-5 w-px bg-border mx-1" />
            <div className="flex-1">
              <h1 className="text-sm font-bold text-foreground leading-none">
                {tabTitles[activeTab]}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Member Dashboard
              </p>
            </div>
          </header>

          <main className="flex-1 p-6 bg-background">
            {activeTab === "profile" && (
              <ProfileTab member={member} onUpdate={fetchProfile} />
            )}
            {activeTab === "health" && <HealthTab />}
            {/* Donations tab hidden: {activeTab === "donations" && <DonationsTab member={member} />} */}
            {activeTab === "posts" && <MyPostsTab />}
            {activeTab === "messages" && (
              <MessagesTab onUnreadChange={refreshUnread} />
            )}
            {activeTab === "settings" && <SettingsTab />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

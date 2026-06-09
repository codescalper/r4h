"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Heart,
  Weight,
  Ruler,
  Moon,
  AlertCircle,
  FileText,
  Trophy,
  TrendingUp,
  DollarSign,
  BookOpen,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberDetail = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  gender: string;
  age: number | null;
  dateOfBirth: string | null;
  fitnessLevel: string;
  height: number | null;
  weight: number | null;
  thighSize: number | null;
  waistSize: number | null;
  sleepHours: number | null;
  medicalConditions: string | null;
  emergencyContact: string | null;
  profilePhotoPath: string | null;
  medicalReports: {
    id: string;
    path: string;
    filename: string;
    size: number;
    uploadedAt: string;
  }[];
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
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

type Donation = {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  message: string | null;
  createdAt: string;
};

type Post = {
  id: string;
  title: string;
  category: string;
  status: string;
  createdAt: string;
};

type Analytics = {
  bmi: number | null;
  totalDonated: number;
  donationCount: number;
  donationsByMonth: { month: string; amount: number }[];
  postsByStatus: Record<string, number>;
  healthTrend: {
    date: string;
    weight: number | null;
    waistSize: number | null;
    thighSize: number | null;
    sleepHours: number | null;
  }[];
  healthRecordCount: number;
};

type MemberAnalytics = {
  member: MemberDetail;
  healthRecords: HealthRecord[];
  donations: Donation[];
  posts: Post[];
  analytics: Analytics;
};

// ─── BMI Category ─────────────────────────────────────────────────────────────

function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
  if (bmi < 25) return { label: "Normal", color: "text-primary" };
  if (bmi < 30) return { label: "Overweight", color: "text-yellow-500" };
  return { label: "Obese", color: "text-red-500" };
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    APPROVED: "bg-primary/10 text-primary",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    COMPLETED: "bg-primary/10 text-primary",
    DRAFT: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  };
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[status] || "bg-zinc-100 text-zinc-600"}`}
    >
      {status}
    </span>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-semibold text-foreground break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-card p-5 flex items-center gap-4 shadow-sm ${accent || "border-border"}`}
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black text-foreground leading-tight">
          {value}
        </p>
        {sub && <p className="text-xs font-semibold text-primary">{sub}</p>}
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

// ─── Chart Configs ─────────────────────────────────────────────────────────────

const weightChartConfig: ChartConfig = {
  weight: { label: "Weight (kg)", color: "var(--color-primary)" },
  waistSize: { label: "Waist (cm)", color: "var(--color-chart-2)" },
  thighSize: { label: "Thigh (cm)", color: "var(--color-chart-3)" },
};

const sleepChartConfig: ChartConfig = {
  sleepHours: { label: "Sleep (hrs)", color: "var(--color-chart-4)" },
};

const donationChartConfig: ChartConfig = {
  amount: { label: "Amount (₹)", color: "var(--color-primary)" },
};

const postPieConfig: ChartConfig = {
  APPROVED: { label: "Approved", color: "var(--color-chart-1)" },
  PENDING: { label: "Pending", color: "var(--color-chart-2)" },
  DRAFT: { label: "Draft", color: "var(--color-chart-4)" },
  REJECTED: { label: "Rejected", color: "var(--color-destructive)" },
};

const PIE_COLORS: Record<string, string> = {
  APPROVED: "var(--color-chart-1)",
  PENDING: "var(--color-chart-2)",
  DRAFT: "var(--color-chart-4)",
  REJECTED: "var(--color-destructive)",
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<MemberAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/members/${id}/analytics`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setError(d.error);
        } else {
          setData(d);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load member data.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">
            Loading member analytics…
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="font-semibold text-foreground">
            {error || "Member not found"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const { member, healthRecords, donations, posts, analytics } = data;
  const fullName = `${member.firstName} ${member.lastName}`;
  const initials = `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
  const bmiCategory = analytics.bmi ? getBmiCategory(analytics.bmi) : null;

  const postPieData = Object.entries(analytics.postsByStatus).map(
    ([status, count]) => ({
      name: status,
      value: count,
      fill: PIE_COLORS[status] || "var(--color-muted)",
    }),
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Bar ── */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-4 sm:px-8 py-3 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-bold text-foreground truncate">
            {fullName}
          </h1>
        </div>
        <StatusBadge status={member.status} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── Hero Profile Card ── */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Gradient banner */}
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 relative">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--color-accent) 0%, transparent 40%)",
              }}
            />
          </div>
          <div className="px-6 pb-6 -mt-10">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-end">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {member.profilePhotoPath ? (
                  <img
                    src={member.profilePhotoPath}
                    alt={fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-card shadow-md"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-primary/10 border-4 border-card shadow-md flex items-center justify-center">
                    <span className="text-2xl font-black text-primary">
                      {initials}
                    </span>
                  </div>
                )}
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${member.status === "APPROVED" ? "bg-primary" : member.status === "PENDING" ? "bg-yellow-400" : "bg-red-500"}`}
                />
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-black text-foreground">
                  {fullName}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {member.email}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {member.city}
                  </span>
                  {member.age && (
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {member.age} yrs
                    </span>
                  )}
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    {member.fitnessLevel}
                  </span>
                </div>
              </div>

              {/* Joined date */}
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(member.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Key Metrics ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Donated"
            value={`₹${analytics.totalDonated.toLocaleString("en-IN")}`}
            sub={`${analytics.donationCount} donation${analytics.donationCount !== 1 ? "s" : ""}`}
            icon={Heart}
            accent="border-primary/20"
          />
          <MetricCard
            label="Health Records"
            value={analytics.healthRecordCount}
            sub="check-ins logged"
            icon={TrendingUp}
          />
          <MetricCard
            label="Posts Written"
            value={posts.length}
            sub={`${analytics.postsByStatus["APPROVED"] ?? 0} approved`}
            icon={BookOpen}
          />
          {analytics.bmi ? (
            <MetricCard
              label={`BMI — ${bmiCategory?.label}`}
              value={analytics.bmi}
              sub={`${bmiCategory?.label}`}
              icon={Weight}
              accent={
                analytics.bmi >= 18.5 && analytics.bmi < 25
                  ? "border-primary/20"
                  : "border-yellow-200 dark:border-yellow-800"
              }
            />
          ) : (
            <MetricCard label="BMI" value="—" sub="no data yet" icon={Weight} />
          )}
        </div>

        {/* ── Two-column: Profile Details + Health Snapshot ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Mail} label="Email" value={member.email} />
              <InfoRow icon={Phone} label="Phone" value={member.phone} />
              <InfoRow icon={MapPin} label="City" value={member.city} />
              <InfoRow icon={User} label="Gender" value={member.gender} />
              {member.age && (
                <InfoRow
                  icon={Calendar}
                  label="Age"
                  value={`${member.age} years`}
                />
              )}
              {member.dateOfBirth && (
                <InfoRow
                  icon={Calendar}
                  label="Date of Birth"
                  value={new Date(member.dateOfBirth).toLocaleDateString(
                    "en-IN",
                  )}
                />
              )}
              <InfoRow
                icon={Activity}
                label="Fitness Level"
                value={member.fitnessLevel}
              />
              {member.emergencyContact && (
                <InfoRow
                  icon={Phone}
                  label="Emergency Contact"
                  value={member.emergencyContact}
                />
              )}
              {member.medicalReports && member.medicalReports.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground font-medium mb-2">
                    Medical Reports ({member.medicalReports.length})
                  </p>
                  <ul className="space-y-1">
                    {member.medicalReports.map((r) => (
                      <li key={r.id} className="flex items-center gap-2">
                        <a
                          href={r.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-xs">
                            {r.filename}
                          </span>
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                        </a>
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.uploadedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Snapshot */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" /> Health Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: "Height",
                    value: member.height ? `${member.height} cm` : "—",
                    icon: Ruler,
                  },
                  {
                    label: "Weight",
                    value: member.weight ? `${member.weight} kg` : "—",
                    icon: Weight,
                  },
                  {
                    label: "Waist",
                    value: member.waistSize ? `${member.waistSize} cm` : "—",
                    icon: Ruler,
                  },
                  {
                    label: "Thigh",
                    value: member.thighSize ? `${member.thighSize} cm` : "—",
                    icon: Ruler,
                  },
                  {
                    label: "Sleep",
                    value: member.sleepHours ? `${member.sleepHours} hrs` : "—",
                    icon: Moon,
                  },
                  {
                    label: "BMI",
                    value: analytics.bmi ? `${analytics.bmi}` : "—",
                    icon: Activity,
                  },
                ].map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="bg-muted/50 rounded-xl p-3 text-center"
                  >
                    <Icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <p className="text-lg font-black text-foreground">
                      {value}
                    </p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* BMI gauge bar */}
              {analytics.bmi && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden bg-muted">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-primary to-red-500 opacity-60" />
                    <div
                      className="absolute top-0 bottom-0 w-3 bg-foreground rounded-full shadow-lg transition-all"
                      style={{
                        left: `${Math.min(Math.max(((analytics.bmi - 10) / 30) * 100, 2), 95)}%`,
                      }}
                    />
                  </div>
                  <p
                    className={`text-xs font-semibold mt-1 ${bmiCategory?.color}`}
                  >
                    BMI {analytics.bmi} — {bmiCategory?.label}
                  </p>
                </div>
              )}

              {member.medicalConditions && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
                  <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Medical Conditions
                  </p>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    {member.medicalConditions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Health Trends ── */}
        {analytics.healthTrend.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Body Measurements Trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Body
                  Measurements Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={weightChartConfig}
                  className="h-[220px] w-full"
                >
                  <LineChart
                    data={analytics.healthTrend}
                    margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/50"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="var(--color-primary)"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "var(--color-primary)" }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="waistSize"
                      stroke="var(--color-chart-2)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="thighSize"
                      stroke="var(--color-chart-3)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Sleep Trend */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Moon className="w-4 h-4 text-primary" /> Sleep Hours Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={sleepChartConfig}
                  className="h-[220px] w-full"
                >
                  <BarChart
                    data={analytics.healthTrend}
                    margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/50"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      width={28}
                      domain={[0, 12]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {/* reference line at 8hrs */}
                    <Bar
                      dataKey="sleepHours"
                      fill="var(--color-chart-4)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                No health records logged yet. Charts will appear once data is
                available.
              </p>
            </CardContent>
          </Card>
        )}

        {/* ── Donations ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly donations bar chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" /> Donation
                  History (Last 12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.donationsByMonth.some((d) => d.amount > 0) ? (
                  <ChartContainer
                    config={donationChartConfig}
                    className="h-[220px] w-full"
                  >
                    <BarChart
                      data={analytics.donationsByMonth}
                      margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border/50"
                      />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                        tickFormatter={(v) => `₹${v}`}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            formatter={(val) => [
                              `₹${Number(val).toLocaleString("en-IN")}`,
                              "Amount",
                            ]}
                          />
                        }
                      />
                      <Bar
                        dataKey="amount"
                        fill="var(--color-primary)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Heart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No completed donations yet</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Donation breakdown + post pie */}
          <div className="space-y-6">
            {/* Contribution Summary hidden */}

            {/* Post Status Pie */}
            {postPieData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" /> Posts by
                    Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={postPieConfig}
                    className="h-[160px] w-full"
                  >
                    <PieChart>
                      <Pie
                        data={postPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {postPieData.map((entry, index) => (
                          <Cell key={index} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={<ChartTooltipContent nameKey="name" />}
                      />
                    </PieChart>
                  </ChartContainer>
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {postPieData.map((d) => (
                      <span
                        key={d.name}
                        className="flex items-center gap-1 text-xs text-muted-foreground"
                      >
                        <span
                          className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                          style={{ background: d.fill }}
                        />
                        {d.name} ({d.value})
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* ── Recent Activity Tables ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Donations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" /> Recent Donations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {donations.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No donations yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {donations
                    .slice(-8)
                    .reverse()
                    .map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            ₹{d.amount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {d.paymentMethod} ·{" "}
                            {new Date(d.createdAt).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                        <StatusBadge status={d.status} />
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Recent Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No posts written yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {posts.slice(0, 8).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {p.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.category} ·{" "}
                          {new Date(p.createdAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Health Records Table ── */}
        {healthRecords.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Health Check-in
                Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      {[
                        "Date",
                        "Weight (kg)",
                        "Height (cm)",
                        "Waist (cm)",
                        "Thigh (cm)",
                        "Sleep (hrs)",
                        "Notes",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {healthRecords
                      .slice()
                      .reverse()
                      .map((r) => (
                        <tr
                          key={r.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-2.5 font-medium text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(r.recordedAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                          <td className="px-4 py-2.5 font-semibold">
                            {r.weight ?? "—"}
                          </td>
                          <td className="px-4 py-2.5">{r.height ?? "—"}</td>
                          <td className="px-4 py-2.5">{r.waistSize ?? "—"}</td>
                          <td className="px-4 py-2.5">{r.thighSize ?? "—"}</td>
                          <td className="px-4 py-2.5">{r.sleepHours ?? "—"}</td>
                          <td className="px-4 py-2.5 text-muted-foreground max-w-[200px] truncate">
                            {r.notes || "—"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Camera,
  Upload,
  AlertCircle,
  Star,
} from "lucide-react";
import { bebasNeue, lora } from "@/lib/fonts";
import { usePageNavigation } from "@/hooks/use-page-navigation";

interface RegFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  city: string;
  emergencyContact: string;
  height: string;
  weight: string;
  thighSize: string;
  waistSize: string;
  sleepHours: string;
  medicalConditions: string;
  fitnessLevel: string;
  confirmed: boolean;
  agreed: boolean;
}

const STEP_META = [
  { label: "Personal Info", desc: "Basic details about you" },
  { label: "Health Data", desc: "Your current fitness profile" },
  { label: "Review & Submit", desc: "Double-check & confirm" },
];

export default function RegisterPage() {
  const navigate = usePageNavigation();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState<RegFormData>({
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    city: "Thane",
    emergencyContact: "",
    height: "",
    weight: "",
    thighSize: "",
    waistSize: "",
    sleepHours: "",
    medicalConditions: "",
    fitnessLevel: "",
    confirmed: false,
    agreed: false,
  });

  // ── File state — stored in state so they survive AnimatePresence unmount ──
  const photoInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const set =
    (k: keyof RegFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = "Required";
    if (!form.lastName) e.lastName = "Required";
    if (!form.age) e.age = "Required";
    if (!form.gender) e.gender = "Required";
    if (!form.phone) e.phone = "Required";
    if (!form.email) e.email = "Required";
    if (!form.city) e.city = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.height) e.height = "Required for BMI calculation";
    if (!form.weight) e.weight = "Required for BMI calculation";
    if (!form.fitnessLevel) e.fitnessLevel = "Please select your level";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function handleSubmit() {
    setSubmitError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("firstName", form.firstName);
      fd.append("lastName", form.lastName);
      fd.append("age", form.age);
      fd.append("gender", form.gender.toUpperCase());
      fd.append("phone", form.phone);
      fd.append("email", form.email);
      fd.append("city", form.city);
      fd.append("emergencyContact", form.emergencyContact);
      fd.append("height", form.height);
      fd.append("weight", form.weight);
      fd.append("thighSize", form.thighSize);
      fd.append("waistSize", form.waistSize);
      fd.append("sleepHours", form.sleepHours);
      fd.append("medicalConditions", form.medicalConditions);
      fd.append("fitnessLevel", form.fitnessLevel.toUpperCase() || "BEGINNER");

      // Files are stored in state — survives step transitions safely
      if (photoFile) fd.append("profilePhoto", photoFile);
      if (reportFile) fd.append("medicalReport", reportFile);

      const res = await fetch("/api/register", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "Submission failed. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError(
        "Something went wrong. Please check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted)
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2
            className={`${bebasNeue.className} text-5xl tracking-wider text-foreground mb-3`}
          >
            APPLICATION SENT!
          </h2>
          <p className={`${lora.className} text-muted-foreground mb-2`}>
            Thanks, <strong>{form.firstName}</strong>! Your application is under
            review.
          </p>
          <p className={`${lora.className} text-sm text-muted-foreground mb-6`}>
            A confirmation has been sent to <strong>{form.email}</strong>. Once
            approved, you&apos;ll receive a link to set your password and access
            your member dashboard.
          </p>
          <Button onClick={() => navigate("home")} className="gap-1">
            Back to Home <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${bebasNeue.className} text-6xl sm:text-7xl tracking-wider text-foreground mb-2`}
        >
          JOIN THE
          <br />
          <span className="text-primary">MOVEMENT</span>
        </motion.h1>

        {/* Enhanced Step Progress */}
        <div className="mt-6 mb-8">
          <div className="flex items-start gap-0">
            {STEP_META.map((s, i) => {
              const num = i + 1;
              const done = step > num;
              const active = step === num;
              return (
                <div
                  key={num}
                  className="flex-1 flex flex-col items-center relative"
                >
                  {/* Connector line */}
                  {i > 0 && (
                    <div
                      className={`absolute left-0 top-4 h-0.5 w-full -translate-x-1/2 transition-colors duration-500 ${done || active ? "bg-primary" : "bg-muted"}`}
                    />
                  )}
                  {/* Circle */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
                      done
                        ? "bg-primary text-primary-foreground"
                        : active
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? <CheckCircle className="w-4 h-4" /> : num}
                  </div>
                  {/* Label */}
                  <div className="mt-2 text-center px-1">
                    <p
                      className={`text-xs font-bold ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {s.label}
                    </p>
                    <p
                      className={`text-[10px] hidden sm:block ${active ? "text-muted-foreground" : "text-muted-foreground/60"}`}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-border">
                <CardHeader>
                  <CardTitle
                    className={`${bebasNeue.className} text-2xl tracking-wide`}
                  >
                    Personal Information
                  </CardTitle>
                  <p
                    className={`${lora.className} text-sm text-muted-foreground`}
                  >
                    Fields marked{" "}
                    <span className="text-destructive font-bold">*</span> are
                    required.
                  </p>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Gender <span className="text-destructive">*</span>{" "}
                      {errors.gender && (
                        <span className="text-destructive text-xs ml-1">
                          {errors.gender}
                        </span>
                      )}
                    </Label>
                    <Select
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, gender: v }))
                      }
                    >
                      <SelectTrigger
                        className={`mt-1 ${errors.gender ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { v: "MALE", l: "Male" },
                          { v: "FEMALE", l: "Female" },
                          { v: "OTHER", l: "Other" },
                        ].map((g) => (
                          <SelectItem key={g.v} value={g.v}>
                            {g.l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {[
                    {
                      label: "First Name",
                      key: "firstName" as const,
                      placeholder: "Rahul",
                      req: true,
                    },
                    {
                      label: "Last Name",
                      key: "lastName" as const,
                      placeholder: "Sharma",
                      req: true,
                    },
                    {
                      label: "Age",
                      key: "age" as const,
                      placeholder: "28",
                      type: "number",
                      req: true,
                    },
                    {
                      label: "Phone Number",
                      key: "phone" as const,
                      placeholder: "+91 98765 43210",
                      req: true,
                    },
                    {
                      label: "Email Address",
                      key: "email" as const,
                      placeholder: "rahul@email.com",
                      req: true,
                    },
                    {
                      label: "City",
                      key: "city" as const,
                      placeholder: "Thane",
                      req: true,
                    },
                    {
                      label: "Emergency Contact (Name & Phone)",
                      key: "emergencyContact" as const,
                      placeholder: "Sunita Sharma +91 98765 00000",
                      req: false,
                    },
                  ].map((f) => (
                    <div
                      key={f.key}
                      className={
                        f.key === "emergencyContact" ? "sm:col-span-2" : ""
                      }
                    >
                      <Label>
                        {f.label}{" "}
                        {f.req && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        className={`mt-1 ${errors[f.key] ? "border-destructive" : ""}`}
                        type={f.type || "text"}
                        placeholder={f.placeholder}
                        value={form[f.key] as string}
                        onChange={set(f.key)}
                      />
                      {errors[f.key] && (
                        <p className="text-destructive text-xs mt-1">
                          {errors[f.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Button
                className="mt-4 w-full gap-1 h-12 text-base"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
              >
                Continue to Health Data <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Why this matters banner */}
              <div className="mb-4 flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                <Star className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <p className={`${lora.className} text-sm text-foreground`}>
                  <strong>Why this matters:</strong> Your health data helps us
                  personalise training plans, track your progress, and ensure
                  your safety during all Run4Health events.
                </p>
              </div>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle
                    className={`${bebasNeue.className} text-2xl tracking-wide`}
                  >
                    Health & Fitness Data
                  </CardTitle>
                  <p
                    className={`${lora.className} text-sm text-muted-foreground`}
                  >
                    Fields marked{" "}
                    <span className="text-destructive font-bold">*</span> are
                    required. Others are strongly recommended.
                  </p>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      label: "Height (cm)",
                      key: "height" as const,
                      placeholder: "170",
                      req: true,
                    },
                    {
                      label: "Weight (kg)",
                      key: "weight" as const,
                      placeholder: "70",
                      req: true,
                    },
                    {
                      label: "Thigh size (cm)",
                      key: "thighSize" as const,
                      placeholder: "52",
                      req: false,
                    },
                    {
                      label: "Waist/Stomach (cm)",
                      key: "waistSize" as const,
                      placeholder: "82",
                      req: false,
                    },
                  ].map((f) => (
                    <div key={f.key}>
                      <Label>
                        {f.label}{" "}
                        {f.req && <span className="text-destructive">*</span>}
                      </Label>
                      <Input
                        className={`mt-1 ${errors[f.key] ? "border-destructive" : ""}`}
                        type="number"
                        placeholder={f.placeholder}
                        value={form[f.key] as string}
                        onChange={set(f.key)}
                      />
                      {errors[f.key] && (
                        <p className="text-destructive text-xs mt-1">
                          {errors[f.key]}
                        </p>
                      )}
                    </div>
                  ))}
                  <div>
                    <Label>Avg. Sleep (hrs/night)</Label>
                    <Select
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, sleepHours: v }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {["4", "5", "6", "7", "8", "9"].map((s) => (
                          <SelectItem key={s} value={s}>
                            {s} hours
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>
                      Fitness Level <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.fitnessLevel}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, fitnessLevel: v }))
                      }
                    >
                      <SelectTrigger
                        className={`mt-1 ${errors.fitnessLevel ? "border-destructive" : ""}`}
                      >
                        <SelectValue placeholder="Select your level" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { v: "BEGINNER", l: "Beginner — just starting out" },
                          {
                            v: "INTERMEDIATE",
                            l: "Intermediate — running 3+ months",
                          },
                          { v: "ADVANCED", l: "Advanced — competitive runner" },
                        ].map((s) => (
                          <SelectItem key={s.v} value={s.v}>
                            {s.l}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fitnessLevel && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.fitnessLevel}
                      </p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Medical Conditions (if any)</Label>
                    <Textarea
                      className="mt-1"
                      placeholder="e.g. Asthma, Diabetes, Knee injury — leave blank if none"
                      value={form.medicalConditions}
                      onChange={set("medicalConditions")}
                    />
                  </div>

                  {/* Profile Photo — stored in state to survive step transitions */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <Label className="flex items-center gap-1">
                        Profile Photo
                        <span
                          className={`${lora.className} text-xs font-normal ml-1 ${photoFile ? "text-primary" : "text-amber-600 dark:text-amber-400"}`}
                        >
                          {photoFile ? "✓ Selected" : "(strongly recommended)"}
                        </span>
                      </Label>
                    </div>
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      id="profilePhoto"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        setPhotoFile(f);
                        if (f) {
                          const url = URL.createObjectURL(f);
                          setPhotoPreview(url);
                        } else {
                          setPhotoPreview("");
                        }
                      }}
                    />
                    <label
                      htmlFor="profilePhoto"
                      className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition-all ${
                        photoFile
                          ? "border-primary/50 bg-primary/5"
                          : "border-dashed border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="preview"
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <Camera className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p
                          className={`${lora.className} text-sm font-medium text-foreground`}
                        >
                          {photoFile
                            ? photoFile.name
                            : "Upload your profile photo"}
                        </p>
                        <p
                          className={`${lora.className} text-xs text-muted-foreground`}
                        >
                          JPG or PNG, max 10 MB
                        </p>
                      </div>
                      <span
                        className={`ml-auto text-xs font-semibold shrink-0 ${photoFile ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {photoFile ? "Change" : "Browse"}
                      </span>
                    </label>
                  </div>

                  {/* Medical Report — stored in state */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <Label className="flex items-center gap-1">
                        Medical Report / Blood Test
                        <span
                          className={`${lora.className} text-xs font-normal ml-1 ${reportFile ? "text-primary" : "text-muted-foreground"}`}
                        >
                          {reportFile ? "✓ Selected" : "(optional but helpful)"}
                        </span>
                      </Label>
                    </div>
                    <input
                      ref={reportInputRef}
                      type="file"
                      accept=".pdf,image/*"
                      id="medicalReport"
                      className="sr-only"
                      onChange={(e) => {
                        setReportFile(e.target.files?.[0] ?? null);
                      }}
                    />
                    <label
                      htmlFor="medicalReport"
                      className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer transition-all ${
                        reportFile
                          ? "border-primary/50 bg-primary/5"
                          : "border-dashed border-border hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`${lora.className} text-sm font-medium text-foreground`}
                        >
                          {reportFile
                            ? reportFile.name
                            : "Upload medical report or blood test"}
                        </p>
                        <p
                          className={`${lora.className} text-xs text-muted-foreground`}
                        >
                          PDF or image, max 10 MB
                        </p>
                      </div>
                      <span
                        className={`ml-auto text-xs font-semibold shrink-0 ${reportFile ? "text-primary" : "text-muted-foreground"}`}
                      >
                        {reportFile ? "Change" : "Browse"}
                      </span>
                    </label>
                  </div>

                  {!photoFile && (
                    <div className="sm:col-span-2 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <p
                        className={`${lora.className} text-xs text-amber-700 dark:text-amber-300`}
                      >
                        Adding a profile photo helps our team verify your
                        identity during events and improves your membership
                        experience.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <div className="flex gap-3 mt-4">
                <Button
                  variant="outline"
                  className="gap-1 h-12"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  className="flex-1 gap-1 h-12 text-base"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                >
                  Review & Submit <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="s3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Review card */}
              <Card className="border-border mb-4">
                <CardHeader>
                  <CardTitle
                    className={`${bebasNeue.className} text-2xl tracking-wide`}
                  >
                    Review Your Application
                  </CardTitle>
                  <p
                    className={`${lora.className} text-sm text-muted-foreground`}
                  >
                    Please verify all details before submitting. You can go back
                    to correct anything.
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Personal */}
                  <p
                    className={`${lora.className} text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2`}
                  >
                    Personal
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm mb-4">
                    {[
                      ["Full Name", `${form.firstName} ${form.lastName}`],
                      ["Age", form.age],
                      ["Gender", form.gender],
                      ["Phone", form.phone],
                      ["Email", form.email],
                      ["City", form.city],
                      form.emergencyContact
                        ? ["Emergency Contact", form.emergencyContact]
                        : null,
                    ]
                      .filter(Boolean)
                      .map((item) => {
                        const [k, v] = item as [string, string];
                        return (
                          <div
                            key={k}
                            className="flex justify-between border-b border-border/50 pb-2"
                          >
                            <span
                              className={`${lora.className} text-muted-foreground`}
                            >
                              {k}
                            </span>
                            <span
                              className={`${lora.className} font-medium text-foreground text-right`}
                            >
                              {v}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                  <p
                    className={`${lora.className} text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2`}
                  >
                    Health
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm mb-4">
                    {[
                      ["Height", form.height ? form.height + " cm" : ""],
                      ["Weight", form.weight ? form.weight + " kg" : ""],
                      form.thighSize ? ["Thigh", form.thighSize + " cm"] : null,
                      form.waistSize ? ["Waist", form.waistSize + " cm"] : null,
                      form.fitnessLevel
                        ? ["Fitness Level", form.fitnessLevel]
                        : null,
                      form.sleepHours
                        ? ["Sleep", form.sleepHours + " hrs/night"]
                        : null,
                    ]
                      .filter(Boolean)
                      .map((item) => {
                        const [k, v] = item as [string, string];
                        return v ? (
                          <div
                            key={k}
                            className="flex justify-between border-b border-border/50 pb-2"
                          >
                            <span
                              className={`${lora.className} text-muted-foreground`}
                            >
                              {k}
                            </span>
                            <span
                              className={`${lora.className} font-medium text-foreground`}
                            >
                              {v}
                            </span>
                          </div>
                        ) : null;
                      })}
                  </div>

                  {/* Uploaded files */}
                  <div className="flex flex-wrap gap-3 mb-5">
                    {photoFile ? (
                      <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span
                          className={`${lora.className} text-xs font-medium text-foreground`}
                        >
                          📷 {photoFile.name}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg px-3 py-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span
                          className={`${lora.className} text-xs text-amber-700 dark:text-amber-300`}
                        >
                          No profile photo —{" "}
                          <button
                            className="underline font-medium"
                            onClick={() => setStep(2)}
                          >
                            go back to add
                          </button>
                        </span>
                      </div>
                    )}
                    {reportFile && (
                      <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                        <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span
                          className={`${lora.className} text-xs font-medium text-foreground`}
                        >
                          📄 {reportFile.name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3 bg-muted/30 rounded-xl p-4">
                    {[
                      {
                        key: "confirmed" as const,
                        label:
                          "I confirm that all the information I have provided is accurate and true.",
                      },
                      {
                        key: "agreed" as const,
                        label:
                          "I agree to the Run4Health community guidelines and code of conduct.",
                      },
                    ].map((c) => (
                      <div
                        key={c.key}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${form[c.key] ? "border-primary/40 bg-primary/5" : "border-border hover:border-primary/30"}`}
                        onClick={() =>
                          setForm((p) => ({ ...p, [c.key]: !p[c.key] }))
                        }
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${form[c.key] ? "bg-primary border-primary" : "border-muted-foreground/50"}`}
                        >
                          {form[c.key] && (
                            <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />
                          )}
                        </div>
                        <label
                          className={`${lora.className} text-sm text-foreground cursor-pointer leading-relaxed`}
                        >
                          {c.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-start gap-2 bg-muted/50 rounded-xl px-4 py-3">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p
                      className={`${lora.className} text-xs text-muted-foreground`}
                    >
                      After submission, your application will be reviewed by our
                      team. If approved, you&apos;ll get a secure email link to
                      set your password and access your member dashboard.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {submitError && (
                <div className="mb-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className={lora.className}>{submitError}</span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="gap-1 h-12"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                <Button
                  className="flex-1 gap-1 h-12 text-base"
                  disabled={!form.confirmed || !form.agreed || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                      Submitting…
                    </span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" /> Submit Application
                    </>
                  )}
                </Button>
              </div>
              {(!form.confirmed || !form.agreed) && (
                <p
                  className={`${lora.className} text-xs text-muted-foreground text-center mt-2`}
                >
                  Please check both boxes above to submit.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface RegFormData {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  city: string;
  emergencyContact: string;
  height: string;
  weight: string;
  thighSize: string;
  waistSize: string;
  sleepHours: string;
  medicalConditions: string;
  fitnessLevel: string;
  confirmed: boolean;
  agreed: boolean;
}

// export default function RegisterPage() {
//   const navigate = usePageNavigation();
//   const [step, setStep] = useState(1);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [submitted, setSubmitted] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState("");
//   const [form, setForm] = useState<RegFormData>({
//     firstName: "",
//     lastName: "",
//     age: "",
//     gender: "",
//     phone: "",
//     email: "",
//     city: "Thane",
//     emergencyContact: "",
//     height: "",
//     weight: "",
//     thighSize: "",
//     waistSize: "",
//     sleepHours: "",
//     medicalConditions: "",
//     fitnessLevel: "",
//     confirmed: false,
//     agreed: false,
//   });

//   const photoRef = useRef<HTMLInputElement>(null);
//   const reportRef = useRef<HTMLInputElement>(null);
//   const [photoName, setPhotoName] = useState("");
//   const [reportName, setReportName] = useState("");

//   const set =
//     (k: keyof RegFormData) =>
//     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
//       setForm((p) => ({ ...p, [k]: e.target.value }));

//   const validateStep1 = () => {
//     const e: Record<string, string> = {};
//     if (!form.firstName) e.firstName = "Required";
//     if (!form.lastName) e.lastName = "Required";
//     if (!form.age) e.age = "Required";
//     if (!form.gender) e.gender = "Required";
//     if (!form.phone) e.phone = "Required";
//     if (!form.email) e.email = "Required";
//     if (!form.city) e.city = "Required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const validateStep2 = () => {
//     const e: Record<string, string> = {};
//     if (!form.height) e.height = "Required";
//     if (!form.weight) e.weight = "Required";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   async function handleSubmit() {
//     setSubmitError("");
//     setSubmitting(true);
//     try {
//       const fd = new FormData();
//       fd.append("firstName", form.firstName);
//       fd.append("lastName", form.lastName);
//       fd.append("age", form.age);
//       fd.append("gender", form.gender.toUpperCase());
//       fd.append("phone", form.phone);
//       fd.append("email", form.email);
//       fd.append("city", form.city);
//       fd.append("emergencyContact", form.emergencyContact);
//       fd.append("height", form.height);
//       fd.append("weight", form.weight);
//       fd.append("thighSize", form.thighSize);
//       fd.append("waistSize", form.waistSize);
//       fd.append("sleepHours", form.sleepHours);
//       fd.append("medicalConditions", form.medicalConditions);
//       fd.append("fitnessLevel", form.fitnessLevel.toUpperCase() || "BEGINNER");

//       const photoFile = photoRef.current?.files?.[0];
//       if (photoFile) fd.append("profilePhoto", photoFile);
//       const reportFile = reportRef.current?.files?.[0];
//       if (reportFile) fd.append("medicalReport", reportFile);

//       const res = await fetch("/api/register", { method: "POST", body: fd });
//       const data = await res.json();
//       if (!res.ok) {
//         setSubmitError(data.error || "Submission failed. Please try again.");
//         return;
//       }
//       setSubmitted(true);
//     } catch {
//       setSubmitError(
//         "Something went wrong. Please check your connection and try again.",
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (submitted)
//     return (
//       <div className="min-h-screen flex items-center justify-center pt-20 px-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center max-w-md"
//         >
//           <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
//           <h2
//             className={`${bebasNeue.className} text-5xl tracking-wider text-foreground mb-3`}
//           >
//             APPLICATION SENT!
//           </h2>
//           <p className={`${lora.className} text-muted-foreground mb-2`}>
//             Thanks, <strong>{form.firstName}</strong>! Your application is under
//             review.
//           </p>
//           <p className={`${lora.className} text-sm text-muted-foreground mb-6`}>
//             A confirmation has been sent to <strong>{form.email}</strong>. Once
//             approved, you&apos;ll receive a link to set your password and access
//             your member dashboard.
//           </p>
//           <Button onClick={() => navigate("home")} className="gap-1">
//             Back to Home <ArrowRight className="w-4 h-4" />
//           </Button>
//         </motion.div>
//       </div>
//     );

//   return (
//     <div className="min-h-screen pt-20">
//       <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
//         <motion.h1
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           className={`${bebasNeue.className} text-6xl sm:text-7xl tracking-wider text-foreground mb-2`}
//         >
//           JOIN THE
//           <br />
//           <span className="text-primary">MOVEMENT</span>
//         </motion.h1>

//         {/* Progress */}
//         <div className="flex items-center gap-2 mb-8 mt-6">
//           {[1, 2, 3].map((s) => (
//             <div
//               key={s}
//               className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted"
//             >
//               <div
//                 className={`h-full rounded-full bg-primary transition-all duration-500 ${step >= s ? "w-full" : "w-0"}`}
//               />
//             </div>
//           ))}
//           <span
//             className={`${lora.className} text-xs text-muted-foreground ml-2 shrink-0`}
//           >
//             Step {step}/3
//           </span>
//         </div>

//         <AnimatePresence mode="wait">
//           {step === 1 && (
//             <motion.div
//               key="s1"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//             >
//               <Card className="border-border">
//                 <CardHeader>
//                   <CardTitle
//                     className={`${bebasNeue.className} text-2xl tracking-wide`}
//                   >
//                     Personal Information
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid sm:grid-cols-2 gap-4">
//                   <div>
//                     <Label>
//                       Gender{" "}
//                       {errors.gender && (
//                         <span className="text-destructive text-xs ml-1">
//                           {errors.gender}
//                         </span>
//                       )}
//                     </Label>
//                     <Select
//                       onValueChange={(v) =>
//                         setForm((p) => ({ ...p, gender: v }))
//                       }
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select gender" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {[
//                           { v: "MALE", l: "Male" },
//                           { v: "FEMALE", l: "Female" },
//                           { v: "OTHER", l: "Other" },
//                         ].map((g) => (
//                           <SelectItem key={g.v} value={g.v}>
//                             {g.l}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   {[
//                     {
//                       label: "First Name",
//                       key: "firstName" as const,
//                       placeholder: "Rahul",
//                     },
//                     {
//                       label: "Last Name",
//                       key: "lastName" as const,
//                       placeholder: "Sharma",
//                     },
//                     {
//                       label: "Age",
//                       key: "age" as const,
//                       placeholder: "28",
//                       type: "number",
//                     },
//                     {
//                       label: "Phone Number",
//                       key: "phone" as const,
//                       placeholder: "+91 98765 43210",
//                     },
//                     {
//                       label: "Email Address",
//                       key: "email" as const,
//                       placeholder: "rahul@email.com",
//                     },
//                     {
//                       label: "City",
//                       key: "city" as const,
//                       placeholder: "Thane",
//                     },
//                     {
//                       label: "Emergency Contact (Name & Phone)",
//                       key: "emergencyContact" as const,
//                       placeholder: "Sunita Sharma +91 98765 00000",
//                     },
//                   ].map((f) => (
//                     <div
//                       key={f.key}
//                       className={
//                         f.key === "emergencyContact" ? "sm:col-span-2" : ""
//                       }
//                     >
//                       <Label>{f.label}</Label>
//                       <Input
//                         className={`mt-1 ${errors[f.key] ? "border-destructive" : ""}`}
//                         type={f.type || "text"}
//                         placeholder={f.placeholder}
//                         value={form[f.key] as string}
//                         onChange={set(f.key)}
//                       />
//                       {errors[f.key] && (
//                         <p className="text-destructive text-xs mt-1">
//                           {errors[f.key]}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </CardContent>
//               </Card>
//               <Button
//                 className="mt-4 w-full gap-1"
//                 onClick={() => {
//                   if (validateStep1()) setStep(2);
//                 }}
//               >
//                 Next Step <ArrowRight className="w-4 h-4" />
//               </Button>
//             </motion.div>
//           )}

//           {step === 2 && (
//             <motion.div
//               key="s2"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//             >
//               <Card className="border-border">
//                 <CardHeader>
//                   <CardTitle
//                     className={`${bebasNeue.className} text-2xl tracking-wide`}
//                   >
//                     Health Data
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="grid sm:grid-cols-2 gap-4">
//                   {[
//                     {
//                       label: "Height (cm)",
//                       key: "height" as const,
//                       placeholder: "170",
//                     },
//                     {
//                       label: "Weight (kg)",
//                       key: "weight" as const,
//                       placeholder: "70",
//                     },
//                     {
//                       label: "Thigh size (cm)",
//                       key: "thighSize" as const,
//                       placeholder: "52",
//                     },
//                     {
//                       label: "Waist/Stomach (cm)",
//                       key: "waistSize" as const,
//                       placeholder: "82",
//                     },
//                   ].map((f) => (
//                     <div key={f.key}>
//                       <Label>{f.label}</Label>
//                       <Input
//                         className={`mt-1 ${errors[f.key] ? "border-destructive" : ""}`}
//                         type="number"
//                         placeholder={f.placeholder}
//                         value={form[f.key] as string}
//                         onChange={set(f.key)}
//                       />
//                       {errors[f.key] && (
//                         <p className="text-destructive text-xs mt-1">
//                           {errors[f.key]}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                   <div>
//                     <Label>Avg. Sleep (hrs/night)</Label>
//                     <Select
//                       onValueChange={(v) =>
//                         setForm((p) => ({ ...p, sleepHours: v }))
//                       }
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {["4", "5", "6", "7", "8", "9"].map((s) => (
//                           <SelectItem key={s} value={s}>
//                             {s} hours
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div>
//                     <Label>Fitness Level</Label>
//                     <Select
//                       onValueChange={(v) =>
//                         setForm((p) => ({ ...p, fitnessLevel: v }))
//                       }
//                     >
//                       <SelectTrigger className="mt-1">
//                         <SelectValue placeholder="Select" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {[
//                           { v: "BEGINNER", l: "Beginner" },
//                           { v: "INTERMEDIATE", l: "Intermediate" },
//                           { v: "ADVANCED", l: "Advanced" },
//                         ].map((s) => (
//                           <SelectItem key={s.v} value={s.v}>
//                             {s.l}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                   <div className="sm:col-span-2">
//                     <Label>Medical Conditions (if any)</Label>
//                     <Textarea
//                       className="mt-1"
//                       placeholder="e.g. Asthma, Diabetes, Knee injury..."
//                       value={form.medicalConditions}
//                       onChange={set("medicalConditions")}
//                     />
//                   </div>

//                   {/* Profile Photo */}
//                   <div>
//                     <Label>Profile Photo (optional)</Label>
//                     <input
//                       ref={photoRef}
//                       type="file"
//                       accept="image/*"
//                       id="profilePhoto"
//                       className="sr-only"
//                       onChange={(e) =>
//                         setPhotoName(e.target.files?.[0]?.name || "")
//                       }
//                     />
//                     <label
//                       htmlFor="profilePhoto"
//                       className="mt-1 flex items-center gap-2 border border-border rounded-md px-3 py-2.5 cursor-pointer hover:border-primary/60 transition-colors text-sm text-muted-foreground"
//                     >
//                       <Camera className="w-4 h-4 text-primary shrink-0" />
//                       <span className="truncate">
//                         {photoName || "Upload photo (JPG/PNG, max 5MB)"}
//                       </span>
//                     </label>
//                   </div>

//                   {/* Medical Report */}
//                   <div>
//                     <Label>Medical Reports (optional)</Label>
//                     <input
//                       ref={reportRef}
//                       type="file"
//                       accept=".pdf,image/*"
//                       id="medicalReport"
//                       className="sr-only"
//                       onChange={(e) =>
//                         setReportName(e.target.files?.[0]?.name || "")
//                       }
//                     />
//                     <label
//                       htmlFor="medicalReport"
//                       className="mt-1 flex items-center gap-2 border border-border rounded-md px-3 py-2.5 cursor-pointer hover:border-primary/60 transition-colors text-sm text-muted-foreground"
//                     >
//                       <Upload className="w-4 h-4 text-primary shrink-0" />
//                       <span className="truncate">
//                         {reportName || "Upload PDF or image"}
//                       </span>
//                     </label>
//                   </div>
//                 </CardContent>
//               </Card>
//               <div className="flex gap-3 mt-4">
//                 <Button
//                   variant="outline"
//                   className="gap-1"
//                   onClick={() => setStep(1)}
//                 >
//                   <ArrowLeft className="w-4 h-4" /> Previous
//                 </Button>
//                 <Button
//                   className="flex-1 gap-1"
//                   onClick={() => {
//                     if (validateStep2()) setStep(3);
//                   }}
//                 >
//                   Next Step <ArrowRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             </motion.div>
//           )}

//           {step === 3 && (
//             <motion.div
//               key="s3"
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -20 }}
//             >
//               <Card className="border-border mb-4">
//                 <CardHeader>
//                   <CardTitle
//                     className={`${bebasNeue.className} text-2xl tracking-wide`}
//                   >
//                     Confirm Details
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid sm:grid-cols-2 gap-3 text-sm">
//                     {[
//                       ["Name", `${form.firstName} ${form.lastName}`],
//                       ["Age", form.age],
//                       ["Gender", form.gender],
//                       ["Phone", form.phone],
//                       ["Email", form.email],
//                       ["City", form.city],
//                       ["Height", form.height ? form.height + " cm" : ""],
//                       ["Weight", form.weight ? form.weight + " kg" : ""],
//                       ["Fitness Level", form.fitnessLevel],
//                       [
//                         "Sleep",
//                         form.sleepHours ? form.sleepHours + " hrs" : "",
//                       ],
//                     ].map(([k, v]) =>
//                       v ? (
//                         <div
//                           key={k}
//                           className="flex justify-between border-b border-border pb-2"
//                         >
//                           <span
//                             className={`${lora.className} text-muted-foreground`}
//                           >
//                             {k}
//                           </span>
//                           <span
//                             className={`${lora.className} font-medium text-foreground`}
//                           >
//                             {v}
//                           </span>
//                         </div>
//                       ) : null,
//                     )}
//                   </div>

//                   {photoName && (
//                     <p
//                       className={`${lora.className} text-xs text-muted-foreground mt-3`}
//                     >
//                       📷 Photo: {photoName}
//                     </p>
//                   )}
//                   {reportName && (
//                     <p
//                       className={`${lora.className} text-xs text-muted-foreground mt-1`}
//                     >
//                       📄 Report: {reportName}
//                     </p>
//                   )}

//                   <div className="mt-5 space-y-3">
//                     {[
//                       {
//                         key: "confirmed" as const,
//                         label: "I confirm the above information is accurate",
//                       },
//                       {
//                         key: "agreed" as const,
//                         label: "I agree to the Run4Health community guidelines",
//                       },
//                     ].map((c) => (
//                       <div key={c.key} className="flex items-start gap-2">
//                         <input
//                           type="checkbox"
//                           id={c.key}
//                           checked={form[c.key] as boolean}
//                           onChange={(e) =>
//                             setForm((p) => ({
//                               ...p,
//                               [c.key]: e.target.checked,
//                             }))
//                           }
//                           className="mt-0.5 accent-primary"
//                         />
//                         <label
//                           htmlFor={c.key}
//                           className={`${lora.className} text-sm text-muted-foreground cursor-pointer`}
//                         >
//                           {c.label}
//                         </label>
//                       </div>
//                     ))}
//                   </div>

//                   <p
//                     className={`${lora.className} text-xs text-muted-foreground mt-4 bg-muted/50 rounded-md p-3`}
//                   >
//                     📧 After submission, your application will be reviewed. If
//                     approved, you'll get an email with a secure link to set your
//                     password and join the community!
//                   </p>
//                 </CardContent>
//               </Card>

//               {submitError && (
//                 <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
//                   {submitError}
//                 </div>
//               )}

//               <div className="flex gap-3">
//                 <Button
//                   variant="outline"
//                   className="gap-1"
//                   onClick={() => setStep(2)}
//                 >
//                   <ArrowLeft className="w-4 h-4" /> Previous
//                 </Button>
//                 <Button
//                   className="flex-1 gap-1"
//                   disabled={!form.confirmed || !form.agreed || submitting}
//                   onClick={handleSubmit}
//                 >
//                   {submitting ? (
//                     "Submitting…"
//                   ) : (
//                     <>
//                       <CheckCircle className="w-4 h-4" /> Submit Registration
//                     </>
//                   )}
//                 </Button>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

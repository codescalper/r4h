"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, ArrowRight, ArrowLeft, Camera, Upload } from "lucide-react"
import { bebasNeue, lora } from "@/lib/fonts"
import { usePageNavigation } from "@/hooks/use-page-navigation"

interface RegFormData {
  firstName: string; lastName: string; age: string; gender: string;
  phone: string; email: string; city: string; emergencyContact: string;
  height: string; weight: string; thighSize: string; waistSize: string;
  sleepHours: string; medicalConditions: string; fitnessLevel: string;
  confirmed: boolean; agreed: boolean;
}

export default function RegisterPage() {
  const navigate = usePageNavigation()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [form, setForm] = useState<RegFormData>({
    firstName: "", lastName: "", age: "", gender: "", phone: "", email: "",
    city: "Thane", emergencyContact: "", height: "", weight: "",
    thighSize: "", waistSize: "", sleepHours: "", medicalConditions: "",
    fitnessLevel: "", confirmed: false, agreed: false,
  })

  const photoRef = useRef<HTMLInputElement>(null)
  const reportRef = useRef<HTMLInputElement>(null)
  const [photoName, setPhotoName] = useState("")
  const [reportName, setReportName] = useState("")

  const set = (k: keyof RegFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const validateStep1 = () => {
    const e: Record<string, string> = {}
    if (!form.firstName) e.firstName = "Required"
    if (!form.lastName) e.lastName = "Required"
    if (!form.age) e.age = "Required"
    if (!form.gender) e.gender = "Required"
    if (!form.phone) e.phone = "Required"
    if (!form.email) e.email = "Required"
    if (!form.city) e.city = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Record<string, string> = {}
    if (!form.height) e.height = "Required"
    if (!form.weight) e.weight = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit() {
    setSubmitError("")
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append("firstName", form.firstName)
      fd.append("lastName", form.lastName)
      fd.append("age", form.age)
      fd.append("gender", form.gender.toUpperCase())
      fd.append("phone", form.phone)
      fd.append("email", form.email)
      fd.append("city", form.city)
      fd.append("emergencyContact", form.emergencyContact)
      fd.append("height", form.height)
      fd.append("weight", form.weight)
      fd.append("thighSize", form.thighSize)
      fd.append("waistSize", form.waistSize)
      fd.append("sleepHours", form.sleepHours)
      fd.append("medicalConditions", form.medicalConditions)
      fd.append("fitnessLevel", form.fitnessLevel.toUpperCase() || "BEGINNER")

      const photoFile = photoRef.current?.files?.[0]
      if (photoFile) fd.append("profilePhoto", photoFile)
      const reportFile = reportRef.current?.files?.[0]
      if (reportFile) fd.append("medicalReport", reportFile)

      const res = await fetch("/api/register", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) { setSubmitError(data.error || "Submission failed. Please try again."); return }
      setSubmitted(true)
    } catch {
      setSubmitError("Something went wrong. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className={`${bebasNeue.className} text-5xl tracking-wider text-foreground mb-3`}>APPLICATION SENT!</h2>
        <p className={`${lora.className} text-muted-foreground mb-2`}>
          Thanks, <strong>{form.firstName}</strong>! Your application is under review.
        </p>
        <p className={`${lora.className} text-sm text-muted-foreground mb-6`}>
          A confirmation has been sent to <strong>{form.email}</strong>. Once approved, you'll receive a link to set your password and access your member dashboard.
        </p>
        <Button onClick={() => navigate("home")} className="gap-1">Back to Home <ArrowRight className="w-4 h-4" /></Button>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`${bebasNeue.className} text-6xl sm:text-7xl tracking-wider text-foreground mb-2`}>
          JOIN THE<br /><span className="text-primary">MOVEMENT</span>
        </motion.h1>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 mt-6">
          {[1,2,3].map(s => (
            <div key={s} className="flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
              <div className={`h-full rounded-full bg-primary transition-all duration-500 ${step >= s ? "w-full" : "w-0"}`} />
            </div>
          ))}
          <span className={`${lora.className} text-xs text-muted-foreground ml-2 shrink-0`}>Step {step}/3</span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border">
                <CardHeader><CardTitle className={`${bebasNeue.className} text-2xl tracking-wide`}>Personal Information</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Gender {errors.gender && <span className="text-destructive text-xs ml-1">{errors.gender}</span>}</Label>
                    <Select onValueChange={v => setForm(p => ({...p, gender: v}))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        {[{v:"MALE",l:"Male"},{v:"FEMALE",l:"Female"},{v:"OTHER",l:"Other"}].map(g => <SelectItem key={g.v} value={g.v}>{g.l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {[
                    { label: "First Name", key: "firstName" as const, placeholder: "Rahul" },
                    { label: "Last Name", key: "lastName" as const, placeholder: "Sharma" },
                    { label: "Age", key: "age" as const, placeholder: "28", type: "number" },
                    { label: "Phone Number", key: "phone" as const, placeholder: "+91 98765 43210" },
                    { label: "Email Address", key: "email" as const, placeholder: "rahul@email.com" },
                    { label: "City", key: "city" as const, placeholder: "Thane" },
                    { label: "Emergency Contact (Name & Phone)", key: "emergencyContact" as const, placeholder: "Sunita Sharma +91 98765 00000" },
                  ].map(f => (
                    <div key={f.key} className={f.key === "emergencyContact" ? "sm:col-span-2" : ""}>
                      <Label>{f.label}</Label>
                      <Input className={`mt-1 ${errors[f.key] ? "border-destructive" : ""}`} type={f.type || "text"} placeholder={f.placeholder} value={form[f.key] as string} onChange={set(f.key)} />
                      {errors[f.key] && <p className="text-destructive text-xs mt-1">{errors[f.key]}</p>}
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Button className="mt-4 w-full gap-1" onClick={() => { if(validateStep1()) setStep(2) }}>
                Next Step <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border">
                <CardHeader><CardTitle className={`${bebasNeue.className} text-2xl tracking-wide`}>Health Data</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Height (cm)", key: "height" as const, placeholder: "170" },
                    { label: "Weight (kg)", key: "weight" as const, placeholder: "70" },
                    { label: "Thigh size (cm)", key: "thighSize" as const, placeholder: "52" },
                    { label: "Waist/Stomach (cm)", key: "waistSize" as const, placeholder: "82" },
                  ].map(f => (
                    <div key={f.key}>
                      <Label>{f.label}</Label>
                      <Input className={`mt-1 ${errors[f.key] ? "border-destructive" : ""}`} type="number" placeholder={f.placeholder} value={form[f.key] as string} onChange={set(f.key)} />
                      {errors[f.key] && <p className="text-destructive text-xs mt-1">{errors[f.key]}</p>}
                    </div>
                  ))}
                  <div>
                    <Label>Avg. Sleep (hrs/night)</Label>
                    <Select onValueChange={v => setForm(p => ({...p, sleepHours: v}))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["4","5","6","7","8","9"].map(s => <SelectItem key={s} value={s}>{s} hours</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Fitness Level</Label>
                    <Select onValueChange={v => setForm(p => ({...p, fitnessLevel: v}))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {[{v:"BEGINNER",l:"Beginner"},{v:"INTERMEDIATE",l:"Intermediate"},{v:"ADVANCED",l:"Advanced"}].map(s => <SelectItem key={s.v} value={s.v}>{s.l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Medical Conditions (if any)</Label>
                    <Textarea className="mt-1" placeholder="e.g. Asthma, Diabetes, Knee injury..." value={form.medicalConditions} onChange={set("medicalConditions")} />
                  </div>

                  {/* Profile Photo */}
                  <div>
                    <Label>Profile Photo (optional)</Label>
                    <input ref={photoRef} type="file" accept="image/*" id="profilePhoto" className="sr-only"
                      onChange={e => setPhotoName(e.target.files?.[0]?.name || "")} />
                    <label htmlFor="profilePhoto" className="mt-1 flex items-center gap-2 border border-border rounded-md px-3 py-2.5 cursor-pointer hover:border-primary/60 transition-colors text-sm text-muted-foreground">
                      <Camera className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{photoName || "Upload photo (JPG/PNG, max 5MB)"}</span>
                    </label>
                  </div>

                  {/* Medical Report */}
                  <div>
                    <Label>Medical Reports (optional)</Label>
                    <input ref={reportRef} type="file" accept=".pdf,image/*" id="medicalReport" className="sr-only"
                      onChange={e => setReportName(e.target.files?.[0]?.name || "")} />
                    <label htmlFor="medicalReport" className="mt-1 flex items-center gap-2 border border-border rounded-md px-3 py-2.5 cursor-pointer hover:border-primary/60 transition-colors text-sm text-muted-foreground">
                      <Upload className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{reportName || "Upload PDF or image"}</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" className="gap-1" onClick={() => setStep(1)}><ArrowLeft className="w-4 h-4" /> Previous</Button>
                <Button className="flex-1 gap-1" onClick={() => { if(validateStep2()) setStep(3) }}>Next Step <ArrowRight className="w-4 h-4" /></Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card className="border-border mb-4">
                <CardHeader><CardTitle className={`${bebasNeue.className} text-2xl tracking-wide`}>Confirm Details</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    {[
                      ["Name", `${form.firstName} ${form.lastName}`], ["Age", form.age],
                      ["Gender", form.gender], ["Phone", form.phone],
                      ["Email", form.email], ["City", form.city],
                      ["Height", form.height ? form.height + " cm" : ""], ["Weight", form.weight ? form.weight + " kg" : ""],
                      ["Fitness Level", form.fitnessLevel], ["Sleep", form.sleepHours ? form.sleepHours + " hrs" : ""],
                    ].map(([k, v]) => v ? (
                      <div key={k} className="flex justify-between border-b border-border pb-2">
                        <span className={`${lora.className} text-muted-foreground`}>{k}</span>
                        <span className={`${lora.className} font-medium text-foreground`}>{v}</span>
                      </div>
                    ) : null)}
                  </div>

                  {photoName && <p className={`${lora.className} text-xs text-muted-foreground mt-3`}>📷 Photo: {photoName}</p>}
                  {reportName && <p className={`${lora.className} text-xs text-muted-foreground mt-1`}>📄 Report: {reportName}</p>}

                  <div className="mt-5 space-y-3">
                    {[
                      { key: "confirmed" as const, label: "I confirm the above information is accurate" },
                      { key: "agreed" as const, label: "I agree to the Run4Health community guidelines" },
                    ].map(c => (
                      <div key={c.key} className="flex items-start gap-2">
                        <input type="checkbox" id={c.key} checked={form[c.key] as boolean} onChange={e => setForm(p => ({...p,[c.key]:e.target.checked}))} className="mt-0.5 accent-primary" />
                        <label htmlFor={c.key} className={`${lora.className} text-sm text-muted-foreground cursor-pointer`}>{c.label}</label>
                      </div>
                    ))}
                  </div>

                  <p className={`${lora.className} text-xs text-muted-foreground mt-4 bg-muted/50 rounded-md p-3`}>
                    📧 After submission, your application will be reviewed. If approved, you'll get an email with a secure link to set your password and join the community!
                  </p>
                </CardContent>
              </Card>

              {submitError && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{submitError}</div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="gap-1" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4" /> Previous</Button>
                <Button
                  className="flex-1 gap-1"
                  disabled={!form.confirmed || !form.agreed || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? "Submitting…" : <><CheckCircle className="w-4 h-4" /> Submit Registration</>}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

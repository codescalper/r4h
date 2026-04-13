"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Bebas_Neue, Lora } from "next/font/google"
import { CheckCircle, ArrowRight, ArrowLeft, Camera, Upload } from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type PageKey = "home" | "about" | "programs" | "news" | "register" | "dashboard" | "donate" | "gallery" | "contact" | "admin"

interface RegFormData {
  name: string; age: string; gender: string; phone: string; email: string;
  city: string; emergencyName: string; emergencyPhone: string;
  height: string; weight: string; thigh: string; waist: string;
  sleep: string; conditions: string; fitnessLevel: string;
  confirmed: boolean; agreed: boolean;
}

// ─── PAGE 5: Register ─────────────────────────────────────────────────────────
function RegisterPage({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Partial<RegFormData>>({})
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<RegFormData>({
    name:"", age:"", gender:"", phone:"", email:"", city:"Thane",
    emergencyName:"", emergencyPhone:"", height:"", weight:"",
    thigh:"", waist:"", sleep:"", conditions:"", fitnessLevel:"",
    confirmed: false, agreed: false,
  })

  const set = (k: keyof RegFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const validateStep1 = () => {
    const e: Partial<RegFormData> = {}
    if (!form.name) e.name = "Required"
    if (!form.age) e.age = "Required"
    if (!form.phone) e.phone = "Required"
    if (!form.email) e.email = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Partial<RegFormData> = {}
    if (!form.height) e.height = "Required"
    if (!form.weight) e.weight = "Required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h2 className={`${bebasNeue.className} text-5xl tracking-wider text-foreground mb-3`}>YOU'RE IN!</h2>
        <p className={`${lora.className} text-muted-foreground mb-6`}>Your registration has been submitted. We'll send a confirmation to <strong>{form.email}</strong> within 48 hours.</p>
        <Button onClick={() => setCurrentPage("home")} className="gap-1">Back to Home <ArrowRight className="w-4 h-4" /></Button>
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
                  {[
                    { label: "Full Name", key: "name" as const, placeholder: "Rahul Sharma" },
                    { label: "Age", key: "age" as const, placeholder: "28", type: "number" },
                    { label: "Phone Number", key: "phone" as const, placeholder: "+91 98765 43210" },
                    { label: "Email", key: "email" as const, placeholder: "rahul@email.com" },
                    { label: "City", key: "city" as const, placeholder: "Thane" },
                    { label: "Emergency Contact Name", key: "emergencyName" as const, placeholder: "Sunita Sharma" },
                    { label: "Emergency Contact Phone", key: "emergencyPhone" as const, placeholder: "+91 98765 00000" },
                  ].map(f => (
                    <div key={f.key} className={f.key === "emergencyPhone" ? "sm:col-span-1" : ""}>
                      <Label>{f.label}</Label>
                      <Input className={`mt-1 ${errors[f.key] ? "border-destructive" : ""}`} type={f.type || "text"} placeholder={f.placeholder} value={form[f.key] as string} onChange={set(f.key)} />
                      {errors[f.key] && <p className="text-destructive text-xs mt-1">{errors[f.key]}</p>}
                    </div>
                  ))}
                  <div>
                    <Label>Gender</Label>
                    <Select onValueChange={v => setForm(p => ({...p,gender:v}))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        {["Male","Female","Other","Prefer not to say"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
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
                    { label: "Thigh size (cm)", key: "thigh" as const, placeholder: "52" },
                    { label: "Waist/Stomach (cm)", key: "waist" as const, placeholder: "82" },
                  ].map(f => (
                    <div key={f.key}>
                      <Label>{f.label}</Label>
                      <Input className={`mt-1 ${errors[f.key] ? "border-destructive" : ""}`} type="number" placeholder={f.placeholder} value={form[f.key] as string} onChange={set(f.key)} />
                      {errors[f.key] && <p className="text-destructive text-xs mt-1">{errors[f.key]}</p>}
                    </div>
                  ))}
                  <div>
                    <Label>Avg. Sleep (hrs/night)</Label>
                    <Select onValueChange={v => setForm(p => ({...p,sleep:v}))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["<5","5-6","6-7","7-8","8+"].map(s => <SelectItem key={s} value={s}>{s} hours</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Fitness Level</Label>
                    <Select onValueChange={v => setForm(p => ({...p,fitnessLevel:v}))}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {["Beginner","Intermediate","Advanced"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2"><Label>Medical Conditions (if any)</Label><Textarea className="mt-1" placeholder="e.g. Asthma, Diabetes..." value={form.conditions} onChange={set("conditions")} /></div>
                  <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 cursor-pointer hover:border-primary/40 transition-colors text-sm text-muted-foreground">
                    <Camera className="w-4 h-4 text-primary" /> Upload Profile Photo
                  </div>
                  <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 cursor-pointer hover:border-primary/40 transition-colors text-sm text-muted-foreground">
                    <Upload className="w-4 h-4 text-primary" /> Upload Medical Reports (PDF)
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
                      ["Name", form.name], ["Age", form.age], ["Gender", form.gender], ["Phone", form.phone],
                      ["Email", form.email], ["City", form.city], ["Height", form.height + " cm"], ["Weight", form.weight + " kg"],
                      ["Fitness Level", form.fitnessLevel], ["Avg Sleep", form.sleep],
                    ].map(([k, v]) => v ? (
                      <div key={k} className="flex justify-between border-b border-border pb-2">
                        <span className={`${lora.className} text-muted-foreground`}>{k}</span>
                        <span className={`${lora.className} font-medium text-foreground`}>{v}</span>
                      </div>
                    ) : null)}
                  </div>
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
                    Your application will be reviewed. You'll receive a confirmation email within 48 hours.
                  </p>
                </CardContent>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-1" onClick={() => setStep(2)}><ArrowLeft className="w-4 h-4" /> Previous</Button>
                <Button
                  className="flex-1 gap-1"
                  disabled={!form.confirmed || !form.agreed}
                  onClick={() => setSubmitted(true)}
                >
                  <CheckCircle className="w-4 h-4" /> Submit Registration
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RegisterPage
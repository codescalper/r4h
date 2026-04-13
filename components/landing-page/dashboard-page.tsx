"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bebas_Neue, Lora } from "next/font/google"
import { Users, Activity, BarChart3, Heart, TrendingUp, CheckCircle, X, LogIn, ImageIcon } from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

// ─── PAGE 6: Member Dashboard ─────────────────────────────────────────────────
function DashboardPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [editing, setEditing] = useState(false)
  const [healthOpen, setHealthOpen] = useState(false)
  const [donationAmount, setDonationAmount] = useState("")

  const healthHistory = [
    { date: "Jan 2025", weight: 74, thigh: 52, waist: 84 },
    { date: "Oct 2024", weight: 76, thigh: 53, waist: 85 },
    { date: "Jul 2024", weight: 78, thigh: 54, waist: 87 },
    { date: "Apr 2024", weight: 80, thigh: 55, waist: 89 },
  ]

  const maxWeight = Math.max(...healthHistory.map(h => h.weight))

  return (
    <div className="min-h-screen pt-16 flex bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col shrink-0 border-r border-border bg-card py-8 px-4">
        <div className="flex flex-col items-center gap-2 pb-6 border-b border-border">
          <Avatar className="w-16 h-16 border-2 border-primary/30">
            <AvatarFallback className="text-lg bg-primary/10 text-primary">RS</AvatarFallback>
          </Avatar>
          <p className={`${lora.className} font-semibold text-foreground`}>Rahul Sharma</p>
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">Member since 2023</Badge>
        </div>
        <nav className="mt-6 space-y-1">
          {[
            { id: "profile", label: "Profile", icon: <Users className="w-4 h-4" /> },
            { id: "health", label: "Health Data", icon: <Activity className="w-4 h-4" /> },
            { id: "reports", label: "Reports", icon: <BarChart3 className="w-4 h-4" /> },
            { id: "donations", label: "Donations", icon: <Heart className="w-4 h-4" /> },
          ].map(n => (
            <button key={n.id} onClick={() => setActiveTab(n.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${activeTab === n.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
            >
              {n.icon}<span className={lora.className}>{n.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-card/50">
          <p className={`${lora.className} text-sm text-muted-foreground`}>Dashboard <span className="text-primary">·</span> <span className="text-foreground capitalize">{activeTab}</span></p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1 text-xs"><LogIn className="w-3.5 h-3.5" /> Logout</Button>
          </div>
        </div>

        {/* Mobile tab select */}
        <div className="lg:hidden border-b border-border px-4 py-2 flex gap-2 overflow-x-auto">
          {["profile","health","reports","donations"].map(t => (
            <Button key={t} size="sm" variant={activeTab === t ? "default" : "ghost"} onClick={() => setActiveTab(t)} className="capitalize shrink-0 text-xs">{t}</Button>
          ))}
        </div>

        <div className="p-6 max-w-4xl">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-6`}>PROFILE</h2>
                <Card className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-14 h-14 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">RS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className={`${lora.className} font-semibold text-foreground`}>Rahul Sharma</p>
                          <p className={`${lora.className} text-sm text-muted-foreground`}>Member #1042 · Thane West</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setEditing(!editing)} className="gap-1">
                        {editing ? <><X className="w-3.5 h-3.5" /> Cancel</> : <><Activity className="w-3.5 h-3.5" /> Edit Profile</>}
                      </Button>
                    </div>
                    {editing ? (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[["Full Name","Rahul Sharma"],["Phone","+91 98765 43210"],["City","Thane West"],["Emergency Contact","Priya Sharma - +91 99999 11111"]].map(([l,v]) => (
                          <div key={l}><Label>{l}</Label><Input className="mt-1" defaultValue={v} /></div>
                        ))}
                        <Button className="sm:col-span-2 gap-1" onClick={() => setEditing(false)}><CheckCircle className="w-4 h-4" /> Save Changes</Button>
                      </div>
                    ) : (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[["Email","rahul.sharma@gmail.com"],["Phone","+91 98765 43210"],["City","Thane West"],["Age","28"],["Gender","Male"],["Emergency Contact","Priya Sharma - +91 99999 11111"]].map(([k,v]) => (
                          <div key={k} className="flex justify-between border-b border-border pb-2 text-sm">
                            <span className={`${lora.className} text-muted-foreground`}>{k}</span>
                            <span className={`${lora.className} font-medium text-foreground`}>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "health" && (
              <motion.div key="health" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground`}>HEALTH DATA</h2>
                  <Dialog open={healthOpen} onOpenChange={setHealthOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1"><TrendingUp className="w-3.5 h-3.5" /> Add Update</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle className={`${bebasNeue.className} tracking-wide`}>Add Health Update</DialogTitle></DialogHeader>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        {[["Height (cm)","170"],["Weight (kg)","74"],["Thigh (cm)","52"],["Waist (cm)","84"]].map(([l,p]) => (
                          <div key={l}><Label>{l}</Label><Input className="mt-1" type="number" placeholder={p} /></div>
                        ))}
                        <div className="col-span-2">
                          <Label>Avg Sleep</Label>
                          <Select>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              {["<5","5-6","6-7","7-8","8+"].map(s => <SelectItem key={s} value={s}>{s} hrs</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="col-span-2 gap-1" onClick={() => setHealthOpen(false)}><CheckCircle className="w-4 h-4" /> Save Update</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className={`${lora.className} text-xs text-muted-foreground bg-muted/50 rounded-md p-3 mb-5`}>Update your health data every 3 months for best results</p>

                {/* Weight chart */}
                <Card className="border-border mb-5">
                  <CardHeader><CardTitle className={`${lora.className} text-sm font-semibold`}>Weight Trend (kg)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-3 h-24">
                      {healthHistory.map((h, i) => (
                        <div key={h.date} className="flex flex-col items-center gap-1 flex-1">
                          <span className={`${lora.className} text-xs text-primary font-medium`}>{h.weight}</span>
                          <div className="w-full bg-primary/20 rounded-sm" style={{ height: `${(h.weight / maxWeight) * 80}px` }}>
                            <div className="w-full h-full bg-primary rounded-sm opacity-70" />
                          </div>
                          <span className={`${lora.className} text-xs text-muted-foreground`}>{h.date.split(" ")[0]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Table */}
                <Card className="border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50"><tr>
                        {["Date","Weight (kg)","Thigh (cm)","Waist (cm)"].map(h => <th key={h} className={`${lora.className} text-left text-xs text-muted-foreground px-4 py-2.5 font-medium`}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {healthHistory.map((h, i) => (
                          <tr key={h.date} className="border-t border-border">
                            <td className={`${lora.className} px-4 py-2.5 text-foreground`}>{h.date}</td>
                            <td className={`${lora.className} px-4 py-2.5 text-foreground`}>{h.weight}</td>
                            <td className={`${lora.className} px-4 py-2.5 text-foreground`}>{h.thigh}</td>
                            <td className={`${lora.className} px-4 py-2.5 text-foreground`}>{h.waist}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "reports" && (
              <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-6`}>REPORTS</h2>
                <Card className="border-dashed border-2 border-border mb-6 hover:border-primary/40 transition-colors cursor-pointer">
                  <CardContent className="p-8 flex flex-col items-center gap-3 text-center">
                    <ImageIcon className="w-8 h-8 text-primary/40" />
                    <p className={`${lora.className} text-sm font-medium text-foreground`}>Upload Medical Report</p>
                    <p className={`${lora.className} text-xs text-muted-foreground`}>PDF, JPG, or PNG — max 10MB</p>
                  </CardContent>
                </Card>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: "Blood_Test_Jan2025.pdf", date: "Jan 10, 2025", type: "Blood Report" },
                    { name: "ECG_Report_2024.pdf", date: "Sep 5, 2024", type: "Cardiac" },
                    { name: "BMI_Check_2024.jpg", date: "Jun 20, 2024", type: "General" },
                  ].map(r => (
                    <Card key={r.name} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="w-5 h-5 text-primary/40 shrink-0" />
                          <p className={`${lora.className} text-xs font-medium text-foreground truncate`}>{r.name}</p>
                        </div>
                        <Badge variant="outline" className="text-xs mb-2 border-primary/20 text-primary">{r.type}</Badge>
                        <p className={`${lora.className} text-xs text-muted-foreground mb-3`}>{r.date}</p>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 text-xs h-7">View</Button>
                          <Button size="sm" variant="ghost" className="text-destructive text-xs h-7 px-2"><X className="w-3.5 h-3.5" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "donations" && (
              <motion.div key="donations" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-6`}>DONATIONS</h2>
                <Card className="border-primary/20 bg-primary/5 mb-6">
                  <CardContent className="p-5">
                    <p className={`${lora.className} text-sm font-semibold text-foreground mb-3`}>Make a Donation</p>
                    <div className="flex gap-2 mb-3">
                      <Input placeholder="Enter amount (₹)" type="number" value={donationAmount} onChange={e => setDonationAmount(e.target.value)} className="max-w-xs" />
                      <Button className="gap-1"><Heart className="w-4 h-4" /> Donate</Button>
                    </div>
                    <p className={`${lora.className} text-xs text-muted-foreground`}>Powered by Razorpay · Tax exempt under 80G</p>
                  </CardContent>
                </Card>
                <Card className="border-border overflow-hidden">
                  <CardHeader><CardTitle className={`${lora.className} text-sm font-semibold`}>Donation History</CardTitle></CardHeader>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50"><tr>
                        {["Date","Amount","Status"].map(h => <th key={h} className={`${lora.className} text-left text-xs text-muted-foreground px-4 py-2.5 font-medium`}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {[["Jan 26, 2025","₹500","Successful"],["Oct 12, 2024","₹1000","Successful"],["Jul 4, 2024","₹200","Successful"]].map(([d,a,s]) => (
                          <tr key={d} className="border-t border-border">
                            <td className={`${lora.className} px-4 py-2.5`}>{d}</td>
                            <td className={`${lora.className} px-4 py-2.5 font-semibold text-primary`}>{a}</td>
                            <td className="px-4 py-2.5"><Badge variant="outline" className="text-xs border-primary/30 text-primary">{s}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
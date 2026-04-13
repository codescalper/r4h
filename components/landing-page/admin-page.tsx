"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bebas_Neue, Lora } from "next/font/google"
import { Users, Activity, BarChart3, Heart, Calendar, CheckCircle, LogIn, Newspaper, TrendingUp, X } from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

// ─── PAGE 10: Admin ───────────────────────────────────────────────────────────
function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [members, setMembers] = useState([
    { name: "Rahul Sharma", age: 28, city: "Thane", status: "Approved", joined: "Jan 2025" },
    { name: "Priya Kulkarni", age: 32, city: "Mulund", status: "Pending", joined: "Jan 2025" },
    { name: "Kiran Mehta", age: 24, city: "Navi Mumbai", status: "Pending", joined: "Feb 2025" },
    { name: "Sunita Desai", age: 45, city: "Thane West", status: "Approved", joined: "Dec 2024" },
    { name: "Vikram Patil", age: 30, city: "Dombivli", status: "Rejected", joined: "Nov 2024" },
  ])
  const [newsList, setNewsList] = useState([
    { title: "5K Run in Kopri Locality", by: "Suresh M.", date: "Feb 1, 2025", status: "Pending" },
    { title: "Yoga Therapy for Seniors", by: "Dr. Anjali Rao", date: "Jan 28, 2025", status: "Pending" },
    { title: "Marathon Tips for Beginners", by: "Rajan K.", date: "Jan 20, 2025", status: "Approved" },
    { title: "Community Health Drive", by: "Run4Health", date: "Jan 15, 2025", status: "Pending" },
  ])
  const [createEventOpen, setCreateEventOpen] = useState(false)

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      setLoggedIn(true); setLoginError("")
    } else {
      setLoginError("Invalid credentials. Try admin / admin123")
    }
  }

  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
        <Card className="border-border">
          <CardContent className="p-8 space-y-5">
            <div className="text-center">
              <Avatar className="w-16 h-16 mx-auto mb-4 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">A</AvatarFallback>
              </Avatar>
              <h1 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground`}>ADMIN LOGIN</h1>
            </div>
            <div><Label>Username</Label><Input className="mt-1" placeholder="admin" value={username} onChange={e => setUsername(e.target.value)} /></div>
            <div><Label>Password</Label><Input className="mt-1" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} /></div>
            {loginError && <p className="text-destructive text-xs">{loginError}</p>}
            <Button className="w-full gap-1" onClick={handleLogin}><LogIn className="w-4 h-4" /> Login</Button>
            <p className={`${lora.className} text-xs text-center text-muted-foreground`}>Session expires in 30 minutes</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )

  const updateMember = (index: number, status: string) => {
    setMembers(prev => prev.map((m, i) => i === index ? { ...m, status } : m))
  }

  const updateNews = (index: number, status: string) => {
    setNewsList(prev => prev.map((n, i) => i === index ? { ...n, status } : n))
  }

  const statusColor = (s: string) => s === "Approved" ? "bg-primary/10 text-primary border-primary/20" : s === "Rejected" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-muted text-muted-foreground"

  return (
    <div className="min-h-screen flex pt-16 bg-background">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-56 flex-col shrink-0 border-r border-border bg-card py-6 px-3">
        <p className={`${bebasNeue.className} tracking-wide text-base text-foreground px-2 mb-4`}>RUN4HEALTH<br /><span className="text-primary text-sm">ADMIN</span></p>
        {["dashboard","members","news","events","donations"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex items-center gap-2 px-2 py-2 rounded text-sm capitalize transition-colors ${activeTab === t ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
          >
            <span className={lora.className}>{t}</span>
          </button>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border px-6 py-3 flex items-center justify-between bg-card/50">
          <p className={`${lora.className} text-sm font-medium text-foreground`}>Run4Health Admin</p>
          <Button size="sm" variant="outline" onClick={() => setLoggedIn(false)} className="gap-1 text-xs"><LogIn className="w-3.5 h-3.5" /> Logout</Button>
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden border-b border-border px-3 py-2 flex gap-1 overflow-x-auto">
          {["dashboard","members","news","events","donations"].map(t => (
            <Button key={t} size="sm" variant={activeTab === t ? "default" : "ghost"} onClick={() => setActiveTab(t)} className="capitalize shrink-0 text-xs">{t}</Button>
          ))}
        </div>

        <div className="p-6 max-w-5xl">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-6`}>DASHBOARD</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: "Total Members", value: "50", icon: <Users className="w-5 h-5" /> },
                    { label: "Pending Approvals", value: "8", icon: <Activity className="w-5 h-5" /> },
                    { label: "News Submissions", value: "3", icon: <Newspaper className="w-5 h-5" /> },
                    { label: "Total Raised", value: "₹50k", icon: <TrendingUp className="w-5 h-5" /> },
                  ].map(s => (
                    <Card key={s.label} className="border-border">
                      <CardContent className="p-5 flex items-center gap-3">
                        <div className="text-primary">{s.icon}</div>
                        <div>
                          <p className={`${bebasNeue.className} text-2xl tracking-wide text-foreground`}>{s.value}</p>
                          <p className={`${lora.className} text-xs text-muted-foreground`}>{s.label}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="border-border">
                  <CardHeader><CardTitle className={`${lora.className} text-sm font-semibold`}>Recent Activity</CardTitle></CardHeader>
                  <div className="divide-y divide-border">
                    {[
                      "New member registered — Kiran Mehta from Navi Mumbai",
                      "News submitted — 'Yoga Therapy for Seniors' by Dr. Anjali Rao",
                      "Donation received — ₹5,000 from Anonymous",
                      "Event created — Thane Half Marathon 2025",
                      "Member approved — Rahul Sharma",
                    ].map((a, i) => (
                      <div key={i} className="px-5 py-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <p className={`${lora.className} text-sm text-muted-foreground`}>{a}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "members" && (
              <motion.div key="members" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-6`}>MEMBERS</h2>
                <Card className="border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50"><tr>
                        {["Name","Age","City","Status","Joined","Actions"].map(h => <th key={h} className={`${lora.className} text-left text-xs text-muted-foreground px-4 py-2.5 font-medium whitespace-nowrap`}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {members.map((m, i) => (
                          <tr key={m.name} className="border-t border-border">
                            <td className={`${lora.className} px-4 py-3 font-medium text-foreground`}>{m.name}</td>
                            <td className={`${lora.className} px-4 py-3 text-muted-foreground`}>{m.age}</td>
                            <td className={`${lora.className} px-4 py-3 text-muted-foreground`}>{m.city}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className={`text-xs border ${statusColor(m.status)}`}>{m.status}</Badge>
                            </td>
                            <td className={`${lora.className} px-4 py-3 text-muted-foreground`}>{m.joined}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1">
                                {m.status !== "Approved" && <Button size="sm" className="h-6 text-xs px-2" onClick={() => updateMember(i, "Approved")}>Approve</Button>}
                                {m.status !== "Rejected" && <Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={() => updateMember(i, "Rejected")}>Reject</Button>}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "news" && (
              <motion.div key="news" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-6`}>NEWS SUBMISSIONS</h2>
                <div className="space-y-3">
                  {newsList.map((n, i) => (
                    <Card key={n.title} className="border-border">
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className={`${lora.className} font-medium text-foreground text-sm truncate`}>{n.title}</p>
                          <p className={`${lora.className} text-xs text-muted-foreground`}>By {n.by} · {n.date}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className={`text-xs border ${statusColor(n.status)}`}>{n.status}</Badge>
                          {n.status === "Pending" && (
                            <>
                              <Button size="sm" className="h-6 text-xs px-2" onClick={() => updateNews(i, "Approved")}>Approve</Button>
                              <Button size="sm" variant="destructive" className="h-6 text-xs px-2" onClick={() => updateNews(i, "Rejected")}>Reject</Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "events" && (
              <motion.div key="events" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground`}>EVENTS</h2>
                  <Dialog open={createEventOpen} onOpenChange={setCreateEventOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1"><Calendar className="w-3.5 h-3.5" /> Create Event</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle className={`${bebasNeue.className} tracking-wide text-xl`}>Create New Event</DialogTitle></DialogHeader>
                      <div className="space-y-3 mt-2">
                        {[["Title","e.g. Thane Marathon 2025"],["Date",""],["Location","e.g. Upvan Lake"],["Max Participants","e.g. 1000"]].map(([l,p],j) => (
                          <div key={l}><Label>{l}</Label><Input className="mt-1" type={l === "Date" ? "date" : "text"} placeholder={p} /></div>
                        ))}
                        <div>
                          <Label>Category</Label>
                          <Select>
                            <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              {["Marathon","Yoga","Camp","Fun Run"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div><Label>Description</Label><Textarea className="mt-1 h-20" /></div>
                        <Button className="w-full gap-1" onClick={() => setCreateEventOpen(false)}><CheckCircle className="w-4 h-4" /> Create Event</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <Card className="border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50"><tr>
                        {["Title","Date","Location","Participants","Status","Actions"].map(h => <th key={h} className={`${lora.className} text-left text-xs text-muted-foreground px-4 py-2.5 font-medium whitespace-nowrap`}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {[
                          { title: "Thane Half Marathon 2025", date: "Jan 26, 2025", loc: "Upvan Lake", part: 1200, status: "Active" },
                          { title: "Morning Yoga Camp", date: "Every Sunday", loc: "Yeoor Hills", part: 80, status: "Active" },
                          { title: "Monsoon Marathon 2024", date: "Jul 2024", loc: "Upvan Lake", part: 900, status: "Completed" },
                        ].map(e => (
                          <tr key={e.title} className="border-t border-border">
                            <td className={`${lora.className} px-4 py-3 font-medium text-foreground`}>{e.title}</td>
                            <td className={`${lora.className} px-4 py-3 text-muted-foreground`}>{e.date}</td>
                            <td className={`${lora.className} px-4 py-3 text-muted-foreground`}>{e.loc}</td>
                            <td className={`${lora.className} px-4 py-3 text-muted-foreground`}>{e.part}</td>
                            <td className="px-4 py-3"><Badge variant="outline" className={`text-xs border ${statusColor(e.status === "Active" ? "Approved" : "Rejected")}`}>{e.status}</Badge></td>
                            <td className="px-4 py-3 flex gap-1">
                              <Button size="sm" variant="outline" className="h-6 text-xs px-2">Edit</Button>
                              <Button size="sm" variant="destructive" className="h-6 text-xs px-2">Delete</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "donations" && (
              <motion.div key="donations-admin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground`}>DONATIONS</h2>
                  <Button size="sm" variant="outline" className="gap-1" onClick={() => alert("Export started")}><TrendingUp className="w-3.5 h-3.5" /> Export CSV</Button>
                </div>
                <Card className="border-border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50"><tr>
                        {["Donor","Amount","Date","Status","Method"].map(h => <th key={h} className={`${lora.className} text-left text-xs text-muted-foreground px-4 py-2.5 font-medium`}>{h}</th>)}
                      </tr></thead>
                      <tbody>
                        {[
                          { donor: "Anonymous", amount: "₹5,000", date: "Jan 28, 2025", status: "Success", method: "UPI" },
                          { donor: "Rahul Sharma", amount: "₹1,000", date: "Jan 26, 2025", status: "Success", method: "Card" },
                          { donor: "Sunita Desai", amount: "₹500", date: "Jan 20, 2025", status: "Success", method: "NetBanking" },
                          { donor: "Anonymous", amount: "₹2,000", date: "Jan 15, 2025", status: "Pending", method: "UPI" },
                          { donor: "Kiran Mehta", amount: "₹200", date: "Jan 10, 2025", status: "Success", method: "UPI" },
                        ].map((d, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className={`${lora.className} px-4 py-3 text-foreground`}>{d.donor}</td>
                            <td className={`${lora.className} px-4 py-3 font-semibold text-primary`}>{d.amount}</td>
                            <td className={`${lora.className} px-4 py-3 text-muted-foreground`}>{d.date}</td>
                            <td className="px-4 py-3"><Badge variant="outline" className={`text-xs border ${statusColor(d.status === "Success" ? "Approved" : "Pending")}`}>{d.status}</Badge></td>
                            <td className={`${lora.className} px-4 py-3 text-muted-foreground`}>{d.method}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/30">
                        <tr>
                          <td colSpan={5} className={`${lora.className} px-4 py-3 text-right font-semibold text-foreground`}>Total: <span className="text-primary text-lg">₹12,00,000</span></td>
                        </tr>
                      </tfoot>
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

export default AdminPage
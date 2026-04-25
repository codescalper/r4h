"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Bebas_Neue, Lora } from "next/font/google"
import { Dumbbell, Calendar, MapPin, CheckCircle, ArrowRight } from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type PageKey = "home" | "about" | "programs" | "news" | "register" | "donate" | "gallery" | "contact"

// ─── PAGE 3: Programs ─────────────────────────────────────────────────────────
function ProgramsPage({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  const [registerOpen, setRegisterOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "" })

  const events = [
    { title: "Thane Half Marathon 2025", date: "Jan 26, 2025", loc: "Upvan Lake, Thane", desc: "Run 21.1km through the heart of Thane with 1000+ participants. Timing chip included.", status: "upcoming", cat: "Marathon" },
    { title: "Morning Yoga Camp", date: "Every Sunday, 6 AM", loc: "Yeoor Hills, Thane", desc: "Rejuvenating outdoor yoga sessions suitable for all ages and fitness levels.", status: "upcoming", cat: "Yoga" },
    { title: "Corporate Wellness Day 2025", date: "Mar 15, 2025", loc: "Thane IT Park", desc: "Full-day wellness program for corporate teams — running, yoga, and nutrition talks.", status: "upcoming", cat: "Camp" },
    { title: "Health Awareness Run", date: "Dec 2024", loc: "Thane Muncipal Ground", desc: "A 5K awareness run for heart health with free medical check-ups.", status: "past", cat: "Marathon" },
    { title: "Diwali Fun Run 2024", date: "Oct 2024", loc: "Kopri Ground, Thane", desc: "Festive 3K fun run with prizes, food stalls, and community celebrations.", status: "past", cat: "Marathon" },
    { title: "Monsoon Marathon 2024", date: "Jul 2024", loc: "Upvan Lake, Thane", desc: "A special monsoon edition 10K marathon — embracing the rains!", status: "past", cat: "Marathon" },
  ]

  return (
    <div className="min-h-screen pt-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`${bebasNeue.className} text-7xl sm:text-8xl tracking-wider text-foreground mb-10`}>
          OUR PROGRAMS<br /><span className="text-primary">& EVENTS</span>
        </motion.h1>

        <Tabs defaultValue="all">
          <TabsList className="mb-8 flex-wrap h-auto gap-1">
            {["All","Upcoming","Past","Marathons","Yoga","Camps"].map(t => (
              <TabsTrigger key={t} value={t.toLowerCase()}>{t}</TabsTrigger>
            ))}
          </TabsList>

          {["all","upcoming","past","marathons","yoga","camps"].map(tab => (
            <TabsContent key={tab} value={tab}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events
                  .filter(e => tab === "all" || e.status === tab || e.cat.toLowerCase() === tab || (tab === "camps" && e.cat === "Camp"))
                  .map((e, i) => (
                  <motion.div key={e.title} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
                    <Card className="h-full overflow-hidden border-border hover:border-primary/30 transition-all">
                      <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                        <Dumbbell className="w-8 h-8 text-primary/30" />
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={e.status === "upcoming" ? "default" : "secondary"} className="text-xs">
                            {e.status === "upcoming" ? "Upcoming" : "Completed"}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-primary/20 text-primary">{e.cat}</Badge>
                        </div>
                        <h3 className={`${lora.className} font-semibold text-foreground mb-2`}>{e.title}</h3>
                        <div className={`${lora.className} text-xs text-muted-foreground space-y-1 mb-3`}>
                          <div className="flex gap-1 items-center"><Calendar className="w-3.5 h-3.5 text-primary" />{e.date}</div>
                          <div className="flex gap-1 items-center"><MapPin className="w-3.5 h-3.5 text-primary" />{e.loc}</div>
                        </div>
                        <p className={`${lora.className} text-xs text-muted-foreground leading-relaxed mb-4`}>{e.desc}</p>
                        {e.status === "upcoming" ? (
                          <Dialog open={registerOpen && selectedEvent === e.title} onOpenChange={(open) => { setRegisterOpen(open); if(open) setSelectedEvent(e.title) }}>
                            <DialogTrigger asChild>
                              <Button size="sm" className="gap-1" onClick={() => setSelectedEvent(e.title)}>Register Now <ArrowRight className="w-3.5 h-3.5" /></Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle className={`${bebasNeue.className} text-2xl tracking-wide`}>Register: {e.title}</DialogTitle></DialogHeader>
                              <div className="space-y-4 mt-2">
                                <p className={`${lora.className} text-sm text-muted-foreground`}>{e.date} · {e.loc}</p>
                                <div className="space-y-3">
                                  <div><Label>Full Name</Label><Input className="mt-1" placeholder="Rahul Sharma" value={regForm.name} onChange={v => setRegForm(p => ({...p, name: v.target.value}))} /></div>
                                  <div><Label>Email</Label><Input className="mt-1" placeholder="rahul@email.com" value={regForm.email} onChange={v => setRegForm(p => ({...p, email: v.target.value}))} /></div>
                                  <div><Label>Phone</Label><Input className="mt-1" placeholder="+91 98765 43210" value={regForm.phone} onChange={v => setRegForm(p => ({...p, phone: v.target.value}))} /></div>
                                </div>
                                <Button className="w-full gap-1" onClick={() => setRegisterOpen(false)}><CheckCircle className="w-4 h-4" /> Confirm Registration</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          <Button size="sm" variant="outline" className="gap-1 border-border">View Recap <ArrowRight className="w-3.5 h-3.5" /></Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  )
}

export default ProgramsPage
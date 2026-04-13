"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bebas_Neue, Lora } from "next/font/google"
import { CheckCircle, Upload, Newspaper, ChevronRight } from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

// ─── PAGE 4: News ─────────────────────────────────────────────────────────────
function NewsPage() {
  const [submitForm, setSubmitForm] = useState({ title: "", content: "", category: "", submitted: false })

  const articles = [
    { title: "Thane Half Marathon Sets New Participation Record", cat: "Event Recap", author: "Run4Health Team", date: "Jan 26, 2025", excerpt: "Over 1,200 runners completed the Thane Half Marathon 2025, breaking last year's record by 35%." },
    { title: "5 Morning Stretches Every Runner Should Know", cat: "Health Tips", author: "Coach Shashi", date: "Jan 15, 2025", excerpt: "Start your morning right with these essential stretches that prepare your body for a great run." },
    { title: "How Running Changed Priya's Life", cat: "Community Story", author: "Priya Kulkarni", date: "Jan 8, 2025", excerpt: "From diabetic to half-marathoner — Priya shares her incredible 18-month transformation story." },
    { title: "New Yoga Batch Starting January 2025", cat: "Announcement", author: "Run4Health Team", date: "Dec 28, 2024", excerpt: "We are thrilled to announce a new batch of Sunday yoga sessions starting from January 5th, 2025." },
    { title: "Corporate Health Drive at TechMahindra Thane", cat: "Event Recap", author: "Run4Health Team", date: "Dec 15, 2024", excerpt: "Over 300 employees participated in our corporate wellness day — a huge success!" },
    { title: "Monsoon Running Safety Tips", cat: "Health Tips", author: "Coach Shashi", date: "Jul 2024", excerpt: "Running in the rains is magical — but here's how to stay safe on wet roads and slippery paths." },
  ]

  const catColors: Record<string, string> = {
    "Event Recap": "bg-primary/10 text-primary border-primary/20",
    "Health Tips": "bg-accent/10 text-accent-foreground border-accent/20",
    "Community Story": "bg-secondary text-secondary-foreground",
    "Announcement": "bg-muted text-muted-foreground",
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`${bebasNeue.className} text-7xl sm:text-8xl tracking-wider text-foreground mb-10`}>
          NEWS &<br /><span className="text-primary">UPDATES</span>
        </motion.h1>

        {/* Submit News */}
        <Card className="mb-12 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className={`${bebasNeue.className} tracking-wide text-2xl`}>Submit a Story</CardTitle>
            <CardDescription className={lora.className}>Share your Run4Health experience — approved stories get published here</CardDescription>
          </CardHeader>
          <CardContent>
            {submitForm.submitted ? (
              <div className="flex items-center gap-3 py-4">
                <CheckCircle className="w-6 h-6 text-primary" />
                <p className={`${lora.className} text-primary font-medium`}>Submitted for review! We'll get back to you within 48 hours.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Title</Label><Input className="mt-1" placeholder="Your story title" value={submitForm.title} onChange={e => setSubmitForm(p => ({...p,title:e.target.value}))} /></div>
                <div>
                  <Label>Category</Label>
                  <Select onValueChange={v => setSubmitForm(p => ({...p,category:v}))}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {["Event Recap","Health Tips","Community Story","Announcement"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-2"><Label>Content</Label><Textarea className="mt-1 h-24" placeholder="Tell your story..." value={submitForm.content} onChange={e => setSubmitForm(p => ({...p,content:e.target.value}))} /></div>
                <div className="sm:col-span-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 border border-border rounded-md px-3 py-2 cursor-pointer hover:border-primary/40 transition-colors text-sm text-muted-foreground">
                    <Upload className="w-4 h-4 text-primary" /> Upload Image
                  </div>
                  <Badge variant="outline" className="text-xs border-primary/20 text-muted-foreground">Reviewed before publishing</Badge>
                </div>
                <Button className="sm:col-span-2 gap-1" onClick={() => setSubmitForm(p => ({...p, submitted: true}))}>
                  <CheckCircle className="w-4 h-4" /> Submit for Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Articles */}
        <Tabs defaultValue="all">
          <TabsList className="mb-8">
            {["All","Event Recap","Health Tips","Community Story","Announcement"].map(t => (
              <TabsTrigger key={t} value={t.toLowerCase().replace(/ /g,"-")} className="text-xs sm:text-sm">{t}</TabsTrigger>
            ))}
          </TabsList>
          {["all","event-recap","health-tips","community-story","announcement"].map(tab => (
            <TabsContent key={tab} value={tab}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.filter(a => tab === "all" || a.cat.toLowerCase().replace(/ /g,"-") === tab).map((a, i) => (
                  <motion.div key={a.title} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
                    <Card className="h-full overflow-hidden border-border hover:border-primary/30 transition-all">
                      <div className="h-36 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                        <Newspaper className="w-8 h-8 text-primary/30" />
                      </div>
                      <CardContent className="p-5">
                        <Badge variant="outline" className={`mb-2 text-xs border ${catColors[a.cat] || ""}`}>{a.cat}</Badge>
                        <h3 className={`${lora.className} font-semibold text-foreground text-sm leading-snug mb-2`}>{a.title}</h3>
                        <p className={`${lora.className} text-xs text-muted-foreground leading-relaxed mb-3`}>{a.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <p className={`${lora.className} text-xs text-muted-foreground`}>{a.author} · {a.date}</p>
                          <Button size="sm" variant="ghost" className="pl-0 text-primary text-xs gap-1 pr-0">Read <ChevronRight className="w-3 h-3" /></Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

export default NewsPage
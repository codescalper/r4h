// Run4Health — Complete Frontend UI — app/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { Bebas_Neue, Lora } from "next/font/google"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Heart, Trophy, Users, Calendar, MapPin, Mail, Phone,
  ChevronRight, ArrowRight, ArrowLeft, Star, Zap, Shield,
  Camera, Upload, Moon, Sun, Menu, X, Dumbbell, Activity,
  TrendingUp, DollarSign, CheckCircle, Play, Newspaper,
  LogIn, UserPlus, BarChart3, Image as ImageIcon,
} from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type PageKey = "home" | "about" | "programs" | "news" | "register" | "dashboard" | "donate" | "gallery" | "contact" | "admin"

// ─── Theme Toggle ────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </Button>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ currentPage, setCurrentPage }: { currentPage: PageKey; setCurrentPage: (p: PageKey) => void }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links: { label: string; page: PageKey }[] = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Programs", page: "programs" },
    { label: "News", page: "news" },
    { label: "Gallery", page: "gallery" },
    { label: "Contact", page: "contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button onClick={() => setCurrentPage("home")} className="flex items-center gap-2">
          <Image src="/logo.png" alt="Run4Health" width={140} height={40} className="object-contain" />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <button
              key={l.page}
              onClick={() => setCurrentPage(l.page)}
              className={`${lora.className} text-sm font-medium transition-colors hover:text-primary ${
                currentPage === l.page ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </button>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          <Button size="sm" onClick={() => setCurrentPage("register")} className="gap-1">
            <UserPlus className="w-3.5 h-3.5" /> Join Now
          </Button>
          <Button size="sm" variant="outline" onClick={() => setCurrentPage("donate")} className="gap-1 border-primary text-primary hover:bg-primary/10">
            <Heart className="w-3.5 h-3.5" /> Donate
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 mt-8">
                {links.map((l) => (
                  <button
                    key={l.page}
                    onClick={() => setCurrentPage(l.page)}
                    className={`${lora.className} text-base font-medium text-left py-1 border-b border-border/40 transition-colors hover:text-primary`}
                  >
                    {l.label}
                  </button>
                ))}
                <Button onClick={() => setCurrentPage("register")} className="mt-2 gap-1">
                  <UserPlus className="w-4 h-4" /> Join Now
                </Button>
                <Button variant="outline" onClick={() => setCurrentPage("donate")} className="gap-1">
                  <Heart className="w-4 h-4" /> Donate
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  return (
    <footer className="bg-card border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Image src="/logo.png" alt="Run4Health" width={130} height={38} className="object-contain mb-3" />
          <p className={`${lora.className} text-sm text-muted-foreground leading-relaxed`}>Fitness First — Building healthier communities across Thane & Mumbai, one stride at a time.</p>
        </div>
        <div>
          <p className={`${bebasNeue.className} tracking-wider text-base text-foreground mb-3`}>Quick Links</p>
          {(["home","about","programs","news","gallery","contact"] as PageKey[]).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)} className={`${lora.className} block text-sm text-muted-foreground hover:text-primary capitalize py-0.5`}>{p}</button>
          ))}
        </div>
        <div>
          <p className={`${bebasNeue.className} tracking-wider text-base text-foreground mb-3`}>Programs</p>
          {["Marathon Training","Yoga Sessions","Health Awareness Camps","Corporate Wellness","Fun Runs"].map(p => (
            <p key={p} className={`${lora.className} text-sm text-muted-foreground py-0.5`}>{p}</p>
          ))}
        </div>
        <div>
          <p className={`${bebasNeue.className} tracking-wider text-base text-foreground mb-3`}>Contact</p>
          <div className={`${lora.className} text-sm text-muted-foreground space-y-2`}>
            <div className="flex gap-2 items-start"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" /><span>Run4Health Community Center, Thane West, Maharashtra — 400601</span></div>
            <div className="flex gap-2 items-center"><Phone className="w-4 h-4 shrink-0 text-primary" /><span>+91 98765 43210</span></div>
            <div className="flex gap-2 items-center"><Mail className="w-4 h-4 shrink-0 text-primary" /><span>run4health2026@gmail.com</span></div>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center">
        <p className={`${lora.className} text-xs text-muted-foreground`}>
          Made with ❤️ for community health · <button onClick={() => setCurrentPage("admin")} className="hover:text-primary underline underline-offset-2">Admin</button>
        </p>
      </div>
    </footer>
  )
}

// ─── Count-up hook ────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const step = target / (duration / 16)
        let cur = 0
        const timer = setInterval(() => {
          cur += step
          if (cur >= target) { setCount(target); clearInterval(timer) }
          else setCount(Math.floor(cur))
        }, 16)
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])
  return { count, ref }
}

// ─── PAGE 1: Home ─────────────────────────────────────────────────────────────
function HomePage({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  const stats = [
    { label: "Members", value: 50, suffix: "+" },
    { label: "Events", value: 150, suffix: "+" },
    { label: "₹ Raised (L)", value: 12, suffix: "L+" },
    { label: "Years Active", value: 8, suffix: "" },
  ]

  const programs = [
    { title: "Marathon Training", icon: <Dumbbell className="w-6 h-6" />, desc: "Structured 16-week programs from 5K to full marathon. Coached sessions every weekend at Upvan Lake.", color: "from-primary/30 to-primary/10" },
    { title: "Yoga Sessions", icon: <Activity className="w-6 h-6" />, desc: "Sunday morning yoga in open air parks. Suitable for all ages and fitness levels.", color: "from-accent/30 to-accent/10" },
    { title: "Health Awareness Camps", icon: <Heart className="w-6 h-6" />, desc: "Free health check-ups, BMI screenings, and nutrition workshops across Thane.", color: "from-primary/20 to-accent/20" },
  ]

  const testimonials = [
    { name: "Priya Kulkarni", loc: "Thane West", quote: "Run4Health changed my life. I went from couch potato to half-marathon finisher in just 6 months!", stars: 5 },
    { name: "Rajan Mehta", loc: "Navi Mumbai", quote: "Coach Shashi's guidance is unparalleled. The community here is incredibly supportive.", stars: 5 },
    { name: "Sunita Desai", loc: "Mulund", quote: "The yoga sessions have helped my chronic back pain more than any medicine. Truly transformative.", stars: 5 },
  ]

  const news = [
    { title: "Thane Half Marathon Sets New Participation Record", cat: "Event Recap", date: "Jan 26, 2025" },
    { title: "5 Morning Stretches Every Runner Should Know", cat: "Health Tips", date: "Jan 15, 2025" },
    { title: "How Running Changed Priya's Life", cat: "Community Story", date: "Jan 8, 2025" },
  ]

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
        {/* Left gradient bg */}
        <div className="absolute inset-0 z-0">
          <div className="absolute left-0 top-0 w-1/2 h-full bg-liner-to-br from-primary/20 via-primary/5 to-transparent" />
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-accent/10 to-transparent" />
          {/* diagonal divider */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(120deg, var(--primary) 0%, transparent 55%)", opacity: 0.06 }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-12 items-center pt-24 pb-16">
          {/* Left: Text */}
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Badge variant="outline" className="mb-4 border-primary/50 text-primary font-medium px-3 py-1">
                <Zap className="w-3 h-3 mr-1" /> Thane&apos;s #1 Fitness Community
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className={`${bebasNeue.className} text-7xl sm:text-8xl lg:text-9xl leading-none tracking-wider text-foreground`}
            >
              RUN FOR<br />
              <span className="text-primary">HEALTH</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className={`${lora.className} text-lg text-muted-foreground mt-5 max-w-md leading-relaxed`}
            >
              A community movement transforming lives through fitness, one stride at a time.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <Button size="lg" onClick={() => setCurrentPage("register")} className="gap-2 text-base px-6">
                Join Now <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setCurrentPage("donate")} className="gap-2 text-base px-6 border-primary text-primary hover:bg-primary/10">
                <Heart className="w-4 h-4" /> Donate Now
              </Button>
            </motion.div>

            {/* Floating stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-3 mt-8"
            >
              {["50+ Members","150+ Events","₹50k+ Raised"].map((s) => (
                <span key={s} className={`${lora.className} text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1.5 font-medium`}>
                  {s}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Logo display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:flex flex-col items-center justify-center"
          >
            <div className="relative flex items-center justify-center">
              {/* Glow ring */}
              <div className="absolute w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute w-64 h-64 rounded-full border border-primary/20" />
              <div className="absolute w-80 h-80 rounded-full border border-primary/10" />
              <div className="relative z-10 bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-10 shadow-2xl">
                <Image src="/logo.png" alt="Run4Health" width={280} height={80} className="object-contain" />
                <p className={`${bebasNeue.className} text-2xl tracking-widest text-center text-primary mt-4`}>FITNESS FIRST</p>
                <Separator className="my-4" />
                <div className="flex justify-around">
                  {[{icon:<Dumbbell className="w-5 h-5 text-primary"/>,l:"Train"},{icon:<Heart className="w-5 h-5 text-primary"/>,l:"Care"},{icon:<Users className="w-5 h-5 text-primary"/>,l:"Connect"}].map(({icon,l})=>(
                    <div key={l} className="flex flex-col items-center gap-1">
                      {icon}
                      <span className={`${lora.className} text-xs text-muted-foreground`}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <ChevronRight className="w-6 h-6 rotate-90" />
        </motion.div>
      </section>

      {/* ── About Preview ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} viewport={{ once: true }}>
            <Card className="border-primary/20 bg-primary/5 h-full">
              <CardContent className="p-8">
                <Badge className="mb-4 bg-primary/20 text-primary border-0">Our Mission</Badge>
                <blockquote className={`${bebasNeue.className} text-3xl sm:text-4xl tracking-wide text-foreground leading-tight`}>
                  "Empowering communities through movement, health education, and collective action."
                </blockquote>
                <Separator className="my-6" />
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-primary/30">
                    <AvatarImage src="/coach.png" />
                    <AvatarFallback>SN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className={`${bebasNeue.className} tracking-wide text-lg text-foreground`}>Coach Shashi Nair</p>
                    <p className={`${lora.className} text-sm text-muted-foreground`}>Founder & Head Coach</p>
                  </div>
                </div>
                <Button variant="ghost" className="mt-4 gap-1 text-primary pl-0" onClick={() => setCurrentPage("about")}>
                  Read Our Story <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Members", value: "50+", icon: <Users className="w-5 h-5" /> },
              { label: "Training Sessions conducted", value: "150+", icon: <Calendar className="w-5 h-5" /> },
              { label: "Funds Raised", value: "₹50k+", icon: <DollarSign className="w-5 h-5" /> },
              { label: "Years Active", value: "8 Yrs", icon: <Trophy className="w-5 h-5" /> },
            ].map((s, i) => (
              <motion.div key={s.label} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <Card className="border-border hover:border-primary/40 transition-colors">
                  <CardContent className="p-5 flex flex-col gap-2">
                    <div className="text-primary">{s.icon}</div>
                    <p className={`${bebasNeue.className} text-3xl tracking-wider text-foreground`}>{s.value}</p>
                    <p className={`${lora.className} text-sm text-muted-foreground`}>{s.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs ── */}
      <section className="py-20 bg-muted/30" style={{ clipPath: "polygon(0 3%, 100% 0, 100% 97%, 0 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} className="mb-10">
            <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>What we offer</p>
            <h2 className={`${bebasNeue.className} text-5xl sm:text-6xl tracking-wider text-foreground`}>WHAT WE DO</h2>
          </motion.div>
          <div className="flex gap-5 overflow-x-auto snap-x pb-4">
            {programs.map((p, i) => (
              <motion.div key={p.title} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }} whileHover={{ y: -4 }} className="snap-start shrink-0 w-72 sm:w-80">
                <Card className="h-full border-border hover:border-primary/40 transition-all duration-200 overflow-hidden">
                  <div className={`h-28 bg-liner-to-br ${p.color} flex items-center justify-center`}>
                    <div className="text-primary opacity-60">{p.icon}</div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className={`${bebasNeue.className} text-2xl tracking-wide text-foreground mb-2`}>{p.title}</h3>
                    <p className={`${lora.className} text-sm text-muted-foreground leading-relaxed mb-4`}>{p.desc}</p>
                    <Button size="sm" variant="outline" onClick={() => setCurrentPage("programs")} className="gap-1 border-primary/30 text-primary">
                      Learn More <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="bg-primary py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-primary-foreground text-center">
          {stats.map((s) => {
            const { count, ref } = useCountUp(s.value)
            return (
              <div key={s.label} ref={ref}>
                <p className={`${bebasNeue.className} text-5xl tracking-wider`}>{count}{s.suffix}</p>
                <p className={`${lora.className} text-sm opacity-80 mt-1`}>{s.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} className="mb-10">
          <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>Community voices</p>
          <h2 className={`${bebasNeue.className} text-5xl sm:text-6xl tracking-wider text-foreground`}>VOICES FROM OUR COMMUNITY</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
              <Card className="h-full border-border hover:border-primary/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.stars }).map((_, j) => <Star key={j} className="w-4 h-4 fill-primary text-primary" />)}
                  </div>
                  <p className={`${lora.className} text-sm text-muted-foreground leading-relaxed mb-4 italic`}>"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 border border-primary/20">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">{t.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={`${lora.className} text-sm font-semibold text-foreground`}>{t.name}</p>
                      <p className={`${lora.className} text-xs text-muted-foreground`}>{t.loc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Latest News ── */}
      <section className="bg-muted/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
            <div>
              <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>Stay informed</p>
              <h2 className={`${bebasNeue.className} text-5xl sm:text-6xl tracking-wider text-foreground`}>LATEST NEWS</h2>
            </div>
            <Button variant="outline" onClick={() => setCurrentPage("news")} className="gap-1 hidden sm:flex border-primary/30 text-primary">View All <ArrowRight className="w-4 h-4" /></Button>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n, i) => (
              <motion.div key={n.title} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
                <Card className="h-full overflow-hidden border-border hover:border-primary/30 transition-all">
                  <div className="h-36 bg-liner-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                    <Newspaper className="w-8 h-8 text-primary/40" />
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-2 text-xs">{n.cat}</Badge>
                    <h3 className={`${lora.className} font-semibold text-foreground text-sm leading-snug mb-2`}>{n.title}</h3>
                    <p className={`${lora.className} text-xs text-muted-foreground mb-3`}>{n.date}</p>
                    <Button size="sm" variant="ghost" className="pl-0 text-primary text-xs gap-1" onClick={() => setCurrentPage("news")}>
                      Read More <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="flex sm:hidden mt-6 justify-center">
            <Button variant="outline" onClick={() => setCurrentPage("news")} className="gap-1 border-primary/30 text-primary">View All News <ArrowRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </section>

      {/* ── Gallery Preview ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} className="flex items-end justify-between mb-10">
          <div>
            <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>Our memories</p>
            <h2 className={`${bebasNeue.className} text-5xl sm:text-6xl tracking-wider text-foreground`}>GALLERY</h2>
          </div>
          <Button variant="outline" onClick={() => setCurrentPage("gallery")} className="hidden sm:flex gap-1 border-primary/30 text-primary">See Full Gallery <ArrowRight className="w-4 h-4" /></Button>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            "from-primary/30 to-primary/10",
            "from-accent/30 to-accent/10",
            "from-primary/20 to-accent/20",
            "from-accent/20 to-primary/10",
            "from-primary/25 to-primary/5",
            "from-accent/25 to-primary/15",
          ].map((g, i) => (
            <motion.div key={i} whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              className={`relative h-36 sm:h-48 rounded-lg bg-liner-to-br ${g} flex items-center justify-center group cursor-pointer overflow-hidden`}
              onClick={() => setCurrentPage("gallery")}
            >
              <Camera className="w-8 h-8 text-primary/30" />
              <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <p className={`${lora.className} text-primary-foreground text-xs font-medium`}>View Gallery</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

// ─── PAGE 2: About ────────────────────────────────────────────────────────────
function AboutPage({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  const timeline = [
    { year: "2015", title: "Run4Health Founded", desc: "Coach Shashi Nair launches Run4Health with a small group of 20 runners at Upvan Lake, Thane." },
    { year: "2017", title: "First Half Marathon", desc: "Organized Thane's first community-led half marathon with 500 participants." },
    { year: "2019", title: "Yoga Program Launch", desc: "Expanded beyond running with weekly yoga sessions at local parks." },
    { year: "2022", title: "₹5L Milestone", desc: "Crossed ₹5,00,000 in community donations directed to healthcare NGOs." },
    { year: "2024", title: "50+ Members Strong", desc: "Now Thane's largest fitness community spanning multiple suburbs and districts." },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button onClick={() => setCurrentPage("home")} className="hover:text-primary">Home</button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">About</span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`${bebasNeue.className} text-7xl sm:text-8xl tracking-wider text-foreground`}>
            OUR <span className="text-primary">STORY</span>
          </motion.h1>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid sm:grid-cols-2 gap-6">
        {[
          { title: "Mission", icon: <Zap className="w-5 h-5" />, text: "To build a healthier, more active community across Thane and beyond through accessible fitness programs and health education." },
          { title: "Vision", icon: <TrendingUp className="w-5 h-5" />, text: "A world where every individual has the tools, support, and inspiration to lead an active and healthy life." },
        ].map((c, i) => (
          <motion.div key={c.title} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
            <Card className="h-full border-primary/20 bg-primary/5">
              <CardContent className="p-7">
                <div className="flex items-center gap-2 text-primary mb-3">{c.icon}<span className={`${bebasNeue.className} tracking-wider text-xl`}>{c.title}</span></div>
                <p className={`${lora.className} text-muted-foreground leading-relaxed`}>{c.text}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Coach Profile */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }}>
          <Card className="border-border overflow-hidden">
            <CardContent className="p-8 flex flex-col sm:flex-row gap-8 items-start">
              <Avatar className="w-28 h-28 border-4 border-primary/20 shrink-0">
                <AvatarImage src="/coach.png" />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">SN</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className={`${bebasNeue.className} text-4xl tracking-wider text-foreground`}>Coach Shashi Nair</p>
                <p className={`${lora.className} text-primary font-medium mb-3`}>Founder & Head Coach</p>
                <p className={`${lora.className} text-muted-foreground leading-relaxed mb-5`}>
                  Coach Shashi Nair has been at the forefront of community fitness for over a decade. A certified marathon coach and wellness advocate, he founded Run4Health with a singular belief: that movement is medicine.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Certified Marathon Coach","10+ Years Experience","5000+ Lives Impacted"].map(b => (
                    <Badge key={b} variant="outline" className="border-primary/30 text-primary text-xs">{b}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className={`${bebasNeue.className} text-5xl tracking-wider text-foreground mb-10`}>OUR JOURNEY</h2>
        <div className="relative border-l-2 border-primary/30 ml-4 space-y-10">
          {timeline.map((t, i) => (
            <motion.div key={t.year} whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="pl-8 relative">
              <div className="absolute -left-2 w-4 h-4 rounded-full bg-primary border-2 border-background top-1" />
              <p className={`${bebasNeue.className} text-3xl text-primary tracking-wider`}>{t.year}</p>
              <p className={`${lora.className} font-semibold text-foreground`}>{t.title}</p>
              <p className={`${lora.className} text-sm text-muted-foreground mt-1`}>{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className={`${bebasNeue.className} text-5xl tracking-wider text-foreground mb-10`}>OUR VALUES</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Community", icon: <Users className="w-6 h-6" />, text: "Every member belongs. We grow together, celebrate together, and support each other through every finish line." },
              { title: "Consistency", icon: <Activity className="w-6 h-6" />, text: "Progress is built daily. We show up — rain or shine — because habits define health." },
              { title: "Courage", icon: <Zap className="w-6 h-6" />, text: "Taking the first step is the hardest. We celebrate every beginner and every personal record." },
              { title: "Care", icon: <Heart className="w-6 h-6" />, text: "We care for our members' holistic wellbeing — physical, mental, and social health." },
            ].map((v, i) => (
              <motion.div key={v.title} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <Card className="h-full border-border hover:border-primary/30 transition-all">
                  <CardContent className="p-5">
                    <div className="text-primary mb-3">{v.icon}</div>
                    <h3 className={`${bebasNeue.className} text-2xl tracking-wide text-foreground mb-2`}>{v.title}</h3>
                    <p className={`${lora.className} text-sm text-muted-foreground leading-relaxed`}>{v.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

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
                      <div className="h-32 bg-liner-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
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
                          <Button size="sm" variant="outline" className="gap-1 border-border">View Recap <ChevronRight className="w-3.5 h-3.5" /></Button>
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
                      <div className="h-36 bg-liner-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
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

// ─── PAGE 5: Register ─────────────────────────────────────────────────────────
interface RegFormData {
  name: string; age: string; gender: string; phone: string; email: string;
  city: string; emergencyName: string; emergencyPhone: string;
  height: string; weight: string; thigh: string; waist: string;
  sleep: string; conditions: string; fitnessLevel: string;
  confirmed: boolean; agreed: boolean;
}

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
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">RS</AvatarFallback>
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
          <p className={`${lora.className} text-sm text-muted-foreground`}>Dashboard <ChevronRight className="inline w-3 h-3" /> <span className="text-foreground capitalize">{activeTab}</span></p>
          <div className="flex items-center gap-2">
            <ThemeToggle />
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
                    <Upload className="w-8 h-8 text-primary/40" />
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

// ─── PAGE 7: Donations ────────────────────────────────────────────────────────
function DonatePage({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  const [amount, setAmount] = useState("")
  const [custom, setCustom] = useState(false)
  const presets = ["₹100","₹500","₹1000","₹5000","Custom"]

  const { count: raised, ref: raisedRef } = useCountUp(1200000, 2000)

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-primary-foreground">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`${bebasNeue.className} text-7xl sm:text-9xl tracking-wider leading-none`}>
            SUPPORT<br />THE MOVEMENT
          </motion.h1>
          <p className={`${lora.className} text-primary-foreground/80 mt-4 max-w-lg text-lg`}>Your contribution directly funds health camps, running kits, and community events across Thane.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-12">
        {/* Form */}
        <div>
          <div ref={raisedRef as React.RefObject<HTMLDivElement>} className="mb-8">
            <p className={`${bebasNeue.className} text-5xl tracking-wider text-primary`}>₹{raised.toLocaleString("en-IN")}</p>
            <p className={`${lora.className} text-sm text-muted-foreground mb-2`}>raised of ₹20,00,000 goal</p>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${(1200000/2000000)*100}%` }} transition={{ duration: 1.5, ease: "easeOut" }} viewport={{ once: true }} className="h-full bg-primary rounded-full" />
            </div>
          </div>

          <Card className="border-border">
            <CardContent className="p-6 space-y-5">
              <div>
                <Label className={`${lora.className} font-medium text-sm`}>Select Amount</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {presets.map(p => (
                    <Button key={p} size="sm" variant={amount === p && !custom || (custom && p === "Custom") ? "default" : "outline"}
                      onClick={() => { if (p === "Custom") { setCustom(true); setAmount("") } else { setCustom(false); setAmount(p) } }}
                      className="border-primary/30"
                    >{p}</Button>
                  ))}
                </div>
                {custom && <Input className="mt-2" placeholder="Enter custom amount (₹)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />}
              </div>
              <div><Label>Donor Name</Label><Input className="mt-1" placeholder="Rahul Sharma" /></div>
              <div><Label>Email</Label><Input className="mt-1" placeholder="rahul@email.com" /></div>
              <div><Label>Message (optional)</Label><Textarea className="mt-1 h-20" placeholder="A message of support..." /></div>
              <Button className="w-full gap-2 text-base" size="lg"><Heart className="w-4 h-4" /> Donate Now</Button>
              <p className={`${lora.className} text-xs text-center text-muted-foreground`}>Powered by Razorpay — integration ready</p>
              <div className="flex justify-around pt-2">
                {[
                  { icon: <Shield className="w-4 h-4" />, label: "100% Secure" },
                  { icon: <CheckCircle className="w-4 h-4" />, label: "Tax Exempt 80G" },
                  { icon: <TrendingUp className="w-4 h-4" />, label: "Transparent Usage" },
                ].map(b => (
                  <div key={b.label} className="flex flex-col items-center gap-1 text-primary">
                    {b.icon}
                    <span className={`${lora.className} text-xs text-muted-foreground`}>{b.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Impact + History */}
        <div className="space-y-6">
          <div>
            <h3 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-4`}>YOUR IMPACT</h3>
            <div className="space-y-3">
              {[
                { amount: "₹500", impact: "funds a runner's full kit — shoes, bib, and hydration pack" },
                { amount: "₹1,000", impact: "sponsors one participant's event entry and timing chip" },
                { amount: "₹5,000", impact: "supports an entire health awareness camp in a Thane colony" },
              ].map(c => (
                <Card key={c.amount} className="border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className={`${bebasNeue.className} text-2xl tracking-wider text-primary shrink-0`}>{c.amount}</span>
                    <p className={`${lora.className} text-sm text-muted-foreground`}>{c.impact}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-4`}>RECENT DONATIONS</h3>
            <Card className="border-border overflow-hidden">
              <div className="divide-y divide-border">
                {[
                  { donor: "A generous donor from Mumbai", amount: "₹2,000", time: "2 days ago" },
                  { donor: "A supporter from Thane", amount: "₹500", time: "3 days ago" },
                  { donor: "Anonymous", amount: "₹5,000", time: "5 days ago" },
                  { donor: "A community member from Navi Mumbai", amount: "₹1,000", time: "1 week ago" },
                  { donor: "Anonymous", amount: "₹200", time: "1 week ago" },
                ].map((d, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className={`${lora.className} text-sm font-medium text-foreground`}>{d.donor}</p>
                      <p className={`${lora.className} text-xs text-muted-foreground`}>{d.time}</p>
                    </div>
                    <span className={`${bebasNeue.className} text-lg tracking-wide text-primary`}>{d.amount}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PAGE 8: Gallery ──────────────────────────────────────────────────────────
function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const images = [
    { cat: "Marathons", gradient: "from-primary/30 to-primary/10", title: "Thane Half Marathon 2025", date: "Jan 26, 2025" },
    { cat: "Yoga", gradient: "from-accent/30 to-accent/10", title: "Sunday Morning Yoga", date: "Jan 12, 2025" },
    { cat: "Events", gradient: "from-primary/20 to-accent/20", title: "Health Awareness Run", date: "Dec 2024" },
    { cat: "Team", gradient: "from-accent/20 to-primary/10", title: "Coaches & Volunteers", date: "Nov 2024" },
    { cat: "Marathons", gradient: "from-primary/25 to-primary/5", title: "Diwali Fun Run 2024", date: "Oct 2024" },
    { cat: "Yoga", gradient: "from-accent/25 to-primary/15", title: "Yeoor Hills Yoga Camp", date: "Sep 2024" },
    { cat: "Events", gradient: "from-primary/30 to-accent/10", title: "Corporate Wellness Day", date: "Sep 2024" },
    { cat: "Marathons", gradient: "from-primary/10 to-accent/30", title: "Monsoon Marathon 2024", date: "Jul 2024" },
    { cat: "Team", gradient: "from-accent/10 to-primary/25", title: "Annual Team Meet", date: "May 2024" },
    { cat: "Events", gradient: "from-primary/20 to-primary/5", title: "World Health Day 5K", date: "Apr 2024" },
    { cat: "Yoga", gradient: "from-accent/20 to-accent/5", title: "International Yoga Day", date: "Jun 2024" },
    { cat: "Marathons", gradient: "from-primary/15 to-accent/20", title: "Upvan Lake Morning Run", date: "Mar 2024" },
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`${bebasNeue.className} text-7xl sm:text-8xl tracking-wider text-foreground mb-10`}>
          OUR COMMUNITY<br /><span className="text-primary">IN ACTION</span>
        </motion.h1>

        <Tabs defaultValue="all">
          <TabsList className="mb-8">
            {["All","Marathons","Yoga","Events","Team"].map(t => (
              <TabsTrigger key={t} value={t.toLowerCase()}>{t}</TabsTrigger>
            ))}
          </TabsList>
          {["all","marathons","yoga","events","team"].map(tab => (
            <TabsContent key={tab} value={tab}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.filter(im => tab === "all" || im.cat.toLowerCase() === tab).map((im, i) => (
                  <motion.div key={im.title} whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                    className={`relative h-40 sm:h-52 rounded-xl bg-liner-to-br ${im.gradient} flex items-center justify-center group cursor-pointer overflow-hidden`}
                    onClick={() => { setActiveIndex(images.findIndex(x => x.title === im.title)); setLightboxOpen(true) }}
                  >
                    <Camera className="w-7 h-7 text-primary/30" />
                    <Badge variant="outline" className="absolute top-2 left-2 text-xs border-primary/20 text-primary bg-background/80">{im.cat}</Badge>
                    <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                      <p className={`${lora.className} text-primary-foreground text-xs font-medium px-2 text-center`}>{im.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className={`${bebasNeue.className} tracking-wide text-xl`}>{images[activeIndex]?.title}</DialogTitle>
          </DialogHeader>
          <div className={`h-56 rounded-lg bg-liner-to-br ${images[activeIndex]?.gradient} flex items-center justify-center`}>
            <Camera className="w-10 h-10 text-primary/30" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-2">
              <Button size="icon" variant="outline" onClick={() => setActiveIndex(i => (i - 1 + images.length) % images.length)}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={() => setActiveIndex(i => (i + 1) % images.length)}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <Badge variant="outline" className="border-primary/20 text-primary mr-2">{images[activeIndex]?.cat}</Badge>
              <span className={`${lora.className} text-xs text-muted-foreground`}>{images[activeIndex]?.date}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ─── PAGE 9: Contact ──────────────────────────────────────────────────────────
function ContactPage() {
  const [sent, setSent] = useState(false)

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-16">
        {/* Left */}
        <div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`${bebasNeue.className} text-7xl sm:text-8xl tracking-wider text-foreground mb-10`}>
            GET IN<br /><span className="text-primary">TOUCH</span>
          </motion.h1>
          <div className={`${lora.className} space-y-5 text-muted-foreground`}>
            <div className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div><p className="font-medium text-foreground">Address</p><p className="text-sm mt-0.5">Run4Health Community Center, Thane West, Maharashtra — 400601</p></div>
            </div>
            <div className="flex gap-3 items-center">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <div><p className="font-medium text-foreground">Phone</p><p className="text-sm">+91 98765 43210</p></div>
            </div>
            <div className="flex gap-3 items-center">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <div><p className="font-medium text-foreground">Email</p><p className="text-sm">run4health2026@gmail.com</p></div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="mt-8 h-56 rounded-xl bg-liner-to-br from-primary/10 to-accent/10 border border-border flex flex-col items-center justify-center gap-2">
            <MapPin className="w-8 h-8 text-primary/40" />
            <p className={`${lora.className} text-sm text-muted-foreground`}>Thane, Maharashtra</p>
          </div>
        </div>

        {/* Right — Form */}
        <div>
          <Card className="border-border">
            <CardContent className="p-7">
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-12">
                  <CheckCircle className="w-12 h-12 text-primary" />
                  <p className={`${bebasNeue.className} text-3xl tracking-wide text-foreground`}>MESSAGE SENT!</p>
                  <p className={`${lora.className} text-sm text-muted-foreground text-center`}>We'll respond within 24 hours.</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <h2 className={`${bebasNeue.className} text-3xl tracking-wide text-foreground mb-2`}>SEND A MESSAGE</h2>
                  <div><Label>Name</Label><Input className="mt-1" placeholder="Rahul Sharma" /></div>
                  <div><Label>Email</Label><Input className="mt-1" placeholder="rahul@email.com" /></div>
                  <div>
                    <Label>Subject</Label>
                    <Select>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {["General Inquiry","Event Registration","Donation","Media","Partnership"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Message</Label><Textarea className="mt-1 h-28" placeholder="Tell us how we can help..." /></div>
                  <Button className="w-full gap-2" onClick={() => setSent(true)}><Mail className="w-4 h-4" /> Send Message</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

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
              <Image src="/logo.png" alt="Run4Health" width={120} height={34} className="mx-auto mb-4 object-contain" />
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
                    { label: "Total Raised", value: "₹50k", icon: <DollarSign className="w-5 h-5" /> },
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

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setCurrentPage={setCurrentPage} />
      case "about": return <AboutPage setCurrentPage={setCurrentPage} />
      case "programs": return <ProgramsPage setCurrentPage={setCurrentPage} />
      case "news": return <NewsPage />
      case "register": return <RegisterPage setCurrentPage={setCurrentPage} />
      case "dashboard": return <DashboardPage />
      case "donate": return <DonatePage setCurrentPage={setCurrentPage} />
      case "gallery": return <GalleryPage />
      case "contact": return <ContactPage />
      case "admin": return <AdminPage />
      default: return <HomePage setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentPage !== "dashboard" && currentPage !== "admin" && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      {currentPage !== "dashboard" && currentPage !== "admin" && (
        <Footer setCurrentPage={setCurrentPage} />
      )}
    </div>
  )
}
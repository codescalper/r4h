"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bebas_Neue, Lora } from "next/font/google"
import { Heart, Trophy, Users, Calendar, ChevronRight, ArrowRight, Star, Dumbbell, Activity, TrendingUp, DollarSign, Newspaper, Zap, Wind, Timer } from "lucide-react"
import useCountUp from "./use-count-up"
import GalleryCarousel from "./gallery-carousel"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type PageKey = "home" | "about" | "programs" | "news" | "register" | "donate" | "gallery" | "contact"

// ─── Intro Splash ──────────────────────────────────────────────────────────────
function IntroSplash() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--foreground)" }}
      exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Speed lines bg */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              background: "var(--primary)",
              opacity: 0.04 + i * 0.013,
              top: `${8 + i * 10}%`,
              left: "-20%",
              right: "-20%",
              height: "1px",
              transform: "rotate(-7deg)",
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.05 + i * 0.06, duration: 0.65, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Corner glows */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle at 100% 0%, var(--primary), transparent 55%)", opacity: 0.14 }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none"
        style={{ background: "radial-gradient(circle at 0% 100%, var(--primary), transparent 60%)", opacity: 0.09 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.34, 1.4, 0.64, 1] }}
        >
          <div
            className="rounded-2xl px-8 py-5 mb-7"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <Image src="/logo.png" alt="Run4Health" width={210} height={64} className="object-contain" priority />
          </div>
        </motion.div>

        {/* Title */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className={`${bebasNeue.className} text-[clamp(3rem,10vw,6rem)] leading-none tracking-widest`}
            style={{ color: "var(--background)" }}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            RUN FOR{" "}
            <span style={{ color: "var(--primary)" }}>HEALTH</span>
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          className={`${lora.className} text-xs sm:text-sm uppercase tracking-[0.3em]`}
          style={{ color: "rgba(255,255,255,0.35)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Move &bull; Thrive &bull; Repeat
        </motion.p>

        {/* Fitness icon grid */}
        <motion.div
          className="flex items-center gap-3 sm:gap-5 mt-9"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          {[
            { icon: <Dumbbell className="w-4 h-4" />, label: "TRAIN" },
            { icon: <Heart className="w-4 h-4" />, label: "CARE" },
            { icon: <Zap className="w-4 h-4" />, label: "PUSH" },
            { icon: <Wind className="w-4 h-4" />, label: "RUN" },
          ].map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "var(--primary)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                {icon}
              </div>
              <span
                className={`${bebasNeue.className} text-[9px] tracking-[0.2em]`}
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2">
        <div
          className="w-48 sm:w-60 h-[2px] rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--primary)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.25, duration: 2.7, ease: "easeInOut" }}
          />
        </div>
        <motion.p
          className={`${lora.className} text-[9px] tracking-[0.22em] uppercase`}
          style={{ color: "rgba(255,255,255,0.18)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Loading your fitness journey
        </motion.p>
      </div>
    </motion.div>
  )
}

// ─── PAGE 1: Home ──────────
function HomePage({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  const [introVisible, setIntroVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIntroVisible(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    { label: "Members", value: 2400, suffix: "+" },
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
    <>
      <AnimatePresence>{introVisible && <IntroSplash />}</AnimatePresence>

      <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
        {/* Dynamic fitness background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Base gradient wash */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--primary) 0%, transparent 45%)", opacity: 0.07 }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 85% 40%, var(--accent), transparent 55%)", opacity: 0.06 }} />

          {/* Speed diagonal stripes */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                background: "var(--primary)",
                opacity: 0.028 + i * 0.01,
                top: `${15 + i * 16}%`,
                left: "-30%",
                right: "-30%",
                height: "1.5px",
                transform: "rotate(-11deg)",
              }}
            />
          ))}

          {/* Large decorative rings (right side) */}
          <div
            className="absolute -right-36 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{ border: "1px solid var(--primary)", opacity: 0.06 }}
          />
          <div
            className="absolute -right-52 top-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
            style={{ border: "1px solid var(--primary)", opacity: 0.03 }}
          />
          <div
            className="absolute -right-20 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{ backgroundColor: "var(--primary)", opacity: 0.04, filter: "blur(60px)" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-10 lg:gap-14 items-center pt-28 pb-16 sm:pt-32 sm:pb-20">
          {/* Left: Text */}
          <div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="inline-flex items-center gap-2 mb-5 bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm">
                <TrendingUp className="w-3 h-3" /> Thane&apos;s #1 Fitness Community
              </div>
            </motion.div>

            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.2, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className={`${bebasNeue.className} text-[clamp(4rem,13vw,8.5rem)] leading-none tracking-wider text-foreground`}
              >
                RUN FOR
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.3, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className={`${bebasNeue.className} text-[clamp(4rem,13vw,8.5rem)] leading-none tracking-wider text-primary`}
              >
                HEALTH
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className={`${lora.className} text-base sm:text-lg text-muted-foreground mt-5 max-w-md leading-relaxed`}
            >
              A community movement transforming lives through fitness, one stride at a time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="flex flex-wrap gap-3 mt-7"
            >
              <Button size="lg" onClick={() => setCurrentPage("register")} className="gap-2 text-sm sm:text-base px-6 shadow-lg">
                Join Now <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setCurrentPage("donate")} className="gap-2 text-sm sm:text-base px-6 border-primary text-primary hover:bg-primary/10">
                <Heart className="w-4 h-4" /> Donate Now
              </Button>
            </motion.div>

            {/* Floating stat pills */}
            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-2 mt-6"
            >
              {["50+ Members", "150+ Events", "₹50k+ Raised"].map((s) => (
                <span key={s} className={`${lora.className} text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1.5 font-medium`}>
                  {s}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: Fitness Dashboard Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-sm">
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ backgroundColor: "var(--primary)", opacity: 0.12, filter: "blur(48px)", transform: "scale(1.1)" }}
              />

              <div className="relative bg-card/90 backdrop-blur-md border border-border rounded-3xl p-7 shadow-2xl space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <Image src="/logo.png" alt="Run4Health" width={130} height={38} className="object-contain" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className={`${lora.className} text-[10px] text-primary font-semibold tracking-widest uppercase`}>Live</span>
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  {[
                    { label: "Avg Pace", value: "5:42", unit: "min/km", icon: <Timer className="w-4 h-4" />, pct: 78 },
                    { label: "Active Members", value: "50", unit: "runners", icon: <Users className="w-4 h-4" />, pct: 92 },
                    { label: "Weekly Distance", value: "12.4", unit: "km avg", icon: <TrendingUp className="w-4 h-4" />, pct: 62 },
                  ].map((m, i) => (
                    <div key={m.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            {m.icon}
                          </div>
                          <div>
                            <p className={`${lora.className} text-[11px] text-muted-foreground leading-none mb-0.5`}>{m.label}</p>
                            <p className={`${bebasNeue.className} text-xl tracking-wider text-foreground leading-none`}>
                              {m.value} <span className={`${lora.className} text-xs text-muted-foreground font-normal tracking-normal`}>{m.unit}</span>
                            </p>
                          </div>
                        </div>
                        <span className={`${bebasNeue.className} text-sm text-primary`}>{m.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pct}%` }}
                          transition={{ delay: 0.7 + i * 0.15, duration: 1.1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Heartbeat SVG */}
                <div className="border-t border-border pt-4">
                  <p className={`${lora.className} text-[10px] text-muted-foreground mb-2 uppercase tracking-[0.2em]`}>
                    Community Pulse
                  </p>
                  <svg viewBox="0 0 200 36" className="w-full h-8" fill="none" style={{ color: "var(--primary)" }}>
                    <motion.path
                      d="M0,18 L28,18 L42,5 L52,31 L62,9 L72,25 L85,18 L115,18 L129,5 L139,31 L149,9 L159,25 L172,18 L200,18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ delay: 1.1, duration: 1.6, ease: "easeInOut" }}
                    />
                  </svg>
                </div>

                <Button size="sm" className="w-full gap-2 shadow-md" onClick={() => setCurrentPage("register")}>
                  Join the Community <ArrowRight className="w-3.5 h-3.5" />
                </Button>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} viewport={{ once: true }}>
            <Card className="border-primary/20 bg-primary/5 h-full">
              <CardContent className="p-5 sm:p-8">
                <Badge className="mb-4 bg-primary/20 text-primary border-0">Our Mission</Badge>
                <blockquote className={`${bebasNeue.className} text-2xl sm:text-3xl lg:text-4xl tracking-wide text-foreground leading-tight`}>
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
              { label: "Events Hosted", value: "150+", icon: <Calendar className="w-5 h-5" /> },
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
      <section className="py-14 sm:py-20 bg-muted/30" style={{ clipPath: "polygon(0 2%, 100% 0, 100% 98%, 0 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} className="mb-10">
            <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>What we offer</p>
            <h2 className={`${bebasNeue.className} text-5xl sm:text-6xl tracking-wider text-foreground`}>WHAT WE DO</h2>
          </motion.div>
          <div className="flex gap-4 sm:gap-5 overflow-x-auto snap-x pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3">
            {programs.map((p, i) => (
              <motion.div key={p.title} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }} whileHover={{ y: -4 }} className="snap-start shrink-0 w-[80vw] sm:w-80 lg:w-auto">
                <Card className="h-full border-border hover:border-primary/40 transition-all duration-200 overflow-hidden">
                  <div className={`h-28 bg-gradient-to-br ${p.color} flex items-center justify-center`}>
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
      <section className="bg-primary py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-primary-foreground text-center">
          {stats.map((s) => {
            const { count, ref } = useCountUp(s.value)
            return (
              <div key={s.label} ref={ref}>
                <p className={`${bebasNeue.className} text-4xl sm:text-5xl tracking-wider`}>{count}{s.suffix}</p>
                <p className={`${lora.className} text-xs sm:text-sm opacity-80 mt-1`}>{s.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} className="mb-8 sm:mb-10">
          <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>Community voices</p>
          <h2 className={`${bebasNeue.className} text-4xl sm:text-5xl lg:text-6xl tracking-wider text-foreground`}>VOICES FROM OUR COMMUNITY</h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      <section className="bg-muted/20 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>Stay informed</p>
              <h2 className={`${bebasNeue.className} text-4xl sm:text-5xl lg:text-6xl tracking-wider text-foreground`}>LATEST NEWS</h2>
            </div>
            <Button variant="outline" onClick={() => setCurrentPage("news")} className="gap-1 hidden sm:flex border-primary/30 text-primary">View All <ArrowRight className="w-4 h-4" /></Button>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {news.map((n, i) => (
              <motion.div key={n.title} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 40 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
                <Card className="h-full overflow-hidden border-border hover:border-primary/30 transition-all">
                  <div className="h-36 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }} viewport={{ once: true }} className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>Our memories</p>
            <h2 className={`${bebasNeue.className} text-4xl sm:text-5xl lg:text-6xl tracking-wider text-foreground`}>GALLERY</h2>
          </div>
          <Button variant="outline" onClick={() => setCurrentPage("gallery")} className="hidden sm:flex gap-1 border-primary/30 text-primary">See Full Gallery <ArrowRight className="w-4 h-4" /></Button>
        </motion.div>
        <GalleryCarousel setCurrentPage={setCurrentPage} />
      </section>
      </div>
    </>
  )
}

export default HomePage
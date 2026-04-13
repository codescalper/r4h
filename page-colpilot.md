// Run4Health — Landing Page — app/page.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Heart,
  Users,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  ArrowRight,
  Star,
  Moon,
  Sun,
  Menu,
  Activity,
  TrendingUp,
  Trophy,
  Zap,
  CheckCircle,
  ChevronDown,
} from "lucide-react"

// ─── Theme Toggle ────────────────────────────────────────────────────────────
function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="size-9" />
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end])

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString("en-IN")}{suffix}
    </span>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
const navLinks = ["Home", "About", "Programs", "News", "Gallery", "Contact"]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#" className="flex-shrink-0">
          <Image src="/logo.png" alt="Run4Health" width={120} height={36} className="object-contain" />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" size="sm" className="gap-1.5">
            <Heart className="size-3.5" />
            Donate
          </Button>
          <Button size="sm" className="gap-1.5">
            Join Now
            <ArrowRight className="size-3.5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-6 pt-8">
                <Image src="/logo.png" alt="Run4Health" width={100} height={30} className="object-contain" />
                <Separator />
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase()}`}
                      onClick={() => setSheetOpen(false)}
                      className="px-3 py-2.5 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                    >
                      {link}
                    </a>
                  ))}
                </nav>
                <Separator />
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full gap-2">
                    <Heart className="size-4" /> Donate
                  </Button>
                  <Button className="w-full gap-2">
                    Join Now <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const statPills = [
    { label: "50+ Members", icon: <Users className="size-3.5" /> },
    { label: "150+ Events", icon: <Calendar className="size-3.5" /> },
    { label: "₹50k+ Raised", icon: <Heart className="size-3.5" /> },
  ]

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  } as const
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-background pt-16"
    >
      {/* Background grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, var(--foreground) 0px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, var(--foreground) 0px, transparent 1px, transparent 60px)",
        }}
      />

      {/* Diagonal accent shard top-left */}
      <div
        className="absolute top-0 left-0 w-[45%] h-[55%] bg-primary/5 dark:bg-primary/10 rounded-br-[120px]"
        style={{ clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* ── LEFT: Copy ─────────────────────────── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {/* Eyebrow badge */}
            <motion.div variants={item}>
              <Badge variant="outline" className="gap-1.5 text-xs px-3 py-1 border-primary/30 text-primary">
                <Zap className="size-3" />
                Thane's #1 Community Fitness Movement
              </Badge>
            </motion.div>

            {/* Main headline */}
            <motion.div variants={item} className="flex flex-col leading-none">
              <span
                className="font-bebas text-[clamp(4rem,10vw,8rem)] tracking-wider text-foreground"
              >
                RUN FOR
              </span>
              <span
                className="font-bebas text-[clamp(4rem,10vw,8rem)] tracking-wider text-primary"
              >
                HEALTH
              </span>
            </motion.div>

            {/* Subheading */}
            <motion.p
              variants={item}
              className="font-lora text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed"
            >
              A community movement transforming lives through fitness,
              one stride at a time — led by{" "}
              <span className="text-foreground font-semibold">Coach Shashi Nair</span> in Thane, Maharashtra.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              <motion.div whileTap={{ scale: 0.96 }}>
                <Button size="lg" className="gap-2 text-base px-6">
                  Join the Movement
                  <ArrowRight className="size-4" />
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.96 }}>
                <Button size="lg" variant="outline" className="gap-2 text-base px-6">
                  <Heart className="size-4" />
                  Donate Now
                </Button>
              </motion.div>
            </motion.div>

            {/* Stat pills */}
            <motion.div variants={item} className="flex flex-wrap gap-2 pt-2">
              {statPills.map((pill, i) => (
                <motion.div
                  key={pill.label}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: "easeInOut" }}
                >
                  <Card className="py-0 rounded-full ring-1 ring-primary/20">
                    <CardContent className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-foreground">
                      <span className="text-primary">{pill.icon}</span>
                      {pill.label}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Logo Display ──────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            {/* Outer decorative ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute size-[420px] sm:size-[500px] rounded-full border border-dashed border-primary/20"
            />
            {/* Middle ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute size-[340px] sm:size-[400px] rounded-full border border-primary/10"
            />

            {/* Warm gradient circle base */}
            <div className="absolute size-[280px] sm:size-[340px] rounded-full bg-gradient-to-br from-primary/15 via-primary/5 to-accent/10 dark:from-primary/20 dark:to-accent/15" />

            {/* Logo card */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="relative z-10 flex flex-col items-center gap-6"
            >
              <div className="rounded-2xl bg-card ring-1 ring-foreground/10 shadow-xl p-8 sm:p-10 flex flex-col items-center gap-4">
                <Image
                  src="/logo.png"
                  alt="Run4Health"
                  width={200}
                  height={60}
                  className="object-contain"
                  priority
                />
                <Separator />
                <p
                  className="font-bebas text-2xl tracking-[0.3em] text-primary"
                >
                  FITNESS FIRST
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  <span className="font-lora">Thane, Maharashtra</span>
                </div>
              </div>

              {/* Floating achievement badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 sm:-right-8"
              >
                <Card className="py-0 rounded-xl shadow-lg ring-1 ring-primary/20">
                  <CardContent className="flex items-center gap-2 px-3 py-2 text-xs font-medium">
                    <Trophy className="size-3.5 text-primary" />
                    <span>8 Years Strong</span>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="absolute -bottom-4 -left-4 sm:-left-8"
              >
                <Card className="py-0 rounded-xl shadow-lg ring-1 ring-primary/20">
                  <CardContent className="flex items-center gap-2 px-3 py-2 text-xs font-medium">
                    <Activity className="size-3.5 text-primary" />
                    <span>5000+ Lives Changed</span>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Decorative dots */}
            <div className="absolute top-8 left-8 size-2 rounded-full bg-primary/30" />
            <div className="absolute bottom-12 right-12 size-3 rounded-full bg-accent/40" />
            <div className="absolute top-1/3 right-4 size-1.5 rounded-full bg-primary/20" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground"
      >
        <span className="text-xs font-lora tracking-wider">Scroll</span>
        <ChevronDown className="size-4" />
      </motion.div>
    </section>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { label: "Members", end: 2400, suffix: "+", icon: <Users className="size-5" /> },
    { label: "Events Hosted", end: 150, suffix: "+", icon: <Calendar className="size-5" /> },
    { label: "Funds Raised", end: 1200000, prefix: "₹", suffix: "", icon: <Heart className="size-5" /> },
    { label: "Years Active", end: 8, suffix: "", icon: <Trophy className="size-5" /> },
  ]

  return (
    <section className="bg-foreground text-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center gap-2"
            >
              <span className="opacity-60">{stat.icon}</span>
              <span className="font-bebas text-4xl sm:text-5xl tracking-wider">
                <AnimatedCounter end={stat.end} prefix={stat.prefix} suffix={stat.suffix} />
              </span>
              <span className="text-sm font-lora opacity-70">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── About / Coach Section ────────────────────────────────────────────────────
function AboutSection() {
  const achievements = [
    { icon: <CheckCircle className="size-4" />, label: "Certified Marathon Coach" },
    { icon: <Trophy className="size-4" />, label: "10+ Years Experience" },
    { icon: <Users className="size-4" />, label: "5000+ Lives Impacted" },
  ]

  return (
    <section id="about" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 flex flex-col gap-3"
        >
          <Badge variant="outline" className="w-fit gap-1.5 border-primary/30 text-primary">
            <Activity className="size-3" /> Our Story
          </Badge>
          <h2 className="font-bebas text-5xl sm:text-6xl tracking-wider text-foreground">
            BUILT BY THE COMMUNITY,<br />FOR THE COMMUNITY
          </h2>
          <p className="font-lora text-muted-foreground max-w-2xl text-base leading-relaxed">
            Run4Health was born from a simple belief — that movement is medicine, and community is the cure.
          </p>
        </motion.div>

        {/* 2-col: Mission card + Coach card */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Mission + Vision (2 cols wide) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-2xl" />
                <CardContent className="pl-8 flex flex-col gap-3">
                  <Badge variant="secondary" className="w-fit text-xs">
                    Our Mission
                  </Badge>
                  <p className="font-lora text-base leading-relaxed text-card-foreground">
                    "To build a healthier, more active community across Thane and beyond through
                    accessible fitness programs and health education."
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-accent-foreground rounded-l-2xl" />
                <CardContent className="pl-8 flex flex-col gap-3">
                  <Badge variant="outline" className="w-fit text-xs border-primary/30 text-primary">
                    Our Vision
                  </Badge>
                  <p className="font-lora text-base leading-relaxed text-card-foreground">
                    "A world where every individual has the tools, support, and inspiration to lead
                    an active and healthy life."
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.a
              href="#programs"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline mt-2"
            >
              See what we do <ChevronRight className="size-4" />
            </motion.a>
          </div>

          {/* Coach Card (3 cols wide) */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row gap-0">
                  {/* Coach photo */}
                  <div className="relative sm:w-52 h-52 sm:h-auto flex-shrink-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-end justify-center overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none">
                    <Image
                      src="/coach.png"
                      alt="Coach Shashi Nair"
                      fill
                      className="object-cover object-top"
                    />
                    {/* Gradient overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card/80 to-transparent" />
                  </div>

                  {/* Coach info */}
                  <div className="flex flex-col gap-5 p-6 flex-1">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
                        Founder & Head Coach
                      </p>
                      <h3 className="font-bebas text-3xl tracking-wider text-card-foreground">
                        Shashi Nair
                      </h3>
                    </div>

                    <p className="font-lora text-sm text-muted-foreground leading-relaxed">
                      A certified marathon coach and wellness advocate, Coach Shashi founded Run4Health
                      with a singular belief: that movement is medicine. Over the past decade, he has
                      helped thousands transform their lives one stride at a time.
                    </p>

                    <Separator />

                    <div className="flex flex-col gap-2">
                      {achievements.map((a) => (
                        <div key={a.label} className="flex items-center gap-2 text-sm text-card-foreground">
                          <span className="text-primary">{a.icon}</span>
                          <span className="font-medium">{a.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Programs Section ─────────────────────────────────────────────────────────
function ProgramsSection() {
  const programs = [
    {
      icon: <TrendingUp className="size-6" />,
      title: "Marathon Training",
      desc: "Structured 16-week programs for 5K to full marathon. Open to all fitness levels with personalized pacing plans.",
      badge: "Most Popular",
    },
    {
      icon: <Activity className="size-6" />,
      title: "Morning Yoga",
      desc: "Sunrise yoga sessions every Sunday at Yeoor Hills. Focus on flexibility, breathwork, and mental clarity.",
      badge: "Every Sunday",
    },
    {
      icon: <Heart className="size-6" />,
      title: "Health Camps",
      desc: "Free health awareness drives in schools and corporates — BMI checks, nutrition talks, and fitness demos.",
      badge: "Free Entry",
    },
  ]

  return (
    <section id="programs" className="py-20 sm:py-28 bg-muted/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div className="flex flex-col gap-2">
            <span className="font-bebas text-5xl sm:text-6xl tracking-wider text-foreground">
              WHAT WE DO
            </span>
            <p className="font-lora text-muted-foreground text-base">
              Programs designed for every body, every level.
            </p>
          </div>
          <Button variant="outline" className="w-fit gap-1.5">
            All Programs <ChevronRight className="size-4" />
          </Button>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <Card className="h-full flex flex-col">
                <CardContent className="flex flex-col gap-5 flex-1">
                  {/* Gradient icon block */}
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {p.icon}
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bebas text-2xl tracking-wider text-card-foreground">
                        {p.title}
                      </h3>
                      <Badge variant="secondary" className="text-xs flex-shrink-0">
                        {p.badge}
                      </Badge>
                    </div>
                    <p className="font-lora text-sm text-muted-foreground leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                  <Button variant="ghost" className="w-fit gap-1.5 -ml-3 text-primary hover:text-primary">
                    Learn More <ChevronRight className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Priya Desai",
    location: "Thane West",
    avatar: "PD",
    stars: 5,
    quote:
      "Run4Health changed my life. I went from struggling to walk a kilometer to completing my first half marathon. Coach Shashi's guidance and the community support made all the difference.",
  },
  {
    name: "Rahul Sharma",
    location: "Kalwa, Thane",
    avatar: "RS",
    stars: 5,
    quote:
      "The Sunday yoga sessions are my weekly reset. The community here is so warm and non-judgmental — it's the highlight of my week. Truly life-changing.",
  },
  {
    name: "Anita Kulkarni",
    location: "Dombivli",
    avatar: "AK",
    stars: 5,
    quote:
      "I donated to the health camp initiative and saw firsthand how it impacted the local schools. This organization walks the talk. Proud to support them.",
  },
]

function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-2 mb-12"
        >
          <Badge variant="outline" className="w-fit gap-1.5 border-primary/30 text-primary">
            <Star className="size-3" /> Community Stories
          </Badge>
          <h2 className="font-bebas text-5xl sm:text-6xl tracking-wider text-foreground">
            VOICES FROM<br />OUR COMMUNITY
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.55 }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full flex flex-col">
                <CardContent className="flex flex-col gap-5 flex-1">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} className="size-3.5 fill-primary text-primary" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-lora text-sm text-muted-foreground leading-relaxed flex-1 italic">
                    "{t.quote}"
                  </p>

                  <Separator />

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {t.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="size-3" /> {t.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-16 sm:py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex flex-col gap-3 text-primary-foreground">
            <h2 className="font-bebas text-4xl sm:text-5xl tracking-wider">
              READY TO TAKE THE FIRST STEP?
            </h2>
            <p className="font-lora text-primary-foreground/80 text-base max-w-lg">
              Join 50+ community members already living healthier, stronger lives.
              Your journey begins with one run.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 gap-2 px-6"
              >
                Join Now <ArrowRight className="size-4" />
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.96 }}>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 gap-2 px-6"
              >
                <Heart className="size-4" /> Donate
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const quickLinks = ["Home", "About", "Programs", "News", "Gallery", "Contact"]
  const programs = ["Marathon Training", "Yoga Sessions", "Health Camps", "Corporate Wellness", "Junior Runners"]

  return (
    <footer id="contact" className="bg-foreground text-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">

          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            <Image src="/logo.png" alt="Run4Health" width={110} height={32} className="object-contain brightness-0 invert" />
            <p className="font-lora text-sm text-background/70 leading-relaxed">
              A community movement transforming lives through fitness, one stride at a time.
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bebas text-xl tracking-wider">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase()}`}
                    className="text-sm text-background/70 hover:text-background transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="size-3" /> {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bebas text-xl tracking-wider">Programs</h4>
            <ul className="flex flex-col gap-2">
              {programs.map((p) => (
                <li key={p}>
                  <a href="#programs" className="text-sm text-background/70 hover:text-background transition-colors flex items-center gap-1.5">
                    <ChevronRight className="size-3" /> {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bebas text-xl tracking-wider">Contact Us</h4>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-background/70">
                <MapPin className="size-4 mt-0.5 flex-shrink-0 text-primary" />
                <span className="font-lora leading-relaxed">Run4Health Community Center,<br />Thane West, Maharashtra — 400601</span>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-center gap-2.5 text-sm text-background/70 hover:text-background transition-colors">
                  <Phone className="size-4 text-primary" />
                  <span>+91 98765 43210</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@run4health.in" className="flex items-center gap-2.5 text-sm text-background/70 hover:text-background transition-colors">
                  <Mail className="size-4 text-primary" />
                  <span>hello@run4health.in</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="bg-background/10" />

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-background/50">
          <span className="font-lora">
            © {new Date().getFullYear()} Run4Health. All rights reserved.
          </span>
          <span className="font-lora">
            Made with ❤️ for community health · Thane, Maharashtra
          </span>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <AboutSection />
      <ProgramsSection />
      <TestimonialsSection />
      <CTABanner />
      <Footer />
    </main>
  )
}

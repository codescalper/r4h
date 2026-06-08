"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Zap, TrendingUp, Users, Activity, Heart, ChevronRight } from "lucide-react"
import { bebasNeue, lora } from "@/lib/fonts"

export default function AboutPage() {
  const timeline = [
    { year: "2015 – Run4Health Founded", title: "", desc: "From a handful of walkers, a movement was born." },
    { year: "2017 – Structured Training Programs Introduced", title: "", desc: "Structured training transformed aspirations into achievable goals." },
    { year: "2019 – First Large-Scale Participation in Running Events", title: "", desc: "The community made its mark in organized running events." },
    { year: "2022 – First Full Marathon Finishers", title: "", desc: "Marathon dreams became reality for dedicated team members." },
    { year: "2024 – Women's Fitness Group Launched", title: "", desc: "A new chapter began with a dedicated Women's Fitness Group." },
  ]

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
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
          { title: "Mission", icon: <Zap className="w-5 h-5" />, text: "To build a healthier and more active community, through simple fitness programs and awareness sessions." },
          { title: "Vision", icon: <TrendingUp className="w-5 h-5" />, text: "A world where every individual is inspired and supported to lead an active and healthy life, building stronger and healthier communities." },
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
                  Coach Shashi Nair has been a driving force in community fitness for over a decade. A certified fitness coach and passionate wellness advocate, he founded Run4Health on a simple yet powerful belief: movement is medicine.
                  Through his guidance, hundreds of individuals have embraced healthier lifestyles, improved their fitness, and discovered the transformative power of running. His mission is to inspire people of all ages and fitness levels to make health, fitness, and wellbeing a lifelong journey.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Certified Fitness Coach","10++ Years of Experience","Positively Impacted lives of Many"].map(b => (
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
              { title: "Courage", icon: <Zap className="w-6 h-6" />, text: "Taking the first step is the hardest. We celebrate every beginner and every personal Achievements." },
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


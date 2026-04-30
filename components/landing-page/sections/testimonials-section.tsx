"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { bebasNeue, lora } from "@/lib/fonts"

const TESTIMONIALS = [
  {
    name: "Priya Kulkarni",
    loc: "Thane West",
    quote: "Run4Health changed my life. I went from couch potato to half-marathon finisher in just 6 months!",
    stars: 5,
  },
  {
    name: "Rajan Mehta",
    loc: "Navi Mumbai",
    quote: "Coach Shashi's guidance is unparalleled. The community here is incredibly supportive.",
    stars: 5,
  },
  {
    name: "Sunita Desai",
    loc: "Mulund",
    quote: "The yoga sessions have helped my chronic back pain more than any medicine. Truly transformative.",
    stars: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 30 }}
        viewport={{ once: true }}
        className="mb-8 sm:mb-10"
      >
        <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>Community voices</p>
        <h2 className={`${bebasNeue.className} text-4xl sm:text-5xl lg:text-6xl tracking-wider text-foreground`}>
          VOICES FROM OUR COMMUNITY
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 40 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full border-border hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-3" aria-label={`${t.stars} stars`}>
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className={`${lora.className} text-sm text-muted-foreground leading-relaxed mb-4 italic`}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="w-9 h-9 border border-primary/20">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
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
  )
}

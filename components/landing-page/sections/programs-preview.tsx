"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Activity, Heart, ArrowRight } from "lucide-react"
import { bebasNeue, lora } from "@/lib/fonts"
import { usePageNavigation } from "@/hooks/use-page-navigation"

const PROGRAMS = [
  {
    title: "Marathon Training",
    icon: <Dumbbell className="w-6 h-6" />,
    desc: "Structured 16-week programs from 5K to full marathon. Coached sessions every weekend at Upvan Lake.",
    color: "from-primary/30 to-primary/10",
  },
  {
    title: "Yoga Sessions",
    icon: <Activity className="w-6 h-6" />,
    desc: "Sunday morning yoga in open air parks. Suitable for all ages and fitness levels.",
    color: "from-accent/30 to-accent/10",
  },
  {
    title: "Health Awareness Camps",
    icon: <Heart className="w-6 h-6" />,
    desc: "Free health check-ups, BMI screenings, and nutrition workshops across Thane.",
    color: "from-primary/20 to-accent/20",
  },
]

export default function ProgramsPreview() {
  const navigate = usePageNavigation()

  return (
    <section
      className="py-14 sm:py-20 bg-muted/30"
      style={{ clipPath: "polygon(0 2%, 100% 0, 100% 98%, 0 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>What we offer</p>
          <h2 className={`${bebasNeue.className} text-5xl sm:text-6xl tracking-wider text-foreground`}>WHAT WE DO</h2>
        </motion.div>

        <div className="flex gap-4 sm:gap-5 overflow-x-auto snap-x pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-3">
          {PROGRAMS.map((p, i) => (
            <motion.div
              key={p.title}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="snap-start shrink-0 w-[80vw] sm:w-80 lg:w-auto"
            >
              <Card className="h-full border-border hover:border-primary/40 transition-all duration-200 overflow-hidden">
                <div className={`h-28 bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                  <div className="text-primary opacity-60">{p.icon}</div>
                </div>
                <CardContent className="p-5">
                  <h3 className={`${bebasNeue.className} text-2xl tracking-wide text-foreground mb-2`}>{p.title}</h3>
                  <p className={`${lora.className} text-sm text-muted-foreground leading-relaxed mb-4`}>{p.desc}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("programs")}
                    className="gap-1 border-primary/30 text-primary"
                  >
                    Learn More <ArrowRight className="w-3.5 h-3.5" />
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

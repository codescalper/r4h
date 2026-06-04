"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Calendar, DollarSign, Trophy, ChevronRight } from "lucide-react"
import { bebasNeue, lora } from "@/lib/fonts"
import { usePageNavigation } from "@/hooks/use-page-navigation"

const STATS = [
  { label: "Members", value: "50+", icon: <Users className="w-5 h-5" /> },
  { label: "Events Hosted", value: "150+", icon: <Calendar className="w-5 h-5" /> },
  { label: "Funds Raised", value: "₹50k+", icon: <DollarSign className="w-5 h-5" /> },
  { label: "Years Active", value: "8 Yrs", icon: <Trophy className="w-5 h-5" /> },
]

export default function AboutPreview() {
  const navigate = usePageNavigation()

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Mission card */}
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          viewport={{ once: true }}
        >
          <Card className="border-primary/20 bg-primary/5 h-full">
            <CardContent className="p-5 sm:p-8">
              <Badge className="mb-4 bg-primary/20 text-primary border-0">Our Mission</Badge>
              <blockquote className={`${bebasNeue.className} text-2xl sm:text-3xl lg:text-4xl tracking-wide text-foreground leading-tight`}>
                &ldquo;Empowering communities toward better health through fitness, awareness, and collective action.&rdquo;
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
              <Button variant="ghost" className="mt-4 gap-1 text-primary pl-0" onClick={() => navigate("about")}>
                Read Our Story <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
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
  )
}

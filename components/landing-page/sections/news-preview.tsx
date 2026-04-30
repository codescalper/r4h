"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, ArrowRight, ChevronRight } from "lucide-react"
import { bebasNeue, lora } from "@/lib/fonts"
import { usePageNavigation } from "@/hooks/use-page-navigation"

const NEWS_ITEMS = [
  { title: "Thane Half Marathon Sets New Participation Record", cat: "Event Recap", date: "Jan 26, 2025" },
  { title: "5 Morning Stretches Every Runner Should Know", cat: "Health Tips", date: "Jan 15, 2025" },
  { title: "How Running Changed Priya's Life", cat: "Community Story", date: "Jan 8, 2025" },
]

export default function NewsPreview() {
  const navigate = usePageNavigation()

  return (
    <section className="bg-muted/20 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8 sm:mb-10"
        >
          <div>
            <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>Stay informed</p>
            <h2 className={`${bebasNeue.className} text-4xl sm:text-5xl lg:text-6xl tracking-wider text-foreground`}>
              LATEST NEWS
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("news")}
            className="gap-1 hidden sm:flex border-primary/30 text-primary"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {NEWS_ITEMS.map((n, i) => (
            <motion.div
              key={n.title}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 40 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
            >
              <Card className="h-full overflow-hidden border-border hover:border-primary/30 transition-all">
                <div className="h-36 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                  <Newspaper className="w-8 h-8 text-primary/40" />
                </div>
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-2 text-xs">{n.cat}</Badge>
                  <h3 className={`${lora.className} font-semibold text-foreground text-sm leading-snug mb-2`}>{n.title}</h3>
                  <p className={`${lora.className} text-xs text-muted-foreground mb-3`}>{n.date}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="pl-0 text-primary text-xs gap-1"
                    onClick={() => navigate("news")}
                  >
                    Read More <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="flex sm:hidden mt-6 justify-center">
          <Button variant="outline" onClick={() => navigate("news")} className="gap-1 border-primary/30 text-primary">
            View All News <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

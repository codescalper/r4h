"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bebas_Neue, Lora } from "next/font/google"
import { Camera, ArrowLeft, ArrowRight } from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

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
                    className={`relative h-40 sm:h-52 rounded-xl bg-gradient-to-br ${im.gradient} flex items-center justify-center group cursor-pointer overflow-hidden`}
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
          <div className={`h-56 rounded-lg bg-gradient-to-br ${images[activeIndex]?.gradient} flex items-center justify-center`}>
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

export default GalleryPage
"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { bebasNeue, lora } from "@/lib/fonts"
import { usePageNavigation } from "@/hooks/use-page-navigation"
import GalleryCarousel from "@/components/landing-page/gallery-carousel"

export default function GalleryPreview() {
  const navigate = usePageNavigation()

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 30 }}
        viewport={{ once: true }}
        className="flex items-end justify-between mb-8 sm:mb-10"
      >
        <div>
          <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>Our memories</p>
          <h2 className={`${bebasNeue.className} text-4xl sm:text-5xl lg:text-6xl tracking-wider text-foreground`}>
            GALLERY
          </h2>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("gallery")}
          className="hidden sm:flex gap-1 border-primary/30 text-primary"
        >
          See Full Gallery <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>

      <GalleryCarousel />
    </section>
  )
}

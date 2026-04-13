"use client"

import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Lora } from "next/font/google"
import { Camera } from "lucide-react"

const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type PageKey = "home" | "about" | "programs" | "news" | "register" | "dashboard" | "donate" | "gallery" | "contact" | "admin"

// ─── Gallery Carousel (autoplay) ─────────────────────────────────────────────
function GalleryCarousel({ setCurrentPage }: { setCurrentPage: (p: PageKey) => void }) {
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) return
    const timer = setInterval(() => api.scrollNext(), 3000)
    return () => clearInterval(timer)
  }, [api])

  const items = [
    { g: "from-primary/30 to-primary/10", label: "Marathon 2025" },
    { g: "from-accent/30 to-accent/10", label: "Yoga Sessions" },
    { g: "from-primary/20 to-accent/20", label: "Health Camp" },
    { g: "from-accent/20 to-primary/10", label: "Diwali Fun Run" },
    { g: "from-primary/25 to-primary/5", label: "Team Training" },
    { g: "from-accent/25 to-primary/15", label: "Community Day" },
  ]

  return (
    <Carousel opts={{ align: "start", loop: true }} setApi={setApi} className="w-full">
      <CarouselContent className="-ml-3">
        {items.map((item, i) => (
          <CarouselItem key={i} className="pl-3 basis-1/2 sm:basis-1/3 lg:basis-1/4">
            <div
              className={`relative h-44 sm:h-52 rounded-xl bg-gradient-to-br ${item.g} flex flex-col items-center justify-center group cursor-pointer overflow-hidden`}
              onClick={() => setCurrentPage("gallery")}
            >
              <Camera className="w-8 h-8 text-primary/40" />
              <span className={`${lora.className} text-xs text-primary/60 mt-2`}>{item.label}</span>
              <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                <p className={`${lora.className} text-primary-foreground text-xs font-medium flex items-center gap-1`}>
                  <Camera className="w-3.5 h-3.5" /> View Gallery
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4" />
      <CarouselNext className="-right-4" />
    </Carousel>
  )
}

export default GalleryCarousel
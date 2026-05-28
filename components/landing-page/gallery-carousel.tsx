"use client"

import { useState, useEffect } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Camera } from "lucide-react"
import { lora } from "@/lib/fonts"
import { usePageNavigation } from "@/hooks/use-page-navigation"

interface GalleryImage {
  id: string
  path: string
  altText: string | null
  caption: string | null
}

const PLACEHOLDER_GRADIENTS = [
  "from-primary/30 to-primary/10",
  "from-accent/30 to-accent/10",
  "from-primary/20 to-accent/20",
  "from-accent/20 to-primary/10",
  "from-primary/25 to-primary/5",
  "from-accent/25 to-primary/15",
]

export default function GalleryCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = usePageNavigation()

  useEffect(() => {
    fetch("/api/gallery?limit=12")
      .then((r) => r.json())
      .then((data) => setImages(data.images ?? []))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!api) return
    const timer = setInterval(() => api.scrollNext(), 3000)
    return () => clearInterval(timer)
  }, [api])

  if (loading) {
    return (
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-40 sm:w-52 h-44 sm:h-52 rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    )
  }

  // If no images, fall back to placeholder tiles
  const items: Array<{ type: "image"; image: GalleryImage } | { type: "placeholder"; idx: number }> =
    images.length > 0
      ? images.map((img) => ({ type: "image" as const, image: img }))
      : PLACEHOLDER_GRADIENTS.map((_, idx) => ({ type: "placeholder" as const, idx }))

  return (
    <Carousel opts={{ align: "start", loop: true }} setApi={setApi} className="w-full">
      <CarouselContent className="-ml-3">
        {items.map((item, i) => (
          <CarouselItem key={i} className="pl-3 basis-1/2 sm:basis-1/3 lg:basis-1/4">
            {item.type === "image" ? (
              <div
                className="relative h-44 sm:h-52 rounded-xl overflow-hidden group cursor-pointer border border-border"
                onClick={() => navigate("gallery")}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image.path}
                  alt={item.image.altText ?? "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 rounded-xl">
                  <Camera className="w-5 h-5 text-primary-foreground" />
                  {item.image.caption && (
                    <p className={`${lora.className} text-primary-foreground text-xs font-medium px-3 text-center line-clamp-2`}>
                      {item.image.caption}
                    </p>
                  )}
                  {!item.image.caption && (
                    <p className={`${lora.className} text-primary-foreground text-xs font-medium`}>
                      View Gallery
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={`relative h-44 sm:h-52 rounded-xl bg-gradient-to-br ${PLACEHOLDER_GRADIENTS[item.idx]} flex flex-col items-center justify-center group cursor-pointer overflow-hidden`}
                onClick={() => navigate("gallery")}
              >
                <Camera className="w-8 h-8 text-primary/40" />
                <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                  <p className={`${lora.className} text-primary-foreground text-xs font-medium flex items-center gap-1`}>
                    <Camera className="w-3.5 h-3.5" /> View Gallery
                  </p>
                </div>
              </div>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4" />
      <CarouselNext className="-right-4" />
    </Carousel>
  )
}

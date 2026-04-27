"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bebas_Neue, Lora } from "next/font/google"
import { Camera, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

interface GalleryTag { id: string; name: string; slug: string }
interface GalleryImage {
  id: string
  path: string
  altText: string | null
  caption: string | null
  createdAt: string
  tags: { tag: GalleryTag }[]
}

function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [tags, setTags] = useState<GalleryTag[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTag, setActiveTag] = useState("all")
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetch("/api/gallery")
      .then(r => r.json())
      .then(data => {
        setImages(data.images ?? [])
        setTags(data.tags ?? [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = activeTag === "all"
    ? images
    : images.filter(im => im.tags.some(t => t.tag.slug === activeTag))

  const openLightbox = (id: string) => {
    const idx = filtered.findIndex(im => im.id === id)
    setActiveIndex(idx)
    setLightboxOpen(true)
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${bebasNeue.className} text-7xl sm:text-8xl tracking-wider text-foreground mb-10`}
        >
          OUR COMMUNITY<br /><span className="text-primary">IN ACTION</span>
        </motion.h1>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Tag filter tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
              {[{ id: "all", name: "All", slug: "all" }, ...tags].map(t => (
                <button
                  key={t.slug}
                  onClick={() => setActiveTag(t.slug)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    activeTag === t.slug
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <Camera className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className={`${lora.className} text-muted-foreground`}>No images yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((im, i) => (
                  <motion.div
                    key={im.id}
                    whileInView={{ opacity: 1, scale: 1 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="relative h-40 sm:h-52 rounded-xl bg-muted flex items-center justify-center group cursor-pointer overflow-hidden"
                    onClick={() => openLightbox(im.id)}
                  >
                    <img
                      src={im.path}
                      alt={im.altText ?? im.caption ?? "Gallery image"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {im.tags[0] && (
                      <Badge variant="outline" className="absolute top-2 left-2 text-xs border-primary/20 text-primary bg-background/80 z-10">
                        {im.tags[0].tag.name}
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <p className={`${lora.className} text-primary-foreground text-xs font-medium px-2 text-center`}>
                        {im.caption ?? im.altText ?? ""}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <div className="relative aspect-video bg-black">
            {filtered[activeIndex] && (
              <img
                src={filtered[activeIndex].path}
                alt={filtered[activeIndex].altText ?? ""}
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="p-4">
            <DialogHeader>
              <DialogTitle className={`${bebasNeue.className} tracking-wide text-xl`}>
                {filtered[activeIndex]?.caption ?? filtered[activeIndex]?.altText ?? "Photo"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-2">
                <Button size="icon" variant="outline" onClick={() => setActiveIndex(i => (i - 1 + filtered.length) % filtered.length)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="outline" onClick={() => setActiveIndex(i => (i + 1) % filtered.length)}>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {filtered[activeIndex]?.tags.map(t => (
                  <Badge key={t.tag.id} variant="outline" className="border-primary/20 text-primary text-xs">{t.tag.name}</Badge>
                ))}
                {filtered[activeIndex]?.createdAt && (
                  <span className={`${lora.className} text-xs text-muted-foreground ml-1`}>
                    {new Date(filtered[activeIndex].createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default GalleryPage
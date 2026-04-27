"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bebas_Neue, Lora } from "next/font/google"
import { Dumbbell, Calendar, MapPin, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import ShareButton from "@/components/share-button"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type ProgramCategory = "MARATHON" | "YOGA" | "CAMP" | "CORPORATE" | "FUN_RUN" | "OTHER"
type ProgramStatus = "UPCOMING" | "PAST" | "CANCELLED"

interface Program {
  id: string
  title: string
  slug: string | null
  excerpt: string | null
  content: string
  coverImagePath: string | null
  date: string | null
  location: string | null
  category: ProgramCategory
  status: ProgramStatus
}

const CAT_LABELS: Record<ProgramCategory, string> = {
  MARATHON: "Marathon",
  YOGA: "Yoga",
  CAMP: "Camp",
  CORPORATE: "Corporate",
  FUN_RUN: "Fun Run",
  OTHER: "Other",
}

function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const sentinelRef = useRef<HTMLDivElement>(null)

  const fetchPrograms = useCallback(async (cursor?: string) => {
    const url = `/api/programs${cursor ? `?cursor=${encodeURIComponent(cursor)}&limit=12` : "?limit=12"}`
    const res = await fetch(url)
    const data = await res.json()
    return { programs: data.programs ?? [], hasMore: data.hasMore ?? false, nextCursor: data.nextCursor ?? null }
  }, [])

  useEffect(() => {
    fetchPrograms().then(data => {
      setPrograms(data.programs)
      setHasMore(data.hasMore)
      setNextCursor(data.nextCursor)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [fetchPrograms])

  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return
    const obs = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || loadingMore || !hasMore) return
      setLoadingMore(true)
      try {
        const data = await fetchPrograms(nextCursor ?? undefined)
        setPrograms(prev => [...prev, ...data.programs])
        setHasMore(data.hasMore)
        setNextCursor(data.nextCursor)
      } finally {
        setLoadingMore(false)
      }
    }, { threshold: 0.1 })
    obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [hasMore, loadingMore, nextCursor, fetchPrograms])

  const filtered = programs.filter(p => {
    if (activeTab === "all") return true
    if (activeTab === "upcoming") return p.status === "UPCOMING"
    if (activeTab === "past") return p.status === "PAST"
    return p.category === activeTab.toUpperCase()
  })

  return (
    <div className="min-h-screen pt-20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${bebasNeue.className} text-7xl sm:text-8xl tracking-wider text-foreground mb-10`}
        >
          OUR PROGRAMS<br /><span className="text-primary">& EVENTS</span>
        </motion.h1>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-full overflow-hidden border-border">
                <Skeleton className="h-32 rounded-none rounded-t-xl" />
                <CardContent className="p-5 space-y-3">
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 flex-wrap h-auto gap-1">
              {[
                { label: "All", value: "all" },
                { label: "Upcoming", value: "upcoming" },
                { label: "Past", value: "past" },
                { label: "Marathons", value: "MARATHON" },
                { label: "Yoga", value: "YOGA" },
                { label: "Camps", value: "CAMP" },
                { label: "Corporate", value: "CORPORATE" },
              ].map(t => (
                <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab}>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <Dumbbell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className={`${lora.className} text-muted-foreground`}>No programs found.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((e, i) => (
                    <motion.div
                      key={e.id}
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 30 }}
                      transition={{ delay: i * 0.08 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -4 }}
                    >
                      <Card className="h-full overflow-hidden border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 group">
                        {e.coverImagePath ? (
                          <div className="h-40 overflow-hidden">
                            <img src={e.coverImagePath} alt={e.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                        ) : (
                          <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                            <Dumbbell className="w-10 h-10 text-primary/30" />
                          </div>
                        )}
                        <CardContent className="p-5 flex flex-col gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant={e.status === "UPCOMING" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {e.status === "UPCOMING" ? "Upcoming" : e.status === "CANCELLED" ? "Cancelled" : "Completed"}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-primary/20 text-primary">
                              {CAT_LABELS[e.category]}
                            </Badge>
                          </div>
                          <h3 className={`${lora.className} font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2`}>{e.title}</h3>
                          <div className={`${lora.className} text-xs text-muted-foreground space-y-1`}>
                            {e.date && (
                              <div className="flex gap-1 items-center">
                                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                                {new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                              </div>
                            )}
                            {e.location && (
                              <div className="flex gap-1 items-center">
                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                {e.location}
                              </div>
                            )}
                          </div>
                          {(e.excerpt || e.content) && (
                            <p className={`${lora.className} text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1`}>
                              {e.excerpt ?? e.content.replace(/<[^>]+>/g, "").substring(0, 150)}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
                            <Link href={`/programs/${e.slug ?? e.id}`} className="flex-1">
                              <Button
                                size="sm"
                                variant={e.status === "UPCOMING" ? "default" : "outline"}
                                className="w-full gap-1"
                              >
                                {e.status === "UPCOMING" ? "Learn More" : "View Recap"}
                              </Button>
                            </Link>
                            <ShareButton
                              title={e.title}
                              text={e.excerpt ?? e.title}
                              url={`https://run4health.in/programs/${e.slug ?? e.id}`}
                              coverImage={e.coverImagePath ?? undefined}
                              size="sm"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Infinite scroll sentinel */}
        {!loading && (
          <div ref={sentinelRef} className="mt-8 flex items-center justify-center min-h-[48px]">
            {loadingMore && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading more…
              </div>
            )}
            {!hasMore && programs.length > 0 && (
              <p className="text-sm text-muted-foreground">All programs loaded</p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default ProgramsPage
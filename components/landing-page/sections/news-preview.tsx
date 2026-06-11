"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, ArrowRight, ChevronRight } from "lucide-react"
import { bebasNeue, lora } from "@/lib/fonts"
import { useRouter } from "next/navigation"
import { usePageNavigation } from "@/hooks/use-page-navigation"

interface PostImage { path: string }
interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string
  coverImagePath: string | null
  publishedAt: string | null
  images: PostImage[]
}

const CAT_LABELS: Record<string, string> = {
  EVENT_RECAP: "Event Recap",
  HEALTH_TIPS: "Health Tips",
  COMMUNITY_STORY: "Community Story",
  ANNOUNCEMENT: "Announcement",
}

function formatDate(iso: string | null): string {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

export default function NewsPreview() {
  const navigate = usePageNavigation()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/posts?limit=3")
      .then((r) => r.json())
      .then((data) => setPosts(data.posts ?? []))
      .finally(() => setLoading(false))
  }, [])

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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card animate-pulse">
                <div className="h-36 bg-muted rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-muted rounded-full" />
                  <div className="h-4 w-full bg-muted rounded-full" />
                  <div className="h-3 w-16 bg-muted rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No news published yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 40 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <Card
                  className="h-full overflow-hidden border-border hover:border-primary/30 transition-all cursor-pointer"
                  onClick={() => router.push(`/news/${post.slug}`)}
                >
                  <div className="h-36 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                    {(() => {
                      const imgSrc = post.images[0]?.path || post.coverImagePath
                      return imgSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imgSrc}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Newspaper className="w-8 h-8 text-primary/40" />
                      )
                    })()}
                  </div>
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {CAT_LABELS[post.category] ?? post.category}
                    </Badge>
                    <h3 className={`${lora.className} font-semibold text-foreground text-sm leading-snug mb-2`}>
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className={`${lora.className} text-xs text-muted-foreground mb-2 line-clamp-2`}>
                        {post.excerpt}
                      </p>
                    )}
                    <p className={`${lora.className} text-xs text-muted-foreground mb-3`}>
                      {formatDate(post.publishedAt)}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="pl-0 text-primary text-xs gap-1"
                      onClick={(e) => { e.stopPropagation(); router.push(`/news/${post.slug}`) }}
                    >
                      Read More <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex sm:hidden mt-6 justify-center">
          <Button variant="outline" onClick={() => navigate("news")} className="gap-1 border-primary/30 text-primary">
            View All News <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}

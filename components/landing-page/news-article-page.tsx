"use client"

import { Bebas_Neue, Lora } from "next/font/google"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, User } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import ShareButton from "@/components/share-button"

const TipTapViewer = dynamic(() => import("@/components/editor/tiptap-viewer"), { ssr: false })

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type Category = "EVENT_RECAP" | "HEALTH_TIPS" | "COMMUNITY_STORY" | "ANNOUNCEMENT"

const CATEGORY_LABELS: Record<Category, string> = {
  EVENT_RECAP: "Event Recap",
  HEALTH_TIPS: "Health Tips",
  COMMUNITY_STORY: "Community Story",
  ANNOUNCEMENT: "Announcement",
}

const catColors: Record<Category, string> = {
  EVENT_RECAP: "bg-primary/10 text-primary border-primary/20",
  HEALTH_TIPS: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400",
  COMMUNITY_STORY: "bg-secondary text-secondary-foreground border-border",
  ANNOUNCEMENT: "bg-muted text-muted-foreground border-border",
}

interface PostImage { id: string; path: string; altText: string | null }
interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImagePath: string | null
  category: Category
  publishedAt: string | null
  images: PostImage[]
  member?: { firstName: string; lastName: string } | null
  admin?: { name: string } | null
}

export default function NewsArticlePage({ post }: { post: Post }) {
  const author = post.admin?.name ?? (post.member ? `${post.member.firstName} ${post.member.lastName}` : "Run4Health")

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative w-full h-64 sm:h-96 overflow-hidden bg-zinc-900">
        {post.coverImagePath ? (
          <img
            src={post.coverImagePath}
            alt={post.title}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <Badge variant="outline" className={`mb-3 border ${catColors[post.category]}`}>
            {CATEGORY_LABELS[post.category]}
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bebasNeue.className} text-3xl sm:text-5xl tracking-wide text-white leading-tight`}
          >
            {post.title}
          </motion.h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-border">
        <div className={`${lora.className} flex items-center gap-4 text-sm text-muted-foreground flex-wrap`}>
          <span className="flex items-center gap-1.5">
            <User className="w-4 h-4 text-primary" />
            {author}
          </span>
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost" className="gap-1.5 text-muted-foreground">
            <Link href="/news">
              <ArrowLeft className="w-4 h-4" />
              All News
            </Link>
          </Button>
          <ShareButton title={post.title} text={post.excerpt ?? post.title} coverImage={post.coverImagePath ?? undefined} />
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {post.excerpt && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${lora.className} text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-4 italic`}
          >
            {post.excerpt}
          </motion.p>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <TipTapViewer content={post.content} />
        </motion.div>

        {/* Additional images grid */}
        {post.images.length > 0 && (
          <>
            <Separator className="my-10" />
            <h2 className={`${bebasNeue.className} text-2xl tracking-wide mb-5`}>Photos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {post.images.map(img => (
                <div key={img.id} className="aspect-square rounded-xl overflow-hidden border border-border">
                  <img src={img.path} alt={img.altText ?? ""} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </>
        )}

        <Separator className="my-10" />

        {/* Footer CTA */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/news">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
          </Button>
          <ShareButton title={post.title} text={post.excerpt ?? post.title} coverImage={post.coverImagePath ?? undefined} size="default" />
        </div>
      </article>
    </main>
  )
}

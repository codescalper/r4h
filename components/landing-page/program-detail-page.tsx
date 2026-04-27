"use client"

import { Bebas_Neue, Lora } from "next/font/google"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, MapPin, Tag } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import ShareButton from "@/components/share-button"

const TipTapViewer = dynamic(() => import("@/components/editor/tiptap-viewer"), { ssr: false })

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type ProgramCategory = "MARATHON" | "YOGA" | "CAMP" | "CORPORATE" | "FUN_RUN" | "OTHER"
type ProgramStatus = "UPCOMING" | "PAST" | "CANCELLED"

const CAT_LABELS: Record<ProgramCategory, string> = {
  MARATHON: "Marathon", YOGA: "Yoga", CAMP: "Camp",
  CORPORATE: "Corporate", FUN_RUN: "Fun Run", OTHER: "Other",
}

interface Program {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImagePath: string | null
  date: string | null
  location: string | null
  category: ProgramCategory
  status: ProgramStatus
}

export default function ProgramDetailPage({ program }: { program: Program }) {
  const statusColor =
    program.status === "UPCOMING"
      ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400"
      : program.status === "CANCELLED"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"

  return (
    <main className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative w-full h-64 sm:h-96 overflow-hidden bg-zinc-900">
        {program.coverImagePath ? (
          <img
            src={program.coverImagePath}
            alt={program.title}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="outline" className={`border text-xs ${statusColor}`}>
              {program.status === "UPCOMING" ? "Upcoming" : program.status === "CANCELLED" ? "Cancelled" : "Past Event"}
            </Badge>
            <Badge variant="outline" className="border text-xs border-primary/30 text-primary bg-primary/10">
              <Tag className="w-3 h-3 mr-1" />{CAT_LABELS[program.category]}
            </Badge>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bebasNeue.className} text-3xl sm:text-5xl tracking-wide text-white leading-tight`}
          >
            {program.title}
          </motion.h1>
        </div>
      </div>

      {/* Meta bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3 border-b border-border">
        <div className={`${lora.className} flex items-center gap-4 text-sm text-muted-foreground flex-wrap`}>
          {program.date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date(program.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          )}
          {program.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" />
              {program.location}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="ghost" className="gap-1.5 text-muted-foreground">
            <Link href="/programs">
              <ArrowLeft className="w-4 h-4" />
              All Programs
            </Link>
          </Button>
          <ShareButton title={program.title} text={program.excerpt ?? program.title} coverImage={program.coverImagePath ?? undefined} />
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {program.excerpt && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${lora.className} text-lg text-muted-foreground leading-relaxed mb-8 border-l-4 border-primary pl-4 italic`}
          >
            {program.excerpt}
          </motion.p>
        )}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <TipTapViewer content={program.content} />
        </motion.div>

        <Separator className="my-10" />

        <div className="flex items-center justify-between flex-wrap gap-4">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/programs">
              <ArrowLeft className="w-4 h-4" />
              Back to Programs
            </Link>
          </Button>
          <ShareButton title={program.title} text={program.excerpt ?? program.title} coverImage={program.coverImagePath ?? undefined} size="default" />
        </div>
      </article>
    </main>
  )
}

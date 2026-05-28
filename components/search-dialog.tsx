"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, Newspaper, Dumbbell, Loader2, Clock, ArrowRight } from "lucide-react"
import { lora } from "@/lib/fonts"

// ─── Types ───────────────────────────────────────────────────────────────────

interface PostResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string
  publishedAt: string | null
  images: { path: string }[]
}

interface ProgramResult {
  id: string
  title: string
  slug: string
  excerpt: string | null
  category: string
  status: string
  date: string | null
}

interface SearchResults {
  posts: PostResult[]
  programs: ProgramResult[]
}

const CAT_LABELS: Record<string, string> = {
  EVENT_RECAP: "Event Recap",
  HEALTH_TIPS: "Health Tips",
  COMMUNITY_STORY: "Community Story",
  ANNOUNCEMENT: "Announcement",
  MARATHON: "Marathon",
  YOGA: "Yoga",
  CAMP: "Camp",
  CORPORATE: "Corporate",
  FUN_RUN: "Fun Run",
  OTHER: "Other",
}

function formatDate(iso: string | null): string {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

// ─── Search Dialog ───────────────────────────────────────────────────────────

export default function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const router = useRouter()

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 60)
    else { setQuery(""); setResults(null); setError(false) }
  }, [open])

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); setLoading(false); return }
    setLoading(true); setError(false)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      if (res.status === 429) { setError(true); setResults(null); return }
      const data = await res.json()
      setResults(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 2) { setResults(null); setLoading(false); return }
    setLoading(true)
    debounceRef.current = setTimeout(() => search(value), 320)
  }

  const navigate = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  const hasResults = results && (results.posts.length > 0 || results.programs.length > 0)
  const noResults = results && results.posts.length === 0 && results.programs.length === 0

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border bg-muted/50 text-muted-foreground text-xs hover:bg-muted hover:text-foreground hover:border-primary/30 transition-all"
        aria-label="Search"
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="hidden sm:inline">Search…</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium ml-1 opacity-60">
          ⌘K
        </kbd>
      </button>

      {/* Overlay + Dialog */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              key="dialog"
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="fixed top-[10vh] left-1/2 -translate-x-1/2 z-50 w-[min(90vw,620px)]"
            >
              <div className="rounded-2xl border border-border bg-background shadow-2xl overflow-hidden">
                {/* Search input bar */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
                  {loading ? (
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin flex-shrink-0" />
                  ) : (
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Search programs, news, articles…"
                    className={`${lora.className} flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none`}
                  />
                  {query && (
                    <button onClick={() => { setQuery(""); setResults(null); inputRef.current?.focus() }} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <kbd className="text-[10px] border border-border rounded px-1.5 py-0.5 text-muted-foreground bg-muted hidden sm:block">
                    ESC
                  </kbd>
                </div>

                {/* Results area */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {/* Empty state — before typing */}
                  {!query && (
                    <div className="px-4 py-10 text-center">
                      <Search className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                      <p className={`${lora.className} text-sm text-muted-foreground`}>
                        Type at least 2 characters to search across programs and news
                      </p>
                    </div>
                  )}

                  {/* Query too short */}
                  {query.length === 1 && (
                    <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                      Keep typing…
                    </div>
                  )}

                  {/* Rate limited */}
                  {error && (
                    <div className="px-4 py-6 text-center text-sm text-destructive">
                      Too many searches. Wait a moment and try again.
                    </div>
                  )}

                  {/* No results */}
                  {noResults && !loading && (
                    <div className="px-4 py-10 text-center">
                      <p className={`${lora.className} text-sm text-muted-foreground`}>
                        No results for <strong>&ldquo;{query}&rdquo;</strong>
                      </p>
                    </div>
                  )}

                  {/* Results */}
                  {hasResults && (
                    <div className="py-2">
                      {/* Posts */}
                      {results!.posts.length > 0 && (
                        <div>
                          <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Newspaper className="w-3.5 h-3.5" /> Articles
                          </p>
                          {results!.posts.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => navigate(`/news/${p.slug}`)}
                              className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors group"
                            >
                              <div className="w-9 h-9 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                {p.images[0] ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img src={p.images[0].path} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Newspaper className="w-4 h-4 text-muted-foreground/50" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`${lora.className} text-sm font-semibold text-foreground truncate leading-tight`}>{p.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-primary font-medium">{CAT_LABELS[p.category] ?? p.category}</span>
                                  {p.publishedAt && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{formatDate(p.publishedAt)}</span>}
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Programs */}
                      {results!.programs.length > 0 && (
                        <div>
                          <p className="px-4 pt-3 pb-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                            <Dumbbell className="w-3.5 h-3.5" /> Programs
                          </p>
                          {results!.programs.map((p) => (
                            <button
                              key={p.id}
                              onClick={() => navigate(`/programs/${p.slug}`)}
                              className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-muted/60 transition-colors group"
                            >
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Dumbbell className="w-4 h-4 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`${lora.className} text-sm font-semibold text-foreground truncate leading-tight`}>{p.title}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-primary font-medium">{CAT_LABELS[p.category] ?? p.category}</span>
                                  {p.date && <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{formatDate(p.date)}</span>}
                                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${p.status === 'UPCOMING' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{p.status}</span>
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

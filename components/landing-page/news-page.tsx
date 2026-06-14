"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bebas_Neue, Lora } from "next/font/google"
import { Newspaper, Lock, CheckCircle, X, ImagePlus, Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import axios from "axios"
import dynamic from "next/dynamic"
import { toast } from "sonner"

const TipTapEditor = dynamic(() => import("@/components/editor/tiptap-editor"), { ssr: false })

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type Category = "EVENT_RECAP" | "HEALTH_TIPS" | "COMMUNITY_STORY" | "ANNOUNCEMENT"
type PostStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED"

interface PostImage { id: string; path: string; altText: string | null }
interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImagePath: string | null
  category: Category
  status: PostStatus
  publishedAt: string | null
  images: PostImage[]
  member?: { firstName: string; lastName: string } | null
  admin?: { name: string } | null
}
interface Me { role: "admin" | "member" | null }

const CATEGORY_LABELS: Record<Category, string> = {
  EVENT_RECAP: "Event Recap",
  HEALTH_TIPS: "Health Tips",
  COMMUNITY_STORY: "Community Story",
  ANNOUNCEMENT: "Announcement",
}
const CATEGORY_VALUES: Category[] = ["EVENT_RECAP", "HEALTH_TIPS", "COMMUNITY_STORY", "ANNOUNCEMENT"]

const catColors: Record<Category, string> = {
  EVENT_RECAP: "bg-primary/10 text-primary border-primary/20",
  HEALTH_TIPS: "bg-green-500/10 text-green-700 border-green-500/20 dark:text-green-400",
  COMMUNITY_STORY: "bg-secondary text-secondary-foreground border-border",
  ANNOUNCEMENT: "bg-muted text-muted-foreground border-border",
}

interface UploadingFile {
  file: File
  previewUrl: string
  progress: number
  path: string | null
  error: boolean
}

// ─── Page ───────────────────────────────────────────────────────────────────
function NewsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const sentinelRef = useRef<HTMLDivElement>(null)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<Category>("ANNOUNCEMENT")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState<UploadingFile | null>(null)
  const [uploading, setUploading] = useState<UploadingFile[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const fetchPosts = useCallback(async (cursor?: string) => {
    const url = `/api/posts${cursor ? `?cursor=${encodeURIComponent(cursor)}&limit=12` : "?limit=12"}`
    const res = await fetch(url)
    const data = await res.json()
    return { posts: data.posts ?? [], hasMore: data.hasMore ?? false, nextCursor: data.nextCursor ?? null }
  }, [])

  useEffect(() => {
    Promise.all([
      fetchPosts(),
      fetch("/api/auth/me").then(r => r.json()),
    ]).then(([postsData, meData]) => {
      setPosts(postsData.posts)
      setHasMore(postsData.hasMore)
      setNextCursor(postsData.nextCursor)
      setMe(meData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [fetchPosts])

  // Infinite scroll: observe sentinel div
  useEffect(() => {
    if (!sentinelRef.current || !hasMore) return
    const obs = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting || loadingMore || !hasMore) return
      setLoadingMore(true)
      try {
        const data = await fetchPosts(nextCursor ?? undefined)
        setPosts(prev => [...prev, ...data.posts])
        setHasMore(data.hasMore)
        setNextCursor(data.nextCursor)
      } finally {
        setLoadingMore(false)
      }
    }, { threshold: 0.1 })
    obs.observe(sentinelRef.current)
    return () => obs.disconnect()
  }, [hasMore, loadingMore, nextCursor, fetchPosts])

  const filteredPosts = activeTab === "all"
    ? posts
    : posts.filter(p => p.category === activeTab.toUpperCase())

  const handleFiles = async (files: FileList) => {
    const arr = Array.from(files).slice(0, 10 - uploading.length)
    if (!arr.length) return
    const newItems: UploadingFile[] = arr.map(file => ({
      file, previewUrl: URL.createObjectURL(file), progress: 0, path: null, error: false,
    }))
    setUploading(prev => [...prev, ...newItems])
    for (const item of newItems) {
      const fd = new FormData()
      fd.append("files", item.file)
      try {
        const res = await axios.post<{ paths: string[] }>("/api/upload?folder=news", fd, {
          onUploadProgress(e) {
            if (!e.total) return
            const pct = Math.round((e.loaded * 100) / e.total)
            setUploading(prev => prev.map(u => u.previewUrl === item.previewUrl ? { ...u, progress: pct } : u))
          },
        })
        setUploading(prev => prev.map(u => u.previewUrl === item.previewUrl ? { ...u, path: res.data.paths[0], progress: 100 } : u))
      } catch {
        setUploading(prev => prev.map(u => u.previewUrl === item.previewUrl ? { ...u, error: true } : u))
      }
    }
  }

  const uploadCoverImage = async (file: File) => {
    const item: UploadingFile = { file, previewUrl: URL.createObjectURL(file), progress: 0, path: null, error: false }
    setCoverImage(item)
    const fd = new FormData()
    fd.append("files", file)
    try {
      const res = await axios.post<{ paths: string[] }>("/api/upload?folder=news", fd, {
        onUploadProgress(e) {
          if (!e.total) return
          const pct = Math.round((e.loaded * 100) / e.total)
          setCoverImage(prev => prev ? { ...prev, progress: pct } : prev)
        },
      })
      setCoverImage(prev => prev ? { ...prev, path: res.data.paths[0], progress: 100 } : prev)
    } catch {
      setCoverImage(prev => prev ? { ...prev, error: true } : prev)
    }
  }

  const removeUpload = (previewUrl: string) => {
    setUploading(prev => {
      const item = prev.find(u => u.previewUrl === previewUrl)
      if (item) URL.revokeObjectURL(item.previewUrl)
      return prev.filter(u => u.previewUrl !== previewUrl)
    })
  }

  const handleSubmit = async (draft = false) => {
    if (!title.trim() || !content.trim()) { setSubmitError("Title and content are required."); return }
    setSubmitError("")
    setSubmitting(true)
    try {
      const imagePaths = uploading.filter(u => u.path).map(u => u.path!)
      const coverImagePath = coverImage?.path ?? null
      await axios.post("/api/posts", { title, category, content, imagePaths, coverImagePath, status: draft ? "DRAFT" : undefined })
      toast.success("Story submitted for review!")
      setSubmitted(true)
    } catch {
      toast.error("Submission failed. Please try again.")
      setSubmitError("Submission failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const authorName = (p: Post) => {
    if (p.admin) return p.admin.name
    if (p.member) return `${p.member.firstName} ${p.member.lastName}`
    return "Run4Health"
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${bebasNeue.className} text-7xl sm:text-8xl tracking-wider text-foreground mb-10`}
        >
          NEWS &<br /><span className="text-primary">UPDATES</span>
        </motion.h1>

        {/* ── Articles ── */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-full overflow-hidden border-border">
                <Skeleton className="h-36 rounded-none rounded-t-xl" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <div className="flex justify-between pt-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 flex-wrap h-auto">
              {[
                { label: "All", value: "all" },
                { label: "Event Recap", value: "EVENT_RECAP" },
                { label: "Health Tips", value: "HEALTH_TIPS" },
                { label: "Community Story", value: "COMMUNITY_STORY" },
                { label: "Announcement", value: "ANNOUNCEMENT" },
              ].map(t => (
                <TabsTrigger key={t.value} value={t.value} className="text-xs sm:text-sm">{t.label}</TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={activeTab}>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-20">
                  <Newspaper className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className={`${lora.className} text-muted-foreground`}>No articles yet. Be the first to share your story!</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((a, i) => (
                    <motion.div
                      key={a.id}
                      whileInView={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 30 }}
                      transition={{ delay: i * 0.07 }}
                      viewport={{ once: true }}
                      whileHover={{ y: -4 }}
                    >
                      <Link href={`/news/${a.slug}`} className="block h-full group">
                        <Card className="h-full overflow-hidden border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                          {a.coverImagePath || a.images[0]?.path ? (
                            <div className="h-44 overflow-hidden">
                              <img
                                src={a.coverImagePath ?? a.images[0].path}
                                alt={a.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          ) : (
                            <div className="h-44 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
                              <Newspaper className="w-10 h-10 text-primary/30" />
                            </div>
                          )}
                          <CardContent className="p-5 flex flex-col gap-2">
                            <Badge variant="outline" className={`w-fit text-xs border ${catColors[a.category] || ""}`}>
                              {CATEGORY_LABELS[a.category]}
                            </Badge>
                            <h3 className={`${lora.className} font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2`}>
                              {a.title}
                            </h3>
                            <p className={`${lora.className} text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1`}>
                              {a.excerpt || a.content.replace(/<[^>]+>/g, "").substring(0, 150)}
                            </p>
                            <div className="flex items-center justify-between mt-1 pt-2 border-t border-border/50">
                              <p className={`${lora.className} text-xs text-muted-foreground`}>
                                {authorName(a)}
                                {a.publishedAt && ` · ${new Date(a.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                              </p>
                              <span className="text-primary text-xs font-medium group-hover:underline">Read →</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
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
            {!hasMore && posts.length > 0 && (
              <p className={`${lora.className} text-sm text-muted-foreground`}>You've seen all articles</p>
            )}
          </div>
        )}

        {/* ── Submit a Story (bottom) ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="border-primary/20 bg-primary/5 relative overflow-hidden">
            <CardHeader>
              <CardTitle className={`${bebasNeue.className} tracking-wide text-2xl`}>Submit a Story</CardTitle>
              <CardDescription className={lora.className}>
                Share your Run4Health experience — approved stories get published here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="flex items-center gap-3 py-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                  <p className={`${lora.className} text-primary font-medium`}>
                    Submitted for review! We'll notify you within 48 hours.
                  </p>
                </div>
              ) : me?.role ? (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input className="mt-1" placeholder="Your story title" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={category} onValueChange={v => setCategory(v as Category)}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORY_VALUES.map(c => <SelectItem key={c} value={c}>{CATEGORY_LABELS[c]}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* ── Cover Image ── */}
                  <div>
                    <Label className="mb-1.5 block">Cover Image</Label>
                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) uploadCoverImage(f); e.target.value = "" }} />
                    {coverImage ? (
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-border">
                        <img src={coverImage.previewUrl} alt="cover" className="w-full h-full object-cover" />
                        {coverImage.progress < 100 && !coverImage.error && (
                          <div className="absolute inset-0 bg-black/40 flex items-end">
                            <div className="w-full">
                              <div className="h-1 bg-black/30"><div className="h-full bg-primary transition-all" style={{ width: `${coverImage.progress}%` }} /></div>
                              <p className="text-white text-xs text-center py-1">{coverImage.progress}%</p>
                            </div>
                          </div>
                        )}
                        {coverImage.error && (
                          <div className="absolute inset-0 bg-destructive/50 flex items-center justify-center">
                            <p className="text-white text-xs font-medium">Upload failed</p>
                          </div>
                        )}
                        {coverImage.path && (
                          <div className="absolute top-2 left-2 bg-green-600/90 text-white text-xs px-2 py-0.5 rounded-full">✓ Uploaded</div>
                        )}
                        <button type="button" onClick={() => { if (coverImage) URL.revokeObjectURL(coverImage.previewUrl); setCoverImage(null) }}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => coverInputRef.current?.click()}
                        className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors gap-2 text-muted-foreground">
                        <ImagePlus className="w-6 h-6" />
                        <span className={`${lora.className} text-sm`}>Click to add a cover image</span>
                      </button>
                    )}
                  </div>
                  <div>
                    <Label className="mb-1 block">Content</Label>
                    <TipTapEditor content={content} onChange={setContent} folder="news" placeholder="Write your story here…" />
                  </div>
                  {/* Image uploads */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Additional Images ({uploading.length}/10)</Label>
                      {uploading.length < 10 && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                          <ImagePlus className="w-3.5 h-3.5" /> Add images
                        </button>
                      )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = "" }} />
                    {uploading.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <AnimatePresence>
                          {uploading.map(u => (
                            <motion.div key={u.previewUrl} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                              <img src={u.previewUrl} alt="" className="w-full h-full object-cover" />
                              {u.progress < 100 && !u.error && (
                                <div className="absolute inset-0 bg-black/50 flex items-end">
                                  <div className="w-full h-1 bg-black/30">
                                    <div className="h-full bg-primary transition-all" style={{ width: `${u.progress}%` }} />
                                  </div>
                                </div>
                              )}
                              {u.error && <div className="absolute inset-0 bg-destructive/50 flex items-center justify-center"><p className="text-white text-xs font-medium">Failed</p></div>}
                              <button type="button" onClick={() => removeUpload(u.previewUrl)} className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                  {submitError && <p className={`${lora.className} text-sm text-destructive`}>{submitError}</p>}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button onClick={() => handleSubmit(false)} disabled={submitting} className="gap-2">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Submit for Review
                    </Button>
                    <Button variant="outline" onClick={() => handleSubmit(true)} disabled={submitting}>Save as Draft</Button>
                    <Badge variant="outline" className="text-xs border-primary/20 text-muted-foreground">Reviewed before publishing</Badge>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden">
                  <div className="pointer-events-none select-none p-4 space-y-4 blur-sm opacity-50">
                    <div className="h-9 w-1/2 rounded-md bg-muted" />
                    <div className="h-9 w-1/3 rounded-md bg-muted" />
                    <div className="h-40 rounded-xl bg-muted" />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/10 backdrop-blur-[2px] rounded-xl p-6 text-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-md">
                      <Lock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className={`${bebasNeue.className} tracking-wide text-lg text-foreground`}>Members Only</p>
                      <p className={`${lora.className} text-sm text-muted-foreground mt-1`}>
                        Join Run4Health to submit your stories and health updates
                      </p>
                    </div>
                    <div className="flex gap-3 flex-wrap justify-center">
                      <Button asChild><Link href="/join">Join Now</Link></Button>
                      <Button variant="outline" asChild><Link href="/member/login">Member Login</Link></Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default NewsPage
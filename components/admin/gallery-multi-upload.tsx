"use client"

import { useRef, useState, useCallback, DragEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, ImagePlus, Tag, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"

export interface GalleryTag { id: string; name: string; slug: string }

type FileStatus = "idle" | "uploading" | "done" | "error"

interface PreviewFile {
  id: string
  file: File
  previewUrl: string
  status: FileStatus
  progress: number
}

interface Props {
  tags: GalleryTag[]
  onUploaded: () => void
  onNewTag: (tag: GalleryTag) => void
}

export default function GalleryMultiUpload({ tags, onUploaded, onNewTag }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagName, setNewTagName] = useState("")
  const [dragging, setDragging] = useState(false)
  const [globalAlt, setGlobalAlt] = useState("")
  const [globalCaption, setGlobalCaption] = useState("")
  const [uploading, setUploading] = useState(false)

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const next: PreviewFile[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 20)
      .map((f) => ({
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        status: "idle" as FileStatus,
        progress: 0,
      }))
    setPreviews((prev) => [...prev, ...next])
  }, [])

  const removePreview = useCallback((id: string) => {
    setPreviews((prev) => {
      const target = prev.find((x) => x.id === id)
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((x) => x.id !== id)
    })
  }, [])

  const clearAll = useCallback(() => {
    setPreviews((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.previewUrl))
      return []
    })
  }, [])

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  const toggleTag = (id: string) =>
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const createTag = async () => {
    if (!newTagName.trim()) return
    const res = await fetch("/api/admin/gallery/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTagName.trim() }),
    })
    const data = await res.json()
    if (data.tag) {
      onNewTag(data.tag)
      setNewTagName("")
    }
  }

  const uploadAll = async () => {
    const pending = previews.filter((p) => p.status === "idle")
    if (!pending.length) return

    setUploading(true)

    for (const p of pending) {
      setPreviews((prev) =>
        prev.map((x) => (x.id === p.id ? { ...x, status: "uploading", progress: 0 } : x))
      )
      try {
        const fd = new FormData()
        fd.append("files", p.file)
        const res = await axios.post<{ paths: string[] }>("/api/upload?folder=gallery", fd, {
          onUploadProgress(evt) {
            if (evt.total) {
              const pct = Math.round((evt.loaded * 100) / evt.total)
              setPreviews((prev) =>
                prev.map((x) => (x.id === p.id ? { ...x, progress: pct } : x))
              )
            }
          },
        })
        const path = res.data.paths[0]
        await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path,
            altText: globalAlt || null,
            caption: globalCaption || null,
            tagIds: selectedTags,
          }),
        })
        setPreviews((prev) =>
          prev.map((x) => (x.id === p.id ? { ...x, status: "done", progress: 100 } : x))
        )
      } catch {
        setPreviews((prev) =>
          prev.map((x) => (x.id === p.id ? { ...x, status: "error" } : x))
        )
      }
    }

    setUploading(false)
    onUploaded()

    // Auto-clear successfully uploaded previews after a short delay
    setTimeout(() => {
      setPreviews((prev) => {
        prev.filter((x) => x.status === "done").forEach((x) => URL.revokeObjectURL(x.previewUrl))
        return prev.filter((x) => x.status !== "done")
      })
    }, 1800)
  }

  const pendingCount = previews.filter((p) => p.status === "idle").length
  const doneCount = previews.filter((p) => p.status === "done").length

  return (
    <div className="space-y-5">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={[
          "relative rounded-2xl border-2 border-dashed cursor-pointer",
          "flex flex-col items-center justify-center gap-3 py-10 px-6",
          "transition-all duration-200",
          dragging
            ? "border-primary bg-primary/5 scale-[1.01] shadow-lg"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          uploading ? "pointer-events-none opacity-60" : "",
        ].join(" ")}
      >
        <motion.div
          animate={{ scale: dragging ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
            dragging ? "bg-primary/20" : "bg-muted"
          }`}
        >
          <ImagePlus
            className={`w-8 h-8 transition-colors ${dragging ? "text-primary" : "text-muted-foreground"}`}
          />
        </motion.div>

        <div className="text-center select-none">
          <p className="font-semibold text-sm text-foreground">
            {dragging ? "Drop your images here!" : "Drag & drop or click to select"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG, WEBP, GIF &mdash; up to 10 MB each &middot; max 20 at a time
          </p>
        </div>

        {previews.length > 0 && (
          <span className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            {previews.length} selected
          </span>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ""
        }}
      />

      {/* ─── Preview grid ───────────────────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout">
        {previews.length > 0 && (
          <motion.div
            key="preview-grid"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2"
          >
            {previews.map((p) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-muted"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.previewUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  draggable={false}
                />

                {/* Uploading overlay */}
                {p.status === "uploading" && (
                  <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1.5">
                    <div className="w-7 h-7 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span className="text-white text-[11px] font-semibold">{p.progress}%</span>
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20 rounded-b-xl">
                      <div
                        className="h-full bg-primary rounded-b-xl transition-all duration-150"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Done overlay */}
                {p.status === "done" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-primary/70 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-8 h-8 text-white drop-shadow" />
                  </motion.div>
                )}

                {/* Error overlay */}
                {p.status === "error" && (
                  <div className="absolute inset-0 bg-destructive/65 flex flex-col items-center justify-center gap-1">
                    <AlertCircle className="w-7 h-7 text-white" />
                    <span className="text-white text-[10px] font-medium">Failed</span>
                  </div>
                )}

                {/* File name tooltip on hover */}
                {p.status === "idle" && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-white text-[10px] truncate leading-none">{p.file.name}</p>
                  </div>
                )}

                {/* Remove button */}
                {p.status !== "uploading" && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removePreview(p.id) }}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Shared metadata ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Alt text <span className="text-muted-foreground/60">(applied to all)</span>
          </Label>
          <Input
            value={globalAlt}
            onChange={(e) => setGlobalAlt(e.target.value)}
            placeholder="e.g. Marathon 2025 participants"
            className="h-9 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">
            Caption <span className="text-muted-foreground/60">(applied to all)</span>
          </Label>
          <Input
            value={globalCaption}
            onChange={(e) => setGlobalCaption(e.target.value)}
            placeholder="Visible caption below image"
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* ─── Tags ───────────────────────────────────────────────────────────────── */}
      <div>
        <Label className="text-xs text-muted-foreground mb-2 block">Tags</Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTag(t.id)}
              className={[
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border transition-all duration-150",
                selectedTags.includes(t.id)
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              <Tag className="w-3 h-3" />
              {t.name}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Create new tag…"
            className="h-8 text-xs"
            onKeyDown={(e) => e.key === "Enter" && createTag()}
          />
          <Button size="sm" variant="outline" onClick={createTag} className="h-8 text-xs shrink-0 px-3">
            + Add
          </Button>
        </div>
      </div>

      {/* ─── Upload action bar ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="flex flex-wrap items-center gap-3 pt-1"
          >
            <Button
              onClick={uploadAll}
              disabled={uploading || pendingCount === 0}
              className="gap-2 min-w-[160px]"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {pendingCount} Image{pendingCount !== 1 ? "s" : ""}
                </>
              )}
            </Button>

            {!uploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-muted-foreground text-xs h-8"
              >
                Clear all
              </Button>
            )}

            {doneCount > 0 && (
              <span className="text-xs text-primary font-medium flex items-center gap-1.5 ml-auto">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {doneCount} uploaded
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

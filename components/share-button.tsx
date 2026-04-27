"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareButtonProps {
  title: string
  text?: string
  url?: string
  /** Cover image URL — if provided, the image is included in the native share sheet */
  coverImage?: string
  className?: string
  size?: "sm" | "default" | "lg"
}

function copyToClipboard(text: string): void {
  if (typeof window === "undefined") return
  try {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => execCopy(text))
    } else {
      execCopy(text)
    }
  } catch {
    execCopy(text)
  }
}

function execCopy(text: string) {
  const ta = document.createElement("textarea")
  ta.value = text
  ta.style.cssText = "position:fixed;opacity:0;pointer-events:none;"
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  try { document.execCommand("copy") } catch { /* ignore */ }
  document.body.removeChild(ta)
}

export default function ShareButton({ title, text, url, coverImage, className, size = "sm" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "")
    const shareText = text ?? title

    if (typeof navigator !== "undefined" && navigator.share) {
      // Try sharing with the cover image as a file so it appears as thumbnail
      if (coverImage && typeof navigator.canShare === "function") {
        try {
          const res = await fetch(coverImage)
          const blob = await res.blob()
          const ext = blob.type.includes("png") ? "png" : blob.type.includes("gif") ? "gif" : "jpg"
          const file = new File([blob], `cover.${ext}`, { type: blob.type })
          const dataWithFile = { title, text: shareText, url: shareUrl, files: [file] }
          if (navigator.canShare(dataWithFile)) {
            await navigator.share(dataWithFile)
            return
          }
        } catch (err) {
          if ((err as Error).name === "AbortError") return  // user cancelled
          // image fetch failed — fall through to share without image
        }
      }

      // Share without image
      try {
        await navigator.share({ title, text: shareText, url: shareUrl })
        return
      } catch (err) {
        if ((err as Error).name === "AbortError") return  // user cancelled — don't copy
        // Other error — fall through to clipboard
      }
    }

    // Clipboard fallback (desktop / unsupported browsers)
    copyToClipboard(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      type="button"
      size={size}
      variant="outline"
      onClick={handleShare}
      className={`gap-2 ${className ?? ""}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-green-600" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          Share
        </>
      )}
    </Button>
  )
}

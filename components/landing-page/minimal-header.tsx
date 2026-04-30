import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface MinimalHeaderProps {
  title: string
  backHref?: string
  backLabel?: string
}

/**
 * Slim sticky top bar for focused pages (e.g. Donate, Join).
 * Shows a back link on the left and a page title on the right.
 */
export default function MinimalHeader({
  title,
  backHref = "/",
  backLabel = "Back to Home",
}: MinimalHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
      <Link
        href={backHref}
        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
        {backLabel}
      </Link>
      <span className="text-border" aria-hidden="true">|</span>
      <span className="text-sm font-semibold text-foreground">{title}</span>
    </div>
  )
}

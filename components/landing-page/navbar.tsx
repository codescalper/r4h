"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bebas_Neue, Lora } from "next/font/google"
import { Menu } from "lucide-react"
import ThemeToggle from "./theme-toggle"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

const links: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "News", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
]

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-border bg-card flex items-center justify-center">
            <Image src="/logo.png" alt="Run4Health" width={36} height={36} className="object-contain" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${lora.className} text-sm font-medium transition-colors hover:text-primary ${
                isActive(l.href) ? "text-primary font-semibold" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          <Link href="/member/login" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-2 py-1">
            Member Login
          </Link>
          <Link href="/join">
            <Button size="sm" className="gap-1">Join Now</Button>
          </Link>
          <Link href="/donate">
            <Button size="sm" variant="outline" className="gap-1 border-primary text-primary hover:bg-primary/10">Donate</Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden items-center gap-1">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(85vw,22rem)] p-0 flex flex-col">
              {/* Sheet header */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-border bg-card flex items-center justify-center shrink-0">
                  <Image src="/logo.png" alt="Run4Health" width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <SheetTitle className={`${bebasNeue.className} tracking-wider text-base text-foreground leading-none`}>Run4Health</SheetTitle>
                  <p className={`${lora.className} text-xs text-muted-foreground`}>Fitness First</p>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col px-3 py-4 flex-1">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`${lora.className} flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive(l.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {isActive(l.href) && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                    {l.label}
                  </Link>
                ))}
              </nav>

              {/* CTA buttons */}
              <div className="flex flex-col gap-3 px-5 pb-8 pt-4 border-t border-border">
                <Link href="/join" className="block">
                  <Button className="w-full gap-2">Join Now</Button>
                </Link>
                <Link href="/donate" className="block">
                  <Button variant="outline" className="w-full gap-2 border-primary text-primary hover:bg-primary/10">Donate</Button>
                </Link>
                <Link href="/member/login" className="text-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2">
                  Already a member? Log in →
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar
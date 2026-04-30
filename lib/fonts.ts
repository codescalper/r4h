// ─── Centralized Font Instances ───────────────────────────────────────────────
// Import from here in all components instead of re-instantiating each time.
// These are applied as CSS variables in app/layout.tsx.

import { Bebas_Neue, Geist_Mono, Lora } from "next/font/google"

export const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--bebas",
})

export const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--lora",
})

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

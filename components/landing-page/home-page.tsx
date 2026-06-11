// ─── home-page.tsx ────────────────────────────────────────────────────────────
// Thin composition layer. Each visual section lives in components/landing-page/sections/.
// Add/remove/reorder sections here without touching individual section files.
"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"

import IntroSplash from "./sections/intro-splash"
import HeroSection from "./sections/hero-section"
import AboutPreview from "./sections/about-preview"
import ProgramsPreview from "./sections/programs-preview"
import StatsBar from "./sections/stats-bar"
import TestimonialsSection from "./sections/testimonials-section"
import MembersSection from "./sections/members-section"
import NewsPreview from "./sections/news-preview"
import GalleryPreview from "./sections/gallery-preview"

const SPLASH_KEY = "r4h_splash_date"

export default function HomePage() {
  const [splashVisible, setSplashVisible] = useState(false)

  useEffect(() => {
    const today = new Date().toDateString()
    if (localStorage.getItem(SPLASH_KEY) !== today) {
      setSplashVisible(true)
      localStorage.setItem(SPLASH_KEY, today)
      const timer = setTimeout(() => setSplashVisible(false), 2800)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <>
      <AnimatePresence>{splashVisible && <IntroSplash />}</AnimatePresence>
      <div className="min-h-screen">
        <HeroSection />
        <AboutPreview />
        <ProgramsPreview />
        <StatsBar />
        <TestimonialsSection />
        <MembersSection />
        <NewsPreview />
        <GalleryPreview />
      </div>
    </>
  )
}

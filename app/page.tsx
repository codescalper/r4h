"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/landing-page/navbar"
import Footer from "@/components/landing-page/footer"
import HomePage from "@/components/landing-page/home-page"
import AboutPage from "@/components/landing-page/about-page"
import ProgramsPage from "@/components/landing-page/programs-page"
import NewsPage from "@/components/landing-page/news-page"
import RegisterPage from "@/components/landing-page/register-page"
import DonatePage from "@/components/landing-page/donate-page"
import GalleryPage from "@/components/landing-page/gallery-page"
import ContactPage from "@/components/landing-page/contact-page"

type PageKey = "home" | "about" | "programs" | "news" | "register" | "donate" | "gallery" | "contact"

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setCurrentPage={setCurrentPage} />
      case "about": return <AboutPage setCurrentPage={setCurrentPage} />
      case "programs": return <ProgramsPage setCurrentPage={setCurrentPage} />
      case "news": return <NewsPage />
      case "register": return <RegisterPage setCurrentPage={setCurrentPage} />
      case "donate": return <DonatePage setCurrentPage={setCurrentPage} />
      case "gallery": return <GalleryPage />
      case "contact": return <ContactPage />
      default: return <HomePage setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25 }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  )
}

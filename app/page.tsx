"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bebas_Neue, Lora } from "next/font/google"
import Navbar from "@/components/landing-page/navbar"
import Footer from "@/components/landing-page/footer"
import HomePage from "@/components/landing-page/home-page"
import AboutPage from "@/components/landing-page/about-page"
import ProgramsPage from "@/components/landing-page/programs-page"
import NewsPage from "@/components/landing-page/news-page"
import RegisterPage from "@/components/landing-page/register-page"
import DashboardPage from "@/components/landing-page/dashboard-page"
import DonatePage from "@/components/landing-page/donate-page"
import GalleryPage from "@/components/landing-page/gallery-page"
import ContactPage from "@/components/landing-page/contact-page"
import AdminPage from "@/components/landing-page/admin-page"

const bebasNeue = Bebas_Neue({ subsets: ["latin"], weight: ["400"] })
const lora = Lora({ subsets: ["latin"], weight: ["400", "500", "600"] })

type PageKey = "home" | "about" | "programs" | "news" | "register" | "dashboard" | "donate" | "gallery" | "contact" | "admin"

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("home")

  const renderPage = () => {
    switch (currentPage) {
      case "home": return <HomePage setCurrentPage={setCurrentPage} />
      case "about": return <AboutPage setCurrentPage={setCurrentPage} />
      case "programs": return <ProgramsPage setCurrentPage={setCurrentPage} />
      case "news": return <NewsPage />
      case "register": return <RegisterPage setCurrentPage={setCurrentPage} />
      case "dashboard": return <DashboardPage />
      case "donate": return <DonatePage setCurrentPage={setCurrentPage} />
      case "gallery": return <GalleryPage />
      case "contact": return <ContactPage />
      case "admin": return <AdminPage />
      default: return <HomePage setCurrentPage={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentPage !== "dashboard" && currentPage !== "admin" && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      )}
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
      {currentPage !== "dashboard" && currentPage !== "admin" && (
        <Footer setCurrentPage={setCurrentPage} />
      )}
    </div>
  )
}

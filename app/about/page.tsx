"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Navbar from "@/components/landing-page/navbar"
import Footer from "@/components/landing-page/footer"
import AboutPage from "@/components/landing-page/about-page"

const pageRoutes: Record<string, string> = {
  home: "/", about: "/about", programs: "/programs",
  news: "/news", register: "/join", donate: "/donate",
  gallery: "/gallery", contact: "/contact",
}

export default function About() {
  const router = useRouter()
  const setCurrentPage = (p: string) => router.push(pageRoutes[p] ?? "/")

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <AboutPage setCurrentPage={setCurrentPage} />
      </motion.div>
      <Footer />
    </div>
  )
}

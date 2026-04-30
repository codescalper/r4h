"use client"

import { motion } from "framer-motion"
import Navbar from "@/components/landing-page/navbar"
import Footer from "@/components/landing-page/footer"

interface PageWrapperProps {
  children: React.ReactNode
}

/**
 * Shared page shell: Navbar + fade-in animation + Footer.
 * Use this in every public-facing page to avoid repeating the same structure.
 */
export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {children}
      </motion.div>
      <Footer />
    </div>
  )
}

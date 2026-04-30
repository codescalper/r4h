"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Dumbbell, Heart, Zap, Wind } from "lucide-react"
import { bebasNeue, lora } from "@/lib/fonts"

// Shown once per day — animates in and exits after ~2.8s
export default function IntroSplash() {
  const icons = [
    { icon: <Dumbbell className="w-4 h-4" />, label: "TRAIN" },
    { icon: <Heart className="w-4 h-4" />, label: "CARE" },
    { icon: <Zap className="w-4 h-4" />, label: "PUSH" },
    { icon: <Wind className="w-4 h-4" />, label: "RUN" },
  ]

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--foreground)" }}
      exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
    >
      {/* Speed lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              background: "var(--primary)",
              opacity: 0.04 + i * 0.013,
              top: `${8 + i * 10}%`,
              left: "-20%",
              right: "-20%",
              height: "1px",
              transform: "rotate(-7deg)",
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.05 + i * 0.06, duration: 0.65, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Corner glows */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle at 100% 0%, var(--primary), transparent 55%)", opacity: 0.14 }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-72 pointer-events-none"
        style={{ background: "radial-gradient(circle at 0% 100%, var(--primary), transparent 60%)", opacity: 0.09 }}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.34, 1.4, 0.64, 1] }}
        >
          <div
            className="rounded-2xl px-8 py-5 mb-7"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
            }}
          >
            <Image src="/logo.png" alt="Run4Health" width={210} height={64} className="object-contain" priority />
          </div>
        </motion.div>

        {/* Title */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className={`${bebasNeue.className} text-[clamp(3rem,10vw,6rem)] leading-none tracking-widest`}
            style={{ color: "var(--background)" }}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            RUN FOR <span style={{ color: "var(--primary)" }}>HEALTH</span>
          </motion.h1>
        </div>

        {/* Tagline */}
        <motion.p
          className={`${lora.className} text-xs sm:text-sm uppercase tracking-[0.3em]`}
          style={{ color: "rgba(255,255,255,0.35)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Move &bull; Thrive &bull; Repeat
        </motion.p>

        {/* Icon grid */}
        <motion.div
          className="flex items-center gap-3 sm:gap-5 mt-9"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          {icons.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  color: "var(--primary)",
                  border: "1px solid rgba(255,255,255,0.09)",
                }}
              >
                {icon}
              </div>
              <span
                className={`${bebasNeue.className} text-[9px] tracking-[0.2em]`}
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2">
        <div
          className="w-48 sm:w-60 h-[2px] rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--primary)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.25, duration: 2.7, ease: "easeInOut" }}
          />
        </div>
        <motion.p
          className={`${lora.className} text-[9px] tracking-[0.22em] uppercase`}
          style={{ color: "rgba(255,255,255,0.18)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Loading your fitness journey
        </motion.p>
      </div>
    </motion.div>
  )
}

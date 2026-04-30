"use client"

import { bebasNeue, lora } from "@/lib/fonts"
import useCountUp from "@/components/landing-page/use-count-up"

const STATS = [
  { label: "Members", value: 2400, suffix: "+" },
  { label: "Events", value: 150, suffix: "+" },
  { label: "₹ Raised (L)", value: 12, suffix: "L+" },
  { label: "Years Active", value: 8, suffix: "" },
]

function StatItem({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  const { count, ref } = useCountUp(value)
  return (
    <div ref={ref} className="text-center">
      <p className={`${bebasNeue.className} text-4xl sm:text-5xl tracking-wider`}>
        {count}{suffix}
      </p>
      <p className={`${lora.className} text-xs sm:text-sm opacity-80 mt-1`}>{label}</p>
    </div>
  )
}

export default function StatsBar() {
  return (
    <section className="bg-primary py-10 sm:py-12 text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {STATS.map((s) => (
          <StatItem key={s.label} {...s} />
        ))}
      </div>
    </section>
  )
}

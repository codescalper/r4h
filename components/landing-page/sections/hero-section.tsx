"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
  TrendingUp,
  Timer,
  Users,
  ChevronRight,
} from "lucide-react";
import { bebasNeue, lora } from "@/lib/fonts";
import { usePageNavigation } from "@/hooks/use-page-navigation";

const METRICS = [
  {
    label: "Avg Pace",
    value: "5:42",
    unit: "min/km",
    icon: <Timer className="w-4 h-4" />,
    pct: 78,
  },
  {
    label: "Active Members",
    value: "50",
    unit: "runners",
    icon: <Users className="w-4 h-4" />,
    pct: 92,
  },
  {
    label: "Weekly Distance",
    value: "12.4",
    unit: "km avg",
    icon: <TrendingUp className="w-4 h-4" />,
    pct: 62,
  },
];

const STAT_PILLS = ["50+ Members", "150+ Events", "₹50k+ Raised"];

export default function HeroSection() {
  const navigate = usePageNavigation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--primary) 0%, transparent 45%)",
            opacity: 0.07,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 85% 40%, var(--accent), transparent 55%)",
            opacity: 0.06,
          }}
        />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute pointer-events-none"
            style={{
              background: "var(--primary)",
              opacity: 0.028 + i * 0.01,
              top: `${15 + i * 16}%`,
              left: "-30%",
              right: "-30%",
              height: "1.5px",
              transform: "rotate(-11deg)",
            }}
          />
        ))}
        <div
          className="absolute -right-36 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ border: "1px solid var(--primary)", opacity: 0.06 }}
        />
        <div
          className="absolute -right-52 top-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
          style={{ border: "1px solid var(--primary)", opacity: 0.03 }}
        />
        <div
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{
            backgroundColor: "var(--primary)",
            opacity: 0.04,
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-10 lg:gap-14 items-center pt-28 pb-16 sm:pt-32 sm:pb-20">
        {/* Left: Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="inline-flex items-center gap-2 mb-5 bg-primary text-primary-foreground rounded-full px-4 py-1.5 text-xs font-semibold shadow-sm">
              <TrendingUp className="w-3 h-3" /> Thane&apos;s #1 Fitness
              Community
            </div>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h1
              className={`${bebasNeue.className} text-[clamp(4rem,13vw,8.5rem)] leading-none tracking-wider text-foreground`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.2,
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              RUN FOR
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className={`${bebasNeue.className} text-[clamp(4rem,13vw,8.5rem)] leading-none tracking-wider text-primary`}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              HEALTH
            </motion.h1>
          </div>

          <motion.p
            className={`${lora.className} text-base sm:text-lg text-muted-foreground mt-5 max-w-md leading-relaxed`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            A community movement transforming lives through fitness, one stride
            at a time.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 mt-7"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Button
              size="lg"
              onClick={() => navigate("register")}
              className="gap-2 text-sm sm:text-base px-6 shadow-lg"
            >
              Join Now <ArrowRight className="w-4 h-4" />
            </Button>
            {/* Donate Now button hidden
            <Button size="lg" variant="outline" onClick={() => navigate("donate")} className="gap-2 text-sm sm:text-base px-6 border-primary text-primary hover:bg-primary/10">
              <Heart className="w-4 h-4" /> Donate Now
            </Button>
            */}
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-2 mt-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {STAT_PILLS.map((s) => (
              <span
                key={s}
                className={`${lora.className} text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1.5 font-medium`}
              >
                {s}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right: Fitness Dashboard Panel */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-full max-w-sm">
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                backgroundColor: "var(--primary)",
                opacity: 0.12,
                filter: "blur(48px)",
                transform: "scale(1.1)",
              }}
            />
            <div className="relative bg-card/90 backdrop-blur-md border border-border rounded-3xl p-7 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <Image
                  src="/logo.png"
                  alt="Run4Health"
                  width={130}
                  height={38}
                  className="object-contain"
                />
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span
                    className={`${lora.className} text-[10px] text-primary font-semibold tracking-widest uppercase`}
                  >
                    Live
                  </span>
                </div>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                {METRICS.map((m, i) => (
                  <div key={m.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          {m.icon}
                        </div>
                        <div>
                          <p
                            className={`${lora.className} text-[11px] text-muted-foreground leading-none mb-0.5`}
                          >
                            {m.label}
                          </p>
                          <p
                            className={`${bebasNeue.className} text-xl tracking-wider text-foreground leading-none`}
                          >
                            {m.value}{" "}
                            <span
                              className={`${lora.className} text-xs text-muted-foreground font-normal tracking-normal`}
                            >
                              {m.unit}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`${bebasNeue.className} text-sm text-primary`}
                      >
                        {m.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${m.pct}%` }}
                        transition={{
                          delay: 0.7 + i * 0.15,
                          duration: 1.1,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Community pulse SVG */}
              <div className="border-t border-border pt-4">
                <p
                  className={`${lora.className} text-[10px] text-muted-foreground mb-2 uppercase tracking-[0.2em]`}
                >
                  Community Pulse
                </p>
                <svg
                  viewBox="0 0 200 36"
                  className="w-full h-8"
                  fill="none"
                  style={{ color: "var(--primary)" }}
                >
                  <motion.path
                    d="M0,18 L28,18 L42,5 L52,31 L62,9 L72,25 L85,18 L115,18 L129,5 L139,31 L149,9 L159,25 L172,18 L200,18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      delay: 1.1,
                      duration: 1.6,
                      ease: "easeInOut",
                    }}
                  />
                </svg>
              </div>

              <Button
                size="sm"
                className="w-full gap-2 shadow-md"
                onClick={() => navigate("register")}
              >
                Join the Community <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <ChevronRight className="w-6 h-6 rotate-90" />
      </motion.div>
    </section>
  );
}

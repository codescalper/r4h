import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Programs & Events",
  description:
    "Explore Run4Health programs — marathon training, yoga sessions, health awareness camps, corporate wellness and fun runs across Thane and Mumbai. Register for upcoming events.",
  keywords: [
    "Run4Health programs",
    "marathon training Thane",
    "yoga sessions Thane",
    "health awareness camp Mumbai",
    "corporate wellness Thane",
    "fun run Thane",
    "half marathon training",
    "running events Mumbai",
  ],
  alternates: { canonical: "https://run4health.in/programs" },
  openGraph: {
    title: "Run4Health Programs — Marathon, Yoga & Wellness Events",
    description:
      "Join Run4Health's structured fitness programs — half marathon training, Sunday yoga, health camps and corporate wellness days in Thane and Mumbai.",
    url: "https://run4health.in/programs",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Run4Health Programs" }],
  },
  twitter: {
    title: "Run4Health Programs — Marathon, Yoga & Wellness Events",
    description:
      "Join half marathon training, yoga, health camps and more. Register for upcoming Run4Health events.",
  },
}

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

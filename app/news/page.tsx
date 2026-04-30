import type { Metadata } from "next"
import PageWrapper from "@/components/landing-page/page-wrapper"
import NewsPage from "@/components/landing-page/news-page"

export const metadata: Metadata = {
  title: "News & Stories",
  description:
    "Stay updated with the latest Run4Health news — event recaps, community stories, marathon results, health tips and fitness inspiration from Thane's running community.",
  keywords: [
    "Run4Health news",
    "running community blog Thane",
    "marathon event recap",
    "health tips running",
    "community fitness stories",
    "Thane marathon results",
  ],
  alternates: { canonical: "https://run4health.in/news" },
  openGraph: {
    title: "Run4Health News — Events, Stories & Health Tips",
    description:
      "Latest from Run4Health — marathon event recaps, community stories, runner spotlights and health tips from Thane's fitness community.",
    url: "https://run4health.in/news",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Run4Health News" }],
  },
  twitter: {
    title: "Run4Health News — Events, Stories & Health Tips",
    description: "Latest marathon recaps, community stories and health tips from Run4Health.",
  },
}

export default function News() {
  return (
    <PageWrapper>
      <NewsPage />
    </PageWrapper>
  )
}

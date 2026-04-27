import type { Metadata } from "next"
import Navbar from "@/components/landing-page/navbar"
import Footer from "@/components/landing-page/footer"
import GalleryPage from "@/components/landing-page/gallery-page"

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos from Run4Health events — marathons, yoga camps, fun runs and community gatherings across Thane and Mumbai. See our community in action.",
  alternates: { canonical: "https://run4health.in/gallery" },
  openGraph: {
    title: "Run4Health Gallery — Community Events & Marathons",
    description:
      "Photos from Run4Health marathons, yoga sessions, health camps and community events across Thane and Mumbai.",
    url: "https://run4health.in/gallery",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Run4Health Gallery" }],
  },
  twitter: {
    title: "Run4Health Gallery — Community Events & Marathons",
    description: "Photos from marathons, yoga sessions and community fitness events by Run4Health.",
  },
}

export default function Gallery() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <GalleryPage />
      <Footer />
    </div>
  )
}

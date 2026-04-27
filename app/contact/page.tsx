import type { Metadata } from "next"
import Navbar from "@/components/landing-page/navbar"
import Footer from "@/components/landing-page/footer"
import ContactPage from "@/components/landing-page/contact-page"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Run4Health. Find us at our community center in Thane West, call us or send an email. We'd love to hear from you.",
  alternates: { canonical: "https://run4health.in/contact" },
  openGraph: {
    title: "Contact Run4Health — Thane's Fitness Community",
    description:
      "Reach out to Run4Health. Located in Thane West, Maharashtra. Contact us for memberships, events and partnerships.",
    url: "https://run4health.in/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact Run4Health" }],
  },
  twitter: {
    title: "Contact Run4Health — Thane's Fitness Community",
    description: "Get in touch with Run4Health in Thane West, Maharashtra.",
  },
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <ContactPage />
      <Footer />
    </div>
  )
}

import type { Metadata } from "next";
import MinimalHeader from "@/components/landing-page/minimal-header";
import DonatePage from "@/components/landing-page/donate-page";

export const metadata: Metadata = {
  title: "Donate to Run4Health",
  description:
    "Support Run4Health's mission to build healthier communities in Thane. Your donation funds health camps, running kits and community events for 50+ members.",
  keywords: [
    "donate Run4Health",
    "fitness community donation",
    "support running club Thane",
    "NGO fitness donation India",
  ],
  alternates: { canonical: "https://run4health.in/donate" },
  openGraph: {
    title: "Donate to Run4Health — Support Thane's Fitness Community",
    description:
      "Your contribution directly funds health camps, running kits and community events across Thane and Mumbai.",
    url: "https://run4health.in/donate",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Donate to Run4Health",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Donate to Run4Health",
    description:
      "Support health camps, running kits and community events across Thane and Mumbai.",
  },
};

export default function DonateRoutePage() {
  return (
    <div className="min-h-screen bg-background">
      <MinimalHeader title="Donate to Run4Health" />
      <DonatePage />
    </div>
  );
}

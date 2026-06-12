import type { Metadata } from "next";
import MinimalHeader from "@/components/landing-page/minimal-header";
import RegisterPage from "@/components/landing-page/register-page";

export const metadata: Metadata = {
  title: "Join Run4Health — Become a Member",
  description:
    "Join Thane's largest fitness community. Register for Run4Health membership and get access to marathon training, yoga sessions, health camps and community runs.",
  keywords: [
    "join Run4Health",
    "running club membership Thane",
    "fitness community registration",
    "marathon training membership",
    "running group Mumbai",
  ],
  alternates: { canonical: "https://run4health.in/join" },
  openGraph: {
    title: "Join Run4Health — Become a Member",
    description:
      "Join 50+ runners and fitness enthusiasts. Register for Run4Health membership in Thane and get access to all programs and events.",
    url: "https://run4health.in/join",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Join Run4Health",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Join Run4Health — Become a Member",
    description:
      "Join 50+ runners. Register for Run4Health membership in Thane.",
  },
};

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-background">
      <MinimalHeader title="Join Run4Health" />
      <RegisterPage />
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Run4Health — founded in 2015 in Thane, now 50+ members strong. Discover our mission, milestones and the community driving healthier lives across Thane and Mumbai.",
  keywords: [
    "about Run4Health",
    "running club history Thane",
    "fitness community founded 2015",
    "Run4Health mission",
    "Upvan Lake running group",
    "Thane fitness community story",
  ],
  alternates: { canonical: "https://run4health.in/about" },
  openGraph: {
    title: "About Run4Health — Our Story & Mission",
    description:
      "From 20 runners at Upvan Lake in 2015 to 50+ members today. Discover Run4Health's journey and mission to build healthier communities.",
    url: "https://run4health.in/about",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About Run4Health",
      },
    ],
  },
  twitter: {
    title: "About Run4Health — Our Story & Mission",
    description:
      "From 20 runners at Upvan Lake in 2015 to 50+ members today. Learn about Run4Health's journey.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

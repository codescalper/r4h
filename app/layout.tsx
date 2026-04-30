import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { cn } from "@/lib/utils";
import { bebasNeue, lora, geistMono } from "@/lib/fonts";

const BASE_URL = "https://run4health.in";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  applicationName: "Run4Health",
  title: {
    default: "Run4Health — Fitness Community in Thane & Mumbai",
    template: "%s | Run4Health",
  },
  description:
    "Run4Health is Thane's largest running and fitness community with 2400+ members. Join marathon training, yoga, health camps and fun runs across Thane and Mumbai.",
  keywords: [
    "Run4Health", "running club Thane", "fitness community Mumbai",
    "marathon training Thane", "yoga Thane", "running events Mumbai",
    "health fitness club", "community runs", "half marathon Thane",
  ],
  authors: [{ name: "Run4Health", url: BASE_URL }],
  creator: "Run4Health",
  publisher: "Run4Health",
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large", "max-video-preview": -1 },
  },
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Run4Health",
    title: "Run4Health — Fitness Community in Thane & Mumbai",
    description:
      "Join 2400+ runners and fitness enthusiasts at Run4Health — Thane's premier fitness community. Marathon training, yoga, health camps and more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Run4Health — Move. Thrive. Repeat.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Run4Health — Fitness Community in Thane & Mumbai",
    description:
      "Join 2400+ runners at Run4Health — Thane's premier fitness community. Marathon, yoga, health camps and more.",
    images: ["/og-image.png"],
    creator: "@run4health",
  },
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  verification: {
    google: "google-site-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        bebasNeue.variable,
        lora.variable,
        geistMono.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              name: "Run4Health",
              url: "https://run4health.in",
              logo: "https://run4health.in/logo.png",
              description:
                "Thane's largest running and fitness community with 2400+ members. Marathon training, yoga, health camps and fun runs.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Run4Health Community Center, Thane West",
                addressLocality: "Thane",
                addressRegion: "Maharashtra",
                postalCode: "400601",
                addressCountry: "IN",
              },
              telephone: "+91-98765-43210",
              email: "hello@run4health.in",
              sameAs: [],
              sport: "Running",
            }),
          }}
        />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}


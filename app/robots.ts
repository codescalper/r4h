import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/dashboard", "/member/dashboard", "/api/"],
      },
    ],
    sitemap: "https://run4health.in/sitemap.xml",
  }
}

import type { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export const revalidate = 3600

const BASE_URL = "https://run4health.in"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let postUrls: MetadataRoute.Sitemap = []
  let programUrls: MetadataRoute.Sitemap = []

  try {
    const [posts, programs] = await Promise.all([
      prisma.post.findMany({
        where: { status: "APPROVED" },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.program.findMany({
        select: { slug: true, id: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
    ])

    postUrls = posts.map((p) => ({
      url: `${BASE_URL}/news/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))

    programUrls = programs.map((p) => ({
      url: `${BASE_URL}/programs/${p.slug ?? p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }))
  } catch {
    // DB unavailable — return static pages only
  }

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/programs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/donate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/join`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...programUrls,
    ...postUrls,
  ]
}

import { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import Navbar from "@/components/landing-page/navbar"
import Footer from "@/components/landing-page/footer"
import NewsArticlePage from "@/components/landing-page/news-article-page"

const BASE_URL = "https://run4health.in"

type Props = { params: Promise<{ slug: string }> }

async function getPost(slug: string) {
  return prisma.post.findUnique({
    where: { slug, status: "APPROVED" },
    include: {
      images: { orderBy: { order: "asc" } },
      member: { select: { firstName: true, lastName: true } },
      admin: { select: { name: true } },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Article Not Found | Run4Health" }

  const authorName = post.admin?.name ?? (post.member ? `${post.member.firstName} ${post.member.lastName}` : "Run4Health")
  const excerpt = post.excerpt ?? post.content.replace(/<[^>]+>/g, "").substring(0, 160)
  const image = post.coverImagePath
    ? post.coverImagePath.startsWith("http")
      ? post.coverImagePath
      : `${BASE_URL}${post.coverImagePath}`
    : `${BASE_URL}/logo.png`

  return {
    title: `${post.title} | Run4Health`,
    description: excerpt,
    authors: [{ name: authorName }],
    openGraph: {
      title: post.title,
      description: excerpt,
      url: `${BASE_URL}/news/${slug}`,
      siteName: "Run4Health",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: excerpt,
      images: [image],
    },
  }
}

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <NewsArticlePage post={{
        ...post,
        publishedAt: post.publishedAt?.toISOString() ?? null,
        images: post.images.map(img => ({ id: img.id, path: img.path, altText: img.altText })),
      }} />
      <Footer />
    </div>
  )
}

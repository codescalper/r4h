import { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import PageWrapper from "@/components/landing-page/page-wrapper"
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

  const authorName =
    post.admin?.name ??
    (post.member ? `${post.member.firstName} ${post.member.lastName}` : "Run4Health")
  const description = post.excerpt ?? post.content.replace(/<[^>]+>/g, "").substring(0, 160)

  // Only set explicit OG image when a cover exists; otherwise opengraph-image.tsx generates the fallback
  const coverUrl = post.coverImagePath
    ? post.coverImagePath.startsWith("http")
      ? post.coverImagePath
      : `${BASE_URL}${post.coverImagePath}`
    : null

  return {
    title: post.title,
    description,
    authors: [{ name: authorName }],
    alternates: { canonical: `${BASE_URL}/news/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `${BASE_URL}/news/${slug}`,
      siteName: "Run4Health",
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [authorName],
      ...(coverUrl
        ? { images: [{ url: coverUrl, width: 1200, height: 630, alt: post.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(coverUrl ? { images: [coverUrl] } : {}),
    },
  }
}

export default async function NewsArticle({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const authorName =
    post.admin?.name ??
    (post.member ? `${post.member.firstName} ${post.member.lastName}` : "Run4Health")
  const description = post.excerpt ?? post.content.replace(/<[^>]+>/g, "").substring(0, 160)
  const coverUrl = post.coverImagePath
    ? post.coverImagePath.startsWith("http")
      ? post.coverImagePath
      : `${BASE_URL}${post.coverImagePath}`
    : `${BASE_URL}/og-image.png`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: coverUrl,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: "Run4Health",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}/news/${slug}` },
    url: `${BASE_URL}/news/${slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageWrapper>
        <NewsArticlePage
          post={{
            ...post,
            publishedAt: post.publishedAt?.toISOString() ?? null,
            images: post.images.map((img) => ({
              id: img.id,
              path: img.path,
              altText: img.altText,
            })),
          }}
        />
      </PageWrapper>
    </>
  )
}

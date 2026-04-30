import { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import PageWrapper from "@/components/landing-page/page-wrapper"
import ProgramDetailPage from "@/components/landing-page/program-detail-page"

const BASE_URL = "https://run4health.in"

type Props = { params: Promise<{ slug: string }> }

async function getProgram(slug: string) {
  return prisma.program.findFirst({ where: { OR: [{ slug }, { id: slug }] } })
}

const PROGRAM_EVENT_STATUS: Record<string, string> = {
  UPCOMING: "https://schema.org/EventScheduled",
  PAST: "https://schema.org/EventCompleted",
  CANCELLED: "https://schema.org/EventCancelled",
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgram(slug)
  if (!program) return { title: "Program Not Found | Run4Health" }

  const description = program.excerpt ?? program.content.replace(/<[^>]+>/g, "").substring(0, 160)
  const urlSlug = program.slug ?? program.id

  // Only set explicit OG image when a cover exists; otherwise opengraph-image.tsx generates the fallback
  const coverUrl = program.coverImagePath
    ? program.coverImagePath.startsWith("http")
      ? program.coverImagePath
      : `${BASE_URL}${program.coverImagePath}`
    : null

  return {
    title: program.title,
    description,
    alternates: { canonical: `${BASE_URL}/programs/${urlSlug}` },
    openGraph: {
      title: program.title,
      description,
      url: `${BASE_URL}/programs/${urlSlug}`,
      siteName: "Run4Health",
      type: "article",
      ...(coverUrl
        ? { images: [{ url: coverUrl, width: 1200, height: 630, alt: program.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: program.title,
      description,
      ...(coverUrl ? { images: [coverUrl] } : {}),
    },
  }
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params
  const program = await getProgram(slug)
  if (!program) notFound()

  const urlSlug = program.slug ?? program.id
  const description = program.excerpt ?? program.content.replace(/<[^>]+>/g, "").substring(0, 160)
  const coverUrl = program.coverImagePath
    ? program.coverImagePath.startsWith("http")
      ? program.coverImagePath
      : `${BASE_URL}${program.coverImagePath}`
    : `${BASE_URL}/og-image.png`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: program.title,
    description,
    image: coverUrl,
    url: `${BASE_URL}/programs/${urlSlug}`,
    eventStatus: PROGRAM_EVENT_STATUS[program.status] ?? "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(program.date ? { startDate: program.date.toISOString() } : {}),
    location: {
      "@type": "Place",
      name: program.location ?? "Thane, Maharashtra",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Thane",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "SportsOrganization",
      name: "Run4Health",
      url: BASE_URL,
    },
    sport: "Running",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageWrapper>
        <ProgramDetailPage
          program={{
            ...program,
            slug: program.slug ?? program.id,
            date: program.date?.toISOString() ?? null,
          }}
        />
      </PageWrapper>
    </>
  )
}

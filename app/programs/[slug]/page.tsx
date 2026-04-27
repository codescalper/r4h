import { Metadata } from "next"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import Navbar from "@/components/landing-page/navbar"
import Footer from "@/components/landing-page/footer"
import ProgramDetailPage from "@/components/landing-page/program-detail-page"

const BASE_URL = "https://run4health.in"

type Props = { params: Promise<{ slug: string }> }

async function getProgram(slug: string) {
  return prisma.program.findFirst({ where: { OR: [{ slug }, { id: slug }] } })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgram(slug)
  if (!program) return { title: "Program Not Found | Run4Health" }

  const excerpt = program.excerpt ?? program.content.replace(/<[^>]+>/g, "").substring(0, 160)
  const image = program.coverImagePath
    ? program.coverImagePath.startsWith("http")
      ? program.coverImagePath
      : `${BASE_URL}${program.coverImagePath}`
    : `${BASE_URL}/logo.png`
  const urlSlug = program.slug ?? program.id

  return {
    title: `${program.title} | Run4Health`,
    description: excerpt,
    openGraph: {
      title: program.title,
      description: excerpt,
      url: `${BASE_URL}/programs/${urlSlug}`,
      siteName: "Run4Health",
      type: "article",
      images: [{ url: image, width: 1200, height: 630, alt: program.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: program.title,
      description: excerpt,
      images: [image],
    },
  }
}

export default async function ProgramPage({ params }: Props) {
  const { slug } = await params
  const program = await getProgram(slug)
  if (!program) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <ProgramDetailPage program={{
        ...program,
        slug: program.slug ?? program.id,
        date: program.date?.toISOString() ?? null,
      }} />
      <Footer />
    </div>
  )
}

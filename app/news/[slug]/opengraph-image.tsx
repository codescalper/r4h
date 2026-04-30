import { ImageResponse } from "next/og"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"
export const revalidate = 3600
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const BASE_URL = "https://run4health.in"

const CATEGORY_LABELS: Record<string, string> = {
  EVENT_RECAP: "Event Recap",
  HEALTH_TIPS: "Health Tips",
  COMMUNITY_STORY: "Community Story",
  ANNOUNCEMENT: "Announcement",
}

type Props = { params: Promise<{ slug: string }> }

export default async function OgImage({ params }: Props) {
  const { slug } = await params

  const post = await prisma.post.findUnique({
    where: { slug, status: "APPROVED" },
    select: { title: true, category: true, excerpt: true, coverImagePath: true },
  })

  const title = post?.title ?? "Run4Health News"
  const category = post?.category
    ? (CATEGORY_LABELS[post.category] ?? post.category.replace(/_/g, " "))
    : "Article"
  const excerpt = post?.excerpt?.slice(0, 120) ?? ""
  const titleFontSize = title.length > 70 ? 40 : title.length > 45 ? 52 : 64

  const coverUrl = post?.coverImagePath
    ? post.coverImagePath.startsWith("http")
      ? post.coverImagePath
      : `${BASE_URL}${post.coverImagePath}`
    : null

  if (coverUrl) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            position: "relative",
            fontFamily: "sans-serif",
          }}
        >
          {/* Cover image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt={title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
              display: "flex",
            }}
          />
          {/* Content */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "44px 60px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span
                style={{
                  background: "#e11d48",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  padding: "5px 14px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                }}
              >
                {category}
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontSize: "13px",
                  letterSpacing: "1px",
                }}
              >
                run4health.in
              </span>
            </div>
            <div
              style={{
                color: "white",
                fontSize: titleFontSize + "px",
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              {title}
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }

  // Branded fallback when no cover image
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0c0c",
          padding: "64px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Accent glow — top-right */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(225,29,72,0.22) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Accent glow — bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(225,29,72,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top: brand + category */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              background: "#e11d48",
              color: "white",
              fontSize: "20px",
              fontWeight: 900,
              letterSpacing: "4px",
              padding: "10px 20px",
              borderRadius: "6px",
            }}
          >
            RUN4HEALTH
          </div>
          <div
            style={{
              border: "1px solid rgba(225,29,72,0.4)",
              background: "rgba(225,29,72,0.1)",
              color: "#e11d48",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "2px",
              padding: "6px 16px",
              borderRadius: "999px",
              textTransform: "uppercase",
            }}
          >
            {category}
          </div>
        </div>

        {/* Middle: title + excerpt */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: titleFontSize + "px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
            }}
          >
            {title}
          </div>
          {excerpt ? (
            <div
              style={{
                color: "rgba(255,255,255,0.48)",
                fontSize: "22px",
                lineHeight: 1.55,
              }}
            >
              {excerpt}
              {excerpt.length >= 120 ? "..." : ""}
            </div>
          ) : null}
        </div>

        {/* Bottom: URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: "24px",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "16px",
              letterSpacing: "0.5px",
            }}
          >
            run4health.in
          </span>
          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#e11d48",
              display: "flex",
            }}
          />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "16px" }}>
            Thane&apos;s Fitness Community
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

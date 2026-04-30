import { ImageResponse } from "next/og"
import prisma from "@/lib/prisma"

export const runtime = "nodejs"
export const revalidate = 3600
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const BASE_URL = "https://run4health.in"

const CATEGORY_LABELS: Record<string, string> = {
  MARATHON: "Marathon",
  YOGA: "Yoga",
  CAMP: "Health Camp",
  CORPORATE: "Corporate Wellness",
  FUN_RUN: "Fun Run",
  OTHER: "Event",
}

const STATUS_COLOR: Record<string, string> = {
  UPCOMING: "#16a34a",
  PAST: "#6b7280",
  CANCELLED: "#dc2626",
}

type Props = { params: Promise<{ slug: string }> }

export default async function OgImage({ params }: Props) {
  const { slug } = await params

  const program = await prisma.program.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: {
      title: true,
      category: true,
      excerpt: true,
      coverImagePath: true,
      status: true,
      date: true,
      location: true,
    },
  })

  const title = program?.title ?? "Run4Health Program"
  const category = program?.category
    ? (CATEGORY_LABELS[program.category] ?? program.category.replace(/_/g, " "))
    : "Event"
  const status = program?.status ?? "UPCOMING"
  const statusColor = STATUS_COLOR[status] ?? "#6b7280"
  const excerpt = program?.excerpt?.slice(0, 100) ?? ""
  const titleFontSize = title.length > 70 ? 40 : title.length > 45 ? 52 : 64

  const dateStr = program?.date
    ? new Date(program.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  const coverUrl = program?.coverImagePath
    ? program.coverImagePath.startsWith("http")
      ? program.coverImagePath
      : `${BASE_URL}${program.coverImagePath}`
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
              height: "65%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
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
                gap: "10px",
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
                  background: statusColor,
                  color: "white",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  padding: "4px 12px",
                  borderRadius: "4px",
                  textTransform: "uppercase",
                }}
              >
                {status}
              </span>
              {dateStr ? (
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "13px",
                  }}
                >
                  {dateStr}
                </span>
              ) : null}
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

        {/* Top: brand + badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
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
          <div
            style={{
              background: statusColor,
              color: "white",
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "1px",
              padding: "6px 14px",
              borderRadius: "999px",
              textTransform: "uppercase",
            }}
          >
            {status}
          </div>
        </div>

        {/* Middle: title + details */}
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
              {excerpt.length >= 100 ? "..." : ""}
            </div>
          ) : null}
          {dateStr ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  color: "#e11d48",
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                📅 {dateStr}
              </span>
              {program?.location ? (
                <span
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "16px",
                  }}
                >
                  · {program.location}
                </span>
              ) : null}
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

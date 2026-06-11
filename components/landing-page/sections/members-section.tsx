"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { bebasNeue, lora } from "@/lib/fonts"
import { MapPin, Users } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Member {
  id: string
  firstName: string
  lastName: string
  profilePhotoPath: string | null
  city: string
  gender: "MALE" | "FEMALE"
}

type GenderFilter = "ALL" | "MALE" | "FEMALE"

const FILTER_TABS: { key: GenderFilter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "MALE", label: "Male" },
  { key: "FEMALE", label: "Female" },
]

const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
}

function initials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

export default function MembersSection() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<GenderFilter>("ALL")

  useEffect(() => {
    fetch("/api/members/public")
      .then((r) => r.json())
      .then((data) => setMembers(data.members ?? []))
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    filter === "ALL"
      ? members
      : members.filter((m) => m.gender === filter)

  if (loading) return null

  return (
    <section className="bg-muted/20 py-14 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 30 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-8"
        >
          <p className={`${lora.className} text-sm text-primary font-medium mb-1`}>
            Our Community
          </p>
          <h2 className={`${bebasNeue.className} text-4xl sm:text-5xl lg:text-6xl tracking-wider text-foreground`}>
            OUR MEMBERS
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                filter === tab.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.key !== "ALL" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({members.filter((m) => m.gender === tab.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className={`${lora.className} text-muted-foreground text-sm`}>
              No members yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {filtered.map((member, i) => (
              <MemberCard key={member.id} member={member} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function MemberCard({ member, index }: { member: Member; index: number }) {
  const avatarUrl = member.profilePhotoPath?.startsWith("http")
    ? member.profilePhotoPath
    : member.profilePhotoPath || undefined

  return (
    <motion.div
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.04 }}
      viewport={{ once: true }}
    >
      <Card className="border-border hover:border-primary/30 hover:shadow-md transition-all duration-300">
        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
          <Avatar className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-border">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} alt={`${member.firstName} ${member.lastName}`} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {initials(member.firstName, member.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className={`${lora.className} font-semibold text-sm text-foreground leading-tight`}>
              {member.firstName} {member.lastName}
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              {member.city}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={`text-[10px] px-2 py-0 ${
              member.gender === "MALE"
                ? "bg-primary/10 text-primary"
                : "bg-accent/10 text-accent"
            }`}
          >
            {GENDER_LABELS[member.gender]}
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  )
}

import PageWrapper from "@/components/landing-page/page-wrapper"
import MembersSection from "@/components/landing-page/sections/members-section"

export const metadata = {
  title: "Our Members | Run4Health",
  description: "Meet the Run4Health community — Thane's fitness family.",
}

export default function MembersPage() {
  return (
    <PageWrapper>
      <div className="pt-20">
        <MembersSection />
      </div>
    </PageWrapper>
  )
}

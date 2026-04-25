'use client'

import { useRouter } from 'next/navigation'
import RegisterPage from '@/components/landing-page/register-page'

type PageKey = "home" | "about" | "programs" | "news" | "register" | "donate" | "gallery" | "contact"

export default function JoinPage() {
  const router = useRouter()

  const setCurrentPage = (page: PageKey) => {
    const routes: Partial<Record<PageKey, string>> = {
      home: '/',
      donate: '/donate',
      about: '/',
      programs: '/',
      news: '/',
      gallery: '/',
      contact: '/',
    }
    router.push(routes[page] ?? '/')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal top bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
        <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </a>
        <span className="text-border">|</span>
        <span className="text-sm font-semibold text-foreground">Join Run4Health</span>
      </div>

      <RegisterPage setCurrentPage={setCurrentPage} />
    </div>
  )
}

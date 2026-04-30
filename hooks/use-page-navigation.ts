"use client"

import { useRouter } from "next/navigation"
import { PAGE_ROUTES, type PageKey } from "@/lib/types"

/**
 * Returns a `navigate` function that pushes to the correct route for a PageKey.
 * Use this instead of duplicating pageRoutes + router.push in every component.
 */
export function usePageNavigation() {
  const router = useRouter()
  return (page: PageKey) => router.push(PAGE_ROUTES[page] ?? "/")
}

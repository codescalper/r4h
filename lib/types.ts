// ─── Navigation Types ─────────────────────────────────────────────────────────

export type PageKey =
  | "home"
  | "about"
  | "programs"
  | "news"
  | "register"
  | "donate"
  | "gallery"
  | "contact"

export const PAGE_ROUTES: Record<PageKey, string> = {
  home: "/",
  about: "/about",
  programs: "/programs",
  news: "/news",
  register: "/join",
  donate: "/donate",
  gallery: "/gallery",
  contact: "/contact",
}

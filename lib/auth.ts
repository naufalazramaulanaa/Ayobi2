// lib/auth.ts
export const getTokenFromCookie = (): string | null => {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)access_token=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export const getTokenUniversal = (): string | null => {
  // Fallback ke localStorage jika cookie belum tersedia
  return getTokenFromCookie() || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null)
}

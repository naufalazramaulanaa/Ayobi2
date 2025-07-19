import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value
  const url = request.nextUrl

  const protectedPaths = ["/admin", "/student", "/instructor", "/reviewer"]
  const pathRequiresAuth = protectedPaths.some((path) => url.pathname.startsWith(path))

  if (pathRequiresAuth && !token) {
    return NextResponse.redirect(new URL("/login", url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/instructor/:path*",
    "/reviewer/:path*"
  ]
}

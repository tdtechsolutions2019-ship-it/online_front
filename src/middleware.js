import { NextResponse } from 'next/server'

export function middleware(request) {

  const token = request.cookies.get("token")
//   const token = localStorage.getItem("token")

  if (!token && request.nextUrl.pathname !== "/signin") {
    return NextResponse.redirect(new URL("/signin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!signin|_next|favicon.ico).*)']
}
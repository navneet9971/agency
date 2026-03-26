import { NextResponse } from 'next/server'

const locales = ['en', 'hi', 'ar', 'fr', 'es', 'de', 'pt', 'ru', 'ja', 'ko', 'zh', 'it']
const defaultLocale = 'en'

function hasLocale(pathname) {
  const segments = pathname.split('/').filter(Boolean)
  return segments.length > 0 && locales.includes(segments[0])
}

export function proxy(request) {
  const url = request.nextUrl.clone()
  const { pathname } = url

  // Only redirect real pages
  if (!hasLocale(pathname)) {
    url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware'; 
import { getAuthCookieName, verifyAdminTokenEdge } from "@/lib/auth-edge";


const intlMiddleware = createMiddleware({
  locales: ['ru', 'en'],
  defaultLocale: 'ru',
});

export const config = {
  matcher: ['/', '/(ru|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const match = pathname.match(/^\/(ru|en)(\/|$)/);
  const locale = match ? match[1] : 'ru';

  const pathnameWithoutLocale = pathname.replace(/^\/(ru|en)(\/|$)/, '/') || '/';

  const cookieName = getAuthCookieName();
  const token = request.cookies.get(cookieName)?.value;

  if (pathnameWithoutLocale === "/admin/login") {
    if (token && (await verifyAdminTokenEdge(token))) {
      return NextResponse.redirect(new URL(`/${locale}/admin-panel`, request.url));
    }
    return intlMiddleware(request);
  }

  if (pathnameWithoutLocale.startsWith("/admin-panel")) {
    if (!token || !(await verifyAdminTokenEdge(token))) {
      const response = NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
      response.cookies.delete(cookieName);
      return response;
    }
  }

  return intlMiddleware(request);
}
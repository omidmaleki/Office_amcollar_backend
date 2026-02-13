import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./src/i18n/routing";

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
  localePrefix: "always",
  defaultLocale: "fa",
});

export default function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/fa", req.url));
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/",
    "/(en|fa)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

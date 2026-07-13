import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/session";

/** Redirects unauthenticated users to signin and blocks auth routes for signed-in users. */
export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const signedIn = Boolean(request.cookies.get(SESSION_COOKIE)?.value);

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(signedIn ? "/welcome" : "/signin", request.url),
    );
  }

  if (pathname === "/signin") {
    return signedIn
      ? NextResponse.redirect(new URL("/welcome", request.url))
      : NextResponse.next();
  }

  return signedIn
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/signin", request.url));
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon$|apple-icon$|manifest.webmanifest$|robots.txt$|sitemap.xml$|.*\\.(?:png|jpg|jpeg|svg)$).*)",
  ],
};

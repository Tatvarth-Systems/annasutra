import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE } from "@/lib/auth/session";

export function middleware(request: NextRequest) {
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
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg)$).*)",
  ],
};

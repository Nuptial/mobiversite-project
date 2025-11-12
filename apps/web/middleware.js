import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { resolveEnv } from "@/lib/env";

const PROTECTED_PATHS = [/^\/profile/, /^\/wishlist/];
const createRedirectResponse = (requestUrl, pathname) => {
  const redirectUrl = new URL("/login", requestUrl);
  redirectUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(redirectUrl);
};

export const config = { matcher: ["/profile/:path*", "/wishlist/:path*"] };

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!PROTECTED_PATHS.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("at_ui")?.value;
  if (!accessToken) {
    return createRedirectResponse(request.url, pathname);
  }

  const { uiJwtSecret } = resolveEnv();
  const secret = new TextEncoder().encode(uiJwtSecret);

  try {
    await jwtVerify(accessToken, secret);
    return NextResponse.next();
  } catch (error) {
    console.warn("[middleware] Access token verification failed", error);
    return createRedirectResponse(request.url, pathname);
  }
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BOT_PATTERNS = /bot|crawl|spider|slurp|mediapartners|preview|fetch|curl|wget|python|java|php|go-http/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Block bots from /private/ routes
  if (pathname.startsWith("/private")) {
    const ua = request.headers.get("user-agent") || "";
    if (BOT_PATTERNS.test(ua)) {
      return new NextResponse(null, { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

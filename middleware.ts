// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/sms": true,
  "/create-account": true,
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* 1️⃣ 정적 파일(.jpg · .png · .css · .js 등)은 그대로 통과 */
  if (/\.[^/]+$/.test(pathname)) {
    return NextResponse.next();
  }

  /* 2️⃣ Next 내부 자산도 통과(추가 안전망) */
  if (pathname.startsWith("/_next") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  /* 3️⃣ 원래 하던 세션 검사 */
  const session = await getSession();
  const isPublic = publicOnlyUrls[pathname];

  if (!session.id) {
    if (!isPublic) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (isPublic) {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }
}

export const config = {
  /* 모든 경로에 대해 동작하되, 위에서 이미 예외를 걸었으므로 OK */
  matcher: ["/:path*"],
};

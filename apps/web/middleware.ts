import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"]; // thêm "/admin" nếu muốn
const AUTH_PREFIX = "/auth";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // ✅ bỏ qua file tĩnh (đề phòng matcher bị mở rộng sau này)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/sounds") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".jpeg") ||
    pathname.endsWith(".webp") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".js")
  ) {
    return NextResponse.next();
  }

  // ✅ token
  const token = request.cookies.get("access_token")?.value?.trim();
  const hasToken = Boolean(token);

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuth = pathname.startsWith(AUTH_PREFIX);

  // (tuỳ chọn) chỉ log khi dev để đỡ spam
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[MW] ${pathname} | token=${hasToken ? "YES" : "NO"}`
    );
  }

  // ✅ Nếu vào route bảo vệ mà chưa login -> đá về login + giữ callbackUrl
  if (isProtected && !hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    url.searchParams.set("callbackUrl", pathname + (searchParams.toString() ? `?${searchParams}` : ""));
    return NextResponse.redirect(url);
  }

  // ✅ Nếu đã login mà vào /auth -> đá về dashboard
  if (isAuth && hasToken) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = ""; // tránh giữ query error
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/:path*",
    // thêm "/admin/:path*" nếu cần bảo vệ admin
  ],
};

// app/api/auth/google/callback/route.ts
import { baseUrl } from "@/lib/api-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  if (error) {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=google_auth_error", origin)
    );
  }
  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=no_code", origin)
    );
  }

  try {
    const res = await fetch(`${baseUrl}/api/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri }), // ✅ thêm redirectUri
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.redirect(
        new URL(`/auth/sign-in?error=server_verification_failed`, origin)
      );
    }

    const cookieStore = await cookies();

    if (data.token) {
      cookieStore.set("access_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
    }

    if (data.refreshToken) {
      cookieStore.set("refresh_token", data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.redirect(new URL("/dashboard", origin));
  } catch (err) {
    console.error("Callback Error:", err);
    return NextResponse.redirect(
      new URL("/auth/sign-in?error=unknown_error", origin)
    );
  }
}

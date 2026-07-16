import { NextResponse } from "next/server";
import { createAdminToken, getAuthCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { username?: string; password?: string };
    const username = body.username?.trim();
    const password = body.password?.trim();

    const expectedUsername = process.env.ADMIN_LOGIN;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedUsername || !expectedPassword) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    if (!username || !password || username !== expectedUsername || password !== expectedPassword) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await createAdminToken({ role: "admin" });

    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set({
      name: getAuthCookieName(),
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
  }
}

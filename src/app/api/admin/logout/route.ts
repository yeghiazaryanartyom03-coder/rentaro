import { NextResponse } from "next/server";
import { decodeJwt } from "jose";
import { prisma } from "@/lib/prisma"; 
import { cookies } from "next/headers";
import { getAuthCookieName } from "@/lib/auth";

export async function POST() {
  try {
    const cookieName = getAuthCookieName();
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName)?.value;

    if (token) {
      try {
        const payload = decodeJwt(token);
        
        if (payload && payload.exp) {
          const expiresAt = new Date(payload.exp * 1000);

          await prisma.blacklistedToken.upsert({
            where: { token },
            update: {},
            create: {
              token,
              expiresAt,
            },
          });
        }
      } catch (jwtError) {
        console.error("Error decoding token during logout:", jwtError);
      }
    }

    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set({
      name: cookieName,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
  }
}

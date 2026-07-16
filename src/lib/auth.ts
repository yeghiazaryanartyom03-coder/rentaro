import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export function getAuthCookieName() {
  return process.env.AUTH_COOKIE_NAME ?? "admin_token";
}

export async function createAdminToken(payload: Record<string, string>) {
  const secretText = process.env.JWT_SECRET;

  if (!secretText) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const secret = new TextEncoder().encode(secretText);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secret);
}

export async function verifyAdminToken(token: string) {
  try {
    const secretText = process.env.JWT_SECRET;
    if (!secretText) return false;

    const secret = new TextEncoder().encode(secretText);
    const { payload } = await jwtVerify(token, secret);
    const blacklistedToken = await prisma.blacklistedToken.findUnique({
      where: { token },
      select: { id: true },
    });

    if (blacklistedToken) {
      return false;
    }

    return Boolean(payload);
  } catch (error) {
    console.error("JWT verification error:", error);
    return false;
  }
}

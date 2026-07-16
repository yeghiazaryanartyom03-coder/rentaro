import { jwtVerify } from "jose";

export function getAuthCookieName() {
  return process.env.AUTH_COOKIE_NAME ?? "admin_token";
}

export async function verifyAdminTokenEdge(token: string) {
  try {
    const secretText = process.env.JWT_SECRET;
    if (!secretText) return false;

    const secret = new TextEncoder().encode(secretText);
    const { payload } = await jwtVerify(token, secret);

    return Boolean(payload);
  } catch (error) {
    return false;
  }
}
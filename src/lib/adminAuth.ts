import { cookies } from "next/headers";
import { getAuthCookieName, verifyAdminToken } from "@/lib/auth";

export async function isAdminRequest() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;

  return Boolean(token && (await verifyAdminToken(token)));
}

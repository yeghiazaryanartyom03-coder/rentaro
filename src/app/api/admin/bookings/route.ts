import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";
import { listBookings } from "@/lib/bookingService";
import { isAdminRequest } from "@/lib/adminAuth";

export async function GET() {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const bookings = await listBookings();

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Ошибка при получении бронирований:", error);
    return apiError("Не удалось загрузить бронирования", 500);
  }
}

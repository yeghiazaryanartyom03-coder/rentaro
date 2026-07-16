import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";
import { isAdminRequest } from "@/lib/adminAuth";
import { deleteBooking, updateBookingStatus, type BookingStatus } from "@/lib/bookingService";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const bookingId = resolvedParams.id;
    const { status } = await request.json();

    if (!status || !["confirmed", "cancelled", "pending"].includes(status)) {
      return apiError("Неверный статус", 400);
    }

    const updatedBooking = await updateBookingStatus(bookingId, status as BookingStatus);

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Ошибка обновления бронирования:", error);
    return apiError("Ошибка при обновлении статуса", 500);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const bookingId = resolvedParams.id;

    await deleteBooking(bookingId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка удаления бронирования:", error);
    return apiError("Ошибка при удалении бронирования", 500);
  }
}

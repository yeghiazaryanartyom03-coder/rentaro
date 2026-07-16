import { prisma } from "@/lib/prisma";

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export async function listBookings() {
  return prisma.booking.findMany({
    include: {
      car: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateBookingStatus(bookingId: string, status: BookingStatus) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
}

export async function deleteBooking(bookingId: string) {
  return prisma.booking.delete({
    where: { id: bookingId },
  });
}

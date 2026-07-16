import { NextResponse } from "next/server";
import { apiError } from "@/lib/apiError";
import { isAdminRequest } from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } },
) {
  try {
    if (!(await isAdminRequest())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const carId = resolvedParams.id;

    await prisma.image.deleteMany({ where: { carId } });
    await prisma.car.delete({ where: { id: carId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ошибка удаления автомобиля:", error);
    return apiError("Не удалось удалить автомобиль", 500);
  }
}

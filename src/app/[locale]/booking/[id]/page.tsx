import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: Props) {
  const resolvedParams = await params;
  const carId = resolvedParams.id;

  const matchedCar = await prisma.car.findUnique({
    where: { id: carId },
    include: {
      bookings: {
        where: {
          status: {
            not: "cancelled",
          },
        },
      },
    },
  });

  if (!matchedCar) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-xl font-semibold">Автомобиль не найден в базе данных</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4">
      <BookingForm car={matchedCar} />
    </div>
  );
}

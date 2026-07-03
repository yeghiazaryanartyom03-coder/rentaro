import { prisma } from "@/lib/prisma";
import BookingForm from "./BookingForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingPage({ params }: Props) {
  const resolvedParams = await params;
  const carId = resolvedParams.id;

  // Проверка на корректность ID в URL
  if (isNaN(+carId)) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-400 text-xl font-semibold">Некорректный идентификатор автомобиля</p>
      </div>
    );
  }

  // Запрашиваем машину и её бронирования напрямую из БД
  const matchedCar = await prisma.car.findUnique({
    where: { id: carId },
    include: {
      bookings: true, // Загружаем связанные бронирования для валидации дат
    },
  });

  // Если машины с таким ID нет в базе
  if (!matchedCar) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 text-xl font-semibold">Автомобиль не найден в базе данных</p>
      </div>
    );
  }

  // Отдаем готовую страницу с формой
  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4">
      <BookingForm car={matchedCar} />
    </div>
  );
}
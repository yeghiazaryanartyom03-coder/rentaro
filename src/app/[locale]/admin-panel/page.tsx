"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { type Booking, type Car } from "@/lib/types";
import { ImageDropzone } from "@/components/admin/ImageDropzone";
import { useRouter } from "@/navigation"; 

type BookingStatus = "pending" | "confirmed" | "cancelled";

const statusClasses: Record<BookingStatus, string> = {
  pending: "border-[#FF7A00]/30 bg-[#FF7A00]/10 text-[#FFB36B]",
  confirmed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  cancelled: "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [carDeleteTarget, setCarDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeletingCar, setIsDeletingCar] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [carForm, setCarForm] = useState({
    brand: "",
    model: "",
    year: "",
    priceAMD: "",
    fuel: "",
    gearbox: "",
    body: "",
    color: "",
    engine: "",
    horsePower: "",
    quantity: "",
    description: "",
    seats: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmittingCar, setIsSubmittingCar] = useState(false);

  useEffect(() => {
    console.log("ТРИГГЕР: useEffect сработал!");
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [bookingsResponse, carsResponse] = await Promise.all([
          axios.get("/api/admin/bookings"),
          axios.get("/api/car"),
        ]);

        if (isMounted) {
          setBookings(bookingsResponse.data);
          setCars(carsResponse.data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Не удалось загрузить данные панели");
          console.error("Ошибка при загрузке данных панели:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const router = useRouter(); // Инициализируем роутер

  const handleLogout = async () => {
    try {
      // Вызываем роут логаута (кука очистится на бэкенде)
      await axios.post("/api/admin/logout");
      toast.success("Вы успешно вышли из системы");

      // Перенаправляем на страницу входа и обновляем серверные компоненты
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      toast.error("Не удалось выйти из системы");
      console.error("Ошибка при логауте:", error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: BookingStatus) => {
    try {
      await axios.patch(`/api/admin/bookings/${id}`, { status: newStatus });

      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === id ? { ...booking, status: newStatus } : booking,
        ),
      );

      toast.success(
        newStatus === "confirmed"
          ? "Бронирование подтверждено"
          : "Бронирование отменено",
      );
    } catch (error) {
      toast.error("Ошибка при изменении статуса");
      console.error("Ошибка при изменении статуса:", error);
    }
  };

  const handleDeleteBooking = (booking: Booking) => {
    setDeleteTarget({
      id: booking.id,
      name: `${booking.firstName} ${booking.lastName}`,
    });
  };

  const confirmDeleteBooking = async () => {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await axios.delete(`/api/admin/bookings/${deleteTarget.id}`);
      setBookings((prev) =>
        prev.filter((booking) => booking.id !== deleteTarget.id),
      );
      toast.success("Бронирование удалено");
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Ошибка при удалении бронирования");
      console.error("Ошибка при удалении бронирования:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateCar = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingCar(true);

    try {
      const formData = new FormData();
      formData.append("brand", carForm.brand);
      formData.append("model", carForm.model);
      formData.append("year", String(Number(carForm.year)));
      formData.append("priceAMD", String(Number(carForm.priceAMD)));
      formData.append("fuel", carForm.fuel);
      formData.append("gearbox", carForm.gearbox);
      formData.append("body", carForm.body);
      formData.append("color", carForm.color);
      formData.append("engine", carForm.engine);
      formData.append(
        "horsePower",
        carForm.horsePower ? String(Number(carForm.horsePower)) : "",
      );
      formData.append("quantity", String(Number(carForm.quantity)));
      formData.append("description", carForm.description);
      formData.append(
        "seats",
        carForm.seats ? String(Number(carForm.seats)) : "",
      );

      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      const response = await axios.post("/api/admin/cars", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCars((prev) => [response.data, ...prev]);
      setShowCarForm(false);
      setCarForm({
        brand: "",
        model: "",
        year: "",
        priceAMD: "",
        fuel: "",
        gearbox: "",
        body: "",
        color: "",
        engine: "",
        horsePower: "",
        quantity: "",
        description: "",
        seats: "",
      });
      setSelectedImages([]);
      toast.success("Автомобиль добавлен");
    } catch (error) {
      toast.error("Ошибка при добавлении автомобиля");
      console.error("Ошибка при добавлении автомобиля:", error);
    } finally {
      setIsSubmittingCar(false);
    }
  };

  const handleDeleteCar = (car: Car) => {
    setCarDeleteTarget({ id: car.id, name: `${car.brand} ${car.model}` });
  };

  const confirmDeleteCar = async () => {
    if (!carDeleteTarget) {
      return;
    }

    setIsDeletingCar(true);

    try {
      await axios.delete(`/api/admin/cars/${carDeleteTarget.id}`);
      setCars((prev) => prev.filter((car) => car.id !== carDeleteTarget.id));
      toast.success("Автомобиль удален");
      setCarDeleteTarget(null);
    } catch (error) {
      toast.error("Ошибка при удалении автомобиля");
      console.error("Ошибка при удалении автомобиля:", error);
    } finally {
      setIsDeletingCar(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stats = useMemo(() => {
    const pending = bookings.filter(
      (booking) => booking.status === "pending",
    ).length;
    const confirmed = bookings.filter(
      (booking) => booking.status === "confirmed",
    ).length;
    const cancelled = bookings.filter(
      (booking) => booking.status === "cancelled",
    ).length;

    return [
      { label: "Всего заявок", value: bookings.length, accent: "text-white" },
      { label: "Ожидают", value: pending, accent: "text-[#FFB36B]" },
      { label: "Подтверждены", value: confirmed, accent: "text-emerald-400" },
      { label: "Отменены", value: cancelled, accent: "text-rose-400" },
    ];
  }, [bookings]);

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-6 sm:p-8">
          <div className="h-3 w-24 rounded-full bg-[#2A2A2A]" />
          <div className="mt-4 h-10 w-2/3 rounded-full bg-[#2A2A2A]" />
          <div className="mt-3 h-4 w-1/2 rounded-full bg-[#2A2A2A]" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-5"
            >
              <div className="h-3 w-20 rounded-full bg-[#2A2A2A]" />
              <div className="mt-4 h-8 w-12 rounded-full bg-[#2A2A2A]" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-[#2A2A2A] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#FF7A00]">
            Admin panel
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Управление бронированиями
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#A3A3A3] sm:text-base">
            Следите за заявками, подтверждайте новые брони и быстро реагируйте
            на отмены.
          </p>
        </div>

        {/* Контейнер для счетчика и кнопки логаута */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-lg border border-[#2A2A2A] bg-[#171717] px-4 py-3 text-sm text-[#D4D4D4]">
            <span className="text-[#FF7A00]">{bookings.length}</span> активных
            заявок
          </div>

          <button
            onClick={handleLogout}
            className="flex h-11 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 text-sm font-semibold text-rose-400 transition hover:border-rose-400 hover:bg-rose-500/20"
            type="button"
          >
            Выйти
          </button>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-5"
          >
            <p className="text-sm text-[#A3A3A3]">{stat.label}</p>
            <p className={`mt-3 text-3xl font-semibold ${stat.accent}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Управление автомобилями
            </h2>
            <p className="mt-1 text-sm text-[#A3A3A3]">
              Добавляйте новые автомобили в базу данных прямо из панели.
            </p>
          </div>
          <button
            onClick={() => setShowCarForm((prev) => !prev)}
            className="flex h-11 items-center justify-center rounded-lg bg-[#FF7A00] px-4 text-sm font-semibold text-black transition hover:bg-[#ff8f26]"
            type="button"
          >
            {showCarForm ? "Скрыть форму" : "Добавить автомобиль"}
          </button>
        </div>

        {showCarForm && (
          <form
            onSubmit={handleCreateCar}
            className="mt-6 grid gap-4 md:grid-cols-2"
          >
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Марка"
              value={carForm.brand}
              onChange={(event) =>
                setCarForm((prev) => ({ ...prev, brand: event.target.value }))
              }
              required
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Модель"
              value={carForm.model}
              onChange={(event) =>
                setCarForm((prev) => ({ ...prev, model: event.target.value }))
              }
              required
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Год"
              type="number"
              value={carForm.year}
              onChange={(event) =>
                setCarForm((prev) => ({ ...prev, year: event.target.value }))
              }
              required
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Цена (AMD)"
              type="number"
              value={carForm.priceAMD}
              onChange={(event) =>
                setCarForm((prev) => ({
                  ...prev,
                  priceAMD: event.target.value,
                }))
              }
              required
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Топливо"
              value={carForm.fuel}
              onChange={(event) =>
                setCarForm((prev) => ({ ...prev, fuel: event.target.value }))
              }
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Коробка"
              value={carForm.gearbox}
              onChange={(event) =>
                setCarForm((prev) => ({ ...prev, gearbox: event.target.value }))
              }
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Кузов"
              value={carForm.body}
              onChange={(event) =>
                setCarForm((prev) => ({ ...prev, body: event.target.value }))
              }
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Цвет"
              value={carForm.color}
              onChange={(event) =>
                setCarForm((prev) => ({ ...prev, color: event.target.value }))
              }
              required
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Двигатель"
              value={carForm.engine}
              onChange={(event) =>
                setCarForm((prev) => ({ ...prev, engine: event.target.value }))
              }
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Л.с."
              type="number"
              value={carForm.horsePower}
              onChange={(event) =>
                setCarForm((prev) => ({
                  ...prev,
                  horsePower: event.target.value,
                }))
              }
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Количество"
              type="number"
              value={carForm.quantity}
              onChange={(event) =>
                setCarForm((prev) => ({
                  ...prev,
                  quantity: event.target.value,
                }))
              }
              required
            />
            <input
              className="h-11 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
              placeholder="Сидений"
              type="number"
              value={carForm.seats}
              onChange={(event) =>
                setCarForm((prev) => ({ ...prev, seats: event.target.value }))
              }
            />
            <textarea
              className="min-h-28 rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-3 py-3 text-sm text-white outline-none placeholder:text-[#A3A3A3] focus:border-[#FF7A00] md:col-span-2"
              placeholder="Описание"
              value={carForm.description}
              onChange={(event) =>
                setCarForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
            />
            <ImageDropzone
              files={selectedImages}
              onFilesChange={setSelectedImages}
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmittingCar}
                className="flex h-11 items-center justify-center rounded-lg bg-[#FF7A00] px-4 text-sm font-semibold text-black transition hover:bg-[#ff8f26] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmittingCar ? "Сохраняем..." : "Сохранить автомобиль"}
              </button>
            </div>
          </form>
        )}
      </section>

      <section className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-5">
        <h2 className="text-xl font-semibold text-white">Список автомобилей</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {cars.map((car) => (
            <div
              key={car.id}
              className="rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">
                    {car.brand} {car.model}
                  </p>
                  <p className="mt-1 text-sm text-[#A3A3A3]">
                    {car.year} • {car.color}
                  </p>
                  <p className="mt-3 text-sm text-[#D4D4D4]">
                    Цена: {car.priceAMD} AMD
                  </p>
                  <p className="mt-1 text-sm text-[#D4D4D4]">
                    В наличии: {car.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteCar(car)}
                  className="flex h-10 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 text-sm font-semibold text-rose-400 transition hover:border-rose-400 hover:bg-rose-500/20"
                  type="button"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {bookings.length === 0 ? (
        <div className="rounded-lg border border-[#2A2A2A] bg-[#171717] px-6 py-16 text-center">
          <p className="text-lg text-white">Новых заявок пока нет</p>
          <p className="mt-2 text-sm text-[#A3A3A3]">
            Когда появятся новые бронирования, они будут отображены здесь.
          </p>
        </div>
      ) : (
        <section className="grid gap-4 xl:grid-cols-2">
          {bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-5"
            >
              <div className="flex flex-col gap-4 border-b border-[#2A2A2A] pb-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm text-[#A3A3A3]">Клиент</p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {booking.firstName} {booking.lastName}
                  </h2>
                  <div className="mt-2 space-y-1 text-sm text-[#D4D4D4]">
                    <p>{booking.phone}</p>
                    <p>{booking.email}</p>
                  </div>
                </div>

                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusClasses[booking.status as BookingStatus] ?? statusClasses.pending}`}
                >
                  {booking.status === "confirmed" && "Подтверждено"}
                  {booking.status === "cancelled" && "Отменено"}
                  {booking.status === "pending" && "Ожидает"}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-[#A3A3A3]">Автомобиль</p>
                  <p className="mt-1 font-semibold text-white">
                    {booking.car?.brand} {booking.car?.model || ""}
                  </p>
                  <p className="mt-1 text-sm text-[#A3A3A3]">
                    ID: {booking.car?.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-[#A3A3A3]">Период</p>
                  <p className="mt-1 text-sm text-white">
                    {formatDate(booking.startDate)}
                  </p>
                  <p className="mt-1 text-sm text-white">
                    {formatDate(booking.endDate)}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 text-sm text-[#D4D4D4] sm:grid-cols-2">
                <div className="rounded-md border border-[#2A2A2A] bg-[#0B0B0B] p-3">
                  <p className="text-[#A3A3A3]">Получение</p>
                  <p className="mt-1 font-medium uppercase text-white">
                    {booking.pickupLocation}
                  </p>
                </div>
                <div className="rounded-md border border-[#2A2A2A] bg-[#0B0B0B] p-3">
                  <p className="text-[#A3A3A3]">Возврат</p>
                  <p className="mt-1 font-medium uppercase text-white">
                    {booking.returnLocation}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-wrap gap-3">
                  {booking.status === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "confirmed")
                        }
                        className="flex h-11 items-center justify-center rounded-lg bg-[#FF7A00] px-4 text-sm font-semibold text-black transition hover:bg-[#ff8f26]"
                        type="button"
                      >
                        Подтвердить
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(booking.id, "cancelled")
                        }
                        className="flex h-11 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-4 text-sm font-semibold text-white transition hover:border-[#FF7A00] hover:text-[#FF7A00]"
                        type="button"
                      >
                        Отклонить
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-[#A3A3A3]">
                      Обработка завершена
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteBooking(booking)}
                  className="flex h-11 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 text-sm font-semibold text-rose-400 transition hover:border-rose-400 hover:bg-rose-500/20"
                  type="button"
                >
                  Удалить
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl border border-[#2A2A2A] bg-[#171717] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 text-xl text-rose-400">
                !
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Удалить бронирование?
                </h2>
                <p className="mt-1 text-sm text-[#A3A3A3]">
                  Это действие удалит заявку для {deleteTarget.name}.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex h-11 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-4 text-sm font-semibold text-white transition hover:border-[#FF7A00] hover:text-[#FF7A00]"
                type="button"
                disabled={isDeleting}
              >
                Отмена
              </button>
              <button
                onClick={confirmDeleteBooking}
                className="flex h-11 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 text-sm font-semibold text-rose-400 transition hover:border-rose-400 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                disabled={isDeleting}
              >
                {isDeleting ? "Удаляем..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {carDeleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6">
          <div className="w-full max-w-md rounded-2xl border border-[#2A2A2A] bg-[#171717] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 text-xl text-rose-400">
                !
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Удалить автомобиль?
                </h2>
                <p className="mt-1 text-sm text-[#A3A3A3]">
                  Это действие навсегда удалит {carDeleteTarget.name} из базы
                  данных.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setCarDeleteTarget(null)}
                className="flex h-11 items-center justify-center rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-4 text-sm font-semibold text-white transition hover:border-[#FF7A00] hover:text-[#FF7A00]"
                type="button"
                disabled={isDeletingCar}
              >
                Отмена
              </button>
              <button
                onClick={confirmDeleteCar}
                className="flex h-11 items-center justify-center rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 text-sm font-semibold text-rose-400 transition hover:border-rose-400 hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-70"
                type="button"
                disabled={isDeletingCar}
              >
                {isDeletingCar ? "Удаляем..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

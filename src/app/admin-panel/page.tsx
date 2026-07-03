"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { type Booking } from "@/lib/types";


export default function AdminPanel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  let isMounted = true; 

  const fetchBookings = async () => {
    try {
      const response = await axios.get("/api/admin/bookings");
      if (isMounted) {
        setBookings(response.data);
      }
    } catch (error) {
      if (isMounted) {
        toast.error("Не удалось загрузить список бронирований");
        console.log("Ошибка при загрузке бронирований:", error);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchBookings();

  return () => {
    isMounted = false;
  };
}, []);
  // Функция смены статуса
  const handleStatusChange = async (id: string, newStatus: "confirmed" | "cancelled") => {
    try {
      await axios.patch(`/api/admin/bookings/${id}`, { status: newStatus });
      
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
      );
      
      toast.success(newStatus === "confirmed" ? "Бронирование подтверждено!" : "Бронирование отменено.");
    } catch (error) {
      toast.error("Ошибка при изменении статуса");
      console.error("Ошибка при изменении статуса:", error);
    }
  };

  // Красивое форматирование даты и времени
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleString("ru-RU", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl font-medium animate-pulse">Загрузка панели управления...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Шапка админки */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-gray-800 pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Админ-панель</h1>
            <p className="text-gray-400 text-sm mt-1">Управление заявками на аренду автомобилей</p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 text-sm">
            Всего заявок: <span className="text-blue-400 font-bold">{bookings.length}</span>
          </div>
        </div>

        {/* Если заявок нет */}
        {bookings.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/50 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-lg">Новых заявок пока нет</p>
          </div>
        ) : (
          /* Таблица заказов */
          <div className="overflow-x-auto bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700 bg-gray-800/80 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                  <th className="p-4">ID / Клиент</th>
                  <th className="p-4">Автомобиль</th>
                  <th className="p-4">Даты аренды</th>
                  <th className="p-4">Локации</th>
                  <th className="p-4 text-center">Статус</th>
                  <th className="p-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/60">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-700/30 transition-colors">
                    
                    {/* Клиент */}
                    <td className="p-4">
                      <div className="font-semibold text-white">
                        {booking.firstName} {booking.lastName}
                      </div>
                      <div className="text-gray-400 text-xs mt-0.5">{booking.phone}</div>
                      <div className="text-gray-500 text-xs">{booking.email}</div>
                    </td>

                    {/* Машина */}
                    <td className="p-4">
                      <div className="font-medium text-blue-400">
                        {booking.car?.brand} {booking.car?.model || ""}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">ID авто: {booking.car?.id}</div>
                    </td>

                    {/* Даты */}
                    <td className="p-4 text-sm text-gray-300">
                      <div><span className="text-gray-500 text-xs">С:</span> {formatDate(booking.startDate)}</div>
                      <div className="mt-0.5"><span className="text-gray-500 text-xs">По:</span> {formatDate(booking.endDate)}</div>
                    </td>

                    {/* Локации */}
                    <td className="p-4 text-xs text-gray-400">
                      <div>📍 Получение: <span className="text-white font-medium uppercase">{booking.pickupLocation}</span></div>
                      <div className="mt-1">🏁 Возврат: <span className="text-white font-medium uppercase">{booking.returnLocation}</span></div>
                    </td>

                    {/* Статус */}
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        booking.status === "confirmed"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : booking.status === "cancelled"
                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}>
                        {booking.status === "confirmed" && "Подтверждено"}
                        {booking.status === "cancelled" && "Отменено"}
                        {booking.status === "pending" && "Ожидает"}
                      </span>
                    </td>

                    {/* Кнопки управления */}
                    <td className="p-4 text-right space-x-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleStatusChange( booking.id, "confirmed")}
                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-semibold transition"
                          >
                            Принять
                          </button>
                          <button
                            onClick={() => handleStatusChange( booking.id, "cancelled")}
                            className="px-3 py-1.5 bg-gray-700 hover:bg-red-600 hover:text-white text-gray-300 rounded-lg text-xs font-semibold transition"
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                      {booking.status !== "pending" && (
                        <span className="text-xs text-gray-500 italic">Обработано</span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useState, useMemo } from "react";
import { type Car, type Booking } from "@/lib/types";


interface BookingFormProps {
  car: Car;
}

export default function BookingForm({ car }: BookingFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "airport",
    returnLocation: "office",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const isBaseAvailable = car.quantity > 0;
  const bookedDates = car.bookings || [];

  // Динамическая валидация дат через useMemo
  const dateError = useMemo(() => {
    if (!formData.pickupDate || !formData.returnDate) return null;

    const pickup = new Date(formData.pickupDate).getTime();
    const dropoff = new Date(formData.returnDate).getTime();

    if (dropoff <= pickup) {
      return "Дата возврата должна быть позже даты получения.";
    }

    for (const booking of bookedDates) {
      const bookedStart = new Date(booking.startDate).getTime();
      const bookedEnd = new Date(booking.endDate).getTime();

      if (pickup < bookedEnd && dropoff > bookedStart) {
        return "Этот автомобиль уже забронирован на выбранный период. Попробуйте другие даты.";
      }
    }

    return null;
  }, [formData.pickupDate, formData.returnDate, bookedDates]);

  // Проверка валидности всей формы для активации кнопки
  const isFormValid = useMemo(() => {
    return (
      isBaseAvailable &&
      formData.firstName.trim() !== "" &&
      formData.lastName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.pickupDate !== "" &&
      formData.returnDate !== "" &&
      !dateError
    );
  }, [formData, isBaseAvailable, dateError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Здесь будет ваш реальный POST запрос на создание бронирования
      // Пример: await axios.post("/api/bookings", { carId: car.id, ...formData });
      console.log("Отправка данных на сервер:", { carId: car.id, ...formData });
      
      // Имитируем задержку сети
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return "Оформление...";
    if (!isBaseAvailable) return "Нет в наличии";
    if (!formData.pickupDate || !formData.returnDate) return "Укажите даты поездки";
    if (dateError) return "Машина занята на эти дни";
    if (!isFormValid) return "Заполните все поля";
    return "Подтвердить бронирование";
  };

  if (submitSuccess) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-gray-800 rounded-2xl border border-green-500/30 text-center shadow-2xl">
        <h2 className="text-3xl font-bold text-green-400 mb-4">Успешно!</h2>
        <p className="text-gray-300 text-lg mb-6">
          Ваша заявка на бронирование автомобиля принята. Менеджер свяжется с вами в ближайшее время.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl">
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h1 className="text-2xl font-bold text-white mb-1">Бронирование: {car.brand || `Автомобиль ID ${car.id}`}</h1>
        <p className="text-sm text-gray-400">
          Статус автопарка: {isBaseAvailable ? <span className="text-green-400 font-medium">Доступен</span> : <span className="text-red-400 font-medium">Нет свободных машин</span>}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Блок личных данных */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Имя</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Иван"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Фамилия</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Иванов"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@mail.com"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 123-4567"
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>
        </div>

        <hr className="border-gray-700 my-2" />

        {/* Блок дат */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Дата и время получения</label>
            <input
              type="datetime-local"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition color-scheme-dark"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Дата и время возврата</label>
            <input
              type="datetime-local"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition color-scheme-dark"
              required
            />
          </div>
        </div>

        {/* Блок локаций */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Место получения</label>
            <select
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="airport">Аэропорт</option>
              <option value="office">Центральный офис</option>
              <option value="hotel">Доставка к отелю</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Место возврата</label>
            <select
              name="returnLocation"
              value={formData.returnLocation}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            >
              <option value="office">Центральный офис</option>
              <option value="airport">Аэропорт</option>
            </select>
          </div>
        </div>

        {/* Вывод ошибки валидации дат */}
        {dateError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {dateError}
          </div>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`w-full mt-4 py-3 px-4 rounded-xl text-font-medium font-semibold text-center transition shadow-lg ${
            isFormValid && !isSubmitting
              ? "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer active:scale-[0.99]"
              : "bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          {getButtonText()}
        </button>
      </form>
    </div>
  );
}
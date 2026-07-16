"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {  filters, formatter } from "../../data/cars";
import { Link } from "@/navigation";
import {type Car } from "@/lib/types";

export function CarsPageClient({cars}: {cars: Car[] }) {
  const [activeBody, setActiveBody] = useState("Все");
  const [query, setQuery] = useState("");

  const filteredCars = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return cars.filter((car) => {
      const matchesBody = activeBody === "Все" || car.body === activeBody;
      const matchesQuery = `${car.brand} ${car.model} ${car.color}`
        .toLowerCase()
        .includes(normalizedQuery);

      return matchesBody && matchesQuery;
    });
  }, [activeBody, query, cars]);

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-[#2A2A2A] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#FF7A00]">
            Cars
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Каталог премиальных автомобилей
          </h1>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center lg:min-w-97.5">
          <div className="border-l border-[#2A2A2A] px-3">
            <p className="text-2xl font-semibold">24/7</p>
            <p className="mt-1 text-sm text-[#A3A3A3]">поддержка</p>
          </div>
          <div className="border-l border-[#2A2A2A] px-3">
            <p className="text-2xl font-semibold">{cars.length}</p>
            <p className="mt-1 text-sm text-[#A3A3A3]">машин</p>
          </div>
          <div className="border-l border-[#2A2A2A] px-3">
            <p className="text-2xl font-semibold">2024</p>
            <p className="mt-1 text-sm text-[#A3A3A3]">новые модели</p>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <label className="block">
          <span className="sr-only">Поиск автомобиля</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#171717] px-4 text-base text-white outline-none transition placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
            placeholder="Найти Mercedes, BMW, черный..."
            type="search"
          />
        </label>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveBody(filter)}
              className={`h-11 shrink-0 rounded-lg border px-4 text-sm font-medium transition ${
                activeBody === filter
                  ? "border-[#FF7A00] bg-[#FF7A00] text-black"
                  : "border-[#2A2A2A] bg-[#171717] text-white hover:border-[#FF7A00]"
              }`}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredCars.map((car) => (
          <article
            key={car.id}
            className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#171717]"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#0B0B0B]">
            {
              car.images && car.images.length > 0 ? (
                <Image
                  alt={`${car.brand} ${car.model}`}
                  fill
                  loading="eager"
                  sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  src={car.images[0].url}
                />
              ) : (
                <Image
                  alt={`${car.brand} ${car.model}`}
                  fill
                  loading="eager"
                  sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  src={"/placeholder-car.png"}
                />
              )
            }
              <div className="absolute left-3 top-3 rounded-md bg-black/75 px-3 py-1 text-sm font-medium text-white">
                {car.year}
              </div>
            </div>

            <div className="flex flex-col gap-5 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#A3A3A3]">{car.brand}</p>
                  <h2 className="mt-1 text-xl font-semibold leading-snug text-white">
                    {car.model}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[#FF7A00]">
                    {formatter.format(car.priceAMD)} AMD
                  </p>
                  <p className="mt-1 text-xs text-[#A3A3A3]">за день</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="border-t border-[#2A2A2A] pt-3">
                  <dt className="text-[#A3A3A3]">Кузов</dt>
                  <dd className="mt-1 font-medium text-white">{car.body}</dd>
                </div>
                <div className="border-t border-[#2A2A2A] pt-3">
                  <dt className="text-[#A3A3A3]">Топливо</dt>
                  <dd className="mt-1 font-medium text-white">{car.fuel}</dd>
                </div>
                <div className="border-t border-[#2A2A2A] pt-3">
                  <dt className="text-[#A3A3A3]">КПП</dt>
                  <dd className="mt-1 font-medium text-white">
                    {car.gearbox}
                  </dd>
                </div>
                <div className="border-t border-[#2A2A2A] pt-3">
                  <dt className="text-[#A3A3A3]">Мест</dt>
                  <dd className="mt-1 font-medium text-white">{car.seats}</dd>
                </div>
              </dl>

              {car.quantity > 0 ? (
                <Link
                  href={`/booking/${car.id}`}
                  className="flex h-12 cursor-pointer items-center justify-center rounded-lg bg-[#FF7A00] px-4 text-sm font-semibold text-black transition hover:bg-[#ff8f26] focus:outline-none focus:ring-2 focus:ring-[#FF7A00] focus:ring-offset-2 focus:ring-offset-[#171717]"
                >
                  Забронировать
                </Link>
              ) : (
                <button
                  disabled
                  type="button"
                  className="h-12 cursor-not-allowed rounded-lg bg-[#2a2a2a] px-4 text-sm font-semibold text-gray-300 transition focus:outline-none"
                >
                  Нет в наличии
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

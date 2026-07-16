"use client"

export function HowItWorks() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-8 sm:px-6 lg:pb-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#FF7A00]">
          How it works
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
          Three steps to your rental car
        </h1>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Choose a car", "Выберите модель из каталога и нужные даты."],
          ["Confirm details", "Мы уточним документы, маршрут и время."],
          ["Pick up and drive", "Получите автомобиль чистым и готовым."],
        ].map(([title, text]) => (
          <div
            key={title}
            className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-5"
          >
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#A3A3A3]">{text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

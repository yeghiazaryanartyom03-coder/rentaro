export default function AboutPage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#FF7A00]">
          About us
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
          Premium car rental with clear service
        </h1>
      </div>

      <section className="grid gap-4 text-base leading-7 text-[#D4D4D4]">
        <p>
          Rentaro помогает быстро подобрать автомобиль для поездок по городу,
          деловых встреч и путешествий. Мы делаем акцент на ухоженном автопарке,
          прозрачной цене и поддержке на каждом этапе аренды.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-4">
            <p className="text-2xl font-semibold text-white">24/7</p>
            <p className="mt-1 text-sm text-[#A3A3A3]">связь с нами</p>
          </div>
          <div className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-4">
            <p className="text-2xl font-semibold text-white">Clean</p>
            <p className="mt-1 text-sm text-[#A3A3A3]">готовые авто</p>
          </div>
          <div className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-4">
            <p className="text-2xl font-semibold text-white">Fast</p>
            <p className="mt-1 text-sm text-[#A3A3A3]">оформление</p>
          </div>
        </div>
      </section>
    </main>
  );
}

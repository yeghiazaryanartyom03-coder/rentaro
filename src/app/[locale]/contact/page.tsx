export default function ContactPage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#FF7A00]">
          Contact
        </p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">
          Need a car today?
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-[#D4D4D4]">
          Напишите нам, и мы подберем подходящий автомобиль, условия доставки и
          время выдачи.
        </p>
      </div>

      <section className="grid gap-3 sm:grid-cols-2">
        <a
          href="tel:+37400000000"
          className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-4 transition hover:border-[#FF7A00]"
        >
          <p className="text-sm text-[#A3A3A3]">Phone</p>
          <p className="mt-1 text-lg font-semibold text-white">
            +374 00 000 000
          </p>
        </a>
        <a
          href="mailto:hello@rentaro.am"
          className="rounded-lg border border-[#2A2A2A] bg-[#171717] p-4 transition hover:border-[#FF7A00]"
        >
          <p className="text-sm text-[#A3A3A3]">Email</p>
          <p className="mt-1 break-words text-lg font-semibold text-white">
            hello@rentaro.am
          </p>
        </a>
      </section>
    </main>
  );
}

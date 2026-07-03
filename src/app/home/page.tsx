import { FooterCTA } from "./components/FooterCTA";
import { Hero } from "./components/Hero";
import { Philosophy } from "./components/Philosophy";
import { CarCard } from "./components/CarCard";
import { TravelPlanner } from "./components/TravelPlanner";
import { HowItWorks } from "./components/HowItWorks";

const featuredCars = [
  {
    name: "Mercedes-Benz S 500",
    description: "Тихая роскошь для Еревана, трассы и вечерних маршрутов.",
    price: "от 52,000 AMD / день",
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "BMW X7",
    description: "Просторный SUV для семьи, горных дорог и дальних поездок.",
    price: "от 64,000 AMD / день",
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=85",
  },
  {
    name: "Porsche Panamera",
    description: "Динамика спорткара с комфортом большого гран-турера.",
    price: "от 76,000 AMD / день",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85",
  },
];

export default function HomePage() {
  return (
    <main className="overflow-x-hidden bg-[#0B0B0B] text-white">
      <Hero />
      <Philosophy />
      <TravelPlanner />

      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#FF7A00]">
            Car gallery
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
            Машины для маршрутов, которые не хочется сокращать
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredCars.map((car, index) => (
            <CarCard key={car.name} car={car} index={index} />
          ))}
        </div>
      </section>
      <HowItWorks />   
      <FooterCTA />
    </main>
  );
}

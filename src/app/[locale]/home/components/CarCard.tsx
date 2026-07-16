"use client";

import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

type FeaturedCar = {
  name: string;
  description: string;
  price: string;
  image: string;
};

type CarCardProps = {
  car: FeaturedCar;
  index: number;
};

export function CarCard({ car, index }: CarCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, x: index % 2 === 0 ? -34 : 34 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{
        y: -8,
        scale: 1.025,
        boxShadow: "0 24px 70px rgba(0,0,0,0.38)",
      }}
      transition={{ duration: 0.68, delay: index * 0.1, ease: easeOut }}
      className="overflow-hidden rounded-lg bg-[#171717]"
    >
      <div
        className="aspect-[4/3] bg-cover bg-center"
        style={{ backgroundImage: `url(${car.image})` }}
      />
      <div className="p-5">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#FF7A00]">
          {car.price}
        </p>
        <h3 className="mt-3 text-2xl font-semibold text-white">{car.name}</h3>
        <p className="mt-3 text-sm leading-6 text-[#BDBDBD]">
          {car.description}
        </p>
      </div>
    </motion.article>
  );
}

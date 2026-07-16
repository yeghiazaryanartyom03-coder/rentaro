"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden px-4 pb-14 pt-28 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(11,11,11,0.34), rgba(11,11,11,0.78)), url('/mountains.jpeg')",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,122,0,0.22),transparent_34%)]" />

      <motion.div
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: easeOut }}
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#FF9A3D]">
          Rentaro Armenia
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
          Армения начинается там, где вы заглушили мотор.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-white/82 sm:text-xl">
          Свобода передвижения на ваших условиях.
        </p>
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.24, ease: easeOut }}
          className="mt-8 inline-flex"
        >
          <Link
            href="/cars"
            className="rounded-lg bg-[#FF7A00] px-6 py-4 text-sm font-semibold text-black shadow-[0_18px_55px_rgba(255,122,0,0.28)] transition-colors hover:bg-[#ff9026]"
          >
            Выбрать автомобиль
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

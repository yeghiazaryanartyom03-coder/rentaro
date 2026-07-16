"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";

const easeOut = [0.22, 1, 0.36, 1] as const;

export function FooterCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.7, ease: easeOut }}
      className="px-4 pb-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 bg-[#111111] px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Ваше приключение ждет
        </h2>

        <motion.div
          whileHover={{
            scale: [1, 1.045, 1.02],
            boxShadow: "0 0 0 10px rgba(255,122,0,0.12)",
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.45, ease: easeOut }}
          className="inline-flex"
        >
          <Link
            href="/cars"
            className="rounded-lg bg-[#FF7A00] px-6 py-4 text-sm font-semibold text-black transition-colors hover:bg-[#ff9026]"
          >
            Выбрать автомобиль
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

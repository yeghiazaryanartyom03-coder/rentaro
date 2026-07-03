"use client";

import { motion } from "framer-motion";

const easeOut = [0.22, 1, 0.36, 1] as const;

const items = [
  {
    title: "Без расписаний",
    text: "Вы сами выбираете ритм поездки: короткая встреча в городе, дорога к Севану или спонтанный поворот в горы.",
  },
  {
    title: "Без лишнего шума",
    text: "Прозрачные условия, чистый автомобиль и поддержка без навязчивости. Все важное понятно до старта.",
  },
  {
    title: "Без компромиссов",
    text: "Автомобили под разные маршруты: представительский седан, большой SUV или динамичный гран-турер.",
  },
];

export function Philosophy() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.65, ease: easeOut }}
        className="max-w-2xl"
      >
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#FF7A00]">
          Philosophy
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
          Аренда, которая не спорит с вашим маршрутом
        </h2>
      </motion.div>

      <div className="mt-10 grid gap-8 md:grid-cols-3">
        {items.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{
              duration: 0.7,
              delay: index * 0.12,
              ease: easeOut,
            }}
            className="max-w-sm"
          >
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-4 text-base leading-7 text-[#BDBDBD]">
              {item.text}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

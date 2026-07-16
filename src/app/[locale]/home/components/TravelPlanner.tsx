"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const easeOut = [0.22, 1, 0.36, 1] as const;

type Region = {
  id: string;
  name: string;
  label: string;
  recommendation: string;
  car: string;
  image: string;
  position: {
    x: number;
    y: number;
  };
};

const regions: Region[] = [
  {
    id: "yerevan",
    name: "Ереван",
    label: "Городской ритм",
    recommendation:
      "Для Еревана идеален премиальный седан: комфортный, тихий и удобный для плотного городского движения.",
    car: "Mercedes-Benz S 500",
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85",
    position: { x: 45, y: 63 },
  },
  {
    id: "sevan",
    name: "Севан",
    label: "Озеро и трасса",
    recommendation:
      "Для дороги к Севану лучше выбрать просторный SUV: уверенная посадка, запас мощности и место для багажа.",
    car: "BMW X7",
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=1200&q=85",
    position: { x: 63, y: 38 },
  },
  {
    id: "tatev",
    name: "Татев",
    label: "Горы и серпантины",
    recommendation:
      "Для гор Татева лучше выбрать внедорожник: высокий клиренс, полный привод и спокойствие на длинном маршруте.",
    car: "Toyota Land Cruiser 300",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85",
    position: { x: 55, y: 83 },
  },
  {
    id: "dilijan",
    name: "Дилижан",
    label: "Лесные дороги",
    recommendation:
      "Для Дилижана подойдет динамичный кроссовер: он комфортен на трассе и уверенно чувствует себя на поворотах.",
    car: "Range Rover Sport",
    image:
      "https://images.unsplash.com/photo-1661956600684-97d3a4320e45?auto=format&fit=crop&w=1200&q=85",
    position: { x: 50, y: 28 },
  },
];

export function TravelPlanner() {
  const [activeRegion, setActiveRegion] = useState<Region>(regions[0]);

  return (
    <section className="mx-auto w-full max-w-7xl overflow-x-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: easeOut }}
        className="max-w-2xl"
      >
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#FF7A00]">
          Travel planner
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-5xl">
          Наведите на маршрут и выберите правильный автомобиль
        </h2>
        <p className="mt-4 text-base leading-7 text-[#BDBDBD]">
          Схематичная карта помогает быстро понять, какой класс машины лучше
          подойдет для города, озера, лесных дорог или горных серпантинов.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: easeOut }}
          className="relative min-h-[360px] overflow-hidden rounded-lg bg-[#121212] p-4 sm:p-6"
        >
          <svg
            viewBox="0 0 620 520"
            role="img"
            aria-label="Схематичная карта маршрутов Армении"
            className="h-full min-h-[330px] w-full"
          >
            <defs>
              <linearGradient id="routeGradient" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#FFD6A3" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            <motion.path
              d="M303 54 C382 72 449 130 480 205 C517 295 485 392 415 454 C348 510 246 500 179 447 C102 386 82 284 117 193 C150 105 215 50 303 54Z"
              fill="#181818"
              stroke="#2F2F2F"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0.35 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 1.2, ease: easeOut }}
            />
            <path
              d="M279 324 C316 274 337 223 389 196 M279 324 C320 365 338 407 343 432 M279 324 C264 246 283 188 310 144 M279 324 C268 259 270 196 306 145"
              fill="none"
              stroke="url(#routeGradient)"
              strokeDasharray="8 12"
              strokeLinecap="round"
              strokeWidth="4"
            />

            {regions.map((region) => {
              const isActive = activeRegion.id === region.id;
              const cx = (region.position.x / 100) * 620;
              const cy = (region.position.y / 100) * 520;

              return (
                <g key={region.id}>
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 28 : 20}
                    fill={isActive ? "rgba(255,122,0,0.22)" : "rgba(255,255,255,0.08)"}
                    initial={false}
                    animate={{ scale: isActive ? 1.08 : 1 }}
                    transition={{ duration: 0.3, ease: easeOut }}
                  />
                  <motion.circle
                    tabIndex={0}
                    role="button"
                    aria-label={region.name}
                    cx={cx}
                    cy={cy}
                    r="11"
                    fill={isActive ? "#FF7A00" : "#F5F5F5"}
                    stroke="#0B0B0B"
                    strokeWidth="4"
                    className="cursor-pointer outline-none"
                    onMouseEnter={() => setActiveRegion(region)}
                    onFocus={() => setActiveRegion(region)}
                    whileHover={{ scale: 1.28 }}
                    transition={{ duration: 0.22, ease: easeOut }}
                  />
                  <text
                    x={cx + 18}
                    y={cy + 5}
                    fill={isActive ? "#FFFFFF" : "#A3A3A3"}
                    fontSize="18"
                    fontWeight={isActive ? 700 : 500}
                    className="pointer-events-none select-none"
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.75, ease: easeOut }}
          className="overflow-hidden rounded-lg bg-[#171717]"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-[#101010]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRegion.image}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.45, ease: easeOut }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${activeRegion.image})` }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
          </div>

          <div className="p-5 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRegion.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease: easeOut }}
              >
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#FF7A00]">
                  {activeRegion.label}
                </p>
                <h3 className="mt-3 text-3xl font-semibold text-white">
                  {activeRegion.name}
                </h3>
                <p className="mt-4 text-base leading-7 text-[#C7C7C7]">
                  {activeRegion.recommendation}
                </p>
                <div className="mt-6 inline-flex rounded-lg bg-[#FF7A00] px-4 py-3 text-sm font-semibold text-black">
                  {activeRegion.car}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home page", href: "/home" },
  { label: "Cars", href: "/cars" },
  { label: "About us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms and conditions", href: "/terms-and-conditions" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2A2A2A] bg-[#0B0B0B]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          href="/home"
          className="text-lg font-semibold uppercase tracking-[0.18em] text-[#FF7A00]"
        >
          Rentaro
        </Link>

        <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:justify-end lg:overflow-visible lg:pb-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`min-h-10 shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[#FF7A00] ${
                  isActive
                    ? "border-[#FF7A00] bg-[#FF7A00] text-black"
                    : "border-[#2A2A2A] text-[#D4D4D4] hover:border-[#FF7A00] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

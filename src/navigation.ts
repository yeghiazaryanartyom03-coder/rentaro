// src/navigation.ts
import { createNavigation } from 'next-intl/navigation';

export const locales = ['ru', 'en'] as const;

// Используем новую универсальную функцию createNavigation
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales,
  // Здесь при желании можно настроить поведение префиксов в URL,
  // например: localePrefix: 'always' (всегда показывать /ru) или 'as-needed'
});
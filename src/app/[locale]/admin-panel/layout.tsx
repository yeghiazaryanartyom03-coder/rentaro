// src/app/[locale]/admin-panel/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "@/navigation";
import { prisma } from "@/lib/prisma";
import { getAuthCookieName } from "@/lib/auth"; // Здесь старый импорт безопасен
import { getLocale } from 'next-intl/server';   // Импортируем серверную функцию вместо хука

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getAuthCookieName())?.value;
  
  // Получаем текущую локаль прямо на сервере
  const locale = await getLocale();

  // Если токена нет — отправляем на страницу ЛОГИНА (исправлен бесконечный редирект)
  if (!token) {
    redirect({ href: '/admin/login', locale });
  }

  // Проверяем черный список в полноценном Node.js рантайме (тут Prisma работает отлично!)
  const blacklistedToken = await prisma.blacklistedToken.findUnique({
    where: { token },
    select: { id: true },
  });

  if (blacklistedToken) {
    // Если токен заблокирован — тоже отправляем на страницу входа
    redirect({ href: '/admin/login', locale });
  }

  return <>{children}</>;

}
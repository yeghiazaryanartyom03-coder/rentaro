"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "@/navigation";
import axios from "axios";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/admin/login", { username, password });
      toast.success("Вход выполнен");
      router.push("/admin-panel");
    } catch (error) {
      console.error("Admin login failed", error);
      toast.error("Неверный логин или пароль");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-[#0B0B0B] px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-125">
        <div className="rounded-2xl border border-[#2A2A2A] bg-[#171717] p-7 shadow-[0_0_0_1px_rgba(255,122,0,0.04),0_18px_60px_rgba(0,0,0,0.35)] sm:p-8">
          <div className="mb-8 border-b border-[#2A2A2A] pb-6">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-[#FF7A00]">
              Admin access
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Вход в панель</h1>
            <p className="mt-2 text-sm text-[#A3A3A3]">
              Введите учетные данные администратора.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="mb-1 block text-sm text-[#D4D4D4]">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-4 text-white outline-none transition placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-[#D4D4D4]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0B0B0B] px-4 text-white outline-none transition placeholder:text-[#A3A3A3] focus:border-[#FF7A00]"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-lg bg-[#FF7A00] px-4 text-sm font-semibold text-black transition hover:bg-[#ff8f26] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

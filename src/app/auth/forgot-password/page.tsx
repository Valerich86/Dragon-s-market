import { Metadata } from "next";
import ForgotPasswordForm from "@/components/forms/forgot-password";
import { font_light } from "@/lib/fonts";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Смена пароля",
  description: 'Смена пароля пользователя сайта магазина "Драконий базар"',
  keywords: ["Вход", "Логин", "Пароль", "Драконий базар"],
};

export default async function LoginPage() {
  const session = await verifySession();
  if (session) redirect("/profile");

  return (
    <main
      aria-label="смена пароля"
      className={`flex flex-col w-full min-h-screen py-30 x-spacing`}
    >
      <h1 className={`${font_light.className} text-2xl`}>Забыли пароль?</h1>
      <ForgotPasswordForm />
    </main>
  );
}

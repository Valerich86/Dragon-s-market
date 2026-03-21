import { Metadata } from "next";
import LoginForm from "@/components/forms/login";
import { font_light } from "@/lib/fonts";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Вход",
  description: 'Вход в личный кабинет сайта магазина "Драконий базар"',
  keywords: ["Вход", "Логин", "Драконий базар"],
};

export default async function LoginPage() {
  const session = await verifySession();
  if (session) redirect("/profile");

  return (
    <main
      aria-label="логин"
      className={`flex flex-col w-full min-h-screen py-30 x-spacing`}
    >
      <h1 className={`${font_light.className} text-2xl`}>Авторизуйтесь, </h1>
      <span className="text-xs">чтобы полноценно использовать приложение</span>
      <p className="text-accent text-xs mt-10 mb-5">* - обязательное поле</p>
      <LoginForm />
    </main>
  );
}

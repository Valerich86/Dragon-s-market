import { Metadata } from "next";
import RegisterForm from "@/components/forms/register";
import { font_light } from "@/lib/fonts";
import { redirect } from "next/navigation";
import { verifySession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Регистрация",
  description:
    'Регистрация нового пользователя сайта магазина "Драконий базар"',
  keywords: ["Регистрация", "Драконий базар"],
};

export default async function RegisterPage() {
  const session = await verifySession();
  if (session) redirect("/profile");

  return (
    <main
      aria-label="логин"
      className={`flex flex-col w-full min-h-screen py-30 x-spacing`}
    >
      <h1 className={`${font_light.className} text-2xl`}>Зарегистрируйтесь, </h1>
      <span className="text-xs">чтобы получить свою учётную запись</span>
      <span className="text-xs">и полноценно использовать приложение</span>
      <p className="text-accent text-xs mt-10">* - обязательное поле</p>
      <RegisterForm />
    </main>
  );
}

import { Metadata } from "next";
import RegisterForm from "@/components/forms/register";
import Link from "next/link";
import { font_light } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Регистрация",
  description:
    'Регистрация нового пользователя сайта магазина "Драконий базар"',
  keywords: ["Регистрация", "Драконий базар"],
};

export default function RegisterPage() {
  return (
    <div className={`flex flex-col w-full min-h-screen py-30 x-spacing`}>
      <h1 className={`${font_light} text-2xl`}>Зарегистрируйтесь, </h1>
      <span className="text-xs">чтобы получить свою учётную запись</span>
      <span className="text-xs">и полноценно использовать приложение</span>
      <RegisterForm />
    </div>
  );
}

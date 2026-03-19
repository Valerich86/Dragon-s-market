import { Metadata } from "next";
import LoginForm from "@/components/forms/login";
import { font_light } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Вход",
  description: 'Вход в личный кабинет сайта магазина "Драконий базар"',
  keywords: ["Вход", "Логин", "Драконий базар"],
};

export default function LoginPage() {
  return (
    <div
      className={`flex flex-col w-full min-h-screen py-30 x-spacing`}
    >
      <h1 className={`${font_light} text-2xl`}>Вход</h1>
      <LoginForm />
    </div>
  );
}

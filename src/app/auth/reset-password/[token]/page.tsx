import { Metadata } from "next";
import { redirect } from "next/navigation";
import ResetPasswordForm from "@/components/forms/reset-password";
import { font_light } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Сброс пароля",
  description: 'Сброс пароля учетной записи сайта магазина "Драконий базар"',
};

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!token) redirect("/auth/forgot-password");

  return (
    <main
      aria-label="сброс пароля"
      className={`flex flex-col w-full min-h-screen py-30 x-spacing`}
    >
      <h1 className={`${font_light.className} text-2xl`}>Сброс пароля</h1>
      <ResetPasswordForm token={token} />
    </main>
  );
}

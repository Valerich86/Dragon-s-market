import type { Metadata } from "next";
import { AiFillEdit } from "react-icons/ai";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserInfo } from "@/lib/server-data";
import { font_light } from "@/lib/fonts";
import ProfileOptions from "@/components/sections/profile-options";
import ProfileProvider from "@/components/providers/profile-provider";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "Драконий базар | Профиль пользователя | %s",
    default: "Профиль пользователя",
  },
  description: 'Профиль пользователя сайта магазина "Драконий базар", г. Пермь',
  keywords: ["учетная запись", "пользователь", "профиль", "Драконий базар"],
};

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  if (!session) redirect("/auth/login");
  const { user } = await getUserInfo(session.userId);
  if (!user) return;

  return (
    <main
      aria-label="Профиль"
      className={`w-full overflow-x-hidden min-h-screen x-spacing py-30 flex flex-col`}
    >
      <h1 className={`${font_light.className} uppercase`}>
        Добрый день, {user.general.first_name} !
      </h1>
      <div className="flex gap-5 items-center mt-3">
        <p className="text-xs">тел. для связи: {user.general.phone}</p>
        <Link href={`/profile/phone`} className="link">
          <AiFillEdit size={20} />
        </Link>
      </div>
      <ProfileOptions />
      <ProfileProvider user={user}>{children}</ProfileProvider>
    </main>
  );
}

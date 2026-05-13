import { font_light } from "@/lib/fonts";
import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/forms/admin-login";

export default async function LoginPage() {
  const session = await verifySession();
  if (session?.role === 'admin' || session?.role === 'superadmin') redirect("/admin");

  return (
    <main
      className={`flex flex-col w-full overflow-x-hidden px-5 lg:pr-25 py-10`}
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Вход в административную панель
      </h1>
      <AdminLoginForm />
    </main>
  );
}

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sections/sidebar";
import OrderNotifications from "@/components/tools/order-notifications";
import { verifySession } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    template: "Драконий базар | Админ.панель | %s",
    default: "Админ.панель",
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession("dragon_bazar_session_admin");
  if (session?.role !== "admin" && session?.role !== "superadmin")
    redirect("/auth/admin-login");

  return (
    <main aria-label="админ" className={`w-full overflow-x-hidden`}>
      <Sidebar />
      <OrderNotifications />
      <div className="w-screen min-h-screen bg-primary lg:pl-70 py-40 lg:pt-0">
        {children}
      </div>
    </main>
  );
}

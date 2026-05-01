import type { Metadata } from "next";
import Sidebar from "@/components/UI/sidebar";
import OrderNotifications from "@/components/order-notifications";

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

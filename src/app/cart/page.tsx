import CartList from "@/components/sections/cart-list";
import Smiler from "@/components/UI/smiler";
import { getCart } from "@/lib/actions";
import { verifySession } from "@/lib/auth";
import { useCloudPath } from "@/lib/cloud";
import { font_light } from "@/lib/fonts";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Корзина",
  description: 'Корзина пользователя сайта магазина "Драконий базар", г. Пермь',
};

export default async function CartPage() {
  const session = await verifySession();
  let userId = 0;
  if (session) userId = session.userId;
  const cloudPath = useCloudPath();

  return (
    <main
      aria-label="Корзина"
      className={`w-full overflow-x-hidden min-h-screen x-spacing py-30 flex flex-col`}
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Корзина товаров
      </h1>

      <CartList cloudPath={cloudPath} userId={userId} />

      {userId === 0 && (
        <div className="w-full flex">
          <div>
            <p>Вы пока не можете использовать корзину, </p>
            <p>
              сначала настройте свой{" "}
              <Link href={"/profile"} className="link italic underline">
                профиль пользователя
              </Link>
            </p>
          </div>
          <Smiler />
        </div>
      )}
    </main>
  );
}

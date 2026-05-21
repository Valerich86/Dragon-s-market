import { getAddress } from "@/lib/server-data";
import type { Metadata } from "next";
import { font_light } from "@/lib/fonts";
import AddressForm from "@/components/forms/address";

export const metadata: Metadata = {
  title: "Редактирование адреса",
};

export default async function AddressPage({
  searchParams,
}: {
  searchParams: Promise<{ id: number, userId: number }>;
}) {
  const { id, userId } = await searchParams;
  let address;
  if (id) address = (await getAddress(Number(id))).address;

  return (
    <main
      aria-label="адрес"
      className={`flex flex-col w-full min-h-screen`}
    >
      <h1 className={`${font_light.className} text-2xl`}>{id ? "Редактирование адреса" : "Новый адрес"}</h1>
      <p className="text-accent text-xs mt-10 mb-5">* - обязательное поле</p>
      <AddressForm method={id ? "put" : "post"} address={address? address : undefined} user={Number(userId)}/>
    </main>
  );
}

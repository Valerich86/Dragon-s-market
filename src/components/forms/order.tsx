"use client";

import { SubmitEvent, useState, useEffect, useContext } from "react";
import FormError from "../UI/form-error";
import CustomButton from "../UI/custom-button";
import { CartContext } from "@/context/cart-context";
import { font_bold } from "@/lib/fonts";
import { Address } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  userId: number;
  cartItems: number[];
  totalItems: number;
  totalSum: number;
  hasCategory4: boolean;
}

export default function OrderForm({
  userId,
  cartItems,
  totalItems,
  totalSum,
  hasCategory4,
}: Props) {
  const [form, setForm] = useState({
    customer_id: userId,
    address_id: undefined,
    type: "доставка",
    cart_items: cartItems,
    total_items: totalItems,
    total_sum: totalSum,
    notes: "",
  });
  const [notesErrors, setNotesErrors] = useState<string[] | undefined>(undefined);
  const [addressError, setAddressError] = useState<string | undefined>(undefined);
  const [addressData, setAddressData] = useState<Address | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCart, setRefreshCart } = useContext(CartContext)!;
  const router = useRouter();

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `/api/addresses/getDefault?userId=${userId}`,
        );
        const { defaultAddress } = await response.json();
        if (!defaultAddress) {
          setAddressError("добавьте адрес для доставки");
        } else {
          setAddressData(defaultAddress);
          setForm({ ...form, address_id: defaultAddress.id });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAddress();
  }, []);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setAddressError(undefined);
    setNotesErrors(undefined);
    setIsLoading(true);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      const { orderId } = await response.json();
      setRefreshCart(!refreshCart);
      router.replace(`/profile/orders/${orderId}`)
    } else if (response.status === 400) {
      setNotesErrors((await response.json()).errors);
    } else {
      console.error("Ошибка оформления заказа");
    }
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-10 w-full md:w-2/3 lg:w-1/2"
    >
      <fieldset className="w-full flex items-end">
        <div className="flex flex-col items-center">
          <label className="label mb-3">
            Выберите тип заказа <span className="text-accent">*</span>
          </label>
          <div
            className={`rounded-full w-25 h-15 bg-gray-600 shadow-[0px_0px_40px_25px_rgba(226,51,36,0.3)] border-3 flex items-center cursor-pointer relative`}
            onClick={() =>
              form.type === "самовывоз"
                ? setForm({ ...form, type: "доставка" })
                : setForm({ ...form, type: "самовывоз" })
            }
          >
            <div
              className={`
                rounded-full w-14 h-14 bg-accent shadow-[0px_0px_40px_25px_rgba(226,51,36,0.2)]
                border transition-all duration-200 ease-in-out relative
                ${form.type === "самовывоз" ? "translate-x-[70%] rotate-45" : ""}
                hover:shadow-[0px_0px_40px_25px_rgba(226,51,36,0.1)]
              `}
            >
              <div className="absolute w-1 h-1 top-3 left-3 bg-amber-50 rounded-full"></div>
            </div>
          </div>
        </div>
        <p className={`${font_bold.className} text-xl uppercase`}>
          {form.type}
        </p>
      </fieldset>

      <fieldset>
        <label className="label">При необходимости добавьте примечание</label>
        <input
          className="input resize-none mt-3"
          value={form.notes}
          placeholder="до 500 символов"
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </fieldset>

      {addressData && form.type === "доставка" && (
        <div>
          <label className="mb-3 label">Заказ будет доставлен по адресу:</label>
          <div className="bg-gray-600 p-5 rounded-lg mt-3">
            <p>Город {addressData?.city}</p>
            <p>ул.{addressData?.street}, дом {addressData?.house}, подъезд {addressData?.entrance}</p> 
            <p>этаж {addressData?.floor}, кв.{addressData?.apartment}, домофон {addressData?.intercom_number}</p>
            <p>{addressData?.additional_info
              ? `Доп.информация: ${addressData.additional_info}`
              : ""}</p>
            <p className="text-xs bg-accent mt-3 text-center py-1">Исправить данные можно в <Link href={"/profile/addresses"} className="text-indigo-700 link">
              Профиле пользователя
            </Link></p>
          </div>
        </div>
      )}

      <div aria-live="polite" aria-atomic="true">
        {notesErrors && notesErrors.map((er, i) => (
          <FormError key={i} errorField={er}/>
        ))}
        {hasCategory4 && form.type === "доставка" && (
          <FormError errorField={`Невозможно оформить доставку, в списке есть энергетик`} />
        )}
        {addressError && (
          <div className="text-accent text-xs">
            Для оформления заказа добавьте адрес доставки в{" "}
            <Link href={"/profile/addresses"} className="text-indigo-700 link">
              Профиле пользователя
            </Link>
          </div>
        )}
      </div>
      <CustomButton
        text="Оформить заказ"
        buttonType="submit"
        options="h-10 px-6 min-w-70"
        isLoading={isLoading}
        disabled={notesErrors !== undefined || addressError != undefined || hasCategory4}
      />
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import CustomButton from "@/components/UI/custom-button";
import PaintCaption from "@/components/UI/paint-caption";
import { useProfile } from "@/context/profile-context";
import { font_bold, font_light, font_mg } from "@/lib/fonts";
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";
import { AiTwotoneDelete, AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Addresses() {
  const { addresses, general } = useProfile();
  const router = useRouter();
  const [defaultAddress, setDefaultAddress] = useState(0);

  useEffect(() => {
    for (let a of addresses) {
      if (a.is_default) {
        setDefaultAddress(a.id);
      }
    }
  }, [addresses]);

  return (
    <section aria-label="Мои адреса" className="w-full flex flex-col gap-10">
      {addresses.map((a, i) => {
        const putAddress = async () => {
          setDefaultAddress(a.id);
          const response = await fetch(`/api/addresses/set_default`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: a.id,
              userId: general.id,
            }),
          });
          if (response.ok) {
            router.refresh();
          } else {
            console.error("Ошибка регистрации");
          }
        };

        const deleteAddress = async () => {
          try {
            const response = await fetch(`/api/addresses/${a.id}`, {
              method: "DELETE",
            });
            if (response.ok) router.refresh();
          } catch (error) {
            console.error(error);
          }
        };
        return (
          <div
            key={a.id}
            className="w-full flex flex-wrap gap-5 border border-gray-700 p-5 pb-8 rounded"
          >
            <div className={`${font_mg} w-full`}>
              <div className="flex items-center gap-10 w-full lg:w-1/3">
                <p className="uppercase">Адрес {i + 1}</p>
                <div
                  className="flex gap-2 items-center text-accent cursor-pointer"
                  onClick={putAddress}
                >
                  {a.id === defaultAddress && <IoMdRadioButtonOn />}
                  {a.id !== defaultAddress && <IoMdRadioButtonOff />}
                  <p className="text-secondary">
                    {a.id === defaultAddress ? "(основной)" : ""}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-5 w-full lg:w-1/3">
              <p>Город</p>
              <div className="relative -translate-y-5 lg:-translate-y-6">
                <PaintCaption caption={a.city} />
              </div>
            </div>
            <div className="flex items-baseline gap-5 w-full lg:w-1/3">
              <p>Улица</p>
              <div className="relative -translate-y-5 lg:-translate-y-6">
                <PaintCaption caption={a.street} />
              </div>
            </div>
            <div className="flex items-baseline gap-5 w-full lg:w-1/3">
              <p>Дом</p>
              <div className="relative -translate-y-5 lg:-translate-y-6">
                <PaintCaption caption={a.house} />
              </div>
            </div>
            <div className="flex items-baseline gap-5 w-full lg:w-1/3">
              <p>Подъезд</p>
              <div className="relative -translate-y-5 lg:-translate-y-6">
                <PaintCaption caption={a.entrance} />
              </div>
            </div>
            <div className="flex items-baseline gap-5 w-full lg:w-1/3">
              <p>Этаж</p>
              <div className="relative -translate-y-5 lg:-translate-y-6">
                <PaintCaption caption={a.floor} />
              </div>
            </div>
            <div className="flex items-baseline gap-5 w-full lg:w-1/3">
              <p>Квартира</p>
              <div className="relative -translate-y-5 lg:-translate-y-6">
                <PaintCaption caption={a.apartment} />
              </div>
            </div>
            <div className="flex items-baseline gap-5 w-full lg:w-1/3">
              <p>Домофон</p>
              <div className="relative -translate-y-5 lg:-translate-y-6">
                <PaintCaption
                  caption={a.intercom_number ? a.intercom_number : "—"}
                />
              </div>
            </div>
            <div className="flex items-baseline gap-5 w-full lg:w-1/3">
              <p>Примечание</p>
              <div className="">
                {a.additional_info ? a.additional_info : "—"}
              </div>
            </div>
            <div className="flex items-center gap-10">
              <Link
                href={`/profile/addresses/address?id=${a.id}&userId=${general.id}`}
                className="link"
              >
                <AiFillEdit size={20} />
              </Link>
              <button className="link text-accent" onClick={deleteAddress}>
                <AiTwotoneDelete size={22} />
              </button>
            </div>
          </div>
        );
      })}
      <div className="w-full lg:w-1/3">
        <CustomButton
          buttonType="button"
          text="Добавить адрес"
          options="w-full"
          onClick={() =>
            router.push(`/profile/addresses/address?userId=${general.id}`)
          }
        />
      </div>
    </section>
  );
}

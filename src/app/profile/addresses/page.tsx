"use client";

import CustomButton from "@/components/UI/custom-button";
import PaintCaption from "@/components/UI/paint-caption";
import { useUser } from "@/context/user-context";
import { font_bold, font_light, font_mg } from "@/lib/fonts";
import { IoMdRadioButtonOff, IoMdRadioButtonOn } from "react-icons/io";
import { AiTwotoneDelete, AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Addresses() {
  const { addresses, general } = useUser();
  const router = useRouter();

  return (
    <section aria-label="Мои адреса" className="w-full flex flex-col gap-10">
      {addresses.map((a) => (
        <div
          key={a.id}
          className="w-full flex flex-wrap gap-5 border border-gray-700 p-5 pb-8 rounded"
        >
          <div className={`${font_mg} w-full`}>
            <div className="flex items-center gap-10 w-full lg:w-1/3">
              <p className="uppercase">Адрес 1</p>
              <div className="flex gap-2 items-center text-accent">
                {a.is_default && <IoMdRadioButtonOn />}
                {!a.is_default && <IoMdRadioButtonOff />}
                <p className="text-secondary">
                  {a.is_default ? "(основной)" : ""}
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
            <Link href={`/profile/addresses/address?id=${a.id}&userId=${general.id}`} className="link">
              <AiFillEdit size={20} />
            </Link>
            <Link href={`/`} className="link text-accent">
              <AiTwotoneDelete size={22} />
            </Link>
          </div>
        </div>
      ))}
      <div className="w-full lg:w-1/3">
        <CustomButton
          buttonType="button"
          text="Добавить адрес"
          options="w-full"
          onClick={() => router.push(`/profile/addresses/address?userId=${general.id}`)}
        />
      </div>
    </section>
  );
}

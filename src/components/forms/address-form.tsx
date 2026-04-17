"use client";

import { SubmitEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import FormError from "../UI/form-error";
import CustomButton from "../UI/custom-button";
import { Address, AddressFormErrors } from "@/lib/types";

export default function AddressForm({
  address,
  method,
  user,
}: {
  address?: Address;
  method: "post" | "put";
  user: number;
}) {
  const [form, setForm] = useState({
    id: 0,
    customer_id: Number(user),
    city: "",
    street: "",
    house: "",
    entrance: "",
    floor: "",
    apartment: "",
    intercom_number: "",
    additional_info: "",
    is_default: true,
  });
  const [errors, setErrors] = useState<AddressFormErrors | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (method === "put" && address) {
      setForm({
        id: address.id,
        customer_id: Number(user),
        city: address.city,
        street: address.street,
        house: address.house,
        entrance: address.entrance,
        floor: address.floor,
        apartment: address.apartment,
        intercom_number: address.intercom_number || "",
        additional_info: address.additional_info || "",
        is_default: address.is_default,
      });
    }
  }, [method, address]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);
    setIsLoading(true);
    const response = await fetch(
      method === "post" ? `/api/addresses` : `/api/addresses/${form.id}`,
      {
        method: method === "post" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    if (response.ok) {
      router.refresh();
      router.back();
    } else if (response.status === 400) {
      setErrors((await response.json()).errors);
    } else {
      console.error("Ошибка");
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
      <div className="flex flex-col gap-2 lg:w-[45%]">
        {/* город */}
        <fieldset>
          <label className="label">
            Город <span className="text-accent">*</span>
          </label>
          <input
            className="input"
            value={form.city}
            placeholder="Пермь"
            required
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <div aria-live="polite" aria-atomic="true">
            {errors?.city &&
              errors.city.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
        </fieldset>

        {/* улица */}
        <fieldset>
          <label className="label">
            Улица <span className="text-accent">*</span>
          </label>
          <input
            className="input"
            value={form.street}
            required
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />
          <div aria-live="polite" aria-atomic="true">
            {errors?.street &&
              errors.street.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
        </fieldset>

        <div className="w-full flex justify-between gap-1">
          {/* дом */}
          <fieldset className="w-1/3">
            <label className="label">
              Дом <span className="text-accent">*</span>
            </label>
            <input
              className="input"
              value={form.house}
              required
              onChange={(e) => setForm({ ...form, house: e.target.value })}
            />
            <div aria-live="polite" aria-atomic="true">
              {errors?.house &&
                errors.house.map((error: string, i) => (
                  <FormError errorField={error} key={i} />
                ))}
            </div>
          </fieldset>
          {/* Подъезд */}
          <fieldset className="w-1/3">
            <label className="label">
              Подъезд <span className="text-accent">*</span>
            </label>
            <input
              className="input"
              value={form.entrance}
              required
              onChange={(e) => setForm({ ...form, entrance: e.target.value })}
            />
            <div aria-live="polite" aria-atomic="true">
              {errors?.entrance &&
                errors.entrance.map((error: string, i) => (
                  <FormError errorField={error} key={i} />
                ))}
            </div>
          </fieldset>
          {/* Этаж */}
          <fieldset className="w-1/3">
            <label className="label">
              Этаж <span className="text-accent">*</span>
            </label>
            <input
              className="input"
              value={form.floor}
              required
              onChange={(e) => setForm({ ...form, floor: e.target.value })}
            />
            <div aria-live="polite" aria-atomic="true">
              {errors?.floor &&
                errors.floor.map((error: string, i) => (
                  <FormError errorField={error} key={i} />
                ))}
            </div>
          </fieldset>
        </div>

        <div className="w-full flex gap-1 justify-between">
          {/* квартира */}
          <fieldset className="w-1/2">
            <label className="label">
              Квартира <span className="text-accent">*</span>
            </label>
            <input
              className="input"
              value={form.apartment}
              required
              onChange={(e) => setForm({ ...form, apartment: e.target.value })}
            />
            <div aria-live="polite" aria-atomic="true">
              {errors?.apartment &&
                errors.apartment.map((error: string, i) => (
                  <FormError errorField={error} key={i} />
                ))}
            </div>
          </fieldset>
          {/* домофон */}
          <fieldset className="w-1/2">
            <label className="label">Номер домофона</label>
            <input
              className="input"
              value={form.intercom_number}
              onChange={(e) =>
                setForm({ ...form, intercom_number: e.target.value })
              }
            />
            <div aria-live="polite" aria-atomic="true">
              {errors?.intercom_number &&
                errors.intercom_number.map((error: string, i) => (
                  <FormError errorField={error} key={i} />
                ))}
            </div>
          </fieldset>
        </div>

        {/* примечание */}
        <fieldset>
          <label className="label">Примечание</label>
          <input
            className="input"
            value={form.additional_info}
            placeholder={`например, "домофон не работает"`}
            onChange={(e) =>
              setForm({ ...form, additional_info: e.target.value })
            }
          />
          <div aria-live="polite" aria-atomic="true">
            {errors?.additional_info &&
              errors.additional_info.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
        </fieldset>

        <div className="w-full text-sm mt-5 text-zinc-500">
          <label className="flex items-start cursor-pointer">
            <button
              onClick={() => setPrivacyAgreed((prev) => !prev)}
              className="mt-0.5 text-indigo-700"
            >
              {!privacyAgreed && <GrCheckbox size={15} />}
              {privacyAgreed && <GrCheckboxSelected size={15} />}
            </button>
            <span className="ml-2 text-zinc-500">
              Я даю согласие на обработку моих персональных данных в
              соответствии с{" "}
              <Link
                href="/privacy-policy"
                className="text-indigo-700 link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Политикой конфиденциальности
              </Link>
              <span className="text-accent"> *</span>
            </span>
          </label>
          {errors?.policy && <FormError errorField={errors.policy} />}
        </div>

        <CustomButton
          text={method === "post" ? "Сохранить" : "Изменить"}
          buttonType="submit"
          options="h-10 mt-6 px-6 min-w-70"
          isLoading={isLoading}
          disabled={!privacyAgreed}
        />
      </div>
    </form>
  );
}

"use client";

import { SubmitEvent, useState } from "react";
import { redirect } from "next/navigation";
import FormError from "../UI/form-error";
import Link from "next/link";
import CustomButton from "../UI/custom-button";
import { RegisterFormErrors } from "@/lib/types";

export default function RegisterForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    phone: "+7",
    city: "",
    street: "",
    house: "",
    entrance: "",
    floor: "",
    apartment: "",
    intercom_number: "",
    additional_info: "",
  });
  const [errors, setErrors] = useState<RegisterFormErrors | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();
    setErrors(undefined);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      redirect("/profile");
    } else if (response.status === 400) {
      setErrors((await response.json()).errors);
    } else {
      console.error("Ошибка регистрации");
    }
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mt-5 gap-2 w-full lg:flex-row flex-wrap justify-between"
    >
      <div className="flex flex-col gap-2 lg:w-[45%]">
        <fieldset className="border-t border-gray-400 mt-5">
          <legend className="text-center px-3 text-gray-400">
            Данные для входа
          </legend>
        </fieldset>
        {/* имя  */}
        <fieldset>
          <label className="label">Имя*</label>
          <input
            className="input"
            value={form.first_name}
            autoFocus
            required
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          />
          <div aria-live="polite" aria-atomic="true">
            {errors?.first_name &&
              errors.first_name.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
        </fieldset>

        {/* фамилия */}
        <fieldset>
          <label className="label">Фамилия*</label>
          <input
            className="input"
            value={form.last_name}
            required
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          />
          <div aria-live="polite" aria-atomic="true">
            {errors?.last_name &&
              errors.last_name.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
        </fieldset>

        {/* телефон */}
        <fieldset>
          <label className="label">Номер телефона*</label>
          <input
            className="input"
            type="tel"
            value={form.phone}
            placeholder="+7XXXXXXXXXX"
            required
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <div aria-live="polite" aria-atomic="true">
            {errors?.phone &&
              errors.phone.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
        </fieldset>

        {/* пароль */}
        <fieldset>
          <label className="label">Пароль*</label>
          <input
            className="input"
            type="password"
            value={form.password}
            placeholder="Пока просто не менее 4 символов"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div id="password-error" aria-live="polite" aria-atomic="true">
            {errors?.password &&
              errors.password.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
        </fieldset>

        {/* пароль 2 */}
        <fieldset>
          <label className="label">Повторите пароль*</label>
          <input
            className="input"
            type="password"
            value={form.confirmPassword}
            required
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
            {errors?.confirmPassword &&
              errors.confirmPassword.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-col lg:w-[45%] gap-2">
        <fieldset className="border-t border-gray-400 mt-5">
          <legend className="text-center px-3 text-gray-400">
            Адрес доставки
          </legend>
        </fieldset>

        {/* город */}
        <fieldset>
          <label className="label">Город*</label>
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
          <label className="label">Улица*</label>
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
            <label className="label">Дом*</label>
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
            <label className="label">Подъезд*</label>
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
            <label className="label">Этаж*</label>
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
            <label className="label">Квартира*</label>
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
            <label className="label">Номер домофона*</label>
            <input
              className="input"
              value={form.intercom_number}
              required
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
      </div>
      <CustomButton
        text="Зарегистрироваться"
        buttonType="submit"
        options="h-10 mt-6 px-3"
        isLoading={isLoading}
      />
      <Link
        href={"/auth/login"}
        className="link mt-2 lg:mt-5 italic h-10 flex items-center justify-center text-xs text-gray-200 text-right"
      >
        Уже зарегистрирован? ⭢
      </Link>
    </form>
  );
}

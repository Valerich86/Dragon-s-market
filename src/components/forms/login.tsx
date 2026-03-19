"use client";

import { SubmitEvent, useState } from "react";
import { redirect } from "next/navigation";
import FormError from "../UI/form-error";
import Link from "next/link";
import CustomButton from "../UI/custom-button";
import { LoginFormErrors } from "@/lib/types";

export default function LoginForm() {
  const [form, setForm] = useState({
    password: "",
    phone: ""
  });
  const [errors, setErrors] = useState<LoginFormErrors | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();
    setErrors(undefined);
    const response = await fetch("/api/auth/login", {
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
    <form onSubmit={handleSubmit} className="form">

      {/* телефон */}
      <fieldset>
        <label className="label">Логин (Номер телефона)*</label>
        <input
          className="input"
          type="tel"
          value={form.phone}
          autoFocus
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

      <CustomButton
        text="Войти"
        buttonType="submit"
        options="h-10 mt-6 px-3"
        isLoading={isLoading}
      />
      <Link
        href={"/auth/register"}
        className="link mt-2 lg:mt-5 italic h-10 flex items-center justify-center text-xs text-gray-200 text-right"
      >
        Ешё не зарегистрирован? ⭢
      </Link>
    </form>
  );
}

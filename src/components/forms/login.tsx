"use client";

import { SubmitEvent, useState } from "react";
import { PiEyesLight } from "react-icons/pi";
import { redirect } from "next/navigation";
import FormError from "../UI/form-error";
import Link from "next/link";
import CustomButton from "../UI/custom-button";

export default function LoginForm() {
  const [form, setForm] = useState({
    password: "",
    phone: "+7",
  });
  const [error, setError] = useState<string | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();
    setError(undefined);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (response.ok) {
      redirect("/profile");
    } else if (response.status === 401) {
      const { error } = await response.json();
      setError(error);
    } else {
      console.error("Ошибка регистрации");
    }
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full md:w-2/3 lg:w-1/2"
    >
      {/* телефон */}
      <fieldset>
        <label className="label">
          Логин (Номер телефона) <span className="text-accent">*</span>
        </label>
        <input
          className="input"
          type="tel"
          value={form.phone}
          autoFocus
          placeholder="+7XXXXXXXXXX"
          required
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </fieldset>

      {/* пароль */}
      <fieldset className="relative">
        <label className="label">
          Пароль <span className="text-accent">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            value={form.password}
            placeholder="Пока просто не менее 4 символов"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <PiEyesLight
            size={30}
            className={`cursor-pointer text-secondary ${showPassword ? "" : "-scale-x-100"} transition duration-300`}
            onClick={() => setShowPassword((prev) => !prev)}
          />
        </div>
      </fieldset>
      <div aria-live="polite" aria-atomic="true">
        {error && <FormError errorField={error} />}
      </div>

      <CustomButton
        text="Войти"
        buttonType="submit"
        options="h-10 mt-6 px-3"
        isLoading={isLoading}
      />
      <Link
        href={"/auth/register"}
        className="link mt-2 lg:mt-5 italic h-10 flex items-center justify-center text-gray-200 text-right"
      >
        Ешё не зарегистрированы? ⭢
      </Link>
    </form>
  );
}

"use client";

import { SubmitEvent, useState } from "react";
import FormError from "../UI/form-error";
import CustomButton from "../UI/custom-button";
import { RegisterFormErrors } from "@/lib/types";
import Captcha from "../tools/captcha";

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    phone: "+7",
    email: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<RegisterFormErrors | undefined>(
    undefined,
  );

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);
    setIsLoading(true);

    if (!captchaToken) {
      setErrors({ captcha: ["Подтвердите, что вы не робот"] });
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, captchaToken }),
    });
    if (response.ok) {
      const {message} = await response.json();
      window.alert(message);
    } else if ([400, 401, 500].includes(response.status)) {
      setErrors((await response.json()).errors);
    } else if (response.status === 429) {
      const {error} = await response.json();
      window.alert(error);
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
      {/* почта */}
      <fieldset>
        <label className="label">
          Email (логин для входа)<span className="text-accent">*</span>
        </label>
        <input
          className="input"
          type="email"
          placeholder="example@mail.ru"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <div aria-live="polite" aria-atomic="true">
          {errors?.email &&
            errors.email.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

      {/* телефон */}
      <fieldset>
        <label className="label">
          Номер телефона <span className="text-accent">*</span>
        </label>
        <input
          className="input"
          type="tel"
          value={form.phone}
          placeholder="+7XXXXXXXXXX"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <div aria-live="polite" aria-atomic="true">
          {errors?.phone &&
            errors.phone.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>
      <Captcha onChange={setCaptchaToken} />
      <div aria-live="polite" aria-atomic="true" className="w-full text-center">
        {errors?.captcha &&
          errors.captcha.map((error: string, i) => (
            <FormError errorField={error} key={i} />
          ))}
      </div>
      <CustomButton
        text="Отправить письмо"
        buttonType="submit"
        options="h-10 mt-6 px-6 min-w-70"
        isLoading={isLoading}
        disabled={captchaToken === null}
      />
    </form>
  );
}

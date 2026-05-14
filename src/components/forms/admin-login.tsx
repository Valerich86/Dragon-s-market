"use client";

import { SubmitEvent, useState } from "react";
import { PiEyesLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import FormError from "../UI/form-error";
import Notification from "../UI/notification";
import CustomButton from "../UI/custom-button";
import type { LoginFormErrors } from "@/lib/types";
import Captcha from "../tools/captcha";

export default function AdminLoginForm() {
  const [form, setForm] = useState({
    password: "",
    email: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    setIsLoading(true);
    e.preventDefault();
    setErrors(undefined);

    if (!captchaToken) {
      setErrors({ captcha: ["Подтвердите, что вы не робот"] });
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, captchaToken }),
    });
    if (response.ok) {
      const data = await response.json();
      if (data.requiresVerification) {
        // Переключаем форму в режим ввода кода
        setRequiresVerification(true);
      } else {
        setShowSuccess(true);
        router.prefetch("/admin");
        setTimeout(() => {
          setShowSuccess(false);
          router.replace("/admin");
        }, 2000);
      }
    } else if ([400, 401, 500].includes(response.status)) {
      const { errors } = await response.json();
      setErrors(errors);
    } else if (response.status === 429) {
      const { error } = await response.json();
      window.alert(error);
    } else {
      console.error("Ошибка аутентификации");
    }
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full md:w-2/3 lg:w-1/2"
    >
      {/* логин */}
      <fieldset>
        <label className="label">
          Логин (email) <span className="text-accent">*</span>
        </label>
        <input
          className="input"
          type="email"
          value={form.email}
          autoFocus
          placeholder="example@mail.ru"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </fieldset>
      <div aria-live="polite" aria-atomic="true">
        {errors?.email &&
          errors.email.map((error: string, i) => (
            <FormError errorField={error} key={i} />
          ))}
      </div>

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
        {errors?.password &&
          errors.password.map((error: string, i) => (
            <FormError errorField={error} key={i} />
          ))}
      </div>

      {!requiresVerification && (
        <>
          <Captcha onChange={setCaptchaToken} />
          <CustomButton
            text="Войти"
            buttonType="submit"
            options="h-10 mt-6 px-3"
            isLoading={isLoading}
            disabled={!captchaToken}
          />
        </>
      )}
      <div aria-live="polite" aria-atomic="true" className="w-full text-center">
        {errors?.captcha &&
          errors.captcha.map((error: string, i) => (
            <FormError errorField={error} key={i} />
          ))}
      </div>
      {requiresVerification && (
        <>
          <p className="text-sm text-gray-500 mt-2">
            Код отправлен на <span className="italic">{form.email}</span>. Если
            не пришло письмо, проверьте папку «Спам».
          </p>
          <fieldset>
            <label className="label">
              Код подтверждения <span className="text-accent">*</span>
            </label>
            <input
              className="input"
              type="text"
              placeholder="Введите 6-значный код"
              value={form.verificationCode}
              onChange={(e) =>
                setForm({ ...form, verificationCode: e.target.value })
              }
              maxLength={6}
            />
          </fieldset>
          <div aria-live="polite" aria-atomic="true">
            {errors?.verificationCode &&
              errors.verificationCode.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
          <CustomButton
            text="Подтвердить вход"
            buttonType="submit"
            options="h-10 mt-6 px-6 min-w-70"
            isLoading={isLoading}
            disabled={!captchaToken}
          />
        </>
      )}
      <Notification text={"Вход успешно выполнен"} show={showSuccess} />
    </form>
  );
}

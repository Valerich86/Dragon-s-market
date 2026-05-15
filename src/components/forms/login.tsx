"use client";

import { SubmitEvent, useState, useEffect } from "react";
import { PiEyesLight } from "react-icons/pi";
import { useRouter } from "next/navigation";
import Captcha from "../tools/captcha";
import FormError from "../UI/form-error";
import Link from "next/link";
import CustomButton from "../UI/custom-button";
import type { LoginFormErrors } from "@/lib/types";
import Notification from "../UI/notification";

export default function LoginForm() {
  const [form, setForm] = useState({
    password: "",
    email: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors | undefined>(undefined);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const isProduction = process.env.NEXT_PUBLIC_NODE_ENV === "production";
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

    const response = await fetch("/api/auth/login", {
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
        router.prefetch("/profile");
        setTimeout(() => {
          setShowSuccess(false);
          router.replace("/profile");
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

  const resetVerification = () => {
    setCaptchaToken(null);
    setRequiresVerification(false);
  };

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
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <PiEyesLight
            size={30}
            className={`cursor-pointer text-secondary ${showPassword ? "" : "-scale-x-100"} transition duration-300`}
            onClick={() => setShowPassword((prev) => !prev)}
          />
        </div>
        <Link
          href={"/auth/forgot-password"}
          className="link mt-3 italic text-indigo-500 text-xs"
        >
          Забыли пароль? ➢
        </Link>
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
          <div
            aria-live="polite"
            aria-atomic="true"
            className="w-full text-center"
          >
            {errors?.captcha &&
              errors.captcha.map((error: string, i) => (
                <FormError errorField={error} key={i} />
              ))}
          </div>
          <CustomButton
            text="Войти"
            buttonType="submit"
            options="h-10 mt-6 px-3"
            isLoading={isLoading}
            disabled={isProduction && !captchaToken}
          />
        </>
      )}
      {requiresVerification && (
        <>
          <p className="text-sm text-gray-500 mt-2">
            Код отправлен на <span className="italic">{form.email}</span>. Если
            не пришло письмо, проверьте папку «Спам».
          </p>
          <fieldset>
            <label className="label">
              Введите 6-значный код подтверждения{" "}
              <span className="text-accent">*</span>
            </label>
            <div className="relative">
              <div className="flex h-10">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="rounded h-10 w-10 border bg-gray-700"
                  ></div>
                ))}
                <button onClick={resetVerification} className="link ml-3 italic text-indigo-500 text-xs">
                  Повторить ➢
                </button>
              </div>
              <input
                className="absolute inset-0 h-10 w-67 outline-none border-none text-2xl px-3"
                style={{ letterSpacing: "26px" }}
                type="text"
                value={form.verificationCode}
                onChange={(e) =>
                  setForm({ ...form, verificationCode: e.target.value })
                }
                maxLength={6}
              />
            </div>
            <div aria-live="polite" aria-atomic="true">
              {errors?.verificationCode &&
                errors.verificationCode.map((error: string, i) => (
                  <FormError errorField={error} key={i} />
                ))}
            </div>
          </fieldset>
          <CustomButton
            text="Подтвердить вход"
            buttonType="submit"
            options="h-10 mt-6 px-6 min-w-70"
            isLoading={isLoading}
            disabled={isProduction && !captchaToken}
          />
        </>
      )}
      <Link
        href={"/auth/register"}
        className="link mt-2 lg:mt-5 italic h-10 flex items-center justify-center text-gray-200 text-right"
      >
        Ешё не зарегистрированы? ➢
      </Link>
      <Notification text={"Вход успешно выполнен"} show={showSuccess} />
    </form>
  );
}

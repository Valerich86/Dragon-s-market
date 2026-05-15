"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PiEyesLight } from "react-icons/pi";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import Notification from "../UI/notification";
import FormError from "../UI/form-error";
import CustomButton from "../UI/custom-button";
import { RegisterFormErrors } from "@/lib/types";
import Captcha from "../tools/captcha";

export default function RegisterForm() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
    phone: "+7",
    email: "",
    verificationCode: "",
  });
  const [errors, setErrors] = useState<RegisterFormErrors | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);
    setIsLoading(true);

    if (!captchaToken) {
      setErrors({ captcha: ["Подтвердите, что вы не робот"] });
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/auth/register", {
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
      setErrors((await response.json()).errors);
    } else if (response.status === 429) {
      const { error } = await response.json();
      window.alert(error);
    } else {
      console.error("Ошибка регистрации");
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
      <fieldset>
        <label className="label">
          Имя <span className="text-accent">*</span>
        </label>
        <input
          className="input"
          value={form.first_name}
          autoFocus
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
        <label className="label">
          Фамилия <span className="text-accent">*</span>
        </label>
        <input
          className="input"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
        <div aria-live="polite" aria-atomic="true">
          {errors?.last_name &&
            errors.last_name.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

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

      {/* пароль */}
      <fieldset>
        <label className="label">
          Пароль <span className="text-accent">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            className="input"
            type={showPassword ? "text" : "password"}
            value={form.password}
            placeholder="не менее 8 символов"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <PiEyesLight
            size={30}
            className={`cursor-pointer text-secondary ${showPassword ? "scale-x-100" : "-scale-x-100"} transition duration-300`}
            onClick={() => setShowPassword((prev) => !prev)}
          />
        </div>
        <div id="password-error" aria-live="polite" aria-atomic="true">
          {errors?.password &&
            errors.password.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

      {/* пароль 2 */}
      <fieldset>
        <label className="label">
          Повторите пароль <span className="text-accent">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            className="input"
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <PiEyesLight
            size={30}
            className={`cursor-pointer text-secondary ${showConfirm ? "" : "-scale-x-100"} transition duration-300`}
            onClick={() => setShowConfirm((prev) => !prev)}
          />
        </div>
        <div id="confirmPassword-error" aria-live="polite" aria-atomic="true">
          {errors?.confirmPassword &&
            errors.confirmPassword.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

      <div className="w-full text-sm mt-5 text-zinc-500">
        <label className="flex items-start cursor-pointer">
          <div
            onClick={() => setPrivacyAgreed((prev) => !prev)}
            className="mt-0.5 text-indigo-700"
          >
            {!privacyAgreed && <GrCheckbox size={15} />}
            {privacyAgreed && <GrCheckboxSelected size={15} />}
          </div>
          <span className="ml-2 text-zinc-500">
            Я даю согласие на обработку моих персональных данных в соответствии
            с{" "}
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
            text="Зарегистрироваться"
            buttonType="submit"
            options="h-10 mt-6 px-6 min-w-70"
            isLoading={isLoading}
            disabled={!privacyAgreed || !captchaToken}
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
                className="absolute inset-0 h-10 w-70 outline-none border-none text-2xl px-3"
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
            text="Подтвердить регистрацию"
            buttonType="submit"
            options="h-10 mt-6 px-6 min-w-70"
            isLoading={isLoading}
          />
        </>
      )}
      <Link
        href={"/auth/login"}
        className="link mt-2 lg:mt-5 italic h-10 flex items-center justify-center text-gray-200 text-right"
      >
        Уже зарегистрированы? ➢
      </Link>
      <Notification text={"Регистрация успешно завершена"} show={showSuccess} />
    </form>
  );
}

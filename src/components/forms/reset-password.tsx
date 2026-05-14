"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import FormError from "../UI/form-error";
import CustomButton from "../UI/custom-button";
import { RegisterFormErrors } from "@/lib/types";
import { PiEyesLight } from "react-icons/pi";
import Captcha from "../tools/captcha";
import Notification from "../UI/notification";

export default function ResetPasswordForm({ token }: { token: string }) {
  const [form, setForm] = useState({
    token: token,
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<RegisterFormErrors | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, captchaToken }),
    });
    if (response.ok) {
      setShowSuccess(true);
      router.prefetch("/auth/login");
      setTimeout(() => {
        setShowSuccess(false);
        router.replace("/auth/login");
      }, 2000);
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

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full md:w-2/3 lg:w-1/2"
    >
      {/* пароль */}
      <fieldset>
        <label className="label">
          Новый пароль <span className="text-accent">*</span>
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
          Повторите новый пароль <span className="text-accent">*</span>
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
      <Captcha onChange={setCaptchaToken} />
      <div aria-live="polite" aria-atomic="true" className="w-full text-center">
        {errors?.captcha &&
          errors.captcha.map((error: string, i) => (
            <FormError errorField={error} key={i} />
          ))}
      </div>
      <CustomButton
        text="Сменить пароль"
        buttonType="submit"
        options="h-10 mt-6 px-6 min-w-70"
        isLoading={isLoading}
        disabled={!captchaToken}
      />
      <Notification text={"Пароль успешно заменён"} show={showSuccess} />
    </form>
  );
}

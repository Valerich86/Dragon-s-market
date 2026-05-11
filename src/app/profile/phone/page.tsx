"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import FormError from "@/components/UI/form-error";
import Link from "next/link";
import { GrCheckbox, GrCheckboxSelected } from "react-icons/gr";
import { useProfile } from "@/context/profile-context";
import CustomButton from "@/components/UI/custom-button";
import { RegisterFormErrors } from "@/lib/types";

export default function PhonePage() {
  const { general } = useProfile();
  const [currentPhone, setCurrentPhone] = useState(general.phone);
  const [errors, setErrors] = useState<RegisterFormErrors | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors(undefined);
    setIsLoading(true);
    const response = await fetch(`/api/auth/update/${general.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({phone: currentPhone}),
    });
    if (response.ok) {
      router.replace("/profile")
      router.refresh();
    } else if (response.status === 400) {
      setErrors((await response.json()).errors);
    } else {
      console.error("Ошибка регистрации");
    }
    setIsLoading(false);
  }

  return (
    <main aria-label="изменение номера телефона">
      <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full md:w-2/3 lg:w-1/2"
    >
      <fieldset>
        <label className="label">
          Новый номер (логин для аутентификации)
        </label>
        <input
          className="input"
          type="tel"
          value={currentPhone}
          placeholder="+7XXXXXXXXXX"
          onChange={(e) => setCurrentPhone(e.target.value)}
        />
        <div aria-live="polite" aria-atomic="true">
          {errors?.phone &&
            errors.phone.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>
      </fieldset>

      <CustomButton
        text="Сохранить"
        buttonType="submit"
        options="h-10 mt-6 px-6 min-w-70"
        isLoading={isLoading}
      />
    </form>
    </main>
  );
}

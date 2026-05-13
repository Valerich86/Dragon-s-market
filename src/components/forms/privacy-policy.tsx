"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormError from "../UI/form-error";
import CustomButton from "../UI/custom-button";
import { PrivacyPolicy, PrivacyPolicyFormErrors } from "@/lib/types";

export default function PrivacyPolicyForm({ data }: { data: PrivacyPolicy }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<PrivacyPolicyFormErrors | undefined>(
    undefined,
  );
  const [form, setForm] = useState({
    text: data.text,
    site_url: data.site_url,
    email: data.email,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors(undefined);
    try {
      const response = await fetch("/api/admin/privacy-policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const { errors } = await response.json();
        setErrors(errors);
      } else {
        alert("Данные успешно обновлены");
        router.replace("/admin");
        window.open("/privacy-policy", "_blank");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
      {/* текст */}
      <fieldset>
        <label className="label">Основной текст</label>
        <textarea
          className="input resize-none"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          rows={50}
        />
      </fieldset>
      <div aria-live="polite" aria-atomic="true">
        {errors?.text &&
          errors.text.map((error: string, i) => (
            <FormError errorField={error} key={i} />
          ))}
      </div>

      <div className="flex flex-col gap-2 w-full md:w-1/2 lg:w-1/3">
        {/* url */}
        <fieldset>
          <label className="label">URL сайта</label>
          <input
            className="input"
            type="url"
            value={form.site_url}
            onChange={(e) => setForm({ ...form, site_url: e.target.value })}
          />
        </fieldset>
        <div aria-live="polite" aria-atomic="true">
          {errors?.site_url &&
            errors.site_url.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>

        {/* почта */}
        <fieldset>
          <label className="label">Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </fieldset>
        <div aria-live="polite" aria-atomic="true">
          {errors?.email &&
            errors.email.map((error: string, i) => (
              <FormError errorField={error} key={i} />
            ))}
        </div>

        <CustomButton
          text={"Сохранить"}
          buttonType="submit"
          options="h-10 mt-6 px-6 min-w-70"
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}

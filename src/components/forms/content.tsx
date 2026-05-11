"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormError from "../UI/form-error";
import CustomButton from "../UI/custom-button";
import { Content, contentTypes } from "@/lib/types";

interface Props {
  method: "POST" | "PUT";
  content?: Content;
}

export default function ContentForm({ method, content = undefined }: Props) {
  const [form, setForm] = useState({
    id: 0,
    type: "news",
    title: "",
    info: "",
    link_href: "",
    link_name: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (method === "POST" || !content) return;
    setForm({
      id: content.id,
      type: content.type,
      title: content.title || "",
      info: content.info,
      link_href: content.link_href || "",
      link_name: content.link_name || "",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("type", form.type);
    formData.append("title", form.title || "");
    formData.append("info", form.info);
    formData.append("link_href", form.link_href || "");
    formData.append("link_name", form.link_name || "");
    formData.append("id", form.id.toString());

    // Добавляем файл, если выбран
    if (fileInputRef.current?.files?.[0]) {
      formData.append("media", fileInputRef.current.files[0]);
    }

    let url = "/api/admin/content";
    if (method === "PUT") url = `/api/admin/content`;

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      });
      if (!response.ok) {
        const { error, details } = await response.json();
        setError(`Ошибка обработки данных: ${details}`);
      } else {
        alert(
          method === "POST"
            ? "Данные успешно добавлены!"
            : "Данные успешно обновлены!",
        );
        router.replace("/admin/content");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? `Ошибка обработки данных: ${err.message}`
          : "Неизвестная ошибка",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full mt-5">
      {/* тип */}
      <fieldset>
        <label className="label">Тип контента</label>
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="input focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {contentTypes.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </fieldset>

      {/* заголовок */}
      {form.type !== "about" && (
        <fieldset>
          <label className="label">Заголовок (опционально)</label>
          <input
            autoFocus
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </fieldset>
      )}

      {/* текст */}
      <fieldset>
        <label className="label">Текстовая информация</label>
        <textarea
          className="input resize-none"
          value={form.info}
          onChange={(e) => setForm({ ...form, info: e.target.value })}
          rows={10}
        />
      </fieldset>

      {/* Загрузка медиа */}
      <div>
        <label className="label">Медиа‑файл (изображение или видео)</label>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*,video/*"
          className="input file:border-0 file:rounded-md file:bg-blue-50 file:px-4 file:py-2 file:text-indigo-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Поддерживаются изображения и видео. Максимальный размер: 50 MB.
        </p>
      </div>

      {/* ссылка */}
      <p className="text-xs mt-5">
        При необходимости можно добавить ссылку, например на telegram:
      </p>
      <fieldset>
        <label className="label">Имя ссылки (опционально)</label>
        <input
          className="input"
          value={form.link_name}
          onChange={(e) => setForm({ ...form, link_name: e.target.value })}
        />
      </fieldset>
      <fieldset>
        <label className="label">Адрес ссылки (опционально)</label>
        <input
          className="input"
          type="url"
          value={form.link_href}
          placeholder="например, https://t.me/dragonbazarmag"
          onChange={(e) => setForm({ ...form, link_href: e.target.value })}
        />
      </fieldset>

      {error && (
        <div aria-live="polite" aria-atomic="true">
          <FormError errorField={error} />
        </div>
      )}

      <CustomButton
        text={"Сохранить"}
        buttonType="submit"
        options="h-10 mt-6 px-6 min-w-70"
        isLoading={isLoading}
      />
    </form>
  );
}

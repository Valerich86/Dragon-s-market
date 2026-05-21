"use client";

import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "../UI/custom-button";
import { Product } from "@/lib/types";

export default function ProductForm({
  product,
  cloudPath,
}: {
  product: Product;
  cloudPath: string;
}) {
  const [form, setForm] = useState({
    description: product.description || "",
    composition: product.composition || "",
    is_active: product.is_active,
    order_minimum: product.order_minimum,
    status: product.status,
  });
  const [isLoading, setIsLoading] = useState(false);
  const statusOptions = [
    { value: "default", label: "по умолчанию" },
    { value: "productOfADay", label: "товар дня" },
  ];
  const router = useRouter();

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.refresh();
      router.back();
    } catch (error) {
      console.error("Ошибка");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 w-full mt-5"
    >
      {/* состав */}
      <fieldset>
        <label className="label">Состав</label>
        <textarea
          placeholder="поле для добавления состава товара"
          className="input resize-none"
          value={form.composition}
          onChange={(e) => setForm({ ...form, composition: e.target.value })}
          rows={10}
        />
      </fieldset>

      {/* описание */}
      <fieldset>
        <label className="label">Описание</label>
        <textarea
          placeholder="дополнительная информация (опционально)"
          className="input resize-none"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={10}
        />
      </fieldset>

      {/* активный */}
      <fieldset className="flex gap-5 my-5">
        <label className="label">Активный (показывать на сайте)</label>
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
      </fieldset>

      {/* активный */}
      <fieldset className="flex gap-5 my-5">
        <label className="label">Минимум в заказе</label>
        <input
          className="input"
          type="number"
          step={0.1}
          value={form.order_minimum}
          onChange={(e) => setForm({ ...form, order_minimum: Number(e.target.value) })}
        />
      </fieldset>

      {/* статус */}
      <fieldset>
        <label className="label">Статус</label>
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="input focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </fieldset>

      <CustomButton
        text={"Сохранить"}
        buttonType="submit"
        options="h-10 mt-6 px-6 min-w-70"
        isLoading={isLoading}
      />
    </form>
  );
}

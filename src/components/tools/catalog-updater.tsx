"use client";

import { useState, useEffect } from "react";
import CustomButton from "../UI/custom-button";
import type { Category } from "@/lib/types";

interface UpdatingInfo {
  newItems: number | null;
  updatedRemains: number | null;
  error: string | undefined;
}

export default function CatalogUpdater() {
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(0);
  const [newItems, setNewItems] = useState(0);

  const handleUpdateCatalog = async () => {
    setUpdating(true);
    setMessage("");
    setError("");
    setUpdated(0);
    setNewItems(0);
    setShowInfo(true);
    setMessage("Получаю категории...");
    const response = await fetch(`/api/categories`);
    const categories: Category[] = (await response.json()).data;
    for (let c of categories) {
      setMessage(`Обновляю категорию "${c.name}"...`);
      const response = await fetch(
        `/api/admin/products/refresh?categoryId=${c.id}`,
      );
      if (response.ok) {
        const { updated, newItems } = await response.json();
        setUpdated((prev) => prev + updated);
        setNewItems((prev) => prev + newItems);
      } else {
        const { error } = await response.json();
        setError(error);
      }
    }
    setMessage("Каталог обновлён");
    setUpdating(false);
  };

  return (
    <div className="w-full flex flex-col lg:items-start gap-3 mb-10">
      <CustomButton
        text="Обновить каталог"
        options="w-45 h-10"
        isLoading={updating}
        onClick={handleUpdateCatalog}
      />
      {showInfo && (
        <div className="text-xs">
          <p className="text-accent text-lg">{message}</p>
          <p>Загружено новых товаров: {newItems}</p>
          <p>Изменено товаров: {updated}</p>
          <p className="text-accent">{error}</p>
        </div>
      )}
    </div>
  );
}

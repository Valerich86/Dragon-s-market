"use client";

import { SubmitEvent, useState, useRef } from "react";
import CustomButton from "@/components/UI/custom-button";
import { font_heading, font_light } from "@/lib/fonts";
import type { UploadedFile, UploadResponse } from "@/lib/types";

export default function UploadImages() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const maxFiles = 20; // максимум 10 файлов за раз

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    setMessage("");
    if (!selectedFiles) return;

    if (selectedFiles.length > maxFiles) {
      setMessage(
        "Не пытайтесь загрузить больше 20 файлов. Дракон столько не унесёт!",
      );
      return;
    }

    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setUploadedFiles([]);
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length === 0 || files.length > maxFiles) return;

    setUploading(true);
    setMessage("");
    setUploadedFiles([]);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch("/api/admin/products/image-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Успешно загружено ${result.uploadedCount} файлов`);
        setFiles([]);
        setUploadedFiles(result.files);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage(`Ошибка: ${result.error}`);
      }
    } catch (error) {
      setMessage("Ошибка сети");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col px-5 gap-2 w-full md:w-2/3 lg:w-1/2 pt-10"
    >
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Загрузка изображений для товаров
      </h1>
      <fieldset>
        <div className="flex flex-col mb-5">
          <label className="label">Выберите изображения</label>
          <span className="text-xs italic opacity-50">
            (до 20 файлов за раз, только .png)
          </span>
        </div>
        <input
          ref={fileInputRef}
          className="input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          placeholder="До 20 файлов за раз"
          autoFocus
          required
          disabled={uploading}
        />
      </fieldset>

      {files.length > 0 && files.length <= maxFiles && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Выбранные файлы:</h3>
          <ul className="space-y-1">
            {files.map((file, index) => (
              <li key={index} className="text-sm text-gray-600">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      <CustomButton
        text={uploading ? "Загрузка..." : "Загрузить"}
        buttonType="submit"
        options="h-10 mt-6 px-3"
        isLoading={uploading}
      />

      {message && (
        <div
          className={`mt-4 p-3 rounded ${
            message.startsWith("Успешно")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-accent"
          }`}
        >
          {message}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Загруженные файлы:</h3>
          <ul className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="text-sm">
                {file.originalName} → {file.storedName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}

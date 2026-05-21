import { font_light } from "@/lib/fonts";
import { Metadata } from "next";
import { getPrivacyPolicy } from "@/lib/server-data";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    'Политика конфиденциальности магазина "Драконий базар", г. Пермь',
};

export default async function PrivacyPolicyPage() {
  const { data } = await getPrivacyPolicy();

  return (
    <main
      aria-label="privacy-policy"
      className="w-full min-h-screen flex flex-col gap-10 x-spacing py-20 text-sm"
    >
      <h1 className={`${font_light.className} uppercase text-base`}>
        Политика обработки персональных данных
      </h1>
      <div className="flex flex-wrap gap-5">
        <p>
          URL сайта:{" "}
          <a
            href="mailto:daleksek@mail.ru"
            target="_blank"
            className="text-indigo-600 underline"
          >
            {data.site_url}
          </a>
        </p>
        <p>
          Email для обращений:{" "}
          <a
            href="mailto:daleksek@mail.ru"
            target="_blank"
            className="text-indigo-600 underline"
          >
            {data.email}
          </a>
        </p>
      </div>

      <pre className="whitespace-pre-wrap text-sm">{data.text}</pre>
      
      <p>
        Дата последнего обновления:{" "}
        <strong>{new Date(data.updated_at).toLocaleDateString()}</strong>
      </p>

    </main>
  );
}

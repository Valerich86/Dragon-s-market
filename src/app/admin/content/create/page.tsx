import ContentForm from "@/components/forms/content";

export default async function ContentCreatePage() {
  return (
    <main aria-label="Добавление контента" className="w-full lg:w-1/2 px-5 ">
      <ContentForm method="POST"/>
    </main>
  );
}

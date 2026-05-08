import ContentForm from "@/components/forms/content";
import { getOneFromContent } from "@/lib/actions";

export default async function ContentDetailsPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  const {content} = await getOneFromContent(id);

  return (
    <main aria-label="Детали контента" className="w-full lg:w-1/2 px-5 ">
      <ContentForm method="PUT" content={content}/>
    </main>
  );
}

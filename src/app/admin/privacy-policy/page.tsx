import PrivacyPolicyForm from "@/components/forms/privacy-policy";
import { getPrivacyPolicy } from "@/lib/actions";
import { font_light } from "@/lib/fonts";

export default async function PrivacyPolicyDetailsPage() {
  const { data } = await getPrivacyPolicy();

  return (
    <div className="flex flex-col w-full overflow-x-hidden px-5 lg:pr-25 py-10">
      <h1 className={`${font_light.className} uppercase mb-10`}>
        Управление политикой конфиденциальности
      </h1>
      <PrivacyPolicyForm data={data} />
    </div>
  );
}

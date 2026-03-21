'use client';

import PaintCaption from "@/components/UI/paint-caption";
import { useUser } from "@/context/user-context";
import { font_bold, font_light, font_mg } from "@/lib/fonts";

export default function General() {
  const {general} = useUser();

  return (
    <section aria-label="Общая информация" className="w-full">
      <div className="flex items-baseline gap-5 w-full">
        <p>С нами с</p>
        <div className="relative -translate-y-5 lg:-translate-y-6">
          <PaintCaption caption={new Date(general.created_at).toLocaleDateString()}/>
        </div>
      </div>
    </section>
  );
}

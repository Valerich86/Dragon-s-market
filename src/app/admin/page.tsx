import DarknedImage from "@/components/UI/darkned-image";
import { font_heading } from "@/lib/fonts";

export default function AdminMain() {
  return (
    <>
      <DarknedImage
        src={"/images/interior.png"}
        options="w-full h-screen bg-right"
      />
      <h1
        className={
          `${font_heading.className} text-left uppercase text-2xl lg:text-5xl z-20
          translate-y-[60vh] translate-x-5`
        }
      >
        Административная панель
      </h1>
    </>
  );
}

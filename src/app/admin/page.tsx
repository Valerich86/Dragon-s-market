import HeroBackground from "@/components/UI/hero-background";
import { font_heading } from "@/lib/fonts";

export default function AdminMain() {
  return (
    <div className="w-full overflow-hidden">
      <HeroBackground src={"/images/interior.png"} />
      <h1
        className={`${font_heading.className} absolute uppercase text-2xl text-center md:text-left
          md:text-5xl z-20 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2`}
      >
        {" "}
        Административная панель
      </h1>
    </div>
  );
}

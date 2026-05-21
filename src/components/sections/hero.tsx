import { font_light, font_heading } from "@/lib/fonts";
import HeroBackground from "../UI/hero-background";

export default async function HeroSection() {

  return (
    <section
      aria-label="hero-секция"
      className="w-full h-screen flex flex-col gap-20 lg:gap-5 justify-end relative"
    >
      <HeroBackground src={"/images/bg4.webp"}/>
      <div
        className={
          `${font_heading.className} absolute top-[55%] uppercase 
          text-left text-2xl lg:text-5xl w-full px-3 lg:px-10`
        }
      >
        <p>Азия на вкус:</p>
        <p>от привычного к невероятному!</p>
      </div>
      <div className={
        `w-full flex flex-col lg:flex-row lg:justify-between gap-1/4 
        justify-center lg:items-end mb-20 lg:mb-10 z-10 lg:pr-30`
      }>
        <div className="mb-10">
          <p className={`${font_light.className} ml-3 lg:ml-10 mb-2`}>
            Наш адрес:
          </p>
          <p className="animate-address bg-accent px-3 lg:px-10 text-xl lg:text-3xl">
            Пермь, Бульвар Гагарина, 83
          </p>
        </div>
      </div>
    </section>
  );
}

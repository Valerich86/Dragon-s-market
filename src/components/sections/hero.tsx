import {
  font_accent,
  font_light,
  font_bold,
  font_mg,
  font_heading,
} from "@/lib/fonts";
import DarknedImage from "../UI/darkned-image";
import DayProduct from "../UI/day-product";
import { pool } from "@/lib/db";

export default async function HeroSection({
  cloudPath,
}: {
  cloudPath: string;
}) {
  const status = "productOfADay";
  const dayProduct = await pool.query(
    `SELECT * FROM products WHERE status=$1 AND is_active=TRUE AND remains>0`,
    [status],
  );

  return (
    <section
      area-label="hero-секция"
      className="w-full h-screen flex flex-col gap-20 lg:gap-5 justify-end relative"
    >
      <DarknedImage
        src={"/images/bg4.webp"}
        options="w-screen h-screen bg-right"
      />
      <div
        className={`${font_heading.className} uppercase text-left text-2xl lg:text-5xl w-full px-3 lg:px-10 z-10`}
      >
        <p>Азия на вкус:</p>
        <p>от привычного к невероятному!</p>
      </div>
      <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-1/4 justify-center lg:items-end mb-20 lg:mb-10 z-10 lg:pr-30">
        <div className="mb-10">
          <p className={`${font_light.className} ml-3 lg:ml-10 mb-2`}>
            Наш адрес:
          </p>
          <p className="animate-address bg-accent px-3 lg:px-10 text-xl lg:text-3xl">
            Пермь, Бульвар Гагарина, 83
          </p>
        </div>
        {dayProduct && (
          <DayProduct cloudPath={cloudPath} product={dayProduct?.rows[0]} />
        )}
      </div>
    </section>
  );
}

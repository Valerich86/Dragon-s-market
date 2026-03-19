import { font_light } from "@/lib/fonts";
import DarknedImage from "../UI/darkned-image";
import DayProduct from "../UI/day-product";
import { pool } from "@/lib/db";

export default async function HeroSection({cloudPath}:{cloudPath:string}) {
  const status = "productOfADay";
  const dayProduct = await pool.query(`SELECT * FROM products WHERE status=$1 AND is_active=TRUE AND remains>0`, [status]);

  return (
    <section area-label="hero-секция" className="w-full h-screen flex justify-center items-end relative ">
      <DarknedImage src={"/images/bg4.webp"} options="w-screen h-screen bg-right"/>
      <div className="w-full flex flex-col lg:flex-row lg:justify-between gap-1/4 justify-center lg:items-end mb-20 lg:mb-10 z-10 lg:pr-30">
        <div className="mb-10">
          <p className={`${font_light.className} ml-3 lg:ml-10 mb-2`}>Наш адрес:</p>
          <p className="animate-address bg-accent px-3 lg:px-10 text-xl lg:text-3xl">Пермь, Бульвар Гагарина, 83</p>
        </div>
        {dayProduct && <DayProduct cloudPath={cloudPath} product={dayProduct?.rows[0]}/>}
      </div>
    </section>
  );
}

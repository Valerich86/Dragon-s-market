import { font_accent } from "@/lib/fonts";
import InfoList from "../lists/info";
import NavLink from "../UI/nav-link";

export default function AssortmentSection() {
  return (
    <section
      area-label="ассортимент"
      className="section"
    >
      <h1 className={`${font_accent.className} heading`}>У нас на полках</h1>
      <InfoList type={"assortment"} limit={3}/>
      <div className="w-full flex justify-end x-spacing ">
        <NavLink href="/about#assortment" name="Подробнее об ассортименте ⇨" options="text-accent fire:text-gray-200 animate-pulse"/>
      </div>
    </section>
  );
}

import { font_accent } from "@/lib/fonts";
import InfoList from "../lists/info";
import NavLink from "../UI/nav-link";

export default function AboutSection({cloudPath}:{cloudPath:string}) {

  return (
    <section
      area-label="немного о нас"
      className="section"
    >
      <h1 className={`${font_accent.className} heading`}>Немного о нас</h1>
      <InfoList type={"about"} limit={1} cloudPath={cloudPath}/>
      <div className="w-full flex justify-end x-spacing ">
        <NavLink href="/about" name="Подробнее о нас ⇨" options="text-accent fire:text-gray-200 animate-pulse"/>
      </div>
    </section>
  );
}

import { font_accent } from "@/lib/fonts";
import InfoList from "../lists/info";
import NavLink from "../UI/nav-link";

export default function NewsSection({cloudPath}:{cloudPath:string}) {
  

  return (
    <section
      area-label="новости или конкурсы"
      className="section"
    >
      <h1 className={`${font_accent.className} heading`}>Что нового?</h1>
      <InfoList type={"news"} limit={2} cloudPath={cloudPath}/>
      <div className="w-full flex justify-end x-spacing ">
        <NavLink href="/news" name="Все новости ⇨" options="text-accent fire:text-gray-200 animate-pulse"/>
      </div>
    </section>
  );
}

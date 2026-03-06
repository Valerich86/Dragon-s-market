import NewsList from "../lists/news";
import NavLink from "../UI/nav-link";

export default function NewsSection() {
  

  return (
    <section
      area-label="новости или конкурсы"
      className="section"
    >
      <NewsList />
      <div className="w-full flex justify-end x-spacing ">
        <NavLink href="news" name="Все новости ⇨" options="text-accent fire:text-gray-200 animate-pulse"/>
      </div>
    </section>
  );
}

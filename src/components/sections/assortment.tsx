import { font_accent } from "@/lib/fonts";
import NavLink from "../UI/nav-link";
import { pool } from "@/lib/db";
import NoInfo from "../no-info";
import InfoItem from "../cards/info-item";

export default async function AssortmentSection({
  cloudPath,
}: {
  cloudPath: string;
}) {
  // const data = await pool.query(
  //   `SELECT * FROM info WHERE info_type = 'assortment' ORDER BY created_at DESC LIMIT 4`,
  // );

  // if (!data || data.rows.length === 0) return <NoInfo />;

  return (
    <section area-label="ассортимент" className="section">
      <h1 className={`${font_accent.className} heading`}>У нас на полках</h1>
      {/* <div className="w-full flex flex-col justify-center items-center gap-10 md:gap-0">
        {data.rows.map((item) => (
          <InfoItem key={item.id} item={item} cloudPath={cloudPath} />
        ))}
      </div>
      <div className="w-full flex justify-end x-spacing ">
        <NavLink
          href="/assortment"
          name="Подробнее об ассортименте ⇨"
          options="text-accent fire:text-gray-200 animate-pulse"
        />
      </div> */}
    </section>
  );
}

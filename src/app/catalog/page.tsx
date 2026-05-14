import ProductsList from "@/components/sections/products-list";
import { getDiscountedProducts } from "@/lib/actions";
import { verifySession } from "@/lib/auth";

export default async function DiscountedProductsPage() {
  const session = await verifySession();
  let userId = 0;
  if (session) userId = session.userId;
  const { products, title } = await getDiscountedProducts(userId);

  return (
    <section
      aria-label="все товары"
      className="w-full flex flex-wrap gap-5 items-center justify-between py-15"
    >
      <ProductsList products={products} categoryName={title} />
    </section>
  );
}

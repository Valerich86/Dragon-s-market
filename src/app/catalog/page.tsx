import ProductsList from "@/components/sections/products-list";

export default function AllProducts() {
  return (
    <main
      aria-label="все товары"
      className="w-full flex flex-wrap gap-5 items-center justify-start py-15"
    >
      <ProductsList category={{id: 0, name: "Все"}}/>
    </main>
  );
}

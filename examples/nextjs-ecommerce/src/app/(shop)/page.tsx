import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";

export default async function ShopPage() {
  const products = await db.product.findMany({ where: { active: true } });
  return (
    <main className="grid grid-cols-2 gap-4 p-8 md:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </main>
  );
}

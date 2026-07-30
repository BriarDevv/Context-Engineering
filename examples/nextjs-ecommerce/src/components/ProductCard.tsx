import type { Product } from "@prisma/client";
import { formatCents } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  return (
    <a href={`/products/${product.slug}`} className="block rounded border p-4">
      <h2>{product.name}</h2>
      <p>{formatCents(product.priceCents)}</p>
    </a>
  );
}

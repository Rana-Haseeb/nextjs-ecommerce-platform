import Image from "next/image";
import Link from "next/link";

import type { ProductListItem } from "@/lib/db/queries/products";

export default function ProductCard({
  product,
  index = 0,
}: {
  product: ProductListItem;
  index?: number;
}) {
  const isSoldOut = product.stock === 0;
  const isLowStock = !isSoldOut && product.stock <= 5;

  const stockLabel = isSoldOut
    ? "Sold out"
    : isLowStock
      ? `Only ${product.stock} left`
      : "In stock";

  const stockColor = isSoldOut
    ? "text-ink-soft"
    : isLowStock
      ? "text-gold"
      : "text-olive";

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex animate-rise flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition duration-700 ease-out group-hover:scale-[1.045] ${
            isSoldOut ? "grayscale-[40%] opacity-70" : ""
          }`}
        />
        {isSoldOut && (
          <span className="absolute left-3 top-3 bg-ink px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-cream">
            Sold out
          </span>
        )}
        {isLowStock && (
          <span className="absolute left-3 top-3 bg-gold px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-cream">
            Low stock
          </span>
        )}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3 border-t border-line pt-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent">
            {product.category}
          </p>
          <h3 className="mt-1 font-display text-lg leading-snug text-ink">
            {product.title}
          </h3>
          <p
            className={`mt-1 text-[11px] font-medium uppercase tracking-[0.1em] ${stockColor}`}
          >
            {stockLabel}
          </p>
        </div>
        <p className="whitespace-nowrap font-display text-lg text-ink">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProductById } from "@/lib/db/queries/products";
import ProductGallery from "@/components/ui/ProductGallery";
import AddToCartButton from "@/components/ui/AddToCartButton";

type Params = { id: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  return {
    title: product ? `${product.title} — Maison & Co.` : "Product not found",
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  const isSoldOut = product.stock === 0;
  const isLowStock = !isSoldOut && product.stock <= 5;

  const stockLabel = isSoldOut
    ? "Sold out"
    : isLowStock
      ? `Only ${product.stock} left in stock`
      : "In stock";

  const stockColor = isSoldOut
    ? "text-ink-soft"
    : isLowStock
      ? "text-gold"
      : "text-olive";

  const dotColor = isSoldOut
    ? "bg-ink-soft"
    : isLowStock
      ? "bg-gold"
      : "bg-olive";

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
      <nav className="mb-10 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
        <Link href="/" className="transition hover:text-ink">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.category}</span>
      </nav>

      <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
        <div className="animate-rise">
          <ProductGallery images={product.images} title={product.title} />
        </div>

        <div className="flex animate-rise flex-col" style={{ animationDelay: "80ms" }}>
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-accent">
            {product.category}
          </p>
          <h1 className="mt-3 font-display text-4xl italic leading-tight text-ink lg:text-5xl">
            {product.title}
          </h1>
          <p className="mt-5 font-display text-2xl text-ink">
            ${product.price.toFixed(2)}
          </p>

          <div className="mt-4 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em]">
            <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
            <span className={stockColor}>{stockLabel}</span>
          </div>

          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <div className="mt-10 border-t border-line pt-8">
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.images[0],
                stock: product.stock,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

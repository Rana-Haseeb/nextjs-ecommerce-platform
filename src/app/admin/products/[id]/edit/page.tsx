import { notFound } from "next/navigation";

import { getProductById } from "@/lib/db/queries/products";
import ProductForm from "@/components/ui/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div>
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
        Inventory
      </span>
      <h1 className="mt-3 font-display text-4xl italic text-ink">
        Edit product
      </h1>
      <p className="mt-2 text-sm text-ink-soft">{product.title}</p>

      <div className="mt-10">
        <ProductForm product={product} />
      </div>
    </div>
  );
}

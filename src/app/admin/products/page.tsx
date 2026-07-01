import Link from "next/link";

import { getProducts } from "@/lib/db/queries/products";
import ProductsTable from "@/components/ui/ProductsTable";

export default async function AdminProductsPage() {
  const products = await getProducts({});

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
            Inventory
          </span>
          <h1 className="mt-3 font-display text-4xl italic text-ink">
            Products
          </h1>
          <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.25em] text-cream transition hover:bg-accent"
        >
          New product
        </Link>
      </div>

      <div className="mt-8">
        <ProductsTable products={products} />
      </div>
    </div>
  );
}

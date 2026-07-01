import Link from "next/link";

import type { ProductListItem } from "@/lib/db/queries/products";
import DeleteProductForm from "@/components/ui/DeleteProductForm";

export default function ProductsTable({
  products,
}: {
  products: ProductListItem[];
}) {
  if (products.length === 0) {
    return (
      <div className="border border-line py-16 text-center">
        <p className="text-sm text-ink-soft">No products yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left text-[10px] font-medium uppercase tracking-[0.15em] text-ink-soft">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Stock</th>
            <th className="px-4 py-3 font-medium">Created</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {products.map((product) => (
            <tr key={product.id} className="transition hover:bg-paper">
              <td className="px-4 py-4 font-display text-base text-ink">
                {product.title}
              </td>
              <td className="px-4 py-4 text-ink-soft">{product.category}</td>
              <td className="px-4 py-4 tabular-nums text-ink">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-4 py-4 tabular-nums">
                <span
                  className={
                    product.stock === 0
                      ? "text-accent-dark"
                      : product.stock <= 5
                        ? "text-gold"
                        : "text-ink"
                  }
                >
                  {product.stock}
                </span>
              </td>
              <td className="px-4 py-4 text-ink-soft">
                {new Date(product.dateCreated).toLocaleDateString()}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-4">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink-soft transition hover:text-accent"
                  >
                    Edit
                  </Link>
                  <DeleteProductForm id={product.id} title={product.title} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

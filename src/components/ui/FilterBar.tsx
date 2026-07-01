import Link from "next/link";

import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { SORT_OPTIONS, type SortOption } from "@/lib/db/queries/products";

function buildQuery(category: string | undefined, sort: SortOption) {
  const query: Record<string, string> = {};
  if (category) query.category = category;
  if (sort !== "newest") query.sort = sort;
  return query;
}

export default function FilterBar({
  activeCategory,
  activeSort,
  count,
}: {
  activeCategory?: string;
  activeSort: SortOption;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-line py-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-3xl italic text-ink">The Shop</h2>
        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
          {count} {count === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div className="flex flex-col gap-4 text-[11px] font-medium uppercase tracking-[0.15em] sm:items-end">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href={{ pathname: "/", query: buildQuery(undefined, activeSort) }}
            className={`transition hover:text-ink ${
              !activeCategory
                ? "text-accent underline underline-offset-4"
                : "text-ink-soft"
            }`}
          >
            All
          </Link>
          {PRODUCT_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={{
                pathname: "/",
                query: buildQuery(category, activeSort),
              }}
              className={`transition hover:text-ink ${
                activeCategory === category
                  ? "text-accent underline underline-offset-4"
                  : "text-ink-soft"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {SORT_OPTIONS.map((option) => (
            <Link
              key={option.value}
              href={{
                pathname: "/",
                query: buildQuery(activeCategory, option.value),
              }}
              className={`transition hover:text-ink ${
                activeSort === option.value
                  ? "text-ink"
                  : "text-ink-soft/70"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

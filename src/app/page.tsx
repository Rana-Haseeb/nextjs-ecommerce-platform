import Image from "next/image";

import { getProducts, type SortOption } from "@/lib/db/queries/products";
import ProductCard from "@/components/ui/ProductCard";
import FilterBar from "@/components/ui/FilterBar";

type SearchParams = { category?: string; sort?: string };

const VALID_SORTS: SortOption[] = ["newest", "price-asc", "price-desc"];

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const category = params.category;
  const sort = VALID_SORTS.includes(params.sort as SortOption)
    ? (params.sort as SortOption)
    : "newest";

  const products = await getProducts({ category, sort });

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:py-28">
          <div className="relative animate-fade-in">
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
              The Autumn Edit — 2026
            </span>
            <h1 className="mt-6 font-display text-5xl italic leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
              Objects worth
              <br />
              <span className="not-italic text-accent">living</span> with.
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-soft">
              A considered collection of everyday essentials — sourced for
              craft, built to last, chosen to be used.
            </p>
            <a
              href="#shop"
              className="mt-10 inline-flex items-center gap-3 border-b border-ink pb-1 text-sm font-medium uppercase tracking-[0.15em] text-ink transition hover:gap-5 hover:border-accent hover:text-accent"
            >
              Browse the collection
              <span aria-hidden>→</span>
            </a>
          </div>

          <div aria-hidden className="relative hidden lg:block">
            <div className="pointer-events-none absolute -inset-x-10 top-1/2 -z-10 -translate-y-1/2 select-none font-display text-[420px] italic leading-none text-ink/[0.045]">
              &amp;
            </div>
            <div className="relative flex h-full items-center justify-center">
              <div className="relative h-72 w-56 -rotate-6 border-8 border-paper bg-paper shadow-[0_25px_60px_-15px_rgba(28,23,18,0.35)]">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=650&q=80&auto=format&fit=crop"
                  alt=""
                  fill
                  sizes="224px"
                  className="object-cover"
                />
              </div>
              <div className="relative -ml-16 h-64 w-48 rotate-6 border-8 border-paper bg-paper shadow-[0_25px_60px_-15px_rgba(28,23,18,0.35)]">
                <Image
                  src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&h=650&q=80&auto=format&fit=crop"
                  alt=""
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-6 pb-28 lg:px-10">
        <FilterBar activeCategory={category} activeSort={sort} count={products.length} />

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-24 text-center">
            <p className="font-display text-2xl italic text-ink">
              Nothing here yet.
            </p>
            <p className="text-sm text-ink-soft">
              Try a different category or check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

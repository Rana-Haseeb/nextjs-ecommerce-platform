import ProductForm from "@/components/ui/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
        Inventory
      </span>
      <h1 className="mt-3 font-display text-4xl italic text-ink">
        New product
      </h1>
      <p className="mt-2 text-sm text-ink-soft">
        Add a new piece to the collection.
      </p>

      <div className="mt-10">
        <ProductForm />
      </div>
    </div>
  );
}

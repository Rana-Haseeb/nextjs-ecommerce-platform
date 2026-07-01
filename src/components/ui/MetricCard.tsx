export default function MetricCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="border border-line p-6">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
        {label}
      </p>
      <p
        className={`mt-3 font-display text-3xl ${
          accent ? "text-accent" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

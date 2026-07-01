"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 gap-2 border-b border-line pb-4 lg:w-48 lg:flex-col lg:gap-1 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
      <span className="hidden text-[11px] font-medium uppercase tracking-[0.3em] text-accent lg:mb-4 lg:block">
        Admin
      </span>
      {LINKS.map((link) => {
        const isActive =
          link.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-1 py-2 text-sm font-medium transition lg:px-0 ${
              isActive
                ? "text-accent"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}

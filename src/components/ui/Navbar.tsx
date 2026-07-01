import Link from "next/link";

import { auth } from "@/auth";
import { signOutAction } from "@/actions/auth";
import CartTrigger from "@/components/ui/CartTrigger";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-ink text-cream">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="font-display text-2xl italic tracking-tight text-cream"
        >
          Maison<span className="text-accent">&amp;</span>Co.
        </Link>

        <nav className="hidden items-center gap-8 text-[11px] font-medium uppercase tracking-[0.25em] text-cream/60 md:flex">
          <Link href="/" className="transition hover:text-cream">
            Shop
          </Link>
          <Link href="/#shop" className="transition hover:text-cream">
            Collection
          </Link>
        </nav>

        <div className="flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.2em]">
          <CartTrigger />
          {session?.user ? (
            <>
              <span className="hidden text-cream/50 sm:inline">
                {session.user.name?.split(" ")[0] ?? session.user.email}
              </span>
              {session.user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-gold transition hover:text-cream"
                >
                  Admin
                </Link>
              )}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="text-cream/70 transition hover:text-accent"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-cream/70 transition hover:text-cream"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-cream/30 px-4 py-2 normal-case tracking-normal transition hover:border-cream hover:bg-cream hover:text-ink"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

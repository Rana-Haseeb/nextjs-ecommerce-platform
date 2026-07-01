"use client";

import { useActionState } from "react";
import Link from "next/link";

import { loginAction, type ActionState } from "@/actions/auth";

const initialState: ActionState = {};

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={formAction} className="w-full max-w-sm space-y-6">
      <div>
        <label
          htmlFor="email"
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-2 w-full border-b border-line bg-transparent px-1 py-2 text-sm text-ink outline-none transition focus:border-ink"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-2 w-full border-b border-line bg-transparent px-1 py-2 text-sm text-ink outline-none transition focus:border-ink"
        />
      </div>

      {state.error && (
        <p className="text-sm text-accent-dark" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-ink py-4 text-xs font-medium uppercase tracking-[0.25em] text-cream transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-ink underline underline-offset-4 hover:text-accent">
          Sign up
        </Link>
      </p>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import Link from "next/link";

import { signUpAction, type ActionState } from "@/actions/auth";

const initialState: ActionState = {};

export default function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState
  );

  return (
    <form action={formAction} className="w-full max-w-sm space-y-6">
      <div>
        <label
          htmlFor="name"
          className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className="mt-2 w-full border-b border-line bg-transparent px-1 py-2 text-sm text-ink outline-none transition focus:border-ink"
        />
      </div>

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
          minLength={6}
          autoComplete="new-password"
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
        {isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-ink underline underline-offset-4 hover:text-accent">
          Sign in
        </Link>
      </p>
    </form>
  );
}

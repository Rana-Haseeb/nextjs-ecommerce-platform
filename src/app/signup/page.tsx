import SignupForm from "@/components/ui/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-24">
      <div className="text-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
          Join the house
        </span>
        <h1 className="mt-3 font-display text-4xl italic text-ink">
          Create an account
        </h1>
      </div>
      <SignupForm />
    </div>
  );
}

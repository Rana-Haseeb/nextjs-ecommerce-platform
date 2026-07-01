import LoginForm from "@/components/ui/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-24">
      <div className="text-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-accent">
          Welcome back
        </span>
        <h1 className="mt-3 font-display text-4xl italic text-ink">Sign in</h1>
      </div>
      <LoginForm />
    </div>
  );
}

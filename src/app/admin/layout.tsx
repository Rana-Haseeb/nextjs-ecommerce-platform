import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminNav from "@/components/ui/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 px-6 py-12 lg:flex-row lg:gap-16 lg:px-10 lg:py-16">
      <AdminNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

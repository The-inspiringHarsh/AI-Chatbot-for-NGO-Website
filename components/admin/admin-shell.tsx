"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bot, LayoutDashboard, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <main className="min-h-screen bg-aurora text-white">{children}</main>;
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/admin/login");
  }

  return (
    <main className="min-h-screen bg-aurora text-white">
      <div className="soft-grid min-h-screen">
        <div className="mx-auto flex max-w-7xl gap-4 p-4">
          <aside className="glass sticky top-4 hidden h-[calc(100vh-32px)] w-72 rounded-xl p-4 md:block">
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-foundation-teal text-ink">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Amaanitvam Admin</div>
                <div className="text-xs text-slate-400">Knowledge operations</div>
              </div>
            </Link>

            <nav className="mt-8 space-y-2">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg bg-white/10 px-3 py-3 text-sm text-foundation-teal"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </nav>

            <Button variant="secondary" className="absolute bottom-4 left-4 right-4" onClick={logout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </aside>

          <section className="min-w-0 flex-1">{children}</section>
        </div>
      </div>
    </main>
  );
}

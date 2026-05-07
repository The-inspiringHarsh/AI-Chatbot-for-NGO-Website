"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@amaanitvam.org");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    setLoading(false);
    if (!response.ok) {
      toast.error("Invalid credentials");
      return;
    }

    toast.success("Welcome back");
    router.push("/admin");
  }

  return (
    <div className="soft-grid grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-xl p-7">
        <div className="mb-7 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-foundation-teal text-ink">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Admin Login</h1>
            <p className="text-sm text-slate-400">Manage FAQs, updates, and chatbot knowledge.</p>
          </div>
        </div>

        <label className="text-sm text-slate-300">Email</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-white/8 px-3 text-sm outline-none focus:border-foundation-teal"
        />

        <label className="mt-4 block text-sm text-slate-300">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-white/8 px-3 text-sm outline-none focus:border-foundation-teal"
        />

        <Button className="mt-6 w-full" disabled={loading}>
          <LockKeyhole className="h-4 w-4" />
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Default dev password is <span className="text-slate-300">admin12345</span>. Change it in
          production with environment variables.
        </p>
      </form>
    </div>
  );
}

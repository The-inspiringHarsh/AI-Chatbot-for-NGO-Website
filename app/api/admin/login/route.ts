import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { signAdminToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(request: Request) {
  const { email, password } = loginSchema.parse(await request.json());
  const adminEmail = process.env.ADMIN_EMAIL || "admin@amaanitvam.org";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

  if (email !== adminEmail || password !== adminPassword) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const token = await signAdminToken(email);
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return NextResponse.json({ ok: true });
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Knowledge } from "@/models/Knowledge";

const updateSchema = z.object({
  type: z.enum(["about", "project", "faq", "donation", "volunteer", "internship", "contact", "update"]),
  title: z.string().min(3),
  content: z.string().min(10),
  tags: z.array(z.string()).default([]),
  locale: z.enum(["en", "hi", "ta"]).default("en")
});

async function requireAdmin() {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get("admin_token")?.value);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await connectToDatabase();
  if (!db) {
    return NextResponse.json({ error: "MongoDB is required for admin writes." }, { status: 503 });
  }

  try {
    const { id } = await params;
    const payload = updateSchema.parse(await request.json());
    const item = await Knowledge.findByIdAndUpdate(id, payload, { new: true });
    return NextResponse.json({ item });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid form data." }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not update knowledge item." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await connectToDatabase();
  if (!db) {
    return NextResponse.json({ error: "MongoDB is required for admin writes." }, { status: 503 });
  }

  const { id } = await params;
  await Knowledge.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}

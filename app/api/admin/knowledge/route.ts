import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { foundationKnowledge } from "@/data/knowledge-base";
import { verifyAdminToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Knowledge } from "@/models/Knowledge";

const knowledgeSchema = z.object({
  type: z.enum(["about", "project", "faq", "donation", "volunteer", "internship", "contact", "update"]),
  title: z.string().min(3),
  content: z.string().min(10),
  tags: z.array(z.string()).default([]),
  locale: z.enum(["en", "hi", "ta"]).default("en")
});

type KnowledgeDocument = {
  _id: { toString: () => string };
  type: string;
  title: string;
  content: string;
  tags?: string[];
  locale?: "en" | "hi" | "ta";
};

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  return verifyAdminToken(token);
}

export async function GET() {
  const db = await connectToDatabase().catch((error) => {
    console.warn("MongoDB admin knowledge lookup failed. Returning bundled data.", error);
    return null;
  });

  if (!db) {
    return NextResponse.json({ items: foundationKnowledge, readonly: true });
  }

  try {
    const items = (await Knowledge.find().sort({ updatedAt: -1 }).lean()) as unknown as KnowledgeDocument[];
    return NextResponse.json({
      items: items.map((item) => ({
        id: item._id.toString(),
        type: item.type,
        title: item.title,
        content: item.content,
        tags: item.tags ?? [],
        locale: item.locale ?? "en"
      })),
      readonly: false
    });
  } catch (error) {
    console.warn("MongoDB admin knowledge query failed. Returning bundled data.", error);
    return NextResponse.json({ items: foundationKnowledge, readonly: true });
  }
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await connectToDatabase();
  if (!db) {
    return NextResponse.json({ error: "MongoDB is required for admin writes." }, { status: 503 });
  }

  try {
    const payload = knowledgeSchema.parse(await request.json());
    const item = await Knowledge.create(payload);
    return NextResponse.json({ item: { ...item.toObject(), id: item._id.toString() } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid form data." }, { status: 400 });
    }

    return NextResponse.json({ error: "Could not save knowledge item." }, { status: 500 });
  }
}

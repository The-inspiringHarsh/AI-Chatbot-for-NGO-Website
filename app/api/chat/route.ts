import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAssistantReply } from "@/lib/ai";
import { connectToDatabase } from "@/lib/mongodb";
import { retrieveContext } from "@/lib/retrieval";
import { Conversation } from "@/models/Conversation";

const chatSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1).max(2000),
  locale: z.enum(["en", "hi", "ta"]).default("en"),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .default([])
});

export async function POST(request: Request) {
  try {
    const body = chatSchema.parse(await request.json());
    const context = await retrieveContext(body.message, body.locale);
    const reply = await generateAssistantReply({
      message: body.message,
      history: body.history,
      context,
      locale: body.locale
    });

    const db = await connectToDatabase().catch((error) => {
      console.warn("MongoDB conversation save skipped.", error);
      return null;
    });
    if (db) {
      await Conversation.findOneAndUpdate(
        { sessionId: body.sessionId },
        {
          $set: { locale: body.locale },
          $push: {
            messages: {
              $each: [
                { role: "user", content: body.message },
                { role: "assistant", content: reply }
              ]
            }
          }
        },
        { upsert: true }
      );
    }

    return NextResponse.json({
      reply,
      sources: context.map((item) => ({ id: item.id, title: item.title, type: item.type }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to process chat." },
      { status: 400 }
    );
  }
}

import mongoose, { Schema, models } from "mongoose";

const KnowledgeSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["about", "project", "faq", "donation", "volunteer", "internship", "contact", "update"],
      required: true
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    locale: { type: String, enum: ["en", "hi", "ta"], default: "en" }
  },
  { timestamps: true }
);

KnowledgeSchema.index({ title: "text", content: "text", tags: "text" });

export const Knowledge = models.Knowledge || mongoose.model("Knowledge", KnowledgeSchema);

import mongoose, { Schema, models } from "mongoose";

const MessageSchema = new Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true }
  },
  { _id: false, timestamps: true }
);

const ConversationSchema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    locale: { type: String, enum: ["en", "hi", "ta"], default: "en" },
    messages: [MessageSchema]
  },
  { timestamps: true }
);

export const Conversation =
  models.Conversation || mongoose.model("Conversation", ConversationSchema);

import type { KnowledgeItem } from "@/data/knowledge-base";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const languageName: Record<string, string> = {
  en: "English",
  hi: "Hindi",
  ta: "Tamil"
};

function fallbackAnswer(message: string, context: KnowledgeItem[], locale: string) {
  const intro =
    locale === "hi"
      ? "मैं Amaanitvam Foundation का AI सहायक हूं।"
      : locale === "ta"
        ? "நான் Amaanitvam Foundation-ன் AI உதவியாளர்."
        : "I am Amaanitvam Foundation's AI assistant.";

  const best = context[0];
  if (!best) {
    return `${intro} Please ask me about Shiksha, Manthan, volunteering, donations, internships, or contact support.`;
  }

  return `${intro}\n\n**${best.title}**\n${best.content}\n\nFor the next step, share your name, location, availability, and what kind of support you need.`;
}

export async function generateAssistantReply({
  message,
  history,
  context,
  locale
}: {
  message: string;
  history: ChatMessage[];
  context: KnowledgeItem[];
  locale: string;
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return fallbackAnswer(message, context, locale);
  }

  const contextBlock = context
    .map((item, index) => `[${index + 1}] ${item.title}\nType: ${item.type}\n${item.content}`)
    .join("\n\n");

  const prompt = `You are Amaanitvam Foundation's helpful NGO assistant.
Answer in ${languageName[locale] ?? "English"}.
Use only the provided NGO context when stating foundation facts.
If contact/payment details are missing, say the team should confirm official details before sharing money or documents.
Be warm, concise, practical, and format with short markdown.

NGO CONTEXT:
${contextBlock}

RECENT CONVERSATION:
${history.slice(-8).map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n")}

USER: ${message}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.55,
          topP: 0.9,
          maxOutputTokens: 900
        }
      })
    }
  );

  if (!response.ok) {
    return fallbackAnswer(message, context, locale);
  }

  const data = await response.json();
  return (
    data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text).join("") ||
    fallbackAnswer(message, context, locale)
  );
}

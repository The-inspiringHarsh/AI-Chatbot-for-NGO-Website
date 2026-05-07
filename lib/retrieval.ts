import { foundationKnowledge, type KnowledgeItem } from "@/data/knowledge-base";
import { connectToDatabase } from "@/lib/mongodb";
import { Knowledge } from "@/models/Knowledge";

const stopWords = new Set([
  "how",
  "can",
  "could",
  "would",
  "should",
  "tell",
  "about",
  "what",
  "when",
  "where",
  "why",
  "available",
  "explain",
  "please",
  "the",
  "and",
  "for",
  "with"
]);

const normalizeToken = (token: string) => {
  const synonyms: Record<string, string> = {
    donate: "donation",
    donating: "donation",
    donations: "donation",
    volunteer: "volunteer",
    volunteering: "volunteer",
    volunteers: "volunteer",
    internships: "internship",
    interns: "internship",
    contact: "contact",
    shiksha: "shiksha",
    manthan: "manthan"
  };

  return synonyms[token] ?? token.replace(/s$/, "");
};

const tokenize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token))
    .map(normalizeToken);

type KnowledgeDocument = {
  _id: { toString: () => string };
  type: KnowledgeItem["type"];
  title: string;
  content: string;
  tags?: string[];
  locale?: "en" | "hi" | "ta";
};

function scoreItem(queryTokens: string[], item: KnowledgeItem) {
  const title = item.title.toLowerCase();
  const tags = item.tags.map(normalizeToken).join(" ").toLowerCase();
  const content = item.content.toLowerCase();
  const type = item.type.toLowerCase();

  return queryTokens.reduce((score, token) => {
    if (type.includes(token)) score += 6;
    if (title.includes(token)) score += 4;
    if (tags.includes(token)) score += 3;
    if (content.includes(token)) score += 1;
    return score;
  }, 0);
}

export async function getKnowledgeBase(): Promise<KnowledgeItem[]> {
  const db = await connectToDatabase().catch((error) => {
    console.warn("MongoDB knowledge lookup failed. Falling back to bundled data.", error);
    return null;
  });

  if (!db) {
    return foundationKnowledge;
  }

  const docs = (await Knowledge.find().sort({ updatedAt: -1 }).lean()) as unknown as KnowledgeDocument[];
  const mongoItems = docs.map((doc) => ({
    id: doc._id.toString(),
    type: doc.type,
    title: doc.title,
    content: doc.content,
    tags: doc.tags ?? [],
    locale: doc.locale ?? "en"
  }));

  return [...mongoItems, ...foundationKnowledge];
}

export async function retrieveContext(query: string, locale: string, limit = 5) {
  const items = await getKnowledgeBase();
  const queryTokens = tokenize(query);
  const scored = items
    .map((item) => ({
      item,
      score:
        scoreItem(queryTokens, item) +
        (item.locale === locale ? 0.5 : 0) +
        (item.locale ? 0 : 0.2)
    }))
    .sort((a, b) => b.score - a.score);

  return scored
    .filter(({ score }, index) => score > 0 || index < 3)
    .slice(0, limit)
    .map(({ item }) => item);
}

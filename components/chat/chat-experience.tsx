"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import { motion } from "framer-motion";
import {
  Bot,
  Check,
  Copy,
  Download,
  Languages,
  Mic,
  Moon,
  PanelLeft,
  Plus,
  Send,
  Sparkles,
  Sun,
  UserRound,
  Volume2
} from "lucide-react";
import { toast } from "sonner";
import { suggestedPrompts } from "@/data/knowledge-base";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSpeech } from "@/hooks/use-speech";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MetricCard } from "@/components/ui/metric-card";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: string;
};

const emptyConversation = (): Conversation => ({
  id: crypto.randomUUID(),
  title: "New conversation",
  messages: [],
  updatedAt: new Date().toISOString()
});

const localeLabel = {
  en: "English",
  hi: "हिंदी",
  ta: "தமிழ்"
};

export function ChatExperience() {
  const [theme, setTheme] = useLocalStorage<"dark" | "light">("af-theme", "dark");
  const [locale, setLocale] = useLocalStorage<"en" | "hi" | "ta">("af-locale", "en");
  const [conversations, setConversations] = useLocalStorage<Conversation[]>("af-chats", [
    emptyConversation()
  ]);
  const [activeId, setActiveId] = useLocalStorage<string>("af-active-chat", "");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(() => {
    return conversations.find((chat) => chat.id === activeId) ?? conversations[0] ?? emptyConversation();
  }, [activeId, conversations]);

  const { supported, listening, start, speak } = useSpeech(locale, (text) => setInput(text));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    if (!activeId && conversations[0]) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations, setActiveId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation.messages, loading]);

  function updateActive(updater: (conversation: Conversation) => Conversation) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation.id ? updater(conversation) : conversation
      )
    );
  }

  function newChat() {
    const chat = emptyConversation();
    setConversations((current) => [chat, ...current]);
    setActiveId(chat.id);
  }

  async function sendMessage(text = input) {
    const content = text.trim();
    if (!content || loading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date().toISOString()
    };
    const optimisticHistory = [...activeConversation.messages, userMessage];
    setInput("");
    setLoading(true);
    updateActive((conversation) => ({
      ...conversation,
      title: conversation.messages.length ? conversation.title : content.slice(0, 42),
      messages: optimisticHistory,
      updatedAt: new Date().toISOString()
    }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeConversation.id,
          message: content,
          locale,
          history: activeConversation.messages.map(({ role, content }) => ({ role, content }))
        })
      });

      if (!response.ok) throw new Error("Chat request failed");
      const data = await response.json();
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString()
      };

      updateActive((conversation) => ({
        ...conversation,
        messages: [...optimisticHistory, assistantMessage],
        updatedAt: new Date().toISOString()
      }));
    } catch {
      toast.error("The assistant could not respond. Check your API settings.");
    } finally {
      setLoading(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    sendMessage();
  }

  function exportConversation() {
    const text = activeConversation.messages
      .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
      .join("\n\n");
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${activeConversation.title.replace(/\s+/g, "-").toLowerCase()}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyMessage(message: Message) {
    await navigator.clipboard.writeText(message.content);
    setCopiedId(message.id);
    setTimeout(() => setCopiedId(null), 1200);
  }

  return (
    <main
      className={cn(
        "min-h-screen overflow-hidden bg-aurora text-white",
        theme === "light" && "bg-slate-100 text-ink"
      )}
    >
      <div className="soft-grid min-h-screen p-3 md:p-5">
        <div className="mx-auto flex h-[calc(100vh-24px)] max-w-7xl gap-3 md:h-[calc(100vh-40px)]">
          <aside
            className={cn(
              "glass fixed inset-y-3 left-3 z-30 w-[290px] rounded-xl p-4 transition md:static md:block",
              !sidebarOpen && "-translate-x-[320px] md:hidden"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-foundation-teal text-ink">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">Amaanitvam AI</div>
                <div className="text-xs text-slate-400">NGO assistant cockpit</div>
              </div>
            </div>

            <Button className="mt-5 w-full" onClick={newChat}>
              <Plus className="h-4 w-4" />
              New chat
            </Button>

            <div className="mt-5 space-y-2">
              {conversations.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveId(chat.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-3 text-left text-sm transition hover:bg-white/10",
                    chat.id === activeConversation.id && "bg-white/12 text-foundation-teal"
                  )}
                >
                  <div className="truncate font-medium">{chat.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{chat.messages.length} messages</div>
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <MetricCard icon={Bot} value="24/7" label="AI guidance" />
              <MetricCard icon={Sparkles} value="3" label="Languages" />
            </div>
          </aside>

          <section className="glass relative flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl">
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-5">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen((value) => !value)}>
                  <PanelLeft className="h-5 w-5" />
                </Button>
                <div>
                  <div className="font-semibold">Foundation Assistant</div>
                  <div className="text-xs text-slate-400">Grounded in Amaanitvam knowledge base</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/8 p-1 sm:flex">
                  {(["en", "hi", "ta"] as const).map((item) => (
                    <button
                      key={item}
                      onClick={() => setLocale(item)}
                      className={cn(
                        "rounded-md px-2.5 py-1.5 text-xs transition",
                        locale === item && "bg-foundation-teal text-ink"
                      )}
                    >
                      {localeLabel[item]}
                    </button>
                  ))}
                </div>
                <Button variant="secondary" size="icon" onClick={exportConversation}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </header>

            <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-5 md:px-8">
              {activeConversation.messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mx-auto flex max-w-3xl flex-col items-center pt-10 text-center"
                >
                  <div className="relative mb-5 grid h-20 w-20 place-items-center rounded-2xl bg-foundation-teal text-ink shadow-glow">
                    <Bot className="h-10 w-10" />
                    <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-foundation-coral" />
                  </div>
                  <Badge>
                    <Languages className="mr-2 h-3.5 w-3.5" />
                    English, Hindi, Tamil
                  </Badge>
                  <h1 className="mt-5 text-3xl font-semibold tracking-normal md:text-5xl">
                    Ask Amaanitvam Foundation anything.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
                    Get grounded answers about projects, donations, volunteering, internships,
                    contact help, and FAQs with a clean RAG-style knowledge layer.
                  </p>
                  <div className="mt-7 flex flex-wrap justify-center gap-2">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm text-slate-200 transition hover:border-foundation-teal/50 hover:bg-foundation-teal/10"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="mx-auto max-w-4xl space-y-5">
                  {activeConversation.messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex gap-3", message.role === "user" && "justify-end")}
                    >
                      {message.role === "assistant" && (
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-foundation-teal text-ink">
                          <Bot className="h-5 w-5" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "group max-w-[82%] rounded-xl px-4 py-3 text-sm leading-6 shadow-sm",
                          message.role === "user"
                            ? "bg-foundation-teal text-ink"
                            : "border border-white/10 bg-white/8 text-slate-100"
                        )}
                      >
                        <div
                          className="markdown-body prose prose-invert max-w-none prose-p:my-2 prose-li:my-1"
                          dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
                        />
                        {message.role === "assistant" && (
                          <div className="mt-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                            <Button variant="ghost" size="icon" onClick={() => copyMessage(message)}>
                              {copiedId === message.id ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => speak(message.content)}>
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {message.role === "user" && (
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/12">
                          <UserRound className="h-5 w-5" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-foundation-teal text-ink">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/8 px-4 py-3">
                        <span className="inline-flex gap-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-foundation-teal" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-foundation-teal [animation-delay:120ms]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-foundation-teal [animation-delay:240ms]" />
                        </span>
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            <form onSubmit={submit} className="border-t border-white/10 p-3 md:p-5">
              <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-xl border border-white/12 bg-white/8 p-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Ask about volunteering, Shiksha, donations, internships..."
                  className="max-h-36 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500"
                />
                {supported && (
                  <Button type="button" variant="secondary" size="icon" onClick={start}>
                    <Mic className={cn("h-4 w-4", listening && "text-foundation-coral")} />
                  </Button>
                )}
                <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

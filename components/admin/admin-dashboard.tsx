"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Save, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type KnowledgeItem = {
  id: string;
  type: "about" | "project" | "faq" | "donation" | "volunteer" | "internship" | "contact" | "update";
  title: string;
  content: string;
  tags: string[];
  locale?: "en" | "hi" | "ta";
};

const emptyForm: Omit<KnowledgeItem, "id"> = {
  type: "faq",
  title: "",
  content: "",
  tags: [],
  locale: "en"
};

export function AdminDashboard() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [readonly, setReadonly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase();
    return items.filter((item) =>
      `${item.title} ${item.content} ${item.tags.join(" ")}`.toLowerCase().includes(needle)
    );
  }, [items, query]);

  async function loadItems() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/knowledge");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Could not load knowledge base.");
      }
      setItems(data.items ?? []);
      setReadonly(Boolean(data.readonly));
    } catch {
      toast.error("Could not load MongoDB records. Showing demo knowledge.");
      setItems([]);
      setReadonly(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function edit(item: KnowledgeItem) {
    setEditingId(item.id);
    setForm({
      type: item.type,
      title: item.title,
      content: item.content,
      tags: item.tags ?? [],
      locale: item.locale ?? "en"
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.map((tag) => tag.trim()).filter(Boolean)
    };
    const url = editingId ? `/api/admin/knowledge/${editingId}` : "/api/admin/knowledge";
    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(
        data?.error || (readonly ? "Connect MongoDB to enable admin writes." : "Could not save item.")
      );
      return;
    }

    toast.success(editingId ? "Knowledge updated" : "Knowledge added");
    resetForm();
    loadItems();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/admin/knowledge/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error(readonly ? "Connect MongoDB to enable deletes." : "Could not delete item.");
      return;
    }

    toast.success("Knowledge item deleted");
    loadItems();
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Badge>Secure admin dashboard</Badge>
            <h1 className="mt-3 text-2xl font-semibold">Knowledge Base Manager</h1>
            <p className="mt-1 text-sm text-slate-400">
              Add FAQs, project updates, and foundation details used by the chatbot retrieval layer.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white/8 p-3">
              <div className="text-xl font-semibold">{items.length}</div>
              <div className="text-xs text-slate-400">Records</div>
            </div>
            <div className="rounded-lg bg-white/8 p-3">
              <div className="text-xl font-semibold">{items.filter((i) => i.type === "faq").length}</div>
              <div className="text-xs text-slate-400">FAQs</div>
            </div>
            <div className="rounded-lg bg-white/8 p-3">
              <div className="text-xl font-semibold">{readonly ? "Demo" : "Live"}</div>
              <div className="text-xs text-slate-400">Mode</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_390px]">
        <section className="glass rounded-xl p-4">
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/12 bg-white/8 px-3">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search knowledge..."
              className="h-11 flex-1 bg-transparent text-sm outline-none"
            />
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-28 animate-pulse rounded-lg bg-white/8" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((item) => (
                <article key={item.id} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge>{item.type}</Badge>
                        <Badge>{item.locale ?? "en"}</Badge>
                      </div>
                      <h2 className="mt-3 font-semibold">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-400">{item.content}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(item.tags ?? []).map((tag) => (
                          <span key={tag} className="text-xs text-foundation-teal">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="icon" onClick={() => edit(item)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="icon" onClick={() => remove(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <form onSubmit={save} className="glass h-max rounded-xl p-4">
          <h2 className="flex items-center gap-2 font-semibold">
            {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {editingId ? "Edit Knowledge" : "Add Knowledge"}
          </h2>

          <label className="mt-4 block text-sm text-slate-300">Type</label>
          <select
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value as KnowledgeItem["type"] })}
            className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-slate-950 px-3 text-sm outline-none"
          >
            {["about", "project", "faq", "donation", "volunteer", "internship", "contact", "update"].map(
              (type) => (
                <option key={type}>{type}</option>
              )
            )}
          </select>

          <label className="mt-4 block text-sm text-slate-300">Title</label>
          <input
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-white/8 px-3 text-sm outline-none"
          />

          <label className="mt-4 block text-sm text-slate-300">Content</label>
          <textarea
            value={form.content}
            onChange={(event) => setForm({ ...form, content: event.target.value })}
            rows={7}
            className="mt-2 w-full resize-none rounded-lg border border-white/12 bg-white/8 p-3 text-sm leading-6 outline-none"
          />

          <label className="mt-4 block text-sm text-slate-300">Tags</label>
          <input
            value={form.tags.join(", ")}
            onChange={(event) =>
              setForm({ ...form, tags: event.target.value.split(",").map((tag) => tag.trim()) })
            }
            placeholder="faq, volunteering, shiksha"
            className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-white/8 px-3 text-sm outline-none"
          />

          <label className="mt-4 block text-sm text-slate-300">Language</label>
          <select
            value={form.locale}
            onChange={(event) => setForm({ ...form, locale: event.target.value as "en" | "hi" | "ta" })}
            className="mt-2 h-11 w-full rounded-lg border border-white/12 bg-slate-950 px-3 text-sm outline-none"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="ta">Tamil</option>
          </select>

          <div className="mt-5 flex gap-2">
            <Button className="flex-1" disabled={readonly}>
              {editingId ? "Save changes" : "Add record"}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>

          {readonly && (
            <p className="mt-3 text-xs leading-5 text-foundation-gold">
              MongoDB is not configured, so the dashboard is showing bundled demo data.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

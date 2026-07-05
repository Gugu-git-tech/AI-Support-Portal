import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { getUser } from "@/lib/auth";
import { createKnowledgeEntry, deleteKnowledgeEntry, getKnowledgeEntries, type KnowledgeEntry } from "@/services/api";

export default function AdminKnowledge() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const currentUser = getUser();
  const token = currentUser?.token;

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getKnowledgeEntries(token);
        setEntries(data);
      } catch (err: any) {
        setError(err?.message || "Unable to load knowledge entries.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  async function handleCreate() {
    if (!title || !content) return;
    if (!token) {
      setError("Missing admin token. Please sign in again.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await createKnowledgeEntry({ title, content, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) }, token);
      setTitle("");
      setContent("");
      setTags("");
      const data = await getKnowledgeEntries(token);
      setEntries(data);
    } catch (err: any) {
      setError(err?.message || "Unable to create knowledge entry.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!token) {
      setError("Missing admin token. Please sign in again.");
      return;
    }

    try {
      await deleteKnowledgeEntry(id, token);
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err: any) {
      setError(err?.message || "Unable to delete entry.");
    }
  }

  return (
    <DashboardShell title="Knowledge Vault" navItems={adminNav} requiredRole="admin">
      <div className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Create Knowledge Entry</h2>
        {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">{error}</div>}
        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 border rounded" rows={4} />
        <input placeholder="Tags comma separated" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full p-2 border rounded" />
        <div>
          <button onClick={handleCreate} disabled={saving} className="px-3 py-2 rounded bg-gradient-neon text-white disabled:opacity-50">
            {saving ? "Saving..." : "Add Entry"}
          </button>
        </div>

        <h3 className="text-md font-medium">Entries</h3>
        {loading ? (
          <div className="text-sm text-muted-foreground">Loading knowledge entries…</div>
        ) : entries.length === 0 ? (
          <div className="text-sm text-muted-foreground">No knowledge entries have been created yet.</div>
        ) : (
          <div className="space-y-2">
            {entries.map((e) => (
              <div key={e.id} className="border p-3 rounded">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{e.title}</div>
                    <div className="text-sm text-muted-foreground">{e.tags.join(", ")}</div>
                  </div>
                  <div>
                    <button onClick={() => handleDelete(e.id)} className="text-sm text-red-500">
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{e.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

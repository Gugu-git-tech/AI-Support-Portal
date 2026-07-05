import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { getUser } from "@/lib/auth";
import { getConfig, type ConfigPayload, updateConfig } from "@/services/api";

export default function AdminConfig() {
  const [systemName, setSystemName] = useState("CX Expert");
  const [aiKey, setAiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = getUser();
  const token = currentUser?.token;

  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      setError("");

      try {
        if (!token) {
          throw new Error("Missing admin token. Please sign in again.");
        }

        const data = await getConfig(token);
        setSystemName(data.systemName ?? "CX Expert");
        setAiKey(data.aiKey ?? "");
      } catch (err: any) {
        setError(err?.message || "Unable to load configuration.");
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [token]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!token) {
        throw new Error("Missing admin token. Please sign in again.");
      }

      const config: ConfigPayload = {
        systemName,
        aiKey,
      };

      await updateConfig(config, token);
      setSuccess("Configuration saved successfully.");
    } catch (err: any) {
      setError(err?.message || "Unable to save configuration.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell title="System Configuration" navItems={adminNav} requiredRole="admin">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Branding</h2>
            <p className="text-sm text-muted-foreground">Customize the portal title shown to staff.</p>
          </div>
          <span className="text-xs text-muted-foreground">{loading ? "Loading..." : "Ready to edit"}</span>
        </div>

        {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">{error}</div>}
        {success && <div className="rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-700">{success}</div>}

        <input value={systemName} onChange={(e) => setSystemName(e.target.value)} className="w-full p-2 border rounded" />

        <div>
          <h2 className="text-lg font-semibold">AI Provider</h2>
          <p className="text-sm text-muted-foreground">Store your downstream AI provider key for admin workflows.</p>
          <input value={aiKey} onChange={(e) => setAiKey(e.target.value)} placeholder="API key" className="w-full p-2 border rounded mt-2" />
        </div>

        <div>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded bg-gradient-neon text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}

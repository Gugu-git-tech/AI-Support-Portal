import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { getTickets } from "@/services/api";
import type { Ticket } from "@/services/api";

export default function AdminCases() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await getTickets();
      setTickets(data);
    } catch (err: any) {
      setError(err?.message || "Unable to load cases.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardShell title="Case Workspace" navItems={adminNav} requiredRole="admin">
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Case Workspace</h1>
          <p className="text-sm text-muted-foreground">Review and manage active support tickets from the live database.</p>
        </div>

        {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700">{error}</div>}

        {loading ? (
          <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">Loading cases…</div>
        ) : tickets.length === 0 ? (
          <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">No cases available yet.</div>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-2xl border border-border bg-background p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-wide text-muted-foreground">{ticket.category || "General"}</p>
                    <h2 className="text-lg font-semibold">{ticket.issue_summary || ticket.id}</h2>
                    <p className="text-sm text-muted-foreground">{ticket.created_by} · {new Date(ticket.created_at).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 text-right text-sm">
                    <div className="text-muted-foreground">Status</div>
                    <div className="rounded-full bg-secondary/70 px-3 py-1 text-xs uppercase tracking-wide">{ticket.status}</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">{ticket.user_intent || "No additional details provided."}</div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Priority</div>
                    <div className="font-medium">{ticket.priority || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Urgency</div>
                    <div className="font-medium">{ticket.urgency || "—"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Assigned</div>
                    <div className="font-medium">{ticket.assigned_to || "Unassigned"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

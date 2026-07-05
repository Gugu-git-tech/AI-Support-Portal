import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { getTickets } from "@/services/api";
import type { Ticket } from "@/services/api";

export default function Reports() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (err: any) {
        setError(err?.message || "Unable to load reports.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const total = tickets.length;
  const open = tickets.filter((t) => t.status !== "resolved" && t.status !== "closed").length;
  const resolved = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length;
  const highPriority = tickets.filter((t) => t.priority === "P1" || t.urgency === "high").length;

  return (
    <DashboardShell title="Reports & Insights" navItems={adminNav} requiredRole="admin">
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Insights</h1>
          <p className="text-sm text-muted-foreground">Live operational metrics based on real ticket data.</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total Tickets" value={loading ? "Loading..." : total.toString()} />
          <Metric label="Open Tickets" value={loading ? "Loading..." : open.toString()} />
          <Metric label="Resolved" value={loading ? "Loading..." : resolved.toString()} />
          <Metric label="High Priority" value={loading ? "Loading..." : highPriority.toString()} />
        </div>

        {loading ? (
          <div className="rounded-2xl border border-border p-6 text-sm text-muted-foreground">Loading charts…</div>
        ) : tickets.length === 0 ? (
          <div className="rounded-2xl border border-border p-6 text-sm text-muted-foreground">No ticket data is available yet.</div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <StatPanel title="Ticket Status">
              <div className="space-y-3">
                <StatLine label="Open" value={open.toString()} />
                <StatLine label="Resolved" value={resolved.toString()} />
                <StatLine label="High priority" value={highPriority.toString()} />
                <StatLine label="Total" value={total.toString()} />
              </div>
            </StatPanel>

            <StatPanel title="Recent Ticket Activity">
              <div className="space-y-3">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="rounded-xl border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold">{ticket.issue_summary || ticket.id}</p>
                        <p className="text-sm text-muted-foreground">{ticket.created_by}</p>
                      </div>
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">{ticket.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </StatPanel>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function StatPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

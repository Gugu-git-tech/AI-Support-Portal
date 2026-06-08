// Agent ticketing system
import { useState } from "react";
import { Home, Ticket, User, Search } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { tickets, type TicketStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const nav: NavItem[] = [
  { label: "Home", to: "/agent/home", icon: Home },
  { label: "Tickets", to: "/agent/tickets", icon: Ticket },
  { label: "Profile Settings", to: "/agent/profile", icon: User },
];

const statusColors: Record<TicketStatus, string> = {
  "Open": "bg-neon-blue/20 text-neon-blue border-neon-blue/40",
  "In Progress": "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/40",
  "Pending": "bg-warning/20 text-warning border-warning/40",
  "Escalated": "bg-danger/20 text-danger border-danger/40",
  "Resolved": "bg-success/20 text-success border-success/40",
  "Closed": "bg-muted text-muted-foreground border-border",
};

export default function AgentTickets() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<TicketStatus | "All">("All");

  const filtered = tickets.filter((t) => {
    const matchesQ = !q || t.subject.toLowerCase().includes(q.toLowerCase()) || t.user.toLowerCase().includes(q.toLowerCase());
    const matchesS = filter === "All" || t.status === filter;
    return matchesQ && matchesS;
  });

  const statuses: (TicketStatus | "All")[] = ["All", "Open", "In Progress", "Pending", "Escalated", "Resolved", "Closed"];

  return (
    <DashboardShell title="Ticket Management" navItems={nav} requiredRole="agent">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Tickets</h1>
          <p className="text-sm text-muted-foreground">Manage and respond to user-submitted requests.</p>
        </div>
        <div className="flex items-center gap-2 glass rounded-lg px-3 py-2 border border-border w-full sm:w-80">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tickets..."
            className="bg-transparent flex-1 text-sm focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs border transition",
              filter === s
                ? "bg-gradient-neon text-primary-foreground border-transparent glow-blue"
                : "border-border bg-secondary/40 hover:border-primary/50",
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-4 glass rounded-2xl overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left">
              <tr>
                {["Ticket ID", "User", "Department", "Priority", "Status", "Created"].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-t border-border hover:bg-secondary/30 transition">
                  <td className="px-4 py-3 font-mono text-neon-cyan">{t.id}</td>
                  <td className="px-4 py-3">{t.user}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t.department}</td>
                  <td className="px-4 py-3">{t.priority}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[10px] uppercase px-2 py-1 rounded-full border", statusColors[t.status])}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{t.createdAt}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No tickets match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

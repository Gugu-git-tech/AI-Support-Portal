import { useMemo, useState } from "react";
import {
  Ticket as TicketIcon,
  AlertTriangle,
  Inbox,
  Timer,
  Search,
  X,
  Activity,
  ShieldCheck,
} from "lucide-react";
import {
  mockTickets,
  departments,
  priorities,
  statuses,
  type Ticket,
  type Priority,
  type TicketStatus,
} from "@/services/ticketsData";
import { mockAuditLog } from "@/services/authService";

export function AdminDashboardView() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const [pri, setPri] = useState<string>("");
  const [st, setSt] = useState<string>("");
  const [active, setActive] = useState<Ticket | null>(null);

  const tickets = mockTickets;

  const filtered = useMemo(
    () =>
      tickets.filter((t) => {
        if (cat && t.category !== cat) return false;
        if (pri && t.priority !== pri) return false;
        if (st && t.status !== st) return false;
        if (q) {
          const blob = `${t.id} ${t.fullName} ${t.email} ${t.rawInput}`.toLowerCase();
          if (!blob.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [tickets, q, cat, pri, st]
  );

  const stats = useMemo(() => {
    const open = tickets.filter((t) => t.status === "Open").length;
    const high = tickets.filter((t) => t.priority === "High").length;
    return {
      total: tickets.length,
      open,
      high,
      avgResolution: "4h 12m",
    };
  }, [tickets]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Command Center</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time AI-validated support telemetry across Digifycx BPO Zendesk.
        </p>
      </header>

      {/* Stat grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tickets" value={stats.total} icon={TicketIcon} tone="primary" />
        <StatCard label="Open Tickets" value={stats.open} icon={Inbox} tone="accent" />
        <StatCard label="High Priority" value={stats.high} icon={AlertTriangle} tone="danger" />
        <StatCard label="Avg Resolution" value={stats.avgResolution} icon={Timer} tone="primary" />
      </section>

      {/* Filters + table */}
      <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-border grid md:grid-cols-12 gap-2">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tickets, requesters, raw input…"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-input/60 border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
            />
          </div>
          <FilterSelect label="Category" value={cat} onChange={setCat} options={departments} />
          <FilterSelect label="Priority" value={pri} onChange={setPri} options={priorities} />
          <FilterSelect label="Status" value={st} onChange={setSt} options={statuses} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-background/40">
              <tr>
                <th className="text-left px-4 py-3">Ticket</th>
                <th className="text-left px-4 py-3">Requester</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Priority</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  onClick={() => setActive(t)}
                  className="border-t border-border hover:bg-primary/5 cursor-pointer transition"
                >
                  <td className="px-4 py-3 font-mono text-primary">{t.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-foreground">{t.fullName}</div>
                    <div className="text-xs text-muted-foreground">{t.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone="neutral">{t.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge p={t.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge s={t.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(t.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No tickets match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Audit log */}
      <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden">
        <div className="px-4 py-4 border-b border-border flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h2 className="font-semibold">Authorization & Security Audit Log</h2>
          <span className="ml-auto text-xs text-muted-foreground inline-flex items-center gap-1">
            <Activity className="w-3 h-3 text-emerald-400" /> Streaming · authService bound
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground bg-background/40">
              <tr>
                <th className="text-left px-4 py-3">Endpoint</th>
                <th className="text-left px-4 py-3">Method</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Uptime</th>
                <th className="text-left px-4 py-3">Latency</th>
                <th className="text-left px-4 py-3">Actor</th>
                <th className="text-left px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {mockAuditLog.map((a) => (
                <tr key={a.id} className="border-t border-border hover:bg-accent/5">
                  <td className="px-4 py-3 font-mono text-primary">{a.endpoint}</td>
                  <td className="px-4 py-3">
                    <Badge tone="neutral">{a.method}</Badge>
                  </td>
                  <td className="px-4 py-3 text-emerald-400 font-mono">{a.status}</td>
                  <td className="px-4 py-3 font-mono">{a.uptime}</td>
                  <td className="px-4 py-3 font-mono text-muted-foreground">{a.latencyMs}ms</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.actor}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {active && <TicketModal ticket={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  icon: typeof TicketIcon;
  tone: "primary" | "accent" | "danger";
}) {
  const toneCls =
    tone === "primary"
      ? "border-primary/30 text-primary"
      : tone === "accent"
        ? "border-accent/30 text-accent"
        : "border-destructive/40 text-destructive";
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur p-5 relative overflow-hidden group">
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-primary/5 group-hover:bg-primary/10 transition" />
      <div className={`w-10 h-10 rounded-lg bg-background border ${toneCls} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-2xl font-bold tracking-tight">{value}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="md:col-span-2 relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-input/60 border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none appearance-none cursor-pointer pr-8"
      >
        <option value="">All {label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
          aria-label="Clear filter"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "primary" | "accent";
}) {
  const cls =
    tone === "primary"
      ? "border-primary/40 text-primary bg-primary/10"
      : tone === "accent"
        ? "border-accent/40 text-accent bg-accent/10"
        : "border-border text-muted-foreground bg-background/60";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs ${cls}`}>
      {children}
    </span>
  );
}

function PriorityBadge({ p }: { p: Priority }) {
  const map: Record<Priority, string> = {
    High: "border-destructive/50 text-destructive bg-destructive/10",
    Medium: "border-amber-500/40 text-amber-300 bg-amber-500/10",
    Low: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-xs ${map[p]}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" /> {p}
    </span>
  );
}

function StatusBadge({ s }: { s: TicketStatus }) {
  const map: Record<TicketStatus, string> = {
    Open: "border-primary/40 text-primary bg-primary/10",
    "In Progress": "border-accent/40 text-accent bg-accent/10",
    Resolved: "border-emerald-500/40 text-emerald-300 bg-emerald-500/10",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-xs ${map[s]}`}>{s}</span>;
}

function TicketModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const jsonStr = JSON.stringify(ticket.validatedJson, null, 2);
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl max-h-[88vh] overflow-hidden rounded-2xl border border-primary/40 bg-card neon-border flex flex-col"
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Ticket</p>
            <h3 className="text-lg font-semibold font-mono text-primary">{ticket.id}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-background/60">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-0 overflow-auto">
          <div className="p-5 border-r border-border">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Raw Messy Text Input
            </div>
            <div className="rounded-lg border border-border bg-background/60 p-4 text-sm whitespace-pre-wrap leading-relaxed text-muted-foreground font-mono">
              {ticket.rawInput}
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <Meta label="Requester" value={ticket.fullName} />
              <Meta label="Email" value={ticket.email} />
              <Meta label="Category" value={ticket.category} />
              <Meta label="Type" value={ticket.requestType} />
              <Meta label="Priority" value={ticket.priority} />
              <Meta label="Status" value={ticket.status} />
            </dl>
          </div>

          <div className="p-5 bg-background/40">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
              Groq AI Validated JSON Schema
              <span className="px-1.5 py-0.5 rounded bg-accent/10 border border-accent/40 text-accent text-[10px]">
                VALID
              </span>
            </div>
            <pre className="rounded-lg border border-accent/30 bg-black/60 p-4 text-xs overflow-auto max-h-[60vh] font-mono leading-relaxed">
              <code dangerouslySetInnerHTML={{ __html: highlightJson(jsonStr) }} />
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground uppercase tracking-wider text-[10px]">{label}</dt>
      <dd className="text-foreground mt-0.5">{value}</dd>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightJson(src: string) {
  const escaped = escapeHtml(src);
  return escaped.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "text-emerald-300"; // number
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "text-primary" : "text-amber-200";
      } else if (/true|false/.test(match)) {
        cls = "text-accent";
      } else if (/null/.test(match)) {
        cls = "text-muted-foreground";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}
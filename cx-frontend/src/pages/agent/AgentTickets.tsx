import { useEffect, useState } from "react";
import { Home, Ticket, User, Search } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { cn } from "@/lib/utils";
import { getTickets, updateTicket, getTicketHistory } from "@/services/api";

const nav: NavItem[] = [
  { label: "Home", to: "/agent/home", icon: Home },
  { label: "Tickets", to: "/agent/tickets", icon: Ticket },
  { label: "Profile Settings", to: "/agent/profile", icon: User },
];

type TicketStatus =
  | "Open"
  | "In Progress"
  | "Pending"
  | "Escalated"
  | "Resolved"
  | "Closed";

const statusColors: Record<TicketStatus, string> = {
  Open: "bg-blue-500/20 text-blue-400 border-blue-400/40",
  "In Progress": "bg-cyan-500/20 text-cyan-400 border-cyan-400/40",
  Pending: "bg-yellow-500/20 text-yellow-400 border-yellow-400/40",
  Escalated: "bg-red-500/20 text-red-400 border-red-400/40",
  Resolved: "bg-green-500/20 text-green-400 border-green-400/40",
  Closed: "bg-gray-500/20 text-gray-400 border-gray-400/40",
};

export default function AgentTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [note, setNote] = useState("");

  // LOAD TICKETS
  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const data = await getTickets();
      setTickets(data || []);
    } catch (err) {
      console.error("Failed to load tickets", err);
    }
  }

  // OPEN TICKET
  async function openTicket(ticket: any) {
    setSelected(ticket);

    try {
      const h = await getTicketHistory(ticket.id);
      setHistory(h || []);
    } catch (err) {
      console.error("History load failed", err);
      setHistory([]);
    }
  }

  // UPDATE STATUS
  async function changeStatus(status: string) {
    if (!selected) return;

    try {
      await updateTicket(selected.id, {
        status,
        actor: "agent",
        note,
      });

      setNote("");
      await loadTickets();
      await openTicket(selected);
    } catch (err) {
      console.error("Update failed", err);
    }
  }

  // FILTERED LIST
  const filtered = tickets.filter((t) => {
    const text =
      (t.issue_summary || t.message || "")
        .toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <DashboardShell title="Agent Console" navItems={nav} requiredRole="agent">
      <div className="grid grid-cols-3 gap-4 h-[80vh]">

        {/* LEFT PANEL */}
        <div className="col-span-1 border rounded-lg p-3 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3 border p-2 rounded">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>

          {filtered.map((t) => (
            <div
              key={t.id}
              onClick={() => openTicket(t)}
              className={cn(
                "p-3 border rounded mb-2 cursor-pointer hover:bg-gray-50",
                selected?.id === t.id && "bg-gray-100"
              )}
            >
              <div className="font-mono text-xs text-blue-500">{t.id}</div>
              <div className="text-sm font-medium">
                {t.issue_summary || t.message}
              </div>
              <div className="text-xs text-gray-500">
                {t.status}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-2 border rounded-lg p-4">

          {!selected ? (
            <div className="text-gray-500">
              Select a ticket to view details
            </div>
          ) : (
            <>
              {/* HEADER */}
              <h2 className="text-xl font-bold">{selected.id}</h2>
              <p className="text-sm text-gray-500">
                Status: {selected.status}
              </p>

              {/* NOTE BOX */}
              <div className="mt-4">
                <label className="text-xs text-gray-500">
                  Add Progress Note
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border rounded p-2 mt-1"
                  rows={3}
                />
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-3">
                <button onClick={() => changeStatus("in_progress")} className="px-3 py-1 border rounded">
                  Start
                </button>
                <button onClick={() => changeStatus("pending")} className="px-3 py-1 border rounded">
                  Pending
                </button>
                <button onClick={() => changeStatus("resolved")} className="px-3 py-1 border rounded bg-green-100">
                  Resolve
                </button>
              </div>

              {/* HISTORY */}
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Activity Timeline</h3>

                <div className="space-y-2">
                  {history.length === 0 && (
                    <p className="text-sm text-gray-400">No history yet</p>
                  )}

                  {history.map((h, i) => (
                    <div key={i} className="text-sm border-b py-2">
                      <div className="font-medium">{h.event_type}</div>
                      <div className="text-gray-500 text-xs">
                        {h.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
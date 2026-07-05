import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTickets, updateTicket, getTicketHistory } from "@/services/api";

export default function AgentTicketView() {
  const { id } = useParams();

  const [ticket, setTicket] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);

  // LOAD TICKET + HISTORY
  useEffect(() => {
    async function load() {
      try {
        const all = await getTickets();
        const found = all.find((t: any) => t.id === id);

        setTicket(found || null);

        if (found) {
          const h = await getTicketHistory(found.id);
          setHistory(h || []);
        }
      } catch (err) {
        console.error("Failed to load ticket view", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  // UPDATE STATUS
  async function changeStatus(status: string) {
    if (!ticket) return;

    const payload: any = { status };
    if (note) payload.note = note;

    await updateTicket(ticket.id, payload);

    setNote("");

    const updated = await getTickets();
    const refreshed = updated.find((t: any) => t.id === ticket.id);

    setTicket(refreshed);

    const h = await getTicketHistory(ticket.id);
    setHistory(h || []);
  }

  if (loading) return <div className="p-4">Loading...</div>;

  if (!ticket) return <div className="p-4">Ticket not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">{ticket.id}</h1>
      <p className="text-gray-500 text-sm">{ticket.issue_summary}</p>

      {/* META INFO */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
        <div>
          <b>Status:</b> {ticket.status}
        </div>
        <div>
          <b>Priority:</b> {ticket.priority}
        </div>
        <div>
          <b>Category:</b> {ticket.category}
        </div>
        <div>
          <b>Urgency:</b> {ticket.urgency}
        </div>
      </div>

      {/* NOTE BOX */}
      <div className="mt-6">
        <label className="text-sm font-medium">Agent Note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded p-2 mt-1"
          rows={4}
          placeholder="Add investigation notes..."
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-4">
        <button onClick={() => changeStatus("in_progress")} className="px-3 py-1 border rounded">
          Start Work
        </button>

        <button onClick={() => changeStatus("pending")} className="px-3 py-1 border rounded">
          Pending
        </button>

        <button onClick={() => changeStatus("resolved")} className="px-3 py-1 border rounded bg-green-100">
          Resolve
        </button>
      </div>

      {/* HISTORY */}
      <div className="mt-8">
        <h2 className="font-semibold mb-2">Ticket History</h2>

        {history.length === 0 ? (
          <p className="text-gray-400 text-sm">No history yet</p>
        ) : (
          <div className="space-y-2">
            {history.map((h, i) => (
              <div key={i} className="border-b py-2 text-sm">
                <div className="font-medium">{h.event_type}</div>
                <div className="text-gray-500 text-xs">{h.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
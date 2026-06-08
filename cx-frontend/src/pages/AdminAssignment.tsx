// Ticket assignment page (mock)
import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { tickets } from "@/lib/mock-data";
import { UserPlus, Check } from "lucide-react";

const agents = ["Sarah Chen", "Marcus Lee", "Aisha Patel", "Diego Ramos", "Yuki Tanaka"];

export default function Assignment() {
  const unassigned = tickets.filter((t) => t.status === "Open" || t.status === "Pending");
  const [assigned, setAssigned] = useState<Record<string, string>>({});
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <DashboardShell title="Ticket Assignment" navItems={adminNav} requiredRole="admin">
      <h1 className="text-2xl font-bold text-gradient">Unassigned Tickets</h1>
      <p className="text-sm text-muted-foreground">Distribute tickets across available agents.</p>

      <div className="mt-6 glass rounded-2xl overflow-hidden border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              {["Ticket ID", "Subject", "Department", "Priority", "Action"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {unassigned.map((t) => (
              <tr key={t.id} className="border-t border-border hover:bg-secondary/30 transition">
                <td className="px-4 py-3 font-mono text-neon-cyan">{t.id}</td>
                <td className="px-4 py-3">{t.subject}</td>
                <td className="px-4 py-3 text-muted-foreground">{t.department}</td>
                <td className="px-4 py-3">{t.priority}</td>
                <td className="px-4 py-3 relative">
                  {assigned[t.id] ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-success">
                      <Check className="h-3.5 w-3.5" /> Assigned to {assigned[t.id]}
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-neon px-3 py-1.5 text-xs font-semibold text-primary-foreground glow-blue hover:scale-105 transition"
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Assign to Agent
                      </button>
                      {openMenu === t.id && (
                        <div className="absolute right-4 z-20 mt-2 glass rounded-lg border border-border min-w-[180px] py-1 animate-float-in">
                          {agents.map((a) => (
                            <button
                              key={a}
                              onClick={() => { setAssigned({ ...assigned, [t.id]: a }); setOpenMenu(null); }}
                              className="block w-full text-left px-3 py-2 text-xs hover:bg-secondary/60"
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}

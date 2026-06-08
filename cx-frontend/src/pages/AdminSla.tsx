// SLA tracking — office hours 08:00-16:00, breach > 7h
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { StatCard } from "@/components/StatCard";
import { tickets } from "@/lib/mock-data";
import { Clock, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SLA_LIMIT = 7;

function slaState(hours: number): { label: string; color: string; bg: string } {
  if (hours >= SLA_LIMIT) return { label: "Breached", color: "text-danger", bg: "bg-danger/15 border-danger/40" };
  if (hours >= SLA_LIMIT - 2) return { label: "Warning", color: "text-warning", bg: "bg-warning/15 border-warning/40" };
  return { label: "Healthy", color: "text-success", bg: "bg-success/15 border-success/40" };
}

export default function SLA() {
  const breached = tickets.filter((t) => t.hoursOpen >= SLA_LIMIT && t.status !== "Resolved" && t.status !== "Closed");
  const resolved = tickets.filter((t) => t.status === "Resolved");
  const assigned = tickets.filter((t) => t.status === "In Progress" || t.status === "Pending");

  return (
    <DashboardShell title="SLA Tracking" navItems={adminNav} requiredRole="admin">
      <h1 className="text-2xl font-bold text-gradient">SLA Tracking</h1>
      <p className="text-sm text-muted-foreground">
        Office hours <span className="text-neon-cyan">08:00 – 16:00</span>. Tickets older than{" "}
        <span className="text-neon-purple">7 hours</span> are considered breached.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="Compliance" value="94%" icon={ShieldCheck} accent="success" />
        <StatCard label="Breached" value={breached.length} icon={AlertTriangle} accent="danger" />
        <StatCard label="Assigned" value={assigned.length} icon={Clock} accent="warning" />
        <StatCard label="Resolved" value={resolved.length} icon={CheckCircle2} accent="success" />
      </div>

      <div className="mt-6 glass rounded-2xl overflow-hidden border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              {["Ticket ID", "Subject", "Hours Open", "Time Remaining", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => {
              const s = slaState(t.hoursOpen);
              const remaining = Math.max(0, SLA_LIMIT - t.hoursOpen);
              return (
                <tr key={t.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-neon-cyan">{t.id}</td>
                  <td className="px-4 py-3">{t.subject}</td>
                  <td className="px-4 py-3">{t.hoursOpen}h</td>
                  <td className={cn("px-4 py-3 font-medium", s.color)}>
                    {remaining === 0 ? "Exceeded" : `${remaining}h left`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[10px] uppercase px-2 py-1 rounded-full border", s.bg, s.color)}>
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}

// Agent dashboard home
import { Home, Ticket, User, Inbox, AlertOctagon, CheckCircle2, Clock } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ticketTrend } from "@/lib/mock-data";

const nav: NavItem[] = [
  { label: "Home", to: "/agent/home", icon: Home },
  { label: "Tickets", to: "/agent/tickets", icon: Ticket },
  { label: "Profile Settings", to: "/agent/profile", icon: User },
];

export default function AgentHome() {
  return (
    <DashboardShell title="Agent Console" navItems={nav} requiredRole="agent">
      <div className="glass rounded-2xl p-6 neon-border cyber-grid">
        <p className="text-xs uppercase tracking-widest text-neon-cyan">Agent Operations</p>
        <h1 className="text-3xl font-bold mt-2 text-gradient">Welcome back, Agent</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Monitor your ticket queue, prioritize escalations, and keep SLA compliance in the green.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="Assigned" value={18} icon={Inbox} accent="blue" />
        <StatCard label="Pending" value={5} icon={Clock} accent="warning" />
        <StatCard label="Resolved" value={42} icon={CheckCircle2} accent="success" />
        <StatCard label="Escalated" value={3} icon={AlertOctagon} accent="danger" />
      </div>

      <div className="mt-6 glass rounded-2xl p-6">
        <h3 className="font-semibold">Weekly Ticket Flow</h3>
        <p className="text-xs text-muted-foreground">Open vs resolved over the last 7 days.</p>
        <div className="h-64 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ticketTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.05 270 / 0.3)" />
              <XAxis dataKey="day" stroke="oklch(0.7 0.02 260)" />
              <YAxis stroke="oklch(0.7 0.02 260)" />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.04 270)", border: "1px solid oklch(0.5 0.08 280 / 0.4)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="open" stroke="oklch(0.72 0.22 250)" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="resolved" stroke="oklch(0.7 0.27 305)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardShell>
  );
}

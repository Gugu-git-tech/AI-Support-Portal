// Admin home with key metrics and neon line graph
import { Ticket, Inbox, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { adminNav } from "@/lib/admin-nav";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";
import { ticketTrend, monthlyPerf } from "@/lib/mock-data";

export default function AdminHome() {
  return (
    <DashboardShell title="Admin Console" navItems={adminNav} requiredRole="admin">
      <div className="glass rounded-2xl p-6 neon-border cyber-grid">
        <p className="text-xs uppercase tracking-widest text-neon-cyan">Admin Operations</p>
        <h1 className="text-3xl font-bold mt-2 text-gradient">Mission Control</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Live overview of platform health, agent workload, and SLA compliance.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
        <StatCard label="Total Tickets" value={1284} icon={Ticket} accent="blue" />
        <StatCard label="Open Tickets" value={142} icon={Inbox} accent="cyan" />
        <StatCard label="Resolved" value={1098} icon={CheckCircle2} accent="success" />
        <StatCard label="SLA Compliance" value="94%" icon={ShieldCheck} accent="purple" />
        <StatCard label="Active Agents" value={27} icon={Users} accent="warning" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold">Ticket Flow — 7 Days</h3>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ticketTrend}>
                <defs>
                  <linearGradient id="gOpen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.22 250)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.72 0.22 250)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.27 305)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.7 0.27 305)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.05 270 / 0.3)" />
                <XAxis dataKey="day" stroke="oklch(0.7 0.02 260)" />
                <YAxis stroke="oklch(0.7 0.02 260)" />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.04 270)", border: "1px solid oklch(0.5 0.08 280 / 0.4)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="open" stroke="oklch(0.72 0.22 250)" fill="url(#gOpen)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="oklch(0.7 0.27 305)" fill="url(#gRes)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="font-semibold">Monthly Performance Score</h3>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPerf}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.05 270 / 0.3)" />
                <XAxis dataKey="month" stroke="oklch(0.7 0.02 260)" />
                <YAxis stroke="oklch(0.7 0.02 260)" />
                <Tooltip contentStyle={{ background: "oklch(0.18 0.04 270)", border: "1px solid oklch(0.5 0.08 280 / 0.4)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="oklch(0.85 0.18 200)" strokeWidth={3} dot={{ r: 5, fill: "oklch(0.85 0.18 200)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

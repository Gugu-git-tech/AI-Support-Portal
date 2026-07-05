import { useEffect, useState } from "react";
import { Inbox, Ticket, CheckCircle2, ShieldCheck } from "lucide-react";
import { getTickets, getUsers, BASE_URL } from "@/services/api";
import type { Ticket as TicketType } from "@/services/api";
import { getUser } from "@/lib/auth";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { adminNav } from "@/lib/admin-nav";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from "recharts";

export default function AdminHome() {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const ticketData = await getTickets();
        setTickets(ticketData);

        const currentUser = getUser();
        if (currentUser?.token) {
          const users = await getUsers(currentUser.token);
          setUsersCount(users.length);
        }
      } catch (err: any) {
        setError(err?.message || "Unable to load admin dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const total = tickets.length;
  const open = tickets.filter((ticket) => ticket.status !== "resolved" && ticket.status !== "closed").length;
  const resolved = tickets.filter((ticket) => ticket.status === "resolved" || ticket.status === "closed").length;
  const resolutionRate = total ? `${Math.round((resolved / total) * 100)}%` : "No data";
  const escalations = tickets.filter((ticket) => ticket.priority === "P1" || ticket.urgency === "high").length;

  return (
    <DashboardShell title="Admin Console" navItems={adminNav} requiredRole="admin">
      <div className="glass rounded-2xl p-6 border border-border">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Admin Overview</p>
            <h1 className="text-3xl font-bold">Centralized Management</h1>
          </div>
          <div className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
            {loading ? "Loading…" : `${usersCount} admin users & staff`}
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground max-w-2xl">
          Manage access, review cases, and tune AI behavior from one clean control panel.
        </p>
        {error && <div className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700">{error}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        <StatCard label="Total Cases" value={loading ? "Loading..." : total || "0"} icon={Ticket} accent="blue" />
        <StatCard label="Open Cases" value={loading ? "Loading..." : open || "0"} icon={Inbox} accent="cyan" />
        <StatCard label="Resolution Rate" value={loading ? "Loading..." : resolutionRate} icon={CheckCircle2} accent="success" />
        <StatCard label="AI Escalations" value={loading ? "Loading..." : escalations || "0"} icon={ShieldCheck} accent="purple" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="glass rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Case activity</h3>
            <span className="text-xs text-muted-foreground">Recent trend</span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={tickets.map((ticket) => ({
                  day: new Date(ticket.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                  open: ticket.status !== "resolved" && ticket.status !== "closed" ? 1 : 0,
                  resolved: ticket.status === "resolved" || ticket.status === "closed" ? 1 : 0,
                }))}
              >
                <defs>
                  <linearGradient id="gOpen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #475569", borderRadius: 8 }} />
                <Area type="monotone" dataKey="open" stroke="#3b82f6" fill="url(#gOpen)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#8b5cf6" fill="url(#gRes)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {tickets.length === 0 && !loading && <p className="mt-4 text-sm text-muted-foreground">No ticket activity found yet.</p>}
        </div>

        <div className="glass rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Performance snapshot</h3>
            <span className="text-xs text-muted-foreground">Current score</span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={tickets.length
                  ? [{ month: new Date().toLocaleString("en-US", { month: "short" }), score: total ? Math.round((resolved / total) * 100) : 0 }]
                  : []}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #475569", borderRadius: 8 }} />
                <Line type="monotone" dataKey="score" stroke="#14b8a6" strokeWidth={3} dot={{ r: 5, fill: "#14b8a6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {tickets.length === 0 && !loading && <p className="mt-4 text-sm text-muted-foreground">No performance data to display until tickets are created.</p>}
        </div>
      </div>
    </DashboardShell>
  );
}

// Operations dashboard
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { departmentPerf } from "@/lib/mock-data";

const slaData = [
  { name: "On Time", value: 78, color: "oklch(0.72 0.2 155)" },
  { name: "Warning", value: 16, color: "oklch(0.82 0.18 85)" },
  { name: "Breached", value: 6, color: "oklch(0.65 0.27 25)" },
];

const agentActivity = [
  { name: "Sarah", active: 24 },
  { name: "Marcus", active: 19 },
  { name: "Aisha", active: 28 },
  { name: "Diego", active: 14 },
  { name: "Yuki", active: 22 },
];

export default function Operations() {
  return (
    <DashboardShell title="Operations" navItems={adminNav} requiredRole="admin">
      <h1 className="text-2xl font-bold text-gradient">Operations Dashboard</h1>
      <p className="text-sm text-muted-foreground">Real-time view of departments, agents, and SLA performance.</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Panel title="Ticket Overview by Department">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentPerf}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.05 270 / 0.3)" />
              <XAxis dataKey="name" stroke="oklch(0.7 0.02 260)" />
              <YAxis stroke="oklch(0.7 0.02 260)" />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.04 270)", border: "1px solid oklch(0.5 0.08 280 / 0.4)", borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="tickets" fill="oklch(0.72 0.22 250)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" fill="oklch(0.7 0.27 305)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="SLA Performance">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={slaData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                {slaData.map((d) => <Cell key={d.name} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "oklch(0.18 0.04 270)", border: "1px solid oklch(0.5 0.08 280 / 0.4)", borderRadius: 8 }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Agent Activity">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={agentActivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.05 270 / 0.3)" />
              <XAxis type="number" stroke="oklch(0.7 0.02 260)" />
              <YAxis type="category" dataKey="name" stroke="oklch(0.7 0.02 260)" />
              <Tooltip contentStyle={{ background: "oklch(0.18 0.04 270)", border: "1px solid oklch(0.5 0.08 280 / 0.4)", borderRadius: 8 }} />
              <Bar dataKey="active" fill="oklch(0.85 0.18 200)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Department Performance">
          <div className="space-y-3">
            {departmentPerf.map((d) => {
              const pct = Math.round((d.resolved / d.tickets) * 100);
              return (
                <div key={d.name}>
                  <div className="flex justify-between text-xs">
                    <span>{d.name}</span>
                    <span className="text-neon-cyan">{pct}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-gradient-neon" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  );
}

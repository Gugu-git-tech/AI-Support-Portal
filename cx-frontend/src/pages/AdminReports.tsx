// Reports & Insights
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from "recharts";
import { ticketTrend, departmentPerf, monthlyPerf } from "@/lib/mock-data";

export default function Reports() {
  return (
    <DashboardShell title="Reports & Insights" navItems={adminNav} requiredRole="admin">
      <h1 className="text-2xl font-bold text-gradient">Reports & Insights</h1>
      <p className="text-sm text-muted-foreground">Visualize trends and operational health.</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Chart title="Ticket Trends (Weekly)">
          <LineChart data={ticketTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.05 270 / 0.3)" />
            <XAxis dataKey="day" stroke="oklch(0.7 0.02 260)" />
            <YAxis stroke="oklch(0.7 0.02 260)" />
            <Tooltip contentStyle={tip} />
            <Legend />
            <Line type="monotone" dataKey="open" stroke="oklch(0.72 0.22 250)" strokeWidth={2.5} />
            <Line type="monotone" dataKey="resolved" stroke="oklch(0.7 0.27 305)" strokeWidth={2.5} />
          </LineChart>
        </Chart>

        <Chart title="Resolution Trends (Monthly Score)">
          <LineChart data={monthlyPerf}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.05 270 / 0.3)" />
            <XAxis dataKey="month" stroke="oklch(0.7 0.02 260)" />
            <YAxis stroke="oklch(0.7 0.02 260)" />
            <Tooltip contentStyle={tip} />
            <Line type="monotone" dataKey="score" stroke="oklch(0.85 0.18 200)" strokeWidth={3} dot={{ r: 5 }} />
          </LineChart>
        </Chart>

        <Chart title="Department Statistics" wide>
          <BarChart data={departmentPerf}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.05 270 / 0.3)" />
            <XAxis dataKey="name" stroke="oklch(0.7 0.02 260)" />
            <YAxis stroke="oklch(0.7 0.02 260)" />
            <Tooltip contentStyle={tip} />
            <Legend />
            <Bar dataKey="tickets" fill="oklch(0.72 0.22 250)" radius={[6, 6, 0, 0]} />
            <Bar dataKey="resolved" fill="oklch(0.7 0.27 305)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </Chart>

        <Chart title="Monthly Performance">
          <BarChart data={monthlyPerf}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.4 0.05 270 / 0.3)" />
            <XAxis dataKey="month" stroke="oklch(0.7 0.02 260)" />
            <YAxis stroke="oklch(0.7 0.02 260)" />
            <Tooltip contentStyle={tip} />
            <Bar dataKey="score" fill="oklch(0.85 0.18 200)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </Chart>
      </div>
    </DashboardShell>
  );
}

const tip = { background: "oklch(0.18 0.04 270)", border: "1px solid oklch(0.5 0.08 280 / 0.4)", borderRadius: 8 };

function Chart({ title, children, wide }: { title: string; children: React.ReactElement; wide?: boolean }) {
  return (
    <div className={`glass rounded-2xl p-6 ${wide ? "lg:col-span-2" : ""}`}>
      <h3 className="font-semibold mb-3">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </div>
  );
}

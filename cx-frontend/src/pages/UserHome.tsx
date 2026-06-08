// User dashboard home
import { Home, Ticket, User, Settings, Activity, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { tickets } from "@/lib/mock-data";

const nav: NavItem[] = [
  { label: "Home", to: "/user/home", icon: Home },
  { label: "Submit Ticket", to: "/user/submit", icon: Ticket },
  { label: "Profile", to: "/user/profile", icon: User },
  { label: "Settings", to: "/user/settings", icon: Settings },
];

export default function UserHome() {
  const recent = tickets.slice(0, 4);
  return (
    <DashboardShell title="User Console" navItems={nav} requiredRole="user">
      <Hero />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="My Tickets" value={12} icon={Ticket} accent="blue" hint="All time" />
        <StatCard label="Open" value={3} icon={Activity} accent="cyan" hint="In progress" />
        <StatCard label="Resolved" value={8} icon={CheckCircle2} accent="success" />
        <StatCard label="Pending" value={1} icon={Clock} accent="warning" />
      </div>

      <h3 className="mt-8 text-lg font-semibold">Recent Tickets</h3>
      <div className="grid sm:grid-cols-2 gap-4 mt-3">
        {recent.map((t) => (
          <div key={t.id} className="glass rounded-xl p-4 hover:scale-[1.01] transition animate-float-in">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">{t.id} · {t.department}</p>
                <p className="font-medium mt-1">{t.subject}</p>
              </div>
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-gradient-neon text-primary-foreground">
                {t.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> {t.priority}</span>
              <span>{t.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}

export function Hero() {
  return (
    <div className="glass rounded-2xl p-6 lg:p-8 neon-border cyber-grid">
      <p className="text-xs uppercase tracking-widest text-neon-cyan">Welcome to</p>
      <h1 className="text-3xl lg:text-4xl font-bold mt-2 text-gradient">
        CX Expert AI Support Portal
      </h1>
      <p className="mt-3 text-sm lg:text-base text-muted-foreground max-w-3xl leading-relaxed">
        A centralized support operations platform designed to streamline ticket management,
        improve service delivery, monitor SLA performance, and enhance communication between
        users, agents, and administrators.
      </p>
    </div>
  );
}

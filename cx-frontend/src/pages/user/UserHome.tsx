// User dashboard home
import {
  Home,
  Ticket,
  User,
  Settings,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Bot,
  Sparkles,
} from "lucide-react";

import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { tickets } from "@/lib/api";
import { useState } from "react";

const nav: NavItem[] = [
  { label: "Home", to: "/user/home", icon: Home },
  { label: "Submit Ticket", to: "/user/submit", icon: Ticket },
  { label: "Profile", to: "/user/profile", icon: User },
  { label: "Settings", to: "/user/settings", icon: Settings },
];

export default function UserHome() {
  const [query, setQuery] = useState("");
  const recent = tickets.slice(0, 4);

  // dynamic stats
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "Open").length;
  const resolved = tickets.filter((t) => t.status === "Resolved").length;
  const pending = tickets.filter((t) => t.status === "Pending").length;

  return (
    <DashboardShell title="User Console" navItems={nav} requiredRole="user">
      
      {/* 🔥 HERO */}
      <Hero />

      {/* 🔍 SMART SEARCH (AI ENTRY POINT) */}
      <div className="mt-6 glass rounded-xl p-4 flex items-center gap-3 border border-white/10">
        <Search className="text-muted-foreground" />
        <input
          type="text"
          placeholder="Ask AI or search for help..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent outline-none w-full text-sm"
        />
        <Sparkles className="text-neon-cyan" />
      </div>

      {/* 🤖 QUICK ACTIONS */}
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <div className="glass p-5 rounded-xl hover:scale-[1.02] transition cursor-pointer border border-neon-cyan/30">
          <div className="flex items-center gap-3">
            <Bot className="text-neon-cyan" />
            <div>
              <p className="font-semibold">Ask AI Assistant</p>
              <p className="text-xs text-muted-foreground">
                Get instant help before creating a ticket
              </p>
            </div>
          </div>
        </div>

        <div className="glass p-5 rounded-xl hover:scale-[1.02] transition cursor-pointer border border-primary/30">
          <div className="flex items-center gap-3">
            <Ticket className="text-primary" />
            <div>
              <p className="font-semibold">Submit a Ticket</p>
              <p className="text-xs text-muted-foreground">
                Reach out to support team
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <StatCard label="My Tickets" value={total} icon={Ticket} accent="blue" />
        <StatCard label="Open" value={open} icon={Activity} accent="cyan" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} accent="success" />
        <StatCard label="Pending" value={pending} icon={Clock} accent="warning" />
      </div>

      {/* 🎫 RECENT TICKETS */}
      <div className="flex items-center justify-between mt-8">
        <h3 className="text-lg font-semibold">Recent Tickets</h3>
        <span className="text-xs text-muted-foreground">View all</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-3">
        {recent.map((t) => (
          <div
            key={t.id}
            className="glass rounded-xl p-4 hover:scale-[1.02] transition border border-white/10"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-muted-foreground">
                  {t.id} · {t.department}
                </p>
                <p className="font-medium mt-1">{t.subject}</p>
              </div>

              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-gradient-neon text-primary-foreground">
                {t.status}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> {t.priority}
              </span>
              <span>{t.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 💡 AI SUGGESTIONS (NEW) */}
      <div className="mt-8 glass rounded-xl p-5 border border-neon-cyan/20">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="text-neon-cyan" />
          <p className="font-semibold">AI Suggestions</p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• Having login issues? Try resetting your password.</p>
          <p>• Billing issue? Check your latest invoice in profile.</p>
          <p>• Slow system? Clear cache or try another browser.</p>
        </div>
      </div>

    </DashboardShell>
  );
}

/* HERO */
export function Hero() {
  return (
    <div className="glass rounded-2xl p-6 lg:p-8 neon-border cyber-grid">
      <p className="text-xs uppercase tracking-widest text-neon-cyan">
        Welcome to
      </p>

      <h1 className="text-3xl lg:text-4xl font-bold mt-2 text-gradient">
        CX Expert AI Support Portal
      </h1>

      <p className="mt-3 text-sm lg:text-base text-muted-foreground max-w-3xl leading-relaxed">
        Get instant help using AI, search knowledge articles, or create support
        tickets. Track your requests and stay updated in real-time.
      </p>
    </div>
  );
}
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import {
  Home,
  SendHorizonal,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { authService } from "@/services/authService";
import { Toaster } from "@/components/ui/sonner";

type NavItem = {
  to: "/" | "/submit" | "/admin" | "/profile" | "/settings";
  label: string;
  icon: typeof Home;
  exact?: boolean;
  adminOnly?: boolean;
};

const userNav: NavItem[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/submit", label: "Submit Request", icon: SendHorizonal },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

const adminNav: NavItem[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/admin", label: "Command Center", icon: LayoutDashboard },
  { to: "/submit", label: "Submit Request", icon: SendHorizonal },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<"admin" | "agent" | "user">("user");

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/auth");
      return;
    }
    setRole(authService.getUser().role);
    setReady(true);
  }, [navigate, path]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Establishing secure session…
        </span>
      </div>
    );
  }

  const nav = role === "admin" ? adminNav : userNav;

  return (
    <div className="min-h-screen flex w-full text-foreground">
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar/80 backdrop-blur-xl">
        <div className="px-5 py-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center neon-border animate-pulse-glow bg-card">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold neon-text leading-tight">CX Expert</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AI Ops Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border border-transparent ${
                  active
                    ? "bg-sidebar-accent text-foreground neon-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 hover:border-border"
                }`}
              >
                <Icon className={`w-4 h-4 transition-colors ${active ? "text-primary" : "group-hover:text-primary"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => authService.signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all border border-transparent hover:border-destructive/40"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-background/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold neon-text">CX Expert</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>
                {role === "admin" ? "Admin Workspace · Elevated access" : "User Workspace · Secure channel"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-card border border-border">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              All systems nominal
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 md:py-10">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav
          className="md:hidden sticky bottom-0 border-t border-border bg-sidebar/95 backdrop-blur-xl grid"
          style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
        >
          {nav.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center py-2 text-[10px] gap-1 ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{item.label.split(" ")[0]}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <Toaster theme="dark" position="top-right" />
    </div>
  );
}
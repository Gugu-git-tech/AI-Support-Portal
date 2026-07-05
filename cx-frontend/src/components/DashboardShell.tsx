// Sidebar dashboard layout shared by user/agent/admin
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { LogOut, Menu, Shield, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { clearUser, getUser, type MockUser } from "@/lib/auth";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

interface Props {
  title: string;
  navItems: NavItem[];
  requiredRole: "user" | "agent" | "admin";
  children: ReactNode;
}

export function DashboardShell({ title, navItems, requiredRole, children }: Props) {
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const [user, setUser] = useState<MockUser | null>(null);
  const [open, setOpen] = useState(false);

  // Mock auth guard (client side only)
  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== requiredRole) {
      navigate("/");
      return;
    }
    setUser(u);
  }, [requiredRole, navigate, pathname]);

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen cyber-grid flex w-full">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 glass border-r border-border transition-transform",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <div className="rounded-lg bg-gradient-neon p-2 glow-blue">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-gradient">CX Expert</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{title}</p>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                  active
                    ? "bg-gradient-neon text-primary-foreground glow-blue font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-danger hover:bg-secondary/60 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="glass rounded-lg p-3 border border-border">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-[10px] uppercase tracking-widest text-neon-purple">{user.role}</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 glass border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-secondary"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden lg:block">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Support Operations Center</p>
            <p className="text-sm font-medium text-gradient">{title}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-muted-foreground">System Operational</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-neon flex items-center justify-center text-lg">
              {user.avatar ?? "🤖"}
            </div>
            <button onClick={handleLogout} className="ml-3 text-sm px-3 py-1 rounded hover:bg-secondary">
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

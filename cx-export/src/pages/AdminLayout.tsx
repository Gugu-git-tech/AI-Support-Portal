import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LayoutDashboard, UserCog, Settings2, ShieldAlert } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { authService } from "@/services/authService";

type Tab = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const tabs: Tab[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/profile", label: "Admin Profile", icon: UserCog },
  { to: "/admin/settings", label: "System Config", icon: Settings2 },
];

export default function AdminLayout() {
  const path = useLocation().pathname;
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) return navigate("/auth");
    if (authService.getUser().role !== "admin") return navigate("/");
    setAllowed(true);
  }, [navigate]);

  if (!allowed) {
    return (
      <AppLayout>
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <ShieldAlert className="w-4 h-4 text-destructive" />
          Verifying administrative authorization…
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-6 flex flex-wrap items-center gap-1 p-1 rounded-lg border border-border bg-card/60 backdrop-blur-xl w-fit">
        {tabs.map((t) => {
          const active = t.exact ? path === t.to : path.startsWith(t.to);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${
                active
                  ? "bg-primary/15 text-primary border border-primary/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </AppLayout>
  );
}

import { useEffect, useState } from "react";
import { ShieldCheck, BadgeCheck, Server, KeyRound } from "lucide-react";
import { authService } from "@/services/authService";

export function AdminProfileView() {
  const [user, setUser] = useState(() => authService.getUser());
  useEffect(() => setUser(authService.getUser()), []);

  return (
    <div className="max-w-4xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Admin Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Operational identity and elevated credentials for the CX Expert workspace.
        </p>
      </header>

      <div className="rounded-2xl border border-primary/30 bg-card/60 backdrop-blur-xl p-6 md:p-8 neon-border">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center animate-pulse-glow">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold">{user.name} {user.surname}</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-primary/40 bg-primary/10 text-primary text-xs">
                <BadgeCheck className="w-3 h-3" /> {user.role.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{user.designation ?? "Operations Administrator"}</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{user.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Cred icon={KeyRound} label="Operator ID" value={user.id} />
          <Cred icon={Server} label="Tenant" value="digifycx-prod" />
          <Cred icon={ShieldCheck} label="Clearance" value="Tier 3 · Full Ops" />
        </div>
      </div>
    </div>
  );
}

function Cred({ icon: Icon, label, value }: { icon: typeof ShieldCheck; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="w-3.5 h-3.5 text-primary" /> {label}
      </div>
      <p className="text-sm font-mono mt-1 truncate">{value}</p>
    </div>
  );
}
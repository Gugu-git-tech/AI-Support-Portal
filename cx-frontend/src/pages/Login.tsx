// Login page with role selection — mock auth, frontend only
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shield, User, Headphones, ShieldCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardPath, saveUser, type Role } from "@/lib/mock-auth";

const roleCards: { role: Role; label: string; desc: string; icon: typeof User }[] = [
  { role: "user", label: "User", desc: "Submit and track support tickets", icon: User },
  { role: "agent", label: "Agent", desc: "Resolve assigned support tickets", icon: Headphones },
  { role: "admin", label: "Admin", desc: "Oversee operations and SLAs", icon: ShieldCheck },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 4) {
      setError("Password must be at least 4 characters.");
      return;
    }
    // Mock sign in
    saveUser({
      name: email.split("@")[0] || "Demo User",
      email,
      role,
      department: "Technical Support",
      avatar: "🤖",
    });
    navigate(dashboardPath(role));
  };

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Branding */}
        <div className="hidden lg:block animate-float-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-xl bg-gradient-neon p-3 glow-blue animate-pulse-glow">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">CX Expert</h1>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            AI-Powered <span className="text-gradient">Support Operations</span> Center
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Centralized ticket management, real-time SLA monitoring, and seamless collaboration between users, agents, and administrators.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Tickets", "SLA", "Insights"].map((t) => (
              <div key={t} className="glass rounded-lg p-3 text-center">
                <Zap className="h-4 w-4 mx-auto text-neon-cyan" />
                <p className="text-xs mt-1 text-muted-foreground">{t}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Auth card */}
        <div className="glass rounded-2xl p-6 sm:p-8 neon-border animate-float-in">
          <h3 className="text-2xl font-bold">Sign In</h3>
          <p className="text-sm text-muted-foreground mt-1">Choose your role to continue.</p>

          <div className="grid grid-cols-3 gap-2 mt-6">
            {roleCards.map((r) => {
              const Icon = r.icon;
              const active = role === r.role;
              return (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => setRole(r.role)}
                  className={cn(
                    "rounded-xl p-3 border text-left transition-all",
                    active
                      ? "border-primary bg-gradient-neon text-primary-foreground glow-purple"
                      : "border-border bg-secondary/40 hover:border-primary/60",
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <p className="text-sm font-semibold">{r.label}</p>
                  <p className={cn("text-[10px] mt-0.5", active ? "opacity-90" : "text-muted-foreground")}>
                    {r.desc}
                  </p>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && (
              <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-md p-2">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-neon py-3 font-semibold text-primary-foreground glow-blue hover:scale-[1.01] transition-transform"
            >
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="text-neon-cyan hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

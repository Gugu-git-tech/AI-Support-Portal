// Register page — mock signup, frontend only
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Shield, User, Headphones, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardPath, saveUser, type Role } from "@/lib/mock-auth";

const roles: { role: Role; label: string; icon: typeof User }[] = [
  { role: "user", label: "User", icon: User },
  { role: "agent", label: "Agent", icon: Headphones },
  { role: "admin", label: "Admin", icon: ShieldCheck },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    saveUser({ name, email, role, department: "Technical Support", avatar: "🤖" });
    navigate(dashboardPath(role));
  };

  return (
    <div className="min-h-screen cyber-grid flex items-center justify-center p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md neon-border animate-float-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-lg bg-gradient-neon p-2 glow-blue">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-gradient">CX Expert</h1>
        </div>
        <h3 className="text-2xl font-bold">Create Account</h3>
        <p className="text-sm text-muted-foreground mt-1">Choose your role and get started.</p>

        <div className="grid grid-cols-3 gap-2 mt-6">
          {roles.map((r) => {
            const Icon = r.icon;
            const active = role === r.role;
            return (
              <button
                key={r.role}
                type="button"
                onClick={() => setRole(r.role)}
                className={cn(
                  "rounded-xl p-3 border text-center transition-all",
                  active
                    ? "border-primary bg-gradient-neon text-primary-foreground glow-purple"
                    : "border-border bg-secondary/40 hover:border-primary/60",
                )}
              >
                <Icon className="h-5 w-5 mx-auto mb-1" />
                <p className="text-xs font-semibold">{r.label}</p>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Full Name" value={name} onChange={setName} placeholder="Jane Doe" />
          <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" />
          <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
          {error && <p className="text-xs text-danger bg-danger/10 border border-danger/30 rounded-md p-2">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-neon py-3 font-semibold text-primary-foreground glow-blue hover:scale-[1.01] transition-transform"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link to="/" className="text-neon-cyan hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

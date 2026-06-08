// Admin profile settings
import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { adminNav } from "@/lib/admin-nav";
import { getUser, saveUser, type MockUser } from "@/lib/mock-auth";
import { avatars } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function AdminProfile() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (u) { setUser(u); setName(u.name); setEmail(u.email); }
  }, []);

  if (!user) return null;

  const setAvatar = (emoji: string) => {
    const next = { ...user, avatar: emoji };
    setUser(next); saveUser(next);
  };

  const save = () => {
    saveUser({ ...user, name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell title="Profile Settings" navItems={adminNav} requiredRole="admin">
      <h1 className="text-2xl font-bold text-gradient">Profile Settings</h1>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="glass rounded-2xl p-6 neon-border text-center">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-neon flex items-center justify-center text-4xl glow-purple">
            {user.avatar ?? "🤖"}
          </div>
          <p className="mt-3 font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.role.toUpperCase()}</p>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2 space-y-4">
          <div>
            <h3 className="font-semibold">Select Avatar</h3>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {avatars.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAvatar(a.emoji)}
                  className={cn(
                    "rounded-lg p-3 border text-center text-2xl transition",
                    user.avatar === a.emoji ? "border-primary bg-gradient-neon glow-blue" : "border-border bg-secondary/40",
                  )}
                  title={a.label}
                >
                  {a.emoji}
                </button>
              ))}
            </div>
          </div>
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} />
          <button
            onClick={save}
            className="rounded-lg bg-gradient-neon px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-blue hover:scale-[1.01] transition"
          >
            Save Changes
          </button>
          {saved && <p className="text-xs text-success">Saved successfully.</p>}
        </div>
      </div>
    </DashboardShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

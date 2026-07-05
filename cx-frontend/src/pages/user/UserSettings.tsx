// User settings: Appearance + Profile
import { useEffect, useState } from "react";
import { Home, Ticket, User, Settings, Moon, Sun } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { getUser, saveUser, type MockUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav: NavItem[] = [
  { label: "Home", to: "/user/home", icon: Home },
  { label: "Submit Ticket", to: "/user/submit", icon: Ticket },
  { label: "Profile", to: "/user/profile", icon: User },
  { label: "Settings", to: "/user/settings", icon: Settings },
];

export default function SettingsPage() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser(u);
      setName(u.name);
      setEmail(u.email);
    }
    const t = (localStorage.getItem("cx_theme") as "dark" | "light") ?? "dark";
    setTheme(t);
    document.documentElement.classList.toggle("light", t === "light");
  }, []);

  const applyTheme = (t: "dark" | "light") => {
    setTheme(t);
    localStorage.setItem("cx_theme", t);
    document.documentElement.classList.toggle("light", t === "light");
  };

  const save = () => {
    if (!user) return;
    saveUser({ ...user, name, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <DashboardShell title="Settings" navItems={nav} requiredRole="user">
      <h1 className="text-2xl font-bold text-gradient">Settings</h1>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <section className="glass rounded-2xl p-6 neon-border">
          <h3 className="font-semibold">Appearance</h3>
          <p className="text-xs text-muted-foreground mt-1">Switch between dark and light mode.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <ThemeOption active={theme === "dark"} icon={Moon} label="Dark Mode" onClick={() => applyTheme("dark")} />
            <ThemeOption active={theme === "light"} icon={Sun} label="Light Mode" onClick={() => applyTheme("light")} />
          </div>
        </section>

        <section className="glass rounded-2xl p-6">
          <h3 className="font-semibold">Profile Settings</h3>
          <div className="mt-4 space-y-3">
            <Field label="Name" value={name} onChange={setName} />
            <Field label="Email" value={email} onChange={setEmail} />
            <p className="text-xs text-muted-foreground">
              Update profile picture from the <span className="text-neon-cyan">Profile</span> page.
            </p>
            <button
              onClick={save}
              className="rounded-lg bg-gradient-neon px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-blue hover:scale-[1.01] transition"
            >
              Save Changes
            </button>
            {saved && <p className="text-xs text-success">Saved successfully.</p>}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function ThemeOption({ active, icon: Icon, label, onClick }: { active: boolean; icon: typeof Moon; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl p-4 border text-center transition-all",
        active ? "border-primary bg-gradient-neon text-primary-foreground glow-purple" : "border-border bg-secondary/40",
      )}
    >
      <Icon className="h-5 w-5 mx-auto" />
      <p className="mt-2 text-sm">{label}</p>
    </button>
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

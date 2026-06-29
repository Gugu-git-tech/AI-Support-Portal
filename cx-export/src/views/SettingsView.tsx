import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Gauge, LogOut, Palette, ShieldCheck } from "lucide-react";
import { authService } from "@/services/authService";

const SPEED_KEY = "cx_anim_speed";

export function SettingsView() {
  const [notif, setNotif] = useState(true);
  const [digest, setDigest] = useState(false);
  const [appearance, setAppearance] = useState<"compact" | "comfortable">("comfortable");
  const [speed, setSpeed] = useState<number>(() => {
    if (typeof window === "undefined") return 100;
    return Number(window.localStorage.getItem(SPEED_KEY) ?? 100);
  });

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.setProperty("--neon-speed", `${(200 - speed) / 100}`);
    window.localStorage.setItem(SPEED_KEY, String(speed));
  }, [speed]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Personal preferences for your CX Expert workspace.
        </p>
      </header>

      <Section icon={Bell} title="Notifications">
        <Toggle label="Status email notifications" checked={notif} onChange={setNotif} />
        <Toggle label="Weekly digest email" checked={digest} onChange={setDigest} />
      </Section>

      <Section icon={Palette} title="Appearance">
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm">Theme</p>
            <p className="text-xs text-muted-foreground">Advanced dark mode is enforced.</p>
          </div>
          <span className="px-2 py-1 text-xs rounded-md border border-primary/40 bg-primary/10 text-primary">
            Neon Dark
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm">Layout density</p>
            <p className="text-xs text-muted-foreground">Controls spacing across views.</p>
          </div>
          <div className="flex gap-1 p-1 rounded-md border border-border bg-background/40">
            {(["compact", "comfortable"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setAppearance(m)}
                className={`px-3 py-1 text-xs rounded ${
                  appearance === m ? "bg-primary/15 text-primary border border-primary/40" : "text-muted-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section icon={Gauge} title="Animation Speed">
        <div className="flex items-center gap-4 py-2">
          <span className="text-xs text-muted-foreground w-12">Calm</span>
          <input
            type="range"
            min={20}
            max={180}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="flex-1 accent-[var(--primary)]"
          />
          <span className="text-xs text-muted-foreground w-12 text-right">Vivid</span>
        </div>
        <p className="text-xs text-muted-foreground">Tunes neon pulse and glow transitions.</p>
      </Section>

      <Section icon={ShieldCheck} title="Account">
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => toast.success("Preferences saved")}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium glow-hover"
          >
            Save Preferences
          </button>
          <button
            onClick={() => authService.signOut()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/40 text-destructive text-sm hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </Section>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Bell;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-primary" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-2 cursor-pointer">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition border ${
          checked ? "bg-primary/40 border-primary/60" : "bg-input border-border"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-all ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

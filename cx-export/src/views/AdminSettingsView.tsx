import { useState } from "react";
import { toast } from "sonner";
import { Server, Zap, Webhook, Sliders, ShieldCheck, Trash2, LogOut } from "lucide-react";
import { authService } from "@/services/authService";

export function AdminSettingsView() {
  const [env, setEnv] = useState<"Dev" | "Staging" | "Prod">("Staging");
  const [zendesk, setZendesk] = useState(true);
  const [slack, setSlack] = useState(false);
  const [temp, setTemp] = useState(0.3);
  const [enforcement, setEnforcement] = useState<"Lenient" | "Strict" | "Block">("Strict");

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-3xl font-bold">System Configuration</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Operational toggles, AI tuning parameters and cache controls.
        </p>
      </header>

      <Section icon={Server} title="Target API Environment">
        <div className="flex gap-1 p-1 rounded-md border border-border bg-background/40 w-fit">
          {(["Dev", "Staging", "Prod"] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEnv(e)}
              className={`px-3 py-1.5 text-xs rounded ${
                env === e ? "bg-primary/15 text-primary border border-primary/40" : "text-muted-foreground"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </Section>

      <Section icon={Webhook} title="Integrations">
        <Toggle label="Zendesk Direct Sync" checked={zendesk} onChange={setZendesk} />
        <Toggle label="Slack Webhook Notifications" checked={slack} onChange={setSlack} />
      </Section>

      <Section icon={Zap} title="Groq AI Temperature">
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="flex-1 accent-[var(--primary)]"
          />
          <span className="text-sm font-mono w-12 text-right text-primary">{temp.toFixed(2)}</span>
        </div>
        <p className="text-xs text-muted-foreground">Lower = deterministic schema validation.</p>
      </Section>

      <Section icon={Sliders} title="Schema Enforcement">
        <div className="flex gap-1 p-1 rounded-md border border-border bg-background/40 w-fit">
          {(["Lenient", "Strict", "Block"] as const).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => setEnforcement(e)}
              className={`px-3 py-1.5 text-xs rounded ${
                enforcement === e ? "bg-primary/15 text-primary border border-primary/40" : "text-muted-foreground"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </Section>

      <Section icon={ShieldCheck} title="Operations">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toast.success(`Configuration deployed to ${env}`)}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium glow-hover"
          >
            Save Configuration
          </button>
          <button
            onClick={() => toast("KV cache eviction triggered", { description: "All cached schemas flushed." })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-accent/40 text-accent text-sm hover:bg-accent/10"
          >
            <Trash2 className="w-4 h-4" /> Force KV Cache Eviction
          </button>
          <button
            onClick={() => authService.signOut()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-destructive/40 text-destructive text-sm hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" /> Admin Log-Out
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
  icon: typeof Server;
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
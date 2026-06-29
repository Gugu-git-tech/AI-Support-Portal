import { Link } from "react-router-dom";
import {
  Zap,
  ShieldCheck,
  BarChart3,
  Workflow,
  ArrowRight,
  Cpu,
  GitBranch,
  Layers,
} from "lucide-react";

export function HomeView() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative px-6 md:px-12 py-12 md:py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/40 bg-primary/10 text-xs text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            DIGIFYCX · BPO · ZENDESK INTEGRATION ONLINE
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl">
            Welcome to the <span className="neon-text">CX Expert AI Support Portal</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-2xl">
            A centralized command surface engineered to <span className="text-foreground">log, process and optimize</span> every
            support ticket flowing through Digifycx BPO — augmented by Groq-validated JSON
            schemas and real-time operational telemetry.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium glow-hover"
            >
              Submit a Request <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:border-primary/60 transition"
            >
              Open Command Center
            </Link>
          </div>
        </div>
      </section>

      {/* Branding grid */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Integrated Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "DIGIFYCX", sub: "Operations Layer", icon: Layers },
            { label: "BPO", sub: "Business Process Outsourcing", icon: Workflow },
            { label: "ZENDESK", sub: "Ticket Source of Truth", icon: GitBranch },
          ].map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.label}
                className="group relative p-6 rounded-xl border border-border bg-card/60 backdrop-blur hover:border-primary/60 transition overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition" />
                <Icon className="w-6 h-6 text-primary mb-4" />
                <p className="font-mono text-xl tracking-wider neon-text">{b.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{b.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pipeline explainer */}
      <section className="grid lg:grid-cols-3 gap-4">
        {[
          {
            icon: Zap,
            title: "Ingest",
            desc: "Raw, unstructured ticket text is captured from every channel — chat, email, Zendesk, voice transcripts — through a single hardened endpoint.",
          },
          {
            icon: Cpu,
            title: "Validate",
            desc: "Groq-accelerated LLM inference normalizes messy input into a strict JSON schema with intent, severity, region and owner routing.",
          },
          {
            icon: BarChart3,
            title: "Optimize",
            desc: "The Admin Command Center surfaces SLA risk, queue depth and resolution velocity in real time for CX leadership.",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="p-6 rounded-xl border border-border bg-card/60 backdrop-blur hover:border-accent/60 transition"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-xl border border-border bg-card/40 p-6 flex items-start gap-4">
        <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">Backend-ready architecture.</span>{" "}
          The portal is wired through a dedicated <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-muted text-primary">services/authService</code> with JWT,
          refresh-token rotation, and request interceptor stubs — drop in a real backend in VS Code
          without rewiring components.
        </div>
      </section>
    </div>
  );
}
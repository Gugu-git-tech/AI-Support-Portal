import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { Toaster } from "@/components/ui/sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return toast.error("Enter a valid email");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (mode === "signup" && (!name.trim() || !surname.trim())) return toast.error("Name and surname required");
    setBusy(true);
    try {
      if (mode === "signin") await authService.signIn(email, password);
      else await authService.signUp({ name: name.trim(), surname: surname.trim(), email, password });
      toast.success(mode === "signin" ? "Welcome back" : "Account created");
      navigate("/" );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl" />

      <section className="relative w-full max-w-md rounded-2xl border border-border bg-card/70 backdrop-blur-xl p-8 neon-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center bg-card animate-pulse-glow neon-border">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold neon-text leading-tight">CX Expert</h1>
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">AI Support Portal</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 p-1 rounded-lg border border-border bg-background/40 mb-6">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-2 text-sm rounded-md transition ${
                mode === m ? "bg-primary/15 text-primary border border-primary/40" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <Field icon={UserIcon} placeholder="Name" value={name} onChange={setName} />
              <Field icon={UserIcon} placeholder="Surname" value={surname} onChange={setSurname} />
            </div>
          )}
          <Field icon={Mail} placeholder="Email" type="email" value={email} onChange={setEmail} />
          <Field icon={Lock} placeholder="Password" type="password" value={password} onChange={setPassword} />

          <button
            type="submit"
            disabled={busy}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-medium glow-hover disabled:opacity-50"
          >
            {busy ? "Authenticating…" : mode === "signin" ? "Sign In" : "Create Account"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3 h-3 text-primary" /> Encrypted channel · Digifycx BPO Zendesk
        </p>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Tip: use an email containing <code className="text-primary">admin</code> to access the Admin Workspace.
        </p>
      </section>

      <Toaster theme="dark" position="top-right" />
    </main>
  );
}

function Field({
  icon: Icon,
  ...props
}: {
  icon: typeof Mail;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type={props.type ?? "text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-input/60 border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none"
        required
      />
    </div>
  );
}
// Submit ticket form (mock submission)
import { useState } from "react";
import { Home, Ticket, User, Settings, Upload, CheckCircle2 } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { departments, categories, priorities } from "@/lib/mock-data";

const nav: NavItem[] = [
  { label: "Home", to: "/user/home", icon: Home },
  { label: "Submit Ticket", to: "/user/submit", icon: Ticket },
  { label: "Profile", to: "/user/profile", icon: User },
  { label: "Settings", to: "/user/settings", icon: Settings },
];

export default function SubmitTicket() {
  const [form, setForm] = useState({
    name: "", email: "", department: "", category: "",
    subject: "", priority: "", description: "", file: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const update = (k: string, v: string) => setForm({ ...form, [k]: v });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    (["name", "email", "department", "category", "subject", "priority", "description"] as const).forEach((f) => {
      if (!form[f]) errs[f] = "This field is required.";
    });
    if (form.email && !/.+@.+\..+/.test(form.email)) errs.email = "Enter a valid email.";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      setForm({ name: "", email: "", department: "", category: "", subject: "", priority: "", description: "", file: "" });
    }
  };

  return (
    <DashboardShell title="Submit Ticket" navItems={nav} requiredRole="user">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold text-gradient">New Support Request</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Provide as much detail as possible so our team can assist you quickly.
        </p>

        {success && (
          <div className="mt-4 glass rounded-lg p-4 border border-success/40 flex items-center gap-3 animate-float-in">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <p className="text-sm">Ticket submitted successfully! (Mock)</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 glass rounded-2xl p-6 space-y-4 neon-border">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} error={errors.name} onChange={(v) => update("name", v)} />
            <Input label="Email Address" type="email" value={form.email} error={errors.email} onChange={(v) => update("email", v)} />
            <Select label="Department" value={form.department} error={errors.department} options={departments} onChange={(v) => update("department", v)} />
            <Select label="Category" value={form.category} error={errors.category} options={categories} onChange={(v) => update("category", v)} />
            <Input label="Subject" value={form.subject} error={errors.subject} onChange={(v) => update("subject", v)} />
            <Select label="Priority" value={form.priority} error={errors.priority} options={priorities} onChange={(v) => update("priority", v)} />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea
              rows={5}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.description && <p className="mt-1 text-xs text-danger">{errors.description}</p>}
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Attachment</label>
            <label className="mt-1 flex items-center gap-3 rounded-lg border border-dashed border-border bg-input/40 px-4 py-6 cursor-pointer hover:border-primary transition">
              <Upload className="h-5 w-5 text-neon-cyan" />
              <span className="text-sm text-muted-foreground">
                {form.file || "Click to upload (mock — no file leaves your browser)"}
              </span>
              <input type="file" className="hidden" onChange={(e) => update("file", e.target.files?.[0]?.name ?? "")} />
            </label>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto rounded-lg bg-gradient-neon px-6 py-3 font-semibold text-primary-foreground glow-blue hover:scale-[1.01] transition"
          >
            Submit Ticket
          </button>
        </form>
      </div>
    </DashboardShell>
  );
}

function Input({ label, value, onChange, error, type = "text" }: { label: string; value: string; onChange: (v: string) => void; error?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

function Select({ label, value, options, onChange, error }: { label: string; value: string; options: string[]; onChange: (v: string) => void; error?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-input border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}

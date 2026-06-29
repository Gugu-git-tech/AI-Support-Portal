import { useState, useRef, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import { toast } from "sonner";
import {
  UploadCloud,
  FileText,
  X,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  departments,
  requestTypes,
  priorities,
  type Department,
  type RequestType,
  type Priority,
} from "@/services/ticketsData";
import { apiService } from "@/services/apiService";

interface FormState {
  fullName: string;
  email: string;
  department: Department | "";
  requestType: RequestType | "";
  priority: Priority | "";
  description: string;
}

const initial: FormState = {
  fullName: "",
  email: "",
  department: "",
  requestType: "",
  priority: "",
  description: "",
};

const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.txt,.log";

export function SubmitRequestView() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<{ ok: boolean; msg: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    else if (form.fullName.trim().length < 2) e.fullName = "Name is too short.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      e.email = "Enter a valid email address.";
    if (!form.department) e.department = "Select a department.";
    if (!form.requestType) e.requestType = "Select a request type.";
    if (!form.priority) e.priority = "Select a priority.";
    if (!form.description.trim()) e.description = "Description is required.";
    else if (form.description.trim().length < 12)
      e.description = "Please add a bit more detail (12+ characters).";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleFile = (f: File | null) => {
    setFileError(null);
    if (!f) return setFile(null);
    if (f.size > MAX_BYTES) {
      setFileError("File exceeds the 10MB limit.");
      return;
    }
    setFile(f);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0] ?? null);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBanner(null);
    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiService.submitTicket({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        department: form.department as Department,
        requestType: form.requestType as RequestType,
        priority: form.priority as Priority,
        description: form.description.trim(),
        fileName: file?.name,
      });
      toast.success(`Request submitted — ${res.id}`, {
        description: "Routed through Groq validator. Tracking is live in the Admin Dashboard.",
      });
      setBanner({ ok: true, msg: `Ticket ${res.id} created and queued for AI validation.` });
      reset();
    } catch {
      setBanner({ ok: false, msg: "Submission failed. Please retry." });
      toast.error("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setForm(initial);
    setErrors({});
    setFile(null);
    setFileError(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Submit Support Request</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          All submissions route through the centralized API service and are validated by the
          Groq schema layer before entering the queue.
        </p>
      </header>

      {banner && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            banner.ok
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-destructive/50 bg-destructive/10 text-destructive-foreground"
          }`}
        >
          {banner.ok ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 mt-0.5" />
          )}
          <span className="text-sm">{banner.msg}</span>
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 md:p-8 space-y-6"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <Field label="Full Name" required error={errors.fullName}>
            <input
              className={inputCls(errors.fullName)}
              placeholder="Jane Doe"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
            />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input
              type="email"
              className={inputCls(errors.email)}
              placeholder="jane@company.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>

          <Field label="Department" required error={errors.department}>
            <Select
              value={form.department}
              onChange={(v) => update("department", v as Department)}
              options={departments}
              placeholder="Select department"
              hasError={!!errors.department}
            />
          </Field>

          <Field label="Request Type" required error={errors.requestType}>
            <Select
              value={form.requestType}
              onChange={(v) => update("requestType", v as RequestType)}
              options={requestTypes}
              placeholder="Select request type"
              hasError={!!errors.requestType}
            />
          </Field>

          <Field label="Priority" required error={errors.priority}>
            <Select
              value={form.priority}
              onChange={(v) => update("priority", v as Priority)}
              options={priorities}
              placeholder="Select priority"
              hasError={!!errors.priority}
            />
          </Field>

          <Field label="Attachment" hint="PDF, image, doc, or log — up to 10MB">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`group cursor-pointer rounded-lg border border-dashed p-4 text-center transition ${
                dragOver
                  ? "border-primary bg-primary/10"
                  : "border-border bg-input/40 hover:border-primary/60"
              }`}
            >
              {file ? (
                <div className="flex items-center justify-between gap-2 text-left">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {(file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFile(null);
                    }}
                    className="p-1 rounded hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 py-2 text-muted-foreground group-hover:text-foreground">
                  <UploadCloud className="w-6 h-6 text-primary" />
                  <p className="text-sm">
                    Drop a file or <span className="text-primary">browse</span>
                  </p>
                </div>
              )}
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPT}
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFile(e.target.files?.[0] ?? null)
                }
              />
            </div>
            {fileError && <p className="text-xs text-destructive mt-1">{fileError}</p>}
          </Field>
        </div>

        <Field label="Description" required error={errors.description}>
          <textarea
            rows={6}
            className={inputCls(errors.description) + " resize-y min-h-[140px]"}
            placeholder="Describe the issue, context, urgency, affected accounts…"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>

        <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium glow-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-card hover:border-accent/60 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

function inputCls(err?: string) {
  return `w-full px-3 py-2.5 rounded-lg bg-input/60 border text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 transition ${
    err
      ? "border-destructive focus:ring-destructive/40"
      : "border-border focus:border-primary focus:ring-primary/30"
  }`;
}

function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  hasError,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
  hasError?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls(hasError ? " " : undefined) + " appearance-none cursor-pointer"}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
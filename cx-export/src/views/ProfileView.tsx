import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Camera, Save, User as UserIcon } from "lucide-react";
import { authService } from "@/services/authService";
import { apiService } from "@/services/apiService";

export function ProfileView() {
  const initial = authService.getUser();
  const [name, setName] = useState(initial.name);
  const [surname, setSurname] = useState(initial.surname);
  const [email, setEmail] = useState(initial.email);
  const [avatar, setAvatar] = useState<string | undefined>(initial.avatarUrl);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast.error("Please choose an image file");
    const url = await apiService.uploadAvatar(f);
    setAvatar(url);
    const u = authService.getUser();
    authService.setUser({ ...u, avatarUrl: url });
    toast.success("Avatar updated");
  };

  const save = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return toast.error("Invalid email");
    if (!name.trim() || !surname.trim()) return toast.error("Name and surname required");
    setSaving(true);
    try {
      await apiService.updateProfile({ name: name.trim(), surname: surname.trim(), email: email.trim() });
      toast.success("Profile saved");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account identity. Changes propagate through the centralized auth service.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 md:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-28 h-28 rounded-full border-2 border-primary/40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center overflow-hidden animate-pulse-glow">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 text-primary" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-accent text-accent-foreground shadow-lg hover:scale-110 transition"
              aria-label="Upload new avatar"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatar}
            />
          </div>
          <div className="text-center sm:text-left">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-border bg-input/40 text-sm hover:border-primary/60 transition"
            >
              Upload New Avatar
            </button>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG or WEBP. Square images render best.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <FieldInput label="Name" value={name} onChange={setName} />
          <FieldInput label="Surname" value={surname} onChange={setSurname} />
          <div className="md:col-span-2">
            <FieldInput label="Email" type="email" value={email} onChange={setEmail} />
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium glow-hover disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-input/60 border border-border text-sm focus:border-primary focus:ring-2 focus:ring-primary/30 focus:outline-none transition"
      />
    </div>
  );
}
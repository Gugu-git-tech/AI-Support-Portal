// Profile page with avatar selection
import { useEffect, useState } from "react";
import { Home, Ticket, User, Settings, Upload } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";
import { getUser, saveUser, type MockUser } from "@/lib/mock-auth";
import { avatars } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const nav: NavItem[] = [
  { label: "Home", to: "/user/home", icon: Home },
  { label: "Submit Ticket", to: "/user/submit", icon: Ticket },
  { label: "Profile", to: "/user/profile", icon: User },
  { label: "Settings", to: "/user/settings", icon: Settings },
];

export default function ProfilePage() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [uploadedImg, setUploadedImg] = useState<string | null>(null);

  useEffect(() => setUser(getUser()), []);

  if (!user) return null;

  const pickAvatar = (emoji: string) => {
    const next = { ...user, avatar: emoji };
    setUser(next);
    saveUser(next);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setUploadedImg(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <DashboardShell title="Profile" navItems={nav} requiredRole="user">
      <h1 className="text-2xl font-bold text-gradient">Your Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="glass rounded-2xl p-6 neon-border text-center">
          <div className="mx-auto h-28 w-28 rounded-full bg-gradient-neon flex items-center justify-center text-5xl glow-purple overflow-hidden">
            {uploadedImg ? (
              <img src={uploadedImg} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              user.avatar ?? "🤖"
            )}
          </div>
          <p className="mt-4 font-semibold">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <label className="mt-4 inline-flex items-center gap-2 cursor-pointer rounded-lg bg-secondary px-3 py-2 text-xs hover:bg-secondary/80">
            <Upload className="h-3.5 w-3.5" />
            Upload Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <h3 className="font-semibold">Choose a Technical Avatar</h3>
          <p className="text-xs text-muted-foreground mt-1">Pick one or upload your own picture.</p>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {avatars.map((a) => (
              <button
                key={a.id}
                onClick={() => pickAvatar(a.emoji)}
                className={cn(
                  "rounded-xl p-4 border text-center transition-all hover:scale-105",
                  user.avatar === a.emoji
                    ? "border-primary bg-gradient-neon text-primary-foreground glow-blue"
                    : "border-border bg-secondary/40",
                )}
              >
                <div className="text-3xl">{a.emoji}</div>
                <p className="mt-2 text-[10px] uppercase tracking-widest">{a.label}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <Info label="Name" value={user.name} />
            <Info label="Email" value={user.email} />
            <Info label="Role" value={user.role.toUpperCase()} />
            <Info label="Department" value={user.department ?? "—"} />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-secondary/40 border border-border p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{value}</p>
    </div>
  );
}

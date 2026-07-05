// Reusable neon stat card
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "blue" | "purple" | "cyan" | "success" | "warning" | "danger";
  hint?: string;
}

const accentMap: Record<string, string> = {
  blue: "text-neon-blue",
  purple: "text-neon-purple",
  cyan: "text-neon-cyan",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
};

export function StatCard({ label, value, icon: Icon, accent = "blue", hint }: StatCardProps) {
  return (
    <div className="glass rounded-xl p-5 animate-float-in hover:scale-[1.02] transition-transform">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className={cn("mt-2 text-3xl font-bold", accentMap[accent])}>{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("rounded-lg p-2.5 bg-secondary/60 border border-border", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

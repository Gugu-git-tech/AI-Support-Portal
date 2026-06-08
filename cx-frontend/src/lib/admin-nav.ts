// Shared admin nav items
import { Home, Activity, BarChart3, UserPlus, Clock, User } from "lucide-react";
import type { NavItem } from "@/components/DashboardShell";

export const adminNav: NavItem[] = [
  { label: "Home", to: "/admin/home", icon: Home },
  { label: "Operations Dashboard", to: "/admin/operations", icon: Activity },
  { label: "Reports & Insights", to: "/admin/reports", icon: BarChart3 },
  { label: "Ticket Assignment", to: "/admin/assignment", icon: UserPlus },
  { label: "SLA Tracking", to: "/admin/sla", icon: Clock },
  { label: "Profile Settings", to: "/admin/profile", icon: User },
];

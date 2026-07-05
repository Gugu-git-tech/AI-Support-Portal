// Mock auth helper using localStorage. Frontend-only demo.
export type Role = "user" | "agent" | "admin";

export interface MockUser {
  id?: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
  department?: string;
  avatar?: string;
}

const KEY = "cx_expert_user";

export function saveUser(user: MockUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function clearUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function dashboardPath(role: Role): string {
  if (role === "admin") return "/admin/home";
  if (role === "agent") return "/agent/home";
  return "/user/home";
}

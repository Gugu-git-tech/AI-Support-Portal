/**
 * Hidden Authentication Service
 * -----------------------------
 * No visible login UI is rendered. This module exists so that when a real
 * backend is wired in later (VS Code / production), all the plumbing for
 * JWTs, token refresh, request interceptors, and audit logging is already
 * present and ready to use.
 */

export interface AuthTokens {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

export interface AuthUser {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: "admin" | "agent" | "user";
  avatarUrl?: string;
  designation?: string;
}

const STORAGE_KEY = "cx_auth_tokens";
const USER_KEY = "cx_auth_user";
const SESSION_KEY = "cx_auth_session";

// Default fallback only; real values come from sign-in / sign-up.
const defaultUser: AuthUser = {
  id: "u_guest",
  name: "Guest",
  surname: "User",
  email: "guest@digifycx.com",
  role: "user",
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* no-op */
  }
}

export const authService = {
  getTokens(): AuthTokens {
    return readStorage<AuthTokens>(STORAGE_KEY, {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    });
  },

  setTokens(tokens: AuthTokens) {
    writeStorage(STORAGE_KEY, tokens);
  },

  getUser(): AuthUser {
    return readStorage<AuthUser>(USER_KEY, defaultUser);
  },

  setUser(user: AuthUser) {
    writeStorage(USER_KEY, user);
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SESSION_KEY) === "1";
  },

  /**
   * Mock sign-in. Any non-empty credentials succeed. Admin role is granted
   * automatically when the email contains "admin".
   */
  async signIn(email: string, _password: string): Promise<AuthUser> {
    const role: AuthUser["role"] = /admin/i.test(email) ? "admin" : "user";
    const handle = email.split("@")[0] || "user";
    const [first, ...rest] = handle.split(/[._-]+/);
    const user: AuthUser = {
      id: `u_${Date.now()}`,
      name: cap(first || "User"),
      surname: cap(rest.join(" ") || "Member"),
      email,
      role,
      designation: role === "admin" ? "Operations Administrator" : "Support Requester",
    };
    this.setUser(user);
    await this.refreshSession();
    if (typeof window !== "undefined") window.localStorage.setItem(SESSION_KEY, "1");
    return user;
  },

  async signUp(payload: { name: string; surname: string; email: string; password: string }): Promise<AuthUser> {
    const role: AuthUser["role"] = /admin/i.test(payload.email) ? "admin" : "user";
    const user: AuthUser = {
      id: `u_${Date.now()}`,
      name: payload.name,
      surname: payload.surname,
      email: payload.email,
      role,
      designation: role === "admin" ? "Operations Administrator" : "Support Requester",
    };
    this.setUser(user);
    await this.refreshSession();
    if (typeof window !== "undefined") window.localStorage.setItem(SESSION_KEY, "1");
    return user;
  },

  /**
   * Request interceptor stub. Wire into fetch/axios when backend is connected.
   */
  buildAuthHeaders(): Record<string, string> {
    const { accessToken } = this.getTokens();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Client": "cx-expert-portal",
    };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    return headers;
  },

  /**
   * Placeholder for refresh-token rotation. Returns a stub token.
   */
  async refreshSession(): Promise<AuthTokens> {
    const next: AuthTokens = {
      accessToken: "stub.jwt.token",
      refreshToken: "stub.refresh.token",
      expiresAt: Date.now() + 1000 * 60 * 30,
    };
    this.setTokens(next);
    return next;
  },

  /**
   * Sign out resets all auth state and reloads to the home page.
   */
  signOut() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(USER_KEY);
      window.localStorage.removeItem(SESSION_KEY);
      window.location.assign("/auth");
    }
  },
};

function cap(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
}

/**
 * Mock authorization & security audit log used by the Admin Dashboard.
 * Real implementation should stream from a backend logging service.
 */
export interface AuditEntry {
  id: string;
  endpoint: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  status: number;
  uptime: string;
  latencyMs: number;
  actor: string;
  timestamp: string;
}

export const mockAuditLog: AuditEntry[] = [
  { id: "a1", endpoint: "/api/tickets", method: "GET", status: 200, uptime: "99.99%", latencyMs: 84, actor: "svc:dashboard", timestamp: "2026-06-02T09:12:04Z" },
  { id: "a2", endpoint: "/api/auth/refresh", method: "POST", status: 200, uptime: "99.97%", latencyMs: 142, actor: "user:alex.morgan", timestamp: "2026-06-02T09:14:22Z" },
  { id: "a3", endpoint: "/api/tickets/validate", method: "POST", status: 201, uptime: "99.95%", latencyMs: 312, actor: "svc:groq-validator", timestamp: "2026-06-02T09:18:51Z" },
  { id: "a4", endpoint: "/api/users/me", method: "GET", status: 200, uptime: "99.99%", latencyMs: 56, actor: "user:alex.morgan", timestamp: "2026-06-02T09:21:09Z" },
  { id: "a5", endpoint: "/api/uploads", method: "POST", status: 200, uptime: "99.92%", latencyMs: 488, actor: "user:alex.morgan", timestamp: "2026-06-02T09:24:31Z" },
  { id: "a6", endpoint: "/api/admin/audit", method: "GET", status: 200, uptime: "99.98%", latencyMs: 73, actor: "svc:dashboard", timestamp: "2026-06-02T09:26:55Z" },
  { id: "a7", endpoint: "/api/auth/logout", method: "POST", status: 204, uptime: "99.99%", latencyMs: 41, actor: "user:alex.morgan", timestamp: "2026-06-02T09:28:14Z" },
];
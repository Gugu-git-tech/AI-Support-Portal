import { authService } from "./authService";
import type { TicketRequest, Ticket } from "./ticketsData";
import { mockTickets } from "./ticketsData";

/**
 * Centralised API service. All network calls flow through here so the
 * hidden auth service can attach tokens, audit, and refresh automatically
 * once a real backend is connected.
 */

const API_BASE = "/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = { ...authService.buildAuthHeaders(), ...(init.headers ?? {}) };
  // Soft-stub for local dev: simulate network latency without hitting backend.
  await new Promise((r) => setTimeout(r, 300));
  // Real implementation:
  // const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  // if (res.status === 401) await authService.refreshSession();
  // return res.json();
  return { ok: true, path, headers, init } as unknown as T;
}

export const apiService = {
  async submitTicket(payload: TicketRequest): Promise<{ id: string }> {
    await request<unknown>("/tickets", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return { id: `TCK-${Math.floor(1000 + Math.random() * 9000)}` };
  },

  async listTickets(): Promise<Ticket[]> {
    await request<unknown>("/tickets");
    return mockTickets;
  },

  async updateProfile(payload: { name: string; surname: string; email: string }) {
    await request<unknown>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    const u = authService.getUser();
    authService.setUser({ ...u, ...payload });
    return authService.getUser();
  },

  async uploadAvatar(file: File): Promise<string> {
    // Stub: returns local object URL. Real impl uploads to storage.
    return URL.createObjectURL(file);
  },
};

export { API_BASE };
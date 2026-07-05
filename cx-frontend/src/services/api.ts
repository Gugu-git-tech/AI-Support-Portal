import { getUser } from "@/lib/auth";

export const BASE_URL = "https://proud-heart-b6a8.sabelo-tshazi-digifycx.workers.dev";

// ✅ TYPES (NEW)
export interface Ticket {
  id: string;
  created_by: string;
  assigned_to: string | null;
  category: string;
  urgency: string;
  priority: string;
  issue_summary: string;
  user_intent: string;
  key_details: string;
  blockers: string;
  status: string;
  created_at: string;
  updated_at: string;
  message?: string; // still exists from backend fix
}

// ✅ CREATE TICKET
export async function createTicket(payload: any) {
  const currentUser = getUser();
  const token = currentUser?.token || localStorage.getItem("token");

  if (!token) {
    throw new Error("No auth token found. Please log in.");
  }

  const res = await fetch(`${BASE_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Failed to create ticket");
  }

  return data;
}
// ✅ GET ALL TICKETS
export async function getTickets(): Promise<Ticket[]> {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/tickets`, { headers });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch tickets");
  }

  return data;
}

export type KnowledgeEntry = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
};

export type ConfigPayload = Record<string, string>;

export type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

function createHeaders(token?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function getAuthHeaders(): HeadersInit | undefined {
  const currentUser = getUser();
  if (!currentUser?.token) return undefined;

  return {
    Authorization: `Bearer ${currentUser.token}`,
  };
}

export async function getKnowledgeEntries(token?: string): Promise<KnowledgeEntry[]> {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const res = await fetch(`${BASE_URL}/knowledge`, { headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to load knowledge entries");
  return data.map((entry: any) => ({
    ...entry,
    tags: entry.tags ? JSON.parse(entry.tags) : [],
  }));
}

export async function createKnowledgeEntry(entry: { title: string; content: string; tags: string[] }, token?: string) {
  const res = await fetch(`${BASE_URL}/knowledge`, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify(entry),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to create knowledge entry");
  return data;
}

export async function deleteKnowledgeEntry(id: string, token?: string) {
  const res = await fetch(`${BASE_URL}/knowledge/${id}`, {
    method: "DELETE",
    headers: createHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to delete knowledge entry");
  return data;
}

export async function getConfig(token?: string): Promise<ConfigPayload> {
  const res = await fetch(`${BASE_URL}/config`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to load config");
  return data;
}

export async function updateConfig(config: ConfigPayload, token?: string) {
  const res = await fetch(`${BASE_URL}/config`, {
    method: "PATCH",
    headers: createHeaders(token),
    body: JSON.stringify(config),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to update config");
  return data;
}

export async function getUsers(token?: string): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to load users");
  return data;
}

export async function createUser(email: string, password: string, role: string, token?: string) {
  const res = await fetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify({ email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to create user");
  return data;
}

export async function updateUserRole(userId: string, role: string, token?: string) {
  const res = await fetch(`${BASE_URL}/users/role`, {
    method: "PATCH",
    headers: createHeaders(token),
    body: JSON.stringify({ userId, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to update role");
  return data;
}

export async function deleteUser(userId: string, token?: string) {
  const res = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
    headers: createHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Failed to delete user");
  return data;
}

// ✅ GET SINGLE TICKET (NEW)
export async function getTicketById(id: string): Promise<Ticket> {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/tickets/${id}`, { headers });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch ticket");
  }

  return data;
}

// ✅ GET TICKET HISTORY (NEW 🔥)
export async function getTicketHistory(id: string) {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/tickets/${id}/history`, { headers });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to fetch history");
  }

  return data;
}


// ✅ UPDATE TICKET
export async function updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "PATCH",
    headers: createHeaders(getUser()?.token),
    body: JSON.stringify(updates),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Failed to update ticket");
  }

  return data;
}
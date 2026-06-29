/**
 * DB Layer — Tickets
 *
 * All D1 SQL is isolated here. No raw SQL is allowed in routes or the worker entry point.
 * Functions receive the D1Database binding as the first argument and return typed results.
 */

export interface Ticket {
  id: number;
  name: string;
  email: string;
  message: string;
  category: string | null;
  priority: string;
  status: string;
  created_at: string;
}

export interface CreateTicketInput {
  name: string;
  email: string;
  message: string;
  category?: string;
  priority?: string;
}



export async function createTicket(
  db: D1Database,
  ticket: CreateTicketInput
): Promise<D1Result> {
  return db
    .prepare(
      `INSERT INTO tickets (name, email, message, category, priority, status)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .bind(
      ticket.name,
      ticket.email,
      ticket.message,
      ticket.category ?? null,
      ticket.priority ?? "low",
      "new"
    )
    .run();
}



export async function getAllTickets(db: D1Database): Promise<D1Result<Ticket>> {
  return db
    .prepare(`SELECT * FROM tickets ORDER BY created_at DESC`)
    .all<Ticket>();
}



export async function getTicketById(
  db: D1Database,
  id: number
): Promise<Ticket | null> {
  return db
    .prepare(`SELECT * FROM tickets WHERE id = ?`)
    .bind(id)
    .first<Ticket>();
}


export async function updateTicketStatus(
  db: D1Database,
  id: number,
  status: string
): Promise<D1Result> {
  return db
    .prepare(`UPDATE tickets SET status = ? WHERE id = ?`)
    .bind(status, id)
    .run();
}

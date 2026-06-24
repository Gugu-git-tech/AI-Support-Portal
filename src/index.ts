/**
 * Support Portal — Cloudflare Worker Entry Point
 *
 * Routing:
 *   POST   /api/tickets             → create ticket
 *   GET    /api/tickets             → list all tickets
 *   GET    /api/tickets/:id         → get ticket by ID
 *   PATCH  /api/tickets/:id/status  → update ticket status
 *   GET    /health                  → health check
 *
 * All DB access is delegated to: src/routes/tickets.ts → src/db/tickets.ts → D1
 */

import {
  handleCreateTicket,
  handleGetAllTickets,
  handleGetTicket,
  handleUpdateTicketStatus,
} from "./routes/tickets";

export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname, method } = Object.assign(url, { method: request.method });

   
    if (pathname === "/health" && method === "GET") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

  
    if (pathname === "/api/tickets" && method === "POST") {
      return handleCreateTicket(request, env.MY_DB_BINDING);
    }


    if (pathname === "/api/tickets" && method === "GET") {
      return handleGetAllTickets(env.MY_DB_BINDING);
    }

    // ── /api/tickets/:id 
    const ticketMatch = pathname.match(/^\/api\/tickets\/(\d+)$/);
    if (ticketMatch) {
      const id = parseInt(ticketMatch[1], 10);

      if (method === "GET") {
        return handleGetTicket(id, env.MY_DB_BINDING);
      }

      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ── /api/tickets/:id/status 
    const statusMatch = pathname.match(/^\/api\/tickets\/(\d+)\/status$/);
    if (statusMatch) {
      const id = parseInt(statusMatch[1], 10);

      if (method === "PATCH") {
        return handleUpdateTicketStatus(request, id, env.MY_DB_BINDING);
      }

      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ── 404 
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
} satisfies ExportedHandler<Env>;

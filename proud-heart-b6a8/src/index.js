import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

// Helper function to create CORS responses
function corsResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json"
    }
  });
}

async function structureTicketWithAI(message, env) {
  try {
    const aiResponse = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.AI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "grok-2-latest",
        temperature: 0.1,
        messages: [
          {
            role: "system",
            content: `
You are an AI that structures support tickets.
 
STRICT RULES:
- Return ONLY valid JSON
- No explanations
- No extra text
- Always include all fields
 
FORMAT:
{
  "issue_summary": "",
  "user_intent": "",
  "key_details": "",
  "priority": "low | medium | high | urgent",
  "category": "billing | technical | account | other",
  "sentiment": "angry | neutral | happy"
}
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });
 
    const data = await aiResponse.json();
 
    const raw = data?.choices?.[0]?.message?.content;
 
    if (!raw) throw new Error("Empty AI response");
 
    // 🔥 CLEAN JSON (handles messy AI output)
    const cleaned = raw.replace(/```json|```/g, "").trim();
 
    const parsed = JSON.parse(cleaned);
 
    return validateAIOutput(parsed);
 
  } catch (error) {
    console.error("AI ERROR:", error);
 
    // 🚨 FALLBACK (never break system)
    return {
      issue_summary: message.slice(0, 80),
      user_intent: "User needs help",
      key_details: message,
      priority: "medium",
      category: "other",
      sentiment: "neutral"
    };
  }
}

function validateAIOutput(data) {
  return {
    issue_summary: String(data.issue_summary || "No summary"),
    user_intent: String(data.user_intent || "Unknown intent"),
    key_details: String(data.key_details || ""),
    priority: ["low", "medium", "high", "urgent"].includes(data.priority)
      ? data.priority
      : "medium",
    category: ["billing", "technical", "account", "other"].includes(data.category)
      ? data.category
      : "other",
    sentiment: ["angry", "neutral", "happy"].includes(data.sentiment)
      ? data.sentiment
      : "neutral"
  };
}
 
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // =====================
    // HANDLE OPTIONS (CORS preflight)
    // =====================
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    // =====================
    // TEST DB
    // =====================
    if (path === "/test-db") {
      return corsResponse({
        db: typeof env.DB
      });
    }
 
    // =====================
    // REGISTER
    // =====================
    if (path === "/auth/register" && method === "POST") {
      const { email, password } = await request.json();
 
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
 
      try {
        await env.DB.prepare(
          "INSERT INTO users (email, password_hash, salt, role) VALUES (?, ?, ?, 'user')"
        ).bind(email, hash, salt).run();
 
        return corsResponse({ message: "User created" });
      } catch (err) {
        return corsResponse({ error: err.message }, 400);
      }
    }
 
    // =====================
    // LOGIN
    // =====================
   ``
// ✅ FIXED LOGIN ROUTE

if (path === "/auth/login" && method === "POST") {
  const { email, password } = await request.json();

  const user = await env.DB.prepare(
    "SELECT * FROM users WHERE email = ?"
  ).bind(email).first();

  if (!user) {
    return corsResponse({ error: "Invalid credentials" }, 401);
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return corsResponse({ error: "Invalid credentials" }, 401);
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // ✅ RETURN USER + TOKEN (THIS IS THE FIX)
  return corsResponse({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}


    // =====================
    // ME
    // =====================
    if (path === "/auth/me" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
 
      if (!token) {
        return corsResponse({ error: "No token" }, 401);
      }
 
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        return corsResponse({ user: decoded });
      } catch {
        return corsResponse({ error: "Invalid token" }, 401);
      }
    }
 
    // =====================
    // CREATE TICKET
    // =====================
    if (path === "/tickets/create" && method === "POST") {
      try {
        const auth = request.headers.get("Authorization");
        const token = auth?.split(" ")[1];
 
        if (!token) {
          return corsResponse({ error: "Unauthorized" }, 401);
        }
 
        let user;
        try {
          user = jwt.verify(token, env.JWT_SECRET);
        } catch {
          return corsResponse({ error: "Invalid token" }, 401);
        }
 
        const body = await request.json();
        const message = body.message;
 
        if (!message) {
          return corsResponse({ error: "Message required" }, 400);
        }
 
        // 🧠 CALL AI
        const ai = await structureTicketWithAI(message, env);
 
        const ticketId = crypto.randomUUID();
 
        await env.DB.prepare(
          `INSERT INTO tickets (
            id,
            created_by,
            issue_summary,
            user_intent,
            key_details,
            priority,
            category,
            sentiment,
            status,
            created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', CURRENT_TIMESTAMP)`
        )
          .bind(
            ticketId,
            user.id,
            ai.issue_summary,
            ai.user_intent,
            ai.key_details,
            ai.priority,
            ai.category,
            ai.sentiment
          )
          .run();
 
        return corsResponse({
          message: "Ticket created (AI structured)",
          ticket_id: ticketId,
          ai
        });
 
      } catch (err) {
        console.error("CREATE TICKET ERROR:", err);
 
        return corsResponse(
          { error: "Internal server error" },
          500
        );
      }
    }
 
    // =====================
    // MY TICKETS
    // =====================
    if (path === "/tickets/my" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
 
      const user = jwt.verify(token, env.JWT_SECRET);
 
      const tickets = await env.DB.prepare(
        "SELECT * FROM tickets WHERE created_by = ?"
      ).bind(user.id).all();
 
      return corsResponse(tickets.results);
    }
 
    // =====================
    // ALL TICKETS (ADMIN)
    // =====================
    if (path === "/tickets/all" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
 
      const user = jwt.verify(token, env.JWT_SECRET);
 
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const tickets = await env.DB.prepare(
        "SELECT * FROM tickets"
      ).all();
 
      return corsResponse(tickets.results);
    }
 
    // =====================
    // PROMOTE USER (ADMIN)
    // =====================
    if (path === "/admin/promote" && method === "POST") {
      const authHeader = request.headers.get("Authorization");
 
      if (!authHeader) {
        return corsResponse({ error: "Missing token" }, 401);
      }
 
      const token = authHeader.split(" ")[1];
 
      let user;
      try {
        user = jwt.verify(token, env.JWT_SECRET);
      } catch {
        return corsResponse({ error: "Invalid token" }, 401);
      }
 
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const body = await request.json();
 
      await env.DB.prepare(
        "UPDATE users SET role = ? WHERE email = ?"
      )
        .bind(body.role, body.email)
        .run();
 
      return corsResponse({ message: "User updated" });
    }
 
    // =====================
    // ASSIGN TICKET
    // =====================
    if (path === "/tickets/assign" && method === "POST") {
      const authHeader = request.headers.get("Authorization");
 
      if (!authHeader) {
        return corsResponse({ error: "Missing token" }, 401);
      }
 
      const token = authHeader.split(" ")[1];
 
      let user;
      try {
        user = jwt.verify(token, env.JWT_SECRET);
      } catch {
        return corsResponse({ error: "Invalid token" }, 401);
      }
 
      // only admin allowed
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const body = await request.json();
 
      const ticketId = String(body.ticket_id);
      const agentId = Number(body.agent_id);
 
      // ✅ check agent
      const agent = await env.DB.prepare(
        "SELECT id, role FROM users WHERE id = ?"
      ).bind(agentId).first();
 
      if (!agent || agent.role !== "agent") {
        return corsResponse({ error: "Invalid agent" }, 400);
      }
 
      // ✅ get ticket + previous assignment
      const ticket = await env.DB.prepare(
        "SELECT id, assigned_to FROM tickets WHERE id = ?"
      ).bind(ticketId).first();
 
      if (!ticket) {
        return corsResponse({ error: "Ticket not found" }, 404);
      }
 
      const oldAssigned = ticket.assigned_to || null;
 
      // ✅ update ticket
      await env.DB.prepare(
        `UPDATE tickets
         SET assigned_to = ?,
             status = 'in_progress',
             assigned_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
        .bind(agentId, ticketId)
        .run();
 
      // ✅ INSERT HISTORY
      await env.DB.prepare(
        `INSERT INTO ticket_history
         (ticket_id, changed_by, action, old_value, new_value)
         VALUES (?, ?, 'assign', ?, ?)`
      )
        .bind(
          ticketId,
          user.id,
          oldAssigned,
          agentId
        )
        .run();
 
      return corsResponse({
        message: "Ticket assigned successfully",
        assigned_to: agentId
      });
    }

    // =====================
    // AGENT TICKETS
    // =====================
    if (path === "/tickets/agent" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
 
      if (!token) {
        return corsResponse({ error: "No token" }, 401);
      }
 
      let user;
      try {
        user = jwt.verify(token, env.JWT_SECRET);
      } catch {
        return corsResponse({ error: "Invalid token" }, 401);
      }
 
      if (user.role !== "agent") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const tickets = await env.DB.prepare(
        "SELECT * FROM tickets WHERE assigned_to = ?"
      )
        .bind(user.id)
        .all();
 
      return corsResponse(tickets.results);
    }
 
    // =====================
    // TICKETS STATUS
    // =====================
    if (path === "/tickets/status" && method === "POST") {
      const auth = request.headers.get("Authorization");
      const token = auth?.split(" ")[1];
 
      if (!token) {
        return corsResponse({ error: "Unauthorized" }, 401);
      }
 
      let user;
      try {
        user = jwt.verify(token, env.JWT_SECRET);
      } catch {
        return corsResponse({ error: "Invalid token" }, 401);
      }
 
      const { ticket_id, status } = await request.json();
 
      const allowedStatuses = ["new", "in_progress", "resolved", "closed"];
 
      if (!allowedStatuses.includes(status)) {
        return corsResponse({ error: "Invalid status" }, 400);
      }
 
      // ✅ GET CURRENT STATUS FIRST
      const existing = await env.DB.prepare(
        "SELECT status, assigned_to FROM tickets WHERE id = ?"
      )
        .bind(ticket_id)
        .first();
 
      if (!existing) {
        return corsResponse({ error: "Ticket not found" }, 404);
      }
 
      // ✅ ONLY assigned agent can update
      if (existing.assigned_to !== user.id) {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const oldStatus = existing.status;
 
      // ✅ UPDATE STATUS
      await env.DB.prepare(
        `UPDATE tickets
         SET status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
        .bind(status, ticket_id)
        .run();
 
      // ✅ INSERT HISTORY
      await env.DB.prepare(
        `INSERT INTO ticket_history
         (ticket_id, changed_by, action, old_value, new_value)
         VALUES (?, ?, 'status_change', ?, ?)`
      )
        .bind(
          ticket_id,
          user.id,
          oldStatus,
          status
        )
        .run();
 
      return corsResponse({
        message: "Status updated",
        ticket_id,
        from: oldStatus,
        to: status
      });
    }

    // =====================
    // ADMIN VIEW OF ASSIGNED WORKLOAD
    // =====================
    if (path === "/admin/tickets/assigned" && method === "GET") {
      const auth = request.headers.get("Authorization");
      const token = auth?.split(" ")[1];
 
      const user = jwt.verify(token, env.JWT_SECRET);
 
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const tickets = await env.DB.prepare(
        "SELECT * FROM tickets WHERE assigned_to IS NOT NULL"
      ).all();
 
      return corsResponse({
        total: tickets.results.length,
        tickets: tickets.results
      });
    }

    // =====================
    // ADD COMMENT ROUTE
    // =====================
    if (path === "/tickets/comment" && method === "POST") {
      const auth = request.headers.get("Authorization");
      const token = auth?.split(" ")[1];
 
      if (!token) {
        return corsResponse({ error: "Unauthorized" }, 401);
      }
 
      let user;
      try {
        user = jwt.verify(token, env.JWT_SECRET);
      } catch {
        return corsResponse({ error: "Invalid token" }, 401);
      }
 
      const { ticket_id, message } = await request.json();
 
      if (!ticket_id || !message) {
        return corsResponse({ error: "Missing fields" }, 400);
      }
 
      await env.DB.prepare(
        "INSERT INTO comments (ticket_id, user_id, message) VALUES (?, ?, ?)"
      )
        .bind(ticket_id, user.id, message)
        .run();
 
      return corsResponse({ message: "Comment added" });
    }

    // =====================
    // GET COMMENTS ROUTE
    // =====================
    if (path === "/tickets/comments" && method === "GET") {
      const url = new URL(request.url);
      const ticket_id = url.searchParams.get("ticket_id");
 
      const comments = await env.DB.prepare(
        "SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC"
      )
        .bind(ticket_id)
        .all();
 
      return corsResponse({ comments: comments.results });
    }
 
    // =====================
    // TICKETS HISTORY
    // =====================
    if (path === "/tickets/history" && method === "GET") {
      const url = new URL(request.url);
      const ticket_id = url.searchParams.get("ticket_id");
 
      const history = await env.DB.prepare(
        "SELECT * FROM ticket_history WHERE ticket_id = ? ORDER BY created_at DESC"
      )
        .bind(ticket_id)
        .all();
 
      return corsResponse({ history: history.results });
    }
 
    // =====================
    // ANALYTICS OVERVIEW
    // =====================
    if (path === "/analytics/overview" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
      const user = jwt.verify(token, env.JWT_SECRET);
 
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const totalTickets = await env.DB.prepare(
        "SELECT COUNT(*) as count FROM tickets"
      ).first();
 
      const openTickets = await env.DB.prepare(
        "SELECT COUNT(*) as count FROM tickets WHERE status = 'open'"
      ).first();
 
      const resolvedTickets = await env.DB.prepare(
        "SELECT COUNT(*) as count FROM tickets WHERE status = 'resolved'"
      ).first();
 
      const inProgress = await env.DB.prepare(
        "SELECT COUNT(*) as count FROM tickets WHERE status = 'in_progress'"
      ).first();
 
      return corsResponse({
        total_tickets: totalTickets.count,
        open_tickets: openTickets.count,
        in_progress: inProgress.count,
        resolved_tickets: resolvedTickets.count,
      });
    }

    // =====================
    // TICKET VOLUME OVER TIME
    // =====================
    if (path === "/analytics/tickets-by-day" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
      const user = jwt.verify(token, env.JWT_SECRET);
 
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const result = await env.DB.prepare(`
        SELECT
          DATE(created_at) as date,
          COUNT(*) as total
        FROM tickets
        GROUP BY DATE(created_at)
        ORDER BY date DESC
        LIMIT 14
      `).all();
 
      return corsResponse(result.results);
    }

    // =====================
    // CATEGORY BREAKDOWN
    // =====================
    if (path === "/analytics/categories" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
      const user = jwt.verify(token, env.JWT_SECRET);
 
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const result = await env.DB.prepare(`
        SELECT category, COUNT(*) as total
        FROM tickets
        GROUP BY category
        ORDER BY total DESC
      `).all();
 
      return corsResponse(result.results);
    }

    // =====================
    // PRIORITY DISTRIBUTION
    // =====================
    if (path === "/analytics/priority" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
      const user = jwt.verify(token, env.JWT_SECRET);
 
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const result = await env.DB.prepare(`
        SELECT priority, COUNT(*) as total
        FROM tickets
        GROUP BY priority
      `).all();
 
      return corsResponse(result.results);
    }

    // =====================
    // AGENT WORKLOAD
    // =====================
    if (path === "/analytics/agent-workload" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
      const user = jwt.verify(token, env.JWT_SECRET);
 
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const result = await env.DB.prepare(`
        SELECT
          u.id,
          u.email,
          COUNT(t.id) as assigned_tickets
        FROM users u
        LEFT JOIN tickets t ON t.assigned_to = u.id
        WHERE u.role = 'agent'
        GROUP BY u.id
        ORDER BY assigned_tickets DESC
      `).all();
 
      return corsResponse(result.results);
    }

    // =====================
    // SLA / RESPONSE TIME
    // =====================
    if (path === "/analytics/sla" && method === "GET") {
      const token = request.headers.get("Authorization")?.split(" ")[1];
      const user = jwt.verify(token, env.JWT_SECRET);
 
      if (user.role !== "admin") {
        return corsResponse({ error: "Forbidden" }, 403);
      }
 
      const result = await env.DB.prepare(`
        SELECT
          AVG(
            (julianday(updated_at) - julianday(created_at)) * 24 * 60
          ) as avg_minutes
        FROM tickets
        WHERE status = 'resolved'
      `).first();
 
      return corsResponse({
        avg_resolution_minutes: result.avg_minutes || 0,
      });
    }
 
    // =====================
    // DEFAULT
    // =====================
    return corsResponse({ error: "Route not found" }, 404);
  }
};
export async function createTicket(MY_BD_BINDING,ticket){

  return await MY_BD_BINDING.prepare(
    `INSERT INTO tickets
     (name,email,message,category,priority,status)
     VALUES (?,?,?,?,?,?)`
  )
  .bind(
    ticket.name,
    ticket.email,
    ticket.message,
    ticket.category,
    ticket.priority || "low",
    "new"
  )
  .run();
}

export async function getAllTickets(MY_BD_BINDING) {
  return await MY_BD_BINDING.prepare(
    `SELECT * FROM tickets
     ORDER BY created_at DESC`
  ).all();
}

export async function getTicketById(MY_BD_BINDING, id) {
  return await MY_BD_BINDING.prepare(
    `SELECT * FROM tickets WHERE id = ?`
  )
  .bind(id)
  .first();
}

export async function updateTicketStatus(MY_BD_BINDING, id, status) {
  return await MY_BD_BINDING.prepare(
    `UPDATE tickets
     SET status = ?
     WHERE id = ?`
  )
  .bind(status, id)
  .run();
}
export {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus
};
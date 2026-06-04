import { pool } from '../config/db.js';

export async function writeAudit(req, action, entity, entityId = null, metadata = null) {
  try {
    await pool.execute(
      `INSERT INTO audit_logs (actor_user_id, action, entity, entity_id, ip_address, user_agent, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.session?.user?.user_id || null, action, entity, entityId ? String(entityId) : null, req.ip, req.get('user-agent') || null, metadata ? JSON.stringify(metadata) : null]
    );
  } catch (_) {
    // audit must never break the request
  }
}

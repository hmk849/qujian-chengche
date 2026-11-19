import { pool } from "@/lib/db"; import { getUid } from "@/lib/session";
export async function GET() {
  const uid = await getUid(); if (!uid) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { rows } = await pool.query("select email,inbound_token from users where id=$1", [uid]);
  const d = process.env.INBOUND_DOMAIN;
  return Response.json({ email: rows[0].email, inboundAddress: d ? `${rows[0].inbound_token}@${d}` : null });
}

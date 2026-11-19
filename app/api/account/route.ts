import bcrypt from "bcryptjs"; import { pool } from "@/lib/db"; import { getUid, clearSession } from "@/lib/session";
export async function DELETE(r: Request) {
  const uid = await getUid(); if (!uid) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { password } = await r.json().catch(() => ({}));
  const { rows } = await pool.query("select password_hash from users where id=$1", [uid]);
  if (typeof password !== "string" || !rows[0] || !(await bcrypt.compare(password, rows[0].password_hash)))
    return Response.json({ error: "bad_credentials" }, { status: 401 });
  await pool.query("delete from users where id=$1", [uid]); // parcels removed by ON DELETE CASCADE
  await clearSession(); return Response.json({ ok: true });
}

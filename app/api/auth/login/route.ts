import bcrypt from "bcryptjs"; import { pool } from "@/lib/db"; import { setSession } from "@/lib/session";
export async function POST(r: Request) {
  const { email, password } = await r.json().catch(() => ({}));
  if (typeof email !== "string" || typeof password !== "string") return Response.json({ error: "invalid_input" }, { status: 400 });
  const { rows } = await pool.query("select id,password_hash from users where email=$1", [email.toLowerCase()]);
  if (!rows[0] || !(await bcrypt.compare(password, rows[0].password_hash))) return Response.json({ error: "bad_credentials" }, { status: 401 });
  await setSession(rows[0].id); return Response.json({ ok: true });
}

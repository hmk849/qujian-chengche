import bcrypt from "bcryptjs"; import { pool } from "@/lib/db"; import { setSession } from "@/lib/session";
export async function POST(r: Request) {
  const { email, password } = await r.json().catch(() => ({}));
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== "string" || password.length < 8)
    return Response.json({ error: "invalid_input" }, { status: 400 });
  try {
    const { rows } = await pool.query("insert into users(email,password_hash) values($1,$2) returning id", [email.toLowerCase(), await bcrypt.hash(password, 12)]);
    await setSession(rows[0].id); return Response.json({ ok: true });
  } catch (e: any) { return Response.json({ error: e.code === "23505" ? "email_taken" : "server_error" }, { status: e.code === "23505" ? 409 : 500 }); }
}

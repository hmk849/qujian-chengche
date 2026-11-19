import { pool } from "@/lib/db"; import { getUid } from "@/lib/session"; import { ingest } from "@/lib/ingest";
const unauth = () => Response.json({ error: "unauthorized" }, { status: 401 });
export async function GET() {
  const uid = await getUid(); if (!uid) return unauth();
  const { rows } = await pool.query("select id,courier,pickup_code,station,address,tracking_no,status,source,updated_at from parcels where user_id=$1 order by updated_at desc limit 200", [uid]);
  return Response.json({ parcels: rows });
}
export async function POST(r: Request) {
  const uid = await getUid(); if (!uid) return unauth();
  const { text } = await r.json().catch(() => ({}));
  if (typeof text !== "string" || !text.trim() || text.length > 5000) return Response.json({ error: "invalid_input" }, { status: 400 });
  const res = await ingest(uid, text, "paste");
  if (!res) return Response.json({ error: "not_recognized" }, { status: 422 });
  return Response.json({ ok: true, ...res });
}
export async function DELETE(r: Request) {
  const uid = await getUid(); if (!uid) return unauth();
  const id = new URL(r.url).searchParams.get("id");
  await pool.query("delete from parcels where id=$1 and user_id=$2", [id, uid]);
  return Response.json({ ok: true });
}

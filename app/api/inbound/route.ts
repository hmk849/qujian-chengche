// Inbound-email webhook (Postmark inbound JSON format). Configure the provider to POST to
// https://YOUR_DOMAIN/api/inbound?secret=INBOUND_SECRET and route *@INBOUND_DOMAIN to it.
import { pool } from "@/lib/db"; import { ingest } from "@/lib/ingest"; import { timingSafeEqual } from "node:crypto";
const eq = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
export async function POST(r: Request) {
  const want = process.env.INBOUND_SECRET, got = new URL(r.url).searchParams.get("secret") ?? "";
  if (!want || want.length < 24 || !eq(got, want)) return Response.json({ error: "forbidden" }, { status: 403 });
  const m = await r.json().catch(() => null); if (!m) return Response.json({ error: "invalid_input" }, { status: 400 });
  const to: string = m.OriginalRecipient || (Array.isArray(m.ToFull) ? m.ToFull[0]?.Email : "") || m.To || "";
  const token = to.split("@")[0].replace(/^.*</, "").toLowerCase();
  const { rows } = await pool.query("select id from users where inbound_token=$1", [token]);
  if (!rows[0]) return Response.json({ ok: true, ignored: true }); // unknown recipient: accept silently
  const body = `${m.Subject ?? ""} ${m.TextBody || String(m.HtmlBody ?? "").replace(/<[^>]+>/g, " ")}`;
  const res = await ingest(rows[0].id, body, "email");
  return Response.json({ ok: true, recognized: !!res });
}

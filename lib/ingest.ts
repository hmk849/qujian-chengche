import { pool } from "./db"; import { parseNotice } from "./parser";
export async function ingest(uid: string, text: string, source: "paste" | "email") {
  const p = parseNotice(text); if (!p) return null;
  const { rows } = await pool.query(
    `insert into parcels(user_id,dedup_key,courier,pickup_code,station,address,tracking_no,status,source,raw_text) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     on conflict(user_id,dedup_key) do update set status=excluded.status,pickup_code=coalesce(excluded.pickup_code,parcels.pickup_code),
     station=coalesce(excluded.station,parcels.station),address=coalesce(excluded.address,parcels.address),courier=coalesce(excluded.courier,parcels.courier),updated_at=now()
     returning (xmax=0) as created`, [uid, p.dedupKey, p.courier, p.pickupCode, p.station, p.address, p.trackingNo, p.status, source, text.slice(0, 5000)]);
  return { created: rows[0].created as boolean, parsed: p };
}

export type Status = "pending" | "transit" | "delivered";
export interface Parsed { courier?: string; pickupCode?: string; station?: string; address?: string; trackingNo?: string; status: Status; dedupKey: string }
const COURIERS = ["顺丰","中通","圆通","申通","韵达","极兔","京东快递","京东物流","邮政","EMS","德邦","菜鸟","丰巢","百世","天天"];
export function parseNotice(text: string): Parsed | null {
  const t = text.replace(/\s+/g, " ").trim();
  const code = t.match(/(?:取件码|提货码|取货码|pickup code)[:：\s]*([A-Za-z0-9]{1,4}(?:-[A-Za-z0-9]{1,6}){0,3}|[A-Za-z0-9]{3,10})/i)?.[1]
    ?? t.match(/凭\s*([A-Za-z0-9-]{3,12})\s*(?:到|至|取)/)?.[1];
  const trackingNo = t.match(/\b((?:SF|YT|JT|JD|ZT|ST|YD)?\d{10,15})\b/i)?.[1];
  const courier = COURIERS.find(c => t.includes(c));
  const station = t.match(/(?:到|至|在)\s*([^\s,，。【】]{2,20}?(?:驿站|快递柜|代收点|自提点|丰巢柜?|菜鸟驿站))/)?.[1]
    ?? t.match(/【([^】]*(?:驿站|快递柜|代收点)[^】]*)】/)?.[1];
  const address = t.match(/地址[:：]\s*([^，。,;；]{4,60})/)?.[1];
  let status: Status = "transit";
  if (/已签收|签收成功|已取走/.test(t)) status = "delivered";
  else if (code) status = "pending";
  else if (!/(派送|运输|揽收|发出|到达|转运|派件)/.test(t)) return null;
  if (!code && !trackingNo && !courier) return null;
  const dedupKey = trackingNo ? `t:${trackingNo.toUpperCase()}` : `c:${courier ?? ""}|${code ?? ""}|${station ?? ""}`;
  return { courier, pickupCode: code, station, address, trackingNo, status, dedupKey };
}

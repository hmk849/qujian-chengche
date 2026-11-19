import { parseNotice } from "./parser.ts";
import assert from "node:assert";
const a = parseNotice("【菜鸟驿站】您的中通快递包裹已到阳光小区菜鸟驿站，取件码：3-2-1087，运单号75123456789012，请及时取件");
assert.equal(a?.pickupCode, "3-2-1087"); assert.equal(a?.courier, "中通"); assert.equal(a?.status, "pending"); assert.equal(a?.trackingNo, "75123456789012");
assert.ok(a?.station?.includes("驿站"));
assert.equal(parseNotice("您的快递已签收 顺丰 SF1234567890123")?.status, "delivered");
assert.equal(parseNotice("今天天气不错"), null);
console.log("parser ok");

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const key = () => { const s = process.env.SESSION_SECRET; if (!s || s.length < 32) throw new Error("SESSION_SECRET must be 32+ chars"); return new TextEncoder().encode(s); };
export async function setSession(uid: string) {
  const jwt = await new SignJWT({ uid }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(key());
  (await cookies()).set("sid", jwt, { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 2592000 });
}
export async function getUid(): Promise<string | null> {
  const c = (await cookies()).get("sid")?.value; if (!c) return null;
  try { return (await jwtVerify(c, key())).payload.uid as string; } catch { return null; }
}
export async function clearSession() { (await cookies()).delete("sid"); }

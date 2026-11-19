"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
type P = { id: string; courier: string | null; pickup_code: string | null; station: string | null; address: string | null; tracking_no: string | null; status: "pending" | "transit" | "delivered" };
const T = {
  zh: { title: "取件码", paste: "粘贴快递短信或通知", add: "识别并保存", pending: "待取件", transit: "运输中", delivered: "已签收", all: "全部快递", history: "历史记录", copy: "复制", copied: "已复制", del: "删除", empty: "还没有快递。粘贴一条取件短信试试。", login: "登录", reg: "注册", out: "退出", email: "邮箱", pw: "密码（至少 8 位）", loading: "加载中…", notrec: "没有识别到快递信息，请粘贴完整通知。", dupe: "已更新已有快递，未重复添加。", saved: "已保存。", err: "出错了，请稍后重试。", bad: "邮箱或密码不正确。", taken: "该邮箱已注册。", platforms: "平台授权状态", unsup: "暂不支持：该平台未向个人开发者开放物流通知接口，请使用粘贴或转发。", dev: "开发者", settings: "设置", inbound: "转发邮箱", inboundHint: "把快递通知邮件转发到这个地址，系统会自动识别。", inboundOff: "服务器尚未配置收件域名（INBOUND_DOMAIN），转发功能暂不可用。", danger: "删除账号和全部数据", dangerHint: "输入密码确认。此操作无法撤销。", confirmDel: "永久删除" },
  en: { title: "Pickup codes", paste: "Paste a courier SMS or notice", add: "Parse and save", pending: "To pick up", transit: "In transit", delivered: "Delivered", all: "All parcels", history: "History", copy: "Copy", copied: "Copied", del: "Delete", empty: "No parcels yet. Paste a pickup message to start.", login: "Sign in", reg: "Sign up", out: "Sign out", email: "Email", pw: "Password (8+ characters)", loading: "Loading…", notrec: "No parcel info found. Paste the full notice.", dupe: "Updated an existing parcel; no duplicate added.", saved: "Saved.", err: "Something went wrong. Try again.", bad: "Wrong email or password.", taken: "That email is already registered.", platforms: "Platform authorization", unsup: "Not supported: this platform does not offer a logistics notification API to individual developers. Use paste or forwarding.", dev: "Developer", settings: "Settings", inbound: "Forwarding address", inboundHint: "Forward courier emails to this address and they are parsed automatically.", inboundOff: "The server has no inbound domain configured (INBOUND_DOMAIN); forwarding is unavailable.", danger: "Delete account and all data", dangerHint: "Enter your password to confirm. This cannot be undone.", confirmDel: "Delete permanently" },
};
const PLATFORMS = ["淘宝 Taobao", "天猫 Tmall", "京东 JD", "拼多多 Pinduoduo", "抖音商城 Douyin", "快手商城 Kuaishou", "美团 Meituan", "唯品会 Vipshop", "苏宁易购 Suning"];
export default function Home() {
  const [lang, setLang] = useState<"zh" | "en">("zh"); const t = T[lang];
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [list, setList] = useState<P[]>([]); const [tab, setTab] = useState<"pending" | "transit" | "history">("pending");
  const [text, setText] = useState(""); const [msg, setMsg] = useState(""); const [copied, setCopied] = useState("");
  const [me, setMe] = useState<{ email: string; inboundAddress: string | null } | null>(null); const [delPw, setDelPw] = useState("");
  const [email, setEmail] = useState(""); const [pw, setPw] = useState(""); const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const r = await fetch("/api/parcels"); if (r.status === 401) { setAuthed(false); return; }
    setAuthed(true); setList((await r.json()).parcels); fetch("/api/me").then(x => x.ok ? x.json() : null).then(setMe);
  }, []);
  useEffect(() => { load().catch(() => setAuthed(false)); }, [load]);
  async function auth(kind: "login" | "register") {
    setBusy(true); setMsg("");
    const r = await fetch(`/api/auth/${kind}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password: pw }) });
    setBusy(false);
    if (r.ok) { setPw(""); await load(); return; }
    const e = (await r.json().catch(() => ({}))).error; setMsg(e === "bad_credentials" ? t.bad : e === "email_taken" ? t.taken : t.err);
  }
  async function add() {
    setBusy(true); setMsg("");
    const r = await fetch("/api/parcels", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
    setBusy(false); const j = await r.json().catch(() => ({}));
    if (r.ok) { setText(""); setMsg(j.created ? t.saved : t.dupe); load(); } else setMsg(r.status === 422 ? t.notrec : t.err);
  }
  async function del(id: string) { await fetch(`/api/parcels?id=${id}`, { method: "DELETE" }); load(); }
  async function copy(c: string) { await navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(""), 1500); }
  async function delAccount() {
    const r = await fetch("/api/account", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ password: delPw }) });
    if (r.ok) { setDelPw(""); setList([]); setMe(null); setAuthed(false); setMsg(""); } else setMsg(r.status === 401 ? t.bad : t.err);
  }
  const shown = list.filter(p => tab === "history" ? p.status === "delivered" : p.status === tab);
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24 pt-[max(1rem,env(safe-area-inset-top))]">
      <header className="glass sticky top-3 z-10 flex items-center justify-between rounded-3xl px-5 py-3">
        <b className="text-lg tracking-tight">HMK · {t.title}</b>
        <div className="flex items-center gap-2 text-sm">
          <button className="rounded-full px-3 py-1 glass" onClick={() => setLang(lang === "zh" ? "en" : "zh")}>{lang === "zh" ? "EN" : "中"}</button>
          {authed && <button className="rounded-full px-3 py-1 glass" onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); setList([]); setAuthed(false); }}>{t.out}</button>}
        </div>
      </header>
      {authed === null && <p className="sub mt-10 text-center">{t.loading}</p>}
      {authed === false && (
        <section className="glass mx-auto mt-10 max-w-sm space-y-3 rounded-3xl p-6">
          <input className="w-full rounded-2xl bg-transparent px-4 py-3 glass" type="email" autoComplete="email" placeholder={t.email} value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full rounded-2xl bg-transparent px-4 py-3 glass" type="password" autoComplete="current-password" placeholder={t.pw} value={pw} onChange={e => setPw(e.target.value)} />
          <div className="flex gap-2">
            <button disabled={busy} onClick={() => auth("login")} className="flex-1 rounded-2xl py-3 font-medium text-white" style={{ background: "var(--acc)" }}>{t.login}</button>
            <button disabled={busy} onClick={() => auth("register")} className="flex-1 rounded-2xl py-3 font-medium glass">{t.reg}</button>
          </div>
          {msg && <p role="alert" className="text-sm text-red-500">{msg}</p>}
        </section>
      )}
      {authed && (<>
        <section className="glass mt-5 rounded-3xl p-4">
          <textarea className="h-28 w-full resize-none rounded-2xl bg-transparent p-3 glass" placeholder={t.paste} value={text} onChange={e => setText(e.target.value)} />
          <div className="mt-3 flex items-center justify-between gap-3">
            <p role="status" className="sub text-sm">{msg}</p>
            <button disabled={busy || !text.trim()} onClick={add} className="rounded-2xl px-5 py-2.5 font-medium text-white disabled:opacity-40" style={{ background: "var(--acc)" }}>{t.add}</button>
          </div>
        </section>
        <nav className="mt-5 flex flex-wrap gap-2">
          {(["pending", "transit", "history"] as const).map(k => (
            <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k} className={`rounded-full px-4 py-2 text-sm ${tab === k ? "text-white" : "glass"}`} style={tab === k ? { background: "var(--acc)" } : {}}>
              {k === "history" ? t.history : t[k]}{k !== "history" && ` ${list.filter(p => p.status === k).length}`}
            </button>))}
          <Link href="/ride" className="rounded-full px-4 py-2 text-sm glass">{lang === "zh" ? "微信乘车码" : "WeChat ride code"}</Link>
        </nav>
        <ul className="mt-4 space-y-3">
          {shown.length === 0 && <li className="sub glass rounded-3xl p-8 text-center">{t.empty}</li>}
          {shown.map(p => (
            <li key={p.id} className="glass flex items-center justify-between gap-3 rounded-3xl p-5">
              <div className="min-w-0">
                <p className="sub text-sm">{p.courier ?? "—"}{p.station ? ` · ${p.station}` : ""}</p>
                {p.pickup_code ? <p className="mt-1 break-all text-4xl font-semibold tabular-nums tracking-wide">{p.pickup_code}</p> : <p className="sub mt-1">{p.tracking_no}</p>}
                {p.address && <p className="sub mt-1 truncate text-sm">{p.address}</p>}
              </div>
              <div className="flex shrink-0 flex-col gap-2 text-sm">
                {p.pickup_code && <button onClick={() => copy(p.pickup_code!)} className="rounded-full px-4 py-1.5 text-white" style={{ background: "var(--acc)" }}>{copied === p.pickup_code ? t.copied : t.copy}</button>}
                <button onClick={() => del(p.id)} className="sub rounded-full px-4 py-1.5 glass">{t.del}</button>
              </div>
            </li>))}
        </ul>
        <section className="glass mt-8 rounded-3xl p-5">
          <h2 className="font-medium">{t.platforms}</h2>
          <p className="sub mt-1 text-sm">{t.unsup}</p>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm">{PLATFORMS.map(n => <li key={n} className="sub rounded-full px-3 py-1 glass">{n}</li>)}</ul>
        </section>
        <section className="glass mt-8 space-y-4 rounded-3xl p-5">
          <h2 className="font-medium">{t.settings}</h2>
          <div>
            <p className="text-sm font-medium">{t.inbound}</p>
            {me?.inboundAddress ? (<>
              <p className="sub text-sm">{t.inboundHint}</p>
              <div className="mt-2 flex items-center gap-2"><code className="min-w-0 flex-1 break-all rounded-2xl p-3 text-sm glass">{me.inboundAddress}</code>
                <button onClick={() => copy(me.inboundAddress!)} className="rounded-full px-4 py-2 text-sm text-white" style={{ background: "var(--acc)" }}>{copied === me.inboundAddress ? t.copied : t.copy}</button></div>
            </>) : <p className="sub text-sm">{t.inboundOff}</p>}
          </div>
          <div>
            <p className="text-sm font-medium text-red-500">{t.danger}</p>
            <p className="sub text-sm">{t.dangerHint}</p>
            <div className="mt-2 flex gap-2">
              <input type="password" autoComplete="current-password" className="min-w-0 flex-1 rounded-2xl bg-transparent px-4 py-2.5 glass" placeholder={t.pw} value={delPw} onChange={e => setDelPw(e.target.value)} />
              <button disabled={!delPw} onClick={delAccount} className="rounded-2xl bg-red-600 px-4 py-2.5 text-sm text-white disabled:opacity-40">{t.confirmDel}</button>
            </div>
            {msg && <p role="alert" className="mt-2 text-sm text-red-500">{msg}</p>}
          </div>
        </section>
      </>)}
      <footer className="glass mt-8 rounded-3xl p-5 text-sm">
        <b>{t.dev}: HMK</b> <span className="sub">(hmk)</span>
        <p className="mt-2 flex flex-wrap gap-4">
          <a className="underline" href="https://github.com/hmk849" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a className="underline" href="https://x.com/hmk2778?s=11" target="_blank" rel="noopener noreferrer">X</a>
          <a className="underline" href="https://v.douyin.com/Q5p9CXJcQbI/" target="_blank" rel="noopener noreferrer">抖音</a>
          <Link className="underline" href="/privacy">{lang === "zh" ? "隐私政策" : "Privacy"}</Link>
          <Link className="underline" href="/terms">{lang === "zh" ? "用户协议" : "Terms"}</Link>
        </p>
      </footer>
    </main>
  );
}

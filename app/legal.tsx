import Link from "next/link";
export function Doc({ title, children }: { title: string; children: React.ReactNode }) {
  return (<main className="mx-auto max-w-2xl px-4 py-8"><Link href="/" className="underline text-sm">← 首页 / Home</Link>
    <article className="glass mt-4 space-y-4 rounded-3xl p-6 leading-relaxed [&_h2]:mt-4 [&_h2]:font-semibold [&_ul]:list-disc [&_ul]:pl-5"><h1 className="text-2xl font-semibold">{title}</h1>{children}</article></main>);
}

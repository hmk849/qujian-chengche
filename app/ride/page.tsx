import { Doc } from "../legal";
import cities from "../../config/ride-cities.json";
export const metadata = { title: "微信乘车码 / WeChat Ride Code" };
type C = { city: string; name: string; url: string };
const ok = (u: string) => /^https:\/\//.test(u) || /^weixin:\/\//.test(u);
export default function Ride() {
  const list = (cities as C[]).filter(c => c.city && c.name && ok(c.url));
  return (<Doc title="微信乘车码 WeChat Ride Code">
    <p className="sub text-sm">乘车码在微信和当地交通服务体系内，本站无法读取。请选择城市，跳转到官方入口（需在安装微信的手机上打开）。 Tap a city to open its official entry.</p>
    {list.length === 0
      ? <p className="glass rounded-2xl p-4">尚未配置城市入口。运营者需在 <code>config/ride-cities.json</code> 中填入各城市官方乘车服务的链接。 No city entries configured yet.</p>
      : <ul className="space-y-2">{list.map(c => <li key={c.city}><a href={c.url} rel="noopener noreferrer" className="glass flex items-center justify-between rounded-2xl p-4"><span><b>{c.city}</b><span className="sub block text-sm">{c.name}</span></span><span>打开 Open</span></a></li>)}</ul>}
  </Doc>);
}

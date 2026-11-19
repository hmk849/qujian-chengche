import { Doc } from "../legal";
export const metadata = { title: "用户协议 / Terms of Service" };
export default function T() {
  return (<Doc title="用户协议 Terms of Service">
    <p className="sub text-sm">本文为草案，正式上线前请由法务或专业人士审阅。 This is a draft; have it reviewed before launch.</p>
    <h2>服务内容</h2>
    <p>本网站帮助你整理自己提供的快递通知，并提供各城市微信乘车码官方入口的跳转。识别结果由规则自动生成，可能有误，取件前请以快递方实际信息为准。</p>
    <h2>你的责任</h2>
    <ul><li>只提交属于你本人或已获授权使用的通知内容。</li><li>妥善保管账号密码，不得利用本服务从事违法活动或干扰服务运行。</li></ul>
    <h2>第三方服务</h2>
    <p>乘车码由微信及当地交通服务方提供，本站只负责跳转，不读取也不保存乘车码。第三方服务的规则以其官方说明为准。</p>
    <h2>免责与变更</h2>
    <p>服务按现状提供，我们不保证不间断或无错误。我们可能更新本协议，重大变更会在网站上提示。</p>
    <h2>终止</h2>
    <p>你可以随时在设置中删除账号。违反协议的账号可能被限制使用。</p>
  </Doc>);
}

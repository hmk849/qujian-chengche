import { Doc } from "../legal";
export const metadata = { title: "隐私政策 / Privacy Policy" };
export default function P() {
  return (<Doc title="隐私政策 Privacy Policy">
    <p className="sub text-sm">本文为草案，正式上线前请由法务或专业人士审阅，并按你所在地区的法律补充运营主体与联系方式。 This is a draft; have it reviewed before launch.</p>
    <h2>我们收集什么 What we collect</h2>
    <ul><li>账号：邮箱，以及经过 bcrypt 加密的密码（不保存明文）。</li>
      <li>快递信息：你粘贴或转发的通知原文，以及从中识别出的快递公司、取件码、驿站、地址、运单号和状态。</li>
      <li>转发邮件：发到你专属转发地址的邮件主题和正文，用于识别快递信息。</li>
      <li>会话：一个用于保持登录的 httpOnly Cookie。</li></ul>
    <h2>我们不收集 What we do not collect</h2>
    <p>不保存微信密码、支付密码、银行卡信息，也不读取你在购物平台或微信中的登录凭据和 Cookie。</p>
    <h2>用途与共享 Use and sharing</h2>
    <p>数据只用于向你本人展示和管理快递信息，按账号隔离，不出售，不用于广告。服务运行所需的云服务商（托管、数据库、收件邮件服务）会按我们的指示处理数据。</p>
    <h2>你的权利 Your rights</h2>
    <p>你可以随时删除单条快递记录，也可以在“设置”中输入密码删除账号，账号和全部快递数据会一并永久删除。</p>
    <h2>联系 Contact</h2>
    <p>开发者 HMK：<a className="underline" href="https://github.com/hmk849" target="_blank" rel="noopener noreferrer">github.com/hmk849</a></p>
  </Doc>);
}

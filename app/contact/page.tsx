import Image from "next/image";

export default function ContactPage() {
  const wechatId = process.env.WECHAT_ID || "your_wechat_id";
  const xianshangUrl = process.env.XIANSHANG_URL || "#";
  const xhsUrl = process.env.XHS_URL || "#";

  // 二维码图片文件名(支持 png / jpg,优先 png)
  const qrSrc = "/wechat-qr.png";

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <h1 className="text-3xl font-bold mb-4">需要定制 AI 工具?</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          我是程序员本人接单,不是工作室转包。
          <br />
          能做:Python 自动化 / Coze AI Agent / 完整工作流方案
          <br />
          价格档:¥39 入门 / ¥199 标准 / ¥599 进阶
          <br />
          先聊需求再报价,不接灰产,不接 unrealistic 需求。
        </p>

        <div className="my-10">
          <div className="inline-block p-4 rounded-xl bg-white border border-white/10">
            <Image
              src={qrSrc}
              alt="微信二维码"
              width={192}
              height={192}
              className="rounded-lg"
            />
            <p className="mt-3 text-sm text-gray-700">
              微信号:<span className="font-mono text-black">{wechatId}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href={xianshangUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-brand-gradient text-white text-sm font-medium hover:opacity-90 transition"
          >
            闲鱼店铺 →
          </a>
          <a
            href={xhsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
          >
            小红书主页 →
          </a>
        </div>
      </div>
    </div>
  );
}

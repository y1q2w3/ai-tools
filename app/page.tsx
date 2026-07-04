import ToolCard from "@/components/ToolCard";

const tools = [
  {
    href: "/tool/batch-copy",
    emoji: "✍️",
    title: "批量文案生成器",
    desc: "丢进去 100 个产品名,1 分钟生成 100 条小红书文案。原来写 3 小时,现在 3 分钟。",
    tags: ["文案", "GLM", "批量"],
  },
  {
    href: "/tool/data-clean",
    emoji: "🧹",
    title: "数据清洗器",
    desc: "上传 CSV,自动去重 / 补全 / 标准化。财务和运营姐妹狂喜。",
    tags: ["Excel", "CSV", "数据"],
  },
  {
    href: "/tool/web-extract",
    emoji: "🕷️",
    title: "网页内容提取器",
    desc: "输入网址,自动抓标题 / 正文 / 关键词。做竞品分析的救星。",
    tags: ["爬虫", "网页", "提取"],
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 -z-10 bg-brand-gradient opacity-20 blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.15),_transparent_60%)]" />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
          🤖 程序员本人接单 · 工具站即作品集
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI 工具,免费开放
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
          用 Cursor + 智谱 GLM 撸的几个 AI 小工具,自己天天在用,索性免费开放。
          不用登录,不用看广告,放心用。
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <a
            href="#tools"
            className="px-6 py-3 rounded-lg bg-brand-gradient text-white font-medium hover:opacity-90 transition"
          >
            开始使用
          </a>
          <a
            href="/contact"
            className="px-6 py-3 rounded-lg border border-white/10 bg-white/5 text-gray-200 font-medium hover:bg-white/10 transition"
          >
            定制 AI 工具 →
          </a>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((t) => (
            <ToolCard key={t.href} {...t} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10">
          <h2 className="text-2xl font-bold mb-3">需要定制 AI 工具?</h2>
          <p className="text-gray-400 mb-6">
            程序员本人接单,不是工作室转包。能做 Python 自动化、AI Agent、完整工作流方案。
            价格档 ¥39 / ¥199 / ¥599,先聊需求再报价。
          </p>
          <a
            href="/contact"
            className="inline-block px-6 py-3 rounded-lg bg-brand-gradient text-white font-medium hover:opacity-90 transition"
          >
            查看联系方式 →
          </a>
        </div>
      </section>
    </div>
  );
}

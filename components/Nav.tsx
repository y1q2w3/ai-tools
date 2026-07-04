import Link from "next/link";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="text-xl">🤖</span>
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI 工具站
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
          <Link href="/tool/batch-copy" className="hover:text-white transition">
            批量文案
          </Link>
          <Link href="/tool/data-clean" className="hover:text-white transition">
            数据清洗
          </Link>
          <Link href="/tool/web-extract" className="hover:text-white transition">
            网页提取
          </Link>
        </div>
        <Link
          href="/contact"
          className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition"
        >
          联系我
        </Link>
      </div>
    </nav>
  );
}

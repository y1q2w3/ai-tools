export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-gray-500 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <p>© 2026 AI 工具站 · 程序员本人维护</p>
          <p className="mt-1">工具完全免费,定制需求请走联系方式</p>
        </div>
        <div className="flex gap-6">
          <a href="/contact" className="hover:text-white transition">
            联系我
          </a>
          <a
            href="https://github.com/yourname/ai-tools"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

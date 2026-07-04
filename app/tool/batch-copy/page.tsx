"use client";

import { useState } from "react";

type Result = {
  product: string;
  copy: string;
};

const STYLES = [
  { id: "xhs", label: "小红书种草", prompt: "小红书种草风,带 emoji 和 hashtag,3-5 行" },
  { id: "gzh", label: "公众号", prompt: "公众号推文风,标题党 + 引发共鸣" },
  { id: "shop", label: "电商详情", prompt: "电商商品详情文案,突出卖点 + 促单" },
  { id: "video", label: "短视频口播", prompt: "短视频口播稿,15 秒内,带钩子" },
];

export default function BatchCopyPage() {
  const [products, setProducts] = useState("");
  const [styleId, setStyleId] = useState("xhs");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    const list = products
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);

    if (list.length === 0) {
      setError("请输入至少 1 个产品名,每行一个");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);

    try {
      const style = STYLES.find((s) => s.id === styleId)!;
      const res = await fetch("/api/batch-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: list, stylePrompt: style.prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "生成失败");
      setResults(data.results);
    } catch (e: any) {
      setError(e?.message ?? "生成失败");
    } finally {
      setLoading(false);
    }
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3">✍️ 批量文案生成器</h1>
        <p className="text-gray-400">
          每行输入一个产品名(最多 20 个),选择文案风格,1 分钟批量生成。
        </p>
      </header>

      <div className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            产品名(每行一个)
          </label>
          <textarea
            value={products}
            onChange={(e) => setProducts(e.target.value)}
            rows={6}
            placeholder={"iPhone 15 Pro\n戴森吹风机\nSK-II 神仙水"}
            className="w-full rounded-lg bg-white/5 border border-white/10 p-3 outline-none focus:border-indigo-500 transition resize-y font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">文案风格</label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyleId(s.id)}
                className={`px-4 py-2 rounded-lg text-sm border transition ${
                  styleId === s.id
                    ? "bg-brand-gradient border-transparent text-white"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-brand-gradient text-white font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "生成中..." : "生成文案"}
        </button>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-semibold">生成结果({results.length} 条)</h2>
            {results.map((r, i) => (
              <div
                key={i}
                className="rounded-lg bg-white/5 border border-white/10 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-indigo-400 font-mono">
                    {r.product}
                  </span>
                  <button
                    onClick={() => copyText(r.copy)}
                    className="text-xs px-3 py-1 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition"
                  >
                    复制
                  </button>
                </div>
                <p className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {r.copy}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

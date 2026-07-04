"use client";

import { useState } from "react";

type Extracted = {
  title?: string;
  content?: string;
  publishTime?: string;
  keywords?: string[];
};

export default function WebExtractPage() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<Extracted | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExtract() {
    if (!url.trim()) {
      setError("请输入网址");
      return;
    }
    setError("");
    setLoading(true);
    setData(null);

    try {
      const res = await fetch("/api/web-extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "提取失败");
      setData(json.data);
    } catch (e: any) {
      setError(e?.message ?? "提取失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-3">🕷️ 网页内容提取器</h1>
        <p className="text-gray-400">
          输入网址,自动提取标题 / 正文 / 发布时间 / 关键词。
        </p>
      </header>

      <div className="space-y-5">
        <div>
          <label className="block text-sm text-gray-400 mb-2">网址 URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article/123"
            className="w-full rounded-lg bg-white/5 border border-white/10 p-3 outline-none focus:border-indigo-500 transition font-mono text-sm"
          />
        </div>

        <button
          onClick={handleExtract}
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-brand-gradient text-white font-medium hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "提取中..." : "提取内容"}
        </button>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-4 pt-4">
            {data.title && (
              <div>
                <div className="text-xs text-gray-500 mb-1">标题</div>
                <div className="text-lg font-semibold">{data.title}</div>
              </div>
            )}
            {data.publishTime && (
              <div>
                <div className="text-xs text-gray-500 mb-1">发布时间</div>
                <div className="text-sm">{data.publishTime}</div>
              </div>
            )}
            {data.keywords && data.keywords.length > 0 && (
              <div>
                <div className="text-xs text-gray-500 mb-1">关键词</div>
                <div className="flex flex-wrap gap-2">
                  {data.keywords.map((k) => (
                    <span
                      key={k}
                      className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.content && (
              <div>
                <div className="text-xs text-gray-500 mb-1">正文</div>
                <div className="rounded-lg bg-white/5 border border-white/10 p-4 text-sm text-gray-200 whitespace-pre-wrap max-h-96 overflow-y-auto leading-relaxed">
                  {data.content}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

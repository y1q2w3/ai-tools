import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

function stripHtml(html: string): { title: string; body: string } {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  // 去掉 script/style
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  // 优先取 article/main 正文
  const mainMatch =
    cleaned.match(/<article[\s\S]*?<\/article>/i) ||
    cleaned.match(/<main[\s\S]*?<\/main>/i);
  if (mainMatch) cleaned = mainMatch[0];

  // 去 tag
  const body = cleaned
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .join("\n");

  return { title, body };
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "url 必填" }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `抓取失败: HTTP ${res.status}` },
        { status: 502 }
      );
    }

    const html = await res.text();
    const { title, body } = stripHtml(html);

    // 用 AI 提取关键词 + 发布时间 + 精炼正文
    const aiPrompt = `下面是从网页提取的标题和正文,请返回 JSON:
{
  "title": "网页标题(已提取的话用已有的,没有的话从正文推断)",
  "publishTime": "发布时间(找不到就返回空字符串)",
  "keywords": ["5-8 个关键词"],
  "content": "精炼后的正文,保留主要信息,去掉导航/广告/版权声明"
}

标题: ${title}
正文(前 4000 字):
${body.slice(0, 4000)}

只返回 JSON,不要其他内容。`;

    const aiText = await generateText(aiPrompt, {
      temperature: 0.3,
      maxTokens: 2000,
    });

    let parsed: any = { title, content: body };
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch {
      // 解析失败用原始提取
    }

    return NextResponse.json({
      data: {
        title: parsed.title || title,
        content: parsed.content || body,
        publishTime: parsed.publishTime || "",
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : [],
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "提取失败" },
      { status: 500 }
    );
  }
}

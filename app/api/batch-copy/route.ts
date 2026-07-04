import { NextRequest, NextResponse } from "next/server";
import { batchGenerateText } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { products, stylePrompt } = await req.json();
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "products 必填" }, { status: 400 });
    }
    if (products.length > 20) {
      return NextResponse.json(
        { error: "单次最多 20 个产品" },
        { status: 400 }
      );
    }

    const prompts = products.map(
      (p: string) =>
        `产品名:${p}\n请为这个产品写一段${stylePrompt}。直接输出文案,不要解释。`
    );

    const copies = await batchGenerateText(prompts, {
      temperature: 0.8,
      maxTokens: 500,
    });

    const results = products.map((p: string, i: number) => ({
      product: p,
      copy: copies[i],
    }));

    return NextResponse.json({ results });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "生成失败" },
      { status: 500 }
    );
  }
}

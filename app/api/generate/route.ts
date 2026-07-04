import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { prompt, options } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "prompt 必填" }, { status: 400 });
    }
    const text = await generateText(prompt, options || {});
    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "生成失败" },
      { status: 500 }
    );
  }
}

// 智谱 GLM API 封装(OpenAI 兼容协议)
// 文档: https://open.bigmodel.cn/dev/api

const BASE_URL = "https://open.bigmodel.cn/api/paas/v4";
const API_KEY = process.env.ZHIPU_API_KEY;

export type GenerateOptions = {
  temperature?: number;
  maxTokens?: number;
  model?: string;
};

export async function generateText(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  const {
    temperature = 0.7,
    maxTokens = 2048,
    model = "glm-4.6",
  } = options;

  if (!API_KEY) {
    throw new Error(
      "缺少 ZHIPU_API_KEY 环境变量,请到 https://open.bigmodel.cn/ 注册并填入 .env"
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GLM API ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content ?? "";
  } finally {
    clearTimeout(timeout);
  }
}

// 并行批量生成,带并发限制
export async function batchGenerateText(
  prompts: string[],
  options: GenerateOptions = {},
  concurrency = 5
): Promise<string[]> {
  const results: string[] = new Array(prompts.length);
  let cursor = 0;

  async function worker() {
    while (cursor < prompts.length) {
      const i = cursor++;
      try {
        results[i] = await generateText(prompts[i], options);
      } catch (e: any) {
        results[i] = `生成失败: ${e?.message ?? "unknown"}`;
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, prompts.length) }, () => worker())
  );
  return results;
}

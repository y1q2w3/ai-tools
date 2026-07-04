# AI 工具站

程序员副业 MVP,做 AI 工具站当接单背书 + 长期资产。

## 快速启动

```bash
# 1. 复制环境变量文件,填入你的智谱 API Key
cp .env.example .env
# 然后编辑 .env,把 ZHIPU_API_KEY 改成你真实的 key

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

打开 http://localhost:3000

## 部署到 Vercel(免费)

```bash
# 1. 推到 GitHub
git init
git add .
git commit -m "init: ai tools mvp"
git remote add origin https://github.com/你的用户名/ai-tools.git
git branch -M main
git push -u origin main

# 2. 去 https://vercel.com/ 用 GitHub 登录
# 3. New Project → Import 你的 ai-tools 仓库
# 4. Environment Variables 里加:
#    ZHIPU_API_KEY = 你的 key
# 5. Deploy
```

## 工具列表

- `/tool/batch-copy` 批量文案生成器
- `/tool/data-clean` 数据清洗器
- `/tool/web-extract` 网页内容提取器
- `/contact` 联系方式

## 技术栈

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- 智谱 GLM-4.6 API(OpenAI 兼容协议)

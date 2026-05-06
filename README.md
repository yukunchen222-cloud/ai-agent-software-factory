# 企业级 AI Agent 软件生成助手

这是一个 Next.js + TypeScript + Tailwind CSS 的 Web SaaS MVP 骨架。

当前版本只做静态前端演示：用户填写软件想法后，页面展示 12 个模拟生成模块。项目没有连接 Supabase、OpenAI API、支付、部署或应用商店上架能力。

## 本地启动

```bash
npm install
npm run dev
```

浏览器打开：

```text
http://localhost:3000
```

## 可用命令

```bash
npm run lint
npm run build
```

## 当前功能

- 中文首页 / 工作台页面
- 软件想法输入表单
- 目标行业、目标用户、预算范围、移动端、应用商店上架选项
- 点击按钮后展示 12 个模拟生成模块
- 企业级 SaaS 风格基础界面

## 当前未做

- 未连接 Supabase
- 未连接 OpenAI API
- 未接入真实支付
- 未部署到 Vercel
- 未提交任何应用商店审核
- 未写入任何真实 API Key

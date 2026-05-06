# 企业级 AI Agent / 程序交付工厂

这是一个 Next.js + TypeScript + Tailwind CSS 的本地 Web MVP，用来辅助制作客户指定功能的 Agent 或程序交付包。

当前版本只做本地模拟交付 Agent：输入客户需求后，页面会生成 Agent 执行链路、交付成熟度、风险提示和 12 个交付模块。项目没有连接 Supabase、OpenAI API、支付、部署或应用商店上架能力。

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

- 客户项目需求表
- 本地模拟交付 Agent 引擎
- Agent 执行链路展示
- 交付成熟度判断
- 风险提示
- 浏览器本地项目历史
- 一键复制 Markdown 交付包
- 12 个交付模块：
  - 客户需求摘要
  - 最终产品定义
  - 功能范围
  - Agent 能力设计
  - 页面 / 操作流程
  - 数据结构
  - API / 自动化接口
  - 技术选型
  - 开发任务
  - 测试验收清单
  - 部署与上架清单
  - 后续迭代路线

## 当前未做

- 未下载或接入任何第三方开源项目
- 未连接 Supabase
- 未连接 OpenAI API
- 未接入真实支付
- 未部署到 Vercel
- 未提交任何应用商店审核
- 未写入任何真实 API Key
- 未执行数据库迁移或删除用户数据

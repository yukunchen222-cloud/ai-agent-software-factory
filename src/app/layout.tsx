import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "企业级 AI Agent 软件生成助手",
  description: "一个用于生成软件产品方案、研发任务和上线准备材料的 Web SaaS MVP。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
